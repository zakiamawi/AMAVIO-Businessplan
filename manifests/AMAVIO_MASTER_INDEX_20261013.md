# AMAVIO Master-Index

Stand: 13.10.2026  
Status: verbindlicher Arbeits- und Ablageindex fuer den Projektordner `Businessplan AKTUELL`

## 1. Verbindliche Quelle

Die fachliche und dokumentarische Quelle fuer AMAVIO ist ausschliesslich:

`/Users/zakia/Desktop/Businessplan AKTUELL`

OneDrive, alte Exportordner, Archivkopien und GitHub allein sind keine fachliche Quelle. GitHub dient der versionierten, kuratierten Sicherung und Zusammenarbeit. Ein lokaler Arbeitsstand gilt erst dann als auf GitHub uebernommen, wenn er in der Konsolidierungs- und QA-Notiz mit Commit und Zielpfad nachgewiesen ist.

## 2. Eine Zentrale, zwei private GitHub-Repositories

Zur Vermeidung weiterer Ablageinseln werden nur zwei private GitHub-Repositories verwendet:

1. `zakiamawi/AMAVIO-Businessplan`  
   Kuratierter Master fuer Governance, Businessplan, Finanzen, Foerderung, Marke, Kunden- und Investorenunterlagen, Praesentationen sowie klar getrennte Quellstaende von App, ACC und CRM.
2. `zakiamawi/amavio-living-site`  
   Ausschliesslich Website-Quellstand und websitebezogene Release-Dokumentation.

App, Arrival Control Center und CRM bleiben getrennte Produkte und getrennte Quellbereiche. Die gemeinsame Ablage im Master-Repository behauptet weder eine technische Integration noch einen gemeinsamen Datenbestand.

## 3. Aktuelle Kernanker

| Bereich | Verbindlicher lokaler Stand |
|---|---|
| Businessplan | `AMAVIO_AKTUELLSTER NEUdocx Kopie.docx` |
| Finanzmodell | `02_Finanztool/AMAVIO_Finanztool_Monatsmodell_S2_Tragbare_Preislogik_Arbeitskopie_20260822.xlsx` |
| Finanztool Original | `finanztool-2024-02-22-data-4.xlsx` (tatsaechlich vorhandene Datei; der im Projektregelwerk genannte Dateiname ohne `-4` fehlt lokal) |
| Investorenplan | `AMAVIO_Investoren_Businessplan.docx` |
| Brandbook | `08_Website/brand/AMAVIO_One_Brandbook_Master_V2_Designveredelung_20260930` |
| Website | `08_Website/amavio-living-site/20261013_V17_8_Public_Release` |
| App | `09_App/20261010_AMAVIO_One_Cross_System_Ownership_Contract_Alignment_Working` |
| Arrival Control Center | `10_Control_Center/20261013_AMAVIO_ACC_Release_Q_True_Workspaces_Working` |
| CRM | `09_Unternehmenssystem/07_AMAVIO_One_CRM/20261013_AMAVIO_One_CRM_R3_17_Unified_Global_Search_Working` |
| Praesentationen | `07_Praesentationen/20260925_App_Prototype_Integration` |
| GitHub-Audit | `90_QA/AMAVIO_GITHUB_VOLLSTAENDIGKEITSAUDIT_20261013.md` |
| GitHub-Konsolidierung | `90_QA/AMAVIO_GITHUB_KONSOLIDIERUNG_QA_20261013.md` |

## 4. Zielstruktur im Master-Repository

```text
AMAVIO-Businessplan/
  README.md
  governance/
  businessplan/current/
  finance/current/
  funding/current/
  founder/current/
  customer/current/
  investor/current/
  presentations/current/
  brand/current/
  systems/app/
  systems/acc/
  systems/crm/
  manifests/
```

Der Zusatz `current` kennzeichnet die kuratierte aktuelle Fassung. Historische Arbeitskopien bleiben lokal im Archiv und werden nicht ungeprueft dupliziert.

## 5. Verbindliche Ausschluesse

Nicht nach GitHub uebernommen werden:

- Zugangsdaten, Tokens, API-Keys, Passwoerter, Auth-Artefakte oder private Schluessel,
- `.env`-Dateien und lokale Konfigurationen mit geheimen Werten,
- CRM-Echtdaten, Kontaktlisten, Import-Staging, lokale Datenbanken, SQLite-Dateien, Exporte und Backups,
- Personalausweise, private Nachweise, Arbeitszeugnisse und vergleichbare personenbezogene Unterlagen,
- `node_modules`, Build-Artefakte, Browserprofile, Laufzeitdaten und Screenshotsammlungen,
- alte Archive, redundante Arbeitskopien und unklare Zwischenstaende,
- Installationsdateien und sonstige projektfremde Dateien.

## 6. Statusbegriffe

- **lokal aktuell**: verbindlicher Arbeitsstand im Projektordner.
- **lokal QA-geprueft**: lokal mit dokumentierter Pruefung bestaetigt.
- **auf GitHub gesichert**: in einem privaten Repository committed und gepusht.
- **im Pull Request**: auf GitHub zur Zusammenfuehrung vorbereitet, aber noch nicht im Standardbranch.
- **deployed / veroeffentlicht**: separat nachgewiesener externer Zustand; ein GitHub-Commit allein belegt dies nicht.

## 7. Ordnung und Archivierung

Aufraeumen bedeutet archivieren, nicht loeschen. Vor dem Verschieben werden Quelle, Ziel und Grund in einer Manifest- oder QA-Datei festgehalten. Unklare oder sensible Dateien werden nicht automatisch umsortiert, bis ihre fachliche Zuordnung sicher ist.

