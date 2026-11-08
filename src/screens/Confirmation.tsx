// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type ConfirmationProps = Record<string, never>;

/** Step 5 · Confirmation */
export default function Confirmation() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "898px", boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
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
            <h1 style={{ margin: "14px 0 6px", fontSize: "30px", fontWeight: "600" }}>
              New booking
            </h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", maxWidth: "900px", margin: "30px auto 44px" }}>
              {v.steps.map((s: any, i: number) => (
                <Fragment key={i}>
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  {s.line && (
                    <>
                    <span style={{ position: "absolute", top: "15px", left: "calc(50% + 18px)", right: "calc(-50% + 18px)", height: "2px", background: "#17B26A" }} />
                    </>
                  )}
                  <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#17B26A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M5 12.5 10 17l9-10" />
                    </svg>
                  </span>
                  <span style={{ fontSize: "13.5px", fontWeight: "500", color: "#5E5C76" }}>
                    {s.label}
                  </span>
                </div>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: "48px", alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "620px" }}>
                <span style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#17B26A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M5 12.5 10 17l9-10" />
                  </svg>
                </span>
                <h2 style={{ margin: "0", fontSize: "30px", fontWeight: "600" }}>
                  Booking confirmed
                </h2>
                <p style={{ margin: "0", color: "#5E5C76", fontSize: "16px" }}>
                  We sent the confirmation and air waybill to your account email. Tracking starts once we pick up the cargo.
                </p>
                <div style={{ display: "flex", gap: "16px", alignItems: "baseline", border: "1px dashed #8D8BA4", borderRadius: "8px", padding: "16px 20px" }}>
                  <span style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#5E5C76" }}>
                    AWB
                  </span>
                  <strong style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "28px", fontWeight: "500", letterSpacing: "0.02em" }}>
                    045-38216074
                  </strong>
                </div>
                <div style={{ border: "1px solid #D5D4E1", borderRadius: "8px", padding: "18px 20px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px 20px" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Route
                    </div>
                    <div style={{ marginTop: "2px" }}>
                      EZE → GRU · Flight LA8045
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Pickup
                    </div>
                    <div style={{ marginTop: "2px" }}>
                      Nov 11, 2026 · 10:00 AM
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Estimated delivery
                    </div>
                    <div style={{ marginTop: "2px" }}>
                      Nov 13, 2026 · 2:00 PM
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Estimated total
                    </div>
                    <div style={{ marginTop: "2px" }}>
                      USD 897.50
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                  <button type="button" style={{ height: "48px", padding: "0 26px", borderRadius: "6px", border: "0", background: "#3B1A8E", color: "#FFFFFF", fontSize: "15px", fontWeight: "600" }}>
                    Go to My bookings
                  </button>
                  <button type="button" style={{ height: "48px", padding: "0 26px", borderRadius: "6px", border: "1.5px solid #D5D4E1", background: "#FFFFFF", color: "#3B1A8E", fontSize: "15px", fontWeight: "600" }}>
                    Create another booking
                  </button>
                </div>
              </div>
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
                    Cargo description
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Fresh salmon in insulated boxes
                    </div>
                  </div>
                  <div>
                    Total weight
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      250 kg
                    </div>
                  </div>
                  <div>
                    Documents
                    <div style={{ color: "#067647", marginTop: "2px" }}>
                      All attached
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600" }}>
                  Status
                </h4>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #17B26A", color: "#067647", background: "#ECFDF3", borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500" }}>
                  Confirmed
                </span>
              </aside>
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
    const steps = ['Cargo type', 'Route and dates', 'Documents', 'Review', 'Confirmation'].map((label, i) => ({ label, line: i < 4 }));
    return { nav, steps };
}
