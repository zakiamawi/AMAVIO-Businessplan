# AMAVIO One – Cross-System Ownership & Contract Alignment

**Stand:** 10. Oktober 2026  
**Version:** `2.4.4-cross-system-alignment.1`  
**Status:** **DREI-SYSTEM-VERTRAG LOKAL IMPLEMENTIERT UND GEPRÜFT / PRODUKTIVGATES GESCHLOSSEN / NICHT DEPLOYED**

Dieses Arbeitsverzeichnis führt den bestandenen V2.4-/R2-App-Stand als ein zusammenhängendes Drei-System-Vertragspaket weiter. Es baut weder ein neues ACC noch ein neues CRM. Die aktuellen getrennten Arbeitsstände wurden read-only ausgewertet:

- ACC: `20261010_AMAVIO_ACC_Release_J_5_Dual_Sided_Workflow_Working`;
- CRM: `20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working`;
- App-Ausgang: `20261010_AMAVIO_One_R2_Production_Readiness_Contract_Closure_Working`.

ACC und CRM wurden nicht verändert.

## Ergebnis

- ein maschinenlesbares Zuständigkeitsregister für App, ACC und CRM;
- produktgetrennte Identitäts-, Rollen- und Sitzungsgrenzen;
- eine eindeutige System-of-Record-Matrix mit genau einem führenden System je Objektklasse;
- ein CRM→ACC-Handoffprofil auf Basis des bestehenden CRM-R3.4-Vertrags;
- ausdrückliches Verbot einer direkten App↔CRM-Verbindung;
- weiterhin geschlossener App↔ACC-Transport bei fachlich definierten Richtungen;
- read-only Quellenaudit gegen ACC J.5 und CRM R3.4 mit SHA-256-Nachweis;
- aktualisierter App-/ACC-Kompatibilitätsaudit gegen J.5;
- ausführbare Negativtests und ein read-only Systemgrenzen-Endpunkt;
- unveränderte drei App-Rollen, App-Oberfläche und Brand Experience.

## Harte Systemgrenzen

| Produkt | Führende Verantwortung | Kein Auftrag dieses Produkts |
|---|---|---|
| App | externe Journeys für Fachkraft, Wohnanbieter und lokalen Partner | Arbeitgebersteuerung, ACC-Operations, CRM-Pipeline |
| ACC | Mandat, Standort, Kohorte, Arrival Case, Risiko, Arbeitgeber-/Operationsentscheidung und Arrival-Audit | CRM-Beziehungspflege und App-Rollenkonten |
| CRM | Organisationen, Kontakte, Leads, Chancen, Aktivitäten, Outreach-Entwürfe und lokale Handoff-Prüfmarker | Arrival Case, App-Konto, Arbeitgeberentscheidung |

Es gibt keine gemeinsame Datenbank, keinen direkten Datenbankzugriff und keine gemeinsame Sitzung. Eine Referenz überträgt weder Datenhoheit noch Zugriffsrechte.

## Aktueller ACC-Befund

ACC J.5 besitzt gegenüber J.4.1 einen belastbaren lokalen Arbeitgeber-/Operations-Beitragsprozess. Beobachtet wurden Idempotenz, Revisionslogik, Negativrechte, rollenminimierte Projektionen und Audit. J.5 implementiert jedoch weiterhin nicht den App-Vertrag `1.1.0-local-r2-foundation`.

Weiterhin fehlen:

- gemeinsamer versionierter App-/ACC-Message-Envelope;
- Korrelations-ID;
- App→ACC-Consumer;
- ACC→App-Sender;
- appbezogene Replay-/Reconciliation-Logik.

Der Status bleibt deshalb korrekt **NOT_COMPATIBLE_YET**.

## Aktueller CRM-Befund

Das CRM R3.4 bleibt ein eigenständiges internes AMAVIO-System. Sein vorhandener ACC-Handoff ist fachlich definiert, aber technisch vollständig gesperrt:

- nur lokaler Review-Marker;
- kein Payload;
- keine ACC-ID;
- keine automatische Fallanlage;
- keine Kontakt- oder Personendaten im Default;
- kein App-Bezug;
- keine Nachricht, kein Webhook und keine Außenwirkung.

## Lokaler Start

```bash
npm run dev -- --port 4350
```

- App: `http://127.0.0.1:4350`
- lokale synthetische API: `http://127.0.0.1:4351`
- Readiness: `http://127.0.0.1:4351/api/v1/readiness`
- Systemgrenzen: `http://127.0.0.1:4351/api/v1/system-boundaries`

## Qualitätsgate

```bash
npm run qa:all
```

Zusätzlich gezielt:

```bash
npm run qa:systems
npm run qa:browser
```

## Führende Unterlagen

1. `07_CROSS_SYSTEM_OWNERSHIP_AND_CONTRACT_ALIGNMENT_20261010.md`
2. `08_PRODUCT_OWNER_DECISION_MATRIX_CROSS_SYSTEM_20261010.md`
3. `contracts/README.md`
4. `QA/CROSS_SYSTEM_SOURCE_AUDIT_20261010.md`
5. `QA/APP_ACC_COMPATIBILITY_AUDIT_20261010.md`
6. `QA/AMAVIO_ONE_CROSS_SYSTEM_ALIGNMENT_QA_20261010.md`

Die Unterlagen `01` bis `06` und ihre QA bleiben als nachvollziehbare V2.4-/R2-Ausgangsbasis erhalten.

## Weiterhin gesperrt

- produktive Identität, Sitzungsföderation oder Rollenwiederverwendung;
- echte Daten oder produktive Mandanten;
- App-/ACC- oder CRM-/ACC-Livetransport;
- jede direkte App-/CRM-Verbindung;
- automatische CRM→ACC-Fallanlage;
- produktive KI, Matching, Scoring oder automatische Personenentscheidung;
- reale Rollentests;
- externe Kommunikation, Connector, Kosten, Deployment oder Veröffentlichung.

„Alignment“ bedeutet hier: Verantwortungen, Negativrechte und Übergabevoraussetzungen sind anhand der bestehenden Produkte konsistent und ausführbar beschrieben. Es bedeutet nicht, dass ein Produktivsystem verbunden oder freigegeben wurde.
