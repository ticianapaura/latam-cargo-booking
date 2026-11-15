/* The agent session for this browser tab: one agent, its mock carrier API and ledger, the simulated
   role (Coordinator or Logistics Manager) and the prototype's "simulate a problem" controls.
   It outlives page changes and flow steps, and is restored from session storage after a reload. */

import { useEffect, useReducer } from "react";
import { Agent } from "../agent/agent.ts";
import { BookingLedger } from "../agent/ledger.ts";
import { MockCarrierApi } from "../agent/mockApi.ts";
import type { Faults } from "../agent/mockApi.ts";
import { GuardedStore } from "../agent/storage.ts";
import type { Role } from "../agent/types.ts";
import { prototypeClock } from "../agent/util.ts";

/** A problem the reviewer can make happen on the next matching step */
export type Simulation = { id: string; label: string; detail: string; faults: Faults };

export const SIMULATIONS: Simulation[] = [
  { id: "price", label: "The price goes up at booking", detail: "+10% when confirming: a new version needs approval again", faults: { priceIncreasePct: 10 } },
  { id: "space", label: "The flight's space is released", detail: "At booking: flights are searched again", faults: { expireBeforeConfirm: true } },
  { id: "timeout-booked", label: "Booking times out, but it went through", detail: "The status check finds the booking", faults: { confirmTimeout: "booked" } },
  { id: "timeout-unknown", label: "Booking times out, status can't be checked", detail: "Status stays unknown; nothing is re-sent", faults: { confirmTimeout: "booked", statusFailures: 3 } },
  { id: "refused", label: "The booking service refuses", detail: "Nothing is booked; Retry uses the same key", faults: { confirmFailures: 1 } },
  { id: "search", label: "Flight search keeps failing", detail: "3 attempts, then Failed with Retry", faults: { searchFailures: 3 } },
  { id: "noflights", label: "No flights on the route", detail: "Until switched off", faults: { noFlights: true } },
];

export const EXAMPLES: { label: string; text: string }[] = [
  { label: "Salmon to São Paulo", text: "Ship 10 boxes of fresh salmon, 25 kg each, 35x40x60 cm, chilled, from Buenos Aires to São Paulo, pick up on Nov 11, deliver by Friday, budget of USD 1,200" },
  { label: "Over budget", text: "Ship 10 boxes of fresh salmon, 25 kg each, 35x40x60 cm, chilled, from EZE to GRU, pick up on Nov 11, fastest, budget of USD 1,000" },
  { label: "Missing details", text: "Send 250 kg of auto parts to Santiago" },
  { label: "Too heavy", text: "Ship 2 crates of machinery, 1200 kg each, 100x100x100 cm, from EZE to MIA, pick up on Nov 12" },
  { label: "Lithium batteries", text: "Ship 3 boxes of lithium batteries, 18 kg each, 50x40x30 cm, from Córdoba to Lima, pick up on Nov 12" },
];

const delay = () => {
  const p = new URLSearchParams(window.location.search).get("agentDelay");
  return p !== null && !Number.isNaN(Number(p)) ? Number(p) : 450; // slow enough to watch each step
};

class AgentSession {
  readonly store = new GuardedStore();
  readonly ledger = new BookingLedger(this.store);
  readonly api: MockCarrierApi;
  agent: Agent;
  role: Role = "coordinator";
  /** Simulations switched on; each one is applied to the mock API when chosen */
  armed = new Set<string>();
  private listeners = new Set<() => void>();

  constructor() {
    const clock = prototypeClock();
    this.api = new MockCarrierApi(clock, this.ledger);
    const deps = { api: this.api, ledger: this.ledger, store: this.store, clock, delayMs: delay() };
    this.agent = Agent.restore(deps) ?? new Agent(deps);
    this.agent.subscribe(() => this.emit());
    // A booking in flight when the page reloaded is checked at once, before anything else
    if (this.agent.state.status === "status_unknown") void this.agent.run();
  }

  setRole(role: Role) {
    this.role = role;
    this.emit();
  }

  /** Arms a simulated problem on the mock API. Switching it off clears what's left of it. */
  toggle(id: string) {
    const sim = SIMULATIONS.find((s) => s.id === id)!;
    if (this.armed.has(id)) {
      this.armed.delete(id);
      for (const k of Object.keys(sim.faults) as (keyof Faults)[]) delete this.api.faults[k];
    } else {
      this.armed.add(id);
      Object.assign(this.api.faults, sim.faults);
    }
    this.emit();
  }

  /** Simulations are one-shot on the API: once spent, show them as off */
  sync() {
    for (const id of [...this.armed]) {
      const sim = SIMULATIONS.find((s) => s.id === id)!;
      const left = (Object.keys(sim.faults) as (keyof Faults)[]).some((k) => {
        const v = this.api.faults[k];
        return v !== undefined && v !== 0 && v !== false;
      });
      if (!left) this.armed.delete(id);
    }
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.sync();
    for (const fn of this.listeners) fn();
  }
}

let session: AgentSession | null = null;
export const agentSession = () => (session ??= new AgentSession());

/** Re-renders on every agent change (each tool call, answer, approval) */
export function useAgentSession() {
  const s = agentSession();
  const [, tick] = useReducer((n: number) => n + 1, 0);
  useEffect(() => s.subscribe(tick), [s]);
  return s;
}
