# AMAVIO GitHub Final Push

Datum: 13.10.2026  
Auftrag: `push everything to git`  
Status: alle aktuellen, GitHub-geeigneten und nicht-sensiblen AMAVIO-Quellen sind den vorgesehenen privaten Repositories zugeordnet; finaler Push ausgefuehrt

## 1. Repositories

### `zakiamawi/AMAVIO-Businessplan`

- Rolle: kuratierter Master fuer Businessplan, Finanzen, Foerderung, Marke, Kunden, Investoren, Praesentationen, Governance sowie getrennte App-/ACC-/CRM-Quellstaende
- Ausgangs-Remote-Head dieses Abschlusslaufs: `145c4a86425ba757f271e1c1ec0baa133d5a9984`
- Arbeitskopie vor dem Abschlusscommit: sauber
- Dieser Abschlusslauf ergaenzt den aktualisierten Source-Manifest und diesen Push-Nachweis.

### `zakiamawi/amavio-living-site`

- Rolle: ausschliesslich aktueller Website-Quellstand und Website-Release-Nachweise
- Remote-Head `main`: `ac3a6c3b95f5975def28a6bc3893d77844f4d28d`
- Quelle: `08_Website/amavio-living-site/20261013_V17_8_Public_Release`
- Status: bereits ueber PR `#7` gemergt und als V17.8 produktiv verifiziert; kein weiterer Website-Inhaltsdelta vorhanden

## 2. Vollstaendigkeitsabgleich

Byte-identisch mit dem kuratierten Master bestaetigt:

- Businessplan-Kernanker
- S2-Finanzmodell und Originalbasis
- Investoren-Businessplan DOCX/PDF
- freigegebene Founder-Geschaeftsunterlage
- Kunden-One-Pager DOCX/PDF
- Kundendeck Erstkontakt PPTX/PDF
- Kundendeck Entscheider PPTX/PDF
- sechs kuratierte Praesentationsausgaben
- finale NEXT Executive Summary und finaler NEXT Business Model Canvas

Quellverzeichnisabgleich:

- App: keine fachliche oder funktionale Abweichung; nur zwei neu erzeugte `generatedAt`-Zeitstempel in QA-JSONs
- ACC: keine aktuelle Quellabweichung; lokale `.bak`-Konfigurationssicherungen und Screenshots bleiben ausgeschlossen
- CRM: keine aktuelle Quellabweichung; lokale Backups, `local-data`, echte Daten, Datenbanken und Builds bleiben ausgeschlossen
- Brandbook: aktueller Inhalt vorhanden; lokaler Python-Cache bleibt ausgeschlossen
- Website: Remote-`main` entspricht dem bereits gemergten V17.8-Release

## 3. Alter Root-Checkout

Der Projektwurzelordner ist historisch noch ein lokaler Checkout des Website-Repositories mit altem Head `ce240f9653b72b30578ac3716c177095817d4a1e`. Dort vorhandene geaenderte V14-/V16-nahe Website-Dateien, ein Statusdokument vom 19.09.2026 und ein Strukturtext vom 19.09.2026 sind nicht die aktuelle Website- oder Governance-Quelle.

Dieser alte Checkout wurde deshalb nicht mit `git add -A` gepusht. Ein solcher Push wuerde den verifizierten V17.8-Stand mit veralteten Dateien vermischen. Der aktuelle Website-Stand liegt bereits sauber im separaten Website-Repository; die aktuelle Projekt-Governance liegt im Master-Repository.

## 4. Nicht gepushte Schutzklassen

Unabhaengig von der allgemeinen Push-Freigabe bleiben ausgeschlossen:

- Secrets, Tokens, API-Keys, Passwoerter, private Schluessel und Auth-Artefakte;
- `.env`-Dateien und lokale geheime Konfiguration;
- echte CRM-/Kontaktdaten, Kontaktlisten, Import-Staging und Sperrlisten;
- SQLite-/DB-Dateien, Exporte und Backups;
- signierte Formulare, Ausweise, Bank-/Steuerunterlagen und private Nachweise;
- `node_modules`, Builds, Caches, Browserprofile und reproduzierbare Screenshotsammlungen;
- historische Arbeitskopien, lokale `.bak`-Dateien und nicht-kanonische Zwischenstaende.

Diese Ausschluesse sind Sicherheits- und Datenminimierungsregeln und kein fehlgeschlagener Push.

## 5. Schlussstatus

Alle aktuellen, erforderlichen und fuer GitHub geeigneten AMAVIO-Dateien sind gepusht. Die beiden Remotes wurden nach dem Push erneut abgeglichen. Sensible Daten und veraltete Root-Checkout-Aenderungen wurden nicht in die Git-Historie aufgenommen.
