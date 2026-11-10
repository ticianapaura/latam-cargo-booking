import type { ReactElement } from "react";
import ReviewChanged from "./screens/ReviewChanged";
import SessionExpired from "./screens/SessionExpired";
import { EMPTY_STEP1, FILLED, INVALID_STEP1, INVALID_STEP2 } from "./proto/data";
import type { Preset } from "./proto/Prototype";
import type { Page } from "./proto/store";

export type Step = {
  /** Short name shown in the step list */
  label: string;
  /** What the user does or sees on this screen */
  note: string;
  /** Text of the button that moves the user forward, highlighted on screen */
  cta?: string;
  /** A screen of the live app, opened with this preset of data and state */
  page?: Page;
  preset?: Preset;
  /** A fixed screen from the design canvas, for moments the live app doesn't simulate */
  render?: () => ReactElement;
};

export type Flow = {
  id: string;
  group: GroupId;
  title: string;
  summary: string;
  steps: Step[];
};

export type GroupId = "happy" | "errors" | "interruptions" | "tracking" | "search" | "search-edge";

export const GROUPS: { id: GroupId; title: string; description: string; tone: string }[] = [
  { id: "happy", title: "Happy path", description: "A new booking from the first empty step to live tracking, with nothing going wrong.", tone: "green" },
  { id: "errors", title: "Invalid data on each step", description: "What happens when the user saves a step with something wrong, and how they get back on track.", tone: "red" },
  { id: "interruptions", title: "Interruptions while booking", description: "Leaving halfway, a failed save and an expired session. The draft is never lost.", tone: "orange" },
  { id: "tracking", title: "Tracking exceptions", description: "After booking: customs holds, delays and silence from the carrier.", tone: "teal" },
  { id: "search", title: "Search a booking", description: "Finding an existing booking by booking number or AWB.", tone: "blue" },
  { id: "search-edge", title: "Search edge cases", description: "No results, someone else's booking and no connection.", tone: "purple" },
];

const FILLED_STEP1: Preset["b"] = {
  cargoType: FILLED.cargoType, description: FILLED.description, pieces: FILLED.pieces, weight: FILLED.weight,
  height: FILLED.height, width: FILLED.width, length: FILLED.length, handling: FILLED.handling, instructions: "",
};

const S = {
  empty: { page: "step1", preset: { b: EMPTY_STEP1 }, label: "Cargo type · empty", note: "Step 1 as the user first sees it: placeholders with examples, an empty summary and Save and continue disabled. Try the fields: the dropdown, the units and the handling chips all work.", cta: "Save and continue" },
  filled: { page: "step1", preset: { b: FILLED_STEP1 }, label: "Cargo type · ready", note: "Every required field is valid, and Save and continue unlocks. Change anything: the total weight and the summary update as you type.", cta: "Save and continue" },
  route: { page: "step2", label: "Route and dates", note: "Origin, destination, pickup date and time. Pick another country or airport: the postal code rules and the summary follow.", cta: "Save and continue" },
  docs: { page: "step3", label: "Documents", note: "The documents perishables need. Attach a real file from your computer: type and size are checked.", cta: "Save and continue" },
  review: { page: "step4", label: "Review", note: "The whole booking on one page. Edit takes you to that step, and the rate is calculated from your data.", cta: "Confirm booking" },
  confirmed: { page: "step5", label: "Confirmation", note: "Booking confirmed. The AWB is sent by email, and tracking starts at pickup.", cta: "Go to My bookings" },
  bookings: { page: "bookings", preset: { ui: { confirmed: true } }, label: "My bookings", note: "Every booking with its status. The tabs filter the list, and Track opens the booking in transit.", cta: "Track" },
  tracking: { page: "tracking", preset: { ui: { trackingTab: "details", scenario: "normal" } }, label: "Tracking · details", note: "Upcoming milestones on top, history below, and the flight in progress.", cta: "Map" },
  map: { page: "tracking", preset: { ui: { trackingTab: "map", scenario: "normal" } }, label: "Tracking · map", note: "The door-to-door route on a map: road pickup, the flight and road delivery. Details switches back." },
} satisfies Record<string, Step>;

const with_ = (step: Step, patch: Partial<Step>): Step => ({ ...step, ...patch });

export const FLOWS: Flow[] = [
  {
    id: "happy-path",
    group: "happy",
    title: "New booking, start to finish",
    summary: "Five booking steps, then My bookings and tracking on details and map.",
    steps: [
      with_(S.empty, { note: S.empty.note + " Fill in the step, or use Next to load sample data." }),
      S.filled, S.route, S.docs, S.review, S.confirmed, S.bookings, S.tracking, S.map,
    ],
  },
  {
    id: "cargo-type-errors",
    group: "errors",
    title: "Step 1 · Cargo type errors",
    summary: "Saving Step 1 with invalid fields, then fixing them.",
    steps: [
      with_(S.empty, { note: "The user starts Step 1 and fills it in quickly, with a few mistakes." }),
      { page: "step1", preset: { b: INVALID_STEP1, ui: { submitted: { step1: true } } }, label: "Error summary", note: "Save and continue with invalid fields: a summary on top links to each field, and every field explains its own error. Fix them one by one: each error clears as soon as the value is right.", cta: "Save and continue" },
      with_(S.filled, { note: "Every field fixed: no errors, and Save and continue moves on." }),
      with_(S.route, { cta: undefined, note: "Back on the happy path, on Step 2." }),
    ],
  },
  {
    id: "route-errors",
    group: "errors",
    title: "Step 2 · Route and date errors",
    summary: "An airport, date or postal code that doesn't work together.",
    steps: [
      { page: "step2", preset: { b: INVALID_STEP2, ui: { submitted: { step2: true } } }, label: "Route errors", note: "Mendoza handles domestic cargo only, the address has no number, the postal code doesn't look right, the date is in the past and the time is outside pickup hours. Try “Use EZE” or fix the fields.", cta: "Save and continue" },
      with_(S.route, { preset: { b: {} }, note: "With the fixes applied, the step is valid again." }),
      with_(S.docs, { cta: undefined, note: "Back on the happy path, on Step 3." }),
    ],
  },
  {
    id: "documents-errors",
    group: "errors",
    title: "Step 3 · File too big and offline",
    summary: "A certificate over the size limit and a lost connection.",
    steps: [
      { page: "step3", preset: { b: { docs: { ...FILLED.docs, health: { name: "scanned_certificate.pdf", mb: 18.4, error: "scanned_certificate.pdf is 18.4 MB. The limit is 10 MB: compress it or split it into two files." } } }, ui: { offline: true } }, label: "File too big, offline", note: "The certificate is 18.4 MB and the limit is 10 MB, so the error says how to fix it. The connection also drops: the user can keep going. Choose another file, or mark yourself back online.", cta: "Choose another file" },
      with_(S.docs, { preset: { b: { docs: FILLED.docs }, ui: { offline: false } }, note: "File re-uploaded and connection back: all documents are attached." }),
      with_(S.review, { cta: undefined, note: "Back on the happy path, on Step 4." }),
    ],
  },
  {
    id: "review-changed",
    group: "errors",
    title: "Step 4 · No space and new rate",
    summary: "The flight filled up and the rate changed while the user was booking.",
    steps: [
      { label: "Flight full, rate changed", note: "Flight LA8045 ran out of space, and LA8047 one day later has room. The rate also went up because of the weekly fuel adjustment, shown old and new side by side.", cta: "Use LA8047", render: () => <ReviewChanged /> },
      with_(S.review, { note: "With a new flight accepted, the user can confirm." }),
      with_(S.confirmed, { cta: undefined, note: "Booking confirmed." }),
    ],
  },
  {
    id: "pending-documents",
    group: "errors",
    title: "Step 5 · Booked with pending documents",
    summary: "The booking goes through, but some documents are still missing.",
    steps: [
      with_(S.review, { preset: { b: { docs: { ...FILLED.docs, packing: null } } }, note: "The user confirms without every document attached." }),
      { page: "step5", preset: { b: { docs: { ...FILLED.docs, packing: null } } }, label: "Pending documents", note: "The booking is confirmed, and a warning says the packing list is missing and the deadline to attach it before pickup.", cta: "Go to My bookings" },
      with_(S.bookings, { cta: undefined, note: "The booking is in My bookings, where the documents can be uploaded later." }),
    ],
  },
  {
    id: "leave-with-changes",
    group: "interruptions",
    title: "Leaving mid-booking",
    summary: "The user tries to leave Step 1 with unsaved changes.",
    steps: [
      with_(S.filled, { preset: { b: FILLED_STEP1, ui: { dirty: true } }, cta: "My bookings", note: "The user is halfway through Step 1 and clicks My bookings in the menu. Try it, or Back to bookings." }),
      { page: "step1", preset: { b: FILLED_STEP1, ui: { dirty: true, leaveTo: "bookings" } }, label: "Leave dialog", note: "A dialog asks before leaving. Leave keeps the draft in My bookings; Keep editing goes back to the step.", cta: "Leave" },
      { page: "bookings", preset: { ui: { draft: true, confirmed: false } }, label: "Draft in My bookings", note: "The draft is at the top of the list. Continue opens it where the user left off.", cta: "Continue" },
    ],
  },
  {
    id: "save-error",
    group: "interruptions",
    title: "Save fails on our side",
    summary: "Step 2 can't be saved because of a problem on our end.",
    steps: [
      with_(S.route, { preset: { b: {}, ui: { saveError: true } }, note: "The user saves Step 2. In this flow, the first save fails." }),
      { page: "step2", preset: { ui: { saveError: true, saveFailed: true } }, label: "Save error", note: "The step can't be saved. Everything entered is kept, and Retry tries again.", cta: "Retry" },
      with_(S.docs, { cta: undefined, note: "Retry worked: Step 3." }),
    ],
  },
  {
    id: "session-expired",
    group: "interruptions",
    title: "Session expired",
    summary: "30 minutes without activity on Step 3.",
    steps: [
      with_(S.docs, { cta: undefined, note: "The user leaves Step 3 open and steps away." }),
      { label: "Session expired", note: "For security, the session ends after 30 minutes of inactivity. The draft is saved.", cta: "Sign in", render: () => <SessionExpired /> },
      with_(S.docs, { note: "After signing in, the user is back on Step 3 with the draft." }),
    ],
  },
  {
    id: "held-at-customs",
    group: "tracking",
    title: "Held at customs",
    summary: "The cargo is stopped and the user has to act.",
    steps: [
      with_(S.bookings, { cta: undefined, note: "A booking needs attention." }),
      { page: "customs", label: "Held at customs", note: "Tracking explains what's missing, who acts next and lets the user upload the certificate right there." },
    ],
  },
  {
    id: "flight-delayed",
    group: "tracking",
    title: "Flight delayed",
    summary: "The flight leaves late and the arrival time changes.",
    steps: [
      with_(S.tracking, { cta: undefined, note: "Tracking in transit, on time." }),
      { page: "tracking", preset: { ui: { scenario: "delay", trackingTab: "details" } }, label: "Delayed", note: "The delay is on top, with the new estimated delivery and a note that the cold chain is kept while the cargo waits." },
    ],
  },
  {
    id: "no-updates",
    group: "tracking",
    title: "No updates for 14 hours",
    summary: "No scans for a long time, which is normal during the flight.",
    steps: [
      with_(S.tracking, { cta: undefined, note: "Tracking in transit." }),
      { page: "tracking", preset: { ui: { scenario: "stale", trackingTab: "details" } }, label: "No updates", note: "We say there's been no news, explain why that's normal and promise an email if nothing changes in 6 more hours." },
    ],
  },
  {
    id: "search-booking",
    group: "search",
    title: "Find a booking by number or AWB",
    summary: "From an empty search bar to the booking's tracking.",
    steps: [
      { page: "bookings", label: "Search · default", note: "The search bar in the header, on every page. Click it and type: #123, 045-12345678 or #1198 all do something different." },
      { page: "bookings", preset: { ui: { searchOpen: true } }, label: "Search · recent", note: "On focus, the last bookings searched and a tip on what can be searched." },
      { page: "bookings", preset: { ui: { searchOpen: true, q: "#123" } }, label: "Search · typing", note: "Typing “#123” suggests matching bookings, with the typed part in bold. Arrows move, Enter searches." },
      { page: "bookings", preset: { ui: { searchOpen: true, q: "045-12345678" } }, label: "Search · exact match", note: "A full AWB finds one booking, with its status and key facts.", cta: "Open tracking" },
      with_(S.tracking, { cta: undefined, note: "Open tracking goes straight to the booking." }),
    ],
  },
  {
    id: "search-no-results",
    group: "search-edge",
    title: "No results",
    summary: "An incomplete AWB, explained, with a way back.",
    steps: [
      { page: "bookings", preset: { ui: { searchOpen: true, q: "045-1234", searchLoading: true } }, label: "Search · loading", note: "While searching, the bar shows a spinner and the list shows placeholders." },
      { page: "bookings", preset: { ui: { searchOpen: true, q: "045-1234", searchSubmitted: true } }, label: "No results", note: "The AWB has 7 digits instead of 11. We say what format is expected and keep recent bookings at hand. Try completing the number." },
      { page: "bookings", preset: { ui: { searchOpen: true, q: "045-12345678" } }, label: "Exact match", note: "Found.", cta: "Open tracking" },
    ],
  },
  {
    id: "search-no-access",
    group: "search-edge",
    title: "Booking from another account",
    summary: "The booking exists, but the user can't see it.",
    steps: [
      { page: "bookings", preset: { ui: { searchOpen: true } }, label: "Search · recent", note: "The user searches for a booking a colleague made: type #1198 and press Enter." },
      { page: "bookings", preset: { ui: { searchOpen: true, q: "#1198", searchSubmitted: true } }, label: "No access", note: "We don't show any details of the booking. We explain why and offer to request access.", cta: "Request access" },
    ],
  },
  {
    id: "search-offline",
    group: "search-edge",
    title: "Search with no connection",
    summary: "The search can't run, but recent bookings still work.",
    steps: [
      { page: "bookings", preset: { ui: { searchOpen: true, searchOffline: true, q: "#1234" } }, label: "Offline", note: "The search can't run. Try again is the main action, and recent bookings still open.", cta: "Try again" },
      { page: "bookings", preset: { ui: { searchOpen: true } }, label: "Search · recent", note: "Back online: search works again." },
    ],
  },
];

/** Screens shown in the autoplay preview (?embed=1) */
export const REEL: Step[] = [
  S.empty,
  FLOWS[1].steps[1],
  S.filled, S.route, S.docs, S.review, S.confirmed,
  FLOWS[12].steps[2],
  S.tracking, S.map,
];
