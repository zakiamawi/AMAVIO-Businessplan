# QA – AMAVIO One Cross-System Ownership & Contract Alignment

**Stand:** 10. Oktober 2026  
**Arbeitskopie:** `20261010_AMAVIO_One_Cross_System_Ownership_Contract_Alignment_Working`  
**Version:** `2.4.4-cross-system-alignment.1`  
**Gesamtergebnis:** **LOKALES VERTRAGS- UND APP-GATE BESTANDEN / BROWSER CHROMIUM UND WEBKIT BESTANDEN / FIREFOX-ENGINE FEHLT / KEINE PRODUKTIVFREIGABE**

## 1. Ausgang und Schutz

Unveränderter App-Ausgang:

- `09_App/20261010_AMAVIO_One_R2_Production_Readiness_Contract_Closure_Working`

Neue Arbeitskopie:

- `09_App/20261010_AMAVIO_One_Cross_System_Ownership_Contract_Alignment_Working`

Konfigurations- und Kernrückfallstand:

- `archive/20261010_pre_cross_system_alignment/`

Die geprüften ACC- und CRM-Arbeitsstände wurden ausschließlich gelesen und gehasht. In diesen Codebasen wurden keine Dateien geändert:

- ACC J.5: `10_Control_Center/20261010_AMAVIO_ACC_Release_J_5_Dual_Sided_Workflow_Working`;
- CRM R3.4: `09_Unternehmenssystem/07_AMAVIO_One_CRM/20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working`.

## 2. Umgesetzter Umfang

- Drei-System-Zuständigkeitsregister;
- produktgetrennte Identity-, Rollen- und Sitzungsgrenzen;
- System-of-Record-Matrix;
- CRM→ACC-Handoffprofil auf Basis des vorhandenen CRM-Fachvertrags;
- explizite App↔CRM-Sperre;
- read-only Systemgrenzen-API;
- ausführbare Negativtests;
- read-only Quellenaudit gegen ACC J.5 und CRM R3.4;
- aktualisierter App-/ACC-Kompatibilitätsaudit gegen ACC J.5;
- Product-Owner-Entscheidungsmatrix und nächster gemeinsamer App-/ACC-Block.

Nicht verändert wurden App-UI, Brand-Tokens, die drei externen Rollen, Arrival-Journey, App-Datenbankmodell und die getrennten ACC-/CRM-Produkte.

## 3. Automatisierte QA

| Prüfung | Ergebnis |
|---|---|
| `npm run lint` | PASS, 0 Warnungen |
| `npm test` | **62/62 PASS** |
| neue Drei-System-Vertragstests | **7/7 PASS** |
| `npm run qa:systems` | PASS |
| Cross-System-Quellenaudit | **SOURCE_BOUNDARIES_ALIGNED**, 0 fehlgeschlagene Checks |
| App-/ACC-Kompatibilitätsaudit | erwartetes **NOT_COMPATIBLE_YET**, fünf präzise fehlende Fähigkeiten |
| `npm run build` | PASS, 1.594 Module transformiert |
| `npm run qa:all` | PASS |

Build-Artefakte:

- `dist/index.html`: 0,64 kB;
- CSS: 22,62 kB, gzip 5,20 kB;
- JavaScript: 243,62 kB, gzip 74,31 kB.

## 4. Browser- und Rollenmatrix

Der Browserlauf wurde nach einem macOS-Sandbox-Block außerhalb der Sandbox gegen den gestarteten lokalen Server wiederholt.

Geprüfte Matrix je erfolgreicher Engine:

- Rollen: Fachkraft, Wohnanbieter, lokaler Partner;
- Sprachen: DE und EN;
- Viewports: 1440×1024, 1180×820 und 390×844;
- insgesamt Chromium/WebKit: **36/36 PASS**;
- Browserkonsole: **0 Fehler**;
- Dialog: Öffnung, Initialfokus, Escape-Schließen und Fokusrückgabe PASS;
- Mobile Navigation: Route `H-01 → H-02` PASS;
- Assistenzgrenze: sichtbar und ausdrücklich ohne Entscheidungseffekt PASS.

Firefox wurde nicht ausgeführt, weil die erwartete lokale Playwright-Firefox-Engine `firefox-1555` nicht installiert ist. Der maschinenlesbare Browserbericht trägt deshalb formal `FAIL`, enthält aber ausschließlich diesen Infrastrukturblocker. Es wird weder ein Firefox-PASS noch ein vollständiger Drei-Engine-Abschluss behauptet.

Evidenz:

- `QA/V2_4_R2_BROWSER_RESULT_20261010.json`;
- `QA/V2_4_R2_ROLE_MATRIX_20261010.csv`;
- `QA/Screenshots/V2_4_R2_Foundation/`.

## 5. Quellenaudit

Der read-only Drei-System-Audit prüfte und hashte:

- sechs aktuelle ACC-J.5-Dateien;
- sieben aktuelle CRM-R3.4-Dateien.

Alle acht Grenzprüfungen bestanden:

- J.5 Dual-Sided Workflow erkannt;
- ACC-interner Beitragsprozess erkannt;
- App-/ACC-Integration weiterhin als nicht implementiert erkannt;
- CRM R3.4 erkannt;
- CRM-/ACC-Integration als gesperrt erkannt;
- direkter CRM-/App-Bezug als gesperrt erkannt;
- payloadfreier CRM-Handoffmarker erkannt;
- getrennte Produkte und Codebasen erkannt.

Evidenz:

- `QA/CROSS_SYSTEM_SOURCE_AUDIT_20261010.md`;
- `QA/CROSS_SYSTEM_SOURCE_AUDIT_20261010.json`.

## 6. ACC-Kompatibilitätsbefund

ACC J.5 erfüllt bereits:

- synthetische Grenze;
- Null-Außenwirkung;
- Idempotenz;
- Revisionslogik;
- Negativrechte;
- rollenminimierte Projektion;
- Auditspur.

Für den App-Vertrag fehlen weiterhin:

1. `versioned_message_envelope`;
2. `correlation_id`;
3. `app_to_acc_consumer`;
4. `acc_to_app_sender`;
5. `replay_and_reconciliation_behavior`.

`NOT_COMPATIBLE_YET` ist deshalb der korrekte erfolgreiche Auditbefund. Er verhindert eine falsche Live-Integrationsbehauptung.

## 7. Grenzen und gesperrte Gates

Weiterhin nicht freigegeben und nicht aktiviert:

- produktive Authentifizierung oder gemeinsame Identity;
- reale Daten;
- App-/ACC- oder CRM-/ACC-Livetransport;
- direkte App-/CRM-Verbindung;
- automatische CRM→ACC-Fallanlage;
- produktive KI, Matching, Scoring oder automatische Entscheidung;
- reale Rollentests;
- Connector, externe Kommunikation oder Kosten;
- Hosting, Deployment, Veröffentlichung oder Git-Push.

## 8. Abnahme

Das Paket ist als lokale synthetische Vertrags- und Entwicklungsgrundlage abnahmefähig. Es ist nicht produktiv freigegeben. Für den nächsten empfohlenen Block ist eine ausdrückliche Freigabe erforderlich, sowohl die App- als auch die vorhandene ACC-J.5-Codebasis in ihren jeweiligen getrennten Arbeitssträngen um denselben gemeinsamen App-/ACC-Contract zu erweitern.
