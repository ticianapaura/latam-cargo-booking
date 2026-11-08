import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { FLOWS, GROUPS, REEL } from "./flows";
import type { Flow, Step } from "./flows";

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

function ScaledScreen({ step, onCta, max = 1 }: { step: Step; onCta?: () => void; max?: number }) {
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

  // Highlight the button that moves the flow forward
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.querySelectorAll(".cta-hotspot").forEach((b) => b.classList.remove("cta-hotspot"));
    if (!step.cta || !onCta) return;
    const cta = step.cta;
    const target =
      [...el.querySelectorAll<HTMLElement>("button, a")].find((b) => b.textContent?.trim().startsWith(cta)) ??
      // Tabs in the mockups are plain text: fall back to a leaf element with that exact label
      [...el.querySelectorAll<HTMLElement>("span, div")].find(
        (b) => b.childElementCount === 0 && b.textContent?.trim() === cta,
      );
    target?.classList.add("cta-hotspot");
  }, [step, onCta]);

  const onClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Links in the mockup go nowhere: keep the prototype on the current step
    if (target.closest("a")) e.preventDefault();
    if (target.closest(".cta-hotspot")) onCta?.();
  };

  return (
    <div className="screen-box" ref={box}>
      <div className="screen" style={{ zoom: scale }} onClick={onClick}>
        {step.render()}
      </div>
    </div>
  );
}

/* ---------- index of flows ---------- */

function Index() {
  const total = FLOWS.reduce((n, f) => n + f.steps.length, 0);
  return (
    <main className="index">
      <header className="hero">
        <div className="brand">
          <Logo />
          <span className="mono">New cargo booking · front end</span>
        </div>
        <h1>Booking air cargo with no surprises at the last step</h1>
        <p className="lead">
          A five-step booking flow for LATAM Cargo, built from the design case study. Every flow below is
          playable: pick one, follow it screen by screen, and come back here to try another.
        </p>
        <dl className="stats">
          <div><dt>{FLOWS.length}</dt><dd>flows</dd></div>
          <div><dt>{GROUPS.length}</dt><dd>groups</dd></div>
          <div><dt>{total}</dt><dd>screens to walk</dd></div>
        </dl>
        <p className="how">
          <b>How to use it:</b> open a flow, then click the highlighted button on the screen, use Next, or press
          the ← → keys. “All flows” takes you back here at any point.
        </p>
      </header>

      {GROUPS.map((g, gi) => {
        const flows = FLOWS.filter((f) => f.group === g.id);
        return (
          <section key={g.id} className="group" aria-labelledby={`g-${g.id}`}>
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
          Design and front end by <a href="https://ticianapaura.github.io/">Ticiana Paura</a>. Case study on{" "}
          <a href="https://www.behance.net/ticianne" target="_blank" rel="noopener">Behance</a>. Concept project,
          not affiliated with LATAM Airlines Group.
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

  const go = useCallback(
    (n: number) => {
      if (n >= 0 && n < flow.steps.length) window.location.hash = flowHref(flow.id, n + 1);
    },
    [flow],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
      if (e.key === "Escape") window.location.hash = "#/";
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, step]);

  useEffect(() => {
    document.title = `${flow.title} · LATAM Cargo booking`;
    return () => {
      document.title = "LATAM Cargo · New booking flows";
    };
  }, [flow]);

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
            {current.cta && !last && (
              <p className="hint">
                Click <b>{current.cta}</b> on the screen to continue.
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
        </aside>
        <ScaledScreen key={`${flow.id}-${step}`} step={current} onCta={last ? undefined : () => go(step + 1)} />
      </div>
    </div>
  );
}

/* ---------- autoplay preview for the portfolio card (?embed=1) ---------- */

function Embed() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % REEL.length), 2600);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="embed">
      <ScaledScreen step={REEL[i]} />
    </div>
  );
}

function Logo() {
  return (
    <span className="logo" aria-label="LATAM Cargo">
      <span className="logo-bars" aria-hidden="true">
        <i style={{ width: 14 }} />
        <i style={{ width: 18 }} />
        <i style={{ width: 12 }} />
      </span>
      <span className="logo-word">
        <b>LATAM</b>
        <small>CARGO</small>
      </span>
    </span>
  );
}

export default function App() {
  const route = useRoute();
  if (new URLSearchParams(window.location.search).has("embed")) return <Embed />;
  return route.page === "flow" ? <Player flow={route.flow} step={route.step} /> : <Index />;
}
