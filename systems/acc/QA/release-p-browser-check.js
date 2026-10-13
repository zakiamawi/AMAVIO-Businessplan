const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const failures = [];
const out = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-p-browser-"));
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function ready(page) {
  await page.locator("#app:not([hidden])").waitFor({ state: "visible" });
  await page.locator("[data-runtime-gate]").waitFor({ state: "hidden" });
}

async function noOverflow(page, scope) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) fail(scope, `horizontaler Überlauf ${overflow}px`);
}

async function employerToVerifiedOutcome(page) {
  const recommended = page.locator('.option-row[data-recommended="true"]');
  await recommended.getByRole("button", { name: "Option wählen" }).click();
  await page.locator("[data-authorize-form]").waitFor();
  await page.locator("#decision-rationale").fill("Die empfohlene Option hält den synthetischen Arbeitsstart bei nachvollziehbarem Aufwand stabil.");
  await page.locator('[name="confirmSynthetic"]').check();
  await page.locator("[data-authorize-form]").getByRole("button", { name: "Intervention freigeben" }).click();
  await page.locator(".status-line strong").getByText("Intervention aktiv", { exact: true }).waitFor();

  await page.getByRole("tab", { name: "AMAVIO Operations" }).click();
  await page.locator("[data-complete-form]").waitFor();
  await page.locator("#proof-reference").fill("SYN-Übergabebestätigung 04");
  await page.locator("#completion-note").fill("Der vereinbarte Abschlussnachweis wurde vollständig gegen die synthetische Programmlage geprüft.");
  await page.locator("[data-complete-form]").getByRole("button", { name: "Nachweis bestätigen" }).click();
  await page.getByText("Intervention abgeschlossen", { exact: true }).waitFor();
  const current = page.locator('.readiness-band li[aria-current="step"] strong');
  if ((await current.textContent())?.trim() !== "Bestätigt") fail("journey", "Readiness-Band endet nicht in Bestätigt");

  await page.getByRole("button", { name: "Öffnen" }).last().click();
  const dialog = page.locator("[data-product-dialog]");
  await dialog.getByRole("heading", { name: "Arrival Readiness Brief" }).waitFor();
  await dialog.getByText("Startfähigkeit bestätigt", { exact: true }).waitFor();
  await dialog.getByRole("button", { name: "Arbeitsprodukt schließen" }).click();
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 820, height: 1050 }, { width: 390, height: 844 }]) {
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), `amavio-release-p-${viewport.width}-`));
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
        await page.goto(`${base}/?page=readiness&role=employer&lens=governance&scenario=housing-handover`, { waitUntil: "networkidle" });
        await ready(page);
        if ((await page.title()) !== "AMAVIO Arrival Control Center | Arrival Reliability & Intervention") fail(scope, `falscher Seitentitel: ${await page.title()}`);
        if ((await page.locator('link[rel="stylesheet"]').count()) !== 2) fail(scope, "nicht genau zwei aktive Stylesheets einschließlich lokaler Fonts");
        if ((await page.locator("script[src]").count()) !== 1) fail(scope, "nicht genau ein aktives Laufzeitskript");
        await page.getByRole("heading", { name: "Startfähigkeit", exact: true }).waitFor();
        await page.getByRole("heading", { name: "Unterkunftsübergabe Solingen nicht bestätigt" }).waitFor();
        await page.getByText("10 bestätigt · 2 unter Bedingungen", { exact: true }).waitFor();
        if ((await page.locator('[role="tablist"][aria-label="Drei synthetische Ausnahmewege"] [role="tab"]').count()) !== 3) fail(scope, "nicht genau drei Ausnahmewege sichtbar");
        await noOverflow(page, `${scope}-start`);
        await page.screenshot({ path: path.join(out, `${scope}-01-start.png`), fullPage: true });

        if (viewport.width === 1440) {
          await employerToVerifiedOutcome(page);
          await noOverflow(page, `${scope}-verified`);
          await page.screenshot({ path: path.join(out, `${scope}-02-verified.png`), fullPage: true });
          await page.getByRole("button", { name: /Programme/ }).first().click();
          await page.getByRole("heading", { name: "Drei geprüfte Ausnahmewege" }).waitFor();
          if ((await page.locator(".exception-list > button").count()) !== 3) fail(scope, "Programmseite zeigt nicht drei Ausnahmewege");
          await page.getByRole("button", { name: /Lokalen Demo-Arbeitsstand zurücksetzen/ }).click();
          await page.getByText("Lokaler synthetischer Demo-Arbeitsstand wurde zurückgesetzt.").waitFor();
        } else {
          if (viewport.width <= 900) {
            await page.locator("[data-open-menu]").click();
            const transform = await page.locator(".sidebar").evaluate((node) => getComputedStyle(node).transform);
            if (transform === "none" && viewport.width > 900) fail(scope, "mobile Navigation nicht geöffnet");
            await page.locator("[data-close-menu]").click({ position: { x: Math.max(1, viewport.width - 10), y: 10 } }).catch(() => page.keyboard.press("Escape"));
          }
          await page.getByRole("tab", { name: "AMAVIO Operations" }).click();
          await page.getByText("Die Arbeitgeber-Gesamtsteuerung wählt eine Option").waitFor();
          await noOverflow(page, `${scope}-operations`);
          await page.screenshot({ path: path.join(out, `${scope}-02-operations.png`), fullPage: true });
        }

        const visibleText = await page.locator("body").innerText();
        if (/\bSponsor\b|amavio-domain-engine|R-0\d/.test(visibleText)) fail(scope, "interne oder unverständliche Produktsprache ist sichtbar");
        if (external.length) fail(`${scope}-network`, external.join(", "));
        if (errors.length) fail(`${scope}-console`, errors.join(" | "));
      } finally {
        await context.close();
        await new Promise((resolve) => application.server.close(resolve));
      }
    }
  } finally { await browser.close(); }

  if (failures.length) {
    console.error("Release P Browser QA – FEHLER");
    failures.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }
  console.log(`Release P Browser QA – OK (Entscheidung → Intervention → Nachweis → Brief; Desktop/Tablet/Mobil; Screenshots nur temporär: ${out})`);
})();
