# AMAVIO One CRM – R3.1 Visual & Coverage QA

**Datum:** 10.10.2026  
**Prüfobjekt:** `20261010_AMAVIO_One_CRM_R3_1_Visual_Coverage_Working`  
**Ergebnis:** **QA BESTANDEN – NICHT PRODUKTIV FREIGEGEBEN**  
**Zulässiger Reifegrad:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## 1. Quellen

- AMAVIO One Brand Quick Reference und Design Tokens, Stand 30.09.2026;
- AMAVIO One Brand Source Matrix, Stand 30.09.2026;
- Desktop-/Mobilkonzept des CRM vom 08.10.2026;
- IGS-Referenzmaterial `Deal-Cockpit IGS Gruppe.md` und `.html` aus dem Download-Ordner;
- R3-Contract-Alignment-, Capability-, Domain-, Transition- und Product-Owner-Dokumente vom 09.10.2026;
- laufende lokale R3.1-Implementierung auf Port 4365.

## 2. Sicherung und Arbeitskopie

| Ordner | Zustand |
|---|---|
| `20261009_AMAVIO_One_CRM_R3_UAT_Acceptance_Working` | unveränderter Ausgangsstand |
| `20261010_AMAVIO_One_CRM_R3_UAT_Sicherung_Pre_R3_1` | vollständige Sicherung vor R3.1 |
| `20261010_AMAVIO_One_CRM_R3_1_Visual_Coverage_Working` | datierte Arbeitskopie |

Quelle, Sicherung und Arbeitskopie enthielten unmittelbar nach dem Kopiervorgang jeweils 6100 Dateien/Symlinks. Der erste macOS-`cp -a`-Lauf meldete lediglich Flag-Probleme an bestehenden `node_modules/.bin`-Symlinks; die Kopien wurden danach mit `rsync -a` vervollständigt und gleichzählig geprüft. Es wurde nichts gelöscht.

## 3. Berührte Bereiche

- `index.html`: lokale AMAVIO-Fontquelle eingebunden;
- `public/assets/fonts/`: vorhandene AMAVIO-Webfonts wiederverwendet;
- `src/styles.css`: zentrierte Content-/Stage-Breiten, Zwischenbreite, Typorollen, CTA-/Statusfarben, mobile Safe Area;
- sichtbare Texte in AppShell, Dashboard, Verzeichnissen, Form- und Detaildialogen;
- fachliches Label der bestehenden technischen Phase `scoping` zu `Leistungsrahmen`;
- synthetische Seed-Texte und passende Testselektoren;
- IGS-Abdeckungsmatrix und Schritt-C-Plan/Prompt;
- README, Capability-Verweis und Product-Owner-Einordnung;
- datierte Browser-QA-Pfade.

## 4. Unberührte Bereiche

- technische Phasen-IDs und erlaubte Übergänge;
- kanonische Objektbeziehungen und Persistenzschlüssel;
- synthetische E-Mail-/Datenbarriere;
- Archiv, Wiederherstellung, Undo und Reset;
- Trennung von CRM, App und ACC;
- alle acht produktiven Bündel-C-Sperren;
- keine Anbieter-, Connector-, Login-, Datenbank- oder Hostingkonfiguration;
- kein Deployment, Git-Push, Upload oder externer Versand.

## 5. Build und automatisierte Tests

### Finaler `npm run qa:full`

- Vite-Build: bestanden;
- statisches CRM-QA-Gate: bestanden;
- Unit: 8/8 bestanden;
- Vertrag: 6/6 bestanden;
- Komponente: 2/2 bestanden;
- Integration: 2/2 bestanden.

### `npm run test:e2e`

- 14 zusammenhängende lokale Kernabläufe bestanden;
- Persistenz bestanden;
- Archiv/Wiederherstellung bestanden;
- kontrollierter Reset bestanden;
- Browserkonsole ohne Fehler.

Der erste E2E-Wiederholungslauf stoppte an einem veralteten Testselektor `In Chance konvertieren`, nachdem die sichtbare Aktion absichtlich zu `In Chance umwandeln` geändert worden war. Der Selektor wurde an die beschlossene DE-first-Sprache angepasst; der vollständige Lauf bestand anschließend. Dies war kein Laufzeitfehler der Anwendung.

## 6. Browser-, Responsive- und Accessibility-QA

Finaler `npm run qa:browser`:

- 1600 px: kein Seitenüberlauf;
- 1280 px: kein Seitenüberlauf; Kontextbereich unterhalb des Hauptinhalts;
- 1024 px: kein Seitenüberlauf; Hauptspalte bleibt lesbar; breite Tabelle scrollt intern;
- 430 px: kein Seitenüberlauf; mobile Navigation und unterer Sicherheitsabstand vorhanden;
- echter 200-%-Chrome-Zoom: Reflow bestanden;
- `⌘/Strg K`, Escape, Focus-Trap und Focus-Rückgabe: bestanden;
- keine unbenannte sichtbare Schaltfläche;
- Browserkonsole: keine Fehler.

Prüfergebnisdatei: `QA/CRM_R3_1_BROWSER_RESULT_20261010.json`.

## 7. Visuelle QA

Die finalen Screenshots wurden nach dem letzten Browserlauf geöffnet und gegen die vorhandenen Designkonzepte geprüft. Bewertet wurden Typografie, Abstand/Raster, Farben, Assettreue, Copy, Icons, Interaktionszustände und Responsiveness.

Bestätigt:

- Geist und Fraunces werden lokal geladen;
- Primäraktionen verwenden Brand Navy statt Gold Deep;
- keine neue grüne Erfolgsfarbe;
- Desktop-Arbeitsfläche nutzt die AMAVIO-Maxbreiten;
- 1024-px-Layout wird nicht durch die rechte Rail gequetscht;
- DE-first-Texte sind sichtbar konsistent;
- vorhandene Logo- und Fokusassets bleiben unverändert;
- keine generische neue Kartenlogik eingeführt.

Dokumentierte akzeptierte Differenz:

- Das Mobilkonzept enthält eine eigene Fokus-Ikone, die nicht als freigegebenes Asset im CRM vorliegt. R3.1 zeichnet oder erfindet keine Ersatzmarke. Der Fokus bleibt funktional und typografisch gelöst.

Evidenz: `QA/Screenshots/20261010-r3-1/`.

## 8. IGS-Abdeckung

Die erneute Prüfung trennt vollständig:

- übernommen;
- für AMAVIO angepasst;
- eigenständig für AMAVIO entwickelt;
- bewusst nicht übernommen;
- bis C lokal offen;
- C-gebunden.

Vollständige Matrix: `CRM_IGS_TO_AMAVIO_COVERAGE_MATRIX_20261010.md`.

Kernaussage: Wesentliche IGS-Arbeitsmuster wie Cockpit, Pipeline, Details, Aufgaben, Partnerquellen, Suche, Bericht und Lost-Gründe sind vorhanden oder AMAVIO-spezifisch übersetzt. M&A-/Pflegeunion-Felder, Karte, Käuferkommunikation, HubSpot/Drive/Gmail und produktive KI wurden bewusst nicht übernommen. AMAVIO hat darüber hinaus kanonische Objekte, Lead-/Chance-Grenze, Übergangsverträge, Audit, Archiv/Undo, Consent-Trennung, Accessibility und ACC-Dual-Approval eigenständig ergänzt.

## 9. Schritt C

Erstellt:

- `CRM_STEP_C_GATE_AND_SEQUENCE_PLAN_20261010.md`;
- `CRM_STEP_C_IMPLEMENTATION_PROMPT_DRAFT_20261010.md`.

Nicht aktiviert:

- Datenbank/Backend;
- Authentifizierung/MFA;
- reale Daten/Import;
- Dokumentenspeicher;
- E-Mail/Kalender;
- ACC-/App-Integration;
- produktive KI;
- Hosting/Deployment.

Empfehlung: zunächst ausschließlich C0 und danach C1 – sichere Plattformbasis mit synthetischem Staging – separat beschließen. C2 bis C7 bleiben Einzelgates.

## 10. Offene Punkte

- Product-Owner-Abnahme von R3.1 steht aus;
- C0-/C1-Beschluss steht aus;
- Anbieter, EU-Region, AVV/DPA, Rollenwirkung, Backup/Restore, Kosten und Betriebsverantwortung stehen aus;
- lokales Notiz-, Gesprächs-/Termin-, Wiedervorlage-, Angebots- und Entscheidungsobjekt sind mögliche R3.2-Fachvertiefungen;
- externer Screenreader-/WCAG-Review steht aus.

## 11. Externer Status

Keine externe Aktion durchgeführt. Nicht veröffentlicht, nicht deployed, nicht gepusht, nicht versendet und nicht mit realen Daten oder Drittanbietern verbunden.

