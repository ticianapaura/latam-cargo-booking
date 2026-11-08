// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type ConfirmationPendingProps = Record<string, never>;

/** Step 5 · Booked with pending documents */
export default function ConfirmationPending() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "1001px", boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
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
          <a href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "76px", padding: "4px 0", color: "#C9C7DD", textDecoration: "none" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#A9A7C4" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z" />
              </svg>
            </span>
            Dashboard
          </a>
          <a href="#" aria-current="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "76px", padding: "4px 0", color: "#FFFFFF", fontWeight: "600", textDecoration: "none" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255, 77, 158, 0.22)", color: "#FF7BB0" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
              </svg>
            </span>
            New booking
          </a>
          <a href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "76px", padding: "4px 0", color: "#C9C7DD", textDecoration: "none" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#A9A7C4" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
                <path d="m3 8 9 5 9-5M12 13v8" />
              </svg>
            </span>
            My bookings
          </a>
          <a href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "76px", padding: "4px 0", color: "#C9C7DD", textDecoration: "none" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#A9A7C4" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="3" width="14" height="18" rx="1.5" />
                <path d="M9 8h6M9 12h6M9 16h4" />
              </svg>
            </span>
            Reports
          </a>
          <a href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "76px", padding: "4px 0", color: "#C9C7DD", textDecoration: "none" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#A9A7C4" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 1z" />
              </svg>
            </span>
            Settings
          </a>
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
                <div role="status" style={{ display: "flex", gap: "12px", padding: "14px 16px", borderRadius: "8px", border: "1px solid #FBE3B0", background: "#FFFAEB", color: "#A04305", fontSize: "14.5px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                    <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                    <path d="M12 9v4M12 17v.01" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: "600" }}>
                      You have 1 pending document
                    </div>
                    Packing list. Attach it by Nov 11, 2026 at 10:00 AM so we can pick up the cargo on time.
                  </div>
                </div>
                <div style={{ border: "1px solid #D5D4E1", borderRadius: "8px", padding: "18px 20px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px 20px" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Route
                    </div>
                    <div style={{ marginTop: "2px" }}>
                      EZE → GRU · Flight LA8047
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Pickup
                    </div>
                    <div style={{ marginTop: "2px" }}>
                      Nov 12, 2026 · 10:00 AM
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Estimated delivery
                    </div>
                    <div style={{ marginTop: "2px" }}>
                      Nov 14, 2026 · 2:00 PM
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Estimated total
                    </div>
                    <div style={{ marginTop: "2px" }}>
                      USD 954.94
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
                    Handling requirements
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Chilled 2–8 °C, This side up
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600" }}>
                  Status
                </h4>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #17B26A", color: "#067647", background: "#ECFDF3", borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8 12.5 3 3 5-6" />
                  </svg>
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
    const steps = ['Cargo type', 'Route and dates', 'Documents', 'Review', 'Confirmation'].map((label, i) => ({ label, line: i < 4 }));
    return { steps };
}
