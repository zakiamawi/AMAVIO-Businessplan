const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const failures = [];
const out = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-p3-browser-"));
const fail = (scope, message) => failures.push(`${scope}: ${message}`);

async function ready(page) {
  await page.locator("#app:not([hidden])").waitFor({ state: "visible" });
  await page.locator("[data-runtime-gate]").waitFor({ state: "hidden" });
}

async function noOverflow(page, scope) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) {
    const offenders = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((node) => {
      const box = node.getBoundingClientRect();
      return box.right > document.documentElement.clientWidth + 1;
    }).slice(0, 8).map((node) => `${node.tagName.toLowerCase()}.${node.className || ""}:${Math.round(node.getBoundingClientRect().left)}-${Math.round(node.getBoundingClientRect().right)}`));
    fail(scope, `horizontaler Überlauf ${overflow}px (${offenders.join(", ")})`);
  }
}

async function employerToVerifiedOutcome(page, screenshotPath, documentScreenshotPath) {
  await page.getByRole("button", { name: "Entscheidung bearbeiten" }).click();
  await page.getByRole("heading", { name: "Entscheidungen", exact: true }).waitFor();
  const recommended = page.locator('.option-row[data-recommended="true"]');
  await recommended.getByRole("button", { name: "Option wählen" }).click();
  await page.locator("[data-authorize-form]").waitFor();
  await page.locator("#decision-rationale").fill("Die empfohlene Option hält den synthetischen Arbeitsstart bei nachvollziehbarem Aufwand stabil.");
  await page.locator('[name="confirmSynthetic"]').check();
  await page.locator("[data-authorize-form]").getByRole("button", { name: "Auftrag an AMAVIO übergeben" }).click();
  await page.locator(".handoff-receipt").getByText("Auftrag an AMAVIO übergeben", { exact: true }).waitFor();
  await page.getByText("SYN-AO-HOUSING-001", { exact: true }).waitFor();

  await page.locator('[data-role="operations"]').click();
  await page.getByRole("heading", { name: "Aktive Aufträge", exact: true }).waitFor();
  await page.getByRole("button", { name: "Auftrag übernehmen" }).click();
  await page.getByText("In Bearbeitung", { exact: true }).first().waitFor();
  await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  await page.screenshot({ path: screenshotPath, fullPage: true });
  for (let index = 1; index <= 3; index += 1) {
    const form = page.locator("[data-step-form]");
    await form.locator('[name="proofReference"]').fill(`SYN-BELEG-${index}`);
    await form.locator('[name="note"]').fill("Der synthetische Nachweis wurde gegen die vereinbarte Abnahmebedingung geprüft und ist vollständig.");
    await form.getByRole("button", { name: "Nachweis sichern" }).click();
    if (index < 3) await page.waitForFunction((proof) => document.querySelector('[name="proofReference"]')?.value === "", `SYN-BELEG-${index}`);
  }
  await page.locator("[data-complete-form]").waitFor();
  await page.locator('[name="resultSummary"]').fill("Die Unterkunftsübergabe und der Ankunftsweg sind für beide synthetischen Startplätze belastbar dokumentiert.");
  await page.locator('[data-complete-form] [name="proofReference"]').fill("SYN-Übergabebestätigung 04");
  await page.locator('[data-complete-form] [name="note"]').fill("Alle Ausführungsschritte und Nachweise erfüllen die vereinbarten Abnahmebedingungen.");
  await page.locator("[data-complete-form]").getByRole("button", { name: "Ergebnis an Arbeitgeber übergeben" }).click();
  await page.getByRole("heading", { name: "Ergebnis wurde übergeben", exact: true }).waitFor();
  await page.getByRole("button", { name: /Leistungsnachweise/ }).first().click();
  await page.getByRole("button", { name: "Übergabedossier öffnen" }).click();
  const dialog = page.locator("[data-product-dialog]");
  await dialog.getByRole("heading", { name: "Übergabedossier" }).waitFor();
  await dialog.getByRole("heading", { name: "Vollständigkeitsprüfung", exact: true }).waitFor();
  await dialog.getByRole("button", { name: "Als Druckansicht" }).waitFor();
  await dialog.getByRole("button", { name: "Arbeitsprodukt schließen" }).click();

  await page.locator('[data-role="employer"]').click();
  await page.getByRole("button", { name: /^Ergebnisse/ }).first().click();
  await page.getByRole("heading", { name: "Ergebnisregister" }).waitFor();
  await page.getByRole("button", { name: "Ergebnisbrief öffnen" }).click();
  await dialog.getByRole("heading", { name: "Ergebnisbrief für den Arbeitgeber" }).waitFor();
  await dialog.getByRole("heading", { name: "Betriebliche Abnahme", exact: true }).waitFor();
  await page.screenshot({ path: documentScreenshotPath, fullPage: false });
  await dialog.getByRole("button", { name: "Arbeitsprodukt schließen" }).click();
  await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 820, height: 1050 }, { width: 390, height: 844 }]) {
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), `amavio-release-p3-${viewport.width}-`));
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
        if ((await page.title()) !== "AMAVIO Arrival Control Center | Dual Product Surfaces") fail(scope, `falscher Seitentitel: ${await page.title()}`);
        if ((await page.locator('link[rel="stylesheet"]').count()) !== 2) fail(scope, "nicht genau zwei aktive Stylesheets einschließlich lokaler Fonts");
        if ((await page.locator("script[src]").count()) !== 1) fail(scope, "nicht genau ein aktives Laufzeitskript");
        await page.getByRole("heading", { name: "Startübersicht", exact: true }).waitFor();
        if (!(await page.locator(".employer-masthead").isVisible())) fail(scope, "Arbeitgeberportal hat keinen eigenen Masthead");
        if (await page.locator(".sidebar").count()) fail(scope, "Arbeitgeberportal enthält weiterhin die Operations-Seitenleiste");
        await page.getByRole("heading", { name: "Entscheidungsposteingang" }).waitFor();
        await page.getByText("AMAVIO übernimmt", { exact: true }).waitFor();
        await page.getByText("2 unter Bedingungen · 10 nicht betroffen", { exact: true }).waitFor();
        if ((await page.locator(".decision-inbox__row").count()) !== 3) fail(scope, "Entscheidungsposteingang zeigt nicht drei Fälle");
        await noOverflow(page, `${scope}-start`);
        await page.screenshot({ path: path.join(out, `${scope}-01-start.png`), fullPage: true });

        if (viewport.width === 1440) {
          await employerToVerifiedOutcome(page, path.join(out, `${scope}-02-operations-workbench.png`), path.join(out, `${scope}-04-employer-document.png`));
          await noOverflow(page, `${scope}-verified`);
          await page.waitForTimeout(4300);
          await page.screenshot({ path: path.join(out, `${scope}-03-employer-result.png`), fullPage: true });
          await page.locator('[data-role="operations"]').click();
          await page.locator(".sidebar").waitFor({ state: "visible" });
          if (!(await page.locator(".sidebar").isVisible())) fail(scope, "Operations-Konsole hat keine sichtbare Seitenleiste");
          if (await page.locator(".employer-masthead").count()) fail(scope, "Operations-Konsole enthält weiterhin den Arbeitgeber-Masthead");
          await page.getByRole("button", { name: /Leistungsnachweise/ }).first().click();
          await page.getByRole("button", { name: /Lokalen Demo-Arbeitsstand zurücksetzen/ }).click();
          await page.getByText("Lokaler synthetischer Demo-Arbeitsstand wurde zurückgesetzt.").waitFor();
        } else {
          await page.locator('[data-role="operations"]').click();
          await page.getByRole("heading", { name: "Arbeitsvorrat", exact: true }).waitFor();
          if (viewport.width <= 900) {
            await page.locator("[data-open-menu]").click();
            await page.locator("[data-close-menu]").click({ position: { x: Math.max(1, viewport.width - 10), y: 10 } }).catch(() => page.keyboard.press("Escape"));
          }
          await page.getByRole("heading", { name: "Kein ausführbarer Auftrag" }).waitFor();
          await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
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
    console.error("Release P.3 Browser QA – FEHLER");
    failures.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }
  console.log(`Release P.3 Browser QA – OK (Arbeitgeberportal ohne Seitenleiste → Operations-Konsole mit Arbeitsvorrat → rollenspezifische Arbeitsprodukte; Desktop/Tablet/Mobil; Screenshots nur temporär: ${out})`);
})();
