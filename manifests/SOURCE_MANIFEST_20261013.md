# AMAVIO Source Manifest

Stand: 13.10.2026

| GitHub-Ziel | Lokale Quelle | Auswahl |
|---|---|---|
| `businessplan/current/` | `AMAVIO_AKTUELLSTER NEUdocx Kopie.docx` | aktueller Kernanker |
| `finance/current/` | `02_Finanztool/AMAVIO_Finanztool_Monatsmodell_S2_Tragbare_Preislogik_Arbeitskopie_20260822.xlsx` | aktuelle S2-Arbeitslogik |
| `finance/current/original/` | `finanztool-2024-02-22-data-4.xlsx` | tatsaechlich vorhandene Originalbasis; der im Projektregelwerk genannte Dateiname ohne `-4` war lokal nicht vorhanden |
| `investor/current/` | `AMAVIO_Investoren_Businessplan.docx/.pdf` | aktueller Investorenplan |
| `founder/current/` | `AMAVIO_One_Founder_Profile_Deckblatt_plus_CV_2Seiten_Manchester_Standalone_20260908.pdf` | kuratierte Geschaeftsunterlage, keine privaten Nachweise |
| `customer/current/` | `00_Abgabe_AMAVIO_One_20260908_Redesign/01_OnePager`, `02_Kundendeck_Erstkontakt_9F`, `03_Kundendeck_Entscheider_13F` | finale kundennahe Ausgaben; Richtungsvorschauen ausgeschlossen |
| `funding/current/foerderradar/` | `03_Anlagen_Foerderung_GmbH/21_*`, `22_*`, `23_*` | aktuelle Radar- und Trackerdateien |
| `funding/current/next-digital-tech/` | ausgewaehlte Dateien aus `03_Anlagen_Foerderung_GmbH/24_NEXT_DigitalTech_Arbeitsblock_20260924` | Personen-/Formulardatenblatt, Kontaktformularstaende, Renderchecks und Unterarchive ausgeschlossen |
| `presentations/current/` | `07_Praesentationen/20260925_App_Prototype_Integration/output` | sechs aktuelle Ausgabedateien |
| `brand/current/` | `08_Website/brand/AMAVIO_One_Brandbook_Master_V2_Designveredelung_20260930` | Brandbook, Tokens, Assets, Buildquelle und kuratierte Kontaktblaetter |
| `systems/app/` | `09_App/20261010_AMAVIO_One_Cross_System_Ownership_Contract_Alignment_Working` | Quelle, Tests, Vertraege und QA-Dokumentation; Archive, Builds, Dependencies, Laufzeit und Screenshots ausgeschlossen |
| `systems/acc/` | `10_Control_Center/20261013_AMAVIO_ACC_Release_Q_True_Workspaces_Working` | Quelle, Tests, Architektur und QA-Dokumentation; Archive, DB-Dateien und Screenshots ausgeschlossen |
| `systems/crm/` | `09_Unternehmenssystem/07_AMAVIO_One_CRM/20261013_AMAVIO_One_CRM_R3_17_Unified_Global_Search_Working` | Quelle, Tests und Governance; `local-data`, Echtdaten-Staging, Datenbanken, Exporte, Backups, Builds und Screenshots ausgeschlossen |

## Harte Ausschluesse

Keine Geheimnisse, Auth-Artefakte, CRM-Echtdaten, Kontaktlisten, SQLite-/DB-Dateien, lokalen Exporte/Backups, Ausweisdateien, private Nachweise, Arbeitszeugnisse, Installationsdateien, `node_modules`, Builds, Laufzeitdaten oder redundante Arbeitskopien wurden neu uebernommen.

