// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type TrackingProps = { scenario?: "normal" | "delay" | "stale"; tab?: "details" | "map" };

/** Tracking (props: scenario = normal | delay | stale, tab = details | map) */
export default function Tracking({ scenario = "normal", tab = "details" }: TrackingProps = {}) {
  const props = { scenario, tab };
  const v = values(props);
  return (
    <div style={{ width: "1400px", minHeight: `${v.rootH}px`, boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
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
              Back to My bookings
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 22px", marginTop: "16px" }}>
              <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600" }}>
                Booking #1234
              </h1>
              <span style={{ display: "inline-flex", border: `1px solid ${v.chip.bd}`, color: v.chip.fg, background: v.chip.bg, borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500" }}>
                {v.chip.l}
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
                  <span style={{ textAlign: "center", padding: "16px 0", fontSize: "16px", fontWeight: v.tD.w, color: v.tD.c, borderBottom: `2px solid ${v.tD.b}` }}>
                    Details
                  </span>
                  <span style={{ textAlign: "center", padding: "16px 0", fontSize: "16px", fontWeight: v.tM.w, color: v.tM.c, borderBottom: `2px solid ${v.tM.b}` }}>
                    Map
                  </span>
                </div>
                {v.isDetails && (
                  <>
                  {v.banner && (
                    <>
                    <div role="status" style={{ display: "flex", gap: "12px", padding: "14px 16px", borderRadius: "8px", border: `1px solid ${v.banner.bd}`, background: v.banner.bg, color: v.banner.fg, marginBottom: "24px", fontSize: "14.5px" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                      <div>
                        <div style={{ fontWeight: "600" }}>
                          {v.banner.h}
                        </div>
                        {v.banner.p}
                      </div>
                    </div>
                    </>
                  )}
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
                        <div style={{ fontSize: "14px", color: e.wc }}>
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
                        <div style={{ fontSize: "19px", fontWeight: "600", lineHeight: "1.3" }}>
                          {e.d}
                        </div>
                        <div style={{ fontSize: "16.5px", marginTop: "2px" }}>
                          {e.e}
                        </div>
                        <div style={{ fontSize: "14.5px", color: "#5E5C76", marginTop: "4px" }}>
                          {e.w}
                        </div>
                        {e.card && (
                          <>
                          <div style={{ marginTop: "10px", padding: "12px 14px", borderRadius: "8px", background: "#FFFAEB", color: "#A04305", border: "1px solid #FBE3B0", fontSize: "14px", lineHeight: "1.45" }}>
                            {e.card}
                          </div>
                          </>
                        )}
                      </div>
                    </div>
                    </Fragment>
                  ))}
                  </>
                )}
                {v.isMap && (
                  <>
                  <div style={{ position: "relative", width: "808px", height: "600px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E7E6F0" }}>
                    <svg width="808" height="600" viewBox="0 0 808 600" role="img" aria-label="Map of the shipment route: road pickup in Ezeiza, flight LA8045 from Buenos Aires EZE to São Paulo GRU, and road delivery in Guarulhos" style={{ display: "block" }}>
                      <rect width="808" height="600" fill="#EEF0E9" />
                      <path d="M808 60 L760 95 L720 118 L690 140 L650 175 L600 222 L540 282 L470 352 L410 410 L360 452 L318 482 L285 500 L250 505 L215 498 L185 505 L200 522 L240 535 L290 555 L330 600 L808 600 Z" fill="#CFE0EE" />
                      <path d="M808 60 L760 95 L720 118 L690 140 L650 175 L600 222 L540 282 L470 352 L410 410 L360 452 L318 482 L285 500 L250 505 L215 498 L185 505 L200 522 L240 535 L290 555 L330 600" fill="none" stroke="#B7CCDD" strokeWidth="1.5" />
                      <path d="M120 120 C 180 150, 240 140, 300 180 S 380 260, 440 250 M60 300 C 120 280, 170 320, 230 300 M520 70 C 560 110, 600 90, 640 60" fill="none" stroke="#E2E5DB" strokeWidth="10" strokeLinecap="round" />
                      <path d="M258 488 C 270 430, 285 380, 300 330 C 320 290, 330 240, 340 190 M300 330 C 340 360, 375 390, 405 418" fill="none" stroke="#B9B6CC" strokeWidth="1.5" strokeDasharray="6 5" />
                      <path d="M190 514 L 230 450 L 260 400 L 300 330 L 340 260 M420 365 L 500 290 L 585 195 L 690 128 M262 497 L 330 450 L 420 365 M585 195 L 548 250" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M190 514 L 230 450 L 260 400 L 300 330 L 340 260 M420 365 L 500 290 L 585 195 L 690 128 M262 497 L 330 450 L 420 365 M585 195 L 548 250" fill="none" stroke="#D9DCD2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      <g fontFamily="IBM Plex Sans, sans-serif" fontSize="12" fill="#5E5C76">
                        <circle cx="262" cy="497" r="3" fill="#8D8BA4" />
                        <text x="270" y="490">
                          Montevideo
                        </text>
                        <circle cx="420" cy="365" r="3" fill="#8D8BA4" />
                        <text x="352" y="358">
                          Porto Alegre
                        </text>
                        <circle cx="548" cy="250" r="3" fill="#8D8BA4" />
                        <text x="476" y="262">
                          Florianópolis
                        </text>
                        <circle cx="585" cy="195" r="3" fill="#8D8BA4" />
                        <text x="532" y="190">
                          Curitiba
                        </text>
                        <text x="96" y="574" fontSize="11" letterSpacing="2" fill="#A3A1B6">
                          ARGENTINA
                        </text>
                        <text x="312" y="420" fontSize="11" letterSpacing="2" fill="#A3A1B6">
                          URUGUAY
                        </text>
                        <text x="440" y="140" fontSize="11" letterSpacing="2" fill="#A3A1B6">
                          BRAZIL
                        </text>
                        <text x="560" y="470" fontSize="11" letterSpacing="2" fill="#8FB2CC" fontStyle="italic">
                          Atlantic Ocean
                        </text>
                      </g>
                      <path d="M150 540 L 162 532 L 175 522" fill="none" stroke="#17B26A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M175 522 Q 340 190 705 118" fill="none" stroke="#B9B6CC" strokeWidth="2.5" strokeDasharray="7 7" />
                      <path d="M175 522 Q 340 190 705 118" fill="none" stroke="#3B1A8E" strokeWidth="3.5" pathLength="1" strokeDasharray="0.62 1" strokeLinecap="round" />
                      <path d="M705 118 L 718 108 L 732 100" fill="none" stroke="#8D8BA4" strokeWidth="4" strokeDasharray="5 5" strokeLinecap="round" />
                      <circle cx="150" cy="540" r="6" fill="#FFFFFF" stroke="#17B26A" strokeWidth="3" />
                      <circle cx="175" cy="522" r="8" fill="#17B26A" stroke="#FFFFFF" strokeWidth="2.5" />
                      <circle cx="705" cy="118" r="8" fill="#FFFFFF" stroke="#3B1A8E" strokeWidth="3" />
                      <circle cx="732" cy="100" r="6" fill="#FFFFFF" stroke="#8D8BA4" strokeWidth="3" />
                      <g fontFamily="IBM Plex Sans, sans-serif">
                        <rect x="60" y="500" width="104" height="44" rx="6" fill="#FFFFFF" stroke="#E7E6F0" />
                        <text x="72" y="519" fontSize="14" fontWeight="600" fill="#1A1831">
                          EZE
                        </text>
                        <text x="72" y="535" fontSize="11" fill="#5E5C76">
                          Buenos Aires
                        </text>
                        <rect x="620" y="140" width="112" height="44" rx="6" fill="#FFFFFF" stroke="#E7E6F0" />
                        <text x="632" y="159" fontSize="14" fontWeight="600" fill="#1A1831">
                          GRU
                        </text>
                        <text x="632" y="175" fontSize="11" fill="#5E5C76">
                          São Paulo
                        </text>
                      </g>
                      <g transform="translate(456.5 210.3) rotate(59.4)">
                        <circle r="18" fill="#3B1A8E" />
                        <path transform="translate(-10 -10) scale(0.84)" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="#FFFFFF" />
                      </g>
                    </svg>
                    <div style={{ position: "absolute", top: "16px", left: "16px", width: "270px", boxSizing: "border-box", background: "#FFFFFF", borderRadius: "10px", padding: "14px 16px", boxShadow: "0 8px 24px -8px rgba(20, 16, 60, 0.3)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <b style={{ fontWeight: "600", fontSize: "15px" }}>
                          LA8045 · In flight
                        </b>
                        <span style={{ fontSize: "12px", color: "#067647", fontWeight: "600" }}>
                          On time
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#5E5C76", marginTop: "6px" }}>
                        <span>
                          EZE 6:55 AM
                        </span>
                        <span>
                          GRU 1:30 PM
                        </span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: "#E7E6F0", marginTop: "8px", overflow: "hidden" }}>
                        <div style={{ width: "62%", height: "6px", background: "#3B1A8E" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginTop: "10px" }}>
                        <span style={{ color: "#5E5C76" }}>
                          Cargo temperature
                        </span>
                        <b style={{ fontWeight: "600" }}>
                          4.1 °C
                        </b>
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ background: "#FFFFFF", borderRadius: "8px", boxShadow: "0 4px 12px -4px rgba(20, 16, 60, 0.3)", display: "flex", flexDirection: "column" }}>
                        <button type="button" aria-label="Zoom in" style={{ width: "40px", height: "40px", border: "0", background: "transparent", fontSize: "20px", color: "#1A1831", borderBottom: "1px solid #E7E6F0" }}>
                          +
                        </button>
                        <button type="button" aria-label="Zoom out" style={{ width: "40px", height: "40px", border: "0", background: "transparent", fontSize: "20px", color: "#1A1831" }}>
                          −
                        </button>
                      </div>
                      <button type="button" aria-label="Map layers" style={{ width: "40px", height: "40px", border: "0", borderRadius: "8px", background: "#FFFFFF", boxShadow: "0 4px 12px -4px rgba(20, 16, 60, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1A1831" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 3 2 8l10 5 10-5z" />
                          <path d="m2 13 10 5 10-5" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ position: "absolute", left: "16px", bottom: "16px", display: "flex", alignItems: "flex-end", gap: "6px", fontSize: "11px", color: "#5E5C76" }}>
                      <div style={{ width: "80px", height: "6px", border: "1.5px solid #5E5C76", borderTop: "0" }} />
                      200 km
                    </div>
                    <div style={{ position: "absolute", right: "16px", bottom: "16px", background: "#FFFFFF", borderRadius: "10px", padding: "12px 14px", boxShadow: "0 8px 24px -8px rgba(20, 16, 60, 0.3)", display: "flex", flexDirection: "column", gap: "7px", fontSize: "13px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "26px", height: "4px", borderRadius: "2px", background: "#17B26A" }} />
                        Road pickup · done
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "26px", height: "4px", borderRadius: "2px", background: "#3B1A8E" }} />
                        Air · LA8045 in flight
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ width: "26px", height: "0", borderTop: "4px dashed #8D8BA4" }} />
                        Road delivery · upcoming
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px", marginTop: "16px" }}>
                    <div style={{ border: "1px solid #E7E6F0", borderRadius: "8px", padding: "12px 14px" }}>
                      <div style={{ fontSize: "12.5px", color: "#5E5C76" }}>
                        Road pickup
                      </div>
                      <div style={{ fontWeight: "600", marginTop: "2px" }}>
                        Ezeiza plant → EZE
                      </div>
                      <div style={{ fontSize: "13px", color: "#067647", marginTop: "2px" }}>
                        Done · Sep 29, 6:40 PM
                      </div>
                    </div>
                    <div style={{ border: "1px solid #E7E6F0", borderRadius: "8px", padding: "12px 14px" }}>
                      <div style={{ fontSize: "12.5px", color: "#5E5C76" }}>
                        Air
                      </div>
                      <div style={{ fontWeight: "600", marginTop: "2px" }}>
                        EZE → GRU · 1,680 km
                      </div>
                      <div style={{ fontSize: "13px", color: "#3B1A8E", marginTop: "2px" }}>
                        In flight · 62% complete
                      </div>
                    </div>
                    <div style={{ border: "1px solid #E7E6F0", borderRadius: "8px", padding: "12px 14px" }}>
                      <div style={{ fontSize: "12.5px", color: "#5E5C76" }}>
                        Road delivery
                      </div>
                      <div style={{ fontWeight: "600", marginTop: "2px" }}>
                        GRU → Guarulhos, 18 km
                      </div>
                      <div style={{ fontSize: "13px", color: "#5E5C76", marginTop: "2px" }}>
                        Estimated Oct 2, 2:00 PM
                      </div>
                    </div>
                  </div>
                  </>
                )}
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
                    {v.delayed && (
                      <>
                      <div style={{ color: "#8D8BA4", marginTop: "2px", textDecoration: "line-through" }}>
                        Oct 2, 2026 · 2:00 PM
                      </div>
                      </>
                    )}
                    <div style={{ color: v.etaC, marginTop: "2px", fontWeight: v.etaW }}>
                      {v.eta}
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #D5D4E1", margin: "24px 0" }} />
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600" }}>
                  Status
                </h4>
                <span style={{ display: "inline-flex", border: `1px solid ${v.chip.bd}`, color: v.chip.fg, background: v.chip.bg, borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500" }}>
                  {v.chip.l}
                </span>
                {v.stale && (
                  <>
                  <div style={{ marginTop: "8px", fontSize: "13px", color: "#5E5C76" }}>
                    Last update 14 h ago
                  </div>
                  </>
                )}
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

function values(props: TrackingProps) {
    const sc = props.scenario ?? 'normal';
    const isMap = (props.tab ?? 'details') === 'map';
    const ON = { w: 600, c: '#3B1A8E', b: '#3B1A8E' }, OFF = { w: 500, c: '#5E5C76', b: '#E7E6F0' };
    const NAV = [['Dashboard', 'M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z', 0], ['New booking', 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z', 1], ['My bookings', 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', 0], ['Reports', 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h4', 0], ['Settings', 'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 1z', 0]];
    const nav = NAV.map(([l, d, filled]) => {
      const on = l === 'My bookings';
      return { l, d, fill: filled ? 'currentColor' : 'none', stroke: filled ? 'none' : 'currentColor', fg: on ? '#FFFFFF' : '#C9C7DD', w: on ? 600 : 400, bg: on ? 'rgba(255, 77, 158, 0.22)' : 'transparent', ic: on ? '#FF7BB0' : '#A9A7C4' };
    });
    const tabs = ['Summary', 'Tracking', 'Documents', 'Billing', 'Payment', 'After-sales'].map((l) => l === 'Tracking'
      ? { l, c: '#1A1831', w: 600, b: '#1A1831' } : { l, c: '#5E5C76', w: 400, b: 'transparent' });
    const delay = sc === 'delay', stale = sc === 'stale';
    const chip = delay ? { l: 'Delayed', bd: '#F2A51C', fg: '#A04305', bg: '#FFFAEB' } : { l: 'In transit', bd: '#3B1A8E', fg: '#3B1A8E', bg: '#ECE7FC' };
    const banner = delay
      ? { h: 'Your cargo will arrive late', p: 'New estimated delivery: Oct 2 · 6:30 PM. The cold chain is kept in the GRU cold room.', bd: '#FBE3B0', bg: '#FFFAEB', fg: '#A04305' }
      : stale ? { h: 'No updates for 14 h', p: 'There may be no scans during the flight and unloading. If nothing changes in 6 more hours, we will email you.', bd: '#CFE2FD', bg: '#EFF6FF', fg: '#1849A9' } : null;
    const future = [
      { d: delay ? 'Oct 2 · 6:30 PM' : 'Oct 2 · 2:00 PM', e: 'Delivered at destination', w: 'Estimated · Guarulhos, Brazil', wc: delay ? '#A04305' : '#8D8BA4' },
      { d: 'Oct 1 · 10:00 AM', e: 'Customs clearance', w: 'Estimated', wc: '#8D8BA4' },
      { d: delay ? 'Sep 30 · 3:10 PM' : 'Sep 30 · 1:30 PM', e: 'Arrival in São Paulo (GRU)', w: delay ? 'Estimated · was 1:30 PM' : 'Estimated', wc: delay ? '#A04305' : '#8D8BA4' }
    ];
    const L = 'Buenos Aires (EZE), Argentina';
    const ok = (d, e, w) => ({ d, e, w, dot: '#17B26A', ring: '0', ic: '#FFFFFF', glyph: '✓', lineC: '#17B26A', card: '' });
    let events = [
      { d: 'Sep 30 · 10:45 AM', e: 'In flight', w: 'Flight LA8045 · EZE → GRU', dot: '#FFFFFF', ring: '2px solid #3B1A8E', ic: '#3B1A8E', glyph: '✈', lineC: '#D5D4E1', card: '' },
      ok('Sep 30 · 6:20 AM', 'Cargo loaded', L),
      ok('Sep 30 · 1:30 AM', 'Cargo processed for dispatch', L),
      ok('Sep 29 · 10:15 PM', 'Entered logistics center', L),
      ok('Sep 29 · 6:40 PM', 'Cargo picked up at origin', 'Ezeiza, Buenos Aires'),
      ok('Sep 29 · 2:20 PM', 'Booking confirmed', 'AWB 045-12345678')
    ];
    if (delay) events = [{ d: 'Sep 30 · 11:30 AM', e: 'Arrival delayed', w: 'São Paulo (GRU), Brazil', dot: '#F2A51C', ring: '0', ic: '#FFFFFF', glyph: '!', lineC: '#D5D4E1', card: 'Congestion on the GRU apron. No action needed on your side.' }, ...events];
    events = events.map((e, i, a) => ({ ...e, line: i < a.length - 1 }));
    return { rootH: isMap ? 1274 : delay ? 1709 : stale ? 1556 : 1464, isMap, isDetails: !isMap, tD: isMap ? OFF : ON, tM: isMap ? ON : OFF, nav, tabs, chip, banner, future, events, delayed: delay, stale,
      eta: delay ? 'Oct 2, 2026 · 6:30 PM' : 'Oct 2, 2026 · 2:00 PM', etaC: delay ? '#A04305' : '#5E5C76', etaW: delay ? 500 : 400 };
}
