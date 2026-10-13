# AMAVIO One – kuratierter Master

Stand: 13.10.2026

Repository: private

Zweck: versionierte, geordnete Sicherung der aktuellen AMAVIO-Arbeitsstaende

## Verbindliche Quelle

Die fachliche Quelle bleibt der lokale Projektordner:

`/Users/zakia/Desktop/Businessplan AKTUELL`

Dieses Repository ist eine kuratierte GitHub-Sicherung. Es ersetzt weder die lokale Quellenpruefung noch eine dokumentierte Freigabe. Ein Commit belegt insbesondere kein Deployment, keinen Versand und keine externe Genehmigung.

## Aktuelle Struktur

| Pfad | Inhalt |
|---|---|
| `businessplan/current/` | aktueller Businessplan-Arbeitsstand |
| `finance/current/` | aktuelles S2-Finanzmodell und gekennzeichnete Originalbasis |
| `funding/current/` | kuratierte Foerderradare und NEXT-/Digital-Tech-Unterlagen |
| `founder/current/` | freigegebene gruenderbezogene Geschaeftsunterlage |
| `customer/current/` | One-Pager sowie Kundenpraesentationen |
| `investor/current/` | aktueller Investoren-Businessplan |
| `presentations/current/` | aktuelle kuratierte Praesentationsausgaben |
| `brand/current/` | Brandbook, Design-Tokens, Assets und Reproduktionsquelle |
| `systems/app/` | App-Quellstand; eigenstaendiges Produkt |
| `systems/acc/` | Arrival Control Center; eigenstaendiges Produkt |
| `systems/crm/` | lokales CRM; eigenstaendiges Produkt, ohne Echtdaten/DB-Dateien |
| `manifests/` | Master-Index, Vollstaendigkeitsaudit und Konsolidierungs-QA |
| `governance/` | Sicherheits- und historische Migrationsregeln |
| `archive/pre-20261013/` | bereits zuvor versionierte Altstaende; nicht aktuelle Quelle |

## Systemgrenze

App, Arrival Control Center und CRM bleiben drei getrennte Produkte und Codebasen. Die gemeinsame Ablage in diesem Repository bedeutet keine technische Integration, keine gemeinsame Datenbank und keinen produktiven Datenaustausch.

## Datenschutz und Sicherheit

Nicht versioniert werden Zugangsdaten, `.env`-Dateien, Tokens, Auth-Artefakte, CRM-Echtdaten, Kontaktlisten, Import-Staging, SQLite-/DB-Dateien, lokale Backups, persoenliche Nachweise, Ausweisdokumente, Laufzeitdaten, `node_modules`, Builds und umfangreiche Screenshot-Sammlungen. Siehe `SECURITY_BOUNDARY.md`.

## Website

Der aktuelle Website-Quellstand gehoert ausschliesslich in das separate private Repository `zakiamawi/amavio-living-site`. Historische Website-Dateien in `archive/pre-20261013/` sind keine Deployment-Quelle.

## Status

Die in `current/` abgelegten Fassungen sind kuratierte Arbeitsstaende. Freigabe-, Einreichungs-, Produktions- oder Veroeffentlichungsstatus wird ausschliesslich in den jeweiligen QA- und Statusdokumenten nachgewiesen.
