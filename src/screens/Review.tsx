// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type ReviewProps = Record<string, never>;

/** Step 4 · Review */
export default function Review() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "1499px", boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
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
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#5E5C76" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#067647" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8 12.5 3 3 5-6" />
                </svg>
                Draft saved · 1:38 PM
              </span>
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
              <section style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                  Review your booking
                </h2>
                <p style={{ margin: "0 0 4px", color: "#5E5C76", fontSize: "14.5px" }}>
                  Make sure everything is right. You can edit any section and come back here.
                </p>
                {v.cards.map((c: any, i: number) => (
                  <Fragment key={i}>
                  <div style={{ border: "1px solid #D5D4E1", borderRadius: "8px", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h3 style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}>
                        {c.t}
                      </h3>
                      <button type="button" style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", fontWeight: "500", color: "#3B1A8E", background: "none", border: "0", padding: "0" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
                          <path d="M4 20h4L19 9l-4-4L4 16z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px 20px" }}>
                      {c.rows.map((r: any, i: number) => (
                        <Fragment key={i}>
                        <div>
                          <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                            {r.k}
                          </div>
                          <div style={{ marginTop: "2px", fontSize: "14.5px" }}>
                            {r.v}
                          </div>
                        </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  </Fragment>
                ))}
                <div style={{ border: "1px solid #D5D4E1", borderRadius: "8px", padding: "18px 20px" }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "600" }}>
                    Estimated rate
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", fontSize: "14.5px" }}>
                    {v.rate.map((r: any, i: number) => (
                      <Fragment key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid #E7E6F0" }}>
                        <div>
                          {r.k}
                          <div style={{ fontSize: "12.5px", color: "#5E5C76" }}>
                            {r.s}
                          </div>
                        </div>
                        <span>
                          {r.v}
                        </span>
                      </div>
                      </Fragment>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "14px", fontSize: "17px", fontWeight: "600" }}>
                      <span>
                        Estimated total
                      </span>
                      <span>
                        USD 897.50
                      </span>
                    </div>
                  </div>
                </div>
                <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "14.5px" }}>
                  <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", margin: "2px 0 0", accentColor: "#3B1A8E" }} />
                  I accept the conditions of carriage and confirm the cargo information is correct.
                </label>
              </section>
              <aside style={{ background: "#F0EFF6", borderRadius: "4px", padding: "28px" }}>
                <h3 style={{ margin: "0 0 18px", fontSize: "18px", fontWeight: "600" }}>
                  Booking summary
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
                  <div>
                    Cargo type
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Perishables
                    </div>
                  </div>
                  <div>
                    Total weight
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      250 kg
                    </div>
                  </div>
                  <div>
                    Origin
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Buenos Aires (EZE)
                    </div>
                  </div>
                  <div>
                    Destination
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      São Paulo (GRU)
                    </div>
                  </div>
                  <div>
                    Pickup date
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Nov 11, 2026 · 10:00 AM
                    </div>
                  </div>
                  <div>
                    Estimated delivery
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Nov 13, 2026 · 2:00 PM
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: "600" }}>
                  Estimated rate
                </h4>
                <div style={{ fontSize: "22px", fontWeight: "600" }}>
                  USD 897.50
                </div>
                <div style={{ fontSize: "13px", color: "#5E5C76", marginTop: "2px" }}>
                  Chargeable weight 250 kg
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
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
              <button type="button" style={{ height: "48px", padding: "0 26px", borderRadius: "6px", border: "1.5px solid #D5D4E1", background: "#FFFFFF", color: "#3B1A8E", fontSize: "15px", fontWeight: "600" }}>
                Back
              </button>
              <button type="button" style={{ height: "48px", padding: "0 26px", borderRadius: "6px", border: "0", background: "#3B1A8E", color: "#FFFFFF", fontSize: "15px", fontWeight: "600" }}>
                Confirm booking
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

function values() {
    const NAV = [['Dashboard', 'M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z', 0], ['New booking', 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z', 1], ['My bookings', 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', 0], ['Reports', 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h4', 0], ['Settings', 'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 1z', 0]];
    const active = 'New booking';
    const nav = NAV.map(([l, d, filled]) => {
      const on = l === active;
      return { l, d, fill: filled ? 'currentColor' : 'none', stroke: filled ? 'none' : 'currentColor', fg: on ? '#FFFFFF' : '#C9C7DD', w: on ? 600 : 400, bg: on ? 'rgba(255, 77, 158, 0.22)' : 'transparent', ic: on ? '#FF7BB0' : '#A9A7C4' };
    });
    const labels = ['Cargo type', 'Route and dates', 'Documents', 'Review', 'Confirmation'];
    const cur = 4;
    const steps = labels.map((label, i) => {
      const n = i + 1, done = n < cur, now = n === cur;
      return { n: done ? '✓' : String(n), label, line: n < 5,
        lineBg: done ? '#17B26A' : now ? 'linear-gradient(90deg,#3B1A8E 50%,#D5D4E1 50%)' : '#D5D4E1',
        ring: done ? '#17B26A' : now ? '#3B1A8E' : '#8D8BA4', fill: done ? '#17B26A' : '#FFFFFF',
        numC: done ? '#FFFFFF' : now ? '#3B1A8E' : '#5E5C76', glow: now ? '0 0 0 4px #ECE7FC' : 'none',
        w: now ? 600 : 500, labC: now ? '#3B1A8E' : '#5E5C76' };
    });
    const R = (k, v) => ({ k, v });
    const cards = [
      { t: 'Cargo', rows: [R('Type', 'Perishables'), R('Description', 'Fresh salmon in insulated boxes'), R('Pieces', '10 × 25 kg'), R('Dimensions', '35×40×60 cm'), R('Requirements', 'Chilled 2–8 °C, This side up')] },
      { t: 'Route and dates', rows: [R('Origin', 'Buenos Aires (EZE)'), R('Destination', 'São Paulo (GRU)'), R('Pickup', 'Nov 11, 2026 · 10:00 AM'), R('Flight', 'LA8045'), R('Estimated delivery', 'Nov 13, 2026 · 2:00 PM')] },
      { t: 'Documents', rows: [R('Attached', '3 of 3'), R('Optional', 'Certificate of origin not attached')] }
    ];
    const rate = [
      { k: 'Chargeable weight', s: 'Actual weight (volumetric 140 kg)', v: '250 kg' },
      { k: 'Freight', s: '250 kg × USD 2.60', v: 'USD 650.00' },
      { k: 'Perishables surcharge', s: '15% of freight', v: 'USD 97.50' },
      { k: 'Fuel', s: 'USD 0.45 per kg', v: 'USD 112.50' },
      { k: 'Security', s: 'USD 0.15 per kg', v: 'USD 37.50' }
    ];
    return { nav, steps, cards, rate };
}
