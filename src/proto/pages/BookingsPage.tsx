import { BOOKINGS } from "../data";
import type { Row } from "../data";
import { useProto } from "../store";
import type { Ui } from "../store";
import { I, Icon, Shell } from "../ui";

const TABS: Ui["bookingsTab"][] = ["All", "Active", "Drafts", "Completed"];
const tone = (s: Row["status"]) => (s === "Delivered" ? "ok" : s === "Cancelled" ? "mute" : s === "Draft" ? "draft" : "pri");
const inTab = (r: Row, t: Ui["bookingsTab"]) =>
  t === "All" || (t === "Active" && ["Confirmed", "In transit"].includes(r.status)) || (t === "Drafts" && r.status === "Draft") || (t === "Completed" && ["Delivered", "Cancelled"].includes(r.status));

/** My bookings: filter tabs, row actions and the confirmation banner after booking. */
export default function BookingsPage() {
  const { b, ui, setUi, go, toast } = useProto();
  const draft: Row | null = ui.draft
    ? { id: "Draft", status: "Draft", sub: "Saved today · Step 1 of 5", cargo: [b.cargoType, b.description].filter(Boolean).join(" · ") || "Cargo not described yet", route: "—", awb: "—", action: "Continue" }
    : null;
  const rows = [...(draft ? [draft] : []), ...BOOKINGS].filter((r) => inTab(r, ui.bookingsTab));

  const act = (r: Row) => {
    if (r.status === "Draft") go("step1");
    else if (r.status === "In transit") go("tracking");
    else toast(`Booking ${r.id} details aren't part of this prototype. Try Track on #1234.`);
  };

  return (
    <Shell active="My bookings">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0 24px" }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600 }}>My bookings</h1>
        <button type="button" className="p-btn md" onClick={() => go("step1", { fresh: true })}>New booking</button>
      </div>
      {ui.confirmed && (
        <div className="p-alert ok" role="status" style={{ marginBottom: 22 }}>
          <Icon d={I.checkCircle} size={20} />
          <div style={{ flex: 1 }}>
            <b style={{ marginBottom: 0 }}>Booking #1235 confirmed</b>
            AWB 045-38216074. Tracking starts once we pick up the cargo on Nov 11.
          </div>
          <button type="button" className="p-search-clear" aria-label="Dismiss" onClick={() => setUi({ confirmed: false })}><Icon d={I.x} size={16} /></button>
        </div>
      )}
      <div className="p-tabs" role="tablist" aria-label="Filter bookings">
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" className="p-tab" aria-selected={ui.bookingsTab === t} onClick={() => setUi({ bookingsTab: t })}>
            {t}
          </button>
        ))}
      </div>
      <div className="p-table" role="table" aria-label="Bookings">
        <div className="p-tr head" role="row">
          <span>Booking</span><span>Status</span><span>Cargo</span><span>Route</span><span>AWB</span><span />
        </div>
        {rows.map((r) => (
          <div className={`p-tr${r.status === "Draft" ? " hl" : ""}`} role="row" key={r.id}>
            <b style={{ fontWeight: 600 }}>{r.id}</b>
            <div>
              <span className={`p-status ${tone(r.status)}`}>{r.status}</span>
              <div style={{ fontSize: 12.5, color: "#5E5C76", marginTop: 3 }}>{r.sub}</div>
            </div>
            <span>{r.cargo}</span>
            <span>{r.route}</span>
            <span className="mono" style={{ fontSize: 13.5 }}>{r.awb}</span>
            <div style={{ textAlign: "right" }}>
              <button type="button" className={`p-btn sm${r.status === "In transit" || r.status === "Draft" ? "" : " secondary"}`} style={r.status === "Cancelled" ? { opacity: 0.7 } : undefined} onClick={() => act(r)}>
                {r.action}
              </button>
            </div>
          </div>
        ))}
        {!rows.length && <div className="p-empty">No bookings here yet.</div>}
      </div>
    </Shell>
  );
}
