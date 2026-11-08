// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";

export type MyBookingsProps = { search?: "default" | "recent" | "typing" | "match" | "loading" | "noresults" | "noaccess" | "offline" };

/** My bookings (props: search = default | recent | typing | match | loading | noresults | noaccess | offline) */
export default function MyBookings({ search = "default" }: MyBookingsProps = {}) {
  const props = { search };
  const v = values(props);
  return (
    <div style={{ width: "1400px", minHeight: "734px", boxSizing: "border-box", lineHeight: "1.3", background: "#FFFFFF", color: "#1A1831", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", fontSize: "15px", display: "flex", flexDirection: "column" }}>
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
        <div style={{ marginLeft: "70px", position: "relative", flex: "none" }}>
          {v.searchDefault && (
            <>
            <div style={{ width: "440px", height: "38px", borderRadius: "7px", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "10px", padding: "0 12px", color: "#8D8BA4", fontSize: "14px" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              Search AWB or booking
            </div>
            </>
          )}
          {v.searchFocus && (
            <>
            <div style={{ width: "440px", height: "38px", borderRadius: "7px", background: "#FFFFFF", boxShadow: `0 0 0 3px ${v.ring}`, display: "flex", alignItems: "center", gap: "10px", padding: "0 12px", color: "#8D8BA4", fontSize: "14px" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              {v.hasQ && (
                <>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1A1831", marginRight: "-9px" }}>
                  {v.q}
                </span>
                </>
              )}
              <span style={{ width: "1px", height: "18px", background: "#3B1A8E" }} />
              {v.noQ && (
                <>
                <span style={{ marginLeft: "-9px" }}>
                  Booking number or AWB
                </span>
                </>
              )}
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
                {v.spin && (
                  <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B1A8E" strokeWidth="2.4" strokeLinecap="round" aria-label="Searching">
                    <path d="M12 3a9 9 0 1 0 9 9" />
                  </svg>
                  </>
                )}
                {v.clear && (
                  <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8D8BA4" strokeWidth="2" strokeLinecap="round" aria-label="Clear search">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                  </>
                )}
              </span>
            </div>
            <div role="listbox" aria-label="Search results" style={{ position: "absolute", top: "45px", left: "0", width: "464px", zIndex: "5", color: "#1A1831", boxSizing: "border-box", background: "#FFFFFF", borderRadius: "10px", padding: "12px 10px", boxShadow: "0 16px 40px -10px rgba(20, 16, 60, 0.35), 0 0 0 1px #E7E6F0" }}>
              {v.pRecent && (
                <>
                <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D8BA4", padding: "0 8px 6px" }}>
                  Recent searches
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {v.recent.map((r: any, i: number) => (
                    <Fragment key={i}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "7px", background: r.hl, fontSize: "14px" }}>
                      <span style={{ width: "62px", flex: "none", fontWeight: "400" }}>
                        <b style={{ fontWeight: "700" }}>
                          {r.m}
                        </b>
                        {r.rest}
                      </span>
                      <span style={{ flexGrow: "1", minWidth: "0", color: "#5E5C76" }}>
                        {r.route}{" · "}
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px" }}>
                          {r.awb}
                        </span>
                      </span>
                      <span style={{ flex: "none", border: `1px solid ${r.bd}`, color: r.fg, background: r.bg, borderRadius: "999px", padding: "1px 9px", fontSize: "12px", fontWeight: "500" }}>
                        {r.st}
                      </span>
                    </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #E7E6F0", marginTop: "10px", padding: "10px 8px 0", fontSize: "12.5px", color: "#8D8BA4" }}>
                  Search by booking number, like #1234, or AWB, like 045-12345678.
                </div>
                </>
              )}
              {v.pTyping && (
                <>
                <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D8BA4", padding: "0 8px 6px" }}>
                  Bookings
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {v.sugg.map((r: any, i: number) => (
                    <Fragment key={i}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "7px", background: r.hl, fontSize: "14px" }}>
                      <span style={{ width: "62px", flex: "none", fontWeight: "400" }}>
                        <b style={{ fontWeight: "700" }}>
                          {r.m}
                        </b>
                        {r.rest}
                      </span>
                      <span style={{ flexGrow: "1", minWidth: "0", color: "#5E5C76" }}>
                        {r.route}{" · "}
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px" }}>
                          {r.awb}
                        </span>
                      </span>
                      <span style={{ flex: "none", border: `1px solid ${r.bd}`, color: r.fg, background: r.bg, borderRadius: "999px", padding: "1px 9px", fontSize: "12px", fontWeight: "500" }}>
                        {r.st}
                      </span>
                    </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #E7E6F0", marginTop: "10px", padding: "10px 8px 0", fontSize: "12.5px", color: "#8D8BA4" }}>
                  ↑ ↓ to move · Enter to open
                </div>
                </>
              )}
              {v.pMatch && (
                <>
                <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D8BA4", padding: "0 8px 6px" }}>
                  Exact match
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "12px", borderRadius: "8px", background: "#F5F3FF", border: "1px solid #DDD3FB" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "700" }}>
                      Booking #1234
                    </span>
                    <span style={{ border: "1px solid #3B1A8E", color: "#3B1A8E", background: "#ECE7FC", borderRadius: "999px", padding: "1px 9px", fontSize: "12px", fontWeight: "500" }}>
                      In transit
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px", fontSize: "13px", color: "#5E5C76" }}>
                    <div>
                      Route
                      <div style={{ color: "#1A1831", fontWeight: "500", fontSize: "14px" }}>
                        EZE → GRU
                      </div>
                    </div>
                    <div>
                      Flight
                      <div style={{ color: "#1A1831", fontWeight: "500", fontSize: "14px" }}>
                        LA8045
                      </div>
                    </div>
                    <div>
                      Arrives
                      <div style={{ color: "#1A1831", fontWeight: "500", fontSize: "14px" }}>
                        Today, 6:40 PM
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", color: "#5E5C76" }}>
                      Fresh salmon · 10 pieces · 250 kg
                    </span>
                    <button type="button" style={{ height: "34px", border: "0", borderRadius: "6px", background: "#3B1A8E", color: "#FFFFFF", fontSize: "13.5px", fontWeight: "600", padding: "0 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                      {"Open tracking "}
                      <span style={{ fontSize: "12px", opacity: "0.75" }}>
                        ↵
                      </span>
                    </button>
                  </div>
                </div>
                </>
              )}
              {v.pLoading && (
                <>
                <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D8BA4", padding: "0 8px 6px" }}>
                  Searching…
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "4px 8px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ width: "62px", height: "12px", borderRadius: "6px", background: "#EEEDF5" }} />
                    <span style={{ flexGrow: "1", height: "12px", borderRadius: "6px", background: "#EEEDF5" }} />
                    <span style={{ width: "70px", height: "18px", borderRadius: "9px", background: "#EEEDF5" }} />
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ width: "62px", height: "12px", borderRadius: "6px", background: "#F3F2F8" }} />
                    <span style={{ width: "60%", height: "12px", borderRadius: "6px", background: "#F3F2F8" }} />
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #E7E6F0", marginTop: "10px", padding: "10px 8px 0", fontSize: "12.5px", color: "#8D8BA4" }}>
                  Looking in your bookings. This usually takes a second.
                </div>
                </>
              )}
              {v.pNoResults && (
                <>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "0 4px" }}>
                  <span style={{ width: "36px", height: "36px", flex: "none", borderRadius: "8px", background: "#EFF6FF", color: "#175CD3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" />
                    </svg>
                  </span>
                  <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#5E5C76" }}>
                    <div style={{ fontWeight: "600", color: "#1A1831", fontSize: "15px" }}>
                      No results for “045-1234”
                    </div>
                    {"AWB numbers have 11 digits, like "}
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1A1831" }}>
                      045-12345678
                    </span>
                    . You entered 7. You can also search by booking number, like #1234.
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #E7E6F0", margin: "14px 0 8px" }} />
                <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D8BA4", padding: "0 8px 6px" }}>
                  Recent
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {v.recent2.map((r: any, i: number) => (
                    <Fragment key={i}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "7px", background: r.hl, fontSize: "14px" }}>
                      <span style={{ width: "62px", flex: "none", fontWeight: "400" }}>
                        <b style={{ fontWeight: "700" }}>
                          {r.m}
                        </b>
                        {r.rest}
                      </span>
                      <span style={{ flexGrow: "1", minWidth: "0", color: "#5E5C76" }}>
                        {r.route}{" · "}
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px" }}>
                          {r.awb}
                        </span>
                      </span>
                      <span style={{ flex: "none", border: `1px solid ${r.bd}`, color: r.fg, background: r.bg, borderRadius: "999px", padding: "1px 9px", fontSize: "12px", fontWeight: "500" }}>
                        {r.st}
                      </span>
                    </div>
                    </Fragment>
                  ))}
                </div>
                </>
              )}
              {v.pNoAccess && (
                <>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "0 4px" }}>
                  <span style={{ width: "36px", height: "36px", flex: "none", borderRadius: "8px", background: "#FFFAEB", color: "#A04305", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                  </span>
                  <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#5E5C76" }}>
                    <div style={{ fontWeight: "600", color: "#1A1831", fontSize: "15px" }}>
                      You can’t see booking #1198
                    </div>
                    It may have been made by another company account. If you need it, ask your account admin to share it with you.
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", padding: "12px 4px 0 52px" }}>
                  <button type="button" style={{ height: "34px", border: "1px solid #D5D4E1", borderRadius: "6px", background: "#FFFFFF", color: "#3B1A8E", fontSize: "13.5px", fontWeight: "600", padding: "0 14px" }}>
                    Request access
                  </button>
                </div>
                </>
              )}
              {v.pOffline && (
                <>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "0 4px" }}>
                  <span style={{ width: "36px", height: "36px", flex: "none", borderRadius: "8px", background: "#FEF3F2", color: "#B42318", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 3l18 18M8.5 16.4a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 4.2-2.6M12 20h.01M19 12.9a10 10 0 0 0-2.8-2" />
                    </svg>
                  </span>
                  <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#5E5C76" }}>
                    <div style={{ fontWeight: "600", color: "#1A1831", fontSize: "15px" }}>
                      Search isn’t working right now
                    </div>
                    Check your internet connection and try again. Your recent searches still work.
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", padding: "12px 4px 0 52px" }}>
                  <button type="button" style={{ height: "34px", border: "0", borderRadius: "6px", background: "#3B1A8E", color: "#FFFFFF", fontSize: "13.5px", fontWeight: "600", padding: "0 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                    Try again
                  </button>
                </div>
                <div style={{ borderTop: "1px solid #E7E6F0", margin: "14px 0 8px" }} />
                <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "#8D8BA4", padding: "0 8px 6px" }}>
                  Recent
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {v.recent2.map((r: any, i: number) => (
                    <Fragment key={i}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px", borderRadius: "7px", background: r.hl, fontSize: "14px" }}>
                      <span style={{ width: "62px", flex: "none", fontWeight: "400" }}>
                        <b style={{ fontWeight: "700" }}>
                          {r.m}
                        </b>
                        {r.rest}
                      </span>
                      <span style={{ flexGrow: "1", minWidth: "0", color: "#5E5C76" }}>
                        {r.route}{" · "}
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px" }}>
                          {r.awb}
                        </span>
                      </span>
                      <span style={{ flex: "none", border: `1px solid ${r.bd}`, color: r.fg, background: r.bg, borderRadius: "999px", padding: "1px 9px", fontSize: "12px", fontWeight: "500" }}>
                        {r.st}
                      </span>
                    </div>
                    </Fragment>
                  ))}
                </div>
                </>
              )}
            </div>
            </>
          )}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0 24px" }}>
              <h1 style={{ margin: "0", fontSize: "30px", fontWeight: "600" }}>
                My bookings
              </h1>
              <button type="button" style={{ height: "44px", padding: "0 20px", borderRadius: "6px", border: "0", background: "#3B1A8E", color: "#FFFFFF", fontSize: "15px", fontWeight: "600" }}>
                New booking
              </button>
            </div>
            <div role="status" style={{ display: "flex", gap: "12px", padding: "14px 16px", borderRadius: "8px", border: "1px solid #BDEBD2", background: "#ECFDF3", color: "#067647", marginBottom: "22px", fontSize: "14.5px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12.5 3 3 5-6" />
              </svg>
              <div>
                <div style={{ fontWeight: "600" }}>
                  Booking #1235 confirmed
                </div>
                AWB 045-38216074. Tracking starts once we pick up the cargo on Nov 11.
              </div>
            </div>
            <div style={{ border: "1px solid #D5D4E1", borderRadius: "8px", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "110px 180px minmax(0, 1fr) 130px 160px 170px", gap: "16px", padding: "12px 16px", background: "#F0EFF6", fontSize: "12.5px", fontWeight: "600", color: "#5E5C76", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                <span>
                  Booking
                </span>
                <span>
                  Status
                </span>
                <span>
                  Cargo
                </span>
                <span>
                  Route
                </span>
                <span>
                  AWB
                </span>
                <span />
              </div>
              {v.rows.map((r: any, i: number) => (
                <Fragment key={i}>
                <div style={{ display: "grid", gridTemplateColumns: "110px 180px minmax(0, 1fr) 130px 160px 170px", gap: "16px", padding: "14px 16px", borderTop: "1px solid #E7E6F0", alignItems: "center", fontSize: "14.5px" }}>
                  <b style={{ fontWeight: "600" }}>
                    {r.id}
                  </b>
                  <div>
                    <span style={{ display: "inline-flex", border: `1px solid ${r.bd}`, color: r.fg, background: r.bg, borderRadius: "999px", padding: "3px 11px", fontSize: "13px", fontWeight: "500" }}>
                      {r.st}
                    </span>
                    <div style={{ fontSize: "12.5px", color: "#5E5C76", marginTop: "3px" }}>
                      {r.sub}
                    </div>
                  </div>
                  <span>
                    {r.cargo}
                  </span>
                  <span>
                    {r.route}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13.5px" }}>
                    {r.awb}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <button type="button" style={{ height: "36px", padding: "0 14px", borderRadius: "6px", border: "1.5px solid #D5D4E1", background: "#FFFFFF", color: "#3B1A8E", fontSize: "14px", fontWeight: "600", opacity: r.op }}>
                      {r.act}
                    </button>
                  </div>
                </div>
                </Fragment>
              ))}
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

function values(props: MyBookingsProps) {
    const NAV = [['Dashboard', 'M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z', 0], ['New booking', 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z', 1], ['My bookings', 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8', 0], ['Reports', 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h4', 0], ['Settings', 'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 1z', 0]];
    const active = 'My bookings';
    const nav = NAV.map(([l, d, filled]) => {
      const on = l === active;
      return { l, d, fill: filled ? 'currentColor' : 'none', stroke: filled ? 'none' : 'currentColor', fg: on ? '#FFFFFF' : '#C9C7DD', w: on ? 600 : 400, bg: on ? 'rgba(255, 77, 158, 0.22)' : 'transparent', ic: on ? '#FF7BB0' : '#A9A7C4' };
    });
    const B = { pri: ['#3B1A8E', '#3B1A8E', '#ECE7FC'], ok: ['#17B26A', '#067647', '#ECFDF3'], mute: ['#D5D4E1', '#5E5C76', '#FFFFFF'] };
    const row = (id, st, k, sub, cargo, route, awb, act, op) => ({ id, st, sub, cargo, route, awb, act, op, bd: B[k][0], fg: B[k][1], bg: B[k][2] });
    const rows = [
      row('#1235', 'Confirmed', 'pri', 'Pickup Nov 11 · tracking starts then', 'Perishables · Fresh salmon', 'EZE → GRU', '045-38216074', 'View booking', 1),
      row('#1234', 'In transit', 'pri', 'Flight LA8045', 'Perishables · Fresh salmon', 'EZE → GRU', '045-12345678', 'Track', 1),
      row('#1229', 'Delivered', 'ok', 'Oct 18, 2026', 'General cargo · Auto parts', 'SCL → MIA', '045-12298811', 'View', 1),
      row('#1221', 'Cancelled', 'mute', 'By you · Oct 2, 2026', 'Pharmaceuticals · Vaccines', 'EZE → LIM', '—', 'View', 0.7)
    ];
    const S = props.search === 'focus' ? 'noresults' : (props.search || 'default');
    const C = { 'In transit': B.pri, 'Confirmed': B.pri, 'Delivered': B.ok };
    const r = (id, route, awb, st, m, hl) => ({ m: m || '', rest: m ? id.slice(m.length) : id, route, awb, st, hl: hl ? '#F5F3FF' : 'transparent', bd: C[st][0], fg: C[st][1], bg: C[st][2] });
    const Q = { recent: '', typing: '#123', match: '045-12345678', loading: '045-38216074', noresults: '045-1234', noaccess: '#1198', offline: '#1234' };
    const q = Q[S] || '';
    const focus = S !== 'default';
    return { nav, rows, searchDefault: !focus, searchFocus: focus, q, hasQ: !!q, noQ: !q,
      spin: S === 'loading', clear: !!q && S !== 'loading', ring: S === 'offline' ? 'rgba(232, 68, 58, 0.35)' : 'rgba(185, 168, 255, 0.6)',
      pRecent: S === 'recent', pTyping: S === 'typing', pMatch: S === 'match', pLoading: S === 'loading', pNoResults: S === 'noresults', pNoAccess: S === 'noaccess', pOffline: S === 'offline',
      recent: [r('#1234', 'EZE → GRU', '045-12345678', 'In transit'), r('#1235', 'EZE → GRU', '045-38216074', 'Confirmed'), r('#1229', 'SCL → MIA', '045-12298811', 'Delivered')],
      recent2: [r('#1234', 'EZE → GRU', '045-12345678', 'In transit'), r('#1235', 'EZE → GRU', '045-38216074', 'Confirmed')],
      sugg: [r('#1234', 'EZE → GRU', '045-12345678', 'In transit', '#123', true), r('#1235', 'EZE → GRU', '045-38216074', 'Confirmed', '#123')] };
}
