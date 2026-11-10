import { CARGO_TYPES, HANDLING, INSTR_MAX, STEP1_SUMMARY, kgText, step1Errors, step1Ready, totalKg } from "../data";
import { useProto } from "../store";
import { BookingHead, Chips, ErrorSummary, ErrorText, Field, Select, Shell, Summary, TextInput } from "../ui";

/** Step 1 · Cargo type. Errors appear after the first save attempt and clear as the user fixes them. */
export default function CargoTypePage() {
  const { b, set, ui, setUi, go } = useProto();
  const submitted = !!ui.submitted.step1;
  const all = step1Errors(b);
  const errors = submitted ? all : {};
  const ready = step1Ready(b);
  const total = totalKg(b);
  const dims = b.height && b.width && b.length ? `${b.height}×${b.width}×${b.length} ${b.dimUnit} per piece` : "";

  const save = () => {
    if (Object.keys(all).length) {
      setUi({ submitted: { ...ui.submitted, step1: true } });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    go("step2", { force: true });
  };

  return (
    <Shell active="New booking">
      <BookingHead step={1} saved={ui.dirty || ready} />
      <div className="p-grid">
        <div>
          {submitted && Object.keys(all).length > 0 && <ErrorSummary errors={errors} labels={STEP1_SUMMARY} />}

          <section className="p-section">
            <h2>Cargo type</h2>
            <Field id="cargoType" label="Cargo type" error={errors.cargoType}>
              <Select id="cargoType" value={b.cargoType} onChange={(v) => set({ cargoType: v })} placeholder="Select a cargo type" options={CARGO_TYPES} error={errors.cargoType} />
            </Field>
            <Field id="description" label="Cargo description" error={errors.description}>
              <TextInput id="description" value={b.description} onChange={(v) => set({ description: v })} placeholder="E.g. Fresh salmon in insulated boxes" error={errors.description} />
            </Field>
            <Field id="pieces" label="Number of pieces" error={errors.pieces}>
              <TextInput id="pieces" value={b.pieces} onChange={(v) => set({ pieces: v })} placeholder="E.g. 10" inputMode="numeric" width={140} error={errors.pieces} />
            </Field>
          </section>

          <section className="p-section">
            <h2>Weight</h2>
            <Field id="weight" label="Weight per piece" error={errors.weight}>
              <div className="p-row">
                <TextInput id="weight" value={b.weight} onChange={(v) => set({ weight: v })} placeholder="E.g. 25" inputMode="decimal" width={140} error={errors.weight} />
                <Select id="weightUnit" label="Weight unit" value={b.weightUnit} onChange={(v) => set({ weightUnit: v as "kg" | "lb" })} width={96} options={[{ value: "kg" }, { value: "lb" }]} />
              </div>
            </Field>
            <Field id="total" label="Total weight" hint="Calculated as pieces × weight per piece.">
              <TextInput id="total" value={total ? kgText(total) : ""} placeholder="Automatic" readOnly width={240} />
            </Field>
          </section>

          <section className="p-section">
            <h2>Dimensions per piece</h2>
            <div className="p-row" style={{ alignItems: "flex-end" }}>
              {(["height", "width", "length"] as const).map((k, i) => (
                <div className="p-field" key={k}>
                  <label htmlFor={i === 0 ? "dims" : k} style={{ fontSize: 13.5 }}>{k[0].toUpperCase() + k.slice(1)}</label>
                  <TextInput id={i === 0 ? "dims" : k} value={b[k]} onChange={(v) => set({ [k]: v })} placeholder={`E.g. ${[35, 40, 60][i]}`} inputMode="decimal" width={104} error={errors.dims && (k === "height" || !b[k]) ? errors.dims : undefined} />
                </div>
              ))}
              <div className="p-field">
                <span className="p-flabel" style={{ fontSize: 13.5 }}>Unit</span>
                <Select id="dimUnit" label="Dimension unit" value={b.dimUnit} onChange={(v) => set({ dimUnit: v as "cm" | "in" })} width={96} options={[{ value: "cm" }, { value: "in" }]} />
              </div>
            </div>
            {errors.dims && <ErrorText id="dims-err">{errors.dims}</ErrorText>}
          </section>

          <section className="p-section" style={{ marginBottom: 0 }}>
            <h2>Special handling</h2>
            <div className="p-field" style={{ maxWidth: 580, gap: 9 }}>
              <span className="p-flabel" id="handling-label">
                Handling requirements <span className="p-opt">(optional, depends on type)</span>
              </span>
              <Chips id="handling" options={HANDLING} value={b.handling} onChange={(v) => set({ handling: v })} invalid={!!errors.handling} />
              {errors.handling && <ErrorText id="handling-err">{errors.handling}</ErrorText>}
            </div>
            <Field id="instructions" label="Additional instructions" optional="optional" error={errors.instructions}>
              <textarea
                id="instructions"
                className="p-textarea"
                value={b.instructions}
                onChange={(e) => set({ instructions: e.target.value })}
                placeholder="Write additional instructions…"
                aria-invalid={errors.instructions ? true : undefined}
                aria-describedby="instructions-count"
              />
              <span id="instructions-count" className={`p-count${b.instructions.length > INSTR_MAX ? " over" : ""}`} aria-live="polite">
                {b.instructions.length}/{INSTR_MAX}
              </span>
            </Field>
          </section>
        </div>

        <Summary
          rows={[
            { items: [["Cargo type", b.cargoType], ["Cargo description", b.description], ["Number of pieces", b.pieces], ["Total weight", total ? kgText(total) : ""], ["Dimensions", dims], ["Handling requirements", b.handling.join(", ")]] },
            { title: "Route", items: [["Origin", ""], ["Destination", ""]] },
          ]}
        />
      </div>
      <div className="p-actions end">
        <button type="button" className="p-btn" disabled={!ready} onClick={save}>Save and continue</button>
      </div>
    </Shell>
  );
}
