# CargoPilot AI · Booking flows

Playable front end of a five-step **air cargo booking flow** for CargoPilot AI, a fictional product: the happy path, inline errors on every step, interruptions, tracking exceptions and search. Built in React + TypeScript from my design case study.

**[▶ Live demo](https://ticianapaura.github.io/latam-cargo-booking/)** · [Case study on Behance](https://www.behance.net/ticianne) · [Portfolio](https://ticianapaura.github.io/)

> **Concept project.** CargoPilot AI is a fictional brand. Flights (CP…), air waybills (000-…), prices and bookings are synthetic. The design case study it comes from was made for LATAM Cargo; this prototype is not affiliated with LATAM Airlines Group.
>
> **Mock mode, no AI features yet.** "AI" is part of the concept's name. The agent path is being added step by step: try it from New booking → **Plan with CargoPilot**. It runs on fixed rules and synthetic data, with no language model, and the page says so.

## Two different kinds of AI in this project

Keep these apart when reading the repo or the case study:

| | What it is | Status |
| --- | --- | --- |
| **AI-assisted development** | I designed the screens and wrote this front end with an AI assistant (Claude): the design canvas, the generated screens, the React code and the tests. | Done. It's how the project was made, not a feature of the product. |
| **CargoPilot's agent** | A feature of the fictional product: an agent that plans a booking, calls tools, asks for approval and books. | In progress. The core (`src/agent/`) and its page are built and tested; bookings don't reach My bookings or tracking yet. Mock mode only: fixed rules and synthetic data, no language model. Nothing here is LLM-powered until a model is actually integrated, and the README will say so when it is. |

## Known issues

- [#1](https://github.com/ticianapaura/latam-cargo-booking/issues/1) Map tab on tracking doesn't advance the flow from step 8 to 9. Must be fixed before the final case study.

## How to navigate

The demo opens on an **index of every flow**. Pick one and follow it screen by screen:

- **Every screen is interactive.** Type in the fields, open the dropdowns, toggle the handling chips, attach real files, search bookings, switch tabs and use the menu. Validation, totals, the booking summary and the rate update live.
- Click the **highlighted button** on the screen, use **Next**, or press **← →** to move through the flow.
- If you click your way somewhere the flow doesn't cover, you keep exploring the live app, with a link back to the scripted step.
- The left column lists every screen in the flow and explains what the user sees.
- **All flows** (or **Esc**) takes you back to the index at any point, so you can try another branch.
- Every screen has its own link, so you can share an exact step.

## Index of flows

The happy path runs first. Every other flow branches off it at the step where something can go wrong, and shows how the user gets back on track.

### 1. Happy path

A new booking from the first empty step to live tracking, with nothing going wrong.

| Flow | What happens | Screens |
|---|---|---|
| [New booking, start to finish](https://ticianapaura.github.io/latam-cargo-booking/#/flow/happy-path/1) | Five booking steps, then My bookings and tracking on details and map. | Cargo type · empty → Cargo type · ready → Route and dates → Documents → Review → Confirmation → My bookings → Tracking · details → Tracking · map |

### 2. Invalid data on each step

What happens when the user saves a step with something wrong, and how they get back on track.

| Flow | What happens | Screens |
|---|---|---|
| [Step 1 · Cargo type errors](https://ticianapaura.github.io/latam-cargo-booking/#/flow/cargo-type-errors/1) | Saving Step 1 with invalid fields, then fixing them. | Cargo type · empty → Error summary → Cargo type · ready → Route and dates |
| [Step 2 · Route and date errors](https://ticianapaura.github.io/latam-cargo-booking/#/flow/route-errors/1) | An airport, date or postal code that doesn't work together. | Route errors → Route and dates → Documents |
| [Step 3 · File too big and offline](https://ticianapaura.github.io/latam-cargo-booking/#/flow/documents-errors/1) | A certificate over the size limit and a lost connection. | File too big, offline → Documents → Review |
| [Step 4 · No space and new rate](https://ticianapaura.github.io/latam-cargo-booking/#/flow/review-changed/1) | The flight filled up and the rate changed while the user was booking. | Flight full, rate changed → Review → Confirmation |
| [Step 5 · Booked with pending documents](https://ticianapaura.github.io/latam-cargo-booking/#/flow/pending-documents/1) | The booking goes through, but some documents are still missing. | Review → Pending documents → My bookings |

### 3. Interruptions while booking

Leaving halfway, a failed save and an expired session. The draft is never lost.

| Flow | What happens | Screens |
|---|---|---|
| [Leaving mid-booking](https://ticianapaura.github.io/latam-cargo-booking/#/flow/leave-with-changes/1) | The user tries to leave Step 1 with unsaved changes. | Cargo type · ready → Leave dialog → Draft in My bookings |
| [Save fails on our side](https://ticianapaura.github.io/latam-cargo-booking/#/flow/save-error/1) | Step 2 can't be saved because of a problem on our end. | Route and dates → Save error → Documents |
| [Session expired](https://ticianapaura.github.io/latam-cargo-booking/#/flow/session-expired/1) | 30 minutes without activity on Step 3. | Documents → Session expired → Documents |

### 4. Tracking exceptions

After booking: customs holds, delays and silence from the carrier.

| Flow | What happens | Screens |
|---|---|---|
| [Held at customs](https://ticianapaura.github.io/latam-cargo-booking/#/flow/held-at-customs/1) | The cargo is stopped and the user has to act. | My bookings → Held at customs |
| [Flight delayed](https://ticianapaura.github.io/latam-cargo-booking/#/flow/flight-delayed/1) | The flight leaves late and the arrival time changes. | Tracking · details → Delayed |
| [No updates for 14 hours](https://ticianapaura.github.io/latam-cargo-booking/#/flow/no-updates/1) | No scans for a long time, which is normal during the flight. | Tracking · details → No updates |

### 5. Search a booking

Finding an existing booking by booking number or AWB.

| Flow | What happens | Screens |
|---|---|---|
| [Find a booking by number or AWB](https://ticianapaura.github.io/latam-cargo-booking/#/flow/search-booking/1) | From an empty search bar to the booking's tracking. | Search · default → Search · recent → Search · typing → Search · exact match → Tracking · details |

### 6. Search edge cases

No results, someone else's booking and no connection.

| Flow | What happens | Screens |
|---|---|---|
| [No results](https://ticianapaura.github.io/latam-cargo-booking/#/flow/search-no-results/1) | An incomplete AWB, explained, with a way back. | Search · loading → No results → Exact match |
| [Booking from another account](https://ticianapaura.github.io/latam-cargo-booking/#/flow/search-no-access/1) | The booking exists, but the user can't see it. | Search · recent → No access |
| [Search with no connection](https://ticianapaura.github.io/latam-cargo-booking/#/flow/search-offline/1) | The search can't run, but recent bookings still work. | Offline → Search · recent |

## How it's built

- **React 19 + TypeScript**, bundled with **esbuild** into `assets/`, so GitHub Pages serves the repo root with no build step on the server.
- **The live app** (`src/proto/`) is a working version of the booking: real form controls (an accessible dropdown with keyboard support, unit selectors, chips, text areas with a character counter, date picker, file upload), the validation rules and error copy from the case study, a live booking summary and rate, the header search with suggestions, loading, no results, no access and offline, the "Leave this booking?" guard and My bookings filters.
- **Flows** (`src/flows.tsx`) are plain data: each step opens a page of the live app with a preset of data and state (for example, Step 1 with the invalid values that trigger the error summary). Navigating inside the app moves the flow along when that page is part of it. Adding a flow means adding an entry, and it shows up in the index automatically.
- **Design screens** (`src/screens/`) are generated from the design canvas with `tools/convert.py`, which also applies the CargoPilot AI brand (mark, name, flight and AWB codes), so the original LATAM Cargo canvas stays untouched. The tracking screens and two edge cases (flight full, session expired) are shown from there, wired to the menu and tabs.
- **Routing** uses the URL hash (`#/flow/<id>/<step>`), so every screen has a shareable link and the browser's back button works.
- `?embed=1` plays an autoplay reel of the key screens, used for the preview in my portfolio.

```
src/
  main.tsx          entry point
  App.tsx           index of flows, flow player, routing, embed reel
  flows.tsx         every flow, grouped like the flow map
  brand.tsx         the CargoPilot AI mark (fictional brand)
  proto/            the live booking app
    data.ts         booking data, options, validation rules, rate and search
    ui.tsx          shell, stepper, fields, dropdown, chips, summary
    SearchBar.tsx   header search and its states
    pages/          one page per screen
  screens/          screens generated from the design canvas
  styles.css        app shell styles
tools/
  build.mjs         esbuild bundle (build and dev server)
  convert.py        design canvas → React components
```

## Plan with CargoPilot (the agent page)

Open any flow, then **New booking** (a strip above Step 1) or **My bookings** → **Plan with CargoPilot**. The form stays the default way to book; the agent is offered next to it.

The page follows the layout validated in the spec: the work in one column, in the order it happens, and a sticky panel in the same 330 px slot as the form's Booking summary.

- **Goal first.** Describe the shipment in a sentence, or pick an example. Before anything runs, four steps say what will happen on its own and what waits for you.
- **What CargoPilot read.** One summary line; open it to see every value with where it came from (your message, a default, you) and correct it in place. A correction re-plans from the first step it affects.
- **The plan.** Nine steps, each tagged *Automatic*, *You choose* or *Needs approval*. Each question, restriction, option list and approval appears under the step that raised it. Finished steps collapse to a line; *Details* shows the tool, its input, result and calls.
- **Options** show why the recommended one was picked, departure and arrival, door-to-door time (marked as an estimate), price with its breakdown, restrictions checked, trade-offs against the others, and what came from a tool versus what's estimated. While a proposal waits for approval they step back to one line each.
- **Approval** is an amber card for one exact proposal version: what changed since the previous version and whether an earlier approval stopped counting, a late arrival to accept explicitly, and *Approve and book*. Nothing is booked before that click.
- **Manager (simulated).** *Viewing as* in the header switches to the Logistics Manager, who approves or rejects going over budget and nothing else: not the booking, not a hard restriction.
- **Recovery.** Blocked shipments explain that no one can approve them and offer the fix; dangerous goods and live animals explain why and hand everything known to the form; failures keep your progress and offer Retry; an unknown booking status says so plainly, hides Cancel and re-sends nothing.
- **Control.** Pause (while it works or waits for the Manager), Cancel with a confirmation, and *Continue in the form* are always in the panel. The activity log is one click away, closed by default.
- **Prototype controls** at the bottom of the panel make a problem happen once (price rise, released space, timeouts, a refusal, a failing search, no flights), to review every recovery path. They exist only in this prototype.

Not yet: a booking made here doesn't appear in My bookings, Confirmation or Tracking (next increment), and the agent scenarios aren't flows in the index yet.

## The agent core (mock mode)

`src/agent/` is the agent behind the upcoming "Book with the agent" path. **It is deterministic: rule-based reading of the goal, a state-based planner and mock tools. No language model is called anywhere.** It isn't wired into the app's screens yet.

- **State-based planning.** The planner looks at the current state and picks the next tool; it doesn't follow a script. Each tool's result is remembered against its inputs, so an answer, an edit or a new price re-runs that tool and everything after it, and nothing before it.
- **Eight tools, two autonomy levels, enforced in code.** `validateShipment`, `checkCargoRestrictions`, `searchAvailableFlights`, `retrieveFreightRates`, `compareShippingOptions`, `prepareBookingDraft` and `getBookingStatus` run on their own (L3: read or prepare, never binding). `confirmBooking` (L2) only runs when the policy finds a current approval for the exact proposal. Every call goes through `policy.authorize()` first, whatever the planner wanted.
- **Hard restrictions versus commercial exceptions.** Two separate lists. Hard restrictions (a piece over 1,000 kg or 244 cm, Chilled with Frozen, a domestic-only airport on an international route, a past date, pickup hours, the same airport twice) block for everyone and have no approval path, the Manager included: only a changed shipment clears them. Commercial exceptions can be approved by the role named on each: going over budget needs the Logistics Manager; arriving after the deadline needs the user's acceptance.
- **Dangerous goods and live animals** are handed to the manual form with an explanation of why a specialist is needed and every field known so far, with nothing invented. The form keeps applying its own hard limits.
- **Proposals are versioned.** Each one has an id, a version and a hash of its terms (shipment, flight, price lines, exceptions, conditions). An approval is tied to all three, so a rejection, an edit, a new price or released space makes a new version that needs approval again, and the earlier approval stops counting. A re-quote at the same price keeps the approval. Attached documents are checked again at confirmation; they aren't part of the terms.
- **Idempotent booking.** The key is one per proposal version (`BK-<proposal>-v<version>`), and the mock ledger returns the same booking for the same key, so a double click or a retry can't book twice.
- **Error recovery.** Read-only tools are tried 3 times, then the task is marked Failed with Retry. If a booking times out, the agent checks its status before anything else; if the status can't be checked either, it stays "status unknown" and nothing is re-sent. A changed price or released space at confirmation goes back to the user for approval.
- **Session restoration.** State is saved after every step and restored on reload. Saved data is validated first; anything malformed is dropped. A run that was in progress comes back paused, and a booking that was in flight comes back as "status unknown", which makes the agent check before doing anything else.
- **Audit log.** Append-only and numbered: who acted (user, Manager, agent, system), each tool call and its result with its autonomy level, approvals with their proposal version and id, invalidations, refusals, and the idempotency key of every booking attempt.
- **Fault injection.** The mock carrier API can fail searches or rates, return no flights, raise the price or release the space at confirmation, refuse or time out a booking (with or without it going through), and fail the status check, so every recovery path can be rehearsed.

### Session storage limitations

The agent's state and the mock booking ledger live in the tab's `sessionStorage`. That's enough for a prototype, but:

- It belongs to **one tab**. Another tab, another browser or another device starts from scratch, and duplicate-booking protection only works inside that tab. A real system checks idempotency keys on the server.
- It's **gone when the tab closes**.
- It **can be edited** in the browser's dev tools. Loaded data is validated and the terms hash catches an edited proposal, but nothing stored in a browser can be trusted the way a server can.
- It **can be unavailable** (a private window, blocked site data, a full quota). The agent then keeps working in memory and reports that it can't resume after a reload.

```
src/agent/
  types.ts        state, proposal, approval, log entry, the mock-mode labels
  interpret.ts    rule-based reading of the goal (where a language model could plug in later, server-side)
  policy.ts       autonomy levels, hard restrictions, commercial exceptions, terms hash, authorize()
  agent.ts        the planner, tool runner, approvals, recovery, pause/resume, save/restore, audit log
  mockApi.ts      synthetic carrier API with fault injection
  ledger.ts       mock bookings by idempotency key
  shipment.ts     the agent's shipment and its bridge to the booking form's data
  storage.ts      guarded session storage with an in-memory fallback
  util.ts         clock, hash, seeded random
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # writes assets/app.js and assets/app.css
```

## Tests

```bash
npm test             # both suites
npm run test:unit    # booking rules, and 34 agent scenarios (Node's test runner)
npm run test:e2e     # builds, then every step of all 16 flows and the agent page, in Chromium (Playwright)
```

The end-to-end suite needs Chromium once: `npx playwright install chromium`. It opens the built site straight from disk, so no server is needed.

The agent scenarios cover the success path; missing and ambiguous information (it asks, it never guesses); a hard restriction that no approval can clear; dangerous goods and live animals handed to the form with their data; no options; going over budget (Manager approval and rejection); a late arrival the user accepts; a price change and released space at confirmation; an expired quote; a rejection and an edit that re-plan and void the approval; failing tools and Retry; booking timeouts with and without a booking; duplicate confirmation; confirming without approval; missing documents; pause, reload and resume; a reload in the middle of a booking; corrupted saved state; and storage that isn't available.

On the agent page, the end-to-end suite covers the entry points and mock labels; a full booking from goal to AWB; a correction that re-plans; accepting a late arrival; over budget with the Manager; a hard restriction the Manager can't clear; dangerous goods handed to the form; a price change; an unknown booking status; a failing tool; pause, reload and resume; cancel; and a 1280 × 800 laptop screen.

What the end-to-end suite covers in the flows: every step of every flow opens without errors and highlights the button its note mentions; Next, Previous and the arrow keys; the Step 1 dropdown with mouse and keyboard, totals, errors that clear and Save and continue; the designed error states of Steps 1 and 2; attaching, rejecting and removing documents with Undo; accepting terms and Edit on Review; the leave dialog and the draft it keeps; search suggestions, no results, no access and exact match; tracking tabs; and the portfolio preview.

## Credits

Design and front end by [Ticiana Paura](https://ticianapaura.github.io/). Typefaces: Archivo and IBM Plex (Google Fonts).
