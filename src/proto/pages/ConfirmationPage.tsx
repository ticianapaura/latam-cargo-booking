import { useState } from "react";
import { DOCS, deliveryEstimate, fmtDate, fmtTime, kgText, rate, totalKg, usd } from "../data";
import { useProto } from "../store";
import { BookingHead, I, Icon, Shell, Summary } from "../ui";

/** Step 5 · Confirmation */
export default function ConfirmationPage() {
  const { b, go, toast } = useProto();
  const [copied, setCopied] = useState(false);
  const awb = "045-38216074";
  const missing = DOCS.filter((d) => !d.optional && (!b.docs[d.id] || b.docs[d.id]!.error));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(awb);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast(`Copy the AWB by hand: ${awb}`);
    }
  };

  return (
    <Shell active="New booking">
      <BookingHead step={5} saved={false} />
      <div className="p-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 620 }}>
          <span style={{ width: 60, height: 60, borderRadius: "50%", background: "#17B26A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={I.check} size={30} stroke={2.2} />
          </span>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 600 }}>Booking confirmed</h2>
          <p style={{ margin: 0, color: "#5E5C76", fontSize: 16 }}>
            We sent the confirmation and air waybill to your account email. Tracking starts once we pick up the cargo.
          </p>
          {missing.length > 0 && (
            <div className="p-alert warn" style={{ marginBottom: 0 }}>
              <Icon d={I.warn} size={20} />
              <span><b>Documents pending</b>Attach the {missing.map((d) => d.name.toLowerCase()).join(" and ")} before pickup on {fmtDate(b.pickupDate)}.</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 16, alignItems: "baseline", border: "1px dashed #8D8BA4", borderRadius: 8, padding: "16px 20px" }}>
            <span style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5E5C76" }}>AWB</span>
            <strong className="mono" style={{ fontSize: 28, fontWeight: 500, letterSpacing: "0.02em" }}>{awb}</strong>
            <button type="button" className="p-link" style={{ marginLeft: "auto" }} onClick={copy}>{copied ? "Copied" : "Copy"}</button>
          </div>
          <dl className="p-card p-kv" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", margin: 0 }}>
            <div><dt>Route</dt><dd>{b.originAirport} → {b.destAirport} · Flight LA8045</dd></div>
            <div><dt>Pickup</dt><dd>{fmtDate(b.pickupDate)} · {fmtTime(b.pickupTime)}</dd></div>
            <div><dt>Estimated delivery</dt><dd>{deliveryEstimate(b)}</dd></div>
            <div><dt>Estimated total</dt><dd>{usd(rate(b).total)}</dd></div>
          </dl>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="button" className="p-btn" onClick={() => go("bookings")}>Go to My bookings</button>
            <button type="button" className="p-btn secondary" onClick={() => go("step1", { fresh: true })}>Create another booking</button>
          </div>
        </div>
        <Summary
          rows={[{ items: [["Cargo type", b.cargoType], ["Cargo description", b.description], ["Total weight", kgText(totalKg(b))], ["Documents", missing.length ? `${missing.length} pending` : "All attached"]] }]}
          status="Confirmed"
        />
      </div>
    </Shell>
  );
}
