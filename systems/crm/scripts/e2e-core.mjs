import assert from "node:assert/strict";
import { chromium } from "playwright";
import { withCrmServer } from "./server-harness.mjs";

const systemChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const cachedBrowsers = [
  "/Users/zakia/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell",
  "/Users/zakia/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell",
];

async function launchBrowser() {
  const errors = [];
  for (const executablePath of [systemChrome, ...cachedBrowsers]) {
    try {
      return await chromium.launch({ headless: true, executablePath });
    } catch (error) {
      errors.push(`${executablePath}: ${error.message}`);
    }
  }
  try {
    return await chromium.launch({ headless: true });
  } catch (error) {
    errors.push(`playwright-managed: ${error.message}`);
    throw new Error(`Kein lokaler Chromium-Start möglich.\n${errors.join("\n")}`);
  }
}

await withCrmServer(4362, async (baseUrl) => {
  const browser = await launchBrowser();
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      localStorage.removeItem("amavio-one-crm-r3-8-g1-legal-access-assurance-v7");
      localStorage.removeItem("amavio-one-crm-r3-7-g1-entry-gate-closure-v6");
      localStorage.removeItem("amavio-one-crm-r3-6-workspaces-analytics-g1-v5");
      localStorage.removeItem("amavio-one-crm-r3-5-operational-readiness-v5");
    });
    await page.reload({ waitUntil: "networkidle" });

    // 0. R3.6 trennt Arbeitstag, Cockpit und Pipeline; Auswertungen und G1 bleiben faktenbasiert und gesperrt.
    await page.getByRole("heading", { name: "Mein Arbeitstag" }).waitFor();
    assert.equal(await page.locator(".workday-priority").count(), 3);
    assert.equal(await page.locator(".stage-flow").count(), 0);
    await page.getByRole("button", { name: "Cockpit", exact: true }).click();
    await page.getByRole("heading", { name: "Geschäftslage im Blick" }).waitFor();
    await page.getByRole("heading", { name: "Pipeline-Lage" }).waitFor();
    assert.equal(await page.locator(".workday-task-ledger").count(), 0);
    await page.getByRole("button", { name: "Auswertungen", exact: true }).click();
    await page.getByRole("heading", { name: "Pipeline-Verteilung" }).waitFor();
    await page.getByRole("button", { name: "Berichtsansicht", exact: true }).click();
    await page.getByRole("heading", { name: "Bereinigte Berichtsansicht" }).waitFor();
    assert.equal(await page.getByRole("heading", { name: "Management-Brief" }).count(), 0);
    await page.getByRole("button", { name: "System & Freigaben", exact: true }).click();
    await page.getByRole("heading", { name: "System & Freigaben", exact: true }).waitFor();
    assert.equal(await page.getByRole("navigation", { name: "Growth-Bereiche" }).count(), 0);
    await page.getByRole("heading", { name: "G1 · Eintrittsgates & Beschlusslage" }).waitFor();
    await page.getByText("G1 bleibt NO-GO", { exact: true }).waitFor();
    assert.equal(await page.locator(".g1-gates article.decided").count(), 4);
    await page.getByRole("button", { name: /Lokale Prüfungen ausführen/ }).click();
    await page.getByText(/G1-Kontrollsuite lokal-synthetisch abgeschlossen/).waitFor();
    await page.getByRole("button", { name: /Prüfspur & Beschluss/ }).click();
    await page.getByRole("heading", { name: "Vier lokale Fachbeschlüsse protokolliert" }).waitFor();
    assert.equal(await page.locator(".g1-po-decision-ledger article").count(), 4);
    await page.getByRole("heading", { name: "Synthetische Prüfprotokolle" }).waitFor();
    assert.equal(await page.locator(".g1-run-ledger article").count(), 6);
    await page.getByRole("heading", { name: "Wiederherstellung isoliert prüfen" }).waitFor();
    assert.equal(await page.getByRole("button", { name: /Isolierte Restore-Probe ausführen/ }).isEnabled(), true);
    await page.getByRole("button", { name: /Recht & Quellen/ }).click();
    await page.getByRole("heading", { name: "Quelle, Zweck, Kanal und Informationspflicht zusammen entscheiden" }).waitFor();
    await page.getByText("Produktive Kontaktaufnahme bleibt gesperrt", { exact: true }).waitFor();
    await page.getByRole("button", { name: /Zugriff & Gerät/ }).click();
    await page.getByRole("heading", { name: "Lokale Schutzgrenzen belegen, Geräte- und Identitätslücken sichtbar halten" }).waitFor();
    assert.equal(await page.locator(".access-control-grid article").count(), 13);
    await page.getByText("Beobachteter Blocker", { exact: true }).first().waitFor();
    await page.getByRole("heading", { name: "Beschlossene Punkte und offene C1-Gates" }).waitFor();
    await page.getByText("Van Vardanian", { exact: true }).waitFor();
    await page.getByText(/Annahme- und Übergabeprotokoll vorbereitet/).waitFor();
    await page.getByText("Keine Login- oder Sicherheitsbehauptung", { exact: true }).waitFor();
    await page.getByRole("button", { name: /Prüfspur & Beschluss/ }).click();
    await page.getByText("NO-GO", { exact: true }).last().waitFor();

    // 0b. Kontaktentscheidung und Preflight bleiben als eigene Growth-Arbeitsfläche erreichbar; ein Prüfpunkt wird genau einmal zur Aufgabe.
    await page.getByRole("button", { name: "Research & Outreach", exact: true }).click();
    await page.getByRole("button", { name: "Kontaktfreigabe", exact: true }).click();
    await page.getByRole("heading", { name: "Darf kontaktiert werden?" }).waitFor();
    await page.getByText("Produktiver Versand gesperrt", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Als Aufgabe anlegen" }).first().click();
    await page.getByText("Operativer Prüfpunkt als lokale Aufgabe angelegt", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Aufgabe vorhanden" }).first().waitFor();
    await page.getByRole("button", { name: "Aufgaben", exact: true }).click();
    await page.getByText("Kontaktgrundlage klären", { exact: true }).waitFor();

    // 1. Organisation anlegen.
    await page.getByRole("button", { name: "Organisationen", exact: true }).click();
    await page.getByRole("button", { name: "Organisation", exact: true }).click();
    await waitForFormReady(page, "crm-field-displayName");
    await page.getByLabel("Organisationsname *").fill("E2E Gesundheitswerk");
    await page.getByLabel("Segment *").fill("Gesundheit");
    await page.getByLabel("Region *").fill("Düsseldorf");
    await page.getByRole("button", { name: "Organisation anlegen" }).click();
    await page.getByText("Organisation lokal angelegt", { exact: true }).waitFor();
    await page.getByText("E2E Gesundheitswerk", { exact: true }).waitFor();

    // 2. Kontakt mit Organisation verbinden.
    await page.getByRole("button", { name: "Kontakte", exact: true }).click();
    await page.getByRole("button", { name: "Kontakt", exact: true }).click();
    await waitForFormReady(page, "crm-field-firstName");
    await page.getByLabel("Vorname *").fill("Edda");
    await page.getByLabel("Nachname *").fill("Prüfung");
    await page.getByLabel("Organisation *").selectOption({ label: "E2E Gesundheitswerk" });
    await page.getByLabel("Funktion").fill("Synthetische Entscheiderin");
    await page.getByLabel("E-Mail (.invalid)").fill("edda.pruefung@example.invalid");
    await page.getByRole("button", { name: "Kontakt anlegen" }).click();
    await page.waitForTimeout(200);
    const contactFormErrors = (await page.locator(".field-error").allTextContents()).filter((value) => value.trim());
    assert.deepEqual(contactFormErrors, [], `Kontaktformular meldet: ${contactFormErrors.join(" | ")}`);
    await page.getByText("Kontakt lokal angelegt", { exact: true }).waitFor();
    await page.getByText("Edda Prüfung", { exact: true }).waitFor();

    // 3–4. Chance anlegen und Hauptkontakt zuordnen.
    await page.getByRole("button", { name: "Neue Chance", exact: true }).click();
    await waitForFormReady(page, "crm-field-title");
    await page.getByLabel("Organisation *").selectOption({ label: "E2E Gesundheitswerk" });
    await page.getByLabel("Bezeichnung *").fill("E2E Canonical Pilot");
    const contactOption = await page.getByLabel("Hauptkontakt").locator("option", { hasText: "Edda Prüfung" }).getAttribute("value");
    await page.getByLabel("Hauptkontakt").selectOption(contactOption);
    await page.getByLabel("Nächste Handlung *").fill("Synthetisches Bedarfsgespräch vorbereiten");
    await page.getByLabel("Fälligkeit *").fill("2026-10-24");
    await page.getByRole("button", { name: "Chance anlegen" }).click();
    await page.getByText("Chance lokal angelegt", { exact: true }).waitFor();

    // 5. Verknüpfte Aufgabe anlegen.
    await page.getByRole("button", { name: "Aufgaben", exact: true }).click();
    await page.getByRole("button", { name: "Aufgabe", exact: true }).click();
    await waitForFormReady(page, "crm-field-title");
    await page.getByLabel("Aufgabe *").fill("E2E nächsten Schritt klären");
    await page.getByLabel("Chance").selectOption({ label: "E2E Canonical Pilot" });
    await page.getByLabel("Fälligkeit *").fill("2026-10-25");
    await page.getByRole("button", { name: "Aufgabe anlegen" }).click();
    await page.getByText("Aufgabe lokal angelegt", { exact: true }).waitFor();
    await page.getByText("E2E nächsten Schritt klären", { exact: true }).waitFor();

    // 6. Aktivität in der Chance dokumentieren.
    await openGlobalResult(page, "E2E Canonical Pilot", "Chance");
    await page.getByRole("button", { name: "Aktivität dokumentieren" }).click();
    await waitForFormReady(page, "crm-field-type");
    await page.getByLabel("Zusammenfassung *").fill("E2E Gesprächsnotiz vollständig dokumentiert");
    await page.getByRole("button", { name: "Aktivität anlegen" }).click();
    await page.getByText("E2E Gesprächsnotiz vollständig dokumentiert", { exact: true }).waitFor();

    // 7–8. Vertragsevidenz ergänzen, nur erlaubte Phasen bewegen und Historie nachvollziehen.
    await page.getByRole("button", { name: "Bearbeiten", exact: true }).click();
    await waitForFormReady(page, "crm-field-title");
    await page.getByLabel("Dokumentierter Bedarf").fill("Synthetischer Bedarf für einen lokalen CRM-Vertragstest.");
    await page.getByLabel("Zielbild / Leistungsrahmen").fill("Lokaler Pilotkorridor ohne operative Leistungszusage.");
    await page.getByLabel("Offene Punkte").fill("Startkorridor und interne Verantwortlichkeit sind zu prüfen.");
    await page.getByRole("button", { name: "Änderungen speichern" }).click();
    await page.getByText("Änderungen lokal gespeichert", { exact: true }).waitFor();
    await page.waitForFunction(() => {
      const state = JSON.parse(localStorage.getItem("amavio-one-crm-r3-8-g1-legal-access-assurance-v7") || "null");
      return state?.opportunities?.find((item) => item.title === "E2E Canonical Pilot")?.needSummary;
    });
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();
    await openGlobalResult(page, "E2E Canonical Pilot", "Chance");
    await page.locator(".canonical-drawer select").selectOption("qualified");
    const firstTransitionButton = page.getByRole("button", { name: "Phasenwechsel speichern" });
    assert.equal(await firstTransitionButton.isEnabled(), true, await page.locator(".stage-readiness").innerText());
    await firstTransitionButton.click();
    await page.getByText(/Erstkontakt → Qualifiziert/).waitFor();
    await page.locator(".canonical-drawer select").selectOption("scoping");
    const secondTransitionButton = page.getByRole("button", { name: "Phasenwechsel speichern" });
    assert.equal(await secondTransitionButton.isEnabled(), true, await page.locator(".stage-readiness").innerText());
    await secondTransitionButton.click();
    await page.getByText(/Qualifiziert → Leistungsrahmen/).waitFor();
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();

    // 9a. Qualifizierten Lead lokal anlegen und kontrolliert in eine Chance umwandeln.
    await page.getByRole("button", { name: "Leads", exact: true }).click();
    await page.getByRole("button", { name: "Lead", exact: true }).click();
    await waitForFormReady(page, "crm-field-title");
    await page.getByLabel("Lead-Bezeichnung *").fill("E2E qualifiziertes Signal");
    await page.getByLabel("Bestehende Organisation").selectOption({ label: "E2E Gesundheitswerk" });
    await page.getByRole("dialog", { name: "Neu anlegen: Lead" }).getByLabel("Status").selectOption("qualified");
    await page.getByLabel("Dokumentierter Bedarf").fill("Synthetischer Lead-Bedarf ist belastbar beschrieben.");
    await page.getByLabel("Nächste Handlung").fill("Lokale Chance vorbereiten");
    await page.getByLabel("Fälligkeit").fill("2026-10-26");
    await page.getByRole("button", { name: "Lead anlegen" }).click();
    await page.getByText("E2E qualifiziertes Signal", { exact: true }).click();
    await page.getByRole("button", { name: "In Chance umwandeln" }).click();
    await page.locator(".canonical-drawer").getByText("Konvertiert", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();

    // 9b. Partnerorganisation und getrennten Partnerkontakt lokal pflegen.
    await page.getByRole("complementary", { name: "Hauptnavigation" }).getByRole("button", { name: "Partner", exact: true }).click();
    await page.getByRole("main").getByRole("button", { name: "Partner", exact: true }).click();
    await waitForFormReady(page, "crm-field-displayName");
    await page.getByLabel("Partnername *").fill("E2E Partnernetz");
    await page.getByLabel("Kategorie *").fill("Synthetisches Standortnetzwerk");
    await page.getByRole("button", { name: "Partner anlegen" }).click();
    await page.getByText("E2E Partnernetz", { exact: true }).click();
    await page.getByRole("dialog", { name: "Partner: E2E Partnernetz" }).getByRole("button", { name: "Partnerkontakt anlegen" }).click();
    await waitForFormReady(page, "crm-field-firstName");
    await page.getByLabel("Vorname *").fill("Pia");
    await page.getByLabel("Nachname *").fill("Prüfung");
    await page.getByLabel("Funktion").fill("Synthetische Koordination");
    await page.getByLabel("E-Mail (.invalid)").fill("pia.pruefung@example.invalid");
    await page.getByRole("dialog", { name: "Neu anlegen: Partnerkontakt" }).getByRole("button", { name: "Partnerkontakt anlegen" }).click();
    await page.getByText("Partnerkontakt lokal angelegt", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();
    await openGlobalResult(page, "Pia Prüfung", "Partnerkontakt");
    await page.locator(".canonical-drawer").getByText("Pia Prüfung", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();

    // 9c. Kontaktstatus erzeugt eine sichtbare lokale Sperre, aber keine Außenaktion.
    await openGlobalResult(page, "Edda Prüfung", "Kontakt");
    await page.getByRole("button", { name: "Bearbeiten", exact: true }).click();
    await waitForFormReady(page, "crm-field-firstName");
    await page.getByLabel("Kontaktstatus").selectOption("do_not_contact");
    await page.getByRole("button", { name: "Änderungen speichern" }).click();
    await page.getByText("Außenkontakt gesperrt", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();

    // 9d. Gewonnene Chance erhält nur zwei lokale Prüfmarker; Transfer bleibt gesperrt.
    await openGlobalResult(page, "Care & Retention Monitoring", "Chance");
    await page.getByRole("button", { name: /Vertrieb \/ Produktverantwortung/ }).click();
    await page.getByRole("button", { name: /^Operative Prüfung/ }).click();
    await page.getByText("Status: Fachlich doppelt freigegeben", { exact: true }).waitFor();
    await page.getByRole("button", { name: /Keine Übertragung/ }).isDisabled();
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();

    // 10. R3.2-Arbeitsjournal: sieben Fachobjekte, gespeicherte Ansicht und lokale Regeln.
    await createR32WorkJournal(page);

    // 10b. R3.3-Growth-Core: Quelle dokumentieren, Lead übernehmen und Outreach nur als Entwurf vorbereiten.
    await page.getByRole("complementary", { name: "Hauptnavigation" }).getByRole("button", { name: "Research & Outreach", exact: true }).click();
    await page.getByRole("main").getByRole("button", { name: /Rechercheeintrag/ }).click();
    await page.getByLabel("Organisation / Hinweis *").fill("E2E Recherchewerk");
    await page.getByLabel("Quellen-URL *").fill("https://example.invalid/e2e-recherchewerk");
    await page.getByLabel("Passungsnotiz").fill("Synthetischer Fit für kontrollierten E2E-Test.");
    await page.getByRole("dialog", { name: "Rechercheeintrag anlegen" }).getByRole("button", { name: "Lokal speichern" }).click();
    await page.waitForTimeout(200);
    const researchNotice = await page.locator(".status-toast").innerText().catch(() => "Keine Rückmeldung sichtbar");
    assert.match(researchNotice, /Rechercheeintrag lokal angelegt/, `Rechercheanlage fehlgeschlagen: ${researchNotice}`);
    const researchRow = page.locator(".research-ledger article").filter({ hasText: "E2E Recherchewerk" });
    await researchRow.waitFor();
    await researchRow.getByRole("button", { name: "Als Lead übernehmen" }).click();
    await page.getByText("Recherche lokal als Lead übernommen", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Outreach-Entwürfe", exact: true }).click();
    await page.getByRole("main").getByRole("button", { name: /Entwurf/ }).click();
    await page.getByLabel("Betreff *").fill("E2E Outreach nur lokal");
    await page.getByLabel("Entwurfstext *").fill("Synthetischer E2E-Entwurf ohne Versand.");
    await page.getByRole("dialog", { name: "Outreach-Entwurf anlegen" }).getByRole("button", { name: "Lokal speichern" }).click();
    const outreachRow = page.locator(".outreach-ledger article").filter({ hasText: "E2E Outreach nur lokal" });
    await outreachRow.waitFor();
    assert.equal(await outreachRow.getByRole("button", { name: "Versand gesperrt" }).isDisabled(), true);
    await page.getByRole("complementary", { name: "Hauptnavigation" }).getByRole("button", { name: "System & Freigaben", exact: true }).click();
    await page.getByRole("heading", { name: "Sicherung & Datenvertrag" }).waitFor();
    await page.locator(".persistence-badge").getByText("Lokale SQLite-Datenbank", { exact: true }).waitFor();
    assert.equal(await page.getByRole("button", { name: /SQLite-Sicherung/ }).isEnabled(), true);

    // 11. Alle angekündigten Objekttypen global wiederfinden.
    for (const [query, type] of [["E2E Gesundheitswerk", "Organisation"], ["Edda Prüfung", "Kontakt"], ["E2E qualifiziertes Signal", "Lead"], ["E2E Canonical Pilot", "Chance"], ["E2E nächsten Schritt", "Aufgabe"], ["E2E Partnernetz", "Partner"], ["Pia Prüfung", "Partnerkontakt"]]) {
      await openGlobalResult(page, query, type);
      await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();
    }
    for (const [query, type] of [["E2E Entscheidungsnotiz", "Notiz"], ["E2E Fachgespräch", "Gespräch"], ["E2E Entscheidungstermin", "Termin"], ["E2E Freigabe nachhalten", "Wiedervorlage"], ["E2E-V1", "Angebot"], ["E2E Pilotfreigabe", "Entscheidung"], ["E2E-LOCAL-REF-1", "Dokumentreferenz"]]) {
      await openGlobalResult(page, query, type);
      await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();
    }

    // 12. Chance archivieren und über den Archivfilter wiederherstellen.
    await openGlobalResult(page, "E2E Canonical Pilot", "Chance");
    await page.getByRole("button", { name: "Archivieren" }).click();
    await page.getByRole("button", { name: "Lokal archivieren" }).click();
    await page.getByRole("button", { name: "Pipeline", exact: true }).click();
    await page.getByLabel("Archivierte").check();
    await page.getByPlaceholder("Pipeline durchsuchen …").fill("E2E Canonical Pilot");
    await page.getByRole("button").filter({ hasText: "E2E Canonical Pilot" }).first().click();
    await page.getByRole("button", { name: "Wiederherstellen" }).click();
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();

    // 13. Lokale Persistenz nach Reload.
    await page.reload({ waitUntil: "networkidle" });
    await openGlobalResult(page, "E2E Canonical Pilot", "Chance");
    await page.locator(".canonical-drawer").getByText("E2E Canonical Pilot", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Detailansicht schließen" }).last().click();

    // 14. Die Auswertung bleibt faktenbasiert; Berichtsansicht und interne Analyse sind getrennt.
    await page.getByRole("button", { name: "Auswertungen", exact: true }).click();
    await page.getByRole("heading", { name: "Auswertungen" }).waitFor();
    await page.getByText("keine Umsatzprognose", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Berichtsansicht", exact: true }).click();
    await page.getByRole("heading", { name: "Bereinigte Berichtsansicht" }).waitFor();
    assert.equal(await page.getByRole("heading", { name: "Management-Brief" }).count(), 0);
    assert.equal(await page.getByRole("button", { name: /Export/i }).count(), 0);

    // 15. Kontrollierter Reset entfernt den Testzustand und stellt den Seed wieder her.
    await page.getByRole("button", { name: "Demo zurücksetzen", exact: true }).click();
    await page.getByRole("button", { name: "Demo zurücksetzen", exact: true }).last().click();
    await page.keyboard.press("Control+K");
    await page.getByLabel("Alle CRM-Objekte durchsuchen").fill("E2E Canonical Pilot");
    await page.getByText("Keine passenden Datensätze.").waitFor();
    await page.keyboard.press("Escape");
    await page.getByText("Klinikverbund Rhein", { exact: true }).first().waitFor();

    assert.deepEqual(consoleErrors, [], `Browserkonsole enthält Fehler: ${consoleErrors.join(" | ")}`);
    console.log("AMAVIO One CRM E2E: OK");
    console.log("- 20 zusammenhängende lokale Kernabläufe einschließlich Arbeitsjournal, Growth-Core, getrennter Workspaces, Kontaktfreigabe und G1-Readiness bestanden");
    console.log("- Persistenz, Archiv/Wiederherstellung und Reset bestanden");
    console.log("- Browserkonsole ohne Fehler");
  } finally {
    await browser.close();
  }
});

async function openGlobalResult(page, query, typeLabel) {
  await page.keyboard.press("Control+K");
  const input = page.getByLabel("Alle CRM-Objekte durchsuchen");
  await input.fill(query);
  const result = page.getByRole("button").filter({ hasText: typeLabel }).filter({ hasText: query }).first();
  await result.waitFor();
  await result.click();
}

async function waitForFormReady(page, fieldId) {
  await page.waitForFunction((id) => document.activeElement?.id === id, fieldId);
}

async function createR32WorkJournal(page) {
  await page.getByRole("complementary", { name: "Hauptnavigation" }).getByRole("button", { name: "Arbeitsjournal", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Notiz", exact: true }).click();
  await waitForFormReady(page, "crm-field-title");
  await page.getByLabel("Titel *").fill("E2E Entscheidungsnotiz");
  await page.getByLabel("Notiz *").fill("Synthetische Notiz mit nachvollziehbarem Chancenbezug.");
  await page.locator("#crm-field-opportunityId").selectOption({ label: "E2E Canonical Pilot" });
  await page.getByRole("button", { name: "Notiz anlegen" }).click();

  await page.getByRole("button", { name: "Gespräche", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Gespräch", exact: true }).click();
  await waitForFormReady(page, "crm-field-subject");
  await page.getByLabel("Gesprächsbetreff *").fill("E2E Fachgespräch");
  await page.getByLabel("Gesprächsergebnis *").fill("Synthetischer Leistungsrahmen wurde besprochen.");
  await page.getByLabel("Nächster Schritt").fill("Entscheidungsweg dokumentieren");
  await page.locator("#crm-field-opportunityId").selectOption({ label: "E2E Canonical Pilot" });
  await page.getByRole("button", { name: "Gespräch anlegen" }).click();

  await page.getByRole("button", { name: "Termine", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Termin", exact: true }).click();
  await waitForFormReady(page, "crm-field-title");
  await page.getByLabel("Termintitel *").fill("E2E Entscheidungstermin");
  await page.getByLabel("Beginn *").fill("2026-10-27T10:00");
  await page.getByLabel("Ende *").fill("2026-10-27T10:45");
  await page.getByLabel("Agenda").fill("Synthetischer Entscheidungspfad");
  await page.locator("#crm-field-opportunityId").selectOption({ label: "E2E Canonical Pilot" });
  await page.getByRole("button", { name: "Termin anlegen" }).click();

  await page.getByRole("button", { name: "Wiedervorlagen", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Wiedervorlage", exact: true }).click();
  await waitForFormReady(page, "crm-field-title");
  await page.getByLabel("Wiedervorlage *").fill("E2E Freigabe nachhalten");
  await page.getByLabel("Fälligkeit *").fill("2026-10-28");
  await page.locator("#crm-field-opportunityId").selectOption({ label: "E2E Canonical Pilot" });
  await page.getByRole("button", { name: "Wiedervorlage anlegen" }).click();

  await page.getByRole("button", { name: "Angebote", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Angebot", exact: true }).click();
  await waitForFormReady(page, "crm-field-versionLabel");
  await page.locator("#crm-field-opportunityId").selectOption({ label: "E2E Canonical Pilot" });
  await page.getByLabel("Version *").fill("E2E-V1");
  await page.getByLabel("Betrag in EUR").fill("5900");
  await page.getByLabel("Gültig bis *").fill("2026-11-30");
  await page.getByLabel("Leistungsrahmen *").fill("Synthetischer E2E-Leistungsrahmen ohne Versand.");
  await page.getByRole("button", { name: "Angebot anlegen" }).click();

  await page.getByRole("button", { name: "Entscheidungen", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Entscheidung", exact: true }).click();
  await waitForFormReady(page, "crm-field-title");
  await page.locator("#crm-field-opportunityId").selectOption({ label: "E2E Canonical Pilot" });
  await page.getByLabel("Entscheidungsgegenstand *").fill("E2E Pilotfreigabe");
  await page.getByLabel("Entscheiderrolle *").fill("Synthetische Geschäftsführung");
  await page.getByRole("button", { name: "Entscheidung anlegen" }).click();

  await page.getByRole("button", { name: "Dokumentreferenzen", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Dokumentreferenz", exact: true }).click();
  await waitForFormReady(page, "crm-field-title");
  await page.getByLabel("Dokumenttitel *").fill("E2E Leistungsrahmen");
  await page.getByLabel("Lokale Textreferenz *").fill("E2E-LOCAL-REF-1");
  await page.locator("#crm-field-opportunityId").selectOption({ label: "E2E Canonical Pilot" });
  await page.getByRole("button", { name: "Dokumentreferenz anlegen" }).click();

  await page.getByRole("button", { name: "Wiedervorlagen", exact: true }).click();
  await page.getByPlaceholder("Wiedervorlagen durchsuchen …").fill("E2E");
  await page.getByLabel("Status filtern").selectOption("open");
  await page.getByRole("button", { name: "Aktuelle Filter speichern" }).click();
  await waitForFormReady(page, "crm-field-name");
  await page.getByLabel("Name der Ansicht *").fill("E2E offene Wiedervorlagen");
  await page.getByRole("button", { name: "Ansicht anlegen" }).click();
  await page.getByLabel("Gespeicherte lokale Ansicht").selectOption({ label: "E2E offene Wiedervorlagen" });

  await page.getByRole("button", { name: "Steuerung", exact: true }).click();
  await page.getByLabel("Wiedervorlage vorwarnen").fill("4");
  await page.getByRole("button", { name: "Regeln lokal speichern" }).click();
  await page.getByText("Lokale Alterungsregeln gespeichert", { exact: true }).waitFor();
}
