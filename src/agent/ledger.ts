/* Mock booking store keyed by idempotency key.
   The same key always returns the same booking, so a double click or a retry never books twice.
   It lives in session storage: it protects this tab only (a real system checks keys on the server). */

import type { BookingRecord } from "./types.ts";
import type { GuardedStore } from "./storage.ts";
import { hash } from "./util.ts";

const KEY = "cargopilot.ledger.v1";

const isLedger = (v: unknown): v is Record<string, BookingRecord> =>
  !!v && typeof v === "object" && Object.values(v as object).every((r) => r && typeof (r as BookingRecord).idempotencyKey === "string" && typeof (r as BookingRecord).bookingId === "string");

export class BookingLedger {
  private store: GuardedStore;
  constructor(store: GuardedStore) {
    this.store = store;
  }

  private all(): Record<string, BookingRecord> {
    return this.store.get(KEY, isLedger) ?? {};
  }

  get(idempotencyKey: string): BookingRecord | null {
    return this.all()[idempotencyKey] ?? null;
  }

  count() {
    return Object.keys(this.all()).length;
  }

  /** Creates the booking once; a second call with the same key returns the first booking unchanged */
  create(rec: Omit<BookingRecord, "bookingId" | "awb">): BookingRecord {
    const all = this.all();
    const existing = all[rec.idempotencyKey];
    if (existing) return existing;
    const h = parseInt(hash(rec.idempotencyKey), 16);
    const record: BookingRecord = {
      ...rec,
      bookingId: `#${2000 + (h % 7000)}`,
      awb: `000-${String(10_000_000 + (h % 89_999_999)).padStart(8, "0")}`,
    };
    all[rec.idempotencyKey] = record;
    this.store.set(KEY, all);
    return record;
  }
}
