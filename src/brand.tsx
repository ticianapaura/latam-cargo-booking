/* CargoPilot AI: a fictional brand for this concept prototype.
   One mark used everywhere: the live app's header, the screens generated from the design canvas, and the index. */

export const BRAND = "CargoPilot AI";

/** The mark: a coral tile with a route arrow, the wordmark, and a small "AI" tag. Made for dark headers. */
export function BrandMark({ size = 16 }: { size?: number }) {
  const tile = Math.round(size * 1.6);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.55), color: "#FFFFFF", lineHeight: 1, textTransform: "none", letterSpacing: "normal", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <span
        aria-hidden="true"
        style={{ width: tile, height: tile, flex: "none", borderRadius: Math.round(tile * 0.28), background: "#E3194E", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        <svg width={Math.round(tile * 0.62)} height={Math.round(tile * 0.62)} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 19c2-6 6-10 14-14" />
          <path d="M12 5h7v7" />
        </svg>
      </span>
      <span style={{ fontWeight: 700, fontSize: size, letterSpacing: "-0.01em" }}>CargoPilot</span>
      <span style={{ fontSize: Math.round(size * 0.62), fontWeight: 600, letterSpacing: "0.12em", color: "#C9C7DD", border: "1px solid #4A4867", borderRadius: 4, padding: "2px 4px 1px" }}>AI</span>
    </span>
  );
}
