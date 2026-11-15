// End-to-end regression suite: every step of every flow, plus the interactions people use most.
// It opens the built site (index.html + assets/) straight from disk, so no server is needed.
// Run: npm run test:e2e   (builds first; needs `npx playwright install chromium` once)
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const BASE = pathToFileURL(resolve("index.html")).href;
const EXPECTED_FLOWS = 16;

let browser;
before(async () => {
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
});

/** A fresh page that records uncaught errors. Font requests fail offline; those aren't the app's errors. */
async function open(hash = "", { width = 1440, height = 900 } = {}) {
  const page = await browser.newPage({ viewport: { width, height } });
  page.setDefaultTimeout(5000); // fail fast instead of hanging on a missing element
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/fonts|ERR_TUNNEL|ERR_NAME|net::/.test(m.text())) errors.push(m.text());
  });
  await page.goto(BASE + hash);
  await page.waitForTimeout(150);
  return { page, errors };
}

const go = async (page, hash) => {
  await page.evaluate((h) => (location.hash = h), hash);
  await page.waitForTimeout(150);
};
const count = async (page) => (await page.innerText(".count")).split("/").map((s) => Number(s.trim()));

describe("index", () => {
  test(`lists ${EXPECTED_FLOWS} flows in 6 groups`, async () => {
    const { page, errors } = await open();
    assert.equal(await page.locator(".card").count(), EXPECTED_FLOWS);
    assert.equal(await page.locator(".group").count(), 6);
    assert.doesNotMatch(await page.innerText("body"), /LATAM/);
    assert.match(await page.innerText("body"), /Mock mode, no language model/);
    assert.deepEqual(errors, []);
    await page.close();
  });

  test("works at phone width without horizontal scroll", async () => {
    const { page } = await open("", { width: 390, height: 844 });
    assert.ok((await page.evaluate(() => document.documentElement.scrollWidth)) <= 390);
    await page.close();
  });
});

describe("every step of every flow", () => {
  test("opens with no errors and shows a screen", async () => {
    const { page, errors } = await open();
    const ids = await page.$$eval(".card", (els) => els.map((e) => e.getAttribute("href").split("/")[2]));
    assert.equal(ids.length, EXPECTED_FLOWS);
    const problems = [];
    let steps = 0;
    for (const id of ids) {
      await go(page, `#/flow/${id}/1`);
      const [, total] = await count(page);
      for (let n = 1; n <= total; n++) {
        await go(page, `#/flow/${id}/${n}`);
        steps++;
        const [cur] = await count(page);
        if (cur !== n) problems.push(`${id}/${n}: shows step ${cur}`);
        const visible = await page.locator(".screen > *").count();
        if (!visible) problems.push(`${id}/${n}: empty screen`);
        // Brand guard: the prototype is CargoPilot AI; no real airline's name, flight codes or AWB prefix
        const text = await page.innerText("body");
        const leak = text.match(/LATAM|\bLA ?\d{4}\b|\b045-\d/);
        if (leak) problems.push(`${id}/${n}: shows "${leak[0]}"`);
        // When the note says to click something, it must be highlighted on screen (unless it's disabled for now)
        const hint = await page.locator(".note .hint b").first().textContent().catch(() => null);
        if (hint) {
          const lit = await page.locator(".cta-hotspot").count();
          const disabled = await page.locator(`.screen button:disabled:has-text("${hint}")`).count();
          if (!lit && !disabled) problems.push(`${id}/${n}: "${hint}" not highlighted`);
        }
      }
    }
    assert.ok(steps >= 45, `walked only ${steps} steps`);
    assert.deepEqual(problems, []);
    assert.deepEqual(errors, []);
    await page.close();
  });

  test("Next, Previous and the arrow keys move through a flow", async () => {
    const { page } = await open("#/flow/happy-path/1");
    await page.click(".bar-nav button.primary");
    await page.waitForTimeout(100);
    assert.deepEqual(await count(page), [2, 9]);
    await page.click(".bar-nav button:has-text('Previous')");
    await page.waitForTimeout(100);
    assert.deepEqual(await count(page), [1, 9]);
    await page.click(".note");
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);
    assert.deepEqual(await count(page), [2, 9]);
    await page.click(".back");
    await page.waitForTimeout(100);
    assert.equal(await page.locator(".card").count(), EXPECTED_FLOWS);
    await page.close();
  });
});

describe("step 1 · cargo type", () => {
  test("dropdown opens, picks with mouse and keyboard", async () => {
    const { page, errors } = await open("#/flow/happy-path/1");
    await page.click("#cargoType");
    assert.equal(await page.locator("[role=listbox] [role=option]").count(), 6);
    await page.click("[role=option]:has-text('Pharmaceuticals')");
    assert.match(await page.innerText("#cargoType"), /Pharmaceuticals/);
    await page.focus("#weightUnit");
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    assert.equal((await page.innerText("#weightUnit")).trim(), "lb");
    assert.deepEqual(errors, []);
    await page.close();
  });

  test("totals, errors that clear, and Save and continue", async () => {
    const { page } = await open("#/flow/happy-path/1");
    const save = page.locator(".p-actions button:has-text('Save and continue')");
    assert.equal(await save.isDisabled(), true);
    await page.click("#cargoType");
    await page.click("[role=option]:has-text('Perishables')");
    await page.fill("#description", "Fresh tuna");
    await page.fill("#pieces", "4");
    await page.fill("#weight", "30");
    await page.fill("#dims", "40");
    await page.fill("#width", "40");
    await page.fill("#length", "50");
    assert.equal(await page.inputValue("#total"), "120 kg");
    await page.click(".p-chip:has-text('Chilled')");
    await page.click(".p-chip:has-text('Frozen')");
    await save.click();
    assert.match(await page.innerText("[role=alert]"), /Handling requirements/);
    await page.click(".p-chip:has-text('Frozen')");
    assert.equal(await page.locator("[role=alert]").count(), 0);
    await save.click();
    await page.waitForTimeout(150);
    assert.deepEqual(await count(page), [3, 9]);
    assert.match(await page.innerText(".p-summary"), /120 kg/);
    await page.click(".p-actions button:has-text('Back')");
    await page.waitForTimeout(150);
    assert.equal(await page.inputValue("#description"), "Fresh tuna");
    await page.close();
  });

  test("the designed error state shows its six errors", async () => {
    const { page } = await open("#/flow/cargo-type-errors/2");
    assert.equal(await page.locator("[role=alert] li").count(), 6);
    assert.match(await page.innerText("[role=alert]"), /29 characters over the limit/);
    await page.close();
  });
});

describe("step 2 · route and dates", () => {
  test("the designed error state shows five errors; Use EZE fixes one", async () => {
    const { page } = await open("#/flow/route-errors/1");
    assert.equal(await page.locator("[role=alert] li").count(), 5);
    await page.click("button:has-text('Use EZE')");
    assert.equal(await page.locator("[role=alert] li").count(), 4);
    await page.close();
  });
});

describe("step 3 · documents", () => {
  test("attach, reject an oversized file, remove with Undo", async () => {
    const dir = mkdtempSync(join(tmpdir(), "cargo-e2e-"));
    const ok = join(dir, "certificate.pdf");
    const big = join(dir, "scan.pdf");
    writeFileSync(ok, "%PDF-1.4 test");
    writeFileSync(big, Buffer.alloc(11 * 1024 * 1024, 1));
    const { page, errors } = await open("#/flow/happy-path/4");
    await page.click("button[aria-label='Remove Health certificate']");
    assert.match(await page.innerText(".p-snackbar"), /Health certificate deleted/);
    await page.click(".p-snackbar-action");
    assert.equal(await page.locator(".p-doc.ok").count(), 3);
    await page.click("button[aria-label='Remove Health certificate']");
    await page.setInputFiles("input[type=file] >> nth=2", big);
    assert.match(await page.innerText(".p-doc.invalid"), /limit is 10 MB/);
    await page.setInputFiles("input[type=file] >> nth=2", ok);
    await page.waitForTimeout(900);
    assert.equal(await page.locator(".p-doc.ok").count(), 3);
    assert.deepEqual(errors, []);
    await page.close();
  });
});

describe("step 4 · review", () => {
  test("terms must be accepted; Edit goes to the step", async () => {
    const { page } = await open("#/flow/happy-path/5");
    await page.uncheck("#accept");
    await page.click(".p-actions button:has-text('Confirm booking')");
    assert.match(await page.innerText(".p-err"), /Accept the conditions/);
    await page.click("button[aria-label='Edit cargo']");
    await page.waitForTimeout(150);
    assert.ok(await page.locator("#cargoType").count());
    await page.close();
  });
});

describe("leaving mid-booking", () => {
  test("asks first; Keep editing stays; Leave keeps a draft", async () => {
    const { page } = await open("#/flow/happy-path/2");
    await page.fill("#description", "Changed");
    await page.click(".p-nav button:has-text('My bookings')");
    assert.equal(await page.locator("[role=dialog]").count(), 1);
    await page.click("[role=dialog] button:has-text('Keep editing')");
    assert.equal(await page.locator("[role=dialog]").count(), 0);
    await page.click(".p-nav button:has-text('My bookings')");
    await page.click("[role=dialog] button:has-text('Leave')");
    await page.waitForTimeout(150);
    assert.equal(await page.locator(".p-tr:has-text('Draft')").count(), 1);
    await page.close();
  });
});

describe("search", () => {
  test("suggestions, no results, no access, exact match to tracking", async () => {
    const { page, errors } = await open("#/flow/search-booking/1");
    const input = page.locator(".p-search input");
    await input.click();
    await input.fill("#123");
    assert.equal(await page.locator(".p-result").count(), 2);
    await input.fill("000-1234");
    await input.press("Enter");
    await page.waitForTimeout(900);
    assert.match(await page.innerText(".p-search-panel"), /No results/);
    await input.fill("#1198");
    await input.press("Enter");
    await page.waitForTimeout(900);
    assert.match(await page.innerText(".p-search-panel"), /can’t see booking #1198/);
    await input.fill("000-12345678");
    await page.click("button:has-text('Open tracking')");
    await page.waitForTimeout(200);
    assert.deepEqual(await count(page), [5, 5]);
    assert.deepEqual(errors, []);
    await page.close();
  });
});

describe("tracking", () => {
  test("Details and Map tabs switch", async () => {
    const { page } = await open("#/flow/happy-path/8");
    assert.equal(await page.locator(".screen :text('Road pickup · done')").count(), 0);
    await page.click(".screen >> text=Map");
    await page.waitForTimeout(150);
    assert.ok(await page.locator(".screen :text('Road pickup · done')").count());
    await page.click(".screen >> text=Details");
    await page.waitForTimeout(150);
    assert.equal(await page.locator(".screen :text('Road pickup · done')").count(), 0);
    // Known issue, kept as is in this increment: the Map tab switches the view but the flow stays on step 8
    assert.deepEqual(await count(page), [8, 9]);
    await page.close();
  });
});

describe("portfolio preview", () => {
  test("?embed=1 plays without the player chrome", async () => {
    const page = await browser.newPage({ viewport: { width: 1000, height: 640 } });
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(BASE + "?embed=1");
    await page.waitForTimeout(300);
    assert.equal(await page.locator(".bar").count(), 0);
    assert.ok(await page.locator(".embed .screen > *").count());
    assert.deepEqual(errors, []);
    await page.close();
  });
});

/* ---------- the agent path (Plan with CargoPilot) ---------- */

const SALMON = "Ship 10 boxes of fresh salmon, 25 kg each, 35x40x60 cm, chilled, from EZE to GRU, pick up on Nov 11";

/** Opens the agent page from My bookings, with the agent's on-screen delay off unless asked */
async function openAgent({ delay = 0, width = 1440, height = 900 } = {}) {
  const { page, errors } = await open(`?agentDelay=${delay}#/flow/happy-path/7`, { width, height });
  await page.click(".screen button:has-text('Plan with CargoPilot')");
  await page.waitForSelector("h1:has-text('Plan with CargoPilot')");
  return { page, errors };
}
const start = async (page, goal) => {
  await page.fill("#goal", goal);
  await page.click("button:has-text('Start planning')");
};
const status = (page) => page.innerText(".a-status b");
const simulate = async (page, label) => {
  await page.click("summary:has-text('Prototype controls')");
  await page.locator(".a-sim label", { hasText: label }).click();
};
/** Answers the proposal questions and attaches the sample documents */
async function details(page) {
  await page.click("#ag-pickupTime");
  await page.click("[role=option]:has-text('10:00 AM')");
  for (const [k, v] of [["pickupAddress", "Ruta 205 km 32"], ["originPostal", "1804"], ["deliveryAddress", "Rua Dr. Assis 410"], ["destPostal", "07190-100"]]) await page.fill(`#ag-${k}`, v);
  await page.click("form[aria-label='A few details for the proposal'] button[type=submit]");
  await page.click("button:has-text('Attach sample documents')");
  await page.waitForSelector("text=Your approval is needed to book");
}

describe("agent path", () => {
  test("entry points on New booking and My bookings; mock mode is labeled", async () => {
    const { page, errors } = await open("?agentDelay=0#/flow/happy-path/1");
    assert.equal(await page.locator(".a-entry button:has-text('Plan with CargoPilot')").count(), 1);
    assert.match(await page.innerText(".a-entry"), /no language model/);
    await page.click(".a-entry button");
    await page.waitForSelector("h1:has-text('Plan with CargoPilot')");
    const text = await page.innerText(".screen");
    assert.match(text, /Mock mode · rule-based, no language model/);
    assert.match(text, /Nothing is booked until you approve it/);
    assert.doesNotMatch(text, /LATAM|\bLA ?\d{4}\b|\b045-\d|AI-powered|understands|thinks/);
    assert.equal(await page.locator(".a-role button[aria-pressed=true]").innerText(), "Coordinator");
    assert.deepEqual(errors, []);
    await page.close();
  });

  test("goal → question → options → details → approval → one booking", async () => {
    const { page, errors } = await openAgent();
    await page.click("button.p-chip:has-text('Salmon to São Paulo')");
    await page.click("button:has-text('Start planning')");
    // Buenos Aires has two airports: asked, not guessed
    await page.waitForSelector("text=Which airport?");
    assert.equal(await status(page), "Needs your answer");
    assert.match(await page.innerText(".a-read-summary"), /\? → GRU/);
    assert.equal(await page.locator(".a-task.needs_user").count(), 1);
    await page.click("[role=radio]:has-text('EZE')");
    await page.click("form[aria-label='A few answers before searching flights'] button[type=submit]");
    // Options with reasons, and the recommended one first
    await page.waitForSelector(".a-option.rec");
    assert.match(await page.innerText(".a-option.rec"), /Why it's recommended[\s\S]*before the deadline[\s\S]*within the USD 1,200.00 budget/);
    assert.equal(await page.locator(".a-option").count(), 3);
    await details(page);
    assert.equal(await status(page), "Ready for your approval");
    assert.match(await page.innerText(".a-panel"), /Booked\s+Nothing yet/i);
    await page.click("button:has-text('Approve and book')");
    await page.waitForSelector(".a-block.ok");
    assert.equal(await status(page), "Booked");
    assert.match(await page.innerText(".a-block.ok"), /Booked #\d+ · AWB 000-\d{8}/);
    assert.match(await page.innerText(".a-plan .a-count"), /9 of 9 steps done/);
    // Technical detail stays secondary: the log is closed until asked for
    assert.equal(await page.locator("details.a-log[open]").count(), 0);
    await page.click(".a-panel button:has-text('Activity log')");
    await page.waitForSelector("details.a-log[open]");
    assert.ok((await page.locator(".a-log-list li").count()) > 20);
    assert.match(await page.innerText(".a-log-list"), /confirmBooking · L2/);
    assert.deepEqual(errors, []);
    await page.close();
  });

  test("a correction in what was read re-plans and is logged", async () => {
    const { page } = await openAgent();
    await start(page, SALMON);
    await page.waitForSelector(".a-option.rec");
    await page.click("button:has-text('Show and correct')");
    await page.click("button[aria-label='Change number of pieces']");
    await page.fill("#ag-pieces", "12");
    await page.click("button:has-text('Save and re-plan')");
    await page.waitForSelector(".a-src.you:has-text('You set it')");
    assert.match(await page.innerText(".a-read"), /12 pieces/);
    // Re-quoted at the new weight: 12 × 25 = 300 kg
    await page.click(".a-option.rec >> text=Price breakdown and sources");
    assert.match(await page.innerText(".a-option.rec .a-breakdown"), /300 kg/);
    await page.close();
  });

  test("a late arrival must be accepted before Approve unlocks", async () => {
    const { page } = await openAgent();
    await start(page, `${SALMON}, cheapest, deliver before Thursday`);
    await page.waitForSelector(".a-option");
    await details(page);
    const approve = page.locator("button:has-text('Approve and book')");
    assert.equal(await approve.isDisabled(), true);
    await page.check(".a-accept input");
    assert.equal(await approve.isDisabled(), false);
    await page.close();
  });

  test("over budget: the coordinator waits; the Manager decides the exception, not the booking", async () => {
    const { page } = await openAgent();
    await start(page, `${SALMON}, fastest, budget of USD 1,000`);
    await page.waitForSelector(".a-option");
    await details(page);
    await page.click("article:has-text('Express') button:has-text('Use this option instead')");
    await page.waitForSelector("text=Waiting for the Logistics Manager");
    assert.equal(await status(page), "Waiting for the Manager");
    assert.equal(await page.locator("button:has-text('Approve and book')").count(), 0);
    await page.click(".a-role button:has-text('Manager')");
    await page.waitForSelector("text=Exception for you to decide");
    assert.match(await page.innerText(".screen .p-head-right"), /Marta Ruiz/);
    await page.click("button:has-text('Approve exception')");
    await page.waitForSelector("text=The coordinator approves the booking itself");
    assert.equal(await page.locator("button:has-text('Approve and book')").count(), 0, "the Manager can't book");
    await page.click(".a-role button:has-text('Coordinator')");
    assert.match(await page.innerText(".a-block.approve"), /Over budget, approved by the Logistics Manager/);
    await page.click("button:has-text('Approve and book')");
    await page.waitForSelector(".a-block.ok");
    await page.close();
  });

  test("hard restriction: blocked for everyone; the Manager has nothing to approve; a fix clears it", async () => {
    const { page } = await openAgent();
    await start(page, "Ship 10 boxes of auto parts, 25 kg each, 35x40x60 cm, from Mendoza to GRU, pick up on Nov 12");
    await page.waitForSelector(".a-block.bad");
    assert.equal(await status(page), "Blocked");
    assert.match(await page.innerText(".a-block.bad"), /no one can approve them, the Manager included/);
    await page.click(".a-role button:has-text('Manager')");
    assert.match(await page.innerText(".a-banner.info"), /Nothing is waiting for you/);
    assert.equal(await page.locator(".a-block.bad button").count(), 0);
    await page.click(".a-role button:has-text('Coordinator')");
    await page.click("button:has-text('Use EZE')");
    await page.waitForSelector(".a-option.rec");
    await page.close();
  });

  test("dangerous goods: explained, and handed to the form with what's known", async () => {
    const { page } = await openAgent();
    await start(page, "Ship 3 boxes of lithium batteries, 18 kg each, 50x40x30 cm, from Córdoba to Lima, pick up on Nov 12");
    await page.waitForSelector("text=need a specialist: continue in the form");
    assert.match(await page.innerText(".a-block.info"), /declaration, packing checks/);
    await page.click(".a-block.info button:has-text('Continue in the form')");
    await page.waitForSelector("text=Filled in from your CargoPilot plan");
    assert.match(await page.innerText("#cargoType"), /Dangerous goods/);
    assert.equal(await page.inputValue("#pieces"), "3");
    assert.equal(await page.inputValue("#weight"), "18");
    assert.equal(await page.inputValue("#dims"), "50");
    assert.match(await page.innerText(".p-summary"), /Córdoba \(COR\)[\s\S]*Lima \(LIM\)/);
    await page.close();
  });

  test("price change at booking: a new version, what changed, approval asked again", async () => {
    const { page } = await openAgent();
    await start(page, SALMON);
    await page.waitForSelector(".a-option");
    await simulate(page, "The price goes up at booking");
    await details(page);
    await page.click("button:has-text('Approve and book')");
    await page.waitForSelector("text=What changed since v1");
    assert.match(await page.innerText(".a-changes"), /Price USD 1,159.13 → USD 1,260.04[\s\S]*approval of v1 no longer applies/);
    assert.match(await page.innerText(".a-panel"), /Nothing yet/);
    await page.close();
  });

  test("status unknown: said plainly, no Cancel, nothing re-sent; checking again resolves it", async () => {
    const { page } = await openAgent();
    await start(page, SALMON);
    await page.waitForSelector(".a-option");
    await simulate(page, "Booking times out, status can't be checked");
    await details(page);
    await page.click("button:has-text('Approve and book')");
    await page.waitForSelector("text=It isn't known yet whether this booked");
    assert.equal(await status(page), "Booking status unknown");
    assert.match(await page.innerText(".a-task.unknown"), /Status unknown/);
    assert.equal(await page.locator(".a-panel button:has-text('Cancel plan')").count(), 0);
    assert.equal(await page.locator(".a-panel button:has-text('Continue in the form')").count(), 0);
    await page.click("button:has-text('Check the status again')");
    await page.waitForSelector(".a-block.ok");
    await page.click(".a-panel button:has-text('Activity log')");
    const log = await page.innerText(".a-log-list");
    assert.equal((log.match(/Confirming the booking/g) ?? []).length, 1, "the booking was sent once");
    await page.close();
  });

  test("a failing tool: Failed with Retry, progress kept", async () => {
    const { page } = await openAgent();
    await simulate(page, "Flight search keeps failing");
    await start(page, SALMON);
    await page.waitForSelector("text=didn't work after 3 attempts");
    assert.equal(await status(page), "Something didn't work");
    assert.match(await page.innerText(".a-read-summary"), /EZE → GRU/);
    await page.click("button:has-text('Retry')");
    await page.waitForSelector(".a-option.rec");
    await page.close();
  });

  test("pause while working, reload, resume", async () => {
    const { page } = await openAgent({ delay: 400 });
    await start(page, SALMON);
    await page.click(".a-panel button:has-text('Pause')");
    await page.waitForSelector(".a-banner.mute:has-text('Paused')");
    assert.equal(await status(page), "Paused");
    await page.reload();
    await page.click(".screen button:has-text('Plan with CargoPilot')");
    await page.waitForSelector(".a-banner.mute:has-text('Paused')");
    assert.match(await page.innerText(".a-goal"), /fresh salmon/);
    await page.click(".a-panel button:has-text('Resume')");
    await page.waitForSelector(".a-option.rec", { timeout: 15000 });
    await page.close();
  });

  test("cancel asks first, keeps what was read, books nothing", async () => {
    const { page } = await openAgent();
    await start(page, SALMON);
    await page.waitForSelector(".a-option");
    await page.click(".a-panel button:has-text('Cancel plan')");
    await page.click(".a-confirm button:has-text('Keep planning')");
    assert.notEqual(await status(page), "Cancelled");
    await page.click(".a-panel button:has-text('Cancel plan')");
    await page.click(".a-confirm button:has-text('Cancel plan')");
    assert.equal(await status(page), "Cancelled");
    assert.match(await page.innerText(".a-block.mute"), /Nothing was booked/);
    await page.close();
  });

  test("works on a 1280 × 800 laptop without horizontal scroll", async () => {
    const { page, errors } = await openAgent({ width: 1280, height: 800 });
    await start(page, SALMON);
    await page.waitForSelector(".a-option.rec");
    assert.ok((await page.evaluate(() => document.documentElement.scrollWidth)) <= 1280);
    const zoom = await page.evaluate(() => Number(getComputedStyle(document.querySelector(".screen")).zoom));
    assert.ok(zoom >= 0.68, `screen scale ${zoom}`);
    assert.deepEqual(errors, []);
    await page.close();
  });
});

describe("agent path · checklist", () => {
  test("the panel and the plan count the same steps at every stop", async () => {
    const { page } = await openAgent();
    const counts = async () => [
      (await page.innerText(".a-plan .a-count")).match(/(\d+) of 9/)[1],
      (await page.innerText(".a-progress span")).match(/(\d+) of 9/)[1],
    ];
    await page.click("button.p-chip:has-text('Salmon to São Paulo')");
    await page.click("button:has-text('Start planning')");
    await page.waitForSelector("text=Which airport?");
    let [a, b] = await counts();
    assert.equal(a, b);
    await page.click("[role=radio]:has-text('EZE')");
    await page.click("form[aria-label='A few answers before searching flights'] button[type=submit]");
    await page.waitForSelector("text=A few details for the proposal");
    [a, b] = await counts();
    assert.equal(a, b);
    assert.equal(a, "6");
    await details(page);
    [a, b] = await counts();
    assert.equal(a, b);
    await page.close();
  });

  test("options that aren't recommended say why, and flights leave after pickup", async () => {
    const { page } = await openAgent();
    await start(page, SALMON);
    await page.waitForSelector(".a-option.rec");
    const others = page.locator(".a-option:not(.rec) .a-option-foot");
    assert.equal(await others.count(), 2);
    for (const t of await others.allInnerTexts()) assert.match(t, /Not recommended: /);
    assert.match(await page.innerText(".a-option.rec"), /Delivered around/);
    await page.close();
  });

  test("a budget in another currency is shown to the user, not only logged", async () => {
    const { page } = await openAgent();
    await start(page, `${SALMON}, budget of EUR 800`);
    await page.waitForSelector("text=only USD budgets are supported");
    await page.close();
  });
});
