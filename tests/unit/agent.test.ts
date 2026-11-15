/* Agent core scenarios (mock mode). Every scenario runs the real planner, policy, mock API and ledger;
   only the clock and the storage are swapped for test doubles. */

import { test } from "node:test";
import assert from "node:assert/strict";
import { Agent, STORE_KEY } from "../../src/agent/agent.ts";
import { MockCarrierApi } from "../../src/agent/mockApi.ts";
import type { Faults } from "../../src/agent/mockApi.ts";
import { BookingLedger } from "../../src/agent/ledger.ts";
import { GuardedStore } from "../../src/agent/storage.ts";
import type { KV } from "../../src/agent/storage.ts";
import { authorize, termsHash } from "../../src/agent/policy.ts";
import { MOCK_LABEL } from "../../src/agent/types.ts";
import { MIN, manualClock } from "../../src/agent/util.ts";
import { FILLED, step1Errors } from "../../src/proto/data.ts";
import type { Booking } from "../../src/proto/data.ts";

/* ---------- harness ---------- */

class MemKV implements KV {
  m = new Map<string, string>();
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
}

function setup(opts: { faults?: Faults; kv?: KV | null; delayMs?: number } = {}) {
  const store = new GuardedStore(opts.kv === undefined ? new MemKV() : opts.kv);
  const clock = manualClock();
  const ledger = new BookingLedger(store);
  const api = new MockCarrierApi(clock, ledger, opts.faults);
  const deps = { api, ledger, store, clock, delayMs: opts.delayMs ?? 0 };
  const agent = new Agent(deps);
  agent.state.id = "A-test";
  return { agent, api, ledger, store, clock, deps };
}

const SALMON = "Ship 10 boxes of fresh salmon, 25 kg each, 35x40x60 cm, chilled, from EZE to GRU, pick up on Nov 11";

async function details(a: Agent) {
  for (const [k, v] of [
    ["pickupTime", "10:00"],
    ["pickupAddress", FILLED.pickupAddress],
    ["originPostal", FILLED.originPostal],
    ["deliveryAddress", FILLED.deliveryAddress],
    ["destPostal", FILLED.destPostal],
    ["docs", FILLED.docs],
  ] as const)
    await a.setField(k, v, "answer");
}

const calls = (a: Agent, tool?: string) => a.state.log.filter((l) => l.type === "tool_call" && (!tool || l.tool === tool));
const types = (a: Agent, type: string) => a.state.log.filter((l) => l.type === type);

/* ---------- scenarios ---------- */

test("success: goal → plan → tools → proposal → approval → one booking, all logged", async () => {
  const { agent, ledger } = setup();
  await agent.submitGoal(`${SALMON}, deliver by Friday, budget of USD 1200`);
  await details(agent);
  assert.equal(agent.state.status, "awaiting_approval");
  assert.equal(agent.state.proposal!.version, 1, "attaching documents doesn't make a new version");
  assert.equal(ledger.count(), 0, "nothing is booked before approval");
  const order = calls(agent).map((l) => l.tool);
  for (const t of ["validateShipment", "checkCargoRestrictions", "searchAvailableFlights", "retrieveFreightRates", "compareShippingOptions", "prepareBookingDraft"]) assert.ok(order.includes(t as never), t);
  assert.ok(order.indexOf("searchAvailableFlights") > order.indexOf("checkCargoRestrictions"));
  assert.ok(!order.includes("confirmBooking"));

  const rec = agent.state.options.find((o) => o.recommended)!;
  assert.equal(rec.flight.service, "Express", "fastest option within budget and deadline");
  assert.deepEqual(rec.exceptions, []);
  assert.ok(rec.reasons.some((r) => r.includes("before the deadline")));
  assert.ok(rec.tradeoffs.length === 2);

  await agent.approve();
  assert.equal(agent.state.status, "confirmed");
  assert.equal(ledger.count(), 1);
  const confirm = calls(agent, "confirmBooking");
  assert.equal(confirm.length, 1);
  assert.equal(confirm[0].level, "L2");
  assert.ok(confirm[0].approvalId && confirm[0].idempotencyKey === `BK-${agent.state.proposal!.id}-v1`);
  assert.ok(agent.plan().every((t) => t.status === "done"));
  // The log is append-only and numbered
  assert.deepEqual(agent.state.log.map((l) => l.seq), agent.state.log.map((_, i) => i + 1));
});

test("mock mode is labeled and says no language model", async () => {
  const { agent } = setup();
  await agent.submitGoal(SALMON);
  assert.match(MOCK_LABEL, /no language model/);
  assert.equal(agent.state.mode, "mock");
  assert.ok(agent.state.log.some((l) => /no language model/.test(l.summary)));
});

test("missing information: asks, never guesses, and doesn't search", async () => {
  const { agent } = setup();
  await agent.submitGoal("Send some auto parts to Lima");
  assert.equal(agent.state.status, "needs_user");
  const asked = agent.state.questions.map((q) => q.field);
  for (const f of ["pieces", "weightPerPiece", "dims", "originAirport", "pickupDate"]) assert.ok(asked.includes(f as never), f);
  assert.equal(agent.state.shipment.originAirport, undefined);
  assert.equal(agent.state.shipment.pieces, undefined);
  assert.equal(calls(agent, "searchAvailableFlights").length, 0);
});

test("ambiguous city: offers the airports, picks none", async () => {
  const { agent } = setup();
  await agent.submitGoal("Ship 10 boxes of fresh salmon, 25 kg each, 35x40x60 cm from Buenos Aires to GRU, pick up on Nov 11");
  const q = agent.state.questions.find((x) => x.field === "originAirport")!;
  assert.equal(q.reason, "ambiguous");
  assert.deepEqual(q.options!.map((o) => o.value), ["EZE", "AEP"]);
  assert.equal(agent.state.shipment.originAirport, undefined);
  await agent.setField("originAirport", "EZE", "answer");
  assert.ok(calls(agent, "searchAvailableFlights").length === 1);
});

test("a total weight is split only once the number of pieces is known", async () => {
  const { agent } = setup();
  await agent.submitGoal("Ship 250 kg of auto parts, 35x40x60 cm, from EZE to GRU, pick up on Nov 11");
  const q = agent.state.questions.find((x) => x.field === "pieces")!;
  assert.match(q.text, /250 kg/);
  assert.ok(!agent.state.questions.some((x) => x.field === "weightPerPiece"), "doesn't ask for the weight twice");
  await agent.setField("pieces", 10, "answer");
  assert.equal(agent.state.shipment.weightPerPiece!.value, 25);
});

test("hard restriction: blocks, and no approval (Manager included) clears it", async () => {
  const { agent, ledger } = setup();
  await agent.submitGoal("Ship 2 crates of machinery, 1200 kg each, 100x100x100 cm, from EZE to GRU, pick up on Nov 11");
  assert.equal(agent.state.status, "blocked");
  assert.equal(agent.state.restrictions[0].code, "PIECE_TOO_HEAVY");
  assert.equal(calls(agent, "searchAvailableFlights").length, 0);

  await agent.decideException("PIECE_TOO_HEAVY", "manager", true);
  assert.equal(agent.state.status, "blocked");
  assert.match(types(agent, "denied").at(-1)!.summary, /can't be approved by anyone/);
  assert.equal(agent.state.approvals.length, 0);

  // Only a changed shipment clears it
  await agent.setField("pieces", 4, "edit");
  await agent.setField("weightPerPiece", 600, "edit");
  assert.notEqual(agent.state.status, "blocked");
  assert.ok(calls(agent, "searchAvailableFlights").length === 1);
  assert.equal(ledger.count(), 0);
});

test("hard restriction: confirmBooking is refused even with approvals on record", async () => {
  const { agent, clock } = setup();
  await agent.submitGoal(SALMON);
  await details(agent);
  const st = structuredClone(agent.state);
  const p = st.proposal!;
  st.approvals.push({ id: "AP-x", kind: "booking", by: "coordinator", proposalId: p.id, version: p.version, termsHash: p.termsHash, at: "" });
  assert.equal(authorize("confirmBooking", st, new Date(clock.now()).toISOString()).ok, true, "control: valid approval passes");
  p.shipment.weightPerPiece = { value: 1200, source: "user" };
  p.termsHash = termsHash(p);
  st.approvals.push({ id: "AP-y", kind: "booking", by: "coordinator", proposalId: p.id, version: p.version, termsHash: p.termsHash, at: "" });
  const d = authorize("confirmBooking", st, new Date(clock.now()).toISOString());
  assert.equal(d.ok, false);
  assert.equal(!d.ok && d.code, "HARD_RESTRICTION");
});

test("domestic-only airport: one-click fix, applied only when the user clicks", async () => {
  const { agent } = setup();
  await agent.submitGoal("Ship 10 boxes of auto parts, 25 kg each, 35x40x60 cm, from Mendoza to GRU, pick up on Nov 11");
  assert.equal(agent.state.status, "blocked");
  const r = agent.state.restrictions.find((x) => x.code === "DOMESTIC_ONLY_AIRPORT")!;
  assert.equal(r.suggestion!.value, "EZE");
  assert.equal(agent.state.shipment.originAirport!.value, "MDZ", "not changed by the agent");
  await agent.applySuggestion("DOMESTIC_ONLY_AIRPORT");
  assert.equal(agent.state.shipment.originAirport!.value, "EZE");
  assert.notEqual(agent.state.status, "blocked");
});

test("dangerous goods: hand-off to the form with every known field; the form still enforces hard limits", async () => {
  const { agent, ledger } = setup();
  await agent.submitGoal("Ship 3 boxes of lithium batteries, 1200 kg each, 50x40x30 cm, from EZE to SCL, pick up on Nov 12");
  assert.equal(agent.state.status, "handoff");
  const r = agent.state.restrictions.find((x) => x.kind === "specialist")!;
  assert.match(r.text, /specialist/);
  assert.match(r.text, /Dangerous goods/);
  assert.equal(calls(agent, "searchAvailableFlights").length, 0);

  const data = agent.handoff();
  assert.equal(data.cargoType, "Dangerous goods");
  assert.equal(data.pieces, "3");
  assert.equal(data.weight, "1200");
  assert.equal(data.height, "50");
  assert.equal(data.originAirport, "EZE");
  assert.equal(data.destAirport, "SCL");
  assert.equal(data.pickupDate, "2026-11-12");
  assert.equal(data.pickupAddress, undefined, "unknown fields stay empty, nothing invented");
  // The manual form, given this data, still rejects the 1,200 kg piece
  const form: Booking = { ...FILLED, pickupAddress: "", ...data } as Booking;
  assert.ok(step1Errors(form).weight, "manual path still enforces the per-piece limit");
  assert.equal(ledger.count(), 0);
});

test("live animals: hand-off with an explanation", async () => {
  const { agent } = setup();
  await agent.submitGoal("Ship 2 dogs, 20 kg each, 60x50x80 cm, from EZE to MIA, pick up on Nov 12");
  assert.equal(agent.state.status, "handoff");
  assert.match(agent.state.restrictions[0].text, /Live animals need welfare checks/);
  assert.equal(agent.handoff().cargoType, "Live animals");
});

test("no options: says so and asks for another date, no rates retrieved", async () => {
  const { agent } = setup({ faults: { noFlights: true } });
  await agent.submitGoal(SALMON);
  assert.equal(agent.state.status, "needs_user");
  assert.equal(agent.state.questions[0].field, "pickupDate");
  assert.equal(calls(agent, "retrieveFreightRates").length, 0);
});

test("over budget: needs the Manager; coordinator can't approve it; Manager approval lets it book", async () => {
  const { agent, ledger } = setup();
  await agent.submitGoal(`${SALMON}, fastest, budget of USD 1000`);
  await details(agent);
  const express = agent.state.options.find((o) => o.flight.service === "Express")!;
  assert.ok(!express.recommended, "options within budget rank first");
  await agent.selectOption(express.flight.id);
  assert.equal(agent.state.status, "needs_manager");
  const ex = agent.state.proposal!.option.exceptions[0];
  assert.equal(ex.kind, "budget");

  await agent.approve(); // the coordinator approving now isn't possible
  assert.equal(agent.state.status, "needs_manager");
  await agent.decideException(ex.id, "coordinator", true);
  assert.match(types(agent, "denied").at(-1)!.summary, /Logistics Manager/);

  await agent.decideException(ex.id, "manager", true);
  assert.equal(agent.state.status, "awaiting_approval");
  await agent.approve();
  assert.equal(agent.state.status, "confirmed");
  assert.equal(ledger.count(), 1);
  assert.ok(agent.state.log.some((l) => l.actor === "manager" && l.type === "approval"));
});

test("over budget: Manager rejection → re-plan without that flight", async () => {
  const { agent, ledger } = setup();
  await agent.submitGoal(`${SALMON}, fastest, budget of USD 1000`);
  await details(agent);
  const express = agent.state.options.find((o) => o.flight.service === "Express")!;
  await agent.selectOption(express.flight.id);
  await agent.decideException(agent.state.proposal!.option.exceptions[0].id, "manager", false);
  assert.equal(agent.state.status, "awaiting_approval");
  assert.notEqual(agent.state.proposal!.option.flight.id, express.flight.id);
  assert.ok(!agent.state.options.some((o) => o.flight.id === express.flight.id));
  assert.equal(ledger.count(), 0);
});

test("late arrival: a deadline exception the user accepts as part of their approval", async () => {
  const { agent, ledger } = setup();
  await agent.submitGoal(`${SALMON}, cheapest, deliver before Friday`); // Friday 00:00: every option is late
  await details(agent);
  const p = agent.state.proposal!;
  assert.equal(p.option.exceptions[0]?.kind, "deadline", "only late options, so the cheapest late one is proposed");
  assert.equal(agent.state.status, "awaiting_approval");
  await agent.approve();
  assert.equal(agent.state.status, "confirmed");
  assert.ok(agent.state.approvals.some((a) => a.kind === "exception" && a.by === "coordinator"));
  assert.equal(ledger.count(), 1);
});

test("price change at confirmation: new version, the old approval no longer counts", async () => {
  const { agent, ledger, api } = setup();
  await agent.submitGoal(SALMON);
  await details(agent);
  const before = agent.state.proposal!.option.quote.total;
  api.faults.priceIncreasePct = 10;
  await agent.approve();
  assert.equal(agent.state.status, "awaiting_approval");
  assert.equal(agent.state.proposal!.version, 2);
  assert.ok(agent.state.proposal!.option.quote.total > before);
  assert.ok(agent.state.proposal!.changes.some((c) => c.startsWith("Price")));
  assert.ok(types(agent, "invalidation").length >= 1);
  assert.equal(ledger.count(), 0);
  const st = agent.state;
  assert.equal(authorize("confirmBooking", st, "2026-11-09T10:00:00Z").ok, false, "v1 approval doesn't authorize v2");

  await agent.approve();
  assert.equal(agent.state.status, "confirmed");
  assert.equal(ledger.count(), 1);
  assert.equal(agent.state.booking!.version, 2);
});

test("price change that breaks the budget goes back to the Manager", async () => {
  const { agent, api } = setup();
  await agent.submitGoal(`${SALMON}, budget of USD 950`);
  await details(agent);
  assert.equal(agent.state.proposal!.option.flight.service, "Standard"); // USD 897.50
  api.faults.priceIncreasePct = 10;
  await agent.approve();
  assert.equal(agent.state.proposal!.version, 2);
  assert.equal(agent.state.proposal!.option.flight.service, "Standard", "the user's choice is kept");
  assert.equal(agent.state.proposal!.option.exceptions[0].kind, "budget");
  assert.equal(agent.state.status, "needs_manager");
});

test("expired quote: renewed before booking; same price keeps the approval", async () => {
  const { agent, ledger, clock } = setup();
  await agent.submitGoal(SALMON);
  await details(agent);
  clock.advance(20 * MIN);
  await agent.approve();
  assert.equal(agent.state.status, "confirmed");
  assert.equal(agent.state.booking!.version, 1);
  assert.ok(calls(agent, "retrieveFreightRates").length >= 2, "re-quoted before confirming");
  assert.equal(ledger.count(), 1);
});

test("space released at confirmation: searched again, new version, approval again", async () => {
  const { agent, ledger, api } = setup();
  await agent.submitGoal(SALMON);
  await details(agent);
  api.faults.expireBeforeConfirm = true;
  await agent.approve();
  assert.equal(agent.state.status, "awaiting_approval");
  assert.equal(agent.state.proposal!.version, 2);
  assert.equal(calls(agent, "searchAvailableFlights").length, 2);
  assert.equal(ledger.count(), 0);
});

test("user rejection → re-plan with another option, same proposal, new version", async () => {
  const { agent } = setup();
  await agent.submitGoal(SALMON);
  await details(agent);
  const p1 = agent.state.proposal!;
  await agent.reject("Too expensive");
  const p2 = agent.state.proposal!;
  assert.equal(agent.state.status, "awaiting_approval");
  assert.equal(p2.id, p1.id);
  assert.equal(p2.version, 2);
  assert.notEqual(p2.option.flight.id, p1.option.flight.id);
  assert.ok(p2.changes.some((c) => c.startsWith("Flight")));
  assert.ok(types(agent, "rejection").length === 1);
});

test("edited field after an approval: re-plans and voids the approval", async () => {
  const { agent, ledger } = setup({ faults: { confirmFailures: 1 } });
  await agent.submitGoal(SALMON);
  await details(agent);
  await agent.approve();
  assert.equal(agent.state.status, "failed");
  assert.equal(ledger.count(), 0);
  await agent.setField("pieces", 12, "edit");
  assert.equal(agent.state.status, "awaiting_approval");
  assert.equal(agent.state.proposal!.version, 2);
  assert.ok(agent.state.proposal!.changes.includes("Number of pieces changed"));
  assert.ok(types(agent, "invalidation").some((l) => /v1 was approved/.test(l.summary)));
  // re-searched and re-quoted with the new weight
  assert.equal(calls(agent, "searchAvailableFlights").length, 2);
});

test("a read-only tool that keeps failing: 3 attempts, then Failed with Retry", async () => {
  const { agent } = setup({ faults: { searchFailures: 3 } });
  await agent.submitGoal(SALMON);
  assert.equal(agent.state.status, "failed");
  assert.equal(agent.state.failedTool, "searchAvailableFlights");
  assert.equal(types(agent, "tool_error").length, 3);
  assert.equal(agent.plan().find((t) => t.id === "search")!.status, "failed");
  await agent.retry();
  assert.notEqual(agent.state.status, "failed");
  assert.equal(agent.state.flights.length, 3);
});

test("a read-only tool that fails twice recovers on its own", async () => {
  const { agent } = setup({ faults: { rateFailures: 2 } });
  await agent.submitGoal(SALMON);
  assert.equal(agent.state.status, "needs_user"); // waiting for the proposal details, not failed
  assert.equal(types(agent, "tool_error").length, 2);
  assert.equal(agent.state.quotes.length, 3);
});

test("timeout that did book: status checked before any retry, one booking", async () => {
  const { agent, ledger } = setup({ faults: { confirmTimeout: "booked" } });
  await agent.submitGoal(SALMON);
  await details(agent);
  await agent.approve();
  assert.equal(agent.state.status, "confirmed");
  assert.equal(calls(agent, "confirmBooking").length, 1, "never re-sent");
  const seqStatus = calls(agent, "getBookingStatus")[0].seq;
  assert.ok(seqStatus > calls(agent, "confirmBooking")[0].seq);
  assert.equal(ledger.count(), 1);
});

test("timeout that didn't book: status says no, Retry books once with the same key", async () => {
  const { agent, ledger } = setup({ faults: { confirmTimeout: "not_booked" } });
  await agent.submitGoal(SALMON);
  await details(agent);
  await agent.approve();
  assert.equal(agent.state.status, "failed");
  assert.equal(ledger.count(), 0);
  await agent.retry();
  assert.equal(agent.state.status, "confirmed");
  const keys = new Set(calls(agent, "confirmBooking").map((l) => l.idempotencyKey));
  assert.equal(keys.size, 1, "same idempotency key on the retry");
  assert.equal(ledger.count(), 1);
});

test("timeout and the status can't be checked: status unknown, nothing re-sent", async () => {
  const { agent, ledger, api } = setup({ faults: { confirmTimeout: "booked", statusFailures: 3 } });
  await agent.submitGoal(SALMON);
  await details(agent);
  await agent.approve();
  assert.equal(agent.state.status, "status_unknown");
  assert.equal(calls(agent, "confirmBooking").length, 1);
  assert.equal(ledger.count(), 1); // it did book on the carrier's side
  await agent.retry(); // checks the status again, doesn't book again
  assert.equal(agent.state.status, "confirmed");
  assert.equal(calls(agent, "confirmBooking").length, 1);
  assert.equal(ledger.count(), 1);
  assert.equal(api.faults.statusFailures, 0);
});

test("duplicate confirmation: double approve and a direct replay still make one booking", async () => {
  const { agent, ledger, api } = setup();
  await agent.submitGoal(SALMON);
  await details(agent);
  await Promise.all([agent.approve(), agent.approve()]);
  assert.equal(agent.state.status, "confirmed");
  assert.equal(ledger.count(), 1);
  const b = agent.state.booking!;
  const p = agent.state.proposal!;
  const again = api.confirm({ idempotencyKey: b.idempotencyKey, proposalId: p.id, version: p.version, flight: p.option.flight, quote: p.option.quote, shipment: p.shipment });
  assert.ok(again.ok && again.booking.bookingId === b.bookingId);
  assert.equal(ledger.count(), 1);
});

test("confirmBooking without a valid approval is refused by the policy", async () => {
  const { agent } = setup();
  await agent.submitGoal(SALMON);
  await details(agent);
  const now = "2026-11-09T10:00:00Z";
  const st = structuredClone(agent.state);
  const no = authorize("confirmBooking", st, now);
  assert.equal(!no.ok && no.code, "NOT_APPROVED");
  const p = st.proposal!;
  st.approvals.push({ id: "AP-m", kind: "booking", by: "manager", proposalId: p.id, version: p.version, termsHash: p.termsHash, at: now });
  assert.equal(authorize("confirmBooking", st, now).ok, false, "a Manager can't approve the booking itself");
  st.approvals.push({ id: "AP-old", kind: "booking", by: "coordinator", proposalId: p.id, version: p.version - 1, termsHash: p.termsHash, at: now });
  assert.equal(authorize("confirmBooking", st, now).ok, false, "an approval for another version doesn't count");
  st.approvals.push({ id: "AP-ok", kind: "booking", by: "coordinator", proposalId: p.id, version: p.version, termsHash: p.termsHash, at: now });
  assert.equal(authorize("confirmBooking", st, now).ok, true);
  p.option = { ...p.option, quote: { ...p.option.quote, total: 1 } };
  const t = authorize("confirmBooking", st, now);
  assert.equal(!t.ok && t.code, "TAMPERED", "terms edited after hashing are caught");
  assert.equal(authorize("searchAvailableFlights", st, now).ok, true, "L3 tools run on their own");
});

test("missing documents: a draft is fine, confirming isn't", async () => {
  const { agent, ledger } = setup();
  await agent.submitGoal(SALMON);
  for (const [k, v] of [["pickupTime", "10:00"], ["pickupAddress", FILLED.pickupAddress], ["originPostal", "1804"], ["deliveryAddress", FILLED.deliveryAddress], ["destPostal", FILLED.destPostal]] as const) await agent.setField(k, v, "answer");
  assert.ok(agent.state.proposal, "draft prepared");
  assert.equal(agent.state.status, "needs_user");
  assert.equal(agent.state.questions[0].field, "docs");
  await agent.approve();
  assert.equal(ledger.count(), 0);
  const d = authorize("confirmBooking", agent.state, "2026-11-09T10:00:00Z");
  assert.equal(!d.ok && d.code, "DOCUMENTS_MISSING");
});

test("pause stops at the next tool; reload restores it; resume finishes the plan", async () => {
  const kv = new MemKV();
  const { agent, deps } = setup({ kv, delayMs: 2 });
  const running = agent.submitGoal(SALMON);
  await new Promise((r) => setTimeout(r, 3));
  agent.pause();
  await running;
  assert.equal(agent.state.status, "paused");
  const n = calls(agent).length;
  assert.ok(n < 6, `stopped early (${n} tool calls)`);

  const restored = Agent.restore({ ...deps, delayMs: 0 })!;
  assert.ok(restored, "restored from session storage");
  assert.equal(restored.state.status, "paused");
  assert.equal(restored.state.log.length >= agent.state.log.length, true);
  await restored.resume();
  assert.equal(restored.state.status, "needs_user");
  assert.equal(restored.state.flights.length, 3);
});

test("reload during booking: never re-sent blindly, status checked first", async () => {
  const kv = new MemKV();
  const { agent, deps, ledger } = setup({ kv });
  await agent.submitGoal(SALMON);
  await details(agent);
  // Simulate a reload while confirmBooking was in flight and did reach the carrier
  const p = agent.state.proposal!;
  agent.state.approvals.push({ id: "AP-r", kind: "booking", by: "coordinator", proposalId: p.id, version: p.version, termsHash: p.termsHash, at: "" });
  agent.state.idempotencyKey = `BK-${p.id}-v${p.version}`;
  agent.state.status = "booking";
  ledger.create({ idempotencyKey: agent.state.idempotencyKey, proposalId: p.id, version: p.version, total: p.option.quote.total, flightNo: p.option.flight.flightNo, createdAt: "" });
  deps.store.set(STORE_KEY, agent.state);

  const restored = Agent.restore(deps)!;
  assert.equal(restored.state.status, "status_unknown");
  await restored.run();
  assert.equal(restored.state.status, "confirmed");
  assert.equal(calls(restored, "confirmBooking").length, 0);
  assert.equal(ledger.count(), 1);
});

test("malformed or edited saved state is dropped, not trusted", () => {
  const kv = new MemKV();
  const { deps } = setup({ kv });
  kv.setItem(STORE_KEY, JSON.stringify({ schema: 1, status: "confirmed" }));
  assert.equal(Agent.restore(deps), null);
  kv.setItem(STORE_KEY, "{not json");
  assert.equal(Agent.restore(deps), null);
});

test("storage unavailable: works in memory and reports it can't resume after a reload", async () => {
  const broken: KV = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("quota");
    },
    removeItem: () => {
      throw new Error("blocked");
    },
  };
  const { agent, ledger, store } = setup({ kv: broken });
  await agent.submitGoal(SALMON);
  await details(agent);
  await agent.approve();
  assert.equal(agent.state.status, "confirmed");
  assert.equal(ledger.count(), 1);
  assert.equal(store.persistent, false);
});

test("cancel: nothing booked, draft discarded, and nothing else runs", async () => {
  const { agent, ledger } = setup();
  await agent.submitGoal(SALMON);
  await details(agent);
  agent.cancel();
  assert.equal(agent.state.status, "cancelled");
  assert.equal(agent.state.proposal, undefined);
  await agent.approve();
  assert.equal(ledger.count(), 0);
});

test("the same goal with different data takes a different path", async () => {
  const a = setup().agent;
  const b = setup().agent;
  await a.submitGoal(SALMON);
  await b.submitGoal("Ship 2 dogs, 20 kg each, 60x50x80 cm, from EZE to MIA, pick up on Nov 12");
  assert.notDeepEqual(calls(a).map((l) => l.tool), calls(b).map((l) => l.tool));
});
