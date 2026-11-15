/* The agent's shipment, and its bridge to the booking form's data model.
   toBooking() is how the agent reuses the form's own validation, and how it hands a shipment
   over to the manual form without losing anything the user already gave. */

import { AIRPORTS, FILLED, airport, totalKg, volumetricKg } from "../proto/data.ts";
import type { Booking, DocId } from "../proto/data.ts";
import type { Constraints, Shipment, ShipmentKey } from "./types.ts";

export const LABELS: Record<ShipmentKey | keyof Constraints, string> = {
  cargoType: "Cargo type",
  description: "Cargo description",
  pieces: "Number of pieces",
  weightPerPiece: "Weight per piece",
  totalWeight: "Total weight",
  weightUnit: "Weight unit",
  dims: "Dimensions per piece",
  dimUnit: "Dimension unit",
  handling: "Handling requirements",
  originAirport: "Origin airport",
  destAirport: "Destination airport",
  pickupDate: "Pickup date",
  pickupTime: "Pickup time",
  pickupAddress: "Pickup address",
  originPostal: "Origin postal code",
  deliveryAddress: "Delivery address",
  destPostal: "Destination postal code",
  docs: "Documents",
  deadline: "Delivery deadline",
  budgetUsd: "Budget",
  priority: "Priority",
};

/** What the agent needs before it can search for flights */
export const NEEDED_TO_SEARCH: ShipmentKey[] = ["cargoType", "pieces", "weightPerPiece", "dims", "originAirport", "destAirport", "pickupDate"];
/** And before it can prepare a booking proposal */
export const NEEDED_TO_PROPOSE: ShipmentKey[] = ["description", "pickupTime", "pickupAddress", "originPostal", "deliveryAddress", "destPostal"];

export const missing = (s: Shipment, keys: ShipmentKey[]) => keys.filter((k) => s[k] === undefined || s[k]!.value === "" || s[k]!.value === null);

const EMPTY_DOCS: Record<DocId, null> = { invoice: null, packing: null, health: null, origin: null };

/** The shipment as the booking form's data. Unknown fields stay empty: nothing is invented. */
export function toBooking(s: Shipment): Booking {
  const o = s.originAirport ? airport(s.originAirport.value) : undefined;
  const d = s.destAirport ? airport(s.destAirport.value) : undefined;
  return {
    ...FILLED,
    cargoType: s.cargoType?.value ?? "",
    description: s.description?.value ?? "",
    pieces: s.pieces ? String(s.pieces.value) : "",
    weight: s.weightPerPiece ? String(s.weightPerPiece.value) : "",
    weightUnit: s.weightUnit?.value ?? "kg",
    height: s.dims ? String(s.dims.value.h) : "",
    width: s.dims ? String(s.dims.value.w) : "",
    length: s.dims ? String(s.dims.value.l) : "",
    dimUnit: s.dimUnit?.value ?? "cm",
    handling: s.handling?.value ?? [],
    instructions: "",
    originCountry: o?.country ?? "",
    originAirport: o?.code ?? "",
    pickupAddress: s.pickupAddress?.value ?? "",
    originPostal: s.originPostal?.value ?? "",
    destCountry: d?.country ?? "",
    destAirport: d?.code ?? "",
    deliveryAddress: s.deliveryAddress?.value ?? "",
    destPostal: s.destPostal?.value ?? "",
    pickupDate: s.pickupDate?.value ?? "",
    pickupTime: s.pickupTime?.value ?? "",
    docs: { ...EMPTY_DOCS, ...(s.docs?.value ?? {}) },
    accepted: false,
  };
}

/** The data the form gets on "Continue in the form" or a specialist hand-off: every known field, nothing guessed */
export function handoffBooking(s: Shipment): Partial<Booking> {
  const b = toBooking(s);
  const out: Partial<Booking> = {};
  for (const [k, v] of Object.entries(b) as [keyof Booking, Booking[keyof Booking]][]) {
    if (k === "accepted") continue;
    if (v === "" || (Array.isArray(v) && !v.length)) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  // Units only travel with the values they describe
  if (!s.weightPerPiece) delete out.weightUnit;
  if (!s.dims) delete out.dimUnit;
  return out;
}

export function chargeableKg(s: Shipment) {
  const b = toBooking(s);
  return Math.max(totalKg(b), volumetricKg(b));
}

export const airportsIn = (city: string) => AIRPORTS.filter((a) => a.city.toLowerCase() === city.toLowerCase());
