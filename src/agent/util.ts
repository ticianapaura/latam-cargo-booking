/* Small deterministic helpers: a clock, a string hash and a seeded random. */

import { TODAY } from "../proto/data.ts";

export type Clock = { now(): number };

/** The prototype's clock: "today" is fixed (as in the rest of the app), and time moves at real speed from 10:00 that day. */
export function prototypeClock(): Clock {
  const start = Date.parse(`${TODAY}T10:00:00Z`);
  const t0 = Date.now();
  return { now: () => start + (Date.now() - t0) };
}

/** A clock tests can move by hand */
export function manualClock(iso = `${TODAY}T10:00:00Z`) {
  let t = Date.parse(iso);
  return { now: () => t, advance: (ms: number) => (t += ms), set: (s: string) => (t = Date.parse(s)) };
}

export const iso = (ms: number) => new Date(ms).toISOString().slice(0, 19) + "Z";
export const day = (ms: number) => new Date(ms).toISOString().slice(0, 10);
export const MIN = 60_000;
export const HOUR = 60 * MIN;
export const DAY = 24 * HOUR;

/** FNV-1a, enough to make stable ids and terms hashes */
export function hash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/** Stable JSON: keys sorted, so the same terms always hash the same */
export function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (v && typeof v === "object") {
    return `{${Object.keys(v as object)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(v);
}

export function seeded(seed: string) {
  let a = parseInt(hash(seed), 16);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const round2 = (n: number) => Math.round(n * 100) / 100;
export const sleep = (ms: number) => (ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve());
