# QA – R3.9 Kopie und Schutz des Ausgangsstands

**Datum:** 13.10.2026

## Geprüfte Ordner

- Ausgangsstand: `20261013_AMAVIO_One_CRM_R3_8_G1_Legal_Access_Assurance_Working`
- unveränderte Sicherung: `20261013_AMAVIO_One_CRM_R3_8_Sicherung_Pre_IA_Consolidation`
- neue Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_9_IA_Consolidation_Working`

## Ausführung

1. Die aktive R3.8-SQLite-Datei wurde mit `PRAGMA wal_checkpoint(FULL)` konsolidiert.
2. Sicherung und Arbeitskopie wurden vollständig mit erhaltenen Metadaten angelegt.
3. Direkt nach der Kopie enthielten alle drei Ordner jeweils **6.548 Dateien**.
4. Ein nachgelagerter `rsync --checksum --dry-run`-Vergleich zwischen R3.8-Ausgangsordner und Sicherung zeigte – ausgenommen laufzeitveränderliche `local-data/`- und generierte `dist/`-Inhalte – **keine Abweichung**.

## Änderungsgrenze

Nur die R3.9-Arbeitskopie wurde bearbeitet. Weder Ausgangsordner noch Sicherung wurden für die IA-Konsolidierung editiert. Es erfolgten kein Push, kein Deployment, keine Veröffentlichung, kein Connectorzugriff und keine Übertragung an externe Systeme.

## Ergebnis

**BESTANDSSCHUTZ BESTANDEN.** Der R3.8-Stand ist vollständig separat gesichert; R3.9 kann jederzeit gegen Ausgangsstand und Sicherung verglichen werden.

