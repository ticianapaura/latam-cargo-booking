/* Policy: the only place that decides what the agent may do.
   Two separate lists, on purpose:
   - HARD restrictions block a booking for everyone, the Manager included. Only a changed shipment clears them.
     There is no function anywhere that approves or overrides one.
   - COMMERCIAL exceptions (budget, deadline) can be approved, by the role named on each.
   Autonomy levels are enforced here, not in the copy:
   L3 tools run on their own; confirmBooking (L2) needs a current approval for the exact proposal. */

import { DOCS, PICKUP_TIMES, TODAY, airport } from "../proto/data.ts";
import { toBooking } from "./shipment.ts";
import type { AgentState, Exception, Option, Proposal, Restriction, Role, Shipment, ToolName } from "./types.ts";
import { hash, stable } from "./util.ts";

export const TOOL_LEVEL: Record<ToolName, "L3" | "L2"> = {
  validateShipment: "L3",
  checkCargoRestrictions: "L3",
  searchAvailableFlights: "L3",
  retrieveFreightRates: "L3",
  compareShippingOptions: "L3",
  prepareBookingDraft: "L3",
  getBookingStatus: "L3",
  confirmBooking: "L2",
};

/** Cargo the agent hands over to the manual form: these need a specialist's handling, not an autonomous flow */
export const SPECIALIST_CARGO = ["Dangerous goods", "Live animals"];

const v = <T>(f: { value: T } | undefined) => f?.value;

/** Hard restrictions, evaluated on whatever the shipment has so far. Same limits as the booking form. */
export function hardRestrictions(s: Shipment): Restriction[] {
  const out: Restriction[] = [];
  const cargo = v(s.cargoType);
  if (cargo && SPECIALIST_CARGO.includes(cargo)) {
    out.push({
      code: "SPECIALIST_CARGO",
      kind: "specialist",
      text:
        cargo === "Dangerous goods"
          ? "Dangerous goods need a declaration, packing checks and acceptance by a trained specialist. The agent can't take those decisions, so this booking continues in the form."
          : "Live animals need welfare checks, container rules and a specialist's acceptance. The agent can't take those decisions, so this booking continues in the form.",
      fix: "Continue in the form: everything you've given so far goes with you.",
    });
  }
  const kgPerPiece = (v(s.weightPerPiece) ?? 0) * (v(s.weightUnit) === "lb" ? 0.4536 : 1);
  if (kgPerPiece > 1000) out.push({ code: "PIECE_TOO_HEAVY", kind: "hard", text: `Each piece weighs ${Math.round(kgPerPiece)} kg; the limit is 1,000 kg per piece.`, fix: "Split the cargo into more pieces." });
  const dims = v(s.dims);
  const cm = v(s.dimUnit) === "in" ? 2.54 : 1;
  if (dims && dims.h * cm > 244) out.push({ code: "PIECE_TOO_TALL", kind: "hard", text: `Each piece is ${Math.round(dims.h * cm)} cm tall; the hold door allows 244 cm.`, fix: "Lower the height or split the cargo." });
  const handling = v(s.handling) ?? [];
  if (handling.includes("Chilled 2–8 °C") && handling.includes("Frozen −18 °C"))
    out.push({ code: "TWO_TEMPERATURES", kind: "hard", text: "Chilled and Frozen together: the cargo can only travel at one temperature.", fix: "Choose Chilled or Frozen." });
  const o = airport(v(s.originAirport) ?? "");
  const d = airport(v(s.destAirport) ?? "");
  if (o && d && o.code === d.code) out.push({ code: "SAME_AIRPORT", kind: "hard", text: "Origin and destination are the same airport.", fix: "Choose another destination." });
  if (o && d && o.country !== d.country) {
    for (const [a, field] of [[o, "originAirport"], [d, "destAirport"]] as const) {
      if (!a.international) {
        const alt = (field === "originAirport" ? ["EZE", "COR"] : ["EZE", "COR"]).find((c) => airport(c)?.country === a.country && airport(c)?.international);
        out.push({
          code: "DOMESTIC_ONLY_AIRPORT",
          kind: "hard",
          text: `${a.city} (${a.code}) handles domestic cargo only, and this route is international.`,
          fix: alt ? `Use ${alt} instead.` : "Choose an international airport.",
          suggestion: alt ? { field, value: alt, label: `Use ${alt}` } : undefined,
        });
      }
    }
  }
  const date = v(s.pickupDate);
  if (date && date < TODAY) out.push({ code: "PICKUP_IN_PAST", kind: "hard", text: `The pickup date (${date}) is earlier than today.`, fix: "Choose today or a later date." });
  const time = v(s.pickupTime);
  if (time && !PICKUP_TIMES.includes(time)) out.push({ code: "PICKUP_HOURS", kind: "hard", text: "Pickups run between 6 AM and 10 PM.", fix: "Choose a time in that window." });
  return out;
}

/** Documents the cargo type requires. Missing ones allow a draft but block confirming. */
export function missingDocuments(s: Shipment): Restriction[] {
  const docs = toBooking(s).docs;
  return DOCS.filter((d) => !d.optional && (!docs[d.id] || docs[d.id]!.error)).map((d) => ({
    code: `DOC_${d.id.toUpperCase()}`,
    kind: "documents" as const,
    text: `${d.name} isn't attached yet.`,
    fix: "Attach it before confirming. The draft can be prepared without it.",
  }));
}

/** Commercial exceptions for one option: the only things an approval can clear */
export function commercialExceptions(o: Pick<Option, "flight" | "quote">, budgetUsd?: number, deadline?: string): Exception[] {
  const out: Exception[] = [];
  if (budgetUsd !== undefined && o.quote.total > budgetUsd)
    out.push({
      id: `EX-budget-${o.flight.id}`,
      kind: "budget",
      approver: "manager",
      text: `USD ${o.quote.total.toFixed(2)} is USD ${(o.quote.total - budgetUsd).toFixed(2)} over the USD ${budgetUsd.toFixed(2)} budget.`,
    });
  if (deadline && o.flight.arrives > deadline)
    out.push({ id: `EX-deadline-${o.flight.id}`, kind: "deadline", approver: "coordinator", text: `Arrives ${o.flight.arrives.slice(0, 16).replace("T", " ")}, after the deadline.` });
  return out;
}

/** Everything the user approves, hashed. Left out: quote expiry (a re-quote at the same price keeps the approval)
    and documents, which are a precondition checked again at confirmation, not a term of the deal. */
export function termsHash(p: Omit<Proposal, "termsHash" | "createdAt" | "changes" | "id" | "version">) {
  const s = p.shipment;
  const terms = {
    shipment: Object.fromEntries(Object.entries(s).filter(([k]) => k !== "totalWeight" && k !== "docs").map(([k, f]) => [k, (f as { value: unknown }).value])),
    flight: p.option.flight.flightNo + p.option.flight.departs,
    total: p.option.quote.total,
    currency: p.option.quote.currency,
    lines: p.option.quote.lines,
    exceptions: p.option.exceptions.map((e) => e.id),
    conditions: p.conditions,
  };
  return hash(stable(terms));
}

export type Decision = { ok: true } | { ok: false; reason: string; code: string };

/** Can this tool run now? Checked by the tool runner before every call, whatever the planner wanted. */
export function authorize(tool: ToolName, st: AgentState, now: string): Decision {
  if (TOOL_LEVEL[tool] === "L3") return { ok: true };
  // confirmBooking (L2) from here on
  const p = st.proposal;
  if (!p) return { ok: false, code: "NO_PROPOSAL", reason: "There's no booking proposal to confirm." };
  const hard = hardRestrictions(p.shipment);
  if (hard.length) return { ok: false, code: "HARD_RESTRICTION", reason: `Blocked by a hard restriction: ${hard[0].text} No approval can clear it.` };
  const docs = missingDocuments(p.shipment);
  if (docs.length) return { ok: false, code: "DOCUMENTS_MISSING", reason: docs.map((d) => d.text).join(" ") };
  if (p.termsHash !== termsHash(p)) return { ok: false, code: "TAMPERED", reason: "The proposal doesn't match its terms; it has to be prepared again." };
  const booking = currentApproval(st, "booking");
  if (!booking) return { ok: false, code: "NOT_APPROVED", reason: "The user hasn't approved this exact proposal (version and terms)." };
  for (const ex of p.option.exceptions) {
    if (!currentApproval(st, "exception", ex.id, ex.approver))
      return { ok: false, code: "EXCEPTION_NOT_APPROVED", reason: `${ex.text} It needs approval from the ${ex.approver === "manager" ? "Logistics Manager" : "user"}.` };
  }
  if (p.option.quote.validUntil < now) return { ok: false, code: "QUOTE_EXPIRED", reason: "The quote expired; it has to be renewed before booking." };
  return { ok: true };
}

/** An approval counts only for the current proposal id, version and terms hash, and only from the right role */
export function currentApproval(st: AgentState, kind: "booking" | "exception", exceptionId?: string, role?: Role) {
  const p = st.proposal;
  if (!p) return undefined;
  return st.approvals.find(
    (a) =>
      a.kind === kind &&
      a.proposalId === p.id &&
      a.version === p.version &&
      a.termsHash === p.termsHash &&
      (kind === "booking" ? a.by === "coordinator" : a.exceptionId === exceptionId && a.by === role),
  );
}
