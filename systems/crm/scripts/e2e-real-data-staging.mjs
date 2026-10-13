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

await withCrmServer(4394, async (baseUrl) => {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  try {
    const health = await (await fetch(`${baseUrl}/api/health`)).json();
    assert.equal(health.syntheticCoreOnly, true);
    assert.equal(health.realDataStagingEnabled, true);
    assert.equal(health.outboundEnabled, false);
    assert.equal(health.cloudSyncEnabled, false);
    assert.equal(health.supabaseEnabled, false);

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Altdaten-Staging", exact: true }).click();
    await page.getByRole("heading", { name: "Altdaten-Pool", exact: true }).waitFor();
    await page.getByText("2.242", { exact: true }).first().waitFor();
    await page.getByText("3.213", { exact: true }).first().waitFor();
    await page.getByText("192 Organisationen · 166 Kontakte · 238 Zuordnungen", { exact: true }).waitFor();

    await page.getByRole("button", { name: "Bestätigt aktuell", exact: true }).click();
    await page.getByText("166 Treffer", { exact: true }).waitFor();
    await page.getByLabel("Datenqualität").selectOption("name_review");
    await page.getByText("48 Treffer", { exact: true }).waitFor();
    await page.locator(".staging-table tbody tr").first().click();
    const detail = page.getByRole("dialog");
    await detail.getByText("Nicht kontaktieren", { exact: true }).waitFor();
    await detail.getByText(/outreachEligibility = blocked/).waitFor();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Prüfqueue / Quarantäne", exact: true }).click();
    await page.getByText("407 Treffer", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Quarantäne (93)", exact: true }).click();
    await page.getByText("93 Treffer", { exact: true }).waitFor();

    await page.getByRole("button", { name: "Quellen / Sperren", exact: true }).click();
    await page.getByRole("heading", { name: "Sieben einzeln bewertete Arbeitsblätter", exact: true }).waitFor();
    assert.equal(await page.locator(".source-ledger article").count(), 7);
    assert.equal(await page.locator(".duplicate-ledger article").count(), 6);

    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Altdaten-Staging", exact: true }).click();
    await page.getByRole("heading", { name: "Altdaten-Pool", exact: true }).waitFor();
    await page.getByText("2.242", { exact: true }).first().waitFor();
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

console.log("AMAVIO One CRM R3.15 Echtdaten-Staging E2E: OK");
console.log("- lokaler Pool, bestätigter Bestand, 48 Namensprüfungen, 407er-Queue und 93 Quarantänehinweise sichtbar");
console.log("- Detailansicht bestätigt Kontaktsperre; Reload erhält den getrennten lokalen Bestand");
console.log("- kein Versand, kein Cloud-Sync und kein Supabase-Pfad aktiviert");
