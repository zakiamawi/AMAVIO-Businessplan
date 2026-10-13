import assert from "node:assert/strict";
import { chromium } from "playwright";
import { withCrmServer } from "./server-harness.mjs";

const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true, executablePath: systemChrome });
  } catch (error) {
    if (!String(error.message || "").includes("SIGABRT")) throw error;
    return chromium.launch({ headless: true });
  }
}

await withCrmServer(4398, async (baseUrl) => {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));

  try {
    const health = await (await fetch(`${baseUrl}/api/health`)).json();
    assert.equal(health.importedRecordsEnabled, true);
    assert.equal(health.importedRecordsMode, "local-read-only");
    assert.equal(health.outboundEnabled, false);
    assert.equal(health.cloudSyncEnabled, false);
    assert.equal(health.supabaseEnabled, false);

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("button", { name: "Altdaten-Staging", exact: true }).count(), 0);

    await page.keyboard.press("Control+K");
    const globalSearch = page.getByRole("dialog", { name: "CRM durchsuchen" });
    await globalSearch.waitFor();
    const globalSearchInput = globalSearch.getByLabel("Alle CRM-Objekte durchsuchen");
    await globalSearchInput.fill("Adesso SE");
    await globalSearch.getByText("Importierte Organisation", { exact: true }).first().waitFor();
    await globalSearch.getByRole("button", { name: /Importierte Organisation.*Adesso SE/i }).first().click();
    const globalOrganizationDialog = page.getByRole("dialog", { name: "Adesso SE" });
    await globalOrganizationDialog.waitFor();
    await page.getByRole("heading", { name: "Organisationen", exact: true }).waitFor();
    await page.keyboard.press("Escape");

    await page.keyboard.press("Control+K");
    await globalSearchInput.fill("Kristin Assmann");
    await globalSearch.getByText("Importierter Kontakt", { exact: true }).first().waitFor();
    await globalSearch.getByRole("button", { name: /Importierter Kontakt.*Kristin Assmann/i }).filter({ hasText: "LWL Klinik Marl-Sinsen Tagesklinik Recklinghausen" }).first().click();
    const globalContactDialog = page.getByRole("dialog", { name: "Kristin Assmann" });
    await globalContactDialog.getByText("Nicht kontaktieren", { exact: true }).waitFor();
    await page.getByRole("heading", { name: "Kontakte", exact: true }).waitFor();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Organisationen", exact: true }).click();
    await page.getByRole("heading", { name: "Organisationen", exact: true }).waitFor();
    await page.getByLabel("Organisationen nach Datenquelle filtern").selectOption("imported");
    await page.getByText("2.242 Organisationen", { exact: true }).waitFor();
    const organizationSearch = page.getByPlaceholder("Organisation, Segment oder Region …");
    await organizationSearch.fill("Adesso SE");
    await page.getByRole("button", { name: /Adesso SE/ }).click();
    const organizationDialog = page.getByRole("dialog");
    await organizationDialog.getByRole("heading", { name: "Adesso SE", exact: true }).waitFor();
    await organizationDialog.getByText("Importierter CRM-Eintrag · lokal und schreibgeschützt", { exact: true }).waitFor();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Kontakte", exact: true }).click();
    await page.getByRole("heading", { name: "Kontakte", exact: true }).waitFor();
    await page.getByLabel("Kontakte nach Datenquelle filtern").selectOption("imported");
    await page.getByText("3.213 Kontakte", { exact: true }).waitFor();
    const contactSearch = page.getByPlaceholder("Name, Organisation, Funktion oder E-Mail …");
    await contactSearch.fill("Kristin Assmann");
    await page.getByRole("button", { name: /Kristin Assmann/ }).filter({ hasText: "LWL Klinik Marl-Sinsen Tagesklinik Recklinghausen" }).first().click();
    const contactDialog = page.getByRole("dialog");
    await contactDialog.getByRole("heading", { name: "Kristin Assmann", exact: true }).waitFor();
    await contactDialog.getByText("Nicht kontaktieren", { exact: true }).waitFor();
    await contactDialog.getByText(/keine Outreach-Freigabe/).waitFor();
    await page.keyboard.press("Escape");

    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

console.log("AMAVIO One CRM R3.17 Einheitliche globale Suche E2E: OK");
console.log("- kein eigener Pool- oder Staging-Reiter im CRM");
console.log("- 2.242 importierte Organisationen im Reiter Organisationen");
console.log("- 3.213 importierte Kontakte im Reiter Kontakte");
console.log("- globale Suche navigiert zu Organisationen/Kontakten und öffnet die reguläre schreibgeschützte Detailansicht");
console.log("- Bereichssuche, Detailansicht und Kontaktsperre geprüft; Versand und Cloud bleiben deaktiviert");
