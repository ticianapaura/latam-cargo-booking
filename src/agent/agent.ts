/* The CargoPilot agent (mock mode): a state-based planner that decides the next tool from the current state,
   runs it through the policy, records everything in an audit log, and stops wherever a person must act.

   Planning: each tool's result is remembered with a key built from its inputs (memo). When an input changes
   (an answer, an edit, a new price), that key no longer matches, so the tool and everything after it runs again.
   The same goal with different data takes a different path; there is no script of messages. */

import { airport } from "../proto/data.ts";
import type { Booking } from "../proto/data.ts";
import { ruleBasedInterpreter } from "./interpret.ts";
import type { Interpreter } from "./interpret.ts";
import type { BookingLedger } from "./ledger.ts";
import { ApiError } from "./mockApi.ts";
import type { MockCarrierApi } from "./mockApi.ts";
import { TOOL_LEVEL, authorize, commercialExceptions, currentApproval, hardRestrictions, missingDocuments, termsHash } from "./policy.ts";
import { LABELS, NEEDED_TO_PROPOSE, NEEDED_TO_SEARCH, airportsIn, chargeableKg, handoffBooking, missing, toBooking } from "./shipment.ts";
import { step1Errors, step2Errors } from "../proto/data.ts";
import type { GuardedStore } from "./storage.ts";
import type {
  AgentState, AgentStatus, Approval, Constraints, Field, Flight, LogEntry, Option, Proposal, Question, Quote, Role, Shipment, ShipmentKey, Task, TaskId, ToolName,
} from "./types.ts";
import type { Clock } from "./util.ts";
import { hash, iso, sleep, stable } from "./util.ts";

export const STORE_KEY = "cargopilot.agent.v1";
const MAX_ATTEMPTS = 3; // a read-only tool is tried up to 3 times before the task is marked Failed

export type Deps = { api: MockCarrierApi; ledger: BookingLedger; store: GuardedStore; clock: Clock; interpreter?: Interpreter; delayMs?: number };

type Memo = Partial<Record<"validate" | "restrictions" | "search" | "rates" | "compare" | "draft", string>>;
type Internal = AgentState & { memo: Memo; forceNewVersion?: string; ambiguous: { field: ShipmentKey; codes: string[] }[] };

export function initialState(id = "A-" + Date.now().toString(36)): Internal {
  return {
    schema: 1, id, mode: "mock", goalText: "", shipment: {}, constraints: {}, questions: [], restrictions: [],
    status: "idle", statusText: "Describe the shipment to start.", flights: [], quotes: [], options: [], approvals: [],
    rejectedFlightIds: [], attempts: {}, log: [], seq: 0, memo: {}, ambiguous: [],
  };
}

const isState = (v: unknown): v is Internal => {
  const s = v as Internal;
  return !!s && s.schema === 1 && s.mode === "mock" && typeof s.status === "string" && Array.isArray(s.log) && Array.isArray(s.approvals) && typeof s.shipment === "object" && typeof s.memo === "object";
};

export class Agent {
  state: Internal;
  private deps: Required<Omit<Deps, "interpreter">> & { interpreter: Interpreter };
  private listeners = new Set<(s: AgentState) => void>();
  private running = false;
  /** Set by pause or cancel while a run is in progress: the run stops at the next tool boundary and ends in this status */
  private halt?: { status: "paused" | "cancelled"; text: string };

  constructor(deps: Deps, state?: Internal) {
    this.deps = { delayMs: 0, interpreter: ruleBasedInterpreter, ...deps };
    this.state = state ?? initialState();
  }

  /** Loads a saved agent from session storage. Malformed or edited data is dropped. */
  static restore(deps: Deps): Agent | null {
    const saved = deps.store.get(STORE_KEY, isState);
    if (!saved) return null;
    const agent = new Agent(deps, saved);
    agent.log("system", "control", "Restored from this tab's session storage.");
    // A booking that was in flight when the page reloaded is never re-sent blindly: its status is checked first
    if (saved.status === "booking") agent.setStatus("status_unknown", "The page reloaded during booking. Checking whether it went through.");
    else if (saved.status === "running") agent.setStatus("paused", "Restored after a reload. Resume to continue.", true);
    return agent;
  }

  subscribe(fn: (s: AgentState) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /* ---------------- user and manager actions ---------------- */

  async submitGoal(text: string) {
    const st = this.state;
    if (["booking", "confirmed"].includes(st.status)) return this.deny("submitGoal", "A booking is already in progress or done; start a new one.");
    Object.assign(st, initialState(st.id), { log: st.log, seq: st.seq });
    st.goalText = text.trim();
    this.log("user", "goal", `Goal: “${st.goalText}”`);
    const r = this.deps.interpreter.interpret(st.goalText);
    st.shipment = r.shipment;
    st.constraints = r.constraints;
    st.ambiguous = r.ambiguous.map((a) => ({ field: a.field, codes: a.codes }));
    for (const n of r.notes) this.log("agent", "decision", n);
    this.log("agent", "decision", `Interpreted ${Object.keys(r.shipment).length} shipment fields and ${Object.keys(r.constraints).length} constraints with fixed rules (mock mode, no language model).`);
    return this.run();
  }

  /** An answer to a question, or a correction of any field. Re-plans from the first task it affects. */
  async setField(key: ShipmentKey | keyof Constraints, value: unknown, kind: "answer" | "edit" = "edit") {
    const st = this.state;
    if (st.status === "booking") return this.deny("setField", "A booking is being confirmed; changes wait until it finishes.");
    if (st.status === "confirmed") return this.deny("setField", "This booking is confirmed; changing it needs a new approval (not supported in this prototype).");
    const f: Field<unknown> = { value, source: "user" };
    if (key === "deadline" || key === "budgetUsd" || key === "priority") (st.constraints as Record<string, unknown>)[key] = f;
    else (st.shipment as Record<string, unknown>)[key] = f;
    st.ambiguous = st.ambiguous.filter((a) => a.field !== key);
    // A total weight read earlier becomes a per-piece weight once the number of pieces is known
    if (key === "pieces" && st.shipment.totalWeight && !st.shipment.weightPerPiece) {
      st.shipment.weightPerPiece = { value: Math.round((st.shipment.totalWeight.value / Number(value)) * 100) / 100, source: "message" };
    }
    this.log("user", kind, `${LABELS[key]}: ${describe(key, value)}`);
    if (st.status === "paused") return this.save();
    if (["blocked", "needs_user", "failed", "handoff", "needs_manager", "awaiting_approval", "idle", "cancelled"].includes(st.status)) {
      if (st.status === "cancelled" || st.status === "idle") return this.save();
      return this.run();
    }
    return this.save();
  }

  /** The user picks another option than the recommended one (L1: the agent recommends, the user decides) */
  async selectOption(flightId: string) {
    const st = this.state;
    if (!st.options.some((o) => o.flight.id === flightId)) return this.deny("selectOption", "That option isn't in the current list.");
    st.selectedFlightId = flightId;
    this.log("user", "decision", `Selected ${st.options.find((o) => o.flight.id === flightId)!.flight.flightNo}.`);
    return this.run();
  }

  /** The user approves the exact current proposal, including any late arrival it carries */
  async approve(role: Role = "coordinator") {
    const st = this.state;
    const p = st.proposal;
    if (role !== "coordinator") return this.deny("approve", "Only the user who books (coordinator) approves the booking itself.");
    if (st.status !== "awaiting_approval" || !p) return this.deny("approve", "There's nothing waiting for approval.");
    const add = (kind: Approval["kind"], exceptionId?: string) => {
      const a: Approval = { id: `AP-${hash(`${p.id}${p.version}${kind}${exceptionId ?? ""}${st.seq}`)}`, kind, exceptionId, by: "coordinator", proposalId: p.id, version: p.version, termsHash: p.termsHash, at: this.now() };
      st.approvals.push(a);
      this.log("user", "approval", kind === "booking" ? `Approved proposal v${p.version} for USD ${p.option.quote.total.toFixed(2)}.` : `Accepted: ${p.option.exceptions.find((e) => e.id === exceptionId)!.text}`, { proposalId: p.id, version: p.version, approvalId: a.id });
    };
    for (const ex of p.option.exceptions.filter((e) => e.approver === "coordinator")) add("exception", ex.id);
    add("booking");
    return this.run();
  }

  async reject(reason = "") {
    const st = this.state;
    const p = st.proposal;
    if (!p || st.status !== "awaiting_approval") return this.deny("reject", "There's nothing waiting for approval.");
    st.rejectedFlightIds.push(p.option.flight.id);
    st.selectedFlightId = undefined; // the proposal stays, so the next one is v+1 of it, with its changes listed
    this.log("user", "rejection", `Rejected proposal v${p.version} (${p.option.flight.flightNo})${reason ? `: ${reason}` : ""}. Looking at the other options.`, { proposalId: p.id, version: p.version });
    return this.run();
  }

  /** The Manager decides a commercial exception. Hard restrictions have no approval path: this refuses them. */
  async decideException(exceptionId: string, role: Role, approve: boolean) {
    const st = this.state;
    const p = st.proposal;
    if (exceptionId.startsWith("RESTRICTION") || st.restrictions.some((r) => r.code === exceptionId))
      return this.deny("decideException", "Hard restrictions can't be approved by anyone, the Manager included. Only a changed shipment clears them.");
    const ex = p?.option.exceptions.find((e) => e.id === exceptionId);
    if (!p || !ex) return this.deny("decideException", "No such exception on the current proposal.");
    if (ex.approver !== role) return this.deny("decideException", `This exception needs the ${ex.approver === "manager" ? "Logistics Manager" : "user"}.`);
    if (approve) {
      const a: Approval = { id: `AP-${hash(`${p.id}${p.version}${ex.id}${st.seq}`)}`, kind: "exception", exceptionId: ex.id, by: role, proposalId: p.id, version: p.version, termsHash: p.termsHash, at: this.now() };
      st.approvals.push(a);
      this.log("manager", "approval", `Approved exception: ${ex.text}`, { proposalId: p.id, version: p.version, approvalId: a.id });
    } else {
      st.rejectedFlightIds.push(p.option.flight.id);
      st.selectedFlightId = undefined;
      this.log("manager", "rejection", `Rejected exception: ${ex.text} Looking at the other options.`, { proposalId: p.id, version: p.version });
    }
    return this.run();
  }

  /** Applies a one-click fix the agent suggested (e.g. EZE instead of MDZ). Only on the user's click. */
  async applySuggestion(code: string) {
    const r = this.state.restrictions.find((x) => x.code === code && x.suggestion);
    if (!r?.suggestion) return this.deny("applySuggestion", "No suggestion for that restriction.");
    return this.setField(r.suggestion.field, r.suggestion.value, "edit");
  }

  pause() {
    const st = this.state;
    if (["confirmed", "cancelled", "paused", "idle"].includes(st.status)) return;
    if (st.status === "booking") return this.deny("pause", "A booking is being confirmed; it can't be paused halfway.");
    const text = "Paused. Nothing more will run until you resume.";
    if (this.running) this.halt = { status: "paused", text };
    this.setStatus("paused", text, true);
    this.log("user", "control", "Paused.");
    this.save();
  }

  async resume() {
    const st = this.state;
    if (st.status !== "paused") return;
    this.log("user", "control", "Resumed.");
    st.status = st.pausedFrom === "status_unknown" ? "status_unknown" : "running";
    st.pausedFrom = undefined;
    return this.run();
  }

  cancel() {
    const st = this.state;
    if (st.status === "booking") return this.deny("cancel", "A booking is being confirmed; wait for the answer, then cancel it if needed.");
    if (st.status === "confirmed") return this.deny("cancel", "This booking is confirmed; cancelling it needs a separate approval (not supported in this prototype).");
    st.proposal = undefined;
    const text = st.booking ? "Cancelled." : "Cancelled. Nothing was booked.";
    if (this.running) this.halt = { status: "cancelled", text };
    this.setStatus("cancelled", text);
    this.log("user", "control", st.booking ? "Cancelled." : "Cancelled. Nothing was booked and the draft was discarded.");
    this.save();
  }

  /** Retry after a failure. A booking retry reuses the same idempotency key, so it can't book twice. */
  async retry() {
    const st = this.state;
    if (st.status !== "failed" && st.status !== "status_unknown") return;
    st.attempts = {};
    this.log("user", "control", `Retry${st.failedTool ? ` (${st.failedTool})` : ""}.`);
    st.failedTool = undefined;
    if (st.status === "failed") st.status = "running";
    return this.run();
  }

  /** Everything known so far, as the booking form's data, for "Continue in the form" or a specialist hand-off */
  handoff(): Partial<Booking> {
    this.log("agent", "decision", "Handed the shipment to the manual form with every field known so far. The form applies the same hard restrictions.");
    this.save();
    return handoffBooking(this.state.shipment);
  }

  /* ---------------- the plan ---------------- */

  /** The plan as the user sees it, derived from state every time */
  plan(): Task[] {
    const st = this.state;
    const m = st.memo;
    const k = this.keys();
    const t = (id: TaskId, label: string, level: Task["level"], status: Task["status"], detail?: string): Task => ({ id, label, level, status, detail });
    const done = (key: keyof Memo) => m[key] !== undefined && m[key] === k[key];
    const waitingUser = st.status === "needs_user";
    const tasks: Task[] = [
      t("interpret", "Understand the goal", "L3", st.goalText ? "done" : "pending"),
      t("validate", "Validate shipment information", "L3", done("validate") ? (st.questions.length ? "needs_user" : "done") : "pending", st.questions.length ? `${st.questions.length} question(s)` : undefined),
      t("restrictions", "Check cargo restrictions", "L3", st.status === "blocked" ? "blocked" : st.status === "handoff" ? "blocked" : done("restrictions") ? "done" : "pending"),
      t("search", "Search available flights", "L3", done("search") ? (st.flights.length ? "done" : "needs_user") : "pending", done("search") ? `${st.flights.length} found` : undefined),
      t("rates", "Retrieve freight rates", "L3", done("rates") ? "done" : "pending"),
      t("compare", "Compare options and recommend one", "L1", done("compare") ? "done" : "pending"),
      t("draft", "Prepare a booking proposal (not binding)", "L3", st.proposal && done("draft") ? "done" : "pending", st.proposal ? `v${st.proposal.version}` : undefined),
      t("approval", "Your approval, and the Manager's for exceptions", "L2", st.booking ? "done" : st.status === "needs_manager" ? "needs_manager" : st.status === "awaiting_approval" ? "needs_user" : currentApproval(st, "booking") ? "done" : "pending"),
      t("confirm", "Confirm the booking", "L2", st.booking ? "done" : st.status === "booking" || st.status === "status_unknown" ? "running" : st.status === "failed" && st.failedTool === "confirmBooking" ? "failed" : "pending"),
    ];
    for (const task of tasks) if (st.status === "failed" && st.failedTool && toolTask(st.failedTool) === task.id) task.status = "failed";
    if (waitingUser && st.questions.some((q) => NEEDED_TO_PROPOSE.includes(q.field as ShipmentKey) || q.field === "docs")) {
      const d = tasks.find((x) => x.id === "draft")!;
      d.status = "needs_user";
    }
    return tasks;
  }

  private keys() {
    const st = this.state;
    const s = st.shipment;
    const val = (f?: Field<unknown>) => f?.value;
    const shipKey = hash(stable(Object.fromEntries(Object.entries(s).map(([key, f]) => [key, (f as Field<unknown>).value]))));
    const searchKey = hash(stable([val(s.originAirport), val(s.destAirport), val(s.pickupDate), chargeableKg(s)]));
    const ratesKey = hash(stable([searchKey, st.flights.map((f) => f.id), val(s.cargoType), chargeableKg(s)]));
    const compareKey = hash(stable([ratesKey, st.quotes.map((q) => q.id + q.total), stable(st.constraints), st.rejectedFlightIds]));
    const draftKey = hash(stable([shipKey, compareKey, st.selectedFlightId, st.forceNewVersion]));
    return { validate: shipKey, restrictions: shipKey, search: searchKey, rates: ratesKey, compare: compareKey, draft: draftKey };
  }

  /** Runs tools until the agent needs a person, is done, or is paused. One step at a time, decided from state. */
  async run(): Promise<void> {
    if (this.running) return;
    this.running = true;
    try {
      for (let guard = 0; guard < 40; guard++) {
        if (this.halt || ["paused", "cancelled", "confirmed"].includes(this.state.status)) break;
        let more: boolean;
        try {
          more = await this.step();
        } catch (e) {
          if (e instanceof StopRun) break; // the status already says why
          if (e instanceof PolicyError) {
            this.setStatus("failed", e.message);
            break;
          }
          this.log("system", "tool_error", `Unexpected error: ${e instanceof Error ? e.message : String(e)}`);
          this.setStatus("failed", "Something unexpected went wrong. Nothing was booked by this step; retry when ready.");
          break;
        }
        this.save();
        if (!more) break;
      }
    } finally {
      this.running = false;
      if (this.halt) {
        const h = this.halt;
        this.halt = undefined;
        this.state.status = h.status; // a tool may have set "running" after the pause; the user's pause wins
        this.state.statusText = h.text;
      }
      this.save();
    }
  }

  /** One planning step. Returns false when it stopped to wait. */
  private async step(): Promise<boolean> {
    const st = this.state;
    const k = this.keys();
    const m = st.memo;
    const s = st.shipment;

    if (!st.goalText) return this.wait("idle", "Describe the shipment to start.");

    // Unknown status after a timeout: always check before anything else
    if (st.status === "status_unknown" && st.idempotencyKey) return this.checkStatus();

    // 1 · Validate what we have, ask for what's missing
    if (m.validate !== k.validate) {
      await this.tool("validateShipment", { shipment: s }, () => {
        const b = toBooking(s);
        const errs = { ...step1Errors(b), ...step2Errors(b) };
        return { missingToSearch: missing(s, NEEDED_TO_SEARCH), missingToPropose: missing(s, NEEDED_TO_PROPOSE), formErrors: Object.keys(errs) };
      });
      m.validate = k.validate;
    }

    // 2 · Restrictions, on whatever is known so far: a blocked or specialist shipment is said at once, before more questions.
    //     Hard ones block for everyone; specialist cargo goes to the form.
    if (m.restrictions !== k.restrictions) {
      const r = await this.tool("checkCargoRestrictions", { shipment: s }, () => ({ restrictions: hardRestrictions(s) }));
      st.restrictions = r.restrictions;
      m.restrictions = k.restrictions;
    }
    if (st.restrictions.some((r) => r.kind === "specialist")) {
      st.questions = [];
      return this.wait("handoff", "This cargo needs a specialist: continue in the form. Nothing you entered is lost.");
    }
    if (st.restrictions.length) {
      st.questions = [];
      return this.wait("blocked", `Blocked: ${st.restrictions[0].text} Only a change to the shipment clears it.`);
    }

    // 3 · Ask for what a search needs (nothing is guessed)
    const qs = this.questionsToSearch();
    if (qs.length) {
      st.questions = qs;
      return this.wait("needs_user", `${qs.length === 1 ? "One question" : `${qs.length} questions`} before searching for flights.`);
    }

    // 4 · Search
    if (m.search !== k.search) {
      const r = await this.tool("searchAvailableFlights", { origin: s.originAirport!.value, dest: s.destAirport!.value, fromDate: s.pickupDate!.value, chargeableKg: chargeableKg(s) }, (i) => ({
        flights: this.deps.api.search(i.origin, i.dest, i.fromDate, i.chargeableKg),
      }));
      if (!r) return false;
      st.flights = r.flights;
      st.quotes = [];
      st.options = [];
      m.search = k.search;
      m.rates = m.compare = undefined; // new availability: prices and the comparison are redone
      return true; // keys downstream depend on the new flights
    }
    if (!st.flights.length) {
      st.questions = [{ id: "Q-nodate", field: "pickupDate", reason: "missing", text: `No flights on this route from ${s.pickupDate!.value} with space for ${chargeableKg(s)} kg (synthetic data). Try another pickup date.` }];
      return this.wait("needs_user", "No flights found. Change the date or the route.");
    }

    // 5 · Rates
    if (m.rates !== k.rates) {
      const r = await this.tool("retrieveFreightRates", { flightIds: st.flights.map((f) => f.id) }, () => ({ quotes: this.deps.api.rates(st.flights, s) }));
      if (!r) return false;
      st.quotes = r.quotes;
      m.rates = k.rates;
      return true;
    }

    // 6 · Compare and recommend
    if (m.compare !== k.compare) {
      const r = await this.tool("compareShippingOptions", { priority: st.constraints.priority?.value ?? "balanced", budgetUsd: st.constraints.budgetUsd?.value, deadline: st.constraints.deadline?.value }, () => ({ options: this.compare() }));
      st.options = r.options;
      if (!st.selectedFlightId || !st.options.some((o) => o.flight.id === st.selectedFlightId)) st.selectedFlightId = st.options.find((o) => o.recommended)?.flight.id;
      m.compare = k.compare;
      return true;
    }
    if (!st.options.length) {
      st.proposal = undefined;
      st.questions = [{ id: "Q-none-left", field: "pickupDate", reason: "missing", text: "Every option was rejected. Try another pickup date, or change the shipment." }];
      return this.wait("needs_user", "No options left.");
    }

    // 7 · The proposal needs the rest of the details
    const toPropose = this.questionsToPropose();
    if (toPropose.length) {
      st.questions = toPropose;
      return this.wait("needs_user", "Options are ready. A few details are needed to prepare the proposal.");
    }
    st.questions = [];

    // 8 · Draft (versioned). A change in terms makes a new version and voids earlier approvals.
    if (m.draft !== k.draft || !st.proposal) {
      const option = st.options.find((o) => o.flight.id === st.selectedFlightId)!;
      const r = await this.tool("prepareBookingDraft", { flightId: option.flight.id, quoteId: option.quote.id }, () => ({ proposal: this.draft(option) }));
      st.proposal = r.proposal;
      st.forceNewVersion = undefined;
      m.draft = this.keys().draft;
      return true;
    }
    const p = st.proposal;

    // 9 · Documents: drafts are fine without them, confirming isn't
    const docs = missingDocuments(p.shipment);
    if (docs.length) {
      st.questions = [{ id: "Q-docs", field: "docs", reason: "missing", text: docs.map((d) => d.text).join(" ") + " Attach them to confirm." }];
      return this.wait("needs_user", "The proposal is ready. Required documents are missing, so it can't be confirmed yet.");
    }

    // 10 · Commercial exceptions waiting for the Manager
    const forManager = p.option.exceptions.filter((e) => e.approver === "manager" && !currentApproval(st, "exception", e.id, "manager"));
    if (forManager.length) return this.wait("needs_manager", `Waiting for the Logistics Manager: ${forManager.map((e) => e.text).join(" ")}`);

    // 11 · The user's approval of this exact version
    if (!currentApproval(st, "booking")) return this.wait("awaiting_approval", `Proposal v${p.version} is ready for your approval.`);

    // 12 · Approved: renew an expired quote first; a different price makes a new version
    if (p.option.quote.validUntil < this.now()) {
      const r = await this.tool("retrieveFreightRates", { flightIds: [p.option.flight.id], requote: true }, () => ({ quotes: this.deps.api.rates([p.option.flight], s, { requote: true }) }));
      if (!r) return false;
      this.replaceQuote(r.quotes[0], "The quote expired and was renewed");
      return true;
    }

    // 13 · Confirm, with one idempotency key per proposal version
    return this.confirm();
  }

  /* ---------------- tool execution ---------------- */

  /** Runs one tool: policy check, audit log, output check, and retries for read-only tools */
  private async tool<I, O>(name: ToolName, input: I, run: (i: I) => O): Promise<O> {
    const st = this.state;
    const decision = authorize(name, st, this.now());
    if (!decision.ok) {
      this.log("system", "denied", `${name} refused: ${decision.reason}`, { tool: name, level: TOOL_LEVEL[name] });
      throw new PolicyError(decision.reason);
    }
    if (this.halt) throw new StopRun();
    st.status = "running";
    st.statusText = TOOL_TEXT[name];
    this.emit();
    for (;;) {
      st.attempts[name] = (st.attempts[name] ?? 0) + 1;
      this.log("agent", "tool_call", TOOL_TEXT[name], { tool: name, level: TOOL_LEVEL[name], input: summarize(input) });
      await sleep(this.deps.delayMs);
      const halt = this.halt as Agent["halt"]; // pause() or cancel() may have run during the await
      if (halt) {
        this.log("agent", "control", `${name} stopped before it ran: ${halt.status} by the user.`, { tool: name });
        throw new StopRun();
      }
      try {
        const out = run(input);
        if (out === undefined || out === null || typeof out !== "object") throw new ApiError("BAD_OUTPUT", "The tool returned something unexpected.");
        this.log("agent", "tool_result", resultText(name, out), { tool: name, level: TOOL_LEVEL[name], output: summarize(out) });
        st.attempts[name] = 0;
        return out;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        this.log("agent", "tool_error", `${name} failed (attempt ${st.attempts[name]} of ${MAX_ATTEMPTS}): ${msg}`, { tool: name });
        if ((st.attempts[name] ?? 0) >= MAX_ATTEMPTS) {
          st.failedTool = name;
          this.setStatus("failed", `${TOOL_TEXT[name].replace(/…$/, "")} didn't work after ${MAX_ATTEMPTS} attempts. Retry when you're ready.`);
          throw new StopRun();
        }
        await sleep(this.deps.delayMs);
      }
    }
  }

  private async confirm(): Promise<boolean> {
    const st = this.state;
    const p = st.proposal!;
    const key = `BK-${p.id}-v${p.version}`;
    st.idempotencyKey = key;
    const decision = authorize("confirmBooking", st, this.now());
    if (!decision.ok) {
      this.log("system", "denied", `confirmBooking refused: ${decision.reason}`, { tool: "confirmBooking", level: "L2", idempotencyKey: key });
      return this.wait(decision.code === "QUOTE_EXPIRED" ? "running" : "awaiting_approval", decision.reason);
    }
    this.setStatus("booking", `Booking ${p.option.flight.flightNo}…`);
    this.save();
    const approval = currentApproval(st, "booking")!;
    this.log("agent", "tool_call", `Confirming the booking for USD ${p.option.quote.total.toFixed(2)}.`, { tool: "confirmBooking", level: "L2", proposalId: p.id, version: p.version, approvalId: approval.id, idempotencyKey: key });
    await sleep(this.deps.delayMs);
    const r = this.deps.api.confirm({ idempotencyKey: key, proposalId: p.id, version: p.version, flight: p.option.flight, quote: p.option.quote, shipment: p.shipment });
    if (r.ok) return this.booked(r.booking);
    switch (r.code) {
      case "TIMEOUT":
        this.log("agent", "tool_error", "No answer from the booking service. It may or may not have booked; checking before any retry.", { tool: "confirmBooking", idempotencyKey: key });
        this.setStatus("status_unknown", "No answer from the booking service. Checking whether it went through.");
        return true;
      case "BOOKING_FAILED":
        this.log("agent", "tool_error", "The booking service refused. Nothing was booked.", { tool: "confirmBooking", idempotencyKey: key });
        st.failedTool = "confirmBooking";
        return this.wait("failed", "Booking failed and nothing was booked. Retry uses the same key, so it can't book twice.");
      case "UNAVAILABLE":
        this.log("agent", "invalidation", "The flight's space was released before booking. Searching again; the approval no longer applies.", { proposalId: p.id, version: p.version });
        st.memo.search = undefined;
        st.forceNewVersion = `space-${st.seq}`;
        return true;
      case "PRICE_CHANGED":
        this.replaceQuote(r.newQuote!, "The price changed before booking");
        return true;
    }
  }

  private booked(b: AgentState["booking"]) {
    const st = this.state;
    st.booking = b!;
    this.log("agent", "tool_result", `Booked: ${b!.bookingId}, AWB ${b!.awb} (synthetic).`, { tool: "confirmBooking", level: "L2", idempotencyKey: b!.idempotencyKey, proposalId: b!.proposalId, version: b!.version });
    return this.wait("confirmed", `Booked ${b!.bookingId}. AWB ${b!.awb}.`);
  }

  private async checkStatus(): Promise<boolean> {
    const st = this.state;
    const key = st.idempotencyKey!;
    const r = await this.tool("getBookingStatus", { idempotencyKey: key }, (i) => ({ booking: this.deps.api.status(i.idempotencyKey) })).catch((e) => {
      if (e instanceof StopRun) {
        this.setStatus("status_unknown", "Still no way to know whether it booked. Nothing will be retried until the status is known; try checking again.");
        return null;
      }
      throw e;
    });
    if (!r) return false;
    if (r.booking) return this.booked(r.booking);
    st.failedTool = "confirmBooking";
    return this.wait("failed", "It didn't go through: nothing was booked. Retry uses the same key, so it can't book twice.");
  }

  /** A new price for the selected flight: a new proposal version, so earlier approvals no longer count */
  private replaceQuote(q: Quote, why: string) {
    const st = this.state;
    const p = st.proposal!;
    const old = p.option.quote;
    st.quotes = st.quotes.map((x) => (x.flightId === q.flightId ? q : x));
    if (q.total !== old.total) {
      this.log("agent", "invalidation", `${why}: USD ${old.total.toFixed(2)} → USD ${q.total.toFixed(2)}. Approvals for v${p.version} no longer apply.`, { proposalId: p.id, version: p.version });
      st.memo.compare = undefined; // exceptions (budget) are re-evaluated on the new price
    } else {
      // Same price: the terms are unchanged, so the approval still applies; only the validity is renewed
      p.option = { ...p.option, quote: q };
      st.options = st.options.map((o) => (o.flight.id === q.flightId ? { ...o, quote: q } : o));
      st.memo.compare = this.keys().compare;
      st.memo.draft = this.keys().draft;
      this.log("agent", "decision", `${why} at the same price (USD ${q.total.toFixed(2)}); the approval still applies.`, { proposalId: p.id, version: p.version });
    }
  }

  /* ---------------- reasoning steps ---------------- */

  private questionsToSearch(): Question[] {
    const st = this.state;
    const out: Question[] = st.ambiguous.map((a) => ({
      id: `Q-${a.field}`,
      field: a.field,
      reason: "ambiguous" as const,
      text: `Which airport? ${a.codes.map((c) => `${c} (${airport(c)!.name}${airport(c)!.international ? "" : ", domestic only"})`).join(" or ")}.`,
      options: a.codes.map((c) => ({ value: c, label: `${c} · ${airport(c)!.name}` })),
    }));
    const TEXT: Partial<Record<ShipmentKey, string>> = {
      cargoType: "What kind of cargo is it?",
      pieces: st.shipment.totalWeight ? `How many pieces is the ${st.shipment.totalWeight.value} ${st.shipment.weightUnit?.value ?? "kg"} split into?` : "How many pieces?",
      weightPerPiece: "How much does each piece weigh?",
      dims: "What are the dimensions of each piece (height × width × length)?",
      originAirport: "Where does it ship from?",
      destAirport: "Where does it go?",
      pickupDate: "When can it be picked up?",
    };
    for (const f of missing(st.shipment, NEEDED_TO_SEARCH)) {
      if (out.some((q) => q.field === f)) continue;
      if (f === "weightPerPiece" && st.shipment.totalWeight && !st.shipment.pieces) continue; // asked through pieces
      if ((f === "originAirport" || f === "destAirport") && st.ambiguous.some((a) => a.field === f)) continue;
      out.push({ id: `Q-${f}`, field: f, reason: "missing", text: TEXT[f] ?? `${LABELS[f]}?` });
    }
    return out;
  }

  private questionsToPropose(): Question[] {
    const TEXT: Partial<Record<ShipmentKey, string>> = {
      description: "How would you describe the cargo, in a few words?",
      pickupTime: "What time can it be picked up (6 AM to 10 PM)?",
      pickupAddress: "Pickup address, with street and number?",
      originPostal: "Postal code of the pickup address?",
      deliveryAddress: "Delivery address, with street and number?",
      destPostal: "Postal code of the delivery address?",
    };
    return missing(this.state.shipment, NEEDED_TO_PROPOSE).map((f) => ({ id: `Q-${f}`, field: f, reason: "missing" as const, text: TEXT[f]! }));
  }

  private compare(): Option[] {
    const st = this.state;
    const prio = st.constraints.priority?.value ?? "balanced";
    const budget = st.constraints.budgetUsd?.value;
    const deadline = st.constraints.deadline?.value;
    const rows = st.flights
      .filter((f) => !st.rejectedFlightIds.includes(f.id))
      .map((flight) => {
        const quote = st.quotes.find((q) => q.flightId === flight.id)!;
        return { flight, quote, exceptions: commercialExceptions({ flight, quote }, budget, deadline) };
      })
      .filter((r) => r.quote);
    if (!rows.length) return [];
    const minT = Math.min(...rows.map((r) => r.flight.transitHours));
    const minP = Math.min(...rows.map((r) => r.quote.total));
    const score = (r: (typeof rows)[0]) =>
      prio === "fastest" ? r.flight.arrives : prio === "cheapest" ? String(r.quote.total).padStart(12, "0") : String(Math.round((r.flight.transitHours / minT + r.quote.total / minP) * 1000)).padStart(8, "0");
    // Options that meet every constraint come first; within each group, the user's priority decides
    const sorted = [...rows].sort((a, b) => a.exceptions.length - b.exceptions.length || (score(a) < score(b) ? -1 : 1));
    const best = sorted[0];
    const fmt = (s: string) => s.slice(0, 16).replace("T", " ");
    return sorted.map((r, i) => {
      const reasons: string[] = [];
      if (prio === "fastest" && r.flight.transitHours === minT) reasons.push("Fastest of the options, as you asked.");
      if (prio === "cheapest" && r.quote.total === minP) reasons.push("Cheapest of the options, as you asked.");
      if (deadline) reasons.push(r.flight.arrives <= deadline ? `Arrives ${fmt(r.flight.arrives)}, before the deadline.` : `Arrives ${fmt(r.flight.arrives)}, after the deadline.`);
      if (budget !== undefined) reasons.push(r.quote.total <= budget ? `USD ${r.quote.total.toFixed(2)}, within the USD ${budget.toFixed(2)} budget.` : `USD ${r.quote.total.toFixed(2)}, over the USD ${budget.toFixed(2)} budget.`);
      if (!reasons.length) reasons.push(`${r.flight.service} service, ${r.flight.transitHours} h door to door, USD ${r.quote.total.toFixed(2)}.`);
      const tradeoffs = sorted
        .filter((o) => o !== r)
        .map((o) => {
          const dp = o.quote.total - r.quote.total;
          const dt = o.flight.transitHours - r.flight.transitHours;
          return `${o.flight.flightNo} (${o.flight.service}): ${dp < 0 ? `USD ${(-dp).toFixed(2)} cheaper` : `USD ${dp.toFixed(2)} more`}, ${dt < 0 ? `${-dt} h faster` : `${dt} h slower`}${o.exceptions.length ? `, ${o.exceptions.map((e) => e.kind === "budget" ? "over budget" : "late").join(" and ")}` : ""}.`;
        });
      return {
        flight: r.flight,
        quote: r.quote,
        rank: i + 1,
        recommended: r === best,
        reasons,
        tradeoffs,
        exceptions: r.exceptions,
        verified: [
          `Flight ${r.flight.flightNo}, departure and arrival (searchAvailableFlights)`,
          `Price breakdown, valid until ${fmt(r.quote.validUntil)} (retrieveFreightRates)`,
          "Cargo restrictions (checkCargoRestrictions)",
        ],
        estimated: ["Door-to-door time includes road legs and is an estimate", "Exact delivery time at the address"],
      };
    });
  }

  private draft(option: Option): Proposal {
    const st = this.state;
    const prev = st.proposal;
    const conditions = [
      "Quote valid 15 minutes; it is checked again before booking, and a new price asks for approval again",
      "Mock mode: flights, prices and the booking are synthetic",
      `Chargeable weight ${option.quote.chargeableKg} kg (the greater of actual and volumetric)`,
    ];
    const base = { shipment: structuredClone(st.shipment), option, conditions };
    const h = termsHash(base);
    const id = prev?.id ?? `P-${hash(st.id + st.goalText)}`;
    // Same terms: same version. The snapshot is refreshed so newly attached documents are seen at confirmation.
    if (prev && prev.termsHash === h && !st.forceNewVersion) return { ...prev, shipment: base.shipment, option };
    const version = prev ? prev.version + 1 : 1;
    const changes: string[] = [];
    if (prev) {
      if (prev.option.flight.id !== option.flight.id) changes.push(`Flight ${prev.option.flight.flightNo} → ${option.flight.flightNo}`);
      if (prev.option.quote.total !== option.quote.total) changes.push(`Price USD ${prev.option.quote.total.toFixed(2)} → USD ${option.quote.total.toFixed(2)}`);
      for (const [key, f] of Object.entries(st.shipment)) {
        const before = (prev.shipment as Record<string, Field<unknown>>)[key]?.value;
        if (stable(before) !== stable((f as Field<unknown>).value) && key !== "totalWeight" && key !== "docs") changes.push(`${LABELS[key as ShipmentKey]} changed`);
      }
      if (st.forceNewVersion?.startsWith("space")) changes.push("Space was searched again after it was released");
      if (prev && st.approvals.some((a) => a.proposalId === prev.id && a.version === prev.version))
        this.log("agent", "invalidation", `Proposal v${prev.version} was approved, but its terms changed (${changes.join("; ") || "conditions"}). v${version} needs approval again.`, { proposalId: id, version });
    }
    return { id, version, termsHash: h, ...base, createdAt: this.now(), changes };
  }

  /* ---------------- bookkeeping ---------------- */

  private wait(status: AgentStatus, text: string): false {
    this.setStatus(status, text);
    return false;
  }

  private setStatus(status: AgentStatus, text: string, keepFrom = false) {
    const st = this.state;
    if (status === "paused" && keepFrom && st.status !== "paused") st.pausedFrom = st.status === "running" ? undefined : st.status;
    st.status = status;
    st.statusText = text;
    this.emit();
  }

  private deny(action: string, reason: string) {
    this.log("system", "denied", `${action} refused: ${reason}`);
    this.save();
    return Promise.resolve();
  }

  private log(actor: LogEntry["actor"], type: LogEntry["type"], summary: string, extra: Partial<LogEntry> = {}) {
    const st = this.state;
    st.seq += 1;
    st.log.push({ seq: st.seq, at: this.now(), actor, type, summary, ...extra });
  }

  private now() {
    return iso(this.deps.clock.now());
  }

  private save() {
    this.deps.store.set(STORE_KEY, this.state);
    this.emit();
  }

  private emit() {
    for (const fn of this.listeners) fn(this.state);
  }
}

/* run() treats these as "stop here"; the status already says why */
class StopRun extends Error {}
export class PolicyError extends Error {}

const TOOL_TEXT: Record<ToolName, string> = {
  validateShipment: "Validating the shipment…",
  checkCargoRestrictions: "Checking cargo restrictions…",
  searchAvailableFlights: "Searching available flights…",
  retrieveFreightRates: "Retrieving freight rates…",
  compareShippingOptions: "Comparing options…",
  prepareBookingDraft: "Preparing the booking proposal…",
  confirmBooking: "Confirming the booking…",
  getBookingStatus: "Checking the booking status…",
};

const TOOL_TASK: Record<ToolName, TaskId> = {
  validateShipment: "validate",
  checkCargoRestrictions: "restrictions",
  searchAvailableFlights: "search",
  retrieveFreightRates: "rates",
  compareShippingOptions: "compare",
  prepareBookingDraft: "draft",
  confirmBooking: "confirm",
  getBookingStatus: "confirm",
};
const toolTask = (t: ToolName): TaskId => TOOL_TASK[t];

function resultText(name: ToolName, out: unknown): string {
  const o = out as Record<string, unknown>;
  switch (name) {
    case "validateShipment": {
      const m = (o.missingToSearch as string[]).length;
      return m ? `${m} field(s) missing before a search.` : "Enough information to search.";
    }
    case "checkCargoRestrictions": {
      const r = o.restrictions as unknown[];
      return r.length ? `${r.length} restriction(s) found.` : "No restrictions block this shipment.";
    }
    case "searchAvailableFlights":
      return `${(o.flights as Flight[]).length} flight(s) found (synthetic).`;
    case "retrieveFreightRates":
      return `${(o.quotes as Quote[]).length} quote(s) in USD (synthetic).`;
    case "compareShippingOptions": {
      const best = (o.options as Option[]).find((x) => x.recommended);
      return best ? `Recommended ${best.flight.flightNo} of ${(o.options as Option[]).length}.` : "No options to compare.";
    }
    case "prepareBookingDraft":
      return `Proposal v${(o.proposal as Proposal).version} ready (not binding).`;
    case "getBookingStatus":
      return o.booking ? "The booking exists." : "No booking with that key.";
    default:
      return "Done.";
  }
}

function describe(key: string, value: unknown): string {
  if (key === "docs") {
    const names = Object.entries((value ?? {}) as Record<string, { name: string } | null>).filter(([, f]) => f).map(([, f]) => f!.name);
    return names.length ? `${names.length} attached (${names.join(", ")})` : "none attached";
  }
  if (key === "dims" && value && typeof value === "object") {
    const d = value as { h: number; w: number; l: number };
    return `${d.h} × ${d.w} × ${d.l}`;
  }
  return Array.isArray(value) ? value.join(", ") : String(value);
}

/** Keeps the log readable: big arrays become counts */
function summarize(v: unknown): unknown {
  if (Array.isArray(v)) return `${v.length} item(s)`;
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v as object).map(([k, x]) => [k, Array.isArray(x) ? `${x.length} item(s)` : x && typeof x === "object" ? "{…}" : x]));
  return v;
}
