# QA – R3.15 Kopie und Scope-Verifikation

**Datum:** 13.10.2026  
**Prüfobjekt:** AMAVIO One CRM R3.15 Lokales Echtdaten-Staging

## Ausgangsschutz

- Ausgang: `20261013_AMAVIO_One_CRM_R3_14_C1_External_Review_Readiness_Working`
- Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_15_Local_Real_Data_Staging_Working`
- Arbeitsweise: vollständige datierte Kopie vor der R3.15-Änderung
- Konfigurationssicherungen vor Versions-/Portanpassung:
  - `QA/package.json.before-r3-15-20261013.bak`
  - `QA/package-lock.json.before-r3-15-20261013.bak`
  - `QA/vite.config.js.before-r3-15-20261013.bak`

Der Ausgangsordner wurde nicht überschrieben. Alle R3.15-Änderungen liegen in der neuen Arbeitskopie.

## Quellschutz

| Datei | Verwendung | SHA-256 |
|---|---|---|
| `AMAVIO_Altdaten_Pruefung_und_CRM_Staging_V5_Vollverifikation_20261013.xlsx` | großer Pool und Reviewstruktur | `87d405f21c7e91947d18ee60b99ada89e8e14028c4c421f84a2f475a0c67e29d` |
| `AMAVIO_CRM_Importvorbereitung_Bestaetigt_Aktuell_238_20261013.xlsx` | bestätigt aktueller Teilbestand und Beziehungen | `88c17fe63a8eb41c3a8d83b4370effb788dba98f419aaf341fd1b2e5fa03398b` |
| `AMAVIO_CRM_R3_10_Feldmapping_und_DryRun_238_20261013.xlsx` | Mapping-, Quarantäne- und Dublettenreferenz | `58bff20d35976f1407e3cd58a6ea852d25fbc3cba3a296796a73dfe7ec856201` |

Die drei Arbeitsmappen wurden read-only verarbeitet und nicht verändert.

## Scope-Abgleich

### Neu hinzugefügt

- getrennte lokale Staging-SQLite-Datei;
- kontrollierter, idempotenter Importer;
- GET-only-Staging-Store und lokale API;
- sichtbarer Navigationsbereich `Altdaten-Staging`;
- Pool-, bestätigt-aktuell-, Organisations-, Kontakt-, Prüfqueue-, Quarantäne-, Quellen- und Sperransichten;
- Filter, Pagination, Detaildialog und Provenienzansicht;
- Vertrags- und QA-Tests für Umfang, Beziehungen, Sperren und Idempotenz.

### Erhalten

- kompletter synthetischer CRM-Core;
- AMAVIO-Designsystem und vorhandene Konzeptassets;
- bestehende lokale Persistenz, Reset- und Restore-Funktionen;
- G1-/C1-Sperren;
- getrennte App- und ACC-Codebasen.

### Nicht umgesetzt

- schreibende Bearbeitung realer Kontakte in der UI;
- Core-Übernahme, Outreach, Versand oder Kampagnen;
- Cloud-, Supabase- oder Connectoraktivierung;
- Authentifizierung, Mehrbenutzerbetrieb, Deployment;
- App- oder ACC-Integration.

## Ergebnis

**BESTANDEN für die Scope- und Kopiergrenze.** Die R3.15-Umsetzung ist auf die datierte Arbeitskopie und die lokale Staging-Funktion begrenzt. Diese Aussage ist keine Produktiv-, Security-, Rechts- oder Datenschutzfreigabe.

