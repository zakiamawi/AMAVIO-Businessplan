# AMAVIO ACC Release J.3 – Guided Learning QA

**Datum:** 08.10.2026  
**Arbeitskopie:** `20261008_AMAVIO_ACC_Release_J_3_Guided_Learning_Working`  
**Rückfallbasis:** `archive/20261008_release_j3_guided_learning_baseline/`  
**Vorgänger:** Release J.2 auf Port 4204, unverändert

## Anlass und Founder-Befund

Die vier Abnahmefragen zu Release J.2 wurden so beantwortet:

1. Ruhige Standardansicht: **ja**.
2. Links-/Rechts-Logik ohne Erklärung verständlich: **nein, noch nicht ganz**.
3. „Qualität & Version“ ausreichend getrennt: **nein**.
4. Geschlossene technische Details an der richtigen Stelle: **nein**.

Release J.3 ist deshalb keine zusätzliche Funktionsschicht, sondern eine strukturelle Korrektur der Informationsarchitektur.

## Akzeptanzkriterien

- Rückmeldungsarbeit führt sichtbar durch `Auswählen → Ergebnis klären → Anpassung festhalten`.
- Der einzige offene Eintrag ist beim Einstieg priorisiert.
- Qualitätsprüfung ist eine eigenständige Operations-Seite und kein Register der Rückmeldungsarbeit.
- Bedienoberfläche und Vergleichsdialog zeigen keine technischen IDs, Fingerprints, Fixture-Namen, Provider-, Policy- oder internen Versionsmetadaten.
- Technische Reproduzierbarkeit bleibt in Tests, Backend und Auditbasis erhalten.
- Desktop und Mobile haben keine abgeschnittenen Texte oder horizontalen Seitenüberläufe.
- Arbeitgeber sehen weder Lernschleife noch Qualitätsprüfung; der direkte API-Zugriff bleibt serverseitig gesperrt.
- Keine externe Anfrage, keine Providerkosten, keine echten Daten und keine Außenwirkung.

## QA-Status

Der vollständige Lauf `npm run qa:all` ist grün:

- **196/196 Node-Tests** bestanden;
- Gate-02A-Registry vollständig für **51 Routen und 29 Mutationen**;
- Fuzz-, Concurrency-, Idempotenz-, Failure-Injection-, Rollback-, Restart-, Tenant- und Rollengrenzen grün;
- Static-QA: geführte Lernschleife, getrennte Qualitätsprüfung und keine sichtbaren Innendaten bestätigt;
- Brandbook-QA: verbindliche Farbrollen, Geist/Fraunces, Logo, Radien sowie schatten- und verlaufsfreie Panelgeometrie bestätigt;
- Release-G-Browsermatrix über 1505, 1280, 1024, 768, 390 und 360 Pixel grün;
- Release-H-, Release-I- und Release-J.3-Regressionen grün;
- Release J.3 auf 1440 und 390 Pixel inklusive Interaktion, Human Gate, Rollenwechsel und Netzwerkgrenze grün;
- Usability-Testinstrument auf Desktop und Mobile grün;
- **keine externen Requests** in den Browserläufen.

## Visuelle Nachweise

- `QA/release-j3-screens/1440-guided-learning.png`
- `QA/release-j3-screens/390-guided-learning.png`
- `QA/release-j3-screens/1440-quality-review.png`
- `QA/release-j3-screens/390-quality-review.png`
- `QA/release-j3-screens/1440-guided-comparison.png`

Die manuelle Screenshotprüfung hat zusätzlich zwei zunächst nicht testblockierende mobile Fehler gefunden und behoben: einen angeschnittenen Schritt-3-Titel sowie zu enge Zahlen-/Labelabstände in den Qualitätskarten. Die mobilen Freigabestände besitzen nun eigenständige Feldbezeichnungen.

## Grenzen

Release J.3 bleibt eine lokale Konzeptdemo mit ausschließlich synthetischen Daten. Die Änderung aktiviert weder produktive Identity noch Mandantensystem, Hosting, externe KI, CRM/HRIS/App/Messaging/Buchung oder Deployment.
