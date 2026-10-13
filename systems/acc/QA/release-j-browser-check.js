const fs = require("fs");
const path = require("path");
const os = require("os");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-j3-screens");
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function inspectLearning(page, scope, expectedFeedback = 1) {
  const report = await page.evaluate(() => {
    const active = document.querySelector("[data-page='learning']:not([hidden])");
    const stream = active?.querySelector(".learning-stream");
    return {
      h1: [...document.querySelectorAll("h1")].filter((item) => item.offsetParent !== null).map((item) => item.textContent.trim()),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      overflowWidth: `${document.documentElement.scrollWidth}/${document.documentElement.clientWidth}`,
      feedbackCount: active?.querySelectorAll("[data-learning-feedback]").length || 0,
      journeyCount: active?.querySelectorAll(".learning-journey li").length || 0,
      summaryCount: active?.querySelectorAll("[data-learning-loop] .learning-summary-item").length || 0,
      guideText: active?.innerText || "",
      unnamedButtons: [...document.querySelectorAll("button")].filter((button) => button.offsetParent !== null && !(button.getAttribute("aria-label") || button.textContent || "").trim()).length,
      unlabeledFields: [...document.querySelectorAll("input,select,textarea")].filter((field) => field.offsetParent !== null && !field.closest("label") && !field.getAttribute("aria-label") && !(field.id && document.querySelector(`label[for="${field.id}"]`))).length,
      brokenImages: [...document.images].filter((item) => !item.complete || item.naturalWidth === 0).map((item) => item.src),
      syntheticBoundary: document.body.innerText.includes("Lokale Konzeptdemo") && document.body.innerText.includes("synthetische Daten"),
      internalInfoVisible: /SYN-|LEARN-EVAL|provider-neutral|fingerprint|fixture|technische prüfdaten/i.test(active?.innerText || ""),
      streamScrollLeft: stream?.scrollLeft || 0,
      clippedFeedback: stream ? [...stream.querySelectorAll("[data-learning-feedback]")].some((item) => item.getBoundingClientRect().left < stream.getBoundingClientRect().left - 1) : false,
      visibleAIChrome: /AI Command Center|KI-Copilot|KI-Chat/i.test(active?.innerText || ""),
    };
  });
  if (report.h1.length !== 1 || report.h1[0] !== "Offenes Ergebnis klären") fail(scope, `sichtbare H1: ${report.h1.join(", ")}`);
  if (report.overflow) fail(scope, `horizontaler Seitenüberlauf ${report.overflowWidth}`);
  if (report.feedbackCount !== expectedFeedback) fail(scope, `${report.feedbackCount} statt ${expectedFeedback} offene Rückmeldung`);
  if (report.journeyCount !== 3) fail(scope, `${report.journeyCount} statt 3 geführte Schritte`);
  if (report.summaryCount !== 3) fail(scope, `${report.summaryCount} statt 3 verdichtete Lernkennzahlen`);
  for (const expected of ["Rückmeldung auswählen", "Ergebnis klären", "Soll und Ist vergleichen", "Nächste Anpassung festhalten"]) {
    if (!report.guideText.includes(expected)) fail(scope, `Arbeitsführung ohne „${expected}“`);
  }
  if (report.unnamedButtons) fail(scope, `${report.unnamedButtons} unbenannte Buttons`);
  if (report.unlabeledFields) fail(scope, `${report.unlabeledFields} unbeschriftete Felder`);
  if (report.brokenImages.length) fail(scope, `defekte Bilder: ${report.brokenImages.join(", ")}`);
  if (!report.syntheticBoundary) fail(scope, "sichtbare Synthetikgrenze fehlt");
  if (report.internalInfoVisible) fail(scope, "interne IDs oder technische Prüfdaten stehen in der Arbeitsansicht");
  if (report.streamScrollLeft !== 0 || report.clippedFeedback) fail(scope, "Rückmeldungstexte sind horizontal verschoben oder abgeschnitten");
  if (report.visibleAIChrome) fail(scope, "sichtbares generisches KI-Modul gefunden");
}

async function inspectQuality(page, scope) {
  const report = await page.evaluate(() => {
    const active = document.querySelector("[data-page='learning-quality']:not([hidden])");
    return {
      h1: [...document.querySelectorAll("h1")].filter((item) => item.offsetParent !== null).map((item) => item.textContent.trim()),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      qualityCount: active?.querySelectorAll("[data-learning-quality] .learning-quality-row").length || 0,
      versionCount: active?.querySelectorAll("[data-learning-versions] .learning-version-row").length || 0,
      text: active?.innerText || "",
      providerCalls: window.AMAVIO_RUNTIME?.getState()?.health?.providerCalls,
      internalInfoVisible: /SYN-|LEARN-EVAL|provider-neutral|fingerprint|fixture|critical-path-replan-v|technische prüfdaten/i.test(active?.innerText || ""),
    };
  });
  if (report.h1.length !== 1 || report.h1[0] !== "Verbesserung verlässlich prüfen") fail(scope, `sichtbare H1: ${report.h1.join(", ")}`);
  if (report.overflow) fail(scope, "horizontaler Seitenüberlauf in der Qualitätsprüfung");
  if (report.qualityCount !== 5) fail(scope, `${report.qualityCount} statt 5 Qualitätsdimensionen`);
  if (report.versionCount !== 3) fail(scope, `${report.versionCount} statt 3 relevante Prüfstände`);
  if (!report.text.includes("24 synthetischen Prüffälle") || report.providerCalls !== 0) fail(scope, "Prüfbasis oder Kostengrenze fehlt");
  if (report.internalInfoVisible) fail(scope, "technische Innendaten stehen in der Qualitätsoberfläche");
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-j3-browser-"));
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
      const response = await page.goto(`${base}/?page=learning`, { waitUntil: "networkidle" });
      if (!response || response.status() !== 200) fail(scope, `HTTP ${response?.status()}`);
      await page.locator("[data-learning-feedback]").first().waitFor();
      await inspectLearning(page, scope, 1);
      await page.screenshot({ path: path.join(out, `${viewport.width}-guided-learning.png`), fullPage: true });

      if (viewport.width === 1440) {
        const selected = await page.locator("[data-learning-feedback]").first().getAttribute("data-learning-feedback");
        if (selected !== "SYN-LEARN-FB-003") fail(scope, `offene Rückmeldung nicht priorisiert: ${selected}`);
        await page.locator("[data-learning-actual]").fill("Der Verbesserungsvorschlag ergänzt Belegbezug und eine verständliche Begründung im lokalen Arbeitsprodukt.");
        await page.locator("[data-learning-feedback-form] button[type='submit']").click();
        await page.locator("[data-learning-feedback-status]").filter({ hasText: "Ergebnis geklärt" }).waitFor();

        await page.locator("[data-learning-new]").click();
        await page.locator("[data-learning-title]").fill("Neuplanung zeigt Ursache nicht kompakt");
        await page.locator("[data-learning-observation]").fill("Die Abhängigkeitsänderung ist korrekt, ihre Ursache muss aber schneller erfassbar sein.");
        await page.locator("[data-learning-expected]").fill("Ursache, Folge und Anpassung erscheinen gemeinsam in einem prüfbaren Block.");
        await page.locator("[data-learning-feedback-form] button[type='submit']").click();
        await page.locator("[data-learning-feedback-count]").filter({ hasText: "7 Einträge" }).waitFor();
      }

      if (viewport.width === 390) {
        await page.locator("[data-menu-button]").click();
        if (!(await page.locator("body").evaluate((body) => body.classList.contains("nav-open")))) fail(scope, "mobile Navigation öffnet nicht");
        await page.locator('.main-nav [data-page-target="learning-quality"]').click();
        if (await page.locator("body").evaluate((body) => body.classList.contains("nav-open"))) fail(scope, "mobile Navigation schließt nicht");
      } else {
        await page.locator("[data-learning-go-quality]").click();
      }

      await page.waitForFunction(() => document.body.dataset.page === "learning-quality");
      await inspectQuality(page, `${scope}-quality`);
      await page.evaluate(() => document.querySelector("[data-learning-toast]")?.classList.remove("is-visible"));
      await page.screenshot({ path: path.join(out, `${viewport.width}-quality-review.png`), fullPage: true });

      if (viewport.width === 1440) {
        await page.locator("[data-learning-run]").click();
        const quality = await page.locator("[data-learning-quality]").innerText();
        if (!quality.includes("Korrekturaufwand") || !quality.includes("84") || !quality.includes("78") || !quality.includes("stabil")) fail(scope, "Korrekturaufwand wird nicht richtungsrichtig bewertet");
        await page.locator("[data-learning-compare]").click();
        await page.locator("[data-learning-drawer]").waitFor();
        const comparison = await page.locator("[data-learning-comparison-content]").innerText();
        for (const expected of ["Qualitätsvergleich", "Ergebnisvergleich", "Was ändert sich fachlich?", "Bewusste Freigabe"]) {
          if (!comparison.includes(expected)) fail(scope, `Vergleich ohne ${expected}`);
        }
        if (/SYN-|fingerprint|fixture|critical-path-replan-v|technische prüfdaten/i.test(comparison)) fail(scope, "Vergleichsdialog zeigt technische Innendaten");
        await page.screenshot({ path: path.join(out, "1440-guided-comparison.png"), fullPage: true });
        await page.locator("[data-learning-rationale]").fill("Qualität, Ergebnisübereinstimmung und manueller Korrekturaufwand wurden fachlich geprüft.");
        await page.locator("[data-learning-decision-form] button[type='submit']").click();
        await page.locator("[data-learning-comparison-content]").filter({ hasText: "Vorschlag fachlich geprüft" }).waitFor();
        const state = await page.evaluate(() => window.AMAVIO_OPERATIONAL_LEARNING.getState());
        const candidate = state.versions.find((item) => item.type === "capability");
        if (candidate.status !== "candidate_reviewed" || candidate.activated) fail(scope, "Human Gate aktiviert den Kandidaten unerlaubt");
        await page.locator("[data-learning-close]").click();
      } else {
        await page.locator("[data-learning-compare]").click();
        await page.locator("[data-learning-drawer]").waitFor();
        const drawerOverflow = await page.locator("[data-learning-drawer]").evaluate((node) => node.scrollWidth > node.clientWidth + 1);
        if (drawerOverflow) fail(scope, "Vergleich läuft mobil horizontal über");
        await page.locator("[data-learning-close]").click();
      }

      if (externalRequests.length) fail(scope, `externe Requests: ${externalRequests.join(", ")}`);
      if (errors.length) fail(scope, errors.join(" | "));
      await context.close();
    }

    const roleContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const rolePage = await roleContext.newPage();
    await rolePage.goto(`${base}/?page=learning-quality`, { waitUntil: "networkidle" });
    await rolePage.locator("[data-learning-quality] .learning-quality-row").first().waitFor();
    await rolePage.locator('[data-role-target="employer"]').click();
    await rolePage.waitForFunction(() => document.body.dataset.page === "collaboration");
    if (await rolePage.locator('.main-nav [data-page-target="learning"]').isVisible()) fail("role-boundary", "Lernschleife bleibt für Arbeitgeber sichtbar");
    if (await rolePage.locator('.main-nav [data-page-target="learning-quality"]').isVisible()) fail("role-boundary", "Qualitätsprüfung bleibt für Arbeitgeber sichtbar");
    const denied = await rolePage.evaluate(async () => { const response = await fetch("/api/learning/v1/bootstrap", { headers: { "x-demo-session": "demo-session-employer-sponsor" } }); return { status: response.status, body: await response.json() }; });
    if (denied.status !== 403 || denied.body.code !== "role_scope_denied") fail("role-boundary", "direkter Arbeitgeberzugriff wird nicht serverseitig abgewiesen");
    await roleContext.close();
  } finally {
    await browser.close();
    await new Promise((resolve) => application.server.close(resolve));
  }

  if (failures.length) {
    console.error("\nAMAVIO ACC Release J.3 – Browser QA: FEHLER");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log("\nAMAVIO ACC Release J.3 – Browser QA: OK (geführte Lernschleife, getrennte Qualitätsprüfung, keine sichtbaren Innendaten, Desktop + Mobile, Rollen- und Netzwerkgrenzen)");
})();
