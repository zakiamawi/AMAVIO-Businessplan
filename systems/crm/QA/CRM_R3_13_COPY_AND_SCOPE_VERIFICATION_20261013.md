# R3.13 – Copy & Scope Verification

**Quelle:** `20261013_AMAVIO_One_CRM_R3_12_G1_External_Technical_Readiness_Working`  
**Sicherung:** `20261013_AMAVIO_One_CRM_R3_12_Sicherung_Pre_R3_13_C1_Decision_Closure`  
**Arbeitskopie:** `20261013_AMAVIO_One_CRM_R3_13_C1_Decision_Closure_Working`

## Kopiernachweis

- Quelle: 6.895 Dateien.
- Sicherung: 6.895 Dateien.
- Arbeitskopie unmittelbar nach Kopie: 6.895 Dateien.
- `diff -qr` Quelle gegen Sicherung: keine Abweichung.
- Der R3.12-Server wurde vor der Kopie kontrolliert beendet, damit SQLite/WAL nicht während des Kopierens verändert wurden.

## Berührter Scope

- C1-Governance und Auditereignis PO-CRM-045;
- sichtbare C1-Teilentscheidung im Bereich „Zugriff & Gerät“;
- lokale Gerätebefunde und ausdrückliche Systemkonfiguration;
- Dokumentation, Tests, README und QA-Artefakte;
- neuer lokaler Standardport 4393.

## Unberührt

Schema v7, fachliche CRM-Objekte, synthetische Beispieldaten, Pipeline-, Kontakt-, Organisations-, Partner-, Aufgaben-, Journal-, Research-, Outreach- und Auswertungsfunktionen bleiben erhalten. Keine App-, ACC-, Cloud-, Provider- oder Echtdatenintegration wurde aktiviert.

## Produktgrenze

Die Sicherung ist eine lokale Arbeitsstandsicherung und kein produktives Backup. Die Systemkonfiguration gilt nur für das lokale Gerät und ist keine Security-Zertifizierung des CRM.
