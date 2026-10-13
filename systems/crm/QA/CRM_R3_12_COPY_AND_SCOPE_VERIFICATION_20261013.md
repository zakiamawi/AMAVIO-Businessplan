# R3.12 – Copy & Scope Verification

**Datum:** 13.10.2026  
**Ausgang:** `20261013_AMAVIO_One_CRM_R3_11_G1_PO_Decision_Alignment_Working`  
**Sicherung:** `20261013_AMAVIO_One_CRM_R3_11_Sicherung_Pre_R3_12_G1_External_Technical_Readiness`  
**Arbeitskopie:** `20261013_AMAVIO_One_CRM_R3_12_G1_External_Technical_Readiness_Working`

## Sicherungsnachweis

- Ausgangsordner vor R3.12: 6.803 Dateien.
- Sicherungsordner: 6.803 Dateien.
- `diff -qr` zwischen Ausgangsordner und Sicherung: keine Abweichung.
- R3.12-Arbeitskopie nach Dokument- und Codeergänzungen: 6.816 Dateien zum Zeitpunkt dieses Nachweises.
- Ausgangsordner und Sicherung wurden nicht durch R3.12-Codeänderungen überschrieben.

## Berührter Scope

- `scripts/local-crm-server.mjs`: lokale Sicherheitsheader, Origin-/Cross-Site-Grenze und restriktive Dateirechte;
- `src/domain/g1Governance.js`, `src/components/G1ReadinessPanel.jsx`, Migration/Seed: sichtbare lokale Härtung und Geräteblocker;
- Persistenz-, Unit-, statische und Browser-QA;
- R3.12-, G1-03-, G1-06-, G1-07/09-, G1-10- und C1-Entscheidungsunterlagen;
- README sowie zentrale Capability-, Permissions-, Privacy-, Test-, Reife- und PO-Matrizen.

## Unberührt beziehungsweise ausdrücklich nicht aktiviert

- keine realen Kontakte, keine Research-Teilnehmerdaten und kein Import aus Altdaten;
- keine Authentifizierung, Provider-, E-Mail-, Kalender-, Cloud-, App- oder ACC-Aktivierung;
- keine Änderung von macOS-Firewall, FileVault, Bildschirmsperre oder anderen Systemeinstellungen;
- kein Deployment, Git-Push, Versand, Kauf oder externe Übertragung;
- Datenmodell bleibt Schema v7; fachliche CRM-Core-Funktionen und synthetische Beispieldaten bleiben erhalten.

## Wahrheitsgrenze

Die Sicherung belegt die lokale Kopie und der Scope-Nachweis belegt die vorgesehenen Änderungen. Beides ist kein Backupkonzept für Produktion, keine Security-Freigabe und keine Rechts-/Datenschutzfreigabe.
