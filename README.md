# LATAM Cargo · New booking flows

Playable front end of a five-step **air cargo booking flow**: the happy path, inline errors on every step, interruptions, tracking exceptions and search. Built in React + TypeScript from my design case study.

**[▶ Live demo](https://ticianapaura.github.io/latam-cargo-booking/)** · [Case study on Behance](https://www.behance.net/ticianne) · [Portfolio](https://ticianapaura.github.io/)

> Concept project. Not affiliated with LATAM Airlines Group.

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
| [Leaving mid-booking](https://ticianapaura.github.io/latam-cargo-booking/#/flow/leave-with-changes/1) | The user tries to leave Step 1 with unsaved changes. | Cargo type · ready → Leave dialog → Cargo type · ready |
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
| [No results](https://ticianapaura.github.io/latam-cargo-booking/#/flow/search-no-results/1) | An incomplete AWB, explained, with a way back. | Search · loading → No results → Search · typing → Exact match |
| [Booking from another account](https://ticianapaura.github.io/latam-cargo-booking/#/flow/search-no-access/1) | The booking exists, but the user can't see it. | Search · recent → No access |
| [Search with no connection](https://ticianapaura.github.io/latam-cargo-booking/#/flow/search-offline/1) | The search can't run, but recent bookings still work. | Offline → Search · recent |

## How it's built

- **React 19 + TypeScript**, bundled with **esbuild** into `assets/`, so GitHub Pages serves the repo root with no build step on the server.
- **The live app** (`src/proto/`) is a working version of the booking: real form controls (an accessible dropdown with keyboard support, unit selectors, chips, text areas with a character counter, date picker, file upload), the validation rules and error copy from the case study, a live booking summary and rate, the header search with suggestions, loading, no results, no access and offline, the "Leave this booking?" guard and My bookings filters.
- **Flows** (`src/flows.tsx`) are plain data: each step opens a page of the live app with a preset of data and state (for example, Step 1 with the invalid values that trigger the error summary). Navigating inside the app moves the flow along when that page is part of it. Adding a flow means adding an entry, and it shows up in the index automatically.
- **Design screens** (`src/screens/`) are generated from the design canvas with `tools/convert.py`. The tracking screens and two edge cases (flight full, session expired) are shown from there, wired to the menu and tabs.
- **Routing** uses the URL hash (`#/flow/<id>/<step>`), so every screen has a shareable link and the browser's back button works.
- `?embed=1` plays an autoplay reel of the key screens, used for the preview in my portfolio.

```
src/
  main.tsx          entry point
  App.tsx           index of flows, flow player, routing, embed reel
  flows.tsx         every flow, grouped like the flow map
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

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # writes assets/app.js and assets/app.css
```

## Credits

Design and front end by [Ticiana Paura](https://ticianapaura.github.io/). Typefaces: Archivo and IBM Plex (Google Fonts).
