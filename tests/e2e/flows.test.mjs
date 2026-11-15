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
    assert.match(await page.innerText("body"), /Mock mode, no AI features yet/);
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
