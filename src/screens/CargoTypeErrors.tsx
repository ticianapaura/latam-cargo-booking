// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type CargoTypeErrorsProps = Record<string, never>;

/** Step 1 · Error summary and inline errors */
export default function CargoTypeErrors() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "2090px", boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
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
                Draft saved · 1:24 PM
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
                      Check 6 fields to continue
                    </div>
                    <ul style={{ margin: "0", paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px", lineHeight: "1.4" }}>
                      <li>
                        <a href="#desc" style={{ color: "inherit", fontWeight: "500" }}>
                          Cargo description
                        </a>
                        : use at least 3 characters.
                      </li>
                      <li>
                        <a href="#bultos" style={{ color: "inherit", fontWeight: "500" }}>
                          Number of pieces
                        </a>
                        : use a whole number, no decimals.
                      </li>
                      <li>
                        <a href="#peso" style={{ color: "inherit", fontWeight: "500" }}>
                          Weight per piece
                        </a>
                        : 1,000 kg max per piece.
                      </li>
                      <li>
                        <a href="#alto" style={{ color: "inherit", fontWeight: "500" }}>
                          Dimensions
                        </a>
                        : the hold's maximum height is 244 cm.
                      </li>
                      <li>
                        <a href="#reqs" style={{ color: "inherit", fontWeight: "500" }}>
                          Handling requirements
                        </a>
                        : choose Chilled or Frozen, not both.
                      </li>
                      <li>
                        <a href="#instr" style={{ color: "inherit", fontWeight: "500" }}>
                          Additional instructions
                        </a>
                        : 29 characters over the limit.
                      </li>
                    </ul>
                  </div>
                </div>
                <section style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "44px" }}>
                  <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                    Cargo type
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                    <label htmlFor="tipo" style={{ fontSize: "14px", fontWeight: "500" }}>
                      Cargo type
                    </label>
                    <div style={{ position: "relative" }}>
                      <select id="tipo" style={{ width: "100%", height: "46px", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "0 38px 0 13px", fontSize: "15px", color: "#1A1831", background: "#FFFFFF", appearance: "none" }}>
                        <option>
                          Perishables
                        </option>
                      </select>
                      <svg style={{ position: "absolute", right: "14px", top: "19px", pointerEvents: "none" }} width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                        <path d="M1 1l5 5 5-5" fill="none" stroke="#1A1831" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                    <label htmlFor="desc" style={{ fontSize: "14px", fontWeight: "500" }}>
                      Cargo description
                    </label>
                    <input id="desc" defaultValue="Sa" aria-invalid="true" style={{ height: "46px", boxSizing: "border-box", border: "1px solid #E8443A", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                    <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", lineHeight: "1.4", color: "#B42318" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7.5v5.5M12 16.5v.01" />
                      </svg>
                      Use at least 3 characters to describe the cargo.
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                    <label htmlFor="bultos" style={{ fontSize: "14px", fontWeight: "500" }}>
                      Number of pieces
                    </label>
                    <input id="bultos" defaultValue="2.5" aria-invalid="true" style={{ width: "140px", height: "46px", boxSizing: "border-box", border: "1px solid #E8443A", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                    <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", lineHeight: "1.4", color: "#B42318" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7.5v5.5M12 16.5v.01" />
                      </svg>
                      Use a whole number, with no decimals or symbols.
                    </p>
                  </div>
                </section>
                <section style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "44px" }}>
                  <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                    Weight
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                    <label htmlFor="peso" style={{ fontSize: "14px", fontWeight: "500" }}>
                      Weight per piece
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input id="peso" defaultValue="1200" aria-invalid="true" style={{ width: "140px", height: "46px", boxSizing: "border-box", border: "1px solid #E8443A", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                      <div style={{ position: "relative" }}>
                        <select aria-label="Weight unit" style={{ width: "96px", height: "46px", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "0 30px 0 13px", fontSize: "15px", color: "#1A1831", background: "#FFFFFF", appearance: "none" }}>
                          <option>
                            kg
                          </option>
                        </select>
                        <svg style={{ position: "absolute", right: "14px", top: "19px", pointerEvents: "none" }} width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                          <path d="M1 1l5 5 5-5" fill="none" stroke="#1A1831" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", lineHeight: "1.4", color: "#B42318" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7.5v5.5M12 16.5v.01" />
                      </svg>
                      1,000 kg max per piece (you entered 1,200 kg). For heavier pieces, request an oversized cargo quote.
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "500" }}>
                      Total weight
                    </label>
                    <div style={{ width: "240px", height: "46px", boxSizing: "border-box", border: "1px solid #E7E6F0", background: "#F0EFF6", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#8D8BA4", display: "flex", alignItems: "center" }}>
                      Automatic
                    </div>
                    <p style={{ margin: "0", fontSize: "13px", color: "#8D8BA4" }}>
                      Calculated as pieces × weight per piece.
                    </p>
                  </div>
                </section>
                <section style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "44px" }}>
                  <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                    Dimensions per piece
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        <label htmlFor="alto" style={{ fontSize: "13.5px", fontWeight: "500" }}>
                          Height
                        </label>
                        <input id="alto" defaultValue="250" aria-invalid="true" style={{ width: "104px", height: "46px", boxSizing: "border-box", border: "1px solid #E8443A", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                      </div>
                      <span style={{ paddingBottom: "13px", color: "#5E5C76" }}>
                        ×
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        <label htmlFor="ancho" style={{ fontSize: "13.5px", fontWeight: "500" }}>
                          Width
                        </label>
                        <input id="ancho" defaultValue="80" style={{ width: "104px", height: "46px", boxSizing: "border-box", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                      </div>
                      <span style={{ paddingBottom: "13px", color: "#5E5C76" }}>
                        ×
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        <label htmlFor="largo" style={{ fontSize: "13.5px", fontWeight: "500" }}>
                          Length
                        </label>
                        <input id="largo" defaultValue="120" style={{ width: "104px", height: "46px", boxSizing: "border-box", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "0 13px", fontSize: "15px", color: "#1A1831" }} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        <label style={{ fontSize: "13.5px", fontWeight: "500" }}>
                          Unit
                        </label>
                        <div style={{ width: "96px", height: "46px", boxSizing: "border-box", border: "1px solid #D5D4E1", borderRadius: "6px", padding: "0 13px", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          cm
                          <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
                            <path d="M1 1l5 5 5-5" fill="none" stroke="#1A1831" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", lineHeight: "1.4", color: "#B42318", maxWidth: "560px" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7.5v5.5M12 16.5v.01" />
                      </svg>
                      The hold's maximum height is 244 cm (you entered 250 cm). Split the cargo into lower pieces.
                    </p>
                  </div>
                </section>
                <section style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                  <h2 style={{ margin: "0", fontSize: "22px", fontWeight: "600", paddingBottom: "12px", borderBottom: "1px solid #D5D4E1" }}>
                    Special handling
                  </h2>
                  <div id="reqs" style={{ display: "flex", flexDirection: "column", gap: "9px", maxWidth: "580px" }}>
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
                    <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", color: "#B42318" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7.5v5.5M12 16.5v.01" />
                      </svg>
                      Choose Chilled or Frozen, not both.
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", maxWidth: "470px" }}>
                    <label htmlFor="instr" style={{ fontSize: "14px", fontWeight: "500" }}>
                      {"Additional instructions "}
                      <span style={{ fontWeight: "400", color: "#8D8BA4" }}>
                        (optional)
                      </span>
                    </label>
                    <textarea id="instr" aria-invalid="true" style={{ height: "104px", boxSizing: "border-box", border: "1px solid #E8443A", borderRadius: "6px", padding: "11px 13px", fontSize: "15px", lineHeight: "1.45", color: "#1A1831", resize: "none" }} defaultValue="Keep the cold chain at all times. The consignee receives Monday to Friday, 8 AM to 5 PM; outside those hours, coordinate with site security first." />
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                      <p style={{ display: "flex", gap: "7px", margin: "0", fontSize: "13.5px", color: "#B42318" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7.5v5.5M12 16.5v.01" />
                        </svg>
                        29 characters over the limit.
                      </p>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: "#B42318" }}>
                        189/160
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
                  <div>
                    Cargo type
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Perishables
                    </div>
                  </div>
                  <div>
                    Cargo description
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Sa
                    </div>
                  </div>
                  <div>
                    Number of pieces
                    <div style={{ color: "#8D8BA4", marginTop: "2px" }}>
                      —
                    </div>
                  </div>
                  <div>
                    Total weight
                    <div style={{ color: "#8D8BA4", marginTop: "2px" }}>
                      —
                    </div>
                  </div>
                  <div>
                    Dimensions
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      250×80×120 cm per piece
                    </div>
                  </div>
                  <div>
                    Handling requirements
                    <div style={{ color: "#5E5C76", marginTop: "2px" }}>
                      Chilled 2–8 °C, Frozen −18 °C
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
                  Schedule
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
                  <div>
                    Pickup date
                    <div style={{ color: "#8D8BA4", marginTop: "2px" }}>
                      —
                    </div>
                  </div>
                  <div>
                    Estimated delivery
                    <div style={{ color: "#8D8BA4", marginTop: "2px" }}>
                      —
                    </div>
                  </div>
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
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
              <button type="button" disabled aria-disabled="true" style={{ height: "48px", padding: "0 26px", borderRadius: "6px", border: "0", background: "#D5D4E1", color: "#6E6C86", fontSize: "15px", fontWeight: "600", cursor: "not-allowed" }}>
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
    const cur = 1;
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
    const chips = [['Chilled 2–8 °C', 'err'], ['Frozen −18 °C', 'err'], ['Fragile'], ['This side up'], ['Do not stack'], ['Security escort']]
      .map(([l, s]) => s === 'err'
        ? { l, bd: '#E8443A', bg: '#FEF3F2', fg: '#B42318', box: '#E8443A', boxBg: '#E8443A', op: 1 }
        : { l, bd: '#D5D4E1', bg: '#FFFFFF', fg: '#1A1831', box: '#8D8BA4', boxBg: '#FFFFFF', op: 0 });
    return { steps, chips };
}
