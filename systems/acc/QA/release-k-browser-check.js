const fs = require("fs");
const os = require("os");
const path = require("path");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);
const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-k-screens");
const failures = [];
function fail(scope, message) { failures.push(`${scope}: ${message}`); }
async function ready(page) { await page.waitForFunction(() => document.body.dataset.runtime === "ready"); }
async function noOverflow(page, scope) { const value = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (value > 1) fail(scope, `horizontaler Überlauf ${value}px`); }

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-k-browser-"));
  const application = createApplication({ databasePath: path.join(directory, "browser.sqlite"), providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${application.server.address().port}`; fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" }); const page = await context.newPage(); const errors = []; const external = [];
      page.on("pageerror", (error) => errors.push(error.message)); page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); }); page.on("request", (request) => { if (!request.url().startsWith(base)) external.push(request.url()); });
      await page.goto(`${base}/?page=programs&program=SYN-PROG-001`, { waitUntil: "networkidle" }); await ready(page);
      await page.locator(".program-page:not([hidden]) [data-program-name]").filter({ hasText: "Pflegekohorte Rheinland" }).waitFor();
      if (await page.locator("[data-program-outcome-form]").isVisible()) fail(`ops-${viewport.width}`, "Arbeitgeber-Outcome in Operations sichtbar");
      if ((await page.locator("[data-program-workstreams] .blueprint-row").count()) !== 7) fail(`ops-${viewport.width}`, "Service Blueprint ist unvollständig");
      await noOverflow(page, `ops-${viewport.width}`); await page.screenshot({ path: path.join(out, `${viewport.width}-operations-program.png`), fullPage: true });
      await page.locator("details.program-adjustment > summary").click(); await page.locator("[data-program-simulation-form] button").click(); await page.locator("[data-program-toast]").filter({ hasText: "Programmvariante" }).waitFor(); await page.locator("[data-review-adjustment]").waitFor();
      await page.locator('[data-role-target="employer"]').click(); await page.waitForURL((url) => url.searchParams.get("page") === "programs" && url.searchParams.get("role") === "employer");
      await page.locator("[data-program-outcome-form]").waitFor(); await page.locator("[data-program-role-title]").filter({ hasText: "Gesamtsteuerung" }).waitFor(); await page.waitForFunction(() => document.querySelectorAll("[data-program-decisions] .program-decision").length === 1); if (await page.locator("[data-program-simulation-form]").isVisible()) fail(`employer-${viewport.width}`, "interne Simulation sichtbar"); if (await page.locator("[data-program-capacity]").isVisible()) fail(`employer-${viewport.width}`, "interne Kapazität sichtbar");
      const employerDecisions = await page.locator("[data-program-decision-form]").count(); if (employerDecisions !== 1) fail(`employer-${viewport.width}`, `erwartet 1 Entscheidung der Gesamtsteuerung, gefunden ${employerDecisions}`);
      await noOverflow(page, `employer-${viewport.width}`); await page.screenshot({ path: path.join(out, `${viewport.width}-employer-program.png`), fullPage: true });
      await page.locator("[data-program-outcome-form] button").click(); await page.locator("[data-program-outcome-status]").filter({ hasText: "lokal übergeben" }).waitFor();
      await page.reload({ waitUntil: "networkidle" }); await ready(page); if (!page.url().includes("page=programs") || !page.url().includes("role=employer")) fail(`reload-${viewport.width}`, "Programmzustand nicht wiederhergestellt");
      if (external.length) fail(`network-${viewport.width}`, `externe Requests: ${external.join(", ")}`); if (errors.length) fail(`console-${viewport.width}`, errors.join(" | ")); await context.close();
    }
  } finally { await browser.close(); await new Promise((resolve) => application.server.close(resolve)); }
  if (failures.length) { console.error("AMAVIO ACC Release K – Browser QA: FEHLER"); failures.forEach((item) => console.error(`- ${item}`)); process.exit(1); }
  console.log("AMAVIO ACC Release K – Browser QA: OK (Operations- und Arbeitgeber-Programmraum, Simulation/Human Gate, Outcome, URL/Reload, Desktop/Tablet/Mobil, keine externen Requests)");
})();
