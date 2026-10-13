# R3.17 Copy- und Scope-Verifikation

**Datum:** 13.10.2026  
**Ausgang:** `20261013_AMAVIO_One_CRM_R3_16_Organizations_Contacts_Integration_Working`  
**Arbeitskopie:** `20261013_AMAVIO_One_CRM_R3_17_Unified_Global_Search_Working`

## Sicherungsnachweis

- R3.16 wurde vor Beginn nicht verändert und bleibt als vollständige Ausgangskopie bestehen.
- Die R3.17-Arbeitskopie wurde vollständig aus R3.16 erzeugt.
- Vor Änderungen an Laufzeitkonfigurationen wurden `package.json`, `package-lock.json` und `vite.config.js` unter `QA/R3_17_CONFIG_BACKUP_20261013/` gesichert.
- Es wurden keine Dateien gelöscht und keine Datenbankmigration ausgeführt.
- SHA-256 von R3.16-`package.json` und gesicherter R3.17-Ausgangsdatei identisch: `cda7b546c9a1b95868c26e4682518a87cc15a1d0632da3f0b5319c1ff9dd9477`.
- SHA-256 der Import-Staging-Datenbank in R3.16 und R3.17 identisch: `bbe3030738c5ed2ec833ae36eac3042c49051296ff49a2fc419e431c391db2dc`.

## Zulässiger Scope

- globale Suche für bereits eingebundene Organisationen und Kontakte;
- Navigation zum bestehenden fachlichen Reiter;
- zentrale Wiederverwendung der vorhandenen schreibgeschützten Detailansicht;
- lokale Tests, Browser-QA und Dokumentation;
- Übergangsvertrag für eine spätere, gesondert freizugebende C1-Grundlage.

## Ausdrücklich ausgeschlossen

- Supabase- oder sonstige Cloud-Aktivierung;
- Login, Authentifizierung, Zugangsdaten, Secrets oder Connector-Anmeldung;
- produktiver Import, Bearbeitung importierter Daten oder Außenkontakt;
- Deployment, Veröffentlichung, Git-Push oder externe Übertragung;
- App- oder ACC-Integration.

## Berührte Bereiche

- `src/App.jsx`
- `src/components/DirectoryViews.jsx`
- `src/components/GlobalSearchDialog.jsx`
- `src/services/importedCrmRecords.js`
- `src/styles.css`
- Test- und QA-Skripte
- README, Capability-Matrix und Product-Owner-Entscheidungsregister

## Unberührte fachliche Substanz

- kanonisches Core-Schema und Statusverträge;
- synthetische Seed-Daten;
- lokale SQLite-Zustandsdatenbank;
- getrennte Import-Staging-Datenbank und deren Datensätze;
- alle DNC-/Outreach-Sperren;
- App-/ACC-Verträge und Codebasen.

