// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";
import Documents from "./Documents";

export type SessionExpiredProps = Record<string, never>;

/** Step 3 + session expired dialog */
export default function SessionExpired() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "1113px", position: "relative", overflow: "hidden", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", color: "#1A1831" }}>
      <Documents />
      <div style={{ position: "absolute", inset: "0", background: "rgba(18, 15, 40, 0.5)" }} />
      <div role="dialog" aria-modal="true" aria-labelledby="t" style={{ position: "absolute", top: "300px", left: "50%", transform: "translateX(-50%)", width: "460px", boxSizing: "border-box", background: "#FFFFFF", borderRadius: "12px", padding: "28px", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)" }}>
        <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#FEF3F2", color: "#B42318", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <h3 id="t" style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "600" }}>
          Your session expired
        </h3>
        <p style={{ margin: "0 0 22px", color: "#5E5C76", fontSize: "15px", lineHeight: "1.5" }}>
          For security, we sign you out after 30 minutes of inactivity. Your draft is saved; sign in to continue where you left off.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" style={{ height: "44px", padding: "0 20px", borderRadius: "6px", border: "0", background: "#3B1A8E", color: "#FFFFFF", fontSize: "15px", fontWeight: "600" }}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

function values() { return {}; 
}
