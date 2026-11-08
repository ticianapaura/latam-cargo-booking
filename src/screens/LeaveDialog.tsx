// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";
import CargoType from "./CargoType";

export type LeaveDialogProps = Record<string, never>;

/** Step 1 + leave-with-changes dialog */
export default function LeaveDialog() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "1692px", position: "relative", overflow: "hidden", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", color: "#1A1831" }}>
      <CargoType />
      <div style={{ position: "absolute", inset: "0", background: "rgba(18, 15, 40, 0.5)" }} />
      <div role="dialog" aria-modal="true" aria-labelledby="t" style={{ position: "absolute", top: "260px", left: "50%", transform: "translateX(-50%)", width: "460px", boxSizing: "border-box", background: "#FFFFFF", borderRadius: "12px", padding: "28px", boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)" }}>
        <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#FFFAEB", color: "#A04305", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
            <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            <path d="M12 9v4M12 17v.01" />
          </svg>
        </span>
        <h3 id="t" style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "600" }}>
          Leave this booking?
        </h3>
        <p style={{ margin: "0 0 22px", color: "#5E5C76", fontSize: "15px", lineHeight: "1.5" }}>
          Your draft stays in My bookings and you can pick it up whenever you want.
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button type="button" style={{ height: "44px", padding: "0 20px", borderRadius: "6px", border: "1.5px solid #D5D4E1", background: "#FFFFFF", color: "#3B1A8E", fontSize: "15px", fontWeight: "600" }}>
            Keep editing
          </button>
          <button type="button" style={{ height: "44px", padding: "0 20px", borderRadius: "6px", border: "0", background: "#3B1A8E", color: "#FFFFFF", fontSize: "15px", fontWeight: "600" }}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

function values() { return {}; 
}
