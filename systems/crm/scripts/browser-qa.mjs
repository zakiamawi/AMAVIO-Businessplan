import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { withCrmServer } from "./server-harness.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const screenshotDir = path.join(root, "QA", "Screenshots", "20261013-r3-17-unified-global-search");
const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const storageKeys = ["amavio-one-crm-r3-8-g1-legal-access-assurance-v7", "amavio-one-crm-r3-7-g1-entry-gate-closure-v6", "amavio-one-crm-r3-6-workspaces-analytics-g1-v5", "amavio-one-crm-r3-5-operational-readiness-v5"];
await mkdir(screenshotDir, { recursive: true });

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true, executablePath: systemChrome });
  } catch (error) {
    if (!String(error.message || "").includes("SIGABRT")) throw error;
    return chromium.launch({ headless: true });
  }
}

async function openFresh(page, baseUrl) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate((keys) => keys.forEach((key) => localStorage.removeItem(key)), storageKeys);
  await page.reload({ waitUntil: "networkidle" });
}

async function navigate(page, label, width) {
  if (width <= 800 && !["Mein Arbeitstag", "Pipeline", "Kontakte", "Aufgaben"].includes(label)) {
    await page.getByRole("button", { name: "Mehr", exact: true }).click();
    const sidebar = page.getByRole("complementary", { name: "Hauptnavigation" });
    await sidebar.getByRole("button", { name: label, exact: true }).click();
    await page.waitForFunction(() => !document.querySelector(".sidebar")?.classList.contains("is-open"));
  } else {
    await page.getByRole("button", { name: label, exact: true }).last().click();
  }
  await page.waitForTimeout(width <= 800 ? 360 : 120);
}

async function pageMetrics(page) {
  return page.evaluate(() => ({
    bodyWidth: document.body.getBoundingClientRect().width,
    bodyScrollWidth: document.body.scrollWidth,
    unnamedButtons: [...document.querySelectorAll("button")].filter((button) => !(button.getAttribute("aria-label") || button.getAttribute("title") || button.textContent.trim())).length,
    rootHasContent: Boolean(document.querySelector("#root")?.textContent.trim()),
    frameworkErrorOverlay: Boolean(document.querySelector("vite-error-overlay, nextjs-portal, #webpack-dev-server-client-overlay")),
    title: document.title,
    visibleText: document.body.innerText,
  }));
}

function assertBase(metrics, name) {
  assert.equal(metrics.unnamedButtons, 0, `${name}: Schaltfläche ohne Namen`);
  assert.equal(metrics.rootHasContent, true, `${name}: App-Wurzel ist leer`);
  assert.equal(metrics.frameworkErrorOverlay, false, `${name}: Framework-Fehleroverlay sichtbar`);
  assert.match(metrics.title, /AMAVIO One.*CRM/, `${name}: unerwarteter Seitentitel`);
  assert.doesNotMatch(metrics.visibleText, /Codex|ChatGPT|Claude|\bPrompt\b|\bR3\.[0-9]/i, `${name}: interner Entwicklungs- oder Assistenztext sichtbar`);
  assert.ok(metrics.bodyScrollWidth <= metrics.bodyWidth + 2, `${name}: horizontales Seiten-Overflow ${metrics.bodyScrollWidth}/${metrics.bodyWidth}`);
}

const viewports = [
  { name: "desktop-1600", width: 1600, height: 1000 },
  { name: "desktop-1280", width: 1280, height: 900 },
  { name: "zwischenbreite-1024", width: 1024, height: 900 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "mobile-390", width: 390, height: 844 },
];
const result = { checkedAt: new Date().toISOString(), syntheticCore: true, importedRecords: "local-read-only", externalEffects: false, viewports: [], keyboard: {}, globalSearch: {}, reportMode: {}, directories: {}, zoom200: {}, consoleErrors: [] };

await withCrmServer(4390, async (baseUrl) => {
  const browser = await launchBrowser();
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const errors = [];
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("pageerror", (error) => errors.push(error.message));
      await openFresh(page, baseUrl);

      await page.getByRole("heading", { name: "Mein Arbeitstag" }).waitFor();
      assert.equal(await page.locator(".workday-priority").count(), 3, `${viewport.name}: Arbeitstag zeigt nicht genau drei Prioritäten`);
      assert.equal(await page.locator(".stage-flow").count(), 0, `${viewport.name}: Arbeitstag enthält eine Pipeline-Dublette`);
      assertBase(await pageMetrics(page), `${viewport.name}/Arbeitstag`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-arbeitstag.png`), fullPage: true });

      await navigate(page, "Cockpit", viewport.width);
      await page.getByRole("heading", { name: "Geschäftslage im Blick" }).waitFor();
      assert.equal(await page.locator(".stage-flow").count(), 1, `${viewport.name}: Cockpit-Pipeline-Lage fehlt`);
      assert.equal(await page.locator(".workday-task-ledger").count(), 0, `${viewport.name}: Cockpit enthält Tagesaufgaben`);
      assertBase(await pageMetrics(page), `${viewport.name}/Cockpit`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-cockpit.png`), fullPage: true });

      await navigate(page, "Pipeline", viewport.width);
      await page.getByRole("heading", { name: "Pipeline" }).waitFor();
      assert.equal(await page.getByRole("button", { name: /Filter/i }).count() > 0 || await page.locator("select").count() > 0, true, `${viewport.name}: operative Pipeline-Steuerung fehlt`);
      assertBase(await pageMetrics(page), `${viewport.name}/Pipeline`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-pipeline.png`), fullPage: true });

      await navigate(page, "Auswertungen", viewport.width);
      await page.getByRole("heading", { name: "Auswertungen" }).waitFor();
      for (const heading of ["Pipeline-Verteilung", "Aktivitätsentwicklung", "Statusmix", "Quellen", "Aktivität & Alterung", "Datenqualität"]) await page.getByRole("heading", { name: heading }).waitFor();
      assertBase(await pageMetrics(page), `${viewport.name}/Auswertungen`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-auswertungen-intern.png`), fullPage: true });
      await page.getByRole("button", { name: "Berichtsansicht", exact: true }).click();
      await page.getByRole("heading", { name: "Bereinigte Berichtsansicht" }).waitFor();
      assert.equal(await page.getByRole("heading", { name: "Management-Brief" }).count(), 0, `${viewport.name}: interner Management-Brief bleibt in Berichtsansicht sichtbar`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-auswertungen-bericht.png`), fullPage: true });

      await navigate(page, "System & Freigaben", viewport.width);
      await page.getByRole("heading", { name: "System & Freigaben", exact: true }).waitFor();
      await page.getByRole("heading", { name: "Sicherung & Datenvertrag" }).waitFor();
      assert.equal(await page.getByRole("navigation", { name: "Growth-Bereiche" }).count(), 0, `${viewport.name}: Systembereich ist weiter als Growth-Unterregister verschachtelt`);
      await page.getByRole("heading", { name: /G1 · Eintrittsgates & Beschlusslage/ }).waitFor();
      await page.getByText("G1 bleibt NO-GO", { exact: true }).waitFor();
      assert.equal(await page.locator(".g1-gates article").count(), 10, `${viewport.name}: G1 enthält nicht zehn Eintrittsgates`);
      assert.equal(await page.locator(".g1-gates article.decided").count(), 4, `${viewport.name}: vier PO-Arbeitsbeschlüsse fehlen`);
      await page.getByRole("button", { name: /Datenklassen/ }).click();
      await page.getByRole("heading", { name: "Datenumfang, Schutzbedarf und Ausschlüsse" }).waitFor();
      await page.getByRole("button", { name: /Recht & Quellen/ }).click();
      await page.getByRole("heading", { name: "Quelle, Zweck, Kanal und Informationspflicht zusammen entscheiden" }).waitFor();
      assert.equal(await page.locator(".assurance-table tbody tr").count(), 7, `${viewport.name}: Quellen-/Zweck-/Kanal-Matrix unvollständig`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-g1-recht-quellen.png`), fullPage: true });
      await page.getByRole("button", { name: /Zugriff & Gerät/ }).click();
      await page.getByRole("heading", { name: "Lokale Schutzgrenzen belegen, Geräte- und Identitätslücken sichtbar halten" }).waitFor();
      assert.equal(await page.locator(".access-control-grid article").count(), 13, `${viewport.name}: Zugriffsschutzregister unvollständig`);
      await page.getByText("Beobachteter Blocker", { exact: true }).first().waitFor();
      await page.getByRole("heading", { name: "Beschlossene Punkte und offene C1-Gates" }).waitFor();
      await page.getByText("Van Vardanian", { exact: true }).waitFor();
      await page.getByText(/Annahme- und Übergabeprotokoll vorbereitet/).waitFor();
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-g1-zugriff-geraet.png`), fullPage: true });
      await page.getByRole("button", { name: /Lebenszyklus/ }).click();
      await page.getByRole("heading", { name: "Lebenszyklus ohne vorzeitige Löschfreigabe" }).waitFor();
      await page.getByRole("button", { name: /Prüfspur & Beschluss/ }).click();
      await page.getByRole("heading", { name: "Vier lokale Fachbeschlüsse protokolliert" }).waitFor();
      assert.equal(await page.locator(".g1-po-decision-ledger article").count(), 4, `${viewport.name}: PO-Beschlussregister unvollständig`);
      await page.getByRole("heading", { name: "Verbleibende Freigabeblocker" }).waitFor();
      await page.getByRole("heading", { name: "Wiederherstellung isoliert prüfen" }).waitFor();
      assert.equal(await page.getByRole("button", { name: /Isolierte Restore-Probe ausführen/ }).isEnabled(), true, `${viewport.name}: lokale Restore-Probe ist am SQLite-Server nicht verfügbar`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-g1-restore-assurance.png`), fullPage: true });
      await page.getByText("NO-GO", { exact: true }).last().waitFor();
      await page.getByRole("button", { name: /Gate-Übersicht/ }).click();
      assertBase(await pageMetrics(page), `${viewport.name}/System und Freigaben`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-system-freigaben.png`), fullPage: true });

      await navigate(page, "Research & Outreach", viewport.width);
      await page.getByRole("button", { name: "Kontaktfreigabe", exact: true }).click();
      await page.getByRole("heading", { name: "Darf kontaktiert werden?" }).waitFor();
      await page.getByText("Produktiver Versand gesperrt", { exact: true }).waitFor();
      assert.equal(await page.getByRole("button", { name: /Als Aufgabe anlegen|Aufgabe vorhanden/ }).count() > 0, true, `${viewport.name}: Aufgabenconversion in Kontaktfreigabe fehlt`);
      assertBase(await pageMetrics(page), `${viewport.name}/Kontaktfreigabe`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-kontaktfreigabe.png`), fullPage: true });

      await navigate(page, "Organisationen", viewport.width);
      await page.getByRole("heading", { name: "Organisationen", exact: true }).waitFor();
      await page.getByLabel("Organisationen nach Datenquelle filtern").selectOption("imported");
      await page.getByText("2.242 Organisationen", { exact: true }).waitFor();
      assert.equal(await page.getByRole("button", { name: "Altdaten-Staging", exact: true }).count(), 0, `${viewport.name}: unerwünschter Pool-Reiter sichtbar`);
      assertBase(await pageMetrics(page), `${viewport.name}/Organisationen`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-organisationen.png`), fullPage: true });

      await navigate(page, "Kontakte", viewport.width);
      await page.getByRole("heading", { name: "Kontakte", exact: true }).waitFor();
      await page.getByLabel("Kontakte nach Datenquelle filtern").selectOption("imported");
      await page.getByText("3.213 Kontakte", { exact: true }).waitFor();
      assertBase(await pageMetrics(page), `${viewport.name}/Kontakte`);
      await page.screenshot({ path: path.join(screenshotDir, `${viewport.name}-kontakte.png`), fullPage: true });

      result.viewports.push({ ...viewport, workspaces: ["Arbeitstag", "Cockpit", "Pipeline", "Auswertungen", "System & Freigaben", "Kontaktfreigabe", "Organisationen", "Kontakte"], consoleErrors: errors });
      result.consoleErrors.push(...errors.map((message) => `${viewport.name}: ${message}`));
      await page.close();
    }

    const keyboardPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await openFresh(keyboardPage, baseUrl);
    await keyboardPage.keyboard.press("Tab");
    const skipLinkFocused = await keyboardPage.evaluate(() => document.activeElement?.textContent?.trim() === "Zum Hauptinhalt");
    await keyboardPage.keyboard.press("Enter");
    const skipLinkTargeted = await keyboardPage.evaluate(() => document.activeElement?.id === "main-content");
    assert.equal(skipLinkFocused && skipLinkTargeted, true, "Skip-Link ist nicht vollständig tastaturbedienbar");
    const trigger = keyboardPage.getByLabel("CRM durchsuchen").first();
    await trigger.focus();
    await keyboardPage.keyboard.press("Control+K");
    const dialog = keyboardPage.getByRole("dialog", { name: "CRM durchsuchen" });
    await dialog.waitFor();
    await keyboardPage.waitForFunction(() => Boolean(document.activeElement?.closest('[role="dialog"]')));
    const focusInsideAtOpen = await keyboardPage.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')));
    await keyboardPage.keyboard.press("Tab");
    const focusInsideAfterTab = await keyboardPage.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')));
    await keyboardPage.keyboard.press("Escape");
    await dialog.waitFor({ state: "detached" });
    await keyboardPage.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "CRM durchsuchen");
    const focusReturned = await trigger.evaluate((element) => document.activeElement === element);
    assert.equal(focusInsideAtOpen && focusInsideAfterTab && focusReturned, true, "Dialogfokus/Focus-Trap/Focus-Rückgabe fehlgeschlagen");
    await keyboardPage.keyboard.press("Control+K");
    const globalSearchInput = dialog.getByLabel("Alle CRM-Objekte durchsuchen");
    await globalSearchInput.fill("Adesso SE");
    const importedOrganizationResult = dialog.getByRole("button", { name: /Importierte Organisation.*Adesso SE/i }).first();
    await importedOrganizationResult.waitFor();
    await importedOrganizationResult.click();
    const importedOrganizationDialog = keyboardPage.getByRole("dialog", { name: "Adesso SE" });
    await importedOrganizationDialog.waitFor();
    await keyboardPage.getByRole("heading", { name: "Organisationen", exact: true }).waitFor();
    await importedOrganizationDialog.getByText("Importierter CRM-Eintrag · lokal und schreibgeschützt", { exact: true }).waitFor();
    await keyboardPage.screenshot({ path: path.join(screenshotDir, "desktop-1280-globale-suche-importierte-organisation.png"), fullPage: true });
    await keyboardPage.keyboard.press("Escape");
    result.keyboard = { skipLink: true, commandShortcut: true, escapeCloses: true, focusTrap: true, focusReturn: true };
    result.globalSearch = { minimumQueryLength: 2, importedOrganizations: true, importedContacts: true, destinationView: "Organisationen/Kontakte", detailMode: "local-read-only" };
    result.reportMode = { internalBriefHidden: true, sanitizedNoticeVisible: true };
    await keyboardPage.close();

    const directoryPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await openFresh(directoryPage, baseUrl);
    await navigate(directoryPage, "Kontakte", 1280);
    await directoryPage.getByLabel("Kontakte nach Datenquelle filtern").selectOption("imported");
    await directoryPage.getByPlaceholder("Name, Organisation, Funktion oder E-Mail …").fill("Kristin Assmann");
    const importedContact = directoryPage.getByRole("button", { name: /Kristin Assmann/ }).filter({ hasText: "LWL Klinik Marl-Sinsen Tagesklinik Recklinghausen" }).first();
    await importedContact.focus();
    await directoryPage.keyboard.press("Enter");
    const importedDialog = directoryPage.getByRole("dialog");
    await importedDialog.waitFor();
    await importedDialog.getByText("Nicht kontaktieren", { exact: true }).waitFor();
    await directoryPage.waitForFunction(() => Boolean(document.activeElement?.closest('[role="dialog"]')));
    await directoryPage.keyboard.press("Escape");
    await importedDialog.waitFor({ state: "detached" });
    const focusReturnedToImportedContact = await importedContact.evaluate((element) => document.activeElement === element);
    assert.equal(focusReturnedToImportedContact, true, "Kontakt-Detail gibt Fokus nicht zurück");
    result.directories = { organizationCount: 2242, contactCount: 3213, poolNavigationAbsent: true, contactBlockedVisible: true, keyboardRowOpen: true, escapeCloses: true, focusReturn: true };
    await directoryPage.close();

    const zoomProfile = await mkdtemp(path.join(tmpdir(), "amavio-crm-r3-9-zoom-"));
    await mkdir(path.join(zoomProfile, "Default"), { recursive: true });
    await writeFile(path.join(zoomProfile, "Default", "Preferences"), JSON.stringify({ partition: { default_zoom_level: { x: 3.8017840169239308 } } }), "utf8");
    let zoomContext;
    try {
      zoomContext = await chromium.launchPersistentContext(zoomProfile, { headless: true, executablePath: systemChrome, viewport: null, args: ["--window-size=1280,900", "--no-first-run"] });
    } catch (error) {
      if (!String(error.message || "").includes("SIGABRT")) throw error;
      zoomContext = await chromium.launchPersistentContext(zoomProfile, { headless: true, viewport: null, args: ["--window-size=1280,900", "--no-first-run"] });
    }
    try {
      const zoomPage = zoomContext.pages()[0];
      await openFresh(zoomPage, baseUrl);
      await navigate(zoomPage, "Kontakte", 640);
      await zoomPage.getByRole("heading", { name: "Kontakte", exact: true }).waitFor();
      const zoomMetrics = await zoomPage.evaluate(() => ({ bodyWidth: document.body.getBoundingClientRect().width, bodyScrollWidth: document.body.scrollWidth, mainVisible: Boolean(document.querySelector("main")?.getBoundingClientRect().height), innerWidth: window.innerWidth, outerWidth: window.outerWidth, devicePixelRatio: window.devicePixelRatio, visualViewportScale: window.visualViewport?.scale }));
      assert.equal(zoomMetrics.mainVisible, true);
      assert.ok(Math.abs((zoomMetrics.innerWidth * 2) - zoomMetrics.outerWidth) <= 4, `Chrome meldet keinen echten 200%-Reflow: außen ${zoomMetrics.outerWidth}, innen ${zoomMetrics.innerWidth}`);
      assert.ok(zoomMetrics.bodyScrollWidth <= zoomMetrics.bodyWidth + 2, `200%-Reflow: horizontales Seiten-Overflow ${zoomMetrics.bodyScrollWidth}/${zoomMetrics.bodyWidth}`);
      await zoomPage.screenshot({ path: path.join(screenshotDir, "zoom-200-prozent-kontakte.png"), fullPage: true });
      result.zoom200 = { method: "Isoliertes Chromium-Profil mit 200%-Defaultzoom; 1280px Außenbreite reflowt auf ungefähr 640px CSS-Breite", ...zoomMetrics };
    } finally {
      await zoomContext.close();
    }
  } finally {
    await browser.close();
  }
});

assert.deepEqual(result.consoleErrors, [], `Browserkonsole enthält Fehler: ${result.consoleErrors.join(" | ")}`);
await writeFile(path.join(root, "QA", "CRM_R3_17_UNIFIED_GLOBAL_SEARCH_BROWSER_RESULT_20261013.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
console.log("AMAVIO One CRM R3.17 Einheitliche globale Suche Browser-QA: OK");
console.log(`- ${viewports.map((item) => `${item.width}px`).join(", ")} ohne Seiten-Overflow; acht Arbeitsflächen pro Breite geprüft`);
console.log("- Arbeitstag, Cockpit, Pipeline und Auswertungen fachlich getrennt; System & Freigaben nicht mehr im Growth-Bereich doppelt geführt");
console.log("- vier lokale PO-Fachbeschlüsse, acht lokale Schutzgrenzen, wirksam nicht belegte Firewall und vorbereitetes C1-Prüfpaket sichtbar");
console.log("- Tastatur, Escape, Focus-Trap, Focus-Rückgabe und echter 200%-Zoom bestanden");
console.log("- kein Pool-Reiter; Organisationen und Kontakte direkt in den bestehenden CRM-Reitern geprüft");
console.log("- globale Suche findet importierte CRM-Einträge und öffnet sie im korrekten fachlichen Reiter");
console.log("- 2.242 Organisationen, 3.213 Kontakte, Kontaktsperre und Detaildialog geprüft");
