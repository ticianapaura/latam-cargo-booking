// Baseline for the booking rules that exist today (src/proto/data.ts).
// The agent will reuse these rules, so they are pinned before any agent work starts.
// Run: npm run test:unit
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FILLED, INVALID_STEP1, INVALID_STEP2, docErrors, rate, search, step1Errors, step1Ready, step2Errors, totalKg, volumetricKg,
} from "../../src/proto/data.ts";
import type { Booking } from "../../src/proto/data.ts";

const b = (patch: Partial<Booking> = {}): Booking => ({ ...FILLED, ...patch, docs: { ...FILLED.docs, ...patch.docs } });

test("the sample booking passes every step", () => {
  assert.deepEqual(step1Errors(b()), {});
  assert.deepEqual(step2Errors(b()), {});
  assert.deepEqual(docErrors(b()), {});
  assert.equal(step1Ready(b()), true);
});

test("step 1: the designed error state has exactly its six errors", () => {
  const e = step1Errors(b(INVALID_STEP1));
  assert.deepEqual(Object.keys(e).sort(), ["description", "dims", "handling", "instructions", "pieces", "weight"]);
});

test("step 1: hard limits per piece", () => {
  assert.match(step1Errors(b({ weight: "1001" })).weight!, /1,000 kg/);
  assert.equal(step1Errors(b({ weight: "1000" })).weight, undefined);
  assert.match(step1Errors(b({ weight: "2300", weightUnit: "lb" })).weight!, /1,000 kg/); // 1,043 kg
  assert.match(step1Errors(b({ height: "245" })).dims!, /244 cm/);
  assert.equal(step1Errors(b({ height: "96", dimUnit: "in" })).dims, undefined); // 243.8 cm
  assert.match(step1Errors(b({ height: "97", dimUnit: "in" })).dims!, /244 cm/); // 246.4 cm
});

test("step 1: Chilled and Frozen can't be combined", () => {
  assert.ok(step1Errors(b({ handling: ["Chilled 2–8 °C", "Frozen −18 °C"] })).handling);
  assert.equal(step1Errors(b({ handling: ["Frozen −18 °C", "Fragile"] })).handling, undefined);
});

test("step 1: whole pieces only, and instructions up to 160 characters", () => {
  assert.ok(step1Errors(b({ pieces: "2.5" })).pieces);
  assert.ok(step1Errors(b({ pieces: "0" })).pieces);
  assert.equal(step1Errors(b({ instructions: "x".repeat(160) })).instructions, undefined);
  assert.match(step1Errors(b({ instructions: "x".repeat(189) })).instructions!, /^29 characters over/);
});

test("step 2: the designed error state has exactly its five errors", () => {
  const e = step2Errors(b(INVALID_STEP2));
  assert.deepEqual(Object.keys(e).sort(), ["originAirport", "originPostal", "pickupAddress", "pickupDate", "pickupTime"]);
});

test("step 2: domestic-only airports are refused on international routes only", () => {
  assert.match(step2Errors(b({ originAirport: "MDZ" })).originAirport!, /domestic cargo only/);
  assert.equal(step2Errors(b({ originAirport: "MDZ", destCountry: "Argentina", destAirport: "EZE", destPostal: "1804" })).originAirport, undefined);
  assert.ok(step2Errors(b({ destCountry: "Argentina", destAirport: "EZE", destPostal: "1804" })).destAirport); // same airport
});

test("step 2: postal codes, past dates and pickup hours", () => {
  assert.equal(step2Errors(b({ originPostal: "B1804ABC" })).originPostal, undefined);
  assert.ok(step2Errors(b({ originPostal: "55" })).originPostal);
  assert.ok(step2Errors(b({ destPostal: "0719" })).destPostal);
  assert.ok(step2Errors(b({ pickupDate: "2026-11-08" })).pickupDate); // the prototype's today is 2026-11-09
  assert.equal(step2Errors(b({ pickupDate: "2026-11-09" })).pickupDate, undefined);
  assert.equal(step2Errors(b({ pickupTime: "06:00" })).pickupTime, undefined);
  assert.equal(step2Errors(b({ pickupTime: "22:00" })).pickupTime, undefined);
  assert.ok(step2Errors(b({ pickupTime: "22:30" })).pickupTime);
});

test("documents: required ones block, the optional one doesn't, and file errors show", () => {
  assert.ok(docErrors(b({ docs: { ...FILLED.docs, health: null } })).health);
  assert.equal(docErrors(b({ docs: { ...FILLED.docs, origin: null } })).origin, undefined);
  assert.ok(docErrors(b({ docs: { ...FILLED.docs, health: { name: "a.pdf", mb: 18.4, error: "too big" } } })).health);
});

test("rate: chargeable weight and the perishables surcharge", () => {
  const sample = b();
  assert.equal(totalKg(sample), 250);
  assert.equal(volumetricKg(sample), 140); // 35×40×60 cm ÷ 6,000 × 10 pieces
  const r = rate(sample);
  assert.equal(r.kg, 250);
  assert.equal(Math.round(r.total * 100) / 100, 897.5); // 650 + 97.50 + 112.50 + 37.50
  assert.equal(rate(b({ cargoType: "General cargo" })).special, 0);
});

test("search: suggestions, exact match, no results, no access", () => {
  const s = search("#123", false);
  assert.equal(s.kind, "suggest");
  assert.deepEqual(s.kind === "suggest" && s.rows.map((r) => r.id), ["#1235", "#1234"]);
  const m = search("000-12345678", false);
  assert.equal(m.kind === "match" && m.row.id, "#1234");
  const none = search("000-1234", true);
  assert.equal(none.kind, "none");
  assert.match(none.kind === "none" ? none.hint : "", /You entered 7/);
  assert.equal(search("#1198", true).kind, "noaccess");
  assert.equal(search("", false).kind, "recent");
});
