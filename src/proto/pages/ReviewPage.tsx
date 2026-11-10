import { useState } from "react";
import { DOCS, deliveryEstimate, fmtDate, fmtTime, kgText, placeName, rate, totalKg, usd, volumetricKg } from "../data";
import type { Page } from "../store";
import { useProto } from "../store";
import { BookingHead, ErrorText, I, Icon, Shell, Summary } from "../ui";

/** Step 4 · Review. Every section can be edited, and the rate is calculated from the user's own data. */
export default function ReviewPage() {
  const { b, set, setUi, go } = useProto();
  const [tried, setTried] = useState(false);
  const r = rate(b);
  const attached = DOCS.filter((d) => b.docs[d.id] && !b.docs[d.id]!.error);
  const missingOptional = DOCS.filter((d) => d.optional && !b.docs[d.id]);

  const cards: { t: string; page: Page; rows: [string, string][] }[] = [
    {
      t: "Cargo",
      page: "step1",
      rows: [
        ["Type", b.cargoType],
        ["Description", b.description],
        ["Pieces", `${b.pieces} × ${b.weight} ${b.weightUnit}`],
        ["Dimensions", `${b.height}×${b.width}×${b.length} ${b.dimUnit}`],
        ["Requirements", b.handling.join(", ") || "None"],
        ...(b.instructions ? ([["Instructions", b.instructions]] as [string, string][]) : []),
      ],
    },
    {
      t: "Route and dates",
      page: "step2",
      rows: [
        ["Origin", placeName(b.originAirport)],
        ["Destination", placeName(b.destAirport)],
        ["Pickup", `${fmtDate(b.pickupDate)} · ${fmtTime(b.pickupTime)}`],
        ["Flight", "LA8045"],
        ["Estimated delivery", deliveryEstimate(b)],
      ],
    },
    {
      t: "Documents",
      page: "step3",
      rows: [
        ["Attached", `${attached.length} of ${DOCS.length}`],
        ...(missingOptional.length ? ([["Optional", `${missingOptional.map((d) => d.name).join(", ")} not attached`]] as [string, string][]) : []),
      ],
    },
  ];

  const confirm = () => {
    if (!b.accepted) {
      setTried(true);
      document.getElementById("accept")?.focus();
      return;
    }
    setUi({ confirmed: true, dirty: false, draft: false });
    go("step5", { force: true });
  };

  return (
    <Shell active="New booking">
      <BookingHead step={4} />
      <div className="p-grid">
        <section className="p-section" style={{ marginBottom: 0, gap: 16 }}>
          <h2>Review your booking</h2>
          <p className="p-intro">Make sure everything is right. You can edit any section and come back here.</p>
          {cards.map((c) => (
            <div className="p-card" key={c.t}>
              <div className="p-card-head">
                <h3>{c.t}</h3>
                <button type="button" className="p-link" onClick={() => go(c.page, { force: true })} aria-label={`Edit ${c.t.toLowerCase()}`}>
                  <Icon d={I.edit} size={14} /> Edit
                </button>
              </div>
              <dl className="p-kv">
                {c.rows.map(([k, v]) => (
                  <div key={k} style={k === "Instructions" ? { gridColumn: "1 / -1" } : undefined}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
          <div className="p-card">
            <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600 }}>Estimated rate</h3>
            <div>
              {[
                ["Chargeable weight", `${totalKg(b) >= volumetricKg(b) ? "Actual" : "Volumetric"} weight (${totalKg(b) >= volumetricKg(b) ? `volumetric ${kgText(volumetricKg(b))}` : `actual ${kgText(totalKg(b))}`})`, kgText(r.kg)],
                ["Freight", `${kgText(r.kg)} × USD 2.60`, usd(r.freight)],
                ...(r.special ? [[`${b.cargoType} surcharge`, "15% of freight", usd(r.special)]] : []),
                ["Fuel", "USD 0.45 per kg", usd(r.fuel)],
                ["Security", "USD 0.15 per kg", usd(r.security)],
              ].map(([k, s, v]) => (
                <div className="p-rate-row" key={k}>
                  <div>{k}<small>{s}</small></div>
                  <span>{v}</span>
                </div>
              ))}
              <div className="p-rate-total"><span>Estimated total</span><span>{usd(r.total)}</span></div>
            </div>
          </div>
          <label className="p-check">
            <input id="accept" type="checkbox" checked={b.accepted} onChange={(e) => set({ accepted: e.target.checked })} aria-invalid={tried && !b.accepted ? true : undefined} />
            I accept the conditions of carriage and confirm the cargo information is correct.
          </label>
          {tried && !b.accepted && <ErrorText id="accept-err">Accept the conditions of carriage to confirm the booking.</ErrorText>}
        </section>
        <Summary
          rows={[
            { items: [["Cargo type", b.cargoType], ["Total weight", kgText(totalKg(b))], ["Origin", placeName(b.originAirport)], ["Destination", placeName(b.destAirport)], ["Pickup date", `${fmtDate(b.pickupDate)} · ${fmtTime(b.pickupTime)}`], ["Estimated delivery", deliveryEstimate(b)]] },
          ]}
          total={{ value: usd(r.total), note: `Chargeable weight ${kgText(r.kg)}` }}
        />
      </div>
      <div className="p-actions">
        <button type="button" className="p-btn secondary" onClick={() => go("step3", { force: true })}>Back</button>
        <button type="button" className="p-btn" onClick={confirm}>Confirm booking</button>
      </div>
    </Shell>
  );
}
