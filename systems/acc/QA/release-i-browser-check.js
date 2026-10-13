const fs = require("fs");
const path = require("path");
const os = require("os");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-i-screens");
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function inspect(page, scope) {
  const report = await page.evaluate(() => ({
    h1: [...document.querySelectorAll("h1")].filter((item) => item.offsetParent !== null).map((item) => item.textContent.trim()),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    eventCount: document.querySelectorAll("[data-twin-event]").length,
    pathCount: document.querySelectorAll(".twin-path-case").length,
    handoffCount: document.querySelectorAll("[data-twin-handoffs] .twin-handoff-row").length,
    unnamedButtons: [...document.querySelectorAll("button")].filter((button) => button.offsetParent !== null && !(button.getAttribute("aria-label") || button.textContent || "").trim()).length,
    unlabeledFields: [...document.querySelectorAll("input,select,textarea")].filter((field) => field.offsetParent !== null && !field.closest("label") && !field.getAttribute("aria-label") && !(field.id && document.querySelector(`label[for="${field.id}"]`))).length,
    brokenImages: [...document.images].filter((item) => !item.complete || item.naturalWidth === 0).map((item) => item.src),
    boundary: document.body.innerText.includes("Lokal · synthetisch · keine Außenwirkung"),
    visibleAIChrome: /AI Command Center|KI-Copilot|KI-Chat/i.test(document.querySelector("[data-page='twin']")?.innerText || ""),
  }));
  if (report.h1.length !== 1 || report.h1[0] !== "Operations Twin") fail(scope, `sichtbare H1: ${report.h1.join(", ")}`);
  if (report.overflow) fail(scope, "horizontaler Seitenüberlauf");
  if (report.eventCount !== 5) fail(scope, `${report.eventCount} statt 5 Ereignisse`);
  if (report.pathCount !== 4) fail(scope, `${report.pathCount} statt 4 kritische Pfade`);
  if (report.handoffCount !== 5) fail(scope, `${report.handoffCount} statt 5 Rollenübergaben`);
  if (report.unnamedButtons) fail(scope, `${report.unnamedButtons} unbenannte Buttons`);
  if (report.unlabeledFields) fail(scope, `${report.unlabeledFields} unbeschriftete Felder`);
  if (report.brokenImages.length) fail(scope, `defekte Bilder: ${report.brokenImages.join(", ")}`);
  if (!report.boundary) fail(scope, "sichtbare Synthetik- und Wirkungsgrenze fehlt");
  if (report.visibleAIChrome) fail(scope, "sichtbares generisches KI-Modul gefunden");
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-i-browser-"));
  const application = createApplication({ databasePath: path.join(directory, "browser.sqlite"), providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${application.server.address().port}`;
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    for (const viewport of [{ width: 1440, height: 1024 }, { width: 390, height: 844 }]) {
      const scope = `${viewport.width}px`;
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      const errors = [];
      const externalRequests = [];
      page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
      page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
      page.on("request", (request) => { if (!request.url().startsWith(base)) externalRequests.push(request.url()); });
      const response = await page.goto(`${base}/?page=twin`, { waitUntil: "networkidle" });
      if (!response || response.status() !== 200) fail(scope, `HTTP ${response?.status()}`);
      await page.locator("[data-twin-runtime]").filter({ hasText: "lokal aktiv" }).waitFor();
      await inspect(page, scope);

      if (viewport.width === 1440) {
        await page.locator('[data-twin-event="SYN-TWIN-EVT-005"]').click();
        await page.locator("[data-twin-inspector]").filter({ hasText: "Budgetentscheidung" }).waitFor();
        await page.locator("[data-twin-create-plan]").click();
        await page.locator("[data-twin-review-note]").fill("Synthetische Verantwortung, Beleglage und Abhängigkeiten fachlich geprüft.");
        await page.locator('[data-twin-review="approved"]').click();
        await page.locator(".twin-plan-state").filter({ hasText: "fachlich geprüft" }).waitFor();
        const approved = await page.locator("[data-twin-inspector]").innerText();
        if (!approved.includes("keine automatische Ausführung")) fail(scope, "fachlich geprüfter Plan verliert No-Effect-Grenze");

        await page.locator("[data-twin-simulate]").click();
        await page.locator("[data-twin-simulation-result]").filter({ hasText: "Original unverändert" }).waitFor();
        const simulation = await page.locator("[data-twin-simulation-result]").innerText();
        if (!simulation.includes("5 synthetische Fälle") || !simulation.includes("kritische Meilensteine")) fail(scope, "Kohortensimulation ist unvollständig");
        await page.locator("[data-twin-close]").click();

        await page.locator('[data-page-target="twin-decisions"]').click();
        await page.locator("#twin-decisions-title").waitFor();
        if ((await page.locator("[data-twin-decision-event]").count()) !== 4) fail(scope, "Entscheidungsraum enthält nicht 4 priorisierte Ereignisse");
        const decisionSummary = await page.locator("[data-twin-decision-summary]").innerText();
        if (!decisionSummary.includes("fachlich geprüfte Pläne")) fail(scope, "Entscheidungsraum verliert Human-Gate-Status");
        await page.locator("[data-twin-open-main]").click();
      }

      if (viewport.width === 390) {
        await page.locator("[data-menu-button]").click();
        if (!(await page.locator("body").evaluate((body) => body.classList.contains("nav-open")))) fail(scope, "mobile Navigation öffnet nicht");
        await page.locator('[data-page-target="twin-decisions"]').click();
        if (await page.locator("body").evaluate((body) => body.classList.contains("nav-open"))) fail(scope, "mobile Navigation schließt nicht");
        await page.locator("[data-twin-open-main]").click();
      }

      await page.evaluate(() => { document.querySelector("[data-twin-toast]")?.classList.remove("is-visible"); window.scrollTo(0, 0); });
      await page.screenshot({ path: path.join(out, `${viewport.width}-operations-twin.png`), fullPage: true });
      if (externalRequests.length) fail(scope, `externe Requests: ${externalRequests.join(", ")}`);
      const unexpectedErrors = errors.filter((message) => !message.includes("status of 403"));
      if (unexpectedErrors.length) fail(scope, unexpectedErrors.join(" | "));
      await context.close();
    }

    const roleContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const rolePage = await roleContext.newPage();
    await rolePage.goto(`${base}/?page=twin`, { waitUntil: "networkidle" });
    await rolePage.locator("[data-twin-runtime]").filter({ hasText: "lokal aktiv" }).waitFor();
    await rolePage.locator('[data-role-target="employer"]').click();
    await rolePage.waitForFunction(() => document.body.dataset.page === "collaboration");
    if (await rolePage.locator('[data-page-target="twin"]').isVisible()) fail("role-boundary", "Operations Twin bleibt für Arbeitgeber sichtbar");
    const denied = await rolePage.evaluate(async () => { const response = await fetch("/api/twin/v1/bootstrap", { headers: { "x-demo-session": "demo-session-employer-sponsor" } }); return { status: response.status, body: await response.json() }; });
    if (denied.status !== 403 || denied.body.code !== "role_scope_denied") fail("role-boundary", "direkter Arbeitgeberzugriff wird nicht serverseitig abgewiesen");
    await roleContext.close();
  } finally {
    await browser.close();
    await new Promise((resolve) => application.server.close(resolve));
  }

  if (failures.length) {
    console.error("\nAMAVIO ACC Release I – Browser QA: FEHLER");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log("\nAMAVIO ACC Release I – Browser QA: OK (Operations Twin, Arbeitsplan, Human Gate, Kohortensimulation, Entscheidungsraum, Desktop + Mobile, Rollen- und Netzwerkgrenzen)");
})();
