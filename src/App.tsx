import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { AGENT_FLOWS, FLOWS, GROUPS, REEL } from "./flows";
import { agentSession, EXAMPLES } from "./proto/agentSession";

const EXAMPLE_GOAL = EXAMPLES[0].text;
import { BRAND, BrandMark } from "./brand";
import type { Flow } from "./flows";
import { Prototype, StaticPrototype, presetBooking, presetUi } from "./proto/Prototype";
import { INITIAL_UI } from "./proto/store";
import type { Page, Ui } from "./proto/store";

const SCREEN_WIDTH = 1400;

/* ---------- routing: #/ (index) and #/flow/<id>/<step> ---------- */

type Route = { page: "index" } | { page: "flow"; flow: Flow; step: number };

function parseHash(): Route {
  const [, kind, id, step] = window.location.hash.replace(/^#/, "").split("/");
  const flow = kind === "flow" ? FLOWS.find((f) => f.id === id) : undefined;
  if (!flow) return { page: "index" };
  const n = Math.min(Math.max(Number(step) || 1, 1), flow.steps.length);
  return { page: "flow", flow, step: n - 1 };
}

export const flowHref = (id: string, step = 1) => `#/flow/${id}/${step}`;

function useRoute(): Route {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

/* ---------- a screen scaled to the available width ---------- */

function ScaledScreen({ children, cta, onCta, max = 1 }: { children: ReactNode; cta?: string; onCta?: () => void; max?: number }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(Math.min(max, el.clientWidth / SCREEN_WIDTH));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);

  // Highlight the control that moves the flow forward, and keep it highlighted as the live screen re-renders
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const mark = () => {
      const old = el.querySelector(".cta-hotspot");
      if (!cta) return old?.classList.remove("cta-hotspot");
      const all = [...el.querySelectorAll<HTMLElement>("button, a")];
      // An exact label wins, so "Continue" never lights up "Continue in the form instead"; while it's disabled, nothing is lit
      const exact = all.filter((b) => b.textContent?.trim() === cta);
      const target = exact.length
        ? exact.find((b) => !b.hasAttribute("disabled"))
        : all.find((b) => !b.hasAttribute("disabled") && b.textContent?.trim().startsWith(cta)) ??
        // Tabs in the mockups are plain text: fall back to a leaf element with that exact label
        [...el.querySelectorAll<HTMLElement>("span, div")].find((b) => b.childElementCount === 0 && b.textContent?.trim() === cta);
      if (old && old !== target) old.classList.remove("cta-hotspot");
      if (target && !target.classList.contains("cta-hotspot")) target.classList.add("cta-hotspot");
    };
    mark();
    const mo = new MutationObserver(() => mark());
    mo.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled"] });
    return () => mo.disconnect();
  }, [cta]);

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Links in the mockups go nowhere: keep the prototype on the current step
    if (target.closest("a")) e.preventDefault();
    if (onCta && target.closest(".cta-hotspot")) onCta();
  };

  return (
    <div className="screen-box" ref={box}>
      <div className="screen" style={{ zoom: scale }} onClick={onClick}>
        {children}
      </div>
    </div>
  );
}

/* ---------- index of flows ---------- */

function Index() {
  const manual = FLOWS.filter((f) => f.group !== "agent");
  const total = FLOWS.reduce((n, f) => n + f.steps.length, 0);
  const toManual = () => document.getElementById("manual")?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <main className="index">
      <header className="hero">
        <div className="brand">
          <Logo />
          <span className="mono">Agentic AI UX · Human-in-the-loop</span>
        </div>
        <h1>An agent that books air cargo, and <em>knows when to stop</em></h1>
        <p className="lead">
          A coordinator describes the shipment in a sentence. CargoPilot checks it, searches flights, compares prices
          and prepares one proposal. It never books without approval, sends exceptions to the Manager, and says so when
          it doesn’t know. The five-step form is still here, next to it.
        </p>
        <div className="hero-actions">
          <a className="hero-btn primary" href={flowHref("agent-happy")}>Try the agent →</a>
          <button type="button" className="hero-btn" onClick={toManual}>See the manual flows</button>
        </div>
        <dl className="stats">
          <div><dt>{AGENT_FLOWS.length}</dt><dd>agent flows</dd></div>
          <div><dt>{manual.length}</dt><dd>manual flows</dd></div>
          <div><dt>{total}</dt><dd>screens to walk</dd></div>
        </dl>
        <p className="status">
          <b>Mock mode, no language model.</b> The agent runs on fixed rules and synthetic data, and says so on screen.
          Nothing in it is LLM-powered.
        </p>
        <p className="how">
          <b>How to use it:</b> open a flow and do what the note on the left says: click the highlighted control, use
          Next, or press the ← → keys. “All flows” takes you back here at any point.
        </p>
      </header>

      {GROUPS.map((g, gi) => {
        const flows = FLOWS.filter((f) => f.group === g.id);
        return (
          <section key={g.id} className="group" id={gi === 1 ? "manual" : undefined} aria-labelledby={`g-${g.id}`}>
            {gi === 0 && <p className="part mono">Case 02 · With the agent</p>}
            {gi === 1 && <p className="part mono">Case 01 · Manual booking, the form step by step</p>}
            <div className="group-head">
              <span className={`dot tone-${g.tone}`} aria-hidden="true" />
              <h2 id={`g-${g.id}`}>
                <span className="mono">{String(gi + 1).padStart(2, "0")}</span> {g.title}
              </h2>
              <p>{g.description}</p>
            </div>
            <ol className="cards">
              {flows.map((f) => (
                <li key={f.id}>
                  <a className={`card tone-${g.tone}`} href={flowHref(f.id)}>
                    <span className="card-title">{f.title}</span>
                    <span className="card-summary">{f.summary}</span>
                    <span className="path">
                      {f.steps.map((s, i) => (
                        <span key={i}>
                          {i > 0 && <span className="arrow" aria-hidden="true">→</span>}
                          {s.label}
                        </span>
                      ))}
                    </span>
                    <span className="card-foot">
                      <span className="mono">{f.steps.length} screens</span>
                      <span className="start">Start flow →</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      <footer className="index-foot">
        <p>
          Design by <a href="https://ticianapaura.github.io/">Ticiana Paura</a>. Front end built with AI assistance
          (Claude): React and TypeScript, with unit and end-to-end tests. Case study on{" "}
          <a href="https://www.behance.net/ticianne" target="_blank" rel="noopener">Behance</a>. Concept project:
          CargoPilot AI is fictional, and its flights, prices and bookings are synthetic.
        </p>
      </footer>
    </main>
  );
}

/* ---------- one flow, screen by screen ---------- */

function Player({ flow, step }: { flow: Flow; step: number }) {
  const group = GROUPS.find((g) => g.id === flow.group)!;
  const current = flow.steps[step];
  const last = step === flow.steps.length - 1;
  const next = FLOWS[FLOWS.indexOf(flow) + 1];

  // The live app's data and state, kept across the screens of a flow
  const [booking, setBooking] = useState(() => presetBooking(current.preset));
  const [ui, setUiState] = useState(() => presetUi(current.preset));
  const onUi = useCallback((patch: Partial<Ui>) => setUiState((u) => ({ ...u, ...patch })), []);
  /** A page the user reached by clicking around that isn't part of this flow */
  const [offPage, setOffPage] = useState<Page | null>(null);
  const inApp = useRef(false);
  const lastFlow = useRef(flow.id);

  // Entering a step from the player (Next, Previous, the list or a link) loads its preset
  useEffect(() => {
    setOffPage(null);
    if (inApp.current) {
      inApp.current = false;
      return;
    }
    const s = flow.steps[step];
    const freshFlow = lastFlow.current !== flow.id;
    lastFlow.current = flow.id;
    if (freshFlow || s.preset?.b) setBooking(freshFlow ? presetBooking(s.preset) : (b) => ({ ...b, ...s.preset?.b }));
    setUiState((u) => ({ ...(freshFlow ? INITIAL_UI : { ...INITIAL_UI, draft: u.draft, savedAt: u.savedAt }), ...s.preset?.ui }));
  }, [flow, step]);

  // An agent flow entered at its first step starts a new plan with its goal written in
  const prepared = useRef<string | null>(null);
  useEffect(() => {
    if (!flow.agent || step !== 0 || prepared.current === flow.id) return;
    prepared.current = flow.id;
    agentSession().prepare(flow.agent.goal, flow.agent.sims);
  }, [flow, step]);

  const go = useCallback(
    (n: number) => {
      if (n >= 0 && n < flow.steps.length) window.location.hash = flowHref(flow.id, n + 1);
    },
    [flow],
  );

  // The user navigated inside the live app: follow along in the flow when that page is part of it
  const onNavigate = useCallback(
    (page: Page) => {
      const ahead = flow.steps.findIndex((s, i) => i > step && s.page === page);
      const behind = flow.steps.map((s, i) => (i < step && s.page === page ? i : -1)).filter((i) => i >= 0).pop() ?? -1;
      const target = ahead >= 0 ? ahead : behind;
      if (target >= 0) {
        inApp.current = true;
        go(target);
      } else {
        setOffPage(page === current.page ? null : page);
      }
    },
    [flow, step, current.page, go],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable], .screen")) return;
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
      if (e.key === "Escape") window.location.hash = "#/";
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, step]);

  useEffect(() => {
    document.title = `${flow.title} · ${BRAND}`;
    return () => {
      document.title = `${BRAND} · Agentic booking`;
    };
  }, [flow]);

  const livePage = offPage ?? current.page;

  return (
    <div className="player">
      <div className="bar">
        <a className="back" href="#/">
          <span aria-hidden="true">←</span> All flows
        </a>
        <div className="bar-title">
          <span className={`pill tone-${group.tone}`}>{group.title}</span>
          <span className="flow-name">{flow.title}</span>
        </div>
        <div className="bar-nav">
          <span className="mono count" aria-live="polite">
            {step + 1} / {flow.steps.length}
          </span>
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0}>
            Previous
          </button>
          {last ? (
            <a className="primary" href={next ? flowHref(next.id) : "#/"}>
              {next ? "Next flow →" : "All flows"}
            </a>
          ) : (
            <button type="button" className="primary" onClick={() => go(step + 1)}>
              Next →
            </button>
          )}
        </div>
      </div>

      <div className="stage">
        <aside className="steps" aria-label="Screens in this flow">
          <ol>
            {flow.steps.map((s, i) => (
              <li key={i}>
                <a href={flowHref(flow.id, i + 1)} aria-current={i === step ? "step" : undefined}>
                  <span className="n mono">{i + 1}</span>
                  <span>{s.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="note">
            <p>{current.note}</p>
            {current.cta && !last && !offPage && (
              <p className="hint">
                Click <b>{current.cta}</b> on the screen to continue, or use Next.
              </p>
            )}
            {current.page && !offPage && (
              <p className="hint">
                {current.page === "agent"
                  ? "This is the live agent: it really runs, in mock mode. You can also type your own goal, correct what it read, pause or cancel."
                  : "Everything on this screen works: fields, dropdowns, menu, search and buttons."}
              </p>
            )}
            {last && (
              <p className="hint">
                End of this flow. <a href="#/">Choose another flow</a>
                {next && (
                  <>
                    {" "}or continue with <a href={flowHref(next.id)}>{next.title}</a>
                  </>
                )}
                .
              </p>
            )}
          </div>
          {offPage && (
            <div className="note off">
              <p>You’re exploring outside this flow. Keep clicking around, or go back to the scripted screen.</p>
              <button type="button" onClick={() => setOffPage(null)}>
                ← Back to step {step + 1}: {current.label}
              </button>
            </div>
          )}
        </aside>
        <ScaledScreen
          key={`${flow.id}-${step}-${livePage ?? "static"}`}
          cta={offPage ? undefined : current.cta}
          onCta={(!current.page || current.advance) && !last ? () => go(step + 1) : undefined}
        >
          {livePage ? (
            <Prototype page={livePage} booking={booking} ui={ui} onBooking={setBooking} onUi={onUi} onNavigate={onNavigate} />
          ) : (
            current.render?.()
          )}
        </ScaledScreen>
      </div>
    </div>
  );
}

/* ---------- autoplay previews for the portfolio card ---------- */

/** ?embed=form: the manual booking flow, one screen every 2.6 s */
function FormReel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % REEL.length), 2600);
    return () => window.clearInterval(t);
  }, []);
  const s = REEL[i];
  return (
    <div className="embed" inert>
      <ScaledScreen key={i}>{s.page ? <StaticPrototype page={s.page} preset={s.preset} /> : s.render?.()}</ScaledScreen>
    </div>
  );
}

const pause = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

/** ?embed=1: the agent's happy path, played on the live agent page: the goal typed, a question answered,
    the recommendation, details and documents, one approval, booked. Then it starts again. */
function AgentReel() {
  useEffect(() => {
    let alive = true;
    const find = (sel: string, text?: string) =>
      [...document.querySelectorAll<HTMLElement>(sel)].find((e) => !e.hasAttribute("disabled") && (!text || e.textContent?.trim().startsWith(text)));
    const wait = async (sel: string, text?: string, ms = 20000) => {
      for (let t = 0; t < ms; t += 100) {
        if (!alive) throw new Error("stopped");
        const el = find(sel, text);
        if (el) return el;
        await pause(100);
      }
      throw new Error(`timed out: ${sel} ${text ?? ""}`);
    };
    const show = (el: Element, offset = 90) =>
      window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset), behavior: smooth() });
    /** Lights the control the way the guided flows do, then presses it */
    const press = async (el: HTMLElement) => {
      el.classList.add("cta-hotspot");
      await pause(900);
      el.classList.remove("cta-hotspot");
      el.click();
    };
    const goal = EXAMPLE_GOAL;
    const play = async () => {
      const s = agentSession();
      s.prepare("");
      window.scrollTo({ top: 0 });
      await pause(800);
      // Typed a few characters at a time, always ending on the whole goal
      for (let n = 3; n < goal.length; n += 3) {
        s.setDraft(goal.slice(0, n));
        await pause(28);
      }
      s.setDraft(goal);
      await pause(500);
      await press(await wait("button", "Start planning"));
      const eze = await wait("[role=radio]", "EZE");
      show(eze, 260);
      await pause(1200);
      await press(eze);
      await press(await wait("form[aria-label='A few answers before searching flights'] button[type=submit]"));
      show(await wait(".a-option.rec"), 180);
      await pause(3600);
      const sample = await wait("button", "Fill in sample details");
      show(sample, 320);
      await pause(700);
      await press(sample);
      await press(await wait("form[aria-label='A few details for the proposal'] button[type=submit]"));
      const docs = await wait("button", "Attach sample documents");
      show(docs, 320);
      await press(docs);
      show(await wait(".a-block.approve"), 120);
      await pause(2600);
      await press(await wait(".a-block.approve button", "Approve and book"));
      show(await wait(".a-block.ok"), 160);
      await pause(4200);
      window.scrollTo({ top: 0, behavior: smooth() });
      await pause(1200);
    };
    void (async () => {
      while (alive) {
        try {
          await play();
        } catch {
          await pause(1000);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div className="embed agent-reel" aria-hidden="true">
      <ScaledScreen>
        <StaticPrototype page="agent" />
      </ScaledScreen>
    </div>
  );
}

function Embed() {
  return new URLSearchParams(window.location.search).get("embed") === "form" ? <FormReel /> : <AgentReel />;
}

function Logo() {
  return <BrandMark size={18} />;
}

export default function App() {
  const route = useRoute();
  if (new URLSearchParams(window.location.search).has("embed")) return <Embed />;
  return route.page === "flow" ? <Player flow={route.flow} step={route.step} /> : <Index />;
}
