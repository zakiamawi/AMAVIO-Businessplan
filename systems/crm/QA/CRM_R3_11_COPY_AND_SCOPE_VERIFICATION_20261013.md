# QA – R3.11 Copy & Scope Verification

**Datum:** 13.10.2026  
**Prüfung:** Sicherung und Arbeitskopie vor G1 Product-Owner Decision Alignment

## Verifizierte Pfade

- Quelle: `20261013_AMAVIO_One_CRM_R3_10_Local_Operations_Assurance_Working`
- Sicherung: `20261013_AMAVIO_One_CRM_R3_10_Sicherung_Pre_R3_11_G1_PO_Decision_Alignment`
- Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_11_G1_PO_Decision_Alignment_Working`

## Nachweis

- SQLite-WAL wurde vor der Kopie kontrolliert gecheckpointet; Ergebnis `busy=0`, `log=0`, `checkpointed=0`.
- Quelle und Sicherung enthalten jeweils 6.696 Dateien.
- Der Inhaltsvergleich außerhalb der wiederverwendeten Abhängigkeits- und Buildverzeichnisse zeigte keine Abweichung.
- Die Arbeitskopie wurde anschließend separat mit 6.696 Dateien erstellt und vor der Bearbeitung vollständig gegen R3.10 verglichen.
- Die Sicherung wurde nach ihrer Verifikation nicht bearbeitet.

## Scope-Grenze

R3.11 darf ausschließlich die lokale synthetische G1-Beschlussangleichung, deren Dokumentation und QA verändern. Unverändert gesperrt bleiben Echtdaten, Import, Versand, Authentifizierung, C1, Hosting, Deployment, App, ACC und externe Connectoren.

## Hinweis zum Kopierwerkzeug

Der erste Metadatenkopierlauf meldete ausschließlich nicht übertragbare Symlink-Flags in `node_modules`. Der anschließende Dateizahl- und Inhaltsvergleich bestätigte die vollständige Sicherung. Die Arbeitskopie wurde mit einem separaten erfolgreichen `rsync -a`-Lauf erzeugt.
