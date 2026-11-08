# LATAM Cargo · New booking flows

Playable front end of a five-step **air cargo booking flow**: the happy path, inline errors on every step, interruptions, tracking exceptions and search. Built in React + TypeScript from my design case study.

**[▶ Live demo](https://ticianapaura.github.io/latam-cargo-booking/)** · [Case study on Behance](https://www.behance.net/ticianne) · [Portfolio](https://ticianapaura.github.io/)

> Concept project. Not affiliated with LATAM Airlines Group.

## How to navigate

The demo opens on an **index of every flow**. Pick one and follow it screen by screen:

- Click the **highlighted button** on the screen, use **Next**, or press **← →**.
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
- **Screens** (`src/screens/`) are generated from the design canvas with `tools/convert.py`: every artboard becomes a typed React component with the same props as in the design (for example `<CargoType state="empty" />` or `<Tracking scenario="delay" />`). The canvas stays the single source of truth.
- **Flows** (`src/flows.tsx`) are plain data: each flow is a list of screens with a label, a note and the button that moves the user forward. Adding a flow means adding an entry, and it shows up in the index automatically.
- **Routing** uses the URL hash (`#/flow/<id>/<step>`), so every screen has a shareable link and the browser's back button works.
- `?embed=1` plays an autoplay reel of the key screens, used for the preview in my portfolio.

```
src/
  main.tsx        entry point
  App.tsx         index of flows, flow player, routing, embed reel
  flows.tsx       every flow, grouped like the flow map
  screens/        16 screens generated from the design canvas
  styles.css      app shell styles
tools/
  build.mjs       esbuild bundle (build and dev server)
  convert.py      design canvas → React components
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # writes assets/app.js and assets/app.css
```

## Credits

Design and front end by [Ticiana Paura](https://ticianapaura.github.io/). Typefaces: Archivo and IBM Plex (Google Fonts).
