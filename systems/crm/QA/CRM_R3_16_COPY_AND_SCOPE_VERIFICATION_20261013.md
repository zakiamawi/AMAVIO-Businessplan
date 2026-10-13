# AMAVIO One CRM – R3.16 Kopier- und Scope-Nachweis

**Datum:** 13.10.2026  
**Ausgangsstand:** `20261013_AMAVIO_One_CRM_R3_15_Local_Real_Data_Staging_Working`  
**Arbeitskopie:** `20261013_AMAVIO_One_CRM_R3_16_Organizations_Contacts_Integration_Working`

## Sicherung

- R3.15 wurde nicht verändert und dient als vollständige Rückfallkopie.
- R3.16 wurde als vollständige datierte Verzeichniskopie angelegt.
- Vor Änderungen an `package.json`, `package-lock.json` und `vite.config.js` wurden Kopien unter `QA/R3_16_CONFIG_BACKUP_20261013/` abgelegt.

## Bewusst veränderte Bereiche

- Hauptnavigation und Seitenrouting;
- Organisations- und Kontaktansicht;
- lokale Read-only-API-Aliasse für importierte CRM-Einträge;
- normale CRM-Detailansichten für importierte Organisationen und Kontakte;
- responsive Gestaltung, E2E- und Browser-QA;
- README, Capability-Matrix und Product-Owner-Entscheidungsregister.

## Bewusst unveränderte Bereiche

- synthetisches kanonisches Datenmodell und Schema v7;
- Pipeline-, Aufgaben-, Arbeitsjournal-, Growth-, Auswertungs- und Systemlogik;
- Importdatei und deren Inhalte;
- externe IDs, Mehrfachbeziehungen, Namenshinweise, Sperren und Provenienz;
- App- und ACC-Codebasen;
- sämtliche Cloud-, Connector-, Versand- und Deployment-Gates.

## Produktgrenze

Die UI-Korrektur ist keine produktive Datenmigration. Importierte Datensätze werden nur lokal gelesen. Es wurde kein Supabase-Projekt, kein Login, kein Versand, keine Cloud-Synchronisierung und keine externe Übertragung aktiviert.
