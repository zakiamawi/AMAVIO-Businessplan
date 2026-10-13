# QA – R3.10 Kopie und Scope-Verifikation

**Datum:** 13.10.2026

## Schutzkette

- Ausgang für diesen Block: `20261013_AMAVIO_One_CRM_R3_9_IA_Consolidation_Working`
- vollständige Sicherung vor R3.10: `20261013_AMAVIO_One_CRM_R3_9_Sicherung_Pre_R3_10_Local_Operations_Assurance`
- bearbeitete Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_10_Local_Operations_Assurance_Working`

Vor der Kopie wurde der lokale R3.9-Server beendet und der SQLite-Zustand kontrolliert übernommen. Ausgang, Sicherung und Arbeitskopie wiesen zu Beginn jeweils 6.630 Einträge im Dateibaum auf. Die Sicherung wird nicht bearbeitet.

## Scope-Prüfung

Verändert werden ausschließlich lokale CRM-Dateien der R3.10-Arbeitskopie: Restore-Assurance-API, lokaler State-/Auditvertrag, vorhandene G1-Evidenzoberfläche, Tests und Dokumentation. Nicht verändert werden die gesicherte R3.9-Kopie, App, ACC, Businessplan, produktive Dienste oder externe Systeme.

## Nicht ausgeführte Aktionen

Kein Git-Push, keine Veröffentlichung, kein Deployment, kein Login, keine Cloud- oder Provider-Aktivierung, kein E-Mail-/Kalenderversand, kein Live-Scraping, keine reale Kontaktdatei und keine App-/ACC-Übertragung. Der lokale Port bleibt an `127.0.0.1` gebunden.

## Datenvertragswirkung

Schema v7, Storage-Key und Migration bleiben unverändert. Der neue Restore-Nachweis nutzt die bereits vorhandene `controlRuns`-Struktur und erfordert keine Datenmigration. Produktivflags bleiben aus.
