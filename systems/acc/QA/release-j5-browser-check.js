const fs = require("fs");
const os = require("os");
const path = require("path");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-j5-screens");
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function waitReady(page) {
  await page.waitForFunction(() => document.body.dataset.runtime === "ready");
}

async function assertNoOverflow(page, scope) {
  const overflow = await page.evaluate(() => ({ page: document.documentElement.scrollWidth - document.documentElement.clientWidth, body: document.body.scrollWidth - document.body.clientWidth }));
  if (overflow.page > 1 || overflow.body > 1) fail(scope, `horizontaler Überlauf ${JSON.stringify(overflow)}`);
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-j5-browser-"));
  const application = createApplication({ databasePath: path.join(directory, "browser.sqlite"), providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${application.server.address().port}`;
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      const errors = [];
      const externalRequests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("request", (request) => { if (!request.url().startsWith(base)) externalRequests.push(request.url()); });

      await page.goto(`${base}/?page=operations`, { waitUntil: "networkidle" });
      await waitReady(page);
      await page.locator("main .operations-page:not([hidden]) #operations-command-title").filter({ hasText: "Fallarbeit" }).waitFor();
      await page.locator("[data-ops-contribution-inbox]").waitFor();
      if (await page.locator("[data-employer-only]").first().isVisible()) fail(`operations-${viewport.width}`, "Arbeitgebernavigation ist in Operations sichtbar");
      await assertNoOverflow(page, `operations-${viewport.width}`);
      await page.screenshot({ path: path.join(out, `${viewport.width}-operations-desk.png`), fullPage: true });

      await page.locator('[data-role-target="employer"]').click();
      await page.waitForURL((url) => url.searchParams.get("page") === "collaboration" && url.searchParams.get("role") === "employer");
      await page.locator("main .collaboration-page:not([hidden]) #collaboration-title").filter({ hasText: "Aufgaben & Entscheidungen" }).waitFor();
      await page.locator("[data-collab-case-list] .dual-case-button").first().waitFor();
      if (await page.locator('[data-page-target="learning"]').isVisible()) fail(`employer-${viewport.width}`, "interne Lernnavigation ist sichtbar");
      if (await page.locator('[data-page-target="operations"]').isVisible()) fail(`employer-${viewport.width}`, "interne Fallsteuerung ist sichtbar");
      if (!(await page.locator('[data-page-target="collaboration"]').isVisible())) fail(`employer-${viewport.width}`, "Navigation für Aufgaben und Entscheidungen fehlt");
      if ((await page.locator("[data-collab-role-label]").textContent()).trim() !== "Arbeitgeber · Gesamtsteuerung") fail(`employer-${viewport.width}`, "Projektion der Gesamtsteuerung fehlt");
      await assertNoOverflow(page, `employer-${viewport.width}`);
      await page.screenshot({ path: path.join(out, `${viewport.width}-employer-collaboration.png`), fullPage: true });

      const summary = `Synthetischer Testbeitrag ${viewport.width}`;
      await page.locator("[data-collab-summary]").fill(summary);
      await page.locator("[data-collab-detail]").fill("Die synthetische Gesamtsteuerung bestätigt den dokumentierten Teststand und übergibt ihn bewusst zur internen AMAVIO-Prüfung.");
      await page.locator("[data-collab-form] button[type='submit']").click();
      await page.locator("[data-collab-toast]").filter({ hasText: "Beitrag lokal an AMAVIO Operations übergeben" }).waitFor();
      await page.locator("[data-collab-history] .contribution-row").filter({ hasText: summary }).waitFor();

      await page.locator('[data-role-target="admin"]').click();
      await page.waitForURL((url) => url.searchParams.get("page") === "operations" && !url.searchParams.has("role"));
      await page.locator("[data-ops-contribution-inbox] .ops-contribution-card").filter({ hasText: summary }).waitFor();
      const card = page.locator("[data-ops-contribution-inbox] .ops-contribution-card").filter({ hasText: summary });
      await card.locator("[data-review-contribution]").click();
      await page.locator("[data-ops-toast]").filter({ hasText: "gemeinsamer Status lokal aktualisiert" }).waitFor();

      await page.locator('[data-role-target="employer"]').click();
      await page.waitForURL((url) => url.searchParams.get("page") === "collaboration");
      await page.locator("[data-collab-history] .contribution-row").filter({ hasText: summary }).filter({ hasText: "Gemeinsamer Status aktualisiert" }).waitFor();

      for (const lens of ["hr", "location", "budget", "sponsor"]) {
        await page.locator("[data-employer-lens]").selectOption(lens);
        await page.waitForURL((url) => url.searchParams.get("page") === "collaboration" && url.searchParams.get("lens") === lens);
        await page.locator("main .collaboration-page:not([hidden])").waitFor();
        if (await page.locator('[data-page-target="learning"]').isVisible()) fail(`${lens}-${viewport.width}`, "interne Navigation sichtbar");
      }

      await page.reload({ waitUntil: "networkidle" });
      await waitReady(page);
      if (!page.url().includes("page=collaboration") || !page.url().includes("lens=sponsor")) fail(`reload-${viewport.width}`, `Arbeitgeberzustand verloren: ${page.url()}`);
      await assertNoOverflow(page, `reload-${viewport.width}`);
      if (externalRequests.length) fail(`network-${viewport.width}`, `externe Requests: ${externalRequests.join(", ")}`);
      if (errors.length) fail(`console-${viewport.width}`, errors.join(" | "));
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => application.server.close(resolve));
  }

  if (failures.length) {
    console.error("\nAMAVIO ACC Release J.5 – Browser QA: FEHLER");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log("\nAMAVIO ACC Release J.5 – Browser QA: OK (Operations Desk, Arbeitgeber-Mitwirkung, 4 Arbeitgeberrollen, Beitrag, AMAVIO-Prüfung, gemeinsamer Status, Reload, Desktop + Mobile, keine externen Requests)");
})();

