import { createContext, useContext } from "react";
import type { Booking } from "./data";

export type Page = "step1" | "step2" | "step3" | "step4" | "step5" | "bookings" | "tracking" | "customs";

export type Ui = {
  /** Steps the user tried to save: their errors show until fixed */
  submitted: Partial<Record<Page, boolean>>;
  /** The user changed something since the last save */
  dirty: boolean;
  savedAt: string;
  /** Page waiting behind the "Leave this booking?" dialog */
  leaveTo: Page | null;
  offline: boolean;
  /** Simulate a failed save on Step 2 */
  saveError: boolean;
  saveFailed: boolean;
  /** A draft was left in My bookings */
  draft: boolean;
  confirmed: boolean;
  // search
  q: string;
  searchOpen: boolean;
  searchSubmitted: boolean;
  searchLoading: boolean;
  searchOffline: boolean;
  // My bookings + tracking
  bookingsTab: "All" | "Active" | "Drafts" | "Completed";
  trackingTab: "details" | "map";
  scenario: "normal" | "delay" | "stale";
};

export const INITIAL_UI: Ui = {
  submitted: {},
  dirty: false,
  savedAt: "1:20 PM",
  leaveTo: null,
  offline: false,
  saveError: false,
  saveFailed: false,
  draft: false,
  confirmed: true,
  q: "",
  searchOpen: false,
  searchSubmitted: false,
  searchLoading: false,
  searchOffline: false,
  bookingsTab: "All",
  trackingTab: "details",
  scenario: "normal",
};

export type GoOptions = {
  /** Start a new, empty booking (New booking in the menu) */
  fresh?: boolean;
  /** Skip the "Leave this booking?" check */
  force?: boolean;
};

export type ProtoApi = {
  b: Booking;
  ui: Ui;
  page: Page;
  /** Change booking data (marks the draft as changed) */
  set: (patch: Partial<Booking>) => void;
  setUi: (patch: Partial<Ui>) => void;
  go: (page: Page, opts?: GoOptions) => void;
  toast: (message: string, tone?: "info" | "error") => void;
};

export const ProtoContext = createContext<ProtoApi | null>(null);

export function useProto() {
  const ctx = useContext(ProtoContext);
  if (!ctx) throw new Error("useProto must be used inside <Prototype>");
  return ctx;
}

export const BOOKING_PAGES: Page[] = ["step1", "step2", "step3"];
