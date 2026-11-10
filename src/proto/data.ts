/* Booking data, options and validation rules for the interactive prototype.
   The rules and copy match the error states designed in the case study. */

export type Booking = {
  // Step 1 · cargo type
  cargoType: string;
  description: string;
  pieces: string;
  weight: string;
  weightUnit: "kg" | "lb";
  height: string;
  width: string;
  length: string;
  dimUnit: "cm" | "in";
  handling: string[];
  instructions: string;
  // Step 2 · route and dates
  originCountry: string;
  originAirport: string;
  pickupAddress: string;
  originPostal: string;
  destCountry: string;
  destAirport: string;
  deliveryAddress: string;
  destPostal: string;
  pickupDate: string; // yyyy-mm-dd
  pickupTime: string; // HH:MM, 24 h
  // Step 3 · documents: file name and size in MB, or null
  docs: Record<DocId, UploadedFile | null>;
  // Step 4 · review
  accepted: boolean;
};

export type UploadedFile = { name: string; mb: number; error?: string };
export type DocId = "invoice" | "packing" | "health" | "origin";

/** "Today" inside the prototype, so the sample booking stays valid whenever the demo is opened. */
export const TODAY = "2026-11-09";

export const CARGO_TYPES = [
  { value: "General cargo", hint: "Boxes, parts and goods with no special handling" },
  { value: "Perishables", hint: "Food and flowers that need temperature control" },
  { value: "Pharmaceuticals", hint: "Medicines and vaccines, temperature controlled" },
  { value: "Dangerous goods", hint: "Batteries, chemicals and other regulated items" },
  { value: "Live animals", hint: "Pets and livestock, with their own care rules" },
  { value: "Valuables", hint: "High-value items that need a security escort" },
];

export const HANDLING = ["Chilled 2–8 °C", "Frozen −18 °C", "Fragile", "This side up", "Do not stack", "Security escort"];

export type Airport = { code: string; name: string; city: string; country: string; international: boolean };

export const AIRPORTS: Airport[] = [
  { code: "EZE", name: "Ezeiza – Ministro Pistarini", city: "Buenos Aires", country: "Argentina", international: true },
  { code: "AEP", name: "Aeroparque Jorge Newbery", city: "Buenos Aires", country: "Argentina", international: false },
  { code: "COR", name: "Ingeniero Taravella", city: "Córdoba", country: "Argentina", international: true },
  { code: "MDZ", name: "El Plumerillo", city: "Mendoza", country: "Argentina", international: false },
  { code: "GRU", name: "Guarulhos", city: "São Paulo", country: "Brazil", international: true },
  { code: "VCP", name: "Viracopos", city: "Campinas", country: "Brazil", international: true },
  { code: "GIG", name: "Galeão", city: "Rio de Janeiro", country: "Brazil", international: true },
  { code: "SCL", name: "Arturo Merino Benítez", city: "Santiago", country: "Chile", international: true },
  { code: "LIM", name: "Jorge Chávez", city: "Lima", country: "Peru", international: true },
  { code: "MIA", name: "Miami International", city: "Miami", country: "United States", international: true },
];

export const COUNTRIES = [...new Set(AIRPORTS.map((a) => a.country))];

export const PICKUP_TIMES = Array.from({ length: 33 }, (_, i) => {
  const mins = 6 * 60 + i * 30; // 6:00 AM to 10:00 PM
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

export const DOCS: { id: DocId; name: string; detail: string; optional?: boolean }[] = [
  { id: "invoice", name: "Commercial invoice", detail: "Value and description of the goods" },
  { id: "packing", name: "Packing list", detail: "Pieces, weights and dimensions" },
  { id: "health", name: "Health certificate", detail: "Issued by the origin health authority" },
  { id: "origin", name: "Certificate of origin", detail: "May reduce duties at destination", optional: true },
];
export const MAX_MB = 10;

export const FILLED: Booking = {
  cargoType: "Perishables",
  description: "Fresh salmon in insulated boxes",
  pieces: "10",
  weight: "25",
  weightUnit: "kg",
  height: "35",
  width: "40",
  length: "60",
  dimUnit: "cm",
  handling: ["Chilled 2–8 °C", "This side up"],
  instructions: "",
  originCountry: "Argentina",
  originAirport: "EZE",
  pickupAddress: "Ruta 205 km 32, Parque Industrial",
  originPostal: "1804",
  destCountry: "Brazil",
  destAirport: "GRU",
  deliveryAddress: "Rua Dr. Assis 410, Guarulhos",
  destPostal: "07190-100",
  pickupDate: "2026-11-11",
  pickupTime: "10:00",
  docs: {
    invoice: { name: "invoice_salmon_1234.pdf", mb: 1.2 },
    packing: { name: "packing_list_1234.pdf", mb: 0.6 },
    health: { name: "health_cert_senasa.pdf", mb: 2.1 },
    origin: null,
  },
  accepted: true,
};

export const EMPTY_STEP1: Partial<Booking> = {
  cargoType: "", description: "", pieces: "", weight: "", height: "", width: "", length: "", handling: [], instructions: "",
};

/** The values behind the "Step 1 with errors" screen of the case study */
export const INVALID_STEP1: Partial<Booking> = {
  cargoType: "Perishables",
  description: "Sa",
  pieces: "2.5",
  weight: "1200",
  height: "250",
  width: "40",
  length: "60",
  handling: ["Chilled 2–8 °C", "Frozen −18 °C"],
  instructions:
    "Keep the cold chain at all times. The consignee receives Monday to Friday, 8 AM to 5 PM; outside those hours, coordinate with site security first.",
};

/** The values behind the "Step 2 with errors" screen of the case study */
export const INVALID_STEP2: Partial<Booking> = {
  originAirport: "MDZ",
  pickupAddress: "No-number street",
  originPostal: "55",
  pickupDate: "2026-11-02",
  pickupTime: "23:30",
};

/* ---------- validation ---------- */

export type Errors = Partial<Record<string, string>>;
export const INSTR_MAX = 160;

const num = (s: string) => Number(s.replace(",", "."));

export function step1Errors(b: Booking): Errors {
  const e: Errors = {};
  if (!b.cargoType) e.cargoType = "Choose the type of cargo.";
  if (b.description.trim().length < 3) e.description = "Use at least 3 characters to describe the cargo.";
  if (!b.pieces) e.pieces = "Enter how many pieces you're sending.";
  else if (!/^\d+$/.test(b.pieces.trim()) || num(b.pieces) < 1) e.pieces = "Use a whole number, no decimals. For example, 10.";
  const kg = toKg(b);
  if (!b.weight) e.weight = "Enter the weight of one piece.";
  else if (!(kg > 0)) e.weight = "Use a number, like 25.";
  else if (kg > 1000) e.weight = "Each piece can weigh up to 1,000 kg. Split it into more pieces or contact us for heavy cargo.";
  const dims = [b.height, b.width, b.length];
  const cm = (s: string) => num(s) * (b.dimUnit === "in" ? 2.54 : 1);
  if (dims.some((d) => !d)) e.dims = "Enter height, width and length.";
  else if (dims.some((d) => !(num(d) > 0))) e.dims = "Use numbers for every dimension.";
  else if (cm(b.height) > 244) e.dims = "The hold's maximum height is 244 cm. Lower the height or split the cargo.";
  if (b.handling.includes("Chilled 2–8 °C") && b.handling.includes("Frozen −18 °C"))
    e.handling = "Choose Chilled or Frozen, not both. The cargo can only travel at one temperature.";
  if (b.instructions.length > INSTR_MAX)
    e.instructions = `${b.instructions.length - INSTR_MAX} characters over the limit. Keep what the crew needs to know.`;
  return e;
}

export const STEP1_SUMMARY: Record<string, string> = {
  cargoType: "Cargo type",
  description: "Cargo description",
  pieces: "Number of pieces",
  weight: "Weight per piece",
  dims: "Dimensions",
  handling: "Handling requirements",
  instructions: "Additional instructions",
};

export function step1Ready(b: Booking) {
  return !!(b.cargoType && b.description && b.pieces && b.weight && b.height && b.width && b.length);
}

const POSTAL: Record<string, { re: RegExp; example: string; name: string }> = {
  Argentina: { re: /^(\d{4}|[A-Z]\d{4}[A-Z]{3})$/i, example: "1804 or B1804ABC", name: "Argentine" },
  Brazil: { re: /^\d{5}-?\d{3}$/, example: "07190-100", name: "Brazilian" },
  Chile: { re: /^\d{7}$/, example: "8320000", name: "Chilean" },
  Peru: { re: /^\d{5}$/, example: "15001", name: "Peruvian" },
  "United States": { re: /^\d{5}(-\d{4})?$/, example: "33126", name: "US" },
};
export const postalExample = (country: string) => POSTAL[country]?.example ?? "";

export function step2Errors(b: Booking): Errors {
  const e: Errors = {};
  const o = airport(b.originAirport);
  const d = airport(b.destAirport);
  const international = !!o && !!d && o.country !== d.country;
  if (!o) e.originAirport = "Choose the origin airport.";
  else if (international && !o.international)
    e.originAirport = `${o.city} (${o.code}) handles domestic cargo only. For international shipments, use EZE.`;
  if (!d) e.destAirport = "Choose the destination airport.";
  else if (o && d && o.code === d.code) e.destAirport = "Origin and destination can't be the same airport.";
  else if (international && !d.international) e.destAirport = `${d.city} (${d.code}) handles domestic cargo only.`;
  if (!/\d/.test(b.pickupAddress) || b.pickupAddress.trim().length < 5)
    e.pickupAddress = "Include street and number, for example “1234 Corrientes Ave.”";
  if (!/\d/.test(b.deliveryAddress) || b.deliveryAddress.trim().length < 5)
    e.deliveryAddress = "Include street and number, for example “410 Rua Dr. Assis”.";
  const op = POSTAL[b.originCountry];
  if (op && !op.re.test(b.originPostal.trim()))
    e.originPostal = `This postal code doesn’t look right. It should look like ${op.example}.`;
  const dp = POSTAL[b.destCountry];
  if (dp && !dp.re.test(b.destPostal.trim()))
    e.destPostal = `This postal code doesn’t look right. It should look like ${dp.example}.`;
  if (!b.pickupDate) e.pickupDate = "Choose a pickup date.";
  else if (b.pickupDate < TODAY) e.pickupDate = "The pickup date can't be earlier than today.";
  if (!PICKUP_TIMES.includes(b.pickupTime)) e.pickupTime = "We pick up between 6 AM and 10 PM.";
  return e;
}

export const STEP2_SUMMARY: Record<string, string> = {
  originAirport: "Origin airport",
  pickupAddress: "Pickup address",
  originPostal: "Origin postal code",
  destAirport: "Destination airport",
  deliveryAddress: "Delivery address",
  destPostal: "Destination postal code",
  pickupDate: "Pickup date",
  pickupTime: "Pickup time",
};

export function docErrors(b: Booking): Errors {
  const e: Errors = {};
  for (const d of DOCS) {
    const f = b.docs[d.id];
    if (f?.error) e[d.id] = f.error;
    else if (!f && !d.optional) e[d.id] = "Attach this document to continue.";
  }
  return e;
}

/* ---------- derived values ---------- */

export const airport = (code: string) => AIRPORTS.find((a) => a.code === code);

export function toKg(b: Booking) {
  const w = num(b.weight);
  return b.weightUnit === "lb" ? w * 0.4536 : w;
}

export function totalKg(b: Booking) {
  const p = num(b.pieces);
  const kg = toKg(b);
  return p > 0 && kg > 0 ? Math.round(p * kg * 10) / 10 : 0;
}

export function volumetricKg(b: Booking) {
  const f = b.dimUnit === "in" ? 2.54 : 1;
  const v = num(b.height) * f * num(b.width) * f * num(b.length) * f;
  const p = num(b.pieces);
  return v > 0 && p > 0 ? Math.round((v / 6000) * p) : 0;
}

export function rate(b: Booking) {
  const kg = Math.max(totalKg(b), volumetricKg(b));
  const freight = kg * 2.6;
  const special = ["Perishables", "Pharmaceuticals"].includes(b.cargoType) ? freight * 0.15 : 0;
  const fuel = kg * 0.45;
  const security = kg * 0.15;
  return { kg, freight, special, fuel, security, total: freight + special + fuel + security };
}

export const usd = (n: number) => `USD ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const kgText = (n: number) => `${n.toLocaleString("en-US")} kg`;

export function fmtDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function fmtTime(hhmm: string) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export function deliveryEstimate(b: Booking) {
  if (!b.pickupDate) return "";
  const [y, m, d] = b.pickupDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d + 2);
  return `${dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · 2:00 PM`;
}

export const placeName = (code: string) => {
  const a = airport(code);
  return a ? `${a.city} (${a.code})` : "";
};

/* ---------- bookings list and search ---------- */

export type Row = { id: string; status: "Confirmed" | "In transit" | "Delivered" | "Cancelled" | "Draft"; sub: string; cargo: string; route: string; awb: string; action: string };

export const BOOKINGS: Row[] = [
  { id: "#1235", status: "Confirmed", sub: "Pickup Nov 11 · tracking starts then", cargo: "Perishables · Fresh salmon", route: "EZE → GRU", awb: "045-38216074", action: "View booking" },
  { id: "#1234", status: "In transit", sub: "Flight LA8045", cargo: "Perishables · Fresh salmon", route: "EZE → GRU", awb: "045-12345678", action: "Track" },
  { id: "#1229", status: "Delivered", sub: "Oct 18, 2026", cargo: "General cargo · Auto parts", route: "SCL → MIA", awb: "045-12298811", action: "View" },
  { id: "#1221", status: "Cancelled", sub: "By you · Oct 2, 2026", cargo: "Pharmaceuticals · Vaccines", route: "EZE → LIM", awb: "—", action: "View" },
];

/** Bookings that exist but belong to another company account */
export const OTHER_ACCOUNT = ["#1198", "045-11980042"];

export type SearchResult =
  | { kind: "recent" }
  | { kind: "suggest"; rows: Row[] }
  | { kind: "match"; row: Row }
  | { kind: "noaccess"; q: string }
  | { kind: "none"; q: string; hint: string };

export function search(qRaw: string, submitted: boolean): SearchResult {
  const q = qRaw.trim();
  if (!q) return { kind: "recent" };
  const norm = q.replace(/\s/g, "").toLowerCase();
  const bare = norm.replace(/^#/, "");
  const rows = BOOKINGS.filter((r) => r.awb !== "—" && (r.id.slice(1).startsWith(bare) || r.awb.replace("-", "").startsWith(bare.replace("-", ""))));
  const exact = BOOKINGS.find((r) => r.id.toLowerCase() === "#" + bare || r.awb === norm || r.awb.replace("-", "") === bare);
  if (exact && (submitted || exact.awb === norm)) return { kind: "match", row: exact };
  if (OTHER_ACCOUNT.some((o) => o.toLowerCase().replace("-", "") === bare.replace("-", "") || o === "#" + bare)) return submitted ? { kind: "noaccess", q } : { kind: "suggest", rows: [] };
  if (rows.length && !submitted) return { kind: "suggest", rows };
  if (exact) return { kind: "match", row: exact };
  if (!submitted) return { kind: "suggest", rows: [] };
  const digits = bare.replace(/\D/g, "");
  const hint = /^\d{3}-?\d/.test(bare) && digits.length !== 11
    ? `AWB numbers have 11 digits, like 045-12345678. You entered ${digits.length}. You can also search by booking number, like #1234.`
    : "Check the number, or search by booking number, like #1234, or AWB, like 045-12345678.";
  return { kind: "none", q, hint };
}
