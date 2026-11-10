import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import type { Booking } from "./data";
import { EMPTY_STEP1, FILLED } from "./data";
import { BOOKING_PAGES, INITIAL_UI, ProtoContext } from "./store";
import type { GoOptions, Page, ProtoApi, Ui } from "./store";
import { I, Icon } from "./ui";
import CargoTypePage from "./pages/CargoTypePage";
import RoutePage from "./pages/RoutePage";
import DocumentsPage from "./pages/DocumentsPage";
import ReviewPage from "./pages/ReviewPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import BookingsPage from "./pages/BookingsPage";
import { CustomsPage, TrackingPage } from "./pages/Generated";
import "./proto.css";

const PAGES: Record<Page, () => ReactElement> = {
  step1: CargoTypePage,
  step2: RoutePage,
  step3: DocumentsPage,
  step4: ReviewPage,
  step5: ConfirmationPage,
  bookings: BookingsPage,
  tracking: TrackingPage,
  customs: CustomsPage,
};

export type Preset = { b?: Partial<Booking>; ui?: Partial<Ui> };

export const presetBooking = (p?: Preset): Booking => ({ ...FILLED, ...p?.b, docs: { ...FILLED.docs, ...p?.b?.docs } });
export const presetUi = (p?: Preset): Ui => ({ ...INITIAL_UI, ...p?.ui });

const now = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

type Props = {
  page: Page;
  booking: Booking;
  ui: Ui;
  onBooking: (b: Booking) => void;
  onUi: (patch: Partial<Ui>) => void;
  onNavigate: (page: Page) => void;
};

/** The live booking app. State is owned by the caller, so a flow can keep it across screens. */
export function Prototype({ page, booking, ui, onBooking, onUi, onNavigate }: Props) {
  const [toastMsg, setToast] = useState<{ text: string; tone: "info" | "error" } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const bRef = useRef(booking);
  bRef.current = booking;

  const toast = useCallback((text: string, tone: "info" | "error" = "info") => {
    setToast({ text, tone });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 3600);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const go = useCallback(
    (target: Page, opts: GoOptions = {}) => {
      if (!opts.force && ui.dirty && BOOKING_PAGES.includes(page) && !BOOKING_PAGES.includes(target) && target !== "step4") {
        onUi({ leaveTo: target });
        return;
      }
      if (opts.fresh) {
        onBooking({ ...bRef.current, ...EMPTY_STEP1 } as Booking);
        onUi({ submitted: {}, dirty: false, leaveTo: null, searchOpen: false });
      } else {
        onUi({ leaveTo: null, searchOpen: false, saveFailed: false });
      }
      window.scrollTo({ top: 0 });
      onNavigate(target);
    },
    [page, ui.dirty, onBooking, onUi, onNavigate],
  );

  const api: ProtoApi = useMemo(
    () => ({
      b: booking,
      ui,
      page,
      set: (patch) => {
        onBooking({ ...bRef.current, ...patch });
        onUi({ dirty: true, savedAt: now() });
      },
      setUi: onUi,
      go,
      toast,
    }),
    [booking, ui, page, onBooking, onUi, go, toast],
  );

  const Page_ = PAGES[page];
  return (
    <ProtoContext.Provider value={api}>
      <div className="proto">
        <Page_ />
        {ui.leaveTo && (
          <>
            <div className="p-scrim" onClick={() => onUi({ leaveTo: null })} />
            <div className="p-dialog" role="dialog" aria-modal="true" aria-labelledby="leave-title">
              <span className="p-dialog-icon"><Icon d={I.warn} size={22} /></span>
              <h3 id="leave-title">Leave this booking?</h3>
              <p>Your draft stays in My bookings and you can pick it up whenever you want.</p>
              <div className="p-actions">
                <button type="button" className="p-btn secondary md" autoFocus onClick={() => onUi({ leaveTo: null })}>Keep editing</button>
                <button
                  type="button"
                  className="p-btn md"
                  onClick={() => {
                    const to = ui.leaveTo!;
                    onUi({ leaveTo: null, dirty: false, draft: true, confirmed: false });
                    window.scrollTo({ top: 0 });
                    onNavigate(to);
                  }}
                >
                  Leave
                </button>
              </div>
            </div>
          </>
        )}
        {toastMsg && (
          <div className={`p-toast${toastMsg.tone === "error" ? " error" : ""}`} role="status">
            <span className="grow">{toastMsg.text}</span>
            <button type="button" className="x" aria-label="Dismiss" onClick={() => setToast(null)}><Icon d={I.x} size={16} /></button>
          </div>
        )}
      </div>
    </ProtoContext.Provider>
  );
}

/** A self-contained instance of the app at one preset, for the autoplay preview. */
export function StaticPrototype({ page, preset }: { page: Page; preset?: Preset }) {
  const [booking, setBooking] = useState(() => presetBooking(preset));
  const [ui, setUiState] = useState(() => presetUi(preset));
  const [current, setCurrent] = useState(page);
  const onUi = useCallback((p: Partial<Ui>) => setUiState((u) => ({ ...u, ...p })), []);
  return <Prototype page={current} booking={booking} ui={ui} onBooking={setBooking} onUi={onUi} onNavigate={setCurrent} />;
}
