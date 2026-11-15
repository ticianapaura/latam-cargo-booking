/* CargoPilot agent · types.
   The agent is deterministic: rule-based interpretation, a state-based planner and mock tools.
   No language model is involved anywhere in src/agent. */

import type { Booking, DocId, UploadedFile } from "../proto/data.ts";

export const MOCK_LABEL = "Mock mode: rule-based, no language model";
export const SYNTHETIC_LABEL = "Synthetic flights and prices, generated for this prototype";

export type Actor = "user" | "manager" | "agent" | "system";
export type Role = "coordinator" | "manager";

/** Where a shipment field's value came from, so the UI can show and the user can correct it */
export type Source = "message" | "default" | "user" | "form";

export type Field<T> = { value: T; source: Source };

/** What the user wants shipped. Every field is optional until the user or a default provides it. */
export type Shipment = {
  cargoType?: Field<string>;
  description?: Field<string>;
  pieces?: Field<number>;
  weightPerPiece?: Field<number>;
  /** A total weight read from the goal before the number of pieces is known */
  totalWeight?: Field<number>;
  weightUnit?: Field<"kg" | "lb">;
  dims?: Field<{ h: number; w: number; l: number }>;
  dimUnit?: Field<"cm" | "in">;
  handling?: Field<string[]>;
  originAirport?: Field<string>;
  destAirport?: Field<string>;
  pickupDate?: Field<string>; // yyyy-mm-dd
  pickupTime?: Field<string>; // HH:MM
  pickupAddress?: Field<string>;
  originPostal?: Field<string>;
  deliveryAddress?: Field<string>;
  destPostal?: Field<string>;
  docs?: Field<Partial<Record<DocId, UploadedFile | null>>>;
};
export type ShipmentKey = keyof Shipment;

/** The goal around the shipment: constraints the agent optimizes for */
export type Constraints = {
  /** Latest arrival, as an ISO date and time ("before Friday" = Friday 00:00) */
  deadline?: Field<string>;
  budgetUsd?: Field<number>;
  priority?: Field<"fastest" | "cheapest" | "balanced">;
};

export type Question = {
  id: string;
  field: ShipmentKey | keyof Constraints;
  text: string;
  /** Suggested answers, e.g. the airports of an ambiguous city. Never pre-selected. */
  options?: { value: string; label: string }[];
  reason: "missing" | "ambiguous" | "conflict";
};

export type Flight = {
  id: string;
  flightNo: string;
  origin: string;
  dest: string;
  departs: string; // ISO; the prototype has no time zones
  /** Landing at the destination airport */
  arrives: string;
  /** Estimated delivery at the address: landing plus the road leg. What a deadline is checked against. */
  deliveredBy: string;
  /** Hours from departure to estimated delivery */
  transitHours: number;
  /** Hours in the air, including any connection */
  flightHours: number;
  stops: number;
  service: "Express" | "Standard" | "Economy";
  capacityKg: number;
  /** Space is held until this time; after it the flight must be searched again */
  availableUntil: string;
  synthetic: true;
};

export type Quote = {
  id: string;
  flightId: string;
  currency: "USD";
  chargeableKg: number;
  lines: { label: string; amount: number }[];
  total: number;
  validUntil: string;
  synthetic: true;
};

export type Exception = {
  id: string;
  kind: "budget" | "deadline";
  /** Who can approve it: a budget overrun needs the Manager; a late arrival needs the user's acceptance */
  approver: Role;
  text: string;
};

export type Option = {
  flight: Flight;
  quote: Quote;
  rank: number;
  recommended: boolean;
  reasons: string[];
  /** For an option that isn't recommended: why, in one sentence */
  whyNot?: string;
  tradeoffs: string[];
  exceptions: Exception[];
  /** Facts that came from a tool versus estimates the agent made */
  verified: string[];
  estimated: string[];
};

export type Restriction = {
  code: string;
  kind: "hard" | "specialist" | "documents";
  text: string;
  fix?: string;
  /** A fix the user can apply in one click (e.g. EZE instead of MDZ). Never applied without the user. */
  suggestion?: { field: ShipmentKey; value: string; label: string };
};

export type Proposal = {
  id: string;
  version: number;
  /** Hash of everything the user approves: shipment, flight, price, conditions. Excludes quote expiry. */
  termsHash: string;
  shipment: Shipment;
  option: Option;
  conditions: string[];
  createdAt: string;
  /** What changed against the previous version, shown on the approval card */
  changes: string[];
};

export type Approval = {
  id: string;
  kind: "booking" | "exception";
  exceptionId?: string;
  by: Role;
  proposalId: string;
  version: number;
  termsHash: string;
  at: string;
};

export type BookingRecord = {
  bookingId: string;
  awb: string;
  idempotencyKey: string;
  proposalId: string;
  version: number;
  total: number;
  flightNo: string;
  createdAt: string;
};

export type TaskId = "interpret" | "validate" | "restrictions" | "search" | "rates" | "compare" | "draft" | "approval" | "confirm";
export type TaskStatus = "pending" | "running" | "done" | "failed" | "needs_user" | "needs_manager" | "blocked" | "skipped" | "unknown";
export type Task = { id: TaskId; label: string; level: "L3" | "L1" | "L2" | "L0"; status: TaskStatus; detail?: string };

export type AgentStatus =
  | "idle" // no goal yet
  | "running"
  | "paused"
  | "needs_user" // questions to answer
  | "blocked" // a hard restriction; only a changed shipment clears it
  | "handoff" // dangerous goods or live animals: manual form
  | "needs_manager" // a commercial exception waits for the Manager
  | "awaiting_approval" // the booking proposal waits for the user
  | "booking" // confirmBooking in flight
  | "status_unknown" // a booking attempt timed out and its status couldn't be checked
  | "confirmed"
  | "failed" // a tool kept failing; Retry is offered
  | "cancelled";

export type LogEntry = {
  seq: number;
  at: string;
  actor: Actor;
  type: "goal" | "answer" | "edit" | "tool_call" | "tool_result" | "tool_error" | "decision" | "approval" | "rejection" | "invalidation" | "control" | "denied";
  summary: string;
  tool?: ToolName;
  level?: string;
  input?: unknown;
  output?: unknown;
  proposalId?: string;
  version?: number;
  approvalId?: string;
  idempotencyKey?: string;
};

export type ToolName =
  | "validateShipment"
  | "checkCargoRestrictions"
  | "searchAvailableFlights"
  | "retrieveFreightRates"
  | "compareShippingOptions"
  | "prepareBookingDraft"
  | "confirmBooking"
  | "getBookingStatus";

export type AgentState = {
  schema: 1;
  id: string;
  mode: "mock";
  goalText: string;
  shipment: Shipment;
  constraints: Constraints;
  questions: Question[];
  /** What the message said that couldn't be used, shown to the user (not only logged) */
  warnings?: string[];
  restrictions: Restriction[];
  status: AgentStatus;
  /** Status before a pause, to resume where it was */
  pausedFrom?: AgentStatus;
  statusText: string;
  flights: Flight[];
  quotes: Quote[];
  options: Option[];
  selectedFlightId?: string;
  /** Who chose it: "user" (Use this option instead) or "agent" (the recommendation, taken as the default) */
  selectedBy?: "user" | "agent";
  proposal?: Proposal;
  approvals: Approval[];
  rejectedFlightIds: string[];
  booking?: BookingRecord;
  /** Set when a booking attempt starts; reused for every retry of that proposal version */
  idempotencyKey?: string;
  attempts: Partial<Record<ToolName, number>>;
  failedTool?: ToolName;
  log: LogEntry[];
  seq: number;
};

export type { Booking };
