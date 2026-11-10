import { useRef, useState } from "react";
import { DOCS, MAX_MB, docErrors, fmtDate, fmtTime, kgText, placeName, rate, totalKg, usd } from "../data";
import type { DocId, UploadedFile } from "../data";
import { useProto } from "../store";
import { BookingHead, ErrorSummary, I, Icon, Shell, Summary } from "../ui";

const ACCEPT = [".pdf", ".jpg", ".jpeg", ".png"];

/** Step 3 · Documents. Attach real files from your computer: type and size are checked like in production. */
export default function DocumentsPage() {
  const { b, set, ui, setUi, go } = useProto();
  const [progress, setProgress] = useState<Partial<Record<DocId, number>>>({});
  const inputs = useRef<Partial<Record<DocId, HTMLInputElement | null>>>({});
  const submitted = !!ui.submitted.step3;
  const all = docErrors(b);
  const errors = submitted ? all : Object.fromEntries(Object.entries(all).filter(([k]) => b.docs[k as DocId]?.error));
  const r = rate(b);
  const attached = DOCS.filter((d) => !d.optional && b.docs[d.id] && !b.docs[d.id]!.error).length;

  const attach = (id: DocId, file: File) => {
    const mb = Math.round((file.size / 1024 / 1024) * 10) / 10;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    let error: string | undefined;
    if (!ACCEPT.includes(ext)) error = `${file.name} isn’t a PDF, JPG or PNG. Export it to one of those formats and try again.`;
    else if (mb > MAX_MB) error = `${file.name} is ${mb} MB. The limit is ${MAX_MB} MB: compress it or split it into two files.`;
    if (error) {
      set({ docs: { ...b.docs, [id]: { name: file.name, mb, error } } });
      return;
    }
    // Simulated upload so the progress state can be seen
    let p = 0;
    const tick = window.setInterval(() => {
      p += 20;
      setProgress((s) => ({ ...s, [id]: p }));
      if (p >= 100) {
        window.clearInterval(tick);
        setProgress((s) => ({ ...s, [id]: undefined }));
        set({ docs: { ...bRef.current.docs, [id]: { name: file.name, mb: Math.max(mb, 0.1) } } });
      }
    }, 120);
  };
  const bRef = useRef(b);
  bRef.current = b;

  const save = () => {
    if (Object.keys(all).length) {
      setUi({ submitted: { ...ui.submitted, step3: true } });
      return;
    }
    go("step4", { force: true });
  };

  const labels = Object.fromEntries(DOCS.map((d) => [d.id, d.name]));

  return (
    <Shell active="New booking">
      <BookingHead step={3} saved={!ui.offline} />
      <div className="p-grid">
        <div>
          {ui.offline && (
            <div className="p-alert warn" role="status">
              <Icon d={I.wifiOff} size={20} />
              <div style={{ flex: 1 }}>
                <b>You're offline</b>
                Keep going: we keep your changes and send them as soon as you're back online.
              </div>
              <button type="button" className="p-btn secondary sm" onClick={() => setUi({ offline: false })}>I’m back online</button>
            </div>
          )}
          {submitted && Object.keys(all).length > 0 && <ErrorSummary errors={errors} labels={labels} title="Some documents need your attention" />}
          <section className="p-section" style={{ marginBottom: 0 }}>
            <h2>Documents</h2>
            <p className="p-intro">
              Based on the cargo type ({b.cargoType || "not chosen yet"}) and route, you need these documents. PDF, JPG or PNG, up to {MAX_MB} MB.
            </p>
            <div className="p-docs">
              {DOCS.map((d) => {
                const f: UploadedFile | null = b.docs[d.id];
                const err = errors[d.id];
                const up = progress[d.id];
                const state = err ? "invalid" : f ? "ok" : "";
                return (
                  <div key={d.id} className={`p-doc ${state}`}>
                    <span className="p-doc-icon"><Icon d={err ? I.alert : I.file} size={20} /></span>
                    <div>
                      <div className="p-doc-name">
                        {d.name} {d.optional && <span className="p-opt" style={{ fontSize: 12 }}>optional</span>}
                      </div>
                      <div className="p-doc-detail">{d.detail}</div>
                      {up !== undefined ? (
                        <div className="p-progress" role="progressbar" aria-valuenow={up} aria-label={`Uploading ${d.name}`}><i style={{ width: `${up}%` }} /></div>
                      ) : err ? (
                        <p className="p-err" id={`${d.id}-err`} style={{ marginTop: 4 }}><Icon d={I.alert} size={16} /> {err}</p>
                      ) : f ? (
                        <div className="p-doc-file"><Icon d={I.check} size={14} stroke={2} /> {f.name} · {f.mb} MB</div>
                      ) : null}
                    </div>
                    <div className="p-doc-actions">
                      <input
                        ref={(el) => { inputs.current[d.id] = el; }}
                        type="file"
                        accept={ACCEPT.join(",")}
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) attach(d.id, file);
                          e.target.value = "";
                        }}
                      />
                      {f && !f.error && up === undefined && (
                        <button type="button" className="p-link" onClick={() => set({ docs: { ...b.docs, [d.id]: null } })}>Remove</button>
                      )}
                      {up === undefined && (!f || f.error) && (
                        <button type="button" id={d.id} className="p-btn secondary sm" onClick={() => inputs.current[d.id]?.click()}>
                          <Icon d={I.upload} size={15} /> {f?.error ? "Choose another file" : "Attach"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="p-help">Tip: in this prototype the files stay on your computer. Nothing is uploaded.</p>
          </section>
        </div>
        <Summary
          rows={[
            { items: [["Cargo type", b.cargoType], ["Total weight", totalKg(b) ? kgText(totalKg(b)) : ""], ["Origin", placeName(b.originAirport)], ["Destination", placeName(b.destAirport)], ["Pickup date", b.pickupDate ? `${fmtDate(b.pickupDate)} · ${fmtTime(b.pickupTime)}` : ""]] },
            { title: "Documents", items: [["Attached", `${attached} of ${DOCS.filter((d) => !d.optional).length}`]] },
          ]}
          total={{ value: usd(r.total), note: `Chargeable weight ${kgText(r.kg)}` }}
          status={ui.offline ? "Offline · saving on this device" : "Draft"}
        />
      </div>
      <div className="p-actions">
        <button type="button" className="p-btn secondary" onClick={() => go("step2", { force: true })}>Back</button>
        <button type="button" className="p-btn" onClick={save}>Save and continue</button>
      </div>
    </Shell>
  );
}
