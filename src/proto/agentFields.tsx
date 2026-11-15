/* How each value the agent works with is shown, edited and checked on the agent page.
   One definition per field, used by the "What CargoPilot read" card, the question blocks and the blocked state,
   so a correction looks and behaves the same wherever the user makes it. */

import { useState } from "react";
import type { AgentState, Constraints, Shipment, ShipmentKey } from "../agent/types.ts";
import { LABELS } from "../agent/shipment.ts";
import { AIRPORTS, CARGO_TYPES, HANDLING, PICKUP_TIMES, TODAY, airport, fmtDate, fmtTime, usd } from "./data";
import { Chips, Select, TextInput } from "./ui";

export type Key = ShipmentKey | keyof Constraints;
type Kind = "text" | "number" | "select" | "date" | "dims" | "chips" | "deadline";

type Def = { kind: Kind; options?: { value: string; label?: string; hint?: string }[]; placeholder?: string; unit?: (st: AgentState) => string; width?: number };

const AIRPORT_OPTIONS = AIRPORTS.map((a) => ({ value: a.code, label: `${a.code} · ${a.city}`, hint: `${a.name}${a.international ? "" : " · domestic only"}` }));

export const DEFS: Partial<Record<Key, Def>> = {
  cargoType: { kind: "select", options: CARGO_TYPES },
  description: { kind: "text", placeholder: "E.g. Fresh salmon in insulated boxes" },
  pieces: { kind: "number", placeholder: "E.g. 10", width: 120 },
  weightPerPiece: { kind: "number", placeholder: "E.g. 25", width: 120, unit: (st) => st.shipment.weightUnit?.value ?? "kg" },
  dims: { kind: "dims" },
  handling: { kind: "chips" },
  originAirport: { kind: "select", options: AIRPORT_OPTIONS },
  destAirport: { kind: "select", options: AIRPORT_OPTIONS },
  pickupDate: { kind: "date" },
  pickupTime: { kind: "select", options: PICKUP_TIMES.map((t) => ({ value: t, label: fmtTime(t) })), width: 180 },
  pickupAddress: { kind: "text", placeholder: "Street and number" },
  originPostal: { kind: "text", placeholder: "E.g. 1804", width: 160 },
  deliveryAddress: { kind: "text", placeholder: "Street and number" },
  destPostal: { kind: "text", placeholder: "E.g. 07190-100", width: 160 },
  deadline: { kind: "deadline" },
  budgetUsd: { kind: "number", placeholder: "E.g. 1200", width: 140, unit: () => "USD" },
  priority: {
    kind: "select",
    width: 260,
    options: [
      { value: "balanced", label: "Balanced", hint: "Weighs price and transit time equally" },
      { value: "fastest", label: "Fastest", hint: "Earliest arrival first" },
      { value: "cheapest", label: "Cheapest", hint: "Lowest price first" },
    ],
  },
};

/** Fields grouped as the user thinks about them; the card and the hand-off use the same groups */
export const GROUPS: { title: string; keys: Key[] }[] = [
  { title: "Cargo", keys: ["cargoType", "description", "pieces", "weightPerPiece", "dims", "handling"] },
  { title: "Route and pickup", keys: ["originAirport", "destAirport", "pickupDate", "pickupTime", "pickupAddress", "originPostal", "deliveryAddress", "destPostal"] },
  { title: "Your goal", keys: ["deadline", "budgetUsd", "priority"] },
];

export const label = (k: Key) => (k === "dims" ? "Dimensions per piece" : LABELS[k]);

const field = (st: AgentState, k: Key) => (k === "deadline" || k === "budgetUsd" || k === "priority" ? (st.constraints as Record<string, { value: unknown; source: string } | undefined>)[k] : (st.shipment as Record<string, { value: unknown; source: string } | undefined>)[k]);

/** A date and time from the mock API or a deadline, shown as written (the prototype has no time zones) */
export function fmtDT(iso: string) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
  return `${day} · ${time}`;
}
export const fmtClock = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });

export function deadlineText(iso: string) {
  return iso.endsWith("T00:00:00Z") ? `Before ${fmtDT(iso).split(" · ")[0]}` : `By ${fmtDT(iso)}`;
}

/** The value as the user reads it, or "" when nothing is known */
export function show(st: AgentState, k: Key): string {
  const f = field(st, k);
  if (k === "weightPerPiece" && !f && st.shipment.totalWeight) return `${st.shipment.totalWeight.value} ${st.shipment.weightUnit?.value ?? "kg"} in total`;
  if (!f || f.value === "" || f.value == null) return k === "priority" ? "Balanced (default)" : "";
  const v = f.value as never;
  switch (k) {
    case "pieces":
      return `${v} ${v === 1 ? "piece" : "pieces"}`;
    case "weightPerPiece":
      return `${v} ${st.shipment.weightUnit?.value ?? "kg"} per piece`;
    case "dims": {
      const d = f.value as { h: number; w: number; l: number };
      return `${d.h} × ${d.w} × ${d.l} ${st.shipment.dimUnit?.value ?? "cm"}`;
    }
    case "handling":
      return (f.value as string[]).join(", ") || "None";
    case "originAirport":
    case "destAirport": {
      const a = airport(v);
      return a ? `${a.code} · ${a.city}${a.international ? "" : " (domestic only)"}` : String(v);
    }
    case "pickupDate":
      return fmtDate(v);
    case "pickupTime":
      return fmtTime(v);
    case "deadline":
      return deadlineText(v);
    case "budgetUsd":
      return usd(v);
    case "priority":
      return ({ fastest: "Fastest", cheapest: "Cheapest", balanced: "Balanced" } as Record<string, string>)[v];
    default:
      return String(v);
  }
}

/** Where the value came from, in words the user can act on */
export function source(st: AgentState, k: Key): { text: string; tone: "read" | "you" | "default" | "missing" | "form" } {
  const f = field(st, k);
  if (k === "weightPerPiece" && !f && st.shipment.totalWeight) return { text: "Needs the pieces", tone: "missing" };
  if (!f) return k === "priority" ? { text: "Default", tone: "default" } : { text: "Missing", tone: "missing" };
  if (k === "dims" && st.shipment.dimUnit?.source === "default") return { text: "From your message · cm assumed", tone: "default" };
  return f.source === "user" ? { text: "You set it", tone: "you" } : f.source === "default" ? { text: "Default", tone: "default" } : f.source === "form" ? { text: "From the form", tone: "form" } : { text: "From your message", tone: "read" };
}

/* ---------- editing ---------- */

export type Draft = string | string[] | { h: string; w: string; l: string };

export function initialDraft(st: AgentState, k: Key): Draft {
  const f = field(st, k);
  const v = f?.value as unknown;
  if (k === "dims") {
    const d = v as { h: number; w: number; l: number } | undefined;
    return { h: d ? String(d.h) : "", w: d ? String(d.w) : "", l: d ? String(d.l) : "" };
  }
  if (k === "handling") return (v as string[] | undefined) ?? [];
  if (k === "deadline") return v ? String(v).slice(0, 10) : "";
  if (k === "priority") return (v as string | undefined) ?? "balanced";
  return v == null ? "" : String(v);
}

const num = (s: string) => {
  const n = Number(s.replace(/,/g, "").trim());
  return s.trim() !== "" && Number.isFinite(n) ? n : NaN;
};

/** The draft as the agent's value, or an error message the user can fix */
export function parse(k: Key, d: Draft): { ok: true; value: unknown } | { ok: false; error: string } {
  if (k === "dims") {
    const x = d as { h: string; w: string; l: string };
    const [h, w, l] = [num(x.h), num(x.w), num(x.l)];
    if ([h, w, l].some((n) => !(n > 0))) return { ok: false, error: "Enter height, width and length, each above 0." };
    return { ok: true, value: { h, w, l } };
  }
  if (k === "handling") return { ok: true, value: d };
  const s = String(d).trim();
  if (!s) return { ok: false, error: "Enter a value, or leave this question for later." };
  if (k === "pieces") {
    const n = num(s);
    return Number.isInteger(n) && n > 0 ? { ok: true, value: n } : { ok: false, error: "Enter a whole number of pieces, like 10." };
  }
  if (k === "weightPerPiece" || k === "budgetUsd") {
    const n = num(s);
    return n > 0 ? { ok: true, value: n } : { ok: false, error: "Enter a number above 0." };
  }
  if (k === "deadline") return { ok: true, value: `${s}T23:59:00Z` };
  return { ok: true, value: s };
}

export function Editor({ st, k, draft, onDraft, error, autoFocus }: { st: AgentState; k: Key; draft: Draft; onDraft: (d: Draft) => void; error?: string; autoFocus?: boolean }) {
  const def = DEFS[k]!;
  const id = `ag-${k}`;
  const unit = def.unit?.(st);
  if (def.kind === "dims") {
    const x = draft as { h: string; w: string; l: string };
    return (
      <div className="p-row" role="group" aria-label={label(k)}>
        {(["h", "w", "l"] as const).map((p, i) => (
          <TextInput key={p} id={i === 0 ? id : `${id}-${p}`} aria-label={["Height", "Width", "Length"][i]} placeholder={["Height", "Width", "Length"][i]} value={x[p]} inputMode="decimal" width={96} error={error} onChange={(v) => onDraft({ ...x, [p]: v })} />
        ))}
        <span className="a-unit">{st.shipment.dimUnit?.value ?? "cm"}</span>
      </div>
    );
  }
  if (def.kind === "chips") return <Chips id={id} options={HANDLING} value={draft as string[]} onChange={onDraft} />;
  if (def.kind === "select")
    return <Select id={id} label={label(k)} value={draft as string} options={def.options!} onChange={onDraft} width={def.width ?? 340} placeholder="Choose…" error={error} />;
  if (def.kind === "date" || def.kind === "deadline")
    return (
      <div className="p-row" style={{ alignItems: "center" }}>
        <TextInput id={id} type="date" min={TODAY} value={draft as string} onChange={onDraft} width={200} error={error} aria-label={label(k)} />
        {def.kind === "deadline" && <span className="a-unit">arrive by the end of that day</span>}
      </div>
    );
  return (
    <div className="p-row" style={{ alignItems: "center" }}>
      <input
        id={id}
        className="p-input"
        value={draft as string}
        placeholder={def.placeholder}
        inputMode={def.kind === "number" ? "decimal" : undefined}
        style={{ width: def.width ?? "100%", maxWidth: 420 }}
        aria-label={label(k)}
        aria-invalid={error ? true : undefined}
        autoFocus={autoFocus}
        onChange={(e) => onDraft(e.target.value)}
      />
      {unit && <span className="a-unit">{unit}</span>}
    </div>
  );
}

/** A field shown with its source, that opens in place to be corrected. Saving re-plans from the first task it affects. */
export function EditableValue({ st, k, onSave, disabled }: { st: AgentState; k: Key; onSave: (k: Key, v: unknown) => void; disabled?: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>("");
  const [error, setError] = useState<string>();
  const src = source(st, k);
  const value = show(st, k);
  const start = () => {
    setDraft(initialDraft(st, k));
    setError(undefined);
    setOpen(true);
  };
  const save = () => {
    const r = parse(k, draft);
    if (!r.ok) return setError(r.error);
    setOpen(false);
    onSave(k, r.value);
  };
  return (
    <div className={`a-fact${open ? " open" : ""}`}>
      <dt>{label(k)}</dt>
      {open ? (
        <dd>
          <form
            className="a-edit"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <Editor st={st} k={k} draft={draft} onDraft={setDraft} error={error} autoFocus />
            {error && <p className="p-err">{error}</p>}
            <div className="a-edit-actions">
              <button type="submit" className="p-btn sm">Save and re-plan</button>
              <button type="button" className="p-link" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          </form>
        </dd>
      ) : (
        <dd>
          <span className={value ? "a-val" : "a-val empty"}>{value || "Not given"}</span>
          <span className={`a-src ${src.tone}`}>{src.text}</span>
          {!disabled && (
            <button type="button" className="a-change" onClick={start} aria-label={`Change ${label(k).toLowerCase()}`}>
              {value ? "Change" : "Add"}
            </button>
          )}
        </dd>
      )}
    </div>
  );
}

export type { Shipment };
