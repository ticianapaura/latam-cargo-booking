// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type RouteDatesErrorsProps = Record<string, never>;

/** Step 2 · Route, date and postal code errors */
export default function RouteDatesErrors() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "2341px", boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "20px", margin: "14px 0 6px" }}>
              <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600" }}>
                New booking
              </h1>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#5E5C76" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#067647" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8 12.5 3 3 5-6" />
                </svg>
                Draft saved · 1:31 PM
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
              <div>
                <div role="alert" style={{ display: "flex", gap: "12px", padding: "16px 18px", borderRadius: "8px", border: "1px solid #FBCFCB", background: "#FEF3F2", color: "#B42318", marginBottom: "26px", fontSize: "14.5px" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7.5v5.5M12 16.5v.01" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "6px" }}>
                      Check 5 fields to continue
                    </div>
                    <ul style={{ margin: "0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px", lineHeight: "1.4" }}>
                      <li>
                        <a href="#oa" style={{ color: "inherit", fontWeight: "500" }}>
                          Origin airport
                        </a>
                        : Mendoza (MDZ) handles domestic cargo only.
                      </li>
                      <li>
                        <a href="#odir" style={{ color: "inherit", fontWeight: "500" }}>
                          Pickup address
                        </a>
                        : include street and number.
                      </li>
                      <li>
                        <a href="#ocp" style={{ color: "inherit", fontWeight: "500" }}>
                          Origin postal code
                        </a>
                        : this doesn't look like an Argentine postal code. Check it against the address.
                      </li>
                      <li>
                        <a href="#fecha" style={{ color: "inherit", fontWeight: "500" }}>
                          Pickup date
                        </a>
                        : can't be earlier than today.
                      </li>
                      <li>
                        <a href="#hora" style={{ color: "inherit", fontWeight: "500" }}>
                          Pickup time
                        </a>
                        : we pick up between 6 AM and 10 PM.
                      </li>
                    </ul>
                  </div>
                </div>
                {v.sides.map((sd: any, i: number) => (
                  <Fragment key={i}>
                  <section style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "44px" }}>
                    <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                      {sd.title}
                    </h2>
                    {sd.fields.map((f: any, i: number) => (
                      <Fragment key={i}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                        <label htmlFor={f.id} style={{ fontSize: "14px", fontWeight: "500" }}>
                          {f.label}
                        </label>
                        <div style={{ position: "relative", width: f.w }}>
                          <input id={f.id} defaultValue={f.value} placeholder={f.ph} style={{ width: "100%", height: "46px", boxSizing: "border-box", border: `1px solid ${f.bd}`, borderRadius: "6px", padding: "0 38px 0 13px", fontSize: "15px", color: "#1A1831", background: "#FFFFFF" }} />
                          {f.sel && (
                            <>
                            <svg style={{ position: "absolute", right: "14px", top: "19px", pointerEvents: "none" }} width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                              <path d="M1 1l5 5 5-5" fill="none" stroke="#1A1831" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
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
                        {f.err && (
                          <>
                          <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", lineHeight: "1.4", color: "#B42318" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                              <circle cx="12" cy="12" r="9" />
                              <path d="M12 7.5v5.5M12 16.5v.01" />
                            </svg>
                            <span>
                              {f.err}{" "}
                              {f.fix && (
                                <>
                                <button type="button" style={{ fontSize: "13px", fontWeight: "600", color: "#B42318", background: "none", border: "0", borderBottom: "1px solid currentColor", padding: "0", marginLeft: "4px" }}>
                                  {f.fix}
                                </button>
                                </>
                              )}
                            </span>
                          </p>
                          </>
                        )}
                      </div>
                      </Fragment>
                    ))}
                  </section>
                  </Fragment>
                ))}
                <section style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                  <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                    Schedule
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px", maxWidth: "470px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                      <label htmlFor="fecha" style={{ fontSize: "14px", fontWeight: "500" }}>
                        Pickup date
                      </label>
                      <input id="fecha" defaultValue="11/07/2026" style={{ height: "46px", boxSizing: "border-box", border: "1px solid #E8443A", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                      <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", lineHeight: "1.4", color: "#B42318" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7.5v5.5M12 16.5v.01" />
                        </svg>
                        The pickup date can't be earlier than today.
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                      <label htmlFor="hora" style={{ fontSize: "14px", fontWeight: "500" }}>
                        Pickup time
                      </label>
                      <input id="hora" defaultValue="11:30 PM" style={{ height: "46px", boxSizing: "border-box", border: "1px solid #E8443A", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                      <p style={{ margin: "0", fontSize: "13px", color: "#8D8BA4" }}>
                        Between 6 AM and 10 PM
                      </p>
                      <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", lineHeight: "1.4", color: "#B42318" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7.5v5.5M12 16.5v.01" />
                        </svg>
                        We pick up between 6 AM and 10 PM. Choose another time.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      Estimated delivery
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
                      <div style={{ height: "46px", boxSizing: "border-box", border: "1px solid #E7E6F0", background: "#F0EFF6", borderRadius: "6px", padding: "0 13px", fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center" }}>
                        11/09/2026
                      </div>
                      <div style={{ height: "46px", boxSizing: "border-box", border: "1px solid #E7E6F0", background: "#F0EFF6", borderRadius: "6px", padding: "0 13px", fontSize: "15px", fontWeight: "500", display: "flex", alignItems: "center" }}>
                        2:00 PM
                      </div>
                    </div>
                    <p style={{ margin: "0", fontSize: "13px", color: "#8D8BA4" }}>
                      Estimated transit 48 h for the MDZ → GRU route.
                    </p>
                    <div style={{ display: "flex", gap: "7px", padding: "9px 11px", borderRadius: "6px", border: "1px solid #CFE2FD", background: "#EFF6FF", color: "#1849A9", fontSize: "13.5px", lineHeight: "1.4" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 11v5M12 7.5v.01" />
                      </svg>
                      Estimated delivery is calculated from the route and pickup time.
                    </div>
                  </div>
                </section>
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
                      Chilled 2–8 °C, This side up
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
                      Mendoza (MDZ)
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
                      Nov 7, 2026 · 11:30 PM
                    </div>
                  </div>
                  <div>
                    Estimated delivery
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Nov 9, 2026 · 2:00 PM
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
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid #1A1831", borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500", background: "#FFFFFF" }}>
                  Draft
                </span>
              </aside>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
              <button type="button" style={{ height: "48px", padding: "0 26px", borderRadius: "6px", border: "1.5px solid #D5D4E1", background: "#FFFFFF", color: "#3B1A8E", fontSize: "15px", fontWeight: "600" }}>
                Back
              </button>
              <button type="button" style={{ height: "48px", padding: "0 26px", borderRadius: "6px", border: "0", background: "#3B1A8E", color: "#FFFFFF", fontSize: "15px", fontWeight: "600" }}>
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

function values() {
    const labels = ['Cargo type', 'Route and dates', 'Documents', 'Review', 'Confirmation'];
    const cur = 2;
    const steps = labels.map((label, i) => {
      const n = i + 1, done = n < cur, now = n === cur;
      return {
        n: done ? '✓' : String(n), label, line: n < 5,
        lineBg: done ? '#17B26A' : now ? 'linear-gradient(90deg,#3B1A8E 50%,#D5D4E1 50%)' : '#D5D4E1',
        ring: done ? '#17B26A' : now ? '#3B1A8E' : '#8D8BA4', fill: done ? '#17B26A' : '#FFFFFF',
        numC: done ? '#FFFFFF' : now ? '#3B1A8E' : '#5E5C76', glow: now ? '0 0 0 4px #ECE7FC' : 'none',
        w: now ? 600 : 500, labC: now ? '#3B1A8E' : '#5E5C76'
      };
    });
    const F = (id, label, value, o = {}) => ({ id, label, value, ph: o.ph || '', w: o.w || '100%', sel: !!o.sel, hint: o.hint || '', err: o.err || '', fix: o.fix || '', bd: o.err ? '#E8443A' : '#D5D4E1' });
    const sides = [
      { title: 'Route: Origin', fields: [
        F('op', 'Country', 'Argentina', { sel: true }),
        F('oc', 'City', 'Mendoza', { sel: true }),
        F('oa', 'Origin airport', 'MDZ · El Plumerillo', { sel: true, err: 'Mendoza (MDZ) handles domestic cargo only. For international shipments, use EZE.', fix: 'Use EZE' }),
        F('odir', 'Pickup address', 'No-number street', { err: 'Include street and number, for example “1234 Corrientes Ave.”' }),
        F('ocp', 'Postal code', '55', { w: '240px', hint: 'E.g. 1804 or B1804ABC', err: 'This postal code doesn\u2019t look right. It should look like 1804 or B1804ABC.' })
      ] },
      { title: 'Route: Destination', fields: [
        F('dp', 'Country', 'Brazil', { sel: true }),
        F('dc', 'City', 'São Paulo', { sel: true }),
        F('da', 'Destination airport', 'GRU · Guarulhos', { sel: true }),
        F('ddir', 'Delivery address', 'Rua Dr. Assis 410, Guarulhos'),
        F('dcp', 'Postal code', '07190-100', { w: '240px', hint: 'E.g. 07190-100' })
      ] }
    ];
    return { steps, sides };
}
