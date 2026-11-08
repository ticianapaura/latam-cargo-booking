import type { ReactElement } from "react";
import CargoType from "./screens/CargoType";
import RouteDates from "./screens/RouteDates";
import Documents from "./screens/Documents";
import Review from "./screens/Review";
import Confirmation from "./screens/Confirmation";
import MyBookings from "./screens/MyBookings";
import Tracking from "./screens/Tracking";
import CargoTypeErrors from "./screens/CargoTypeErrors";
import RouteDatesErrors from "./screens/RouteDatesErrors";
import DocumentsErrors from "./screens/DocumentsErrors";
import ReviewChanged from "./screens/ReviewChanged";
import ConfirmationPending from "./screens/ConfirmationPending";
import TrackingCustoms from "./screens/TrackingCustoms";
import LeaveDialog from "./screens/LeaveDialog";
import SaveErrorToast from "./screens/SaveErrorToast";
import SessionExpired from "./screens/SessionExpired";

export type Step = {
  /** Short name shown in the step list */
  label: string;
  /** What the user does or sees on this screen */
  note: string;
  /** Text of the button that moves the user to the next step, highlighted on screen */
  cta?: string;
  render: () => ReactElement;
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

const S = {
  empty: { label: "Cargo type · empty", note: "Step 1 as the user first sees it: placeholders with examples, an empty summary and Save and continue disabled.", render: () => <CargoType state="empty" /> },
  filled: { label: "Cargo type · ready", note: "Every required field is valid. Errors clear as the user types, and Save and continue unlocks.", cta: "Save and continue", render: () => <CargoType state="filled" /> },
  route: { label: "Route and dates", note: "Origin, destination, pickup date and time. The summary on the right keeps growing.", cta: "Save and continue", render: () => <RouteDates /> },
  docs: { label: "Documents", note: "The required documents for perishables, each with its own upload state.", cta: "Save and continue", render: () => <Documents /> },
  review: { label: "Review", note: "The whole booking on one page, with the final rate and an Edit link per section.", cta: "Confirm booking", render: () => <Review /> },
  confirmed: { label: "Confirmation", note: "Booking confirmed. The AWB is sent by email, and tracking starts at pickup.", cta: "Go to My bookings", render: () => <Confirmation /> },
  bookings: { label: "My bookings", note: "Every booking with its status and the action that makes sense for it.", cta: "Track", render: () => <MyBookings /> },
  tracking: { label: "Tracking · details", note: "Upcoming milestones on top, history below, and the flight in progress.", cta: "Map", render: () => <Tracking /> },
  map: { label: "Tracking · map", note: "The door-to-door route on a map: road pickup, the flight and road delivery.", render: () => <Tracking tab="map" /> },
} satisfies Record<string, Step>;

const with_ = (step: Step, patch: Partial<Step>): Step => ({ ...step, ...patch });

export const FLOWS: Flow[] = [
  {
    id: "happy-path",
    group: "happy",
    title: "New booking, start to finish",
    summary: "Five booking steps, then My bookings and tracking on details and map.",
    steps: [
      with_(S.empty, { note: S.empty.note + " Use Next to fill in the step." }),
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
      { label: "Error summary", note: "Save and continue with invalid fields: a summary on top links to each field, and every field explains its own error. Save and continue stays disabled.", render: () => <CargoTypeErrors /> },
      with_(S.filled, { note: "The user fixes each field. The errors clear as they type, and Save and continue unlocks." }),
      with_(S.route, { cta: undefined, note: "Back on the happy path, on Step 2." }),
    ],
  },
  {
    id: "route-errors",
    group: "errors",
    title: "Step 2 · Route and date errors",
    summary: "An airport, date or postal code that doesn't work together.",
    steps: [
      { label: "Route errors", note: "Five fields to check: Mendoza handles domestic cargo only, the pickup date is in the past, the time is outside pickup hours and the postal code doesn't look right. Each error says how to fix it.", render: () => <RouteDatesErrors /> },
      with_(S.route, { note: "With the fixes applied, the step is valid again." }),
      with_(S.docs, { cta: undefined, note: "Back on the happy path, on Step 3." }),
    ],
  },
  {
    id: "documents-errors",
    group: "errors",
    title: "Step 3 · File too big and offline",
    summary: "A certificate over the size limit and a lost connection.",
    steps: [
      { label: "File too big, offline", note: "The certificate is 18.4 MB and the limit is 10 MB, so the error says how to fix it. The connection also drops: the user can keep going, and changes are sent when they're back online.", render: () => <DocumentsErrors /> },
      with_(S.docs, { note: "File re-uploaded and connection back: all documents are attached." }),
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
      with_(S.review, { note: "The user confirms without every document attached." }),
      { label: "Pending documents", note: "The booking is confirmed, and a warning says the packing list is missing and the deadline to attach it before pickup.", cta: "Go to My bookings", render: () => <ConfirmationPending /> },
      with_(S.bookings, { cta: undefined, note: "The booking is in My bookings, where the documents can be uploaded later." }),
    ],
  },
  {
    id: "leave-with-changes",
    group: "interruptions",
    title: "Leaving mid-booking",
    summary: "The user tries to leave Step 1 with unsaved changes.",
    steps: [
      with_(S.filled, { cta: undefined, note: "The user is halfway through Step 1 and clicks something else in the menu." }),
      { label: "Leave dialog", note: "A dialog asks before leaving. Leave keeps the draft in My bookings; Keep editing goes back to the step.", cta: "Keep editing", render: () => <LeaveDialog /> },
      with_(S.filled, { note: "Back on Step 1, with everything as it was." }),
    ],
  },
  {
    id: "save-error",
    group: "interruptions",
    title: "Save fails on our side",
    summary: "Step 2 can't be saved because of a problem on our end.",
    steps: [
      with_(S.route, { note: "The user saves Step 2." }),
      { label: "Save error", note: "The step can't be saved. Everything entered is kept, and Retry tries again.", cta: "Retry", render: () => <SaveErrorToast /> },
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
      with_(S.bookings, { note: "A booking needs attention." }),
      { label: "Held at customs", note: "Tracking explains what's missing, who acts next and lets the user upload the certificate right there.", render: () => <TrackingCustoms /> },
    ],
  },
  {
    id: "flight-delayed",
    group: "tracking",
    title: "Flight delayed",
    summary: "The flight leaves late and the arrival time changes.",
    steps: [
      with_(S.tracking, { cta: undefined, note: "Tracking in transit, on time." }),
      { label: "Delayed", note: "The delay is on top, with the new estimated delivery and a note that the cold chain is kept while the cargo waits.", render: () => <Tracking scenario="delay" /> },
    ],
  },
  {
    id: "no-updates",
    group: "tracking",
    title: "No updates for 14 hours",
    summary: "No scans for a long time, which is normal during the flight.",
    steps: [
      with_(S.tracking, { cta: undefined, note: "Tracking in transit." }),
      { label: "No updates", note: "We say there's been no news, explain why that's normal and promise an email if nothing changes in 6 more hours.", render: () => <Tracking scenario="stale" /> },
    ],
  },
  {
    id: "search-booking",
    group: "search",
    title: "Find a booking by number or AWB",
    summary: "From an empty search bar to the booking's tracking.",
    steps: [
      { label: "Search · default", note: "The search bar in the header, on every page.", render: () => <MyBookings /> },
      { label: "Search · recent", note: "On focus, the last bookings searched and a tip on what can be searched.", render: () => <MyBookings search="recent" /> },
      { label: "Search · typing", note: "Typing “#123” suggests matching bookings, with the typed part in bold. Arrows move, Enter opens.", render: () => <MyBookings search="typing" /> },
      { label: "Search · exact match", note: "A full AWB finds one booking, with its status and key facts.", cta: "Open tracking", render: () => <MyBookings search="match" /> },
      with_(S.tracking, { cta: undefined, note: "Open tracking goes straight to the booking." }),
    ],
  },
  {
    id: "search-no-results",
    group: "search-edge",
    title: "No results",
    summary: "An incomplete AWB, explained, with a way back.",
    steps: [
      { label: "Search · loading", note: "While searching, the bar shows a spinner and the list shows placeholders.", render: () => <MyBookings search="loading" /> },
      { label: "No results", note: "The AWB has 7 digits instead of 11. We say what format is expected and keep recent bookings at hand.", render: () => <MyBookings search="noresults" /> },
      { label: "Search · typing", note: "The user corrects the number.", render: () => <MyBookings search="typing" /> },
      { label: "Exact match", note: "Found.", render: () => <MyBookings search="match" /> },
    ],
  },
  {
    id: "search-no-access",
    group: "search-edge",
    title: "Booking from another account",
    summary: "The booking exists, but the user can't see it.",
    steps: [
      { label: "Search · recent", note: "The user searches for a booking a colleague made.", render: () => <MyBookings search="recent" /> },
      { label: "No access", note: "We don't show any details of the booking. We explain why and offer to request access.", render: () => <MyBookings search="noaccess" /> },
    ],
  },
  {
    id: "search-offline",
    group: "search-edge",
    title: "Search with no connection",
    summary: "The search can't run, but recent bookings still work.",
    steps: [
      { label: "Offline", note: "The search can't run. Try again is the main action, and recent bookings still open.", render: () => <MyBookings search="offline" /> },
      { label: "Search · recent", note: "Back online: search works again.", render: () => <MyBookings search="recent" /> },
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
