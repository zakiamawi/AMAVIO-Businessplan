const fs = require("fs");
const os = require("os");
const path = require("path");
const { pathToFileURL } = require("url");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-j5-screens");
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);
const query = (url) => new URL(url).searchParams;

async function waitReady(page) {
  await page.waitForFunction(() => document.body.dataset.runtime === "ready");
  await page.locator("[data-runtime-status]").filter({ hasText: "Lokales System bereit" }).waitFor();
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-j4-1-runtime-"));
  const application = createApplication({ databasePath: path.join(directory, "runtime.sqlite"), providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${application.server.address().port}`;
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    const checkingContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const checkingPage = await checkingContext.newPage();
    let releaseHealth;
    const healthHold = new Promise((resolve) => { releaseHealth = resolve; });
    await checkingPage.route("**/api/health", async (route) => { await healthHold; await route.continue(); });
    await checkingPage.goto(`${base}/?page=learning`, { waitUntil: "domcontentloaded" });
    await checkingPage.locator("[data-runtime-title]").filter({ hasText: "Lokale Demo wird vorbereitet" }).waitFor();
    if ((await checkingPage.locator("[data-runtime-guide] .runtime-guide-row").count()) !== 2) fail("checking", "Vorbereitungsablauf besitzt nicht genau zwei verständliche Schritte");
    await checkingPage.screenshot({ path: path.join(out, "1440-runtime-preparing.png"), fullPage: true });
    releaseHealth();
    await waitReady(checkingPage);
    await checkingContext.close();

    const context = await browser.newContext({ viewport: { width: 1440, height: 1024 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    const externalRequests = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
    page.on("request", (request) => { if (!request.url().startsWith(base)) externalRequests.push(request.url()); });

    await page.goto(`${base}/?page=learning`, { waitUntil: "networkidle" });
    await waitReady(page);
    await page.locator("main .page[data-page='learning']:not([hidden]) h1").filter({ hasText: "Offenes Ergebnis klären" }).waitFor();
    const health = await page.evaluate(() => window.AMAVIO_RUNTIME.getState().health);
    if (!["M", "N"].includes(health?.release) || health?.syntheticOnly !== true || health?.externalEffects !== false || health?.dualSidedWorkflow !== true || health?.programDelivery !== true || health?.intelligenceKernelV3 !== true || health?.operationalExecutionLoop !== true || health?.providerCalls !== 0) fail("health", `unerwarteter Health-Vertrag: ${JSON.stringify(health)}`);
    const readability = await page.evaluate(() => {
      const intro = getComputedStyle(document.querySelector(".learning-focus-header p"));
      const summary = getComputedStyle(document.querySelector(".learning-summary-item small"));
      const note = getComputedStyle(document.querySelector(".demo-note"));
      return { introColor: intro.color, introSize: parseFloat(intro.fontSize), summaryColor: summary.color, summarySize: parseFloat(summary.fontSize), noteColor: note.color };
    });
    if (readability.introSize < 13.5 || readability.summarySize < 10.5) fail("readability", `Schriftgrößen unter L.2-Mindestwert: ${JSON.stringify(readability)}`);
    if (readability.introColor !== "rgb(78, 95, 103)" || readability.summaryColor !== "rgb(78, 95, 103)") fail("readability", `Sekundärtext verwendet unerwarteten Kontrast: ${JSON.stringify(readability)}`);
    await page.screenshot({ path: path.join(out, "1440-runtime-ready-learning.png"), fullPage: true });

    await page.locator('.main-nav [data-page-target="learning-quality"]').click();
    await page.waitForURL((url) => url.searchParams.get("page") === "learning-quality");
    await page.locator("main .page[data-page='learning-quality']:not([hidden]) h1").waitFor();
    await page.goBack();
    await page.waitForURL((url) => url.searchParams.get("page") === "learning");
    if ((await page.locator("main .page[data-page='learning']:not([hidden])").count()) !== 1) fail("history", "Zurück stellt die Lernschleife nicht wieder her");
    await page.goForward();
    await page.waitForURL((url) => url.searchParams.get("page") === "learning-quality");
    await page.reload({ waitUntil: "networkidle" });
    await waitReady(page);
    if ((await page.locator("main .page[data-page='learning-quality']:not([hidden])").count()) !== 1) fail("reload", "Qualitäts-Deep-Link wird nach Reload nicht wiederhergestellt");

    await page.locator('[data-role-target="employer"]').click();
    await page.waitForURL((url) => url.searchParams.get("page") === "collaboration" && url.searchParams.get("role") === "employer" && url.searchParams.get("lens") === "sponsor");
    await page.locator("main .page[data-page='collaboration']:not([hidden])").waitFor();
    if (await page.locator('.main-nav [data-page-target="learning"]').isVisible()) fail("role-route", "interne Lernnavigation bleibt für Arbeitgeber sichtbar");

    await page.locator("[data-employer-lens]").selectOption("hr");
    await page.waitForURL((url) => url.searchParams.get("lens") === "hr");
    await page.reload({ waitUntil: "networkidle" });
    await waitReady(page);
    if (query(page.url()).get("role") !== "employer" || query(page.url()).get("lens") !== "hr") fail("role-reload", `Arbeitgeberroute verloren: ${page.url()}`);
    if ((await page.locator("[data-profile-role]").textContent()).trim() !== "Personal & Onboarding") fail("role-reload", "Personal-und-Onboarding-Profil wird nach Reload nicht wiederhergestellt");

    await page.locator('[data-role-target="admin"]').click();
    await page.waitForURL((url) => url.searchParams.get("page") === "operations" && !url.searchParams.has("role"));
    await page.locator("[data-ops-case-id]").first().waitFor();
    const operationCases = page.locator("[data-ops-case-id]");
    const targetCase = await operationCases.nth(1).getAttribute("data-ops-case-id");
    await operationCases.nth(1).click();
    await page.locator('[data-ops-mode="simulation"]').click();
    await page.waitForURL((url) => url.searchParams.get("page") === "operations" && url.searchParams.get("opsCase") === targetCase && url.searchParams.get("opsMode") === "simulation");
    await page.reload({ waitUntil: "networkidle" });
    await waitReady(page);
    await page.locator(`[data-ops-case-id="${targetCase}"][aria-pressed="true"]`).waitFor();
    if ((await page.locator('[data-ops-mode="simulation"]').getAttribute("aria-selected")) !== "true") fail("operations-reload", "operative Arbeitsstufe wird nicht wiederhergestellt");
    await page.screenshot({ path: path.join(out, "1440-restored-operations-state.png"), fullPage: true });

    if (externalRequests.length) fail("network", `externe Requests: ${externalRequests.join(", ")}`);
    if (errors.length) fail("console", errors.join(" | "));
    await context.close();

    const failureContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const failurePage = await failureContext.newPage();
    const failureErrors = [];
    failurePage.on("pageerror", (error) => failureErrors.push(error.message));
    await failurePage.route("**/api/health", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ status: "unavailable" }) }));
    await failurePage.goto(`${base}/?page=learning`, { waitUntil: "networkidle" });
    await failurePage.locator("[data-runtime-title]").filter({ hasText: "Demo ist noch nicht erreichbar" }).waitFor();
    if ((await failurePage.locator("[data-runtime-guide] .runtime-guide-row").count()) !== 2) fail("health-failure", "Fehlerzustand besitzt nicht genau zwei Handlungsschritte");
    if ((await failurePage.locator("[data-runtime-actions] > *").count()) !== 2) fail("health-failure", "Fehlerzustand besitzt eine unklare Anzahl von Aktionen");
    if (await failurePage.locator(".app-shell").isVisible()) fail("health-failure", "Anwendung bleibt trotz fehlgeschlagenem Health-Check sichtbar");
    if (await failurePage.evaluate(() => Boolean(window.AMAVIO_ACC_CALM_CAPABLE))) fail("health-failure", "App-Skripte wurden trotz Health-Fehler geladen");
    await failurePage.screenshot({ path: path.join(out, "1440-health-error.png"), fullPage: true });
    await failurePage.unroute("**/api/health");
    await failurePage.locator("[data-runtime-retry]").click();
    await waitReady(failurePage);
    await failurePage.locator("main .page[data-page='learning']:not([hidden]) h1").waitFor();
    if (failureErrors.length) fail("health-failure-console", failureErrors.join(" | "));
    await failureContext.close();

    const fileContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const filePage = await fileContext.newPage();
    const fileErrors = [];
    filePage.on("pageerror", (error) => fileErrors.push(error.message));
    await filePage.goto(pathToFileURL(path.join(root, "index.html")).href, { waitUntil: "load" });
    await filePage.locator("[data-runtime-title]").filter({ hasText: "Lokale Demo starten" }).waitFor();
    if ((await filePage.locator("[data-runtime-guide] .runtime-guide-row").count()) !== 2) fail("file-guard", "Datei-Hinweis besitzt nicht genau zwei verständliche Schritte");
    if (await filePage.locator(".app-shell").isVisible()) fail("file-guard", "statische App-Oberfläche bleibt im file-Modus sichtbar");
    if (await filePage.evaluate(() => Boolean(window.AMAVIO_ACC_CALM_CAPABLE))) fail("file-guard", "Anwendungslogik wurde im file-Modus geladen");
    const localLink = await filePage.locator('[data-runtime-actions] a[href^="http://127.0.0.1:4214/"]').count();
    if (localLink !== 1) fail("file-guard", "eindeutiger lokaler Startlink fehlt");
    await filePage.screenshot({ path: path.join(out, "1440-file-protocol-guard.png"), fullPage: true });
    await filePage.setViewportSize({ width: 390, height: 844 });
    await filePage.screenshot({ path: path.join(out, "390-file-protocol-guard.png"), fullPage: true });
    if (fileErrors.length) fail("file-guard-console", fileErrors.join(" | "));
    await fileContext.close();
  } finally {
    await browser.close();
    await new Promise((resolve) => application.server.close(resolve));
  }

  if (failures.length) {
    console.error("\nAMAVIO ACC Release J.5 – Runtime Integrity QA: FEHLER");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log("\nAMAVIO ACC Release J.5 – Runtime Integrity QA: OK (lesbarer Einstieg, zweistufiger File Guard und Fehlerzustand, Health Gate, Retry, Deep Links, History, Arbeitgeber-Mitwirkung, Reload, Rolle, Fall und Arbeitsstufe wiederhergestellt; keine externen Requests)");
})();
