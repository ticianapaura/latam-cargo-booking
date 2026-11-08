// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type TrackingCustomsProps = Record<string, never>;

/** Tracking · Held at customs */
export default function TrackingCustoms() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "1603px", boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
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
          <a href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "76px", padding: "4px 0", color: "#C9C7DD", textDecoration: "none" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#A9A7C4" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
              </svg>
            </span>
            New booking
          </a>
          <a href="#" aria-current="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "76px", padding: "4px 0", color: "#FFFFFF", fontWeight: "600", textDecoration: "none" }}>
            <span style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255, 77, 158, 0.22)", color: "#FF7BB0" }}>
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
              Back to My bookings
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px", marginTop: "16px" }}>
              <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600" }}>
                Booking #1234
              </h1>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #E8443A", color: "#B42318", background: "#FEF3F2", borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7.5v5.5M12 16.5v.01" />
                </svg>
                Action required
              </span>
              <span style={{ fontSize: "16px" }}>
                {"AWB "}
                <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  045-12345678
                </span>
              </span>
              <span style={{ fontSize: "16px" }}>
                <b style={{ fontWeight: "600" }}>
                  Flight
                </b>
                {" LA8045"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "34px", borderBottom: "1px solid #D5D4E1", margin: "24px 0 30px" }}>
              {v.tabs.map((t: any, i: number) => (
                <Fragment key={i}>
                <span style={{ padding: "12px 0", fontSize: "15.5px", color: t.c, fontWeight: t.w, borderBottom: `2px solid ${t.b}`, marginBottom: "-1px" }}>
                  {t.l}
                </span>
                </Fragment>
              ))}
            </div>
            <h2 style={{ margin: "0 0 22px", fontSize: "26px", fontWeight: "600" }}>
              Tracking
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", borderRadius: "6px", boxShadow: "0 1px 3px rgba(20,16,60,0.12), 0 0 0 1px #E7E6F0", overflow: "hidden" }}>
              <div style={{ padding: "8px 32px 32px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", marginBottom: "26px" }}>
                  <span style={{ textAlign: "center", padding: "16px 0", fontSize: "16px", fontWeight: "600", color: "#3B1A8E", borderBottom: "2px solid #3B1A8E" }}>
                    Details
                  </span>
                  <span style={{ textAlign: "center", padding: "16px 0", fontSize: "16px", fontWeight: "500", color: "#5E5C76", borderBottom: "2px solid #E7E6F0" }}>
                    Map
                  </span>
                </div>
                <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8D8BA4", margin: "0 0 16px 48px" }}>
                  Upcoming milestones
                </div>
                {v.future.map((e: any, i: number) => (
                  <Fragment key={i}>
                  <div style={{ display: "grid", gridTemplateColumns: "34px minmax(0, 1fr)", gap: "14px", position: "relative", paddingBottom: "22px" }}>
                    <span style={{ position: "absolute", left: "16px", top: "34px", bottom: "0", width: "0", borderLeft: "2px dashed #D5D4E1" }} />
                    <span style={{ width: "34px", height: "34px", boxSizing: "border-box", borderRadius: "50%", border: "2px dashed #8D8BA4", background: "#FFFFFF", position: "relative" }} />
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: "#5E5C76" }}>
                        {e.d}
                      </div>
                      <div style={{ fontSize: "15px", color: "#5E5C76" }}>
                        {e.e}
                      </div>
                      <div style={{ fontSize: "14px", color: "#8D8BA4" }}>
                        {e.w}
                      </div>
                    </div>
                  </div>
                  </Fragment>
                ))}
                <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", color: "#8D8BA4", margin: "4px 0 16px 48px" }}>
                  History
                </div>
                {v.events.map((e: any, i: number) => (
                  <Fragment key={i}>
                  <div style={{ display: "grid", gridTemplateColumns: "34px minmax(0, 1fr)", gap: "14px", position: "relative", paddingBottom: "26px" }}>
                    {e.line && (
                      <>
                      <span style={{ position: "absolute", left: "16px", top: "34px", bottom: "0", width: "2px", background: e.lineC }} />
                      </>
                    )}
                    <span style={{ width: "34px", height: "34px", boxSizing: "border-box", borderRadius: "50%", background: e.dot, border: e.ring, color: e.ic, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", fontSize: "15px", fontWeight: "700" }}>
                      {e.glyph}
                    </span>
                    <div>
                      <div style={{ fontSize: e.ts, fontWeight: "600", lineHeight: "1.3", color: e.tc }}>
                        {e.d}
                      </div>
                      <div style={{ fontSize: "16.5px", marginTop: "2px", color: e.tc }}>
                        {e.e}
                      </div>
                      <div style={{ fontSize: "14.5px", color: "#5E5C76", marginTop: "4px" }}>
                        {e.w}
                      </div>
                      {e.card && (
                        <>
                        <div style={{ marginTop: "10px", padding: "12px 14px", borderRadius: "8px", background: "#FEF3F2", color: "#B42318", border: "1px solid #FBCFCB", fontSize: "14px", lineHeight: "1.45" }}>
                          {e.card}{" "}
                          <div style={{ marginTop: "10px" }}>
                            <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: "8px", height: "36px", padding: "0 14px", borderRadius: "6px", border: "0", background: "#3B1A8E", color: "#FFFFFF", fontSize: "14px", fontWeight: "600" }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
                                <path d="M12 15V4M7 9l5-5 5 5" />
                                <path d="M4 15v5h16v-5" />
                              </svg>
                              Upload certificate
                            </button>
                          </div>
                        </div>
                        </>
                      )}
                    </div>
                  </div>
                  </Fragment>
                ))}
              </div>
              <aside style={{ background: "#F0EFF6", padding: "28px" }}>
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
                      Fresh salmon
                    </div>
                  </div>
                  <div>
                    Number of pieces
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      10
                    </div>
                  </div>
                  <div>
                    Total weight
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      250 kg
                    </div>
                  </div>
                  <div>
                    Dimensions
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      35×40×60 cm per piece
                    </div>
                  </div>
                  <div>
                    Handling requirements
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Chilled 2–8 °C
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600" }}>
                  Route
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
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
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600" }}>
                  Schedule
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
                  <div>
                    Pickup date
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Sep 29, 2026 · 6:40 PM
                    </div>
                  </div>
                  <div>
                    Estimated delivery
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Oct 2, 2026 · 2:00 PM
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600" }}>
                  Status
                </h4>
                <span style={{ display: "inline-flex", border: "1px solid #E8443A", color: "#B42318", background: "#FEF3F2", borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500" }}>
                  Action required
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
    const tabs = ['Summary', 'Tracking', 'Documents', 'Billing', 'Payment', 'After-sales'].map((l) => l === 'Tracking'
      ? { l, c: '#1A1831', w: 600, b: '#1A1831' } : { l, c: '#5E5C76', w: 400, b: 'transparent' });
    const ok = (d, e, w) => ({ d, e, w, dot: '#17B26A', ring: '0', ic: '#FFFFFF', glyph: '✓', lineC: '#17B26A', ts: '19px', tc: '#1A1831', card: '' });
    const L = 'Buenos Aires (EZE), Argentina';
    const events = [
      { d: 'Oct 1 · 9:10 AM', e: 'Held at customs', w: 'Guarulhos customs, Brazil', dot: '#E8443A', ring: '0', ic: '#FFFFFF', glyph: '!', lineC: '#D5D4E1', ts: '19px', tc: '#1A1831',
        card: 'The origin health certificate is missing. Upload it to release the cargo; each day on hold adds refrigerated storage fees.' },
      ok('Sep 30 · 1:25 PM', 'Arrived in São Paulo (GRU)', 'Guarulhos, Brazil'),
      ok('Sep 30 · 10:45 AM', 'In flight', 'Flight LA8045 · EZE → GRU'),
      ok('Sep 30 · 6:20 AM', 'Cargo loaded', L),
      ok('Sep 30 · 1:30 AM', 'Cargo processed for dispatch', L),
      ok('Sep 29 · 6:40 PM', 'Cargo picked up at origin', 'Ezeiza, Buenos Aires'),
      ok('Sep 29 · 2:20 PM', 'Booking confirmed', 'AWB 045-12345678')
    ].map((e, i, a) => ({ ...e, line: i < a.length - 1 }));
    const future = [
      { d: 'Oct 2 · 2:00 PM', e: 'Delivered at destination', w: 'Estimated · Guarulhos, Brazil' },
      { d: 'Oct 1 · 10:00 AM', e: 'Customs clearance', w: 'Estimated' }
    ];
    return { tabs, events, future };
}
