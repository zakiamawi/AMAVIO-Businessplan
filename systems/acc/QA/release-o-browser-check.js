const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const root = path.resolve(__dirname, "..");
const out = path.join(root, "QA", "release-o-screens");
const failures = [];
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function ready(page) {
  await page.locator("#app:not([hidden])").waitFor({ state: "visible" });
  await page.locator("[data-runtime-gate]").waitFor({ state: "hidden" });
}
async function noOverflow(page, scope) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) fail(scope, `horizontaler Überlauf ${overflow}px`);
}
async function runGoldenJourney(page) {
  await page.locator('[data-create-product="exception_resolution_plan"]').first().click();
  await page.getByText("Klärungsauftrag liegt als Entwurf vor").waitFor();
  await page.locator("[data-complete-order]").click();
  await page.getByRole("heading", { name: "Arbeitgeberbeitrag steht aus" }).waitFor();
  await page.locator("[data-switch-employer-location]").click();
  await page.locator("[data-employer-form]").waitFor();
  await page.locator("#employer-address").fill("Musterweg 24, 40200 Düsseldorf");
  await page.locator("#employer-date").fill("2026-09-18");
  await page.locator("#employer-basis").selectOption({ label: "Geprüfter Vertragsentwurf" });
  await page.locator("#employer-rationale").fill("Der synthetische Vertragsentwurf und die Übergabezeit wurden am Standort gemeinsam geprüft.");
  await page.locator("[data-employer-form]").getByRole("button", { name: /Beitrag übergeben/ }).click();
  await page.getByText("Ihr Beitrag wurde übergeben").waitFor();
  await page.locator("[data-switch-operations]").click();
  await page.getByRole("heading", { name: "Auswirkung auf den Arbeitsstart prüfen" }).waitFor();
  await page.locator("[data-complete-order]").click();
  await page.locator("[data-decision-form]").waitFor();
  await page.locator("#decision-option").selectOption({ index: 1 });
  await page.locator("#decision-rationale").fill("Evidenz, Arbeitgeberbeitrag und Auswirkung wurden vollständig menschlich geprüft.");
  await page.locator("[data-decision-form]").getByRole("button", { name: /Entscheidung dokumentieren/ }).click();
  await page.getByRole("heading", { name: "Ergebnis ist nachvollziehbar dokumentiert" }).waitFor();
  await page.getByRole("button", { name: /Brief erzeugen/ }).click();
  await page.locator(".product-preview").getByRole("heading", { name: "Arrival Readiness Brief" }).waitFor();
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1440, height: 980 }, { width: 820, height: 1050 }, { width: 390, height: 844 }]) {
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), `amavio-release-o-${viewport.width}-`));
      const application = createApplication({ databasePath: path.join(directory, "browser.sqlite"), providerMode: "local" });
      await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
      const base = `http://127.0.0.1:${application.server.address().port}`;
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      const errors = [];
      const external = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("request", (request) => { if (!request.url().startsWith(base)) external.push(request.url()); });
      const scope = String(viewport.width);
      try {
        await page.goto(`${base}/?page=operations&opsCase=SYN-CASE-001`, { waitUntil: "networkidle" });
        await ready(page);
        if ((await page.locator('link[rel="stylesheet"]').count()) !== 2) fail(scope, "nicht genau zwei aktive Stylesheets einschließlich lokaler Fonts");
        if ((await page.locator("script[src]").count()) !== 1) fail(scope, "nicht genau ein aktives Laufzeitskript");
        await page.getByRole("heading", { name: "Wohnraumfreigabe gefährdet den Start" }).waitFor();
        await page.getByText("Drei geprüfte Ausnahmewege").waitFor();
        await noOverflow(page, `${scope}-start`);
        await page.screenshot({ path: path.join(out, `${scope}-01-operations-start.png`), fullPage: true });

        if (viewport.width === 1440) {
          await runGoldenJourney(page);
          await noOverflow(page, `${scope}-result`);
          await page.screenshot({ path: path.join(out, `${scope}-02-golden-journey-result.png`), fullPage: true });
          await page.getByRole("tab", { name: "Pilotmessung" }).click();
          await page.getByRole("button", { name: /Lokalen Pilotstand zurücksetzen/ }).click();
          await page.getByRole("heading", { name: "Widerspruch fachlich klären" }).waitFor();
        } else {
          await page.getByRole("tab", { name: "Arbeitgeber" }).click();
          await page.getByRole("heading", { name: "Wohnraumfreigabe gefährdet den Start" }).waitFor();
          if (viewport.width <= 820) {
            await page.locator("[data-open-menu]").click();
            await page.locator(".sidebar").waitFor({ state: "visible" });
          }
          await noOverflow(page, `${scope}-employer`);
          await page.screenshot({ path: path.join(out, `${scope}-02-employer.png`), fullPage: true });
        }
        const text = await page.locator("main").innerText();
        if (/\bSponsor\b|amavio-domain-engine|R-0\d/.test(text)) fail(scope, "interne Produktsprache ist sichtbar");
        if (external.length) fail(`${scope}-network`, external.join(", "));
        if (errors.length) fail(`${scope}-console`, errors.join(" | "));
      } finally {
        await context.close();
        await new Promise((resolve) => application.server.close(resolve));
      }
    }
  } finally { await browser.close(); }

  if (failures.length) {
    console.error("Release O Browser QA – FEHLER");
    failures.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }
  console.log("Release O Browser QA – OK (Golden Journey, Rollenübergabe, Reset, Desktop/Tablet/Mobil, keine externen Requests)");
})();
