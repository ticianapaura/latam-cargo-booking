import { AIRPORTS, COUNTRIES, STEP2_SUMMARY, airport, deliveryEstimate, fmtDate, fmtTime, kgText, placeName, postalExample, rate, step2Errors, totalKg, usd } from "../data";
import type { Booking } from "../data";
import { useProto } from "../store";
import { BookingHead, ErrorSummary, Field, I, Icon, Select, Shell, Summary, TextInput } from "../ui";

const ALL_TIMES = Array.from({ length: 48 }, (_, i) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
const timeOptions = ALL_TIMES.map((t) => {
  const h = Number(t.slice(0, 2)) + Number(t.slice(3)) / 60;
  return { value: t, label: fmtTime(t), hint: h < 6 || h > 22 ? "Outside pickup hours" : undefined };
});

/** Step 2 · Route and dates */
export default function RoutePage() {
  const { b, set, ui, setUi, go } = useProto();
  const submitted = !!ui.submitted.step2;
  const all = step2Errors(b);
  const errors = submitted ? all : {};
  const r = rate(b);

  const side = (prefix: "origin" | "dest") => {
    const country = prefix === "origin" ? b.originCountry : b.destCountry;
    const code = prefix === "origin" ? b.originAirport : b.destAirport;
    const k = (s: string) => `${prefix}${s}` as keyof Booking;
    const airports = AIRPORTS.filter((a) => a.country === country);
    const addr = prefix === "origin" ? "pickupAddress" : "deliveryAddress";
    const postal = prefix === "origin" ? "originPostal" : "destPostal";
    const ap = prefix === "origin" ? "originAirport" : "destAirport";
    return (
      <section className="p-section">
        <h2>Route: {prefix === "origin" ? "Origin" : "Destination"}</h2>
        <Field id={`${prefix}Country`} label="Country">
          <Select
            id={`${prefix}Country`}
            value={country}
            options={COUNTRIES.map((c) => ({ value: c }))}
            onChange={(v) => {
              const first = AIRPORTS.find((a) => a.country === v && a.international) ?? AIRPORTS.find((a) => a.country === v);
              set({ [k("Country")]: v, [ap]: first?.code ?? "", [postal]: "" } as Partial<Booking>);
            }}
          />
        </Field>
        <Field id={ap} label={prefix === "origin" ? "Origin airport" : "Destination airport"} error={errors[ap]}>
          <Select
            id={ap}
            value={code}
            options={airports.map((a) => ({ value: a.code, label: `${a.code} · ${a.name}`, hint: `${a.city}${a.international ? "" : " · domestic only"}` }))}
            onChange={(v) => set({ [ap]: v } as Partial<Booking>)}
            placeholder="Select an airport"
            error={errors[ap]}
          />
          {errors[ap] && prefix === "origin" && airport(code) && !airport(code)!.international && (
            <button type="button" className="p-fix" onClick={() => set({ originAirport: "EZE", originCountry: "Argentina" })}>Use EZE</button>
          )}
        </Field>
        <Field id={addr} label={prefix === "origin" ? "Pickup address" : "Delivery address"} error={errors[addr]}>
          <TextInput id={addr} value={b[addr]} onChange={(v) => set({ [addr]: v } as Partial<Booking>)} placeholder="Street and number" error={errors[addr]} />
        </Field>
        <Field id={postal} label="Postal code" hint={`E.g. ${postalExample(country)}`} error={errors[postal]} width={240}>
          <TextInput id={postal} value={b[postal]} onChange={(v) => set({ [postal]: v } as Partial<Booking>)} placeholder={`E.g. ${postalExample(country)}`} error={errors[postal]} />
        </Field>
      </section>
    );
  };

  const save = () => {
    if (Object.keys(all).length) {
      setUi({ submitted: { ...ui.submitted, step2: true } });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (ui.saveError) {
      setUi({ saveFailed: true });
      return;
    }
    go("step3", { force: true });
  };
  const failed = ui.saveFailed;

  return (
    <Shell active="New booking">
      {failed && (
        <div className="p-toast error" role="alert">
          <span style={{ color: "#B42318" }}><Icon d={I.alert} size={20} /></span>
          <div className="grow">
            <b>We couldn’t save this step</b>
            Something went wrong on our side. Everything you entered is still here, so try again in a few seconds.
          </div>
          <button type="button" className="p-btn sm" onClick={() => { setUi({ saveError: false, saveFailed: false }); go("step3", { force: true }); }}>Retry</button>
        </div>
      )}
      <BookingHead step={2} />
      <div className="p-grid">
        <div>
          {submitted && Object.keys(all).length > 0 && <ErrorSummary errors={errors} labels={STEP2_SUMMARY} />}
          {side("origin")}
          {side("dest")}
          <section className="p-section" style={{ marginBottom: 0 }}>
            <h2>Schedule</h2>
            <div className="p-row" style={{ gap: 18 }}>
              <Field id="pickupDate" label="Pickup date" error={errors.pickupDate} width={226}>
                <TextInput id="pickupDate" type="date" value={b.pickupDate} onChange={(v) => set({ pickupDate: v })} error={errors.pickupDate} />
              </Field>
              <Field id="pickupTime" label="Pickup time" hint="Between 6 AM and 10 PM" error={errors.pickupTime} width={226}>
                <Select id="pickupTime" value={b.pickupTime} options={timeOptions} onChange={(v) => set({ pickupTime: v })} error={errors.pickupTime} placeholder="Select a time" />
              </Field>
            </div>
            <Field id="delivery" label="Estimated delivery">
              <TextInput id="delivery" value={deliveryEstimate(b)} readOnly placeholder="Automatic" />
            </Field>
            {!Object.keys(all).length && (
              <div className="p-alert info" style={{ marginBottom: 0 }}>
                <Icon d={I.info} size={20} />
                <span>Estimated transit 48 h for the {b.originAirport} → {b.destAirport} route.{b.cargoType === "Perishables" ? " Within the recommended window for perishables." : ""}</span>
              </div>
            )}
          </section>
        </div>
        <Summary
          rows={[
            { items: [["Cargo type", b.cargoType], ["Total weight", totalKg(b) ? kgText(totalKg(b)) : ""], ["Handling requirements", b.handling.join(", ")]] },
            { title: "Route", items: [["Origin", placeName(b.originAirport)], ["Destination", placeName(b.destAirport)]] },
            { title: "Schedule", items: [["Pickup date", b.pickupDate ? `${fmtDate(b.pickupDate)} · ${fmtTime(b.pickupTime)}` : ""], ["Estimated delivery", deliveryEstimate(b)]] },
          ]}
          total={{ value: usd(r.total), note: `Chargeable weight ${kgText(r.kg)}` }}
        />
      </div>
      <div className="p-actions">
        <button type="button" className="p-btn secondary" onClick={() => go("step1", { force: true })}>Back</button>
        <button type="button" className="p-btn" onClick={save}>Save and continue</button>
      </div>
    </Shell>
  );
}
