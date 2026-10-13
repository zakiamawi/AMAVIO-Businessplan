const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const playwrightPath = path.resolve(__dirname, "../../../08_Website/amavio-living-site/relaunch-astro/node_modules/playwright");
const { chromium } = require(playwrightPath);

const failures = [];
const out = fs.mkdtempSync(path.join(os.tmpdir(), "amavio-release-q-browser-"));
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

async function verifyEmployerLenses(page, scope) {
  const lenses = [
    ["governance", "Gesamtsteuerung", "Entscheidungsposteingang"],
    ["hr", "Personal & Onboarding", "Interne Startvorbereitung"],
    ["location", "Standort & Übergabe", "Standortbereitschaft"],
    ["budget", "Budget & Freigaben", "Handlungsvarianten"],
  ];
  const contents = [];
  for (const [value, label, expected] of lenses) {
    await page.locator("[data-work-area]").selectOption(value);
    await page.locator(`[data-employer-lens="${value}"]`).waitFor();
    await page.getByText(expected, { exact: true }).first().waitFor();
    const text = await page.locator("#main-content").innerText();
    contents.push(text.replace(/\s+/g, " ").trim());
    if (!text.toLocaleLowerCase("de").includes(label.toLocaleLowerCase("de"))) {
      fail(`${scope}-${value}`, `Arbeitsbereich ${label} ist nicht sichtbar verankert.`);
    }
  }
  if (new Set(contents).size !== 4) fail(scope, "Die vier Arbeitgeber-Arbeitsbereiche liefern keine vier unterschiedlichen Inhaltsprojektionen.");
  await page.locator("[data-work-area]").selectOption("governance");
  await page.locator('[data-employer-lens="governance"]').waitFor();
}

async function verifyOperationsViews(page, scope) {
  await page.getByRole("button", { name: "Zu AMAVIO Operations" }).click();
  const clickNav = async (name) => {
    if (Number(scope) <= 900) await page.locator("[data-open-menu]").click();
    await page.getByRole("button", { name }).first().click();
  };
  const views = [
    [/^Arbeitsvorrat/, "queue", "Operative Eingangslage"],
    [/^Aktive Aufträge/, "active", "Aktive Aufträge bearbeiten"],
    [/^Übergabebereit/, "handover", "Ergebnisse fachlich abschließen"],
    [/^Leistungsnachweise/, "evidence", "Leistungsnachweise und Dossiers"],
  ];
  const contents = [];
  for (const [name, view, expected] of views) {
    await clickNav(name);
    await page.locator(`[data-operations-view="${view}"]`).waitFor();
    await page.getByText(expected, { exact: true }).first().waitFor();
    contents.push((await page.locator("#main-content").innerText()).replace(/\s+/g, " ").trim());
  }
  if (new Set(contents).size !== 4) fail(scope, "Die vier Operations-Bereiche liefern keine vier unterschiedlichen Arbeitsflächen.");
  await clickNav(/^Arbeitsvorrat/);
  await page.locator('[data-operations-view="queue"]').waitFor();
  for (const [tabName, panel] of [["Übersicht", "overview"], ["Aufgaben", "tasks"], ["Nachweise", "evidence"], ["Klärungen", "communication"], ["Verlauf", "history"]]) {
    await page.getByRole("tab", { name: tabName, exact: true }).click();
    await page.locator(`[data-order-panel="${panel}"]`).waitFor();
  }
  await page.getByRole("tab", { name: "Übersicht", exact: true }).click();
  await page.locator('[data-order-panel="overview"]').waitFor();
}

async function completeGoldenJourney(page, screenshotPath, documentScreenshotPath) {
  await page.getByRole("tab", { name: "Zum Arbeitgeberportal" }).click();
  await page.getByRole("button", { name: /^Startübersicht/ }).first().click();
  await page.locator("[data-work-area]").selectOption("governance");
  await page.getByRole("button", { name: "Entscheidung bearbeiten" }).click();
  await page.getByRole("heading", { name: "Entscheidungen", exact: true }).waitFor();
  const recommended = page.locator('.option-row[data-recommended="true"]');
  await recommended.getByRole("button", { name: "Option wählen" }).click();
  await page.locator("[data-authorize-form]").waitFor();
  await page.locator("#decision-rationale").fill("Die empfohlene Option hält den synthetischen Arbeitsstart bei nachvollziehbarem Aufwand stabil.");
  await page.locator('[name="confirmSynthetic"]').check();
  await page.locator("[data-authorize-form]").getByRole("button", { name: "Auftrag an AMAVIO übergeben" }).click();
  await page.getByText("SYN-AO-HOUSING-001", { exact: true }).waitFor();

  await page.getByRole("button", { name: "Zu AMAVIO Operations" }).click();
  await page.locator('[data-operations-view="active"]').waitFor();
  await page.getByRole("button", { name: "Auftrag übernehmen" }).click();
  await page.getByText("In Bearbeitung", { exact: true }).first().waitFor();
  await page.getByRole("tab", { name: "Aufgaben", exact: true }).click();
  await page.locator('[data-order-panel="tasks"]').waitFor();
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
  await page.getByRole("heading", { name: "Aktuell ist kein Auftrag in Bearbeitung", exact: true }).waitFor();
  await page.getByRole("button", { name: /^Übergabebereit/ }).first().click();
  await page.locator('[data-operations-view="handover"]').waitFor();
  await page.getByText("SYN-AO-HOUSING-001", { exact: true }).waitFor();

  await page.getByRole("button", { name: /^Leistungsnachweise/ }).first().click();
  await page.locator('[data-operations-view="evidence"]').waitFor();
  await page.getByRole("button", { name: "Übergabedossier öffnen" }).click();
  const dialog = page.locator("[data-product-dialog]");
  await dialog.getByRole("heading", { name: "Übergabedossier" }).waitFor();
  await dialog.getByRole("heading", { name: "Vollständigkeitsprüfung", exact: true }).waitFor();
  await dialog.getByRole("button", { name: "Arbeitsprodukt schließen" }).click();

  await page.getByRole("tab", { name: "Zum Arbeitgeberportal" }).click();
  await page.getByRole("heading", { name: "Ergebnisregister" }).waitFor();
  await page.getByRole("button", { name: "Ergebnisbrief öffnen" }).click();
  await dialog.getByRole("heading", { name: "Ergebnisbrief für den Arbeitgeber" }).waitFor();
  await page.screenshot({ path: documentScreenshotPath, fullPage: false });
  await dialog.getByRole("button", { name: "Arbeitsprodukt schließen" }).click();
}

(async () => {
  const { createApplication } = await import("../backend/server.mjs");
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 820, height: 1050 }, { width: 390, height: 844 }]) {
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), `amavio-release-q-${viewport.width}-`));
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
        if ((await page.title()) !== "AMAVIO Arrival Control Center | True Workspaces") fail(scope, `falscher Seitentitel: ${await page.title()}`);
        await page.locator('[data-employer-lens="governance"]').waitFor();
        await verifyEmployerLenses(page, scope);
        await page.evaluate(() => {
          window.scrollTo(0, 0);
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        });
        await page.screenshot({ path: path.join(out, `${scope}-00-employer.png`), fullPage: true });
        await verifyOperationsViews(page, scope);
        await noOverflow(page, `${scope}-operations`);
        await page.screenshot({ path: path.join(out, `${scope}-01-operations.png`), fullPage: true });

        if (viewport.width === 1440) {
          await completeGoldenJourney(page, path.join(out, `${scope}-02-active-order.png`), path.join(out, `${scope}-03-employer-result.png`));
          await noOverflow(page, `${scope}-verified`);
          await page.getByRole("button", { name: "Zu AMAVIO Operations" }).click();
          await page.getByRole("button", { name: /^Leistungsnachweise/ }).first().click();
          await page.getByRole("button", { name: /Lokalen Demo-Arbeitsstand zurücksetzen/ }).click();
          await page.getByText("Lokaler synthetischer Demo-Arbeitsstand wurde zurückgesetzt.").waitFor();
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
    console.error("Release Q Browser QA – FEHLER");
    failures.forEach((item) => console.error(`- ${item}`));
    process.exit(1);
  }
  console.log(`Release Q Browser QA – OK (vier Arbeitgeberperspektiven, vier Operations-Bereiche, fünf Auftragsregister und vollständige Golden Journey; Screenshots temporär: ${out})`);
})();
