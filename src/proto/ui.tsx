import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useProto } from "./store";
import type { Page } from "./store";
import { SearchBar } from "./SearchBar";

/* ---------- icons ---------- */

export function Icon({ d, size = 18, stroke = 1.9, fill = "none", className }: { d: string | string[]; size?: number; stroke?: number; fill?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill === "none" ? "currentColor" : "none"} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

export const I = {
  back: "M19 12H5M11 6l-6 6 6 6",
  check: "M5 12.5 10 17l9-10",
  checkCircle: ["M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z", "m8 12.5 3 3 5-6"],
  alert: ["M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z", "M12 7.5v5.5M12 16.5v.01"],
  warn: ["M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z", "M12 9v4M12 17v.01"],
  file: ["M14 3H6v18h12V7z", "M14 3v4h4"],
  upload: ["M12 15V4M7 9l5-5 5 5", "M4 15v5h16v-5"],
  edit: "M4 20h4L19 9l-4-4L4 16z",
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 1 0 0-14z", "m20 20-3.5-3.5"],
  x: "M6 6l12 12M18 6 6 18",
  chevron: "M1 1l5 5 5-5",
  info: ["M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z", "M12 11v5M12 7.5v.01"],
  wifiOff: "M3 3l18 18M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 4.2-2.6M12 20h.01M19 12.9a10 10 0 0 0-2.8-2",
  lock: ["M5 11h14v9H5z", "M8 11V8a4 4 0 0 1 8 0v3"],
};

const Chevron = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
    <path d={I.chevron} fill="none" stroke="#1A1831" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/* ---------- app shell ---------- */

const NAV: { label: string; d: string; page?: Page; filled?: boolean }[] = [
  { label: "Dashboard", d: "M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z" },
  { label: "New booking", d: "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z", page: "step1", filled: true },
  { label: "My bookings", d: "M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8", page: "bookings" },
  { label: "Reports", d: "M6 3h12v18H6zM9 8h6M9 12h6M9 16h4" },
  { label: "Settings", d: "M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 1z" },
];

export function Shell({ active, children }: { active: "New booking" | "My bookings"; children: ReactNode }) {
  const { go, toast } = useProto();
  const soon = (what: string) => toast(`${what} isn't part of this prototype.`);
  return (
    <>
      <header className="p-header">
        <button type="button" className="p-logo" onClick={() => go("bookings")} aria-label="LATAM Cargo, go to My bookings">
          <span className="p-logo-bars" aria-hidden="true"><i style={{ width: 14 }} /><i style={{ width: 18 }} /><i style={{ width: 12 }} /></span>
          <span><b>LATAM</b><small>CARGO</small></span>
        </button>
        <SearchBar />
        <div className="p-head-right">
          <button type="button" onClick={() => soon("Notifications")}>Notifications</button>
          <button type="button" onClick={() => soon("Language settings")}>EN</button>
          <button type="button" className="p-avatar" onClick={() => soon("Your profile")}><span>JS</span>Jane Smith</button>
        </div>
      </header>
      <div className="p-body">
        <nav className="p-nav" aria-label="Main">
          {NAV.map((n) => (
            <button key={n.label} type="button" aria-current={n.label === active ? "page" : undefined} onClick={() => (n.page ? go(n.page, { fresh: n.page === "step1" }) : soon(n.label))}>
              <span><Icon d={n.d} size={20} stroke={1.8} fill={n.filled ? "currentColor" : "none"} /></span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="p-col">
          <main className="p-main">{children}</main>
          <footer className="p-footer">
            <nav aria-label="Footer">
              <b>LATAM Cargo</b>
              <button type="button" onClick={() => soon("The help center")}>Help center</button>
              <button type="button" onClick={() => soon("Conditions of carriage")}>Conditions of carriage</button>
              <button type="button" onClick={() => soon("Privacy")}>Privacy</button>
            </nav>
            <span><span className="p-dot" />All systems operational · Support 24/7</span>
          </footer>
        </div>
      </div>
    </>
  );
}

const STEPS: { label: string; page: Page }[] = [
  { label: "Cargo type", page: "step1" },
  { label: "Route and dates", page: "step2" },
  { label: "Documents", page: "step3" },
  { label: "Review", page: "step4" },
  { label: "Confirmation", page: "step5" },
];

export function BookingHead({ step, saved = true }: { step: number; saved?: boolean }) {
  const { go, ui } = useProto();
  return (
    <>
      <button type="button" className="p-back" onClick={() => go("bookings")}>
        <Icon d={I.back} /> Back to bookings
      </button>
      <div className="p-title-row">
        <h1>New booking</h1>
        {saved && (
          <span className="p-saved" aria-live="polite">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#067647" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12.5 3 3 5-6" /></svg>
            Draft saved · {ui.savedAt}
          </span>
        )}
      </div>
      <ol className="p-stepper" aria-label="Booking steps">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const state = n < step ? "done" : n === step ? "now" : "next";
          const inner = (
            <>
              <span className="n">{state === "done" ? "✓" : n}</span>
              <span className="t">{s.label}</span>
            </>
          );
          return (
            <li key={s.label} className={`p-step ${state}`} aria-current={state === "now" ? "step" : undefined}>
              {n < 5 && <span className="line" aria-hidden="true" />}
              {state === "done" && step < 5 ? (
                <button type="button" onClick={() => go(s.page)} aria-label={`${s.label}, completed. Edit`}>{inner}</button>
              ) : (
                <span className="p-step-inner">{inner}</span>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}

/* ---------- form controls ---------- */

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p className="p-err" id={id}>
      <Icon d={I.alert} size={16} /> {children}
    </p>
  );
}

export function Field({ id, label, optional, hint, error, children, width }: { id: string; label: string; optional?: string; hint?: string; error?: string; children: ReactNode; width?: number }) {
  return (
    <div className="p-field" style={width ? { maxWidth: width } : undefined}>
      <label htmlFor={id}>
        {label} {optional && <span className="p-opt">({optional})</span>}
      </label>
      {children}
      {hint && !error && <p className="p-help" id={`${id}-hint`}>{hint}</p>}
      {error && <ErrorText id={`${id}-err`}>{error}</ErrorText>}
    </div>
  );
}

export function TextInput({ id, value, onChange, error, width, ...rest }: { id: string; value: string; onChange?: (v: string) => void; error?: string; width?: number | string; placeholder?: string; readOnly?: boolean; inputMode?: "numeric" | "decimal" | "text"; type?: string; min?: string; "aria-label"?: string; onBlur?: () => void }) {
  return (
    <input
      id={id}
      className="p-input"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-err` : undefined}
      style={width ? { width } : undefined}
      {...rest}
    />
  );
}

export type Option = { value: string; label?: string; hint?: string };

/** A custom dropdown (listbox) with keyboard support: ↑ ↓ Home End to move, Enter or Space to pick, Esc to close, type to jump. */
export function Select({ id, value, options, onChange, placeholder = "Select…", error, width, label }: { id: string; value: string; options: Option[]; onChange: (v: string) => void; placeholder?: string; error?: string; width?: number | string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const lid = useId();
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!btn.current?.parentElement?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    btn.current?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList();
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(options.length - 1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(active); }
    else if (e.key === "Escape" || e.key === "Tab") setOpen(false);
    else if (e.key.length === 1) {
      const i = options.findIndex((o) => (o.label ?? o.value).toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
    }
  };

  return (
    <div className="p-select" style={width ? { width } : undefined}>
      <button
        ref={btn}
        id={id}
        type="button"
        className={`p-select-btn${current ? "" : " placeholder"}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={lid}
        aria-label={label}
        aria-activedescendant={open ? `${lid}-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
      >
        {current ? current.label ?? current.value : placeholder}
        <Chevron />
      </button>
      {open && (
        <ul ref={list} className="p-options" role="listbox" id={lid}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${lid}-${i}`}
              data-index={i}
              role="option"
              className="p-option"
              aria-selected={o.value === value}
              data-active={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(i)}
            >
              <span className="check">{o.value === value && <Icon d={I.check} size={15} stroke={2.4} />}</span>
              <span>
                {o.label ?? o.value}
                {o.hint && <small>{o.hint}</small>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Chips({ id, options, value, onChange, invalid }: { id: string; options: string[]; value: string[]; onChange: (v: string[]) => void; invalid?: boolean }) {
  return (
    <div className={`p-chips${invalid ? " invalid" : ""}`} id={id} role="group">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} type="button" className="p-chip" aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}>
            <span className="box"><Icon d={I.check} size={11} stroke={3} /></span>
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- feedback ---------- */

export function ErrorSummary({ errors, labels, title }: { errors: Record<string, string | undefined>; labels: Record<string, string>; title?: string }) {
  const keys = Object.keys(labels).filter((k) => errors[k]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  if (!keys.length) return null;
  const focusField = (k: string) => {
    const el = document.getElementById(k);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  return (
    <div className="p-alert" role="alert" tabIndex={-1} ref={ref}>
      <Icon d={I.alert} size={20} />
      <div>
        <b>{title ?? `Check ${keys.length} field${keys.length > 1 ? "s" : ""} to continue`}</b>
        <ul>
          {keys.map((k) => (
            <li key={k}>
              <a href={`#${k}`} onClick={(e) => { e.preventDefault(); focusField(k); }}>{labels[k]}</a>
              : {lowerFirst(errors[k]!)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function Summary({ rows, total, status = "Draft" }: { rows: { title?: string; items: [string, string][] }[]; total?: { value: string; note: string }; status?: string }) {
  return (
    <aside className="p-summary" aria-label="Booking summary">
      <h3>Booking summary</h3>
      {rows.map((g, gi) => (
        <div key={gi}>
          {gi > 0 && <hr />}
          {g.title && <h4>{g.title}</h4>}
          <dl>
            {g.items.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd className={v ? undefined : "empty"}>{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      {total && (
        <>
          <hr />
          <h4>Estimated rate</h4>
          <div className="p-total">{total.value}</div>
          <div className="p-help">{total.note}</div>
        </>
      )}
      <hr />
      <h4>Status</h4>
      <span className="p-badge">{status}</span>
    </aside>
  );
}
