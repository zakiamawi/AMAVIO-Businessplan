# AMAVIO GitHub-Konsolidierung – QA-Protokoll

Datum: 13.10.2026  
Projektquelle: `/Users/zakia/Desktop/Businessplan AKTUELL`  
Status: in Arbeit

## Ziel

Aktuelle, kuratierte AMAVIO-Unterlagen und Quellstaende nachvollziehbar auf zwei private GitHub-Repositories verteilen, ohne Archive, Duplikate, CRM-Echtdaten, lokale Datenbanken, personenbezogene Nachweise, Zugangsdaten oder Laufzeitartefakte zu uebernehmen.

## Gepruefte GitHub-Ausgangslage

| Repository | Ausgangslage | Bewertung |
|---|---|---|
| `zakiamawi/AMAVIO-Businessplan` | privates Repository; offener Draft-PR `#17`; bisher nur Governance-Grundgeruest | unvollstaendig, wird kuratiert ergaenzt |
| `zakiamawi/amavio-living-site` | privates Website-Repository; Remote und lokaler Arbeitsstand auseinander | gesonderte, deployment-sichere Konsolidierung erforderlich |

Vollstaendiger Ausgangsaudit: `90_QA/AMAVIO_GITHUB_VOLLSTAENDIGKEITSAUDIT_20261013.md`

## Tool- und Zugriffsstatus

| Werkzeug | Status |
|---|---|
| Git | installiert, callable, Remote-Lesezugriff smoke-tested |
| GitHub-Connector | installiert, aktiviert, callable, authentifiziert, read-only smoke-tested |
| GitHub CLI `gh` | nicht installiert |
| Git LFS | nicht installiert; fuer die aktuell ausgewaehlten Dateien nur zulaessig, wenn keine Datei das normale GitHub-Einzeldateilimit erreicht |

## Sicherheitsgrenzen

- Keine Geheimnisse oder Auth-Artefakte lesen, kopieren oder versionieren.
- Keine CRM-Echtdaten, Kontaktlisten, lokalen Datenbanken, Backups oder Import-Staging-Dateien versionieren.
- Keine persoenlichen Nachweise oder Identitaetsdokumente versionieren.
- Keine produktive Integration zwischen App, ACC und CRM behaupten.
- Kein Deployment, DNS-Wechsel, Versand oder externe Freigabe aus diesem Vorgang ableiten.

## Kuratierte Quellstaende

| Bereich | Lokale Quelle | GitHub-Ziel | Status |
|---|---|---|---|
| Businessplan | `AMAVIO_AKTUELLSTER NEUdocx Kopie.docx` | `businessplan/current/` | vorgesehen |
| Finanzmodell | `02_Finanztool/AMAVIO_Finanztool_Monatsmodell_S2_Tragbare_Preislogik_Arbeitskopie_20260822.xlsx` | `finance/current/` | vorgesehen |
| Finanztool Original | `finanztool-2024-02-22-data-4.xlsx` | `finance/current/original/` | uebernommen; der im Projektregelwerk genannte Dateiname ohne `-4` fehlt lokal |
| Investorenplan | `AMAVIO_Investoren_Businessplan.docx` | `investor/current/` | vorgesehen |
| Brandbook | `08_Website/brand/AMAVIO_One_Brandbook_Master_V2_Designveredelung_20260930` | `brand/current/` | vorgesehen |
| Website | `08_Website/amavio-living-site/20261013_V17_8_Public_Release` | `amavio-living-site` | gesondert zu pruefen |
| App | `09_App/20261010_AMAVIO_One_Cross_System_Ownership_Contract_Alignment_Working` | `systems/app/` | vorgesehen |
| ACC | `10_Control_Center/20261013_AMAVIO_ACC_Release_Q_True_Workspaces_Working` | `systems/acc/` | vorgesehen |
| CRM | `09_Unternehmenssystem/07_AMAVIO_One_CRM/20261013_AMAVIO_One_CRM_R3_17_Unified_Global_Search_Working` | `systems/crm/` | vorgesehen, harte Datenausschluesse |
| Praesentationen | `07_Praesentationen/20260925_App_Prototype_Integration/output` | `presentations/current/` | vorgesehen |

## Aenderungsprotokoll

| Zeitpunkt | Aktion | Nachweis |
|---|---|---|
| 13.10.2026 | Vollstaendigkeitsaudit erstellt | `90_QA/AMAVIO_GITHUB_VOLLSTAENDIGKEITSAUDIT_20261013.md` |
| 13.10.2026 | Master-Index erstellt | `00_START_HIER/AMAVIO_MASTER_INDEX_20261013.md` |
| 13.10.2026 | Sicherung vor moeglicher Git-Konfigurationsaenderung erstellt | `_Codex_Tooling_Backups/20261013_github_konsolidierung_pre/` |
| 13.10.2026 | Bestehende GitHub-Altstaende ohne Loeschung nach `archive/pre-20261013/` verschoben | Inhalts-Commit `f9bdede` |
| 13.10.2026 | Kuratierte Master-Struktur erstellt; Abhaengigkeits-Symlink und `.bak`-Konfigurationskopien vor dem Push entfernt | Inhalts-Commit `f9bdede` |
| 13.10.2026 | Remote-Branch und Pull Request read-only verifiziert | PR `#17`, Head `c04065c`, AgentShield Security Scan erfolgreich |

## Abschlusspruefungen

Vor Abschluss zu dokumentieren:

- [x] Dateiliste und Groessenlimit geprueft; keine neu kuratierte Datei ueber 95 MB
- [x] Dateinamen auf moegliche Geheimnis-/Datenartefakte geprueft; nur fachliche Design-Token- und Secret-Strategie-Dokumentnamen als erklaerte Fehlalarme
- [x] CRM `local-data`, SQLite, Backups und Exporte ausgeschlossen
- [x] Systemquellen mit ihren jeweiligen QA-Kommandos geprueft
- [x] Git-Status und Diff vor Commit kontrolliert; `git diff --cached --check` ohne Fehler
- [x] Inhalts-Commit und Zielbranch dokumentiert: `f9bdede` auf `master-project-20260919`
- [x] Pull Request nach Push erneut geprueft: `#17` offen, Draft, `mergeable_state: clean`; Head beim Inhalts-Readback `c04065c`
- [ ] Website-Repository ohne unbeabsichtigtes Produktionsdeployment behandelt

## System-QA am 13.10.2026

| System | Kommando | Ergebnis |
|---|---|---|
| App | `npm run qa:all` | PASS; 62/62 Tests, Lint, Build und Quellgrenzen gruen; App–ACC weiterhin bewusst `NOT_COMPATIBLE_YET` mit fuenf fehlenden Peer-Faehigkeiten |
| ACC | `npm run qa:all` | Logik PASS 337/337; Static PASS; Brandbook PASS; erster Browserstart durch macOS-Sandbox blockiert |
| ACC Browser | `npm run qa:browser` ausserhalb der eingeschraenkten Sandbox | PASS; lokale Golden Journey und Rollen-/Arbeitsbereiche geprueft |
| CRM | `npm run qa:full` | PASS; Build, statische QA, 33 Unit-, 16 Contract-, 11 Component-, 6 Integration- und 1 Persistence-Test gruen |

Die Tests belegen lokale Quell- und Funktionsqualitaet. Sie belegen keine produktive Integration, keine Datenschutzfreigabe, kein Deployment und keine Freigabe fuer CRM-Outreach.

## Offene Punkte

1. Der Website-Remote muss deployment-sicher aktualisiert werden; die Git-Verknuepfung mit Vercel ist vor einem Branch-Push zu pruefen.
2. Der Draft-PR `#17` ist erst nach Inhalts-, Sicherheits- und Dateigroessenpruefung zusammenfuehrungsbereit.
3. Lokale Aufraeumarbeiten erfolgen ausschliesslich archivierend und mit Manifest.

