# QA-Bericht – AMAVIO One V2.4 Final Product Candidate & R2 Foundation

**Datum:** 10. Oktober 2026  
**Quelle:** `20261008_AMAVIO_One_App_Contract_Brand_Experience_Working`  
**Arbeitskopie:** `20261010_AMAVIO_One_V2_4_Final_Product_Candidate_R2_Foundation_Working`  
**Prüfstatus:** **TECHNISCHE R2 FOUNDATION PASS / BROWSER CLOSURE TEILWEISE OFFEN / NICHT PRODUKTIV**

## Freigegebener Umfang

Freigegeben waren eine neue datierte lokale Arbeitskopie, gebündelte App-Weiterentwicklung mit synthetischen Daten, lokales Backend/Datenbank, technische ACC-Anbindung und produktionsnahe KI-Grundlage sowie das vollständige lokale Abschlussgate.

Gesperrt blieben reale Daten, reale Rollentests, produktive Authentifizierung, Deployment, Veröffentlichung, externe Kommunikation und Kosten. Deshalb wurde keine externe KI aufgerufen, keine Abhängigkeit heruntergeladen, keine ACC-Codebasis verändert und kein externes System beschrieben.

## Ausgangssicherung

- Ausgangsordner unverändert erhalten;
- neue datierte Arbeitskopie angelegt;
- Konfigurationssicherung unter `QA/Backups/Pre_R2_Foundation_20261010/`;
- keine Secrets, Zugangsdaten oder Auth-Artefakte gelesen oder geschrieben;
- `.runtime/`, `dist/` und `node_modules/` aus dem Quellpaket ausgeschlossen.

## Technische Abnahme

### Backend und Datenbank

- Node-HTTP-API startet gemeinsam mit Vite;
- SQLite-Schema wird lokal erstellt und der synthetische Fall deterministisch initialisiert;
- Persistenz über Datenbank-Reopen nachgewiesen;
- STRICT-Tabellen, Foreign Keys, WAL und fachliche Indizes aktiv;
- Revision und Idempotenz verhindern stille Überschreibungen und Doppelwirkung;
- Ereignisse, Integrationsnachrichten, Assistenzanfragen und Auditdaten werden getrennt geführt.

### App-/ACC-Vertragsgrenze

- ACC bleibt ohne UI, Rolle oder Navigation in der App;
- App→ACC-Outbox erzeugt versionierte synthetische Envelopes;
- ACC→App-Eingang prüft Version, Senderrolle, Revision, Korrelation und Idempotenz;
- echte Daten (`synthetic !== true`) und verbotene Felder werden abgewiesen;
- vollständiger Golden Case über alle 44 Schritte, drei App-Rollen und beide ACC-Boundary-Akteure bestanden;
- keine Datei der getrennten ACC-Codebasis wurde verändert.

### Assistenz und KI-Grenze

- genau drei erklärende Zwecke zugelassen;
- sichtbare Projektion wird serverseitig und rollenminimiert geladen;
- `decision_effect = 0` wird in der Datenbank erzwungen;
- Matching, Scoring, Personenbewertung und automatische Entscheidung fehlen bewusst;
- ein externer Provider wird standardmäßig abgewiesen;
- keine Netzwerkkommunikation und keine Kosten ausgelöst.

## Automatisierte Qualitätsläufe

| Lauf | Ergebnis |
|---|---:|
| `npm run lint` | PASS |
| `npm test` | 49/49 PASS |
| `npm run build` | PASS |
| `npm run qa:all` | PASS |
| `npm run qa:r2` | PASS |

Die Testabdeckung umfasst bestehende Produkt-, Rollen-, Accessibility- und Vertragsprüfungen sowie neue Datenbank-, API-, ACC-, Assistenz- und Ende-zu-Ende-Prüfungen.

## Browser- und Responsive-Evidenz

Der automatisierte Lauf prüfte drei Rollen, zwei Sprachen und drei Viewports:

- Desktop 1440×1024;
- Zwischenbreite 1180×820;
- Mobile 390×844.

Ergebnis:

- Chromium: 18/18 Matrixprüfungen bestanden;
- WebKit: 18/18 Matrixprüfungen bestanden;
- Firefox: nicht ausgeführt, weil die lokale Playwright-Firefox-Engine fehlt;
- insgesamt 36/36 tatsächlich ausgeführte automatisierte Matrixprüfungen bestanden;
- gesamter Browserjob korrekt als `FAIL` markiert, weil die geplante Firefox-Evidenz fehlt;
- keine Konsolenfehler in den ausgeführten Engines;
- Dialogfokus, Escape, Fokus-Rückgabe, Mobile-Navigation und Assistenzgrenze bestanden.

Zusätzlich wurden im Codex In-App-Browser alle drei Rollen in DE/EN auf Desktop und Mobile als 12 Smoke-Checks geprüft. Zwischenbreite, Deep-Link/Reload, Sprachwechsel, Dialog, Assistenz und horizontales Overflow wurden separat beobachtet. Ergebnis: `PASS_WITH_EXPLICIT_EVIDENCE_LIMITS`.

## Visuelle Prüfung

Die neue Oberfläche wurde mit der freigegebenen Ausgangsfassung verglichen. Bewahrt wurden:

- Original-Logo und Markenzuordnung;
- bestehende Navy-/Creme-/Gold-Palette;
- editoriale Typografie und ruhige Hierarchie;
- rollenfeste Navigation;
- primäre Handlung und Trust-Kommunikation;
- Mobile Reflow und Bottom-Navigation.

Die neue R2-Laufzeitdarstellung liegt innerhalb der optional geöffneten Prozessdetails. Sie verändert nicht die führende erste Ansicht und führt keine fremde Farb- oder Icon-Sprache ein.

## Offene Evidenz und Blocker

1. **Firefox:** lokale Engine fehlt. Kein Download ausgeführt, da externe Kommunikation nicht freigegeben ist.
2. **200-Prozent-Zoom:** im verfügbaren In-App-Browser nicht als echter Browserzoom reproduzierbar; daher offen.
3. **Assistive Technology:** VoiceOver/Safari und eine zweite Desktop-AT-Kombination wurden für den neuen R2-Zusatz nicht erneut vollständig geschlossen.
4. **Reale Geräte:** keine physischen iOS-/Android-Geräte genutzt.
5. **Live-ACC:** bewusst keine Verbindung zur getrennten ACC-Codebasis; die App-seitige Referenz ist lokal und synthetisch.
6. **Produktive KI:** kein externer Provider und kein generatives Modell aktiviert; umgesetzt ist die sichere Gateway-/Policy-Grundlage.

## Abschluss

Die App-Weiterentwicklung ist als gebündelte lokale R2 Foundation technisch abgeschlossen. Der Code ist für weitere Architekturentscheidungen belastbarer als der reine Frontend-Prototyp, ohne die gesperrten Produktions- und Datenschutzentscheidungen vorwegzunehmen. Eine endgültige externe Releasefreigabe wäre erst nach Schließung der dokumentierten Browser-, AT-, Real-Device-, Identity-, Daten-, ACC-Live-, Security- und Betriebs-Gates zulässig.
