/* Plan with CargoPilot: the agent path of New booking.
   Layout (validated in the spec): the work in one column, in the order it happens, with each question, option
   and approval placed under the task that raised it; a sticky panel with status, progress and controls,
   in the same 330 px slot as the Booking summary on the form's steps.
   Everything the agent does is deterministic (mock mode); the page says so and never claims more. */

import { useEffect, useRef, useState } from "react";
import type { ReactNode, Ref } from "react";
import { questionTask as questionHome } from "../../agent/agent.ts";
import type { Agent } from "../../agent/agent.ts";
import { currentApproval, missingDocuments } from "../../agent/policy.ts";
import type { AgentState, AgentStatus, LogEntry, Option, Question, Restriction, Task, TaskId } from "../../agent/types.ts";
import { MOCK_LABEL } from "../../agent/types.ts";
import { agentSession, EXAMPLES, SIMULATIONS, useAgentSession } from "../agentSession";
import { DEFS, EditableValue, Editor, GROUPS, deadlineText, fmtClock, fmtDT, initialDraft, label, parse, show, source } from "../agentFields";
import type { Draft, Key } from "../agentFields";
import { DOCS, FILLED, airport, fmtDate, fmtTime, usd } from "../data";
import type { Booking } from "../data";
import { useProto } from "../store";
import { I, Icon, Shell } from "../ui";

/* ---------- icons used only here ---------- */
const A = {
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  pause: ["M8 5v14", "M16 5v14"],
  play: "M7 4.5v15l12-7.5z",
  refresh: ["M20 11a8 8 0 0 0-14.6-4.5L4 8", "M4 4v4h4", "M4 13a8 8 0 0 0 14.6 4.5L20 16", "M20 20v-4h-4"],
  shield: ["M12 3 4 6v6c0 4.4 3.4 8 8 9 4.6-1 8-4.6 8-9V6z", "M9 9l6 6M15 9l-6 6"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21a8 8 0 0 1 16 0"],
  form: ["M5 3h14v18H5z", "M9 8h6M9 12h6M9 16h3"],
  plane: "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z",
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7v5l3 2"],
  list: ["M8 6h12M8 12h12M8 18h12", "M4 6h.01M4 12h.01M4 18h.01"],
  dot: "M12 11.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z",
};

const Spinner = ({ size = 16 }: { size?: number }) => (
  <svg className="p-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);

/* ---------- status vocabulary: the same words in the panel, the tasks and the tests ---------- */

type Tone = "work" | "you" | "bad" | "ok" | "info" | "mute";
const STATUS: Record<AgentStatus, { title: string; tone: Tone }> = {
  idle: { title: "Ready when you are", tone: "mute" },
  running: { title: "Working", tone: "work" },
  paused: { title: "Paused", tone: "mute" },
  needs_user: { title: "Needs your answer", tone: "you" },
  blocked: { title: "Blocked", tone: "bad" },
  handoff: { title: "Needs a specialist", tone: "info" },
  needs_manager: { title: "Waiting for the Manager", tone: "you" },
  awaiting_approval: { title: "Ready for your approval", tone: "you" },
  booking: { title: "Booking", tone: "work" },
  status_unknown: { title: "Booking status unknown", tone: "bad" },
  confirmed: { title: "Booked", tone: "ok" },
  failed: { title: "Something didn't work", tone: "bad" },
  cancelled: { title: "Cancelled", tone: "mute" },
};

const LEVEL: Record<Task["level"], { text: string; hint: string }> = {
  L3: { text: "Automatic", hint: "Runs on its own: reads, checks or prepares. Never books." },
  L1: { text: "You choose", hint: "CargoPilot recommends; you can pick any other option." },
  L2: { text: "Needs approval", hint: "Doesn't happen until a person approves it." },
  L0: { text: "You do it", hint: "" },
};

const TASK_TOOL: Partial<Record<TaskId, LogEntry["tool"]>> = {
  validate: "validateShipment",
  restrictions: "checkCargoRestrictions",
  search: "searchAvailableFlights",
  rates: "retrieveFreightRates",
  compare: "compareShippingOptions",
  draft: "prepareBookingDraft",
  confirm: "confirmBooking",
};

const BLANK: Booking = {
  ...FILLED,
  cargoType: "", description: "", pieces: "", weight: "", weightUnit: "kg", height: "", width: "", length: "", dimUnit: "cm", handling: [], instructions: "",
  originCountry: "", originAirport: "", pickupAddress: "", originPostal: "", destCountry: "", destAirport: "", deliveryAddress: "", destPostal: "",
  pickupDate: "", pickupTime: "", docs: { invoice: null, packing: null, health: null, origin: null }, accepted: false,
};

const isBusy = (st: AgentState) => st.status === "booking" || st.status === "status_unknown";
const locked = (st: AgentState) => isBusy(st) || st.status === "confirmed";

/** One progress reading for the plan and the panel. A stopped plan keeps its history but doesn't read as moving. */
export function progress(st: AgentState, tasks: Task[]) {
  const done = tasks.filter((t) => t.status === "done").length;
  const n = tasks.length;
  const stopped: Partial<Record<AgentStatus, string>> = {
    cancelled: `Cancelled after ${done} of ${n} steps`,
    blocked: `Stopped at ${done} of ${n} steps until the shipment changes`,
    handoff: `Stopped at ${done} of ${n} steps: continues in the form`,
    failed: `Stopped at ${done} of ${n} steps until you retry`,
    paused: `Paused at ${done} of ${n} steps`,
    status_unknown: `${done} of ${n} steps done · booking status unknown`,
  };
  const label = st.status === "confirmed" ? `All ${n} steps done` : stopped[st.status] ?? `${done} of ${n} steps done`;
  const tone = st.status === "cancelled" ? "mute" : ["blocked", "failed", "status_unknown"].includes(st.status) ? "bad" : st.status === "paused" || st.status === "handoff" ? "mute" : "ok";
  return { done, n, label, tone };
}

/** One count of the details, for the read card and the "Read your goal" step: same keys, same categories */
export function detailCounts(st: AgentState) {
  const keys = GROUPS.flatMap((g) => g.keys);
  const c = { total: keys.length, message: 0, you: 0, defaults: 0, missing: 0 };
  for (const k of keys) {
    const tone = source(st, k).tone;
    if (tone === "you") c.you++;
    else if (tone === "missing") c.missing++;
    else if (tone === "default" && k === "priority" && !st.constraints.priority) c.defaults++;
    else c.message++;
  }
  return c;
}

/* ---------- the page ---------- */

export default function AgentPage() {
  const s = useAgentSession();
  const a = s.agent;
  const st = a.state;
  const { set, setUi, go } = useProto();
  const manager = s.role === "manager";
  const [logOpen, setLogOpen] = useState(false);
  const logRef = useRef<HTMLDetailsElement>(null);
  // Finished automatic steps are grouped into one line; the panel's step list can open them and jump to any step
  const [showDone, setShowDone] = useState(false);
  const taskRefs = useRef<Partial<Record<TaskId, HTMLLIElement | null>>>({});
  const jump = (id: TaskId) => {
    setShowDone(true);
    window.setTimeout(() => {
      const el = taskRefs.current[id];
      el?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      el?.querySelector<HTMLElement>(".a-task-label")?.focus();
    }, 30);
  };

  const toForm = () => {
    const data = a.handoff();
    set({ ...BLANK, ...data });
    setUi({ fromAgent: true, submitted: {} });
    go("step1", { force: true });
  };
  const openLog = () => {
    setLogOpen(true);
    window.setTimeout(() => logRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }), 30);
  };

  return (
    <Shell active="New booking" headerExtra={<RoleSwitch />} user={manager ? MANAGER : undefined}>
      <button type="button" className="p-back" onClick={() => go("bookings")}>
        <Icon d={I.back} /> Back to bookings
      </button>
      <div className="p-title-row">
        <h1>Plan with CargoPilot</h1>
        <span className="a-mock" title={MOCK_LABEL}>
          <Icon d={I.info} size={15} /> Mock mode · rule-based, no language model
        </span>
      </div>
      <p className="a-lead">
        Describe the shipment. CargoPilot checks it, searches flights, compares prices and prepares a proposal on its own.
        <b> Nothing is booked until you approve it.</b>
      </p>

      <div className="p-grid a-grid">
        <div className="a-work">
          {manager && <ManagerBanner st={st} />}
          {st.status === "idle" ? (
            <Composer agent={a} disabled={manager} onForm={() => go("step1", { fresh: true })} />
          ) : (
            <>
              <GoalCard agent={a} readOnly={manager} />
              <ReadCard agent={a} readOnly={manager} />
              {st.status === "paused" && (
                <div className="a-banner mute" role="status">
                  <Icon d={A.pause} size={18} />
                  <div className="grow">
                    <b>Paused</b> Nothing runs until you resume. You can still change any detail; it's used when you resume.
                  </div>
                  {!manager && (
                    <button type="button" className="p-btn sm" onClick={() => void a.resume()}>
                      <Icon d={A.play} size={14} fill="currentColor" /> Resume
                    </button>
                  )}
                </div>
              )}
              <Plan agent={a} manager={manager} onForm={toForm} onManagerView={() => s.setRole("manager")} showDone={showDone} setShowDone={setShowDone} refs={taskRefs} />
            </>
          )}
          <ActivityLog st={st} open={logOpen} onToggle={setLogOpen} innerRef={logRef} />
        </div>
        <Panel agent={a} manager={manager} onForm={toForm} onLog={openLog} onJump={jump} />
      </div>
    </Shell>
  );
}

const MANAGER = { initials: "MR", name: "Marta Ruiz" };

/* ---------- header: simulated role ---------- */

function RoleSwitch() {
  const s = useAgentSession();
  return (
    <div className="a-role" role="group" aria-label="Viewing as (simulated roles, there are no real accounts)">
      <span>Viewing as</span>
      {(["coordinator", "manager"] as const).map((r) => (
        <button key={r} type="button" aria-pressed={s.role === r} onClick={() => s.setRole(r)}>
          {r === "coordinator" ? "Coordinator" : "Manager"}
        </button>
      ))}
    </div>
  );
}

function ManagerBanner({ st }: { st: AgentState }) {
  const pending = st.status === "needs_manager";
  return (
    <div className="a-banner info" role="note">
      <Icon d={A.user} size={18} />
      <div className="grow">
        <b>You're viewing as Marta Ruiz, Logistics Manager (simulated)</b>
        You approve or reject commercial exceptions, such as going over budget. You can't book, answer for the coordinator or clear a hard restriction.
        {!pending && " Nothing is waiting for you on this plan."}
      </div>
    </div>
  );
}

/* ---------- 1 · the goal ---------- */

function Composer({ agent, disabled, onForm }: { agent: Agent; disabled: boolean; onForm: () => void }) {
  const [text, setText] = useState("");
  const start = () => text.trim() && void agent.submitGoal(text);
  return (
    <section className="a-card a-composer" aria-labelledby="goal-label">
      <label id="goal-label" htmlFor="goal" className="a-h2">Describe the shipment</label>
      <textarea
        id="goal"
        className="p-textarea"
        value={text}
        disabled={disabled}
        placeholder="E.g. Ship 10 boxes of fresh salmon, 25 kg each, 35x40x60 cm, from Buenos Aires to São Paulo, pick up on Nov 11, deliver by Friday, budget of USD 1,200"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) start();
        }}
      />
      <p className="p-help">
        Say what it is, how much, from where to where, when it can be picked up, and any deadline or budget. CargoPilot reads it with fixed rules: what it can't read, it asks you. It never guesses.
      </p>
      <div className="a-examples">
        <span>Try an example:</span>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} type="button" className="p-chip" disabled={disabled} onClick={() => setText(ex.text)}>
            {ex.label}
          </button>
        ))}
      </div>
      <div className="a-row-between">
        <button type="button" className="p-link" onClick={onForm}>
          <Icon d={A.form} size={16} /> Fill in the form instead
        </button>
        <button type="button" className="p-btn" disabled={disabled || !text.trim()} onClick={start}>
          <Icon d={A.spark} size={16} fill="currentColor" /> Start planning
        </button>
      </div>
      <ol className="a-how" aria-label="What happens next">
        <li><b>Checks</b> your details and the cargo rules <Tag level="L3" /></li>
        <li><b>Searches</b> flights, gets prices and compares them <Tag level="L3" /></li>
        <li><b>Recommends</b> one option and prepares a proposal <Tag level="L1" /></li>
        <li><b>Books</b> only after you approve that exact proposal <Tag level="L2" /></li>
      </ol>
    </section>
  );
}

function GoalCard({ agent, readOnly }: { agent: Agent; readOnly: boolean }) {
  const st = agent.state;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(st.goalText);
  return (
    <section className="a-card a-goal" aria-label="Your goal">
      <div className="a-row-between">
        <span className="a-eyebrow">Your goal</span>
        {!readOnly && !locked(st) && !editing && (
          <button type="button" className="a-change" onClick={() => { setText(st.goalText); setEditing(true); }}>Edit goal</button>
        )}
      </div>
      {editing ? (
        <form onSubmit={(e) => { e.preventDefault(); setEditing(false); void agent.submitGoal(text); }}>
          <textarea className="p-textarea" aria-label="Your goal" value={text} onChange={(e) => setText(e.target.value)} />
          <p className="p-help">Starting again replaces what CargoPilot read and any proposal. Nothing has been booked.</p>
          <div className="a-edit-actions">
            <button type="submit" className="p-btn sm" disabled={!text.trim()}>Start again with this goal</button>
            <button type="button" className="p-link" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <blockquote>{st.goalText}</blockquote>
      )}
    </section>
  );
}

/* ---------- 2 · what was read, every value correctable ---------- */

function ReadCard({ agent, readOnly }: { agent: Agent; readOnly: boolean }) {
  const st = agent.state;
  const cnt = detailCounts(st);
  // A summary line by default, so questions stay in view; opened on demand to check or correct anything
  const [isOpen, setOpen] = useState(false);
  const disabled = readOnly ? "manager" : locked(st) ? "locked" : undefined;
  const summary = [
    st.shipment.pieces && st.shipment.weightPerPiece ? `${st.shipment.pieces.value} × ${st.shipment.weightPerPiece.value} ${st.shipment.weightUnit?.value ?? "kg"}` : show(st, "weightPerPiece"),
    st.shipment.cargoType?.value,
    st.shipment.originAirport || st.shipment.destAirport ? `${st.shipment.originAirport?.value ?? "?"} → ${st.shipment.destAirport?.value ?? "?"}` : "",
    st.shipment.pickupDate ? `pickup ${fmtDate(st.shipment.pickupDate.value)}` : "",
    st.constraints.deadline ? deadlineText(st.constraints.deadline.value) : "",
    st.constraints.budgetUsd ? `max ${usd(st.constraints.budgetUsd.value)}` : "",
  ].filter(Boolean);
  const docs = st.shipment.docs?.value ?? {};
  const required = DOCS.filter((d) => !d.optional);
  const attached = required.filter((d) => docs[d.id] && !docs[d.id]!.error).length;

  const save = (k: Key, v: unknown) => void agent.setField(k, v, "edit");
  return (
    <section className="a-card a-read" aria-labelledby="read-title">
      <div className="a-row-between">
        <h2 id="read-title" className="a-h2">
          What CargoPilot read{" "}
          <span className="a-count">
            {cnt.total} details: {cnt.message} from your message{cnt.you ? ` · ${cnt.you} from you` : ""}{cnt.defaults ? ` · ${cnt.defaults} default` : ""}{cnt.missing ? ` · ${cnt.missing} missing` : ""}
          </span>
        </h2>
        <button type="button" className="a-change" aria-expanded={isOpen} aria-controls="read-body" onClick={() => setOpen(!isOpen)}>
          {isOpen ? "Hide details" : "Show and correct"}
        </button>
      </div>
      {!isOpen && <p className="a-read-summary">{summary.join(" · ") || "Nothing read yet."}</p>}
      {isOpen && (
        <div id="read-body">
          {disabled === "locked" && <p className="p-help">Details can't be changed while a booking is being confirmed or after it's booked.</p>}
          {!disabled && <p className="p-help">Correct anything that's wrong. CargoPilot re-plans from the first step your change affects; your other answers are kept.</p>}
          <div className="a-groups">
            {GROUPS.map((g) => (
              <div key={g.title} className="a-group">
                <h3>{g.title}</h3>
                <dl>
                  {g.keys.map((k) => <EditableValue key={k} st={st} k={k} onSave={save} disabled={disabled} />)}
                  {g.title === "Route and pickup" && (
                    <div className="a-fact">
                      <dt>Documents</dt>
                      <dd>
                        <span className="a-val">{attached} of {required.length} required attached</span>
                        <span className={`a-src ${attached === required.length ? "you" : "missing"}`}>{attached === required.length ? "Ready" : "Needed to book"}</span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- 3 · the plan, with each task's content under it ---------- */

function Plan({ agent, manager, onForm, onManagerView, showDone, setShowDone, refs }: { agent: Agent; manager: boolean; onForm: () => void; onManagerView: () => void; showDone: boolean; setShowDone: (v: boolean) => void; refs: { current: Partial<Record<TaskId, HTMLLIElement | null>> } }) {
  const st = agent.state;
  const tasks = agent.plan();
  const [open, setOpen] = useState<Set<TaskId>>(new Set());
  const qs = st.status === "needs_user" ? st.questions : [];
  const home = (id: TaskId) => qs.filter((q) => questionHome(q) === id);
  // The agent's own plan, as is: the panel and this list count the same steps
  const view = (t: Task): Task["status"] => (t.id === "restrictions" && st.status === "handoff" ? "needs_user" : t.status);
  const focus = tasks.find((t) => ["running", "needs_user", "needs_manager", "blocked", "failed", "unknown"].includes(view(t)))?.id ?? (st.booking ? "confirm" : undefined);
  const firstPending = tasks.find((t) => view(t) === "pending")?.id;
  const prog = progress(st, tasks);

  // Bring the step that needs the user into view when the agent stops there
  const waiting = ["needs_user", "needs_manager", "awaiting_approval", "blocked", "handoff", "failed", "status_unknown", "confirmed"].includes(st.status);
  useEffect(() => {
    if (!waiting) return;
    const id = st.status === "awaiting_approval" ? "approval" : focus;
    const el = id ? refs.current[id] : null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.7) el.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [st.status, focus, waiting]);

  // Switching to the Manager view brings the decision waiting for them into view
  useEffect(() => {
    if (manager && st.status === "needs_manager") refs.current.approval?.scrollIntoView({ block: "start" });
  }, [manager, st.status]);

  const toggle = (id: TaskId) => setOpen((o) => {
    const n = new Set(o);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });

  return (
    <section className="a-card a-plan" aria-labelledby="plan-title">
      <div className="a-row-between">
        <h2 id="plan-title" className="a-h2">The plan</h2>
        <span className="a-count">{prog.label}</span>
      </div>
      <ol className="a-tasks">
        {(() => {
          // Finished steps with nothing left to show collapse into one line while they're the history at the top
          const rows = tasks.map((t) => ({ t, status: view(t), body: taskBody(t.id, { agent, manager, onForm, onManagerView, questions: home(t.id) }) }));
          let lead = 0;
          while (lead < rows.length && rows[lead].status === "done" && !rows[lead].body && rows[lead].t.id !== focus) lead++;
          const group = lead >= 2 && !showDone ? rows.slice(0, lead) : [];
          const render = ({ t, status, body }: (typeof rows)[0]) => {
            const isOpen = open.has(t.id);
            const log = lastLog(st, t.id);
            return (
              <li key={t.id} ref={(el) => { refs.current[t.id] = el; }} className={`a-task ${status}`} aria-current={t.id === focus ? "step" : undefined}>
                <span className="a-task-icon" aria-hidden="true">{taskIcon(status)}</span>
                <div className="a-task-main">
                  <div className="a-task-head">
                    <span className="a-task-label" tabIndex={-1}>{t.label}</span>
                    <Tag level={t.level} />
                    {t.id === firstPending && status === "pending" && <span className="a-next">Next</span>}
                    <span className="a-task-state">{stateText(status, t, st)}</span>
                    {log && (
                      <button type="button" className="a-change" aria-expanded={isOpen} onClick={() => toggle(t.id)}>
                        {isOpen ? "Hide details" : "Details"}
                      </button>
                    )}
                  </div>
                  {status !== "pending" && status !== "skipped" && <TaskResult t={t} st={st} status={status} />}
                  {isOpen && log && <ToolDetails st={st} t={t} />}
                  {body}
                </div>
              </li>
            );
          };
          return (
            <>
              {group.length > 0 && (
                <li className="a-task done a-task-group">
                  <span className="a-task-icon" aria-hidden="true">{taskIcon("done")}</span>
                  <div className="a-task-main">
                    <div className="a-task-head">
                      <span className="a-task-label">{group.length} steps done</span>
                      <span className="a-task-state">{group.every((r) => r.t.level === "L3") ? "on their own" : ""}</span>
                      <button type="button" className="a-change" aria-expanded={false} onClick={() => setShowDone(true)}>Show steps</button>
                    </div>
                    <p className="a-task-result">{group.map((r) => r.t.label).join(" · ")}</p>
                  </div>
                </li>
              )}
              {group.length > 0 && rows.slice(0, lead).map((r) => <li key={r.t.id} hidden ref={(el) => { refs.current[r.t.id] = el; }} />)}
              {rows.slice(group.length).map(render)}
              {showDone && lead >= 2 && (
                <li className="a-task-collapse">
                  <button type="button" className="a-change" onClick={() => setShowDone(false)}>Group the finished steps again</button>
                </li>
              )}
            </>
          );
        })()}
      </ol>
    </section>
  );
}

function taskIcon(status: Task["status"]) {
  switch (status) {
    case "done": return <Icon d={I.check} size={14} stroke={2.8} />;
    case "running": return <Spinner size={15} />;
    case "failed": return <Icon d={I.x} size={14} stroke={2.6} />;
    case "unknown": return <span className="a-bang">?</span>;
    case "blocked": return <Icon d={I.x} size={14} stroke={2.6} />;
    case "needs_user":
    case "needs_manager": return <span className="a-bang">!</span>;
    default: return null;
  }
}

function stateText(status: Task["status"], t: Task, st: AgentState) {
  switch (status) {
    case "running": return t.id === "confirm" ? "Booking…" : "Working…";
    case "needs_user": return t.id === "restrictions" ? "Needs a specialist" : "Needs you";
    case "needs_manager": return "Needs the Manager";
    case "blocked": return "Blocked";
    case "failed": return "Failed";
    case "unknown": return "Status unknown";
    case "skipped": return "Not done";
    case "done": return t.id === "approval" && st.booking ? "Approved" : "";
    default: return "";
  }
}

/** One line on what the task produced, from the audit log: what was done, not what was "thought" */
function TaskResult({ t, st, status }: { t: Task; st: AgentState; status: Task["status"] }) {
  let text = "";
  if (t.id === "interpret") {
    const cnt = detailCounts(st);
    text = `Read ${cnt.message} of the ${cnt.total} details from your message, with fixed rules.`;
  } else if (t.id === "approval") {
    const ap = currentApproval(st, "booking");
    if (ap) text = `Approved by you at ${fmtClock(ap.at)} · proposal v${ap.version}.`;
  } else if (t.id === "confirm") {
    if (st.booking) text = `Booked ${st.booking.bookingId} · AWB ${st.booking.awb}.`;
  } else if (status === "done" || status === "failed") {
    text = lastLog(st, t.id)?.summary ?? "";
    if (t.id === "draft" && st.proposal) text = `Proposal v${st.proposal.version} ready. It isn't a booking.`;
  }
  if (status === "running") text = st.statusText;
  return text ? <p className="a-task-result">{text}</p> : null;
}

function lastLog(st: AgentState, id: TaskId) {
  const tool = TASK_TOOL[id];
  if (!tool) return undefined;
  return [...st.log].reverse().find((l) => l.tool === tool && (l.type === "tool_result" || l.type === "tool_error"));
}

/** Secondary detail: which tool ran, its autonomy level, input, output and attempts */
function ToolDetails({ st, t }: { st: AgentState; t: Task }) {
  const tool = TASK_TOOL[t.id]!;
  const call = [...st.log].reverse().find((l) => l.tool === tool && l.type === "tool_call");
  const res = lastLog(st, t.id);
  const tries = st.log.filter((l) => l.tool === tool && l.type === "tool_call").length;
  return (
    <dl className="a-tool">
      <div><dt>Tool</dt><dd className="mono">{tool}</dd></div>
      <div><dt>Autonomy</dt><dd>{t.level} · {LEVEL[t.level].hint}</dd></div>
      {call?.input !== undefined && <div><dt>Input</dt><dd className="mono">{fmtData(call.input)}</dd></div>}
      {res && <div><dt>Result</dt><dd>{res.summary}{res.output !== undefined && <span className="mono"> {fmtData(res.output)}</span>}</dd></div>}
      <div><dt>Calls</dt><dd>{tries} in this plan · last at {res ? fmtClock(res.at) : "—"}</dd></div>
      {(t.id === "search" || t.id === "rates") && <div><dt>Source</dt><dd>Mock carrier API: synthetic flights and prices</dd></div>}
    </dl>
  );
}

const fmtData = (v: unknown) => (typeof v === "object" && v ? Object.entries(v as object).map(([k, x]) => `${k}: ${typeof x === "object" ? JSON.stringify(x) : String(x)}`).join(" · ") : String(v));

type Ctx = { agent: Agent; manager: boolean; onForm: () => void; onManagerView: () => void; questions: Question[] };

/** The content that belongs under a task: questions, restrictions, options, approval, booking outcome */
function taskBody(id: TaskId, c: Ctx): ReactNode {
  const st = c.agent.state;
  const failedHere = st.status === "failed" && st.failedTool && TASK_TOOL[id] === st.failedTool;
  switch (id) {
    case "interpret":
      return st.warnings?.length ? <div className="a-block you" role="note">{st.warnings.map((w) => <p key={w} style={{ margin: 0 }}><Icon d={I.warn} size={16} /> {w}</p>)}</div> : null;
    case "validate":
      return c.questions.length ? <Questions c={c} title="A few answers before searching flights" why="CargoPilot needs these to search. It doesn't fill gaps with guesses." /> : null;
    case "restrictions":
      if (st.status === "handoff") return <Handoff r={st.restrictions.find((r) => r.kind === "specialist")!} st={st} onForm={c.onForm} manager={c.manager} />;
      if (st.status === "blocked") return <Blocked c={c} />;
      return null;
    case "search":
      if (failedHere) return <Failed c={c} />;
      return c.questions.length ? <Questions c={c} title="No flights found" why="The mock carrier has no flight with space on that date. A different pickup date may have." /> : null;
    case "rates":
      return failedHere ? <Failed c={c} /> : null;
    case "compare":
      if (c.questions.length) return <Questions c={c} title="No options left" why="Every option was rejected. A different date or shipment brings new ones." />;
      return st.options.length && !st.booking && st.status !== "cancelled" ? <Options c={c} /> : null;
    case "draft":
      if (!c.questions.length) return null;
      if (c.questions.some((q) => q.field === "docs")) return <Documents c={c} />;
      return <Questions c={c} title="A few details for the proposal" why="The options are ready. The proposal needs the pickup and delivery details." />;
    case "approval":
      if (st.status === "awaiting_approval") return <Approval c={c} />;
      if (st.status === "needs_manager") return c.manager ? <ManagerDecision c={c} /> : <WaitingForManager c={c} />;
      return null;
    case "confirm":
      if (st.status === "booking") return <div className="a-block work" role="status"><Spinner /> <div><b>Booking {st.proposal?.option.flight.flightNo}…</b> Don't close this tab. If the answer doesn't come, CargoPilot checks before trying again.</div></div>;
      if (st.status === "status_unknown") return <Unknown c={c} />;
      if (failedHere) return <BookingFailed c={c} />;
      if (st.booking) return <Booked st={st} agent={c.agent} />;
      if (st.status === "cancelled") return <Cancelled agent={c.agent} onForm={c.onForm} />;
      return null;
    default:
      return null;
  }
}

/* ---------- questions ---------- */

function Questions({ c, title, why }: { c: Ctx; title: string; why: string }) {
  const st = c.agent.state;
  const [drafts, setDrafts] = useState<Partial<Record<Key, Draft>>>({});
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const draftOf = (q: Question) => drafts[q.field as Key] ?? (q.options ? "" : initialDraft(st, q.field as Key));
  const filled = c.questions.filter((q) => {
    const d = draftOf(q);
    return typeof d === "string" ? d.trim() !== "" : Array.isArray(d) ? d.length > 0 : Object.values(d).some((x) => x);
  });
  const submit = () => {
    const entries: [Key, unknown][] = [];
    const errs: Partial<Record<Key, string>> = {};
    for (const q of filled) {
      const r = parse(q.field as Key, draftOf(q));
      if (r.ok) entries.push([q.field as Key, r.value]);
      else errs[q.field as Key] = r.error;
    }
    setErrors(errs);
    if (entries.length && !Object.keys(errs).length) void c.agent.setFields(entries, "answer");
  };
  return (
    <form className="a-block you" onSubmit={(e) => { e.preventDefault(); submit(); }} aria-label={title}>
      <div className="a-block-head">
        <b>{title}</b>
        <span>{why}</span>
      </div>
      <div className={`a-questions${c.questions.length > 2 ? " many" : ""}`}>
        {c.questions.map((q) => {
          const k = q.field as Key;
          return (
            <div key={q.id} className="a-q">
              <label htmlFor={`ag-${k}`} className="a-q-text">{q.text}</label>
              {q.options ? (
                <div className="a-choices" role="radiogroup" aria-label={q.text}>
                  {q.options.map((o) => (
                    <button key={o.value} type="button" role="radio" aria-checked={draftOf(q) === o.value} className="a-choice" disabled={c.manager} onClick={() => setDrafts({ ...drafts, [k]: o.value })}>
                      <span className="a-radio" />
                      <span>
                        <b>{o.value}</b> {o.label.split(" · ")[1]}
                        <small>{airport(o.value)?.international ? "Handles international cargo" : "Domestic cargo only"}</small>
                      </span>
                    </button>
                  ))}
                </div>
              ) : DEFS[k] ? (
                <Editor st={st} k={k} draft={draftOf(q)} onDraft={(d) => setDrafts({ ...drafts, [k]: d })} error={errors[k]} />
              ) : null}
              {errors[k] && <p className="p-err">{errors[k]}</p>}
            </div>
          );
        })}
      </div>
      {!c.manager && (
        <div className="a-row-between">
          <button type="button" className="p-link" onClick={c.onForm}><Icon d={A.form} size={16} /> Continue in the form instead</button>
          <button type="submit" className="p-btn md" disabled={!filled.length}>
            {filled.length < c.questions.length && filled.length ? `Continue with ${filled.length} of ${c.questions.length} answers` : "Continue"}
          </button>
        </div>
      )}
    </form>
  );
}

function Documents({ c }: { c: Ctx }) {
  const st = c.agent.state;
  const missing = missingDocuments(st.shipment);
  return (
    <div className="a-block you" role="group" aria-label="Documents needed to book">
      <div className="a-block-head">
        <b>Attach documents to book</b>
        <span>Proposal v{st.proposal?.version} is prepared, but {st.shipment.cargoType?.value.toLowerCase()} can't be booked without these. Documents aren't part of the price, so attaching them doesn't change the proposal.</span>
      </div>
      <ul className="a-doclist">
        {missing.map((m) => (
          <li key={m.code}><Icon d={I.file} size={16} /> {m.text.replace(" isn't attached yet.", "")} <span className="a-src missing">Missing</span></li>
        ))}
      </ul>
      {!c.manager && (
        <div className="a-row-between">
          <button type="button" className="p-link" onClick={c.onForm}><Icon d={A.form} size={16} /> Upload your own in the form</button>
          <button type="button" className="p-btn md" onClick={() => void c.agent.setField("docs", FILLED.docs, "answer")}>
            <Icon d={I.upload} size={16} /> Attach sample documents
          </button>
        </div>
      )}
      <p className="p-help">Prototype: the sample files stand in for real uploads.</p>
    </div>
  );
}

/* ---------- restrictions and hand-off ---------- */

const RESTRICTION_FIELD: Record<string, Key> = {
  PIECE_TOO_HEAVY: "weightPerPiece",
  PIECE_TOO_TALL: "dims",
  TWO_TEMPERATURES: "handling",
  SAME_AIRPORT: "destAirport",
  PICKUP_IN_PAST: "pickupDate",
  PICKUP_HOURS: "pickupTime",
};

function Blocked({ c }: { c: Ctx }) {
  const st = c.agent.state;
  const save = (k: Key, v: unknown) => void c.agent.setField(k, v, "edit");
  return (
    <div className="a-block bad" role="alert">
      <div className="a-block-head">
        <b><Icon d={A.shield} size={18} /> This shipment can't be booked as it is</b>
        <span>
          {st.restrictions.length === 1 ? "A hard restriction applies." : `${st.restrictions.length} hard restrictions apply.`} Hard restrictions are safety and handling limits: <b>no one can approve them, the Manager included.</b> Only a change to the shipment clears them, and CargoPilot doesn't change it for you.
        </span>
      </div>
      <ul className="a-restrictions">
        {st.restrictions.map((r) => (
          <li key={r.code + (r.suggestion?.field ?? "")}>
            <p><b>{r.text}</b> {r.fix}</p>
            {!c.manager && (
              <div className="a-fix">
                {r.suggestion && (
                  <button type="button" className="p-btn secondary sm" onClick={() => void c.agent.applySuggestion(r.code)}>{r.suggestion.label}</button>
                )}
                {RESTRICTION_FIELD[r.code] && !r.suggestion && (
                  <dl className="a-inline-fact"><EditableValue st={st} k={RESTRICTION_FIELD[r.code]} onSave={save} /></dl>
                )}
                {r.code === "PIECE_TOO_HEAVY" && <dl className="a-inline-fact"><EditableValue st={st} k="pieces" onSave={save} /></dl>}
              </div>
            )}
          </li>
        ))}
      </ul>
      {!c.manager && (
        <button type="button" className="p-link" onClick={c.onForm}><Icon d={A.form} size={16} /> Continue in the form instead (it applies the same limits)</button>
      )}
    </div>
  );
}

function Handoff({ r, st, onForm, manager }: { r: Restriction; st: AgentState; onForm: () => void; manager: boolean }) {
  const known = GROUPS.flatMap((g) => g.keys).filter((k) => show(st, k) && source(st, k).tone !== "missing" && k !== "priority" && k !== "deadline" && k !== "budgetUsd");
  return (
    <div className="a-block info" role="alert">
      <div className="a-block-head">
        <b>{st.shipment.cargoType?.value} need a specialist: continue in the form</b>
        <span>{r.text}</span>
      </div>
      <p className="a-carry">
        <b>What goes with you:</b> {known.map((k) => label(k).toLowerCase()).join(", ") || "nothing yet"}. Nothing is invented: what you didn't give stays empty. The form checks the same weight, size and route limits.
      </p>
      {!manager && (
        <button type="button" className="p-btn md" onClick={onForm}>
          <Icon d={A.form} size={16} /> Continue in the form
        </button>
      )}
    </div>
  );
}

/* ---------- options: why, price, timing, restrictions, trade-offs ---------- */

function Options({ c }: { c: Ctx }) {
  const st = c.agent.state;
  const prio = st.constraints.priority?.value ?? "balanced";
  const rec = st.options.find((o) => o.recommended);
  const [expanded, setExpanded] = useState<string | null>(null);
  const chosenOff = st.selectedFlightId && rec && st.selectedFlightId !== rec.flight.id;
  // A card is shown as selected only once it has been chosen: by the user, or by the agent putting it in the proposal.
  // Until then every card is in its default state, and the recommendation is only its tag.
  const isSelected = (id: string) => st.selectedFlightId === id && (st.selectedBy === "user" || st.proposal?.option.flight.id === id);
  const canChoose = !c.manager && !locked(st) && st.status !== "paused";
  // While a proposal waits for approval, the options step back to one line each: the decision is below them
  const deciding = st.status === "awaiting_approval" || st.status === "needs_manager";
  return (
    <div className="a-options">
      <p className="a-options-intro">
        {st.options.length} options, ranked by{" "}
        {[
          st.constraints.budgetUsd || st.constraints.deadline ? "options that meet your budget and deadline first" : "",
          prio === "fastest" ? "then the earliest arrival" : prio === "cheapest" ? "then the lowest price" : "then price and transit time together",
        ].filter(Boolean).join(", ")}
        . {chosenOff ? "You chose a different option from the recommendation." : "The proposal uses the recommended one; you can choose another."}
        {deciding && " Open any option to see why."}
      </p>
      {st.options.map((o) => (
        <OptionCard
          key={o.flight.id}
          o={o}
          st={st}
          selected={isSelected(o.flight.id)}
          open={expanded === o.flight.id || (!deciding && (o.recommended || isSelected(o.flight.id)))}
          onToggle={() => setExpanded(expanded === o.flight.id ? null : o.flight.id)}
          onChoose={canChoose ? () => void c.agent.selectOption(o.flight.id) : undefined}
        />
      ))}
    </div>
  );
}

function OptionCard({ o, st, selected, open, onToggle, onChoose }: { o: Option; st: AgentState; selected: boolean; open: boolean; onToggle: () => void; onChoose?: () => void }) {
  const [prices, setPrices] = useState(false);
  const f = o.flight;
  return (
    <article className={`a-option${o.recommended ? " rec" : ""}${selected ? " sel" : ""}`} aria-label={`${f.service} ${f.flightNo}${o.recommended ? ", recommended" : ""}`}>
      <div className="a-option-top">
        <div className="a-option-id">
          <div className="a-option-badges">
            {selected && <span className="a-badge sel" title="This option is in the proposal you approve"><Icon d={I.check} size={12} stroke={3} /> Selected</span>}
            {o.recommended && <span className="a-badge rec"><Icon d={A.spark} size={12} fill="currentColor" /> Recommended</span>}
            {o.exceptions.map((e) => (
              <span key={e.id} className="a-badge warn">{e.kind === "budget" ? "Over budget · Manager approval" : "Late · you'd accept it"}</span>
            ))}
          </div>
          <b>{f.service} · {f.flightNo}</b>
          <span className="a-muted">{f.stops ? `${f.stops} stop` : "Nonstop"} · {f.origin} → {f.dest}</span>
        </div>
        <div className="a-option-times">
          <div><span className="a-muted">Departs</span>{fmtDT(f.departs)}</div>
          <div><span className="a-muted">Lands</span>{fmtDT(f.arrives)} <small>{f.flightHours} h flight</small></div>
          <div><span className="a-muted">Delivered around</span>{fmtDT(f.deliveredBy)} <small>(estimate)</small></div>
        </div>
        <div className="a-option-price">
          <b>{usd(o.quote.total)}</b>
          <span className="a-muted">Synthetic quote</span>
        </div>
      </div>
      {open ? (
        <div className="a-option-body">
          <div className="a-why">
            <h4>{o.recommended ? "Why it's recommended" : "Why it isn't recommended"}</h4>
            {o.whyNot && <p className="a-whynot">{o.whyNot}</p>}
            <ul>{o.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
            {o.exceptions.length > 0 && (
              <ul className="a-exc">
                {o.exceptions.map((e) => (
                  <li key={e.id}><b>{e.kind === "budget" ? "Commercial exception · needs the Logistics Manager:" : "Commercial exception · needs your acceptance:"}</b> {e.text}</li>
                ))}
              </ul>
            )}
            <p className="a-ok-line"><Icon d={I.checkCircle} size={15} /> No cargo restrictions apply to this shipment.</p>
          </div>
          <div className="a-why">
            <h4>Trade-offs against the others</h4>
            <ul>{o.tradeoffs.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <button type="button" className="a-change" aria-expanded={prices} onClick={() => setPrices(!prices)}>
            {prices ? "Hide price breakdown and sources" : "Price breakdown and sources"}
          </button>
          {prices && (
            <div className="a-breakdown">
              <table>
                <tbody>
                  {o.quote.lines.map((l) => <tr key={l.label}><td>{l.label}</td><td>{usd(l.amount)}</td></tr>)}
                  <tr className="tot"><td>Total</td><td>{usd(o.quote.total)}</td></tr>
                </tbody>
              </table>
              <p className="p-help">Valid until {fmtClock(o.quote.validUntil)}; checked again before booking. Chargeable weight {o.quote.chargeableKg} kg, the greater of actual and volumetric.</p>
              <div className="a-sources">
                <div><h5>From the tools</h5><ul>{o.verified.map((v) => <li key={v}>{v}</li>)}</ul></div>
                <div><h5>Estimated</h5><ul>{o.estimated.map((v) => <li key={v}>{v}</li>)}</ul></div>
              </div>
            </div>
          )}
          {onChoose && !selected && (
            <button type="button" className="p-btn secondary sm" onClick={onChoose}>Use this option instead</button>
          )}
        </div>
      ) : (
        <div className="a-option-foot">
          <span className="a-muted">{o.whyNot ?? o.reasons[0]}</span>
          <button type="button" className="a-change" onClick={onToggle}>{o.recommended || selected ? "Why this one?" : "Why not this one?"}</button>
          {onChoose && !selected && <button type="button" className="p-btn secondary sm" onClick={onChoose}>Use this option instead</button>}
        </div>
      )}
    </article>
  );
}

/* ---------- approvals: the user's, and the Manager's for exceptions ---------- */

function ProposalFacts({ st }: { st: AgentState }) {
  const p = st.proposal!;
  const f = p.option.flight;
  const s = p.shipment;
  return (
    <dl className="p-kv a-kv">
      <div><dt>Flight</dt><dd>{f.flightNo} · {f.service} · {f.stops ? `${f.stops} stop` : "nonstop"}</dd></div>
      <div><dt>Departs</dt><dd>{fmtDT(f.departs)} · {f.origin}</dd></div>
      <div><dt>Lands</dt><dd>{fmtDT(f.arrives)} · {f.dest}</dd></div>
      <div><dt>Delivered around</dt><dd>{fmtDT(f.deliveredBy)} (estimate)</dd></div>
      <div><dt>Cargo</dt><dd>{s.pieces?.value} × {s.weightPerPiece?.value} {s.weightUnit?.value ?? "kg"} · {s.cargoType?.value}</dd></div>
      <div><dt>Pickup</dt><dd>{fmtDate(s.pickupDate?.value ?? "")} · {fmtTime(s.pickupTime?.value ?? "")}</dd></div>
      <div><dt>Chargeable weight</dt><dd>{p.option.quote.chargeableKg} kg</dd></div>
    </dl>
  );
}

function Approval({ c }: { c: Ctx }) {
  const st = c.agent.state;
  const p = st.proposal!;
  const mine = p.option.exceptions.filter((e) => e.approver === "coordinator");
  const managers = p.option.exceptions.filter((e) => e.approver === "manager");
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [showLines, setShowLines] = useState(false);
  const prevApproved = p.version > 1 && st.approvals.some((ap) => ap.proposalId === p.id && ap.version < p.version && ap.kind === "booking");
  const ready = mine.every((e) => accepted.has(e.id));
  return (
    <div className="a-block approve" role="region" aria-label="Approve the booking">
      <div className="a-approve-head">
        <div>
          <span className="a-eyebrow">Your approval is needed to book</span>
          <h3>Proposal v{p.version}: {p.option.flight.flightNo}, {usd(p.option.quote.total)}</h3>
        </div>
        <span className="a-badge mute">Not booked yet</span>
      </div>
      {p.version > 1 && p.changes.length > 0 && (
        <div className="a-changes" role="note">
          <b>What changed since v{p.version - 1}</b>
          <ul>{p.changes.map((ch) => <li key={ch}>{ch}</li>)}</ul>
          {prevApproved && <span>Your approval of v{p.version - 1} no longer applies, because the terms changed.</span>}
        </div>
      )}
      <ProposalFacts st={st} />
      <div className="a-price-row">
        <span>Total</span>
        <b>{usd(p.option.quote.total)}</b>
        <button type="button" className="a-change" aria-expanded={showLines} onClick={() => setShowLines(!showLines)}>{showLines ? "Hide breakdown" : "Breakdown"}</button>
      </div>
      {showLines && (
        <table className="a-lines"><tbody>{p.option.quote.lines.map((l) => <tr key={l.label}><td>{l.label}</td><td>{usd(l.amount)}</td></tr>)}</tbody></table>
      )}
      {managers.map((e) => (
        <p key={e.id} className="a-ok-line"><Icon d={I.checkCircle} size={15} /> Over budget, approved by the Logistics Manager. {e.text}</p>
      ))}
      {mine.map((e) => (
        <label key={e.id} className="p-check a-accept">
          <input type="checkbox" checked={accepted.has(e.id)} disabled={c.manager} onChange={(ev) => { const n = new Set(accepted); if (ev.target.checked) n.add(e.id); else n.delete(e.id); setAccepted(n); }} />
          <span>I accept that it {e.text.charAt(0).toLowerCase() + e.text.slice(1)} {st.constraints.deadline ? `(${deadlineText(st.constraints.deadline.value).toLowerCase()})` : ""}</span>
        </label>
      ))}
      <ul className="a-conditions">{p.conditions.map((x) => <li key={x}>{x}</li>)}</ul>
      {c.manager ? (
        <p className="p-help">The coordinator approves the booking itself. The Manager approves exceptions only.</p>
      ) : rejecting ? (
        <form className="a-reject" onSubmit={(e) => { e.preventDefault(); void c.agent.reject(reason.trim()); }}>
          <label htmlFor="reject-reason">What's wrong with it? <span className="p-opt">(optional, kept in the activity log)</span></label>
          <input id="reject-reason" className="p-input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="E.g. Too expensive" />
          <div className="a-edit-actions">
            <button type="submit" className="p-btn secondary sm">Reject and see the next option</button>
            <button type="button" className="p-link" onClick={() => setRejecting(false)}>Keep it</button>
          </div>
        </form>
      ) : (
        <>
          <p className="a-consequence" id="approve-means">
            <Icon d={I.info} size={16} />
            <span>
              <b>Approving authorizes CargoPilot to book proposal v{p.version} right away, for {usd(p.option.quote.total)}.</b> The booking is sent as soon as you click; once it's confirmed it can't be undone here.
            </span>
          </p>
          <div className="a-row-between">
            <button type="button" className="p-btn secondary md" onClick={() => setRejecting(true)}>Reject</button>
            <button type="button" className="p-btn" disabled={!ready} aria-describedby="approve-means" onClick={() => void c.agent.approve("coordinator", [...accepted])}>
              Approve and book now · {usd(p.option.quote.total)}
            </button>
          </div>
        </>
      )}
      <p className="p-help">If the price or the flight changes before the booking goes through, nothing is booked: CargoPilot shows you what changed and asks for your approval again.</p>
    </div>
  );
}

function WaitingForManager({ c }: { c: Ctx }) {
  const st = c.agent.state;
  const ex = st.proposal!.option.exceptions.find((e) => e.approver === "manager")!;
  const within = st.options.filter((o) => !o.exceptions.length);
  return (
    <div className="a-block you" role="status">
      <div className="a-block-head">
        <b><Icon d={A.user} size={18} /> Waiting for the Logistics Manager</b>
        <span>{st.proposal!.option.flight.flightNo} is {ex.text.replace(/^USD [\d,.]+ is /, "")} Going over budget is a commercial exception: neither you nor CargoPilot can approve it. Nothing is booked while it waits.</span>
      </div>
      {within.length > 0 && !c.manager && (
        <div className="a-alt">
          <span>Or choose an option within budget:</span>
          {within.map((o) => (
            <button key={o.flight.id} type="button" className="p-btn secondary sm" onClick={() => void c.agent.selectOption(o.flight.id)}>
              Use {o.flight.flightNo} · {usd(o.quote.total)}
            </button>
          ))}
        </div>
      )}
      <button type="button" className="p-link a-proto" onClick={c.onManagerView}>Prototype: view as the Manager to decide</button>
    </div>
  );
}

function ManagerDecision({ c }: { c: Ctx }) {
  const st = c.agent.state;
  const p = st.proposal!;
  const ex = p.option.exceptions.find((e) => e.approver === "manager")!;
  const within = st.options.filter((o) => !o.exceptions.length);
  return (
    <div className="a-block approve" role="region" aria-label="Approve an exception">
      <div className="a-approve-head">
        <div>
          <span className="a-eyebrow">Exception for you to decide</span>
          <h3>Over budget: {p.option.flight.flightNo}, {usd(p.option.quote.total)}</h3>
        </div>
        <span className="a-badge mute">Not booked</span>
      </div>
      <p>{ex.text} The coordinator chose it{st.constraints.priority?.value === "fastest" ? " because they asked for the fastest option" : ""}.</p>
      <ProposalFacts st={st} />
      {within.length > 0 && (
        <p className="p-help">Within budget instead: {within.map((o) => `${o.flight.flightNo} ${o.flight.service} at ${usd(o.quote.total)}, delivered around ${fmtDT(o.flight.deliveredBy)}`).join("; ")}.</p>
      )}
      <div className="a-row-between">
        <button type="button" className="p-btn secondary md" onClick={() => void c.agent.decideException(ex.id, "manager", false)}>Reject exception</button>
        <button type="button" className="p-btn" onClick={() => void c.agent.decideException(ex.id, "manager", true)}>Approve exception</button>
      </div>
      <p className="p-help">Approving lets the coordinator book this option; it doesn't book it. Rejecting sends CargoPilot back to the other options.</p>
    </div>
  );
}

/* ---------- booking outcomes and recovery ---------- */

function Failed({ c }: { c: Ctx }) {
  const st = c.agent.state;
  return (
    <div className="a-block bad" role="alert">
      <div className="a-block-head">
        <b>{st.statusText}</b>
        <span>It was tried 3 times. Your details and answers are kept, and nothing was booked.</span>
      </div>
      {!c.manager && (
        <div className="a-row-between">
          <button type="button" className="p-link" onClick={c.onForm}><Icon d={A.form} size={16} /> Continue in the form instead</button>
          <button type="button" className="p-btn md" onClick={() => void c.agent.retry()}><Icon d={A.refresh} size={16} /> Retry</button>
        </div>
      )}
    </div>
  );
}

function BookingFailed({ c }: { c: Ctx }) {
  return (
    <div className="a-block bad" role="alert">
      <div className="a-block-head">
        <b>The booking didn't go through. Nothing was booked.</b>
        <span>Your approval still applies to this proposal. Retry sends the same booking key, so it can never book twice.</span>
      </div>
      {!c.manager && (
        <div className="a-row-between">
          <button type="button" className="p-link" onClick={c.onForm}><Icon d={A.form} size={16} /> Continue in the form instead</button>
          <button type="button" className="p-btn md" onClick={() => void c.agent.retry()}><Icon d={A.refresh} size={16} /> Retry booking</button>
        </div>
      )}
    </div>
  );
}

function Unknown({ c }: { c: Ctx }) {
  const st = c.agent.state;
  const running = st.currentTool === "getBookingStatus";
  return (
    <div className="a-block bad" role="alert">
      <div className="a-block-head">
        <b><Icon d={I.warn} size={18} /> It isn't known yet whether this booked</b>
        <span>
          The booking service didn't answer, and checking its status didn't work either. CargoPilot <b>won't send the booking again</b> until it knows, so it can't book twice. Don't book this shipment another way until the status is clear.
        </span>
      </div>
      <dl className="a-tool">
        <div><dt>Booking key</dt><dd className="mono">{st.idempotencyKey}</dd></div>
        <div><dt>Proposal</dt><dd>v{st.proposal?.version} · {st.proposal?.option.flight.flightNo} · {st.proposal && usd(st.proposal.option.quote.total)}</dd></div>
      </dl>
      {!c.manager && (
        <button type="button" className="p-btn md" disabled={running} onClick={() => void c.agent.retry()}>
          {running ? <Spinner /> : <Icon d={A.refresh} size={16} />} Check the status again
        </button>
      )}
    </div>
  );
}

function Booked({ st, agent }: { st: AgentState; agent: Agent }) {
  const b = st.booking!;
  const ap = st.approvals.find((x) => x.kind === "booking" && x.version === b.version && x.proposalId === b.proposalId);
  return (
    <div className="a-block ok" role="status">
      <div className="a-block-head">
        <b><Icon d={I.checkCircle} size={18} /> Booked {b.bookingId} · AWB {b.awb}</b>
        <span>{b.flightNo}, {usd(b.total)}. Booked from proposal v{b.version}{ap ? `, which you approved at ${fmtClock(ap.at)}` : ""}. Synthetic booking: nothing was sent to a real carrier.</span>
      </div>
      <button type="button" className="p-btn secondary md" onClick={() => agent.reset()}>Plan another booking</button>
    </div>
  );
}

function Cancelled({ agent, onForm }: { agent: Agent; onForm: () => void }) {
  return (
    <div className="a-block mute" role="status">
      <div className="a-block-head">
        <b>Plan cancelled. Nothing was booked.</b>
        <span>What CargoPilot read is still here, so you can take it to the form or start a new plan.</span>
      </div>
      <div className="a-row-between">
        <button type="button" className="p-link" onClick={onForm}><Icon d={A.form} size={16} /> Continue in the form with these details</button>
        <button type="button" className="p-btn md" onClick={() => agent.reset()}>Start a new plan</button>
      </div>
    </div>
  );
}

/* ---------- the panel: status, progress, approvals, controls ---------- */

function Panel({ agent, manager, onForm, onLog, onJump }: { agent: Agent; manager: boolean; onForm: () => void; onLog: () => void; onJump: (id: TaskId) => void }) {
  const s = agentSession();
  const st = agent.state;
  const meta = STATUS[st.status];
  const tasks = agent.plan();
  const prog = progress(st, tasks);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const p = st.proposal;
  const approvals: { text: string; who: string; state: string }[] = [];
  if (p) {
    for (const e of p.option.exceptions) {
      const ok = currentApproval(st, "exception", e.id, e.approver);
      approvals.push({ text: e.kind === "budget" ? "Going over budget" : "Arriving late", who: e.approver === "manager" ? "Logistics Manager" : "You", state: ok ? "Approved" : "Pending" });
    }
    approvals.push({ text: `Booking v${p.version}`, who: "You", state: st.booking ? "Approved" : currentApproval(st, "booking") ? "Approved" : "Pending" });
  }
  // Pause stops the agent from acting on its own: offered while it works, or while it waits on someone else
  const canPause = !manager && ["running", "needs_manager"].includes(st.status);
  const canCancel = !manager && !["idle", "confirmed", "cancelled", "booking", "status_unknown"].includes(st.status);
  const canForm = !manager && st.goalText && !["confirmed", "booking", "status_unknown"].includes(st.status);

  return (
    <aside className="p-summary a-panel" aria-label="CargoPilot status">
      <div className={`a-status ${meta.tone}`} aria-live="polite">
        <span className="a-status-dot">{meta.tone === "work" ? <Spinner size={14} /> : null}</span>
        <div>
          <b>{meta.title}</b>
          <p>{st.status === "idle" ? "Describe the shipment to start." : st.statusText}</p>
        </div>
      </div>
      {st.status !== "idle" && (
        <>
          <div className={`a-progress ${prog.tone}`} aria-label={prog.label}>
            <div className="a-progress-bar"><i style={{ width: `${(prog.done / prog.n) * 100}%` }} /></div>
            <span>{prog.label}</span>
          </div>
          <StepNav tasks={tasks} st={st} onJump={onJump} />
          <hr />
          <h4>Booked</h4>
          <p className="a-panel-line">{st.booking ? <><b>{st.booking.bookingId}</b> · AWB {st.booking.awb}</> : st.status === "status_unknown" ? "Unknown: being checked" : "Nothing yet"}</p>
          {approvals.length > 0 && (
            <>
              <h4>Approvals</h4>
              <ul className="a-approvals">
                {approvals.map((x) => (
                  <li key={x.text}>
                    <span>{x.text}<small>{x.who}</small></span>
                    <span className={`a-src ${x.state === "Approved" ? "you" : "missing"}`}>{x.state}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <hr />
          <div className="a-controls">
            {st.status === "paused" && !manager && (
              <button type="button" className="p-btn md" onClick={() => void agent.resume()}><Icon d={A.play} size={14} fill="currentColor" /> Resume</button>
            )}
            {canPause && (
              <button type="button" className="p-btn secondary sm" onClick={() => agent.pause()}><Icon d={A.pause} size={14} /> Pause</button>
            )}
            {canCancel && !confirmCancel && (
              <button type="button" className="p-btn secondary sm" onClick={() => setConfirmCancel(true)}>Cancel plan</button>
            )}
          </div>
          {confirmCancel && canCancel && (
            <div className="a-confirm" role="alertdialog" aria-labelledby="cancel-q">
              <p id="cancel-q"><b>Cancel this plan?</b> Nothing has been booked. Any proposal is discarded; what CargoPilot read is kept so you can use the form.</p>
              <div className="a-edit-actions">
                <button type="button" className="p-btn sm" onClick={() => { agent.cancel(); setConfirmCancel(false); }}>Cancel plan</button>
                <button type="button" className="p-link" onClick={() => setConfirmCancel(false)}>Keep planning</button>
              </div>
            </div>
          )}
          {canForm && (
            <button type="button" className="p-link a-form-link" onClick={onForm}>
              <Icon d={A.form} size={16} /> Continue in the form
            </button>
          )}
          {canForm && <p className="p-help">Everything known so far goes to the form; nothing is lost.</p>}
          <hr />
          <button type="button" className="p-link" onClick={onLog}><Icon d={A.list} size={16} /> Activity log · {st.log.length} entries</button>
          <p className="p-help">{s.store.persistent ? "Saved in this browser tab only: a reload keeps it, closing the tab doesn't." : "This tab can't save progress, so a reload starts over. Everything else works."}</p>
        </>
      )}
      <hr />
      <p className="a-mocknote"><b>Mock mode.</b> {MOCK_LABEL.replace("Mock mode: ", "CargoPilot is ")}. Flights, prices and bookings are synthetic.</p>
      <Simulations />
    </aside>
  );
}

/** The plan's steps in the panel: where each one stands, and a way to jump to it */
function StepNav({ tasks, st, onJump }: { tasks: Task[]; st: AgentState; onJump: (id: TaskId) => void }) {
  return (
    <nav aria-label="Steps of the plan">
      <ol className="a-stepnav">
        {tasks.map((t) => (
          <li key={t.id} className={t.status}>
            <button type="button" onClick={() => onJump(t.id)} aria-label={`${t.label}: ${stateText(t.status, t, st) || t.status.replace("_", " ")}`}>
              <i aria-hidden="true" />
              <span>{t.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Simulations() {
  const s = useAgentSession();
  return (
    <details className="a-sim">
      <summary>Prototype controls · simulate a problem</summary>
      <p className="p-help">For reviewing this prototype only. Each one happens once, at the step it names.</p>
      {SIMULATIONS.map((sim) => (
        <label key={sim.id} className="p-check">
          <input type="checkbox" checked={s.armed.has(sim.id)} onChange={() => s.toggle(sim.id)} />
          <span>{sim.label}<small>{sim.detail}</small></span>
        </label>
      ))}
    </details>
  );
}

/* ---------- the audit log: available, secondary ---------- */

const ACTOR: Record<LogEntry["actor"], string> = { user: "You", manager: "Manager", agent: "CargoPilot", system: "Policy" };

function ActivityLog({ st, open, onToggle, innerRef }: { st: AgentState; open: boolean; onToggle: (o: boolean) => void; innerRef: Ref<HTMLDetailsElement> }) {
  const [filter, setFilter] = useState<"all" | "people" | "tools">("all");
  if (st.status === "idle" && !st.log.length) return null;
  const rows = st.log.filter((l) => filter === "all" || (filter === "people" ? ["user", "manager"].includes(l.actor) || ["approval", "rejection", "invalidation", "denied", "decision"].includes(l.type) : l.tool));
  return (
    <details className="a-card a-log" open={open} ref={innerRef} onToggle={(e) => onToggle((e.target as HTMLDetailsElement).open)}>
      <summary>
        <span className="a-disclosure" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </span>
        <span className="a-h2">Activity log</span>
        <span className="a-count">{st.log.length} entries · every tool call, decision and approval, in order</span>
        <span className="a-disclosure-text">{open ? "Hide" : "Show"}</span>
      </summary>
      <div className="p-tabs" role="tablist" aria-label="Filter the log">
        {(["all", "people", "tools"] as const).map((f) => (
          <button key={f} type="button" role="tab" className="p-tab" aria-selected={filter === f} onClick={() => setFilter(f)}>
            {f === "all" ? "Everything" : f === "people" ? "Decisions and approvals" : "Tool calls"}
          </button>
        ))}
      </div>
      <ol className="a-log-list">
        {rows.map((l) => (
          <li key={l.seq} className={`t-${l.type}`}>
            <span className="mono a-log-seq">{l.seq}</span>
            <span className="a-log-time">{fmtClock(l.at)}</span>
            <span className="a-log-actor">{ACTOR[l.actor]}</span>
            <span className="a-log-what">
              {l.summary}
              {(l.tool || l.version || l.idempotencyKey) && (
                <small className="mono">
                  {[l.tool && `${l.tool}${l.level ? ` · ${l.level}` : ""}`, l.version && `proposal v${l.version}`, l.approvalId, l.idempotencyKey && `key ${l.idempotencyKey}`].filter(Boolean).join(" · ")}
                </small>
              )}
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}

function Tag({ level }: { level: Task["level"] }) {
  return <span className={`a-level ${level}`} title={LEVEL[level].hint}>{LEVEL[level].text}</span>;
}
