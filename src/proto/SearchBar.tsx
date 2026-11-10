import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { BOOKINGS, search } from "./data";
import type { Row } from "./data";
import { useProto } from "./store";
import { I, Icon } from "./ui";

const tone = (s: Row["status"]) => (s === "Delivered" ? "ok" : s === "Cancelled" ? "mute" : "pri");
const RECENT = BOOKINGS.slice(0, 3);

/** Header search: recent bookings on focus, suggestions while typing, Enter to search. */
export function SearchBar() {
  const { ui, setUi, go, toast } = useProto();
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(0);
  const { q, searchOpen: open, searchSubmitted: submitted, searchLoading: loading, searchOffline: offline } = ui;
  const result = search(q, submitted);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setUi({ searchOpen: false });
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, setUi]);

  useEffect(() => setActive(0), [q]);

  const rows: Row[] = result.kind === "recent" ? RECENT : result.kind === "suggest" ? result.rows : [];

  const submit = () => {
    if (!q.trim()) return;
    setUi({ searchLoading: true, searchSubmitted: false });
    window.setTimeout(() => setUi({ searchLoading: false, searchSubmitted: true }), 700);
  };

  const open_ = (r: Row) => {
    setUi({ searchOpen: false, q: "", searchSubmitted: false });
    if (r.status === "In transit") go("tracking");
    else toast(`Booking ${r.id} details aren't part of this prototype. Try #1234, which is in transit.`);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") { setUi({ searchOpen: false }); input.current?.blur(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(rows.length - 1, a + 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (offline) return;
      if (result.kind === "match") open_(result.row);
      else if (rows[active] && result.kind === "suggest" && q.replace(/\D/g, "").length < 4) open_(rows[active]);
      else submit();
    }
  };

  let panel: ReactNode = null;
  if (offline) {
    panel = (
      <>
        <Msg tone="error" icon={I.wifiOff} title="Search isn’t working right now">
          Check your internet connection and try again. Your recent searches still work.
        </Msg>
        <div style={{ padding: "12px 4px 0 52px" }}>
          <button type="button" className="p-btn sm" onClick={() => { setUi({ searchOffline: false }); input.current?.focus(); }}>Try again</button>
        </div>
        <Divider />
        <ResultList title="Recent" rows={RECENT.slice(0, 2)} active={-1} onPick={open_} />
      </>
    );
  } else if (loading) {
    panel = (
      <>
        <div className="p-label">Searching…</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "4px 8px" }}>
          <Skeleton /><Skeleton short />
        </div>
        <div className="p-hint-row">Looking in your bookings. This usually takes a second.</div>
      </>
    );
  } else if (result.kind === "match") {
    const r = result.row;
    panel = (
      <>
        <div className="p-label">Exact match</div>
        <div className="p-match">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <b style={{ fontSize: 16 }}>Booking {r.id}</b>
            <span className={`p-status ${tone(r.status)}`}>{r.status}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, fontSize: 13, color: "#5E5C76" }}>
            <div>Route<div style={{ color: "#1A1831", fontWeight: 500, fontSize: 14 }}>{r.route}</div></div>
            <div>AWB<div className="mono" style={{ color: "#1A1831" }}>{r.awb}</div></div>
            <div>Status<div style={{ color: "#1A1831", fontWeight: 500, fontSize: 14 }}>{r.sub}</div></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#5E5C76" }}>{r.cargo}</span>
            <button type="button" className="p-btn sm" onClick={() => open_(r)}>
              {r.status === "In transit" ? "Open tracking" : "Open booking"} <span style={{ fontSize: 12, opacity: 0.75 }}>↵</span>
            </button>
          </div>
        </div>
      </>
    );
  } else if (result.kind === "noaccess") {
    panel = (
      <>
        <Msg tone="warn" icon={I.lock} title={`You can’t see booking ${result.q}`}>
          It may have been made by another company account. If you need it, ask your account admin to share it with you.
        </Msg>
        <div style={{ padding: "12px 4px 0 52px" }}>
          <button type="button" className="p-btn secondary sm" onClick={() => { setUi({ searchOpen: false }); toast("Request sent. Your account admin will get an email."); }}>Request access</button>
        </div>
      </>
    );
  } else if (result.kind === "none") {
    panel = (
      <>
        <Msg tone="info" icon={I.search} title={`No results for “${result.q}”`}>{result.hint}</Msg>
        <Divider />
        <ResultList title="Recent" rows={RECENT.slice(0, 2)} active={-1} onPick={open_} />
      </>
    );
  } else if (result.kind === "suggest") {
    panel = rows.length ? (
      <>
        <ResultList title="Bookings" rows={rows} active={active} onPick={open_} highlight={q.replace(/^#/, "")} />
        <div className="p-hint-row">↑ ↓ to move · Enter to search</div>
      </>
    ) : (
      <div className="p-hint-row" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}>Press Enter to search for “{q}”.</div>
    );
  } else {
    panel = (
      <>
        <ResultList title="Recent searches" rows={RECENT} active={active} onPick={open_} />
        <div className="p-hint-row">Search by booking number, like #1234, or AWB, like 045-12345678.</div>
      </>
    );
  }

  return (
    <div className={`p-search${offline ? " offline" : ""}`} ref={box}>
      <div className="p-search-box">
        <Icon d={I.search} size={17} stroke={2} />
        <input
          ref={input}
          value={q}
          placeholder="Booking number or AWB"
          aria-label="Search bookings by booking number or AWB"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          onFocus={() => setUi({ searchOpen: true })}
          onChange={(e) => setUi({ q: e.target.value, searchSubmitted: false, searchOpen: true })}
          onKeyDown={onKey}
        />
        {loading ? (
          <svg className="p-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B1A8E" strokeWidth="2.4" strokeLinecap="round" aria-label="Searching"><path d="M12 3a9 9 0 1 0 9 9" /></svg>
        ) : q ? (
          <button type="button" className="p-search-clear" aria-label="Clear search" onClick={() => { setUi({ q: "", searchSubmitted: false }); input.current?.focus(); }}>
            <Icon d={I.x} size={16} stroke={2} />
          </button>
        ) : null}
      </div>
      {open && <div className="p-search-panel" role="listbox" aria-label="Search results">{panel}</div>}
    </div>
  );
}

function ResultList({ title, rows, active, onPick, highlight }: { title: string; rows: Row[]; active: number; onPick: (r: Row) => void; highlight?: string }) {
  return (
    <>
      <div className="p-label">{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {rows.map((r, i) => {
          const id = r.id.slice(1);
          const m = highlight && id.startsWith(highlight) ? highlight : "";
          return (
            <button key={r.id} type="button" role="option" className="p-result" aria-selected={i === active} onClick={() => onPick(r)}>
              <span className="id">#{m && <b>{m}</b>}{id.slice(m.length)}</span>
              <span className="meta">{r.route} · <span className="mono">{r.awb}</span></span>
              <span className={`p-status ${tone(r.status)}`} style={{ fontSize: 12, padding: "1px 9px" }}>{r.status}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Msg({ tone: t, icon, title, children }: { tone: "info" | "warn" | "error"; icon: string | string[]; title: string; children: ReactNode }) {
  const c = { info: ["#EFF6FF", "#175CD3"], warn: ["#FFFAEB", "#A04305"], error: ["#FEF3F2", "#B42318"] }[t];
  return (
    <div className="p-msg">
      <span className="p-msg-icon" style={{ background: c[0], color: c[1] }}><Icon d={icon} /></span>
      <div><b>{title}</b>{children}</div>
    </div>
  );
}

const Divider = () => <div style={{ borderTop: "1px solid #E7E6F0", margin: "14px 0 8px" }} />;
const Skeleton = ({ short }: { short?: boolean }) => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <span style={{ width: 62, height: 12, borderRadius: 6, background: "#EEEDF5" }} />
    <span style={{ flexGrow: short ? 0 : 1, width: short ? "60%" : undefined, height: 12, borderRadius: 6, background: "#EEEDF5" }} />
    {!short && <span style={{ width: 70, height: 18, borderRadius: 9, background: "#EEEDF5" }} />}
  </div>
);
