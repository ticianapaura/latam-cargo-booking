// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type CargoTypeProps = { state?: "filled" | "empty" };

/** Step 1 · Cargo type (props: state = empty | filled) */
export default function CargoType({ state = "filled" }: CargoTypeProps = {}) {
  const props = { state };
  const v = values(props);
  return (
    <div style={{ width: "1400px", minHeight: "1692px", boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
      <header style={{ height: "60px", flex: "none", background: "#1B1A31", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "24px", padding: "0 28px 0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ display: "block", width: "14px", height: "3px", borderRadius: "2px", background: "#E3194E", transform: "skewX(-30deg)" }} />
            <span style={{ display: "block", width: "18px", height: "3px", borderRadius: "2px", background: "#E3194E", transform: "skewX(-30deg)" }} />
            <span style={{ display: "block", width: "12px", height: "3px", borderRadius: "2px", background: "#E3194E", transform: "skewX(-30deg)" }} />
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "16px", letterSpacing: "0.06em", lineHeight: "1" }}>
              LATAM
            </div>
            <div style={{ fontSize: "10px", letterSpacing: "0.32em", color: "#C9C7DD" }}>
              CARGO
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "70px", width: "440px", height: "38px", borderRadius: "7px", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "10px", padding: "0 12px", color: "#8D8BA4", fontSize: "14px" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          Search AWB or booking
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "22px", fontSize: "14px", color: "#E9E8F5" }}>
          <span>
            Notifications
          </span>
          <span>
            EN
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#C8B9F5", color: "#2C116F", fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}>
              JS
            </span>
            Jane Smith
          </span>
        </div>
      </header>
      <div style={{ display: "flex", flexGrow: "1" }}>
        <nav aria-label="Main" style={{ width: "84px", flex: "none", background: "#1B1A31", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", paddingTop: "18px", fontSize: "11.5px", lineHeight: "1.25", textAlign: "center" }}>
          {v.nav.map((n: any, i: number) => (
            <Fragment key={i}>
            <a href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "76px", padding: "4px 0", color: n.fg, fontWeight: n.w, textDecoration: "none" }}>
              <span style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: n.bg, color: n.ic }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={n.fill} stroke={n.stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={n.d} />
                </svg>
              </span>
              {n.l}
            </a>
            </Fragment>
          ))}
        </nav>
        <div style={{ flexGrow: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
          <main style={{ padding: "30px 52px 64px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", fontSize: "16px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Back to bookings
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "14px 0 6px" }}>
              <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600" }}>
                New booking
              </h1>
              {v.saved && (
                <>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#5E5C76" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#067647" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8 12.5 3 3 5-6" />
                  </svg>
                  Draft saved · 1:20 PM
                </span>
                </>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", maxWidth: "900px", margin: "30px auto 38px" }}>
              {v.steps.map((s: any, i: number) => (
                <Fragment key={i}>
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  {s.line && (
                    <>
                    <span style={{ position: "absolute", top: "15px", left: "calc(50% + 18px)", right: "calc(-50% + 18px)", height: "2px", background: s.lineBg }} />
                    </>
                  )}
                  <span style={{ width: "30px", height: "30px", boxSizing: "border-box", borderRadius: "50%", border: `2px solid ${s.ring}`, background: s.fill, color: s.numC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "600", position: "relative", boxShadow: s.glow }}>
                    {s.n}
                  </span>
                  <span style={{ fontSize: "13.5px", fontWeight: s.w, color: s.labC }}>
                    {s.label}
                  </span>
                </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: "48px", alignItems: "start" }}>
              <div>
                {v.sections.map((sec: any, i: number) => (
                  <Fragment key={i}>
                  <section style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "44px" }}>
                    <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                      {sec.t}
                    </h2>
                    {sec.f.map((f: any, i: number) => (
                      <Fragment key={i}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                        <label htmlFor={f.id} style={{ fontSize: "14px", fontWeight: "500" }}>
                          {f.label}
                        </label>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ position: "relative", width: f.w }}>
                            <input id={f.id} defaultValue={f.v} placeholder={f.ph} style={{ width: "100%", height: "46px", boxSizing: "border-box", border: `1px solid ${f.bd}`, background: f.bg, borderRadius: "6px", padding: "0 38px 0 13px", fontSize: "15px", color: "#1A1831", fontWeight: f.fw }} />
                            {f.sel && (
                              <>
                              <svg style={{ position: "absolute", right: "14px", top: "19px", pointerEvents: "none" }} width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                                <path d="M1 1l5 5 5-5" fill="none" stroke="#1A1831" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                              </>
                            )}
                          </div>
                          {f.unit && (
                            <>
                            <div style={{ width: "96px", height: "46px", boxSizing: "border-box", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "0 13px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              {f.unit}
                              <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                                <path d="M1 1l5 5 5-5" fill="none" stroke="#1A1831" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                            </div>
                            </>
                          )}
                        </div>
                        {f.hint && (
                          <>
                          <p style={{ margin: "0", fontSize: "13px", color: "#8D8BA4" }}>
                            {f.hint}
                          </p>
                          </>
                        )}
                      </div>
                      </Fragment>
                    ))}
                  </section>
                  </Fragment>
                ))}
                <section style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "44px" }}>
                  <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                    Dimensions per piece
                  </h2>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                    {v.dims.map((d: any, i: number) => (
                      <Fragment key={i}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        <label style={{ fontSize: "13.5px", fontWeight: "500" }}>
                          {d.l}
                        </label>
                        <input defaultValue={d.v} placeholder={d.ph} aria-label={d.l} style={{ width: "104px", height: "46px", boxSizing: "border-box", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                      </div>
                      </Fragment>
                    ))}
                    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                      <label style={{ fontSize: "13.5px", fontWeight: "500" }}>
                        Unit
                      </label>
                      <div style={{ width: "96px", height: "46px", boxSizing: "border-box", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "0 13px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        cm
                        <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                          <path d="M1 1l5 5 5-5" fill="none" stroke="#1A1831" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </section>
                <section style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                  <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                    Special handling
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "9px", maxWidth: "580px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      {"Handling requirements "}
                      <span style={{ fontWeight: "400", color: "#8D8BA4" }}>
                        (optional, depends on type)
                      </span>
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {v.chips.map((c: any, i: number) => (
                        <Fragment key={i}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${c.bd}`, background: c.bg, color: c.fg, borderRadius: "999px", padding: "8px 14px", fontSize: "14px" }}>
                          <span style={{ width: "16px", height: "16px", boxSizing: "border-box", borderRadius: "4px", border: `1.5px solid ${c.box}`, background: c.boxBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" aria-hidden="true" style={{ opacity: c.op }}>
                              <path d="M5 12.5 10 17l9-10" />
                            </svg>
                          </span>
                          {c.l}
                        </label>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                    <label htmlFor="instr" style={{ fontSize: "14px", fontWeight: "500" }}>
                      {"Additional instructions "}
                      <span style={{ fontWeight: "400", color: "#8D8BA4" }}>
                        (optional)
                      </span>
                    </label>
                    <textarea id="instr" style={{ height: "104px", boxSizing: "border-box", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "11px 13px", fontSize: "15px", lineHeight: "1.45", color: "#1A1831", resize: "none" }} placeholder="Write additional instructions…" />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#5E5C76" }}>
                        {v.count}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
              <aside style={{ background: "#F0EFF6", borderRadius: "4px", padding: "28px" }}>
                <h3 style={{ margin: "0 0 18px", fontSize: "18px", fontWeight: "600" }}>
                  Booking summary
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
                  {v.sum.map((r: any, i: number) => (
                    <Fragment key={i}>
                    <div>
                      {r.k}
                      <div style={{ color: r.c, marginTop: "2px" }}>
                        {r.v}
                      </div>
                    </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600" }}>
                  Route
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
                  <div>
                    Origin
                    <div style={{ color: "#8D8BA4", marginTop: "2px" }}>
                      —
                    </div>
                  </div>
                  <div>
                    Destination
                    <div style={{ color: "#8D8BA4", marginTop: "2px" }}>
                      —
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600" }}>
                  Status
                </h4>
                <span style={{ display: "inline-flex", border: "1px solid #1A1831", borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500", background: "#FFFFFF" }}>
                  Draft
                </span>
              </aside>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
              <button type="button" disabled={!!v.empty} style={{ height: "48px", padding: "0 26px", borderRadius: "6px", border: "0", background: v.btnBg, color: v.btnFg, fontSize: "15px", fontWeight: "600", cursor: v.btnCur }}>
                Save and continue
              </button>
            </div>
          </main>
          <footer style={{ marginTop: "auto", flex: "none", background: "#F5F5F9", borderTop: "1px solid #E7E6F0", padding: "24px 52px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px", fontSize: "13.5px", color: "#5E5C76" }}>
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <span style={{ fontWeight: "600", color: "#1A1831" }}>
                LATAM Cargo
              </span>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Help center
              </a>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Conditions of carriage
              </a>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                Privacy
              </a>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#17B26A" }} />
              All systems operational · Support 24/7
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function values(props: CargoTypeProps) {
    const empty = (props.state ?? 'filled') === 'empty';
    const NAV = [['Dashboard', 'M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z', 0], ['New booking', 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z', 1], ['My bookings', 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', 0], ['Reports', 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h4', 0], ['Settings', 'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 1z', 0]];
    const active = 'New booking';
    const nav = NAV.map(([l, d, filled]) => {
      const on = l === active;
      return { l, d, fill: filled ? 'currentColor' : 'none', stroke: filled ? 'none' : 'currentColor', fg: on ? '#FFFFFF' : '#C9C7DD', w: on ? 600 : 400, bg: on ? 'rgba(255, 77, 158, 0.22)' : 'transparent', ic: on ? '#FF7BB0' : '#A9A7C4' };
    });
    const labels = ['Cargo type', 'Route and dates', 'Documents', 'Review', 'Confirmation'];
    const cur = 1;
    const steps = labels.map((label, i) => {
      const n = i + 1, done = n < cur, now = n === cur;
      return { n: done ? '✓' : String(n), label, line: n < 5,
        lineBg: done ? '#17B26A' : now ? 'linear-gradient(90deg,#3B1A8E 50%,#D5D4E1 50%)' : '#D5D4E1',
        ring: done ? '#17B26A' : now ? '#3B1A8E' : '#8D8BA4', fill: done ? '#17B26A' : '#FFFFFF',
        numC: done ? '#FFFFFF' : now ? '#3B1A8E' : '#5E5C76', glow: now ? '0 0 0 4px #ECE7FC' : 'none',
        w: now ? 600 : 500, labC: now ? '#3B1A8E' : '#5E5C76' };
    });
    const F = (id, label, v, o = {}) => ({ id, label, v: empty ? '' : v, ph: o.ph || '', sel: !!o.sel, w: o.w || '100%', unit: o.unit || '', hint: o.hint || '', bd: o.auto ? '#E7E6F0' : '#D5D4E1', bg: o.auto ? '#F0EFF6' : '#FFFFFF', fw: o.auto ? 500 : 400 });
    const sections = [
      { t: 'Cargo type', f: [F('tipo', 'Cargo type', 'Perishables', { ph: 'Select a cargo type', sel: true }), F('desc', 'Cargo description', 'Fresh salmon in insulated boxes', { ph: 'E.g. Fresh salmon in insulated boxes' }), F('bultos', 'Number of pieces', '10', { w: '140px', ph: 'E.g. 10' })] },
      { t: 'Weight', f: [F('peso', 'Weight per piece', '25', { w: '140px', unit: 'kg', ph: 'E.g. 25' }), F('total', 'Total weight', '250 kg', { w: '240px', auto: true, ph: 'Automatic', hint: 'Calculated as pieces × weight per piece.' })] }
    ];
    const dims = [['Height', '35', 'E.g. 35'], ['Width', '40', 'E.g. 40'], ['Length', '60', 'E.g. 60']].map(([l, v, ph]) => ({ l, ph, v: empty ? '' : v }));
    const sel = empty ? [] : ['Chilled 2–8 °C', 'This side up'];
    const chips = ['Chilled 2–8 °C', 'Frozen −18 °C', 'Fragile', 'This side up', 'Do not stack', 'Security escort'].map((l) => sel.includes(l)
      ? { l, bd: '#3B1A8E', bg: '#ECE7FC', fg: '#2C116F', box: '#3B1A8E', boxBg: '#3B1A8E', op: 1 }
      : { l, bd: '#D5D4E1', bg: '#FFFFFF', fg: '#1A1831', box: '#8D8BA4', boxBg: '#FFFFFF', op: 0 });
    const S = (k, v) => (empty ? { k, v: '—', c: '#8D8BA4' } : { k, v, c: '#5E5C76' });
    const sum = [S('Cargo type', 'Perishables'), S('Cargo description', 'Fresh salmon in insulated boxes'), S('Number of pieces', '10'), S('Total weight', '250 kg'), S('Dimensions', '35×40×60 cm per piece'), S('Handling requirements', 'Chilled 2–8 °C, This side up')];
    const instr = '';
    return { nav, steps, sections, dims, chips, sum, instr, count: instr.length + '/160', empty, saved: !empty,
      btnBg: empty ? '#D5D4E1' : '#3B1A8E', btnFg: empty ? '#6E6C86' : '#FFFFFF', btnCur: empty ? 'not-allowed' : 'pointer' };
}
