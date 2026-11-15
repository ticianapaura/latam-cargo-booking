/* Rule-based interpretation of a shipment goal (mock mode).
   It reads only what is written: numbers with units, places it knows, dates, a budget, a priority.
   Anything it can't read stays missing and becomes a question. It never fills a gap with a guess.

   This is the seam where a language model could plug in later, on a server that keeps the key:
   it would return the same Interpretation shape, and everything after it (validation, policy,
   approvals) would stay in this deterministic code. */

import { AIRPORTS, TODAY } from "../proto/data.ts";
import type { Constraints, Field, Shipment } from "./types.ts";

export type Interpretation = {
  shipment: Shipment;
  constraints: Constraints;
  /** Places that match more than one airport, for the planner to ask about */
  ambiguous: { field: "originAirport" | "destAirport"; place: string; codes: string[] }[];
  /** Plain-language notes on what was read, shown in the activity log */
  notes: string[];
};

export interface Interpreter {
  interpret(text: string): Interpretation;
}

const msg = <T>(value: T): Field<T> => ({ value, source: "message" });
const num = (s: string) => Number(s.replace(/,/g, ""));

const CARGO_WORDS: [RegExp, string][] = [
  [/\b(dangerous goods|hazmat|lithium batter(y|ies)|batter(y|ies)|chemicals?|flammable)\b/, "Dangerous goods"],
  [/\b(live animals?|pets?|dogs?|cats?|horses?|livestock)\b/, "Live animals"],
  [/\b(vaccines?|medicines?|pharma(ceuticals?)?|drugs)\b/, "Pharmaceuticals"],
  [/\b(salmon|fish|seafood|fruit|flowers|meat|perishables?|fresh)\b/, "Perishables"],
  [/\b(jewel(le)?ry|gold|valuables|banknotes)\b/, "Valuables"],
  [/\b(merchandise|general cargo|goods|auto parts|spare parts|parts|textiles|clothing|machinery)\b/, "General cargo"],
];

const PLACES: { words: string[]; codes: string[] }[] = [
  ...AIRPORTS.map((a) => ({ words: [a.code.toLowerCase()], codes: [a.code] })),
  ...[...new Set(AIRPORTS.map((a) => a.city))].map((city) => ({
    words: [city.toLowerCase(), city.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")],
    // A city's international airports first; a domestic-only one is listed but never picked silently
    codes: AIRPORTS.filter((a) => a.city === city).sort((x, y) => Number(y.international) - Number(x.international)).map((a) => a.code),
  })),
];

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function nextWeekday(name: string) {
  const today = new Date(`${TODAY}T12:00:00Z`);
  const target = DAYS.indexOf(name);
  let diff = (target - today.getUTCDay() + 7) % 7;
  if (diff === 0) diff = 7;
  return new Date(today.getTime() + diff * 86_400_000).toISOString().slice(0, 10);
}

/** A date written as "Friday", "Nov 20", "20 November", "2026-11-20", "today" or "tomorrow" */
function readDate(s: string): string | null {
  s = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (s === "today") return TODAY;
  if (s === "tomorrow") return new Date(Date.parse(`${TODAY}T12:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
  const wd = DAYS.find((d) => s.startsWith(d.slice(0, 3)));
  if (wd && /^[a-z]+$/.test(s)) return nextWeekday(wd);
  const m1 = s.match(/^([a-z]{3})[a-z]*\.? (\d{1,2})$/);
  const m2 = s.match(/^(\d{1,2}) ([a-z]{3})[a-z]*$/);
  const [mon, dd] = m1 ? [m1[1], m1[2]] : m2 ? [m2[2], m2[1]] : [null, null];
  if (mon && MONTHS.includes(mon)) return `${TODAY.slice(0, 4)}-${String(MONTHS.indexOf(mon) + 1).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
  return null;
}
// Month words must be real months, so "ship 10 boxes" is never read as a date
const MONTH = String.raw`(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*`;
const DATE = String.raw`(\d{4}-\d{2}-\d{2}|today|tomorrow|(?:mon|tues|wednes|thurs|fri|satur|sun)day|${MONTH}\.? \d{1,2}\b|\d{1,2} ${MONTH})`;

export const ruleBasedInterpreter: Interpreter = {
  interpret(text: string): Interpretation {
    const t = ` ${text.toLowerCase().replace(/\s+/g, " ")} `;
    const shipment: Shipment = {};
    const constraints: Constraints = {};
    const ambiguous: Interpretation["ambiguous"] = [];
    const notes: string[] = [];

    // Weight and pieces
    const w = t.match(/(\d[\d,]*(?:\.\d+)?)\s*(kg|kgs|kilos?|kilograms?|lb|lbs|pounds?)\b(\s*(each|per piece|per box|a piece))?/);
    const p = t.match(/(\d+)\s*(pieces|piece|boxes|box|pallets|pallet|crates|crate|packages|cartons|carton|units)\b/);
    if (w) {
      const unit = /^l|^p/.test(w[2]) ? "lb" : "kg";
      shipment.weightUnit = msg(unit as "kg" | "lb");
      const value = num(w[1]);
      if (w[3]) {
        shipment.weightPerPiece = msg(value);
        notes.push(`Read ${value} ${unit} per piece.`);
      } else if (p) {
        shipment.weightPerPiece = msg(Math.round((value / num(p[1])) * 100) / 100);
        notes.push(`Read ${value} ${unit} in total over ${p[1]} pieces.`);
      } else {
        // A total with no piece count: kept as a total; the per-piece weight waits for the number of pieces
        shipment.totalWeight = msg(value);
        notes.push(`Read ${value} ${unit} in total; the number of pieces is needed to split it.`);
      }
    }
    if (p) shipment.pieces = msg(num(p[1]));

    // Dimensions
    const d = t.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(cm|in|inches)?/);
    if (d) {
      shipment.dims = msg({ h: num(d[1]), w: num(d[2]), l: num(d[3]) });
      shipment.dimUnit = d[4] ? msg((d[4] === "cm" ? "cm" : "in") as "cm" | "in") : { value: "cm", source: "default" };
    }

    // Places: only with "from" and "to", so origin and destination are never swapped by guessing
    const place = (re: RegExp) => {
      const m = t.match(re);
      if (!m) return null;
      const after = m[1];
      const hit = PLACES.filter((pl) => pl.words.some((wd) => after.startsWith(wd))).sort((a, b) => b.words[0].length - a.words[0].length)[0];
      return hit ? { words: hit.words[0], codes: hit.codes } : null;
    };
    for (const [field, re] of [
      ["originAirport", /\bfrom ([a-zãéíóú ]+)/],
      ["destAirport", /\bto ([a-zãéíóú ]+)/],
    ] as const) {
      const hit = place(re);
      if (!hit) continue;
      if (hit.codes.length === 1) shipment[field] = msg(hit.codes[0]);
      else ambiguous.push({ field, place: hit.words, codes: hit.codes });
    }

    // Cargo type and a short description from the same words
    for (const [re, type] of CARGO_WORDS) {
      const m = t.match(re);
      if (m) {
        shipment.cargoType = msg(type);
        const phrase = t.match(new RegExp(String.raw`((?:fresh |frozen |chilled )?${m[0]}(?: in [a-z ]+? boxes)?)\b`));
        if (phrase && phrase[1].length >= 3) shipment.description = msg(phrase[1].charAt(0).toUpperCase() + phrase[1].slice(1));
        notes.push(`Read “${m[0]}” as ${type}.`);
        break;
      }
    }

    // Handling
    const handling: string[] = [];
    if (/\b(chilled|refrigerated|cold chain|keep cold|2-8)\b/.test(t)) handling.push("Chilled 2–8 °C");
    if (/\b(frozen|-18)\b/.test(t)) handling.push("Frozen −18 °C");
    if (/\bfragile\b/.test(t)) handling.push("Fragile");
    if (handling.length) shipment.handling = msg(handling);

    // Dates: a pickup date, and a delivery deadline ("before Friday" = arrive before Friday starts)
    const pick = t.match(new RegExp(String.raw`\b(?:pick(?:ed)? ?up|ship|collect(?:ion)?|ready)(?: it)?(?: on| from)? ${DATE}`));
    if (pick) {
      const dt = readDate(pick[1]);
      if (dt) shipment.pickupDate = msg(dt);
    }
    const dl = t.match(new RegExp(String.raw`\b(before|by|no later than|until) ${DATE}`));
    if (dl) {
      const dt = readDate(dl[2]);
      if (dt) {
        constraints.deadline = msg(dl[1] === "before" ? `${dt}T00:00:00Z` : `${dt}T23:59:00Z`);
        notes.push(dl[1] === "before" ? `Read the deadline as arriving before ${dt} starts.` : `Read the deadline as arriving by the end of ${dt}.`);
      }
    }

    // Budget, in USD only
    const b = t.match(/\b(?:max(?:imum)?(?: budget)?(?: of)?|budget(?: of| is)?|under|up to|no more than|at most)\s*(usd|us\$|\$|eur|€|ars)?\s*([\d][\d,]*(?:\.\d+)?)\s*(usd|dollars|eur|euros|ars|pesos)?/);
    if (b) {
      const cur = (b[1] ?? b[3] ?? "usd").replace("us$", "usd").replace("$", "usd").replace("dollars", "usd");
      if (/usd/.test(cur)) constraints.budgetUsd = msg(num(b[2]));
      else notes.push(`Found a budget in ${cur.toUpperCase()}; only USD is supported, so it needs to be given in USD.`);
    }

    // Priority
    if (/\b(fastest|quickest|asap|as soon as possible|urgent)\b/.test(t)) constraints.priority = msg("fastest");
    else if (/\b(cheapest|lowest price|lowest cost|cheap)\b/.test(t)) constraints.priority = msg("cheapest");

    return { shipment, constraints, ambiguous, notes };
  },
};
