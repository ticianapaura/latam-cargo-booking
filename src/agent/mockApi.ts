/* A deterministic mock of a carrier's booking API. Everything it returns is synthetic.
   The same route and date always give the same flights; prices follow the app's own tariff.
   Faults can be injected to rehearse every recovery path. */

import { airport } from "../proto/data.ts";
import type { BookingLedger } from "./ledger.ts";
import { chargeableKg } from "./shipment.ts";
import type { BookingRecord, Flight, Quote, Shipment } from "./types.ts";
import type { Clock } from "./util.ts";
import { DAY, HOUR, MIN, hash, iso, round2, seeded } from "./util.ts";

export type Faults = {
  /** The next N searches fail (network or server error) */
  searchFailures?: number;
  rateFailures?: number;
  /** No flights on this route and date */
  noFlights?: boolean;
  /** Prices on the next re-quote at confirmation go up by this percentage */
  priceIncreasePct?: number;
  /** The next confirmation finds the flight's space gone */
  expireBeforeConfirm?: boolean;
  /** The next N confirmations fail cleanly (nothing booked) */
  confirmFailures?: number;
  /** The next confirmation times out; "booked" means it actually went through on the carrier's side */
  confirmTimeout?: "booked" | "not_booked";
  statusFailures?: number;
};

export class ApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

/* Each service departs at a fixed time of day, from the first day it can carry the cargo:
   Express the first day, Standard a day later, Economy two days later with one connection. */
const SERVICES = [
  { service: "Express" as const, dayOffset: 0, depart: 18 * 60 + 40, stops: 0, factor: 1.35, cap: 900 },
  { service: "Standard" as const, dayOffset: 1, depart: 9 * 60 + 15, stops: 0, factor: 1.0, cap: 1800 },
  { service: "Economy" as const, dayOffset: 2, depart: 22 * 60 + 5, stops: 1, factor: 0.82, cap: 3000 },
];

/** Approximate airport positions, for flight times that follow the distance */
const COORDS: Record<string, [number, number]> = {
  EZE: [-34.82, -58.54], AEP: [-34.56, -58.42], COR: [-31.32, -64.21], MDZ: [-32.83, -68.79], GRU: [-23.43, -46.47],
  VCP: [-23.01, -47.13], GIG: [-22.81, -43.25], SCL: [-33.39, -70.79], LIM: [-12.02, -77.11], MIA: [25.79, -80.29],
};
export const HANDLING_HOURS = 3; // from pickup to the earliest departure: road leg, acceptance and security
export const DELIVERY_HOURS = 4; // from landing to delivery at the address
const CONNECTION_HOURS = 3;

function airHours(a: string, b: string) {
  const [la1, lo1] = COORDS[a].map((x) => (x * Math.PI) / 180);
  const [la2, lo2] = COORDS[b].map((x) => (x * Math.PI) / 180);
  const km = 6371 * 2 * Math.asin(Math.sqrt(Math.sin((la2 - la1) / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2));
  return Math.round((km / 780 + 0.5) * 4) / 4; // cruise ~780 km/h plus taxi and climb, to the quarter hour
}

export class MockCarrierApi {
  faults: Faults;
  private clock: Clock;
  private ledger: BookingLedger;
  private quoted = new Set<string>();

  constructor(clock: Clock, ledger: BookingLedger, faults: Faults = {}) {
    this.clock = clock;
    this.ledger = ledger;
    this.faults = { ...faults };
  }

  /** Flights from the first departure at or after `earliest` (pickup time plus handling) */
  search(origin: string, dest: string, fromDate: string, kg: number, earliest = `${fromDate}T06:00:00Z`): Flight[] {
    if (this.take("searchFailures")) throw new ApiError("SEARCH_UNAVAILABLE", "The flight search didn't answer.");
    if (this.faults.noFlights) return [];
    if (!airport(origin) || !airport(dest)) throw new ApiError("BAD_INPUT", "Unknown airport.");
    const rnd = seeded(`${origin}-${dest}-${fromDate}`);
    const base = Date.parse(`${fromDate}T00:00:00Z`);
    const ready = Date.parse(earliest) + HANDLING_HOURS * HOUR;
    const until = iso(this.clock.now() + 30 * MIN);
    return SERVICES.map((s) => {
      let departs = base + s.dayOffset * DAY + s.depart * MIN + Math.floor(rnd() * 4) * 5 * MIN;
      while (departs < ready) departs += DAY; // never before the cargo can be at the airport
      const flight = airHours(origin, dest) + (s.stops ? CONNECTION_HOURS + 0.75 : 0);
      const arrives = departs + flight * HOUR;
      const deliveredBy = arrives + DELIVERY_HOURS * HOUR;
      return {
        id: `F-${hash(`${origin}${dest}${iso(departs)}${s.service}`)}`,
        flightNo: `CP${8000 + Math.floor(rnd() * 900) + s.dayOffset}`,
        origin,
        dest,
        departs: iso(departs),
        arrives: iso(arrives),
        deliveredBy: iso(deliveredBy),
        transitHours: Math.round((deliveredBy - departs) / HOUR),
        flightHours: flight,
        stops: s.stops,
        service: s.service,
        capacityKg: s.cap,
        availableUntil: until,
        synthetic: true as const,
      };
    }).filter((f) => f.capacityKg >= kg);
  }

  rates(flights: Flight[], shipment: Shipment, opts: { requote?: boolean } = {}): Quote[] {
    if (this.take("rateFailures")) throw new ApiError("RATES_UNAVAILABLE", "The rate service didn't answer.");
    const kg = chargeableKg(shipment);
    const cargo = shipment.cargoType?.value ?? "";
    const bump = opts.requote && this.faults.priceIncreasePct ? 1 + this.faults.priceIncreasePct / 100 : 1;
    if (opts.requote && this.faults.priceIncreasePct) this.faults.priceIncreasePct = 0; // once
    return flights.map((f) => {
      const factor = SERVICES.find((s) => s.service === f.service)!.factor;
      const freight = round2(kg * 2.6 * factor * bump);
      const lines = [
        { label: `Freight, ${f.service.toLowerCase()} (${kg} kg × USD ${round2(2.6 * factor * bump).toFixed(2)})`, amount: freight },
        ...(["Perishables", "Pharmaceuticals"].includes(cargo) ? [{ label: `${cargo} surcharge (15% of freight)`, amount: round2(freight * 0.15) }] : []),
        { label: `Fuel (${kg} kg × USD 0.45)`, amount: round2(kg * 0.45) },
        { label: `Security (${kg} kg × USD 0.15)`, amount: round2(kg * 0.15) },
      ];
      this.quoted.add(f.id);
      return {
        id: `Q-${hash(`${f.id}-${kg}-${cargo}-${bump}`)}`,
        flightId: f.id,
        currency: "USD" as const,
        chargeableKg: kg,
        lines,
        total: round2(lines.reduce((t, l) => t + l.amount, 0)),
        validUntil: iso(this.clock.now() + 15 * MIN),
        synthetic: true as const,
      };
    });
  }

  /** Books once per idempotency key. Can fail, time out, find the space gone or the price changed. */
  confirm(input: { idempotencyKey: string; proposalId: string; version: number; flight: Flight; quote: Quote; shipment: Shipment }):
    | { ok: true; booking: BookingRecord }
    | { ok: false; code: "BOOKING_FAILED" | "UNAVAILABLE" | "PRICE_CHANGED" | "TIMEOUT"; newQuote?: Quote } {
    const existing = this.ledger.get(input.idempotencyKey);
    if (existing) return { ok: true, booking: existing };
    if (this.take("confirmFailures")) return { ok: false, code: "BOOKING_FAILED" };
    if (this.faults.expireBeforeConfirm) {
      this.faults.expireBeforeConfirm = false;
      return { ok: false, code: "UNAVAILABLE" };
    }
    if (this.faults.priceIncreasePct) {
      const [newQuote] = this.rates([input.flight], input.shipment, { requote: true });
      return { ok: false, code: "PRICE_CHANGED", newQuote };
    }
    const create = () =>
      this.ledger.create({
        idempotencyKey: input.idempotencyKey,
        proposalId: input.proposalId,
        version: input.version,
        total: input.quote.total,
        flightNo: input.flight.flightNo,
        createdAt: iso(this.clock.now()),
      });
    if (this.faults.confirmTimeout) {
      const booked = this.faults.confirmTimeout === "booked";
      this.faults.confirmTimeout = undefined;
      if (booked) create(); // it went through, but the answer never arrived
      return { ok: false, code: "TIMEOUT" };
    }
    return { ok: true, booking: create() };
  }

  status(idempotencyKey: string): BookingRecord | null {
    if (this.take("statusFailures")) throw new ApiError("STATUS_UNAVAILABLE", "The booking status service didn't answer.");
    return this.ledger.get(idempotencyKey);
  }

  private take(k: "searchFailures" | "rateFailures" | "confirmFailures" | "statusFailures") {
    const n = this.faults[k] ?? 0;
    if (n > 0) {
      this.faults[k] = n - 1;
      return true;
    }
    return false;
  }
}
