// Generated from the LATAM Cargo design canvas by tools/convert.py. Edit the canvas, then regenerate.
import { Fragment } from "react";
import RouteDates from "./RouteDates";

export type SaveErrorToastProps = Record<string, never>;

/** Step 2 + server error toast */
export default function SaveErrorToast() {
  const v = values();
  return (
    <div style={{ width: "1400px", minHeight: "2030px", position: "relative", overflow: "hidden", fontFamily: "'IBM Plex Sans', system-ui, sans-serif", color: "#1A1831" }}>
      <RouteDates />
      <div role="alert" style={{ position: "absolute", top: "84px", left: "742px", transform: "translateX(-50%)", width: "640px", boxSizing: "border-box", display: "flex", gap: "12px", alignItems: "flex-start", padding: "16px 18px", borderRadius: "10px", border: "1px solid #FBCFCB", background: "#FEF3F2", color: "#B42318", fontSize: "14.5px", boxShadow: "0 16px 40px -12px rgba(20, 16, 60, 0.35)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" style={{ flex: "none", marginTop: "1px" }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5.5M12 16.5v.01" />
        </svg>
        <div style={{ flexGrow: "1" }}>
          <div style={{ fontWeight: "600", marginBottom: "2px" }}>
            We couldn't save this step
          </div>
          {"Something went wrong on our side. Everything you entered is still here, so try again in a few seconds. "}
          <div style={{ marginTop: "10px" }}>
            <button type="button" style={{ height: "36px", padding: "0 14px", borderRadius: "6px", border: "1.5px solid currentColor", background: "transparent", color: "#B42318", fontSize: "14px", fontWeight: "600" }}>
              Retry
            </button>
          </div>
        </div>
        <button type="button" aria-label="Close" style={{ background: "none", border: "0", padding: "2px", color: "#B42318" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function values() { return {}; 
}
