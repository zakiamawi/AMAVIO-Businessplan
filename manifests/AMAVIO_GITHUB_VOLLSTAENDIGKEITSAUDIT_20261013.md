# AMAVIO GitHub-Vollstaendigkeitsaudit

**Datum:** 13.10.2026  
**Arbeitskontext:** Read-only-Abgleich des lokalen Masterprojekts mit den erreichbaren GitHub-Repositories  
**Lokale Source of Truth:** `/Users/zakia/Desktop/Businessplan AKTUELL`  
**Ergebnis:** **NICHT VOLLSTAENDIG / NICHT AKTUELL SYNCHRONISIERT**

## 1. Kurzurteil

Die aktuellen AMAVIO-Dateien sind nicht vollstaendig auf GitHub gespeichert oder uebernommen.

- Das lokale Masterprojekt ist historisch mit dem Website-Repository `zakiamawi/amavio-living-site` verbunden.
- Dessen aktueller Remote-Branch `main` enthaelt nach erfolgreichem Fetch nur 44 Dateien.
- Der lokale Branch `main` ist gegenueber `origin/main` 11 Commits voraus und 9 Commits zurueck.
- Lokal bestehen 21 geaenderte, bereits getrackte Dateien, 11.688 nicht getrackte Dateien und 353.633 ignorierte Dateien/Artefakte.
- Es gibt keine gestagten Dateien.
- App, Arrival Control Center/Plattform und CRM sind auf `origin/main` nicht enthalten.
- Die aktuellen Office-/PDF-Bestaende fuer Businessplan, Finanzplanung, Foerderung, Praesentationen und weitere Unterlagen werden durch die bestehenden Schutzregeln bewusst nicht normal gestagt.
- Das zweite private Repository `zakiamawi/AMAVIO-Businessplan` ist ebenfalls keine vollstaendige Spiegelung. Der offene Draft-PR #17 umfasst drei Governance-Dateien und schliesst eine Office-/PDF-Massenmigration sowie sensible Dateien ausdruecklich aus.

Damit ist GitHub derzeit weder ein vollstaendiges Backup noch eine vollstaendige aktuelle Arbeitskopie des lokalen AMAVIO-Masterprojekts.

## 2. Verifizierte GitHub-Repositories

### `zakiamawi/amavio-living-site`

- Sichtbarkeit: privat
- Default-Branch: `main`
- GitHub-Connector: installiert/aktiviert, callable, authentifiziert und fuer den Repository-Lesezugriff smoke-getestet
- Remote-HEAD: `69e3562859390b6277e292f6fda972969744b825`
- Remote-Commitdatum: 22.08.2026
- Dateien im aktuellen Remote-Tree: 44
- Office-Dateien im aktuellen Remote-Tree: 0
- Lokaler HEAD: `ce240f9653b72b30578ac3716c177095817d4a1e`
- Lokaler Commitstand: 06.09.2026
- Divergenz: 11 Commits lokal voraus, 9 Commits lokal zurueck
- Gemeinsamer Ausgangspunkt: `9a67c7e48df056b771e937a6cf5459ff5501716b`

Ein vorbereiteter lokaler Reconciliation-Branch existiert:

- Branch: `reconcile/website-origin-20260919`
- Head: `4b8189cedf2b3ecaffb25f086adc93b090465c84`
- Gegenueber `origin/main`: 12 Commits voraus, 0 zurueck
- Status: lokal vorhanden, nicht als aktueller GitHub-Stand nachgewiesen

### `zakiamawi/AMAVIO-Businessplan`

- Sichtbarkeit: privat
- Default-Branch: `main`
- Offener Draft-PR: `#17 Prepare AMAVIO master project governance`
- PR-Status: offen, nicht gemergt, Draft
- Umfang: 3 Commits, 3 geaenderte Dateien, 147 Textzeilen
- Zweck: Governance, Migrationsplan und Sicherheitsgrenze
- Explizit nicht enthalten: sensible Dokumente, Office-/PDF-Massenmigration, Secrets/Auth-Artefakte und Website-Migration

## 3. Bereichsmatrix

Die Spalten bedeuten:

- **Remote main:** Dateien im aktuellen Tree von `origin/main` des Website-Repositories
- **Lokal getrackt:** Dateien im lokalen Git-Index/HEAD
- **Geaendert:** aktuell geaenderte getrackte Dateien
- **Untracked:** lokal vorhanden, nicht getrackt und nicht ignoriert
- **Ignoriert:** durch `.gitignore`, `.git/info/exclude` oder bereichseigene Ignore-Regeln ausgeschlossen

| Bereich | Remote main | Lokal getrackt | Geaendert | Untracked | Ignoriert | Urteil |
|---|---:|---:|---:|---:|---:|---|
| Website gesamt | 37 | 44 | 19 | 1.703 | 15.164 | Nicht aktuell/vollstaendig |
| Brand/Brandbook | 4 | 4 | 0 | 19 | 227 | Nur wenige Branding-Markdowns auf Remote; Brandbooks nicht vollstaendig |
| App | 0 | 0 | 0 | 1.586 | 93.060 | Nicht auf Remote main |
| Arrival Control Center / Plattform | 0 | 0 | 0 | 8.123 | 3.051 | Nicht auf Remote main |
| CRM | 0 | 0 | 0 | 0 | 235.412 | Vollstaendig aus diesem Repo ausgeschlossen |
| Businessplan | 0 | 16 | 0 | 0 | 653 | Lokale Textstaende vorhanden; aktuelle DOCX/PDF nicht auf Remote main |
| Finanztool | 0 | 0 | 0 | 0 | 98 | Nicht auf Remote main |
| Foerderung/GmbH/Anlagen | 0 | 0 | 0 | 0 | 2.177 | Nicht auf Remote main |
| Kundenunterlagen | 0 | 14 | 0 | 0 | 110 | Lokale Textstaende, aber nicht auf aktuellem Remote main |
| Investorenunterlagen | 0 | 15 | 0 | 0 | 48 | Lokale Textstaende, aber nicht auf aktuellem Remote main |
| Praesentationen | 0 | 0 | 0 | 17 | 186 | Nicht auf Remote main |

Hinweis: Die hohen Ignoriert-Zahlen enthalten auch reproduzierbare Abhaengigkeiten, Build-Ausgaben, Browser-Binaries, Screenshots, Archive und mehrfach gesicherte Arbeitsstaende. Sie duerfen nicht pauschal in Git uebernommen werden.

## 4. Groessenordnung der lokalen Bereiche

| Bereich | Lokale Groesse |
|---|---:|
| Website | 1,7 GB |
| App | 1,8 GB |
| CRM | 7,4 GB |
| Arrival Control Center / Plattform | 1,5 GB |
| Businessplan | 180 MB |
| Finanztool | 28 MB |
| Foerderung/GmbH/Anlagen | 956 MB |
| Kundenunterlagen | 65 MB |
| Investorenunterlagen | 3,9 MB |
| Praesentationen | 115 MB |

Die Groessen bestaetigen, dass eine ungepruefte Massenuebernahme weder technisch noch organisatorisch angemessen ist.

## 5. Aktuelle Schutzregeln

Die Root-`.gitignore` beschreibt das bestehende Repository ausdruecklich als Website-/Source-/Workflow-Versionierung und schliesst private Identitaets-, Rechts-, Finanz-, Archiv- und Office-Dateien standardmaessig aus.

Zusaetzlich schuetzt `.git/info/exclude` neue Dateien aus Businessplan, Finanztool, Foerderung, CV, Kunden, Investoren, Vertraegen, Unternehmenssystem, QA und Archiv vor versehentlichem Staging.

Beispiele:

- `AMAVIO_AKTUELLSTER NEUdocx Kopie.docx` wird durch `*.docx` ignoriert.
- `AMAVIO_Investoren_Businessplan.docx` wird durch `*.docx` ignoriert.
- Das aktuelle S2-Finanzmodell wird durch den lokalen Ausschluss von `02_Finanztool/` ignoriert.
- `03_Anlagen_Foerderung_GmbH/` wird als kompletter Bereich ignoriert.
- `09_Unternehmenssystem/` und damit CRM-Code sowie CRM-Arbeitsdaten werden lokal komplett ausgeschlossen.

Vor jeder Aenderung dieser Konfiguration ist gemaess Projektregel eine Sicherung der bestehenden Konfigurationsdatei anzulegen.

## 6. Datenschutz- und Sicherheitsgrenze

Nicht jede lokal aktuelle Datei darf in ein GitHub-Repository uebernommen werden.

**Nicht pauschal uebernehmen:**

- Secrets, Tokens, API-Keys, Auth-Artefakte und private Schluessel
- reale CRM-Exporte, Kontaktlisten und lokale CRM-Datenbanken
- Ausweis-, Bank-, Steuer-, Gehalts- oder sonstige besonders sensible personenbezogene Unterlagen
- `node_modules`, `dist`, Build-Caches, lokale Browserpakete und Installationsdateien
- Archivkopien und mehrfach vorhandene Sicherungsstaende ohne Kanonisierung
- grosse Render-, Video- und QA-Zwischenstaende ohne bewusste Versionsentscheidung

Fuer die CRM-Altdaten gilt ein besonderes Stop-Gate: Die aktuelle Kontaktlistenpruefung bleibt ein getrenntes lokales Staging. Diese Daten sind weder CRM-importbereit noch kontaktfreigegeben und duerfen nicht als normale Code-/Dokumentdateien nach GitHub uebernommen werden.

## 7. Toolstatus

| Werkzeug | Status |
|---|---|
| Lokales Git | installiert und callable |
| `git fetch` | nach Freigabe erfolgreich; Remote-Referenzen am 13.10.2026 aktualisiert |
| GitHub-Connector | installiert/aktiviert, callable, authentifiziert, Read-only smoke-getestet |
| GitHub CLI `gh` | nicht installiert/callable |
| Git LFS | nicht installiert/callable |
| `.gitattributes` fuer LFS | nicht vorhanden |

## 8. Empfohlene kontrollierte Zielstruktur

Eine sichere GitHub-Aktualisierung sollte nicht alle 14+ GB und alle Datenklassen in ein einziges Repository pressen.

1. **Website:** bestehendes privates Repository `amavio-living-site`; Reconciliation-Branch pruefen, aktuelle Website-Leitfassung festlegen, 19 Aenderungen und relevante ungetrackte Quellen selektiv uebernehmen.
2. **Master-/Dokument-Governance:** bestehendes privates Repository `AMAVIO-Businessplan`; Draft-PR #17 reviewen und anschliessend nur freigegebene Text-/Governance-Quellen migrieren.
3. **App:** eigenes privates Code-Repository mit Quellcode, Tests und Dokumentation; ohne `node_modules`, Builds, lokale Browser und Archivkopien.
4. **Arrival Control Center:** eigenes privates Code-Repository mit kanonischer aktueller Release-Leitfassung; keine Serienmigration aller historischen Working Copies.
5. **CRM:** eigenes privates Code-Repository nur fuer synthetischen Quellcode, Tests und technische Dokumentation. Reale Kontakt-/Arbeitsdaten, lokale Datenbanken und Altdaten-Staging bleiben ausserhalb von GitHub.
6. **Office-/PDF-/PPTX-Bestaende:** pro Kategorie entscheiden, ob eine selektierte Leitfassung in Git LFS, in kontrollierten Dokumentenspeicher oder ausschliesslich in die lokale geschuetzte Ablage gehoert. Git LFS ist aktuell noch nicht eingerichtet.

## 9. Erforderliche Freigaben vor externer Aenderung

Vor Commit, Push, Merge, PR-Aenderung oder Repository-Neuanlage sind mindestens folgende Entscheidungen erforderlich:

1. Freigabe der oben beschriebenen getrennten Repository-Struktur.
2. Festlegung der kanonischen aktuellen App-, ACC-, CRM- und Website-Arbeitsverzeichnisse.
3. Entscheidung ueber Git LFS versus kontrollierten Dokumentenspeicher fuer ausgewaehlte DOCX/XLSX/PDF/PPTX-Leitfassungen.
4. Bestaetigung, dass reale CRM-/Kontaktdaten, Secrets und besonders sensible Unterlagen ausgeschlossen bleiben.
5. Separate Freigabe fuer die konkrete externe GitHub-Schreibaktion.

## 10. In diesem Audit nicht vorgenommen

- kein Commit
- kein Push
- kein Pull, Merge oder Rebase
- keine PR-Aenderung
- keine Repository-Neuanlage
- keine Aenderung an `.gitignore` oder `.git/info/exclude`
- keine Uebertragung von CRM-Daten
- keine Bereinigung oder Loeschung lokaler Dateien

## 11. Verwendete Quellen und Nachweise

- lokaler Git-Status und Git-Tree nach erfolgreichem `git fetch --prune origin`
- `git rev-list`, `git log`, `git ls-tree`, `git ls-files`, `git check-ignore`
- `.gitignore`
- `.git/info/exclude`
- `.amavio_sync/STATUS.md`
- `README_STRUKTUR.md`
- GitHub-Connector-Lesezugriffe auf `zakiamawi/amavio-living-site`, `zakiamawi/AMAVIO-Businessplan` und Draft-PR #17

## 12. Offene Punkte

- Die aktuellen Leitfassungen von App, ACC und mehreren Website-/Brandbook-Varianten muessen vor einer selektiven Migration explizit kanonisiert werden.
- Die vorhandenen historischen Working Copies und Archive duerfen nicht ungeprueft dupliziert werden.
- Der lokale Website-Branch `main` darf wegen der 11/9-Divergenz nicht direkt gepusht werden.
- Der vorbereitete Reconciliation-Branch benoetigt einen aktuellen Review gegen die 21 noch nicht committeden lokalen Aenderungen.
- Eine vollstaendige Backup-Strategie ist getrennt von einer GitHub-Code-/Dokumentstrategie festzulegen.
