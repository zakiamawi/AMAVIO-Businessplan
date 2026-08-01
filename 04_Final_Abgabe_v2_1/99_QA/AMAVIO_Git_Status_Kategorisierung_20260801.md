# AMAVIO Git-Status-Kategorisierung

Datum: 2026-08-01

Ziel: Den grossen Dirty Tree beherrschbar machen, ohne Skills, Agents, MCPs, Plugins oder zukuenftig nuetzliche Tooling-Dateien zu loeschen.

## Grundsatz

Nichts wird geloescht, nur weil es aktuell nicht fuer AMAVIO gebraucht wird.

Stattdessen:

- commitfaehige AMAVIO-Artefakte gruppieren
- lokale Logs/Caches ignorieren oder ungestaged behalten
- Tooling/Skills/Agents dokumentieren und erhalten
- Secrets niemals committen
- finale Office-Dateien nur mit Backup-/QA-Nachweis anfassen

## Aktueller Gesamtbefund

Der Git-Status enthaelt mehrere Arten von Aenderungen:

1. geaenderte finale Office-Artefakte
2. neue Businessplan-/Coach-/QA-Artefakte
3. umfangreiche Website-Code- und Website-Dokumentationsaenderungen
4. Tooling-/MCP-/Agent-Konfiguration
5. lokale Preview-/Playwright-Logs
6. Backups und Render-/Extraktordner

Das ist nicht automatisch schlecht. Es muss nur vor Staging/Commit getrennt werden.

## Kategorie A - AMAVIO QA- und Strategieartefakte

Status: wahrscheinlich commitfaehig, nach kurzem Review.

Beispiele:

- `04_Final_Abgabe_v2_1/99_QA/AMAVIO_Agenten_Skills_MCP_CI_Strategie_20260801.md`
- `04_Final_Abgabe_v2_1/99_QA/AMAVIO_Tooling_Freigabe_Status_20260801.md`
- `04_Final_Abgabe_v2_1/99_QA/AMAVIO_Working_System_v1_20260730.md`
- `04_Final_Abgabe_v2_1/99_QA/AMAVIO_Skills_Agents_Roadmap_v1_20260730.md`
- `04_Final_Abgabe_v2_1/99_QA/AMAVIO_Skill_Register_20260730.md`
- `04_Final_Abgabe_v2_1/99_QA/AMAVIO_*_Log_*.md`
- `04_Final_Abgabe_v2_1/99_QA/AMAVIO_*_QA_*.md`

Empfehlung:

- in einem separaten Commit `docs/qa: add AMAVIO planning and tooling logs`
- vorher nur kurz pruefen, ob keine Secrets oder privaten Tokens enthalten sind

## Kategorie B - Finale Office-Artefakte

Status: nicht blind committen; vorher Backup-/QA-Kette pruefen.

Geaendert:

- `04_Final_Abgabe_v2_1/01_Businessplan/AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.docx`
- `04_Final_Abgabe_v2_1/01_Businessplan/AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.pdf`
- `04_Final_Abgabe_v2_1/02_Finanzmodell/AMAVIO_Finanzmodell_36_Monate_v1_8_FINAL.xlsx`
- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_Employer_Decision_Deck_v5_2_FINAL.pptx`
- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_Investor_Readiness_Deck_v3_2_FINAL.pptx`
- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_One_Pager_v2_2_FINAL.pptx`

Neu:

- `04_Final_Abgabe_v2_1/01_Businessplan/AMAVIO_Living_Businessplan_Master_2026_v2_3_AUSFUEHRLICH_ARBEITSSTAND.docx`
- `04_Final_Abgabe_v2_1/01_Businessplan/AMAVIO_Living_Businessplan_Master_2026_v2_3_AUSFUEHRLICH_ARBEITSSTAND.pdf`
- Deck-PDF-Exports in `04_Final_Abgabe_v2_1/04_Decks/`
- `04_Final_Abgabe_v2_1/05_Coach_Paket/`

Empfehlung:

- erst Datei-fuer-Datei mit QA-Log abgleichen
- nicht im selben Commit wie Website-Code
- Commit erst nach finalem Export-/Textlayer-/Rendercheck

## Kategorie C - Website-Code und Website-Dokumentation

Status: wahrscheinlich AMAVIO-relevant, aber als eigener Block behandeln.

Geaendert:

- `amavio-living-web/src/app/**`
- `amavio-living-web/src/components/**`
- `amavio-living-web/src/lib/**`
- `amavio-living-web/public/images/**`
- `amavio-living-web/package.json`
- `amavio-living-web/package-lock.json`
- `amavio-living-web/next.config.ts`
- `amavio-living-web/eslint.config.mjs`
- `amavio-living-web/postcss.config.mjs`
- `amavio-living-web/tsconfig.json`
- `amavio-living-web/docs/**`

Neu:

- `amavio-living-web/scripts/`
- `amavio-living-web/src/components/animation/`
- `amavio-living-web/src/lib/site-url.ts`

Empfehlung:

- separater Commit `website: sync AMAVIO living implementation and docs`
- vorher `rtk npm run lint` und `rtk npm run build`
- Website-Design separat neu bewerten, da sie nicht einfach Businessplan-Stil kopieren soll

## Kategorie D - Tooling, Skills, MCPs, Agents

Status: behalten; nicht loeschen.

Betroffen:

- `.codex/`
- `.mcp.json`
- Skill-/Agent-/Tooling-Dokumentation in QA

Empfehlung:

- `.codex/` nicht loeschen
- erst pruefen, ob darin projektbezogene Skills liegen, die bewusst versioniert werden sollen
- `.mcp.json` nur committen, wenn keine Secrets/credential URLs enthalten sind
- Tooling-Aenderungen als separaten Commit behandeln: `tooling: document AMAVIO agent and MCP setup`

## Kategorie E - Lokale Logs, Caches, Preview-Artefakte

Status: behalten lokal, aber normalerweise nicht committen.

Untracked:

- `.playwright-mcp/`
- `amavio-living-web/.codex-next-preview.log`
- `amavio-living-web/.codex-next-preview.out.log`
- `amavio-living-web/.codex-next-preview.err.log`

Ignoriert:

- `amavio-living-web/.env.local`

Empfehlung:

- nicht loeschen
- in `.gitignore` aufnehmen oder dort belassen
- nicht committen
- falls als QA-Beleg wichtig: kurze Zusammenfassung in Markdown statt Rohlog committen

## Kategorie F - Backups und Render-/Extraktordner

Status: behalten; Commit nur selektiv.

Beispiele:

- `04_Final_Abgabe_v2_1/_backups/**`
- `04_Final_Abgabe_v2_1/99_QA/businessplan_render_checks/`
- `04_Final_Abgabe_v2_1/99_QA/deck_render_checks/`
- `04_Final_Abgabe_v2_1/99_QA/deck_text_extracts_20260731/`
- `04_Final_Abgabe_v2_1/99_QA/website_preview_checks_20260731/`
- `04_Final_Abgabe_v2_1/99_QA/scripts/`

Empfehlung:

- QA-Skripte eher committen
- kleine JSON-/Markdown-Audits eher committen
- grosse Renderbilder nur committen, wenn sie als pruefbarer Nachweis wirklich gebraucht werden
- Backups behalten, aber Commit-Entscheidung bewusst treffen

## Empfohlene Commit-Reihenfolge

1. `docs/qa: add AMAVIO tooling and agent strategy`
   - neue Strategie-/Tooling-/Working-System-Dateien
   - keine Office-Binaries
   - keine Logs

2. `website: sync AMAVIO living implementation`
   - Website-Code und Website-Dokumentation
   - nach `rtk npm run lint` und `rtk npm run build`

3. `docs: add coach and readiness package`
   - Coach-Paket, Manifest, P1-Gates, 14-Tage-Plan
   - nach kurzer Inhaltspruefung

4. `office: update AMAVIO final artifacts with QA evidence`
   - DOCX/PDF/PPTX/XLSX nur nach finaler QA
   - Backups und QA-Logs verlinken

5. `tooling: update AMAVIO MCP and local agent guidance`
   - `.mcp.json` nur wenn secret-clean
   - keine lokalen Secrets

## Sofortige Nicht-Aktionen

- Keine Skills loeschen.
- Keine Agents loeschen.
- Keine Plugins loeschen.
- Keine `.codex`- oder `.agents`-Ordner bereinigen, bevor klar ist, was darin projektbezogen ist.
- Keine Logs loeschen; hoechstens ignorieren oder ungestaged lassen.
- Kein `git reset`, kein Checkout, kein Force-Cleanup.

## Naechster sicherer Schritt

Vor dem ersten Commit:

1. `.gitignore` pruefen und ggf. nur um lokale Logs/Caches erweitern.
2. `.mcp.json` auf Secret-Freiheit pruefen, ohne credential URLs auszugeben.
3. QA-Strategie- und Statusdateien als erste saubere Dokumentationsgruppe stagebar machen.
4. Danach Website-Build pruefen und Website-Block separat behandeln.

## Nachtrag 2026-08-01 - Ignore- und Secret-Vorpruefung

Durchgefuehrt:

- Root-`.gitignore` angelegt fuer lokale Browser-QA-Artefakte:
  - `.playwright-mcp/`
  - lokale OS-/Editor-Dateien
- `amavio-living-web/.gitignore` erweitert fuer lokale Codex-/Next-Preview-Logs:
  - `.codex-next-preview*.log`
- `amavio-living-web/.env.local` bleibt ignoriert.
- `.mcp.json` wurde nur mit Secret-Suchmustern geprueft; keine Treffer fuer typische Token/API-Key/Secret-Muster.

Ergebnis:

- lokale Playwright- und Preview-Logs bleiben erhalten, erscheinen aber nicht mehr als untracked Commit-Kandidaten.
- nichts wurde geloescht.
- `.mcp.json` bleibt als geaenderte Datei sichtbar und sollte vor einem Tooling-Commit noch inhaltlich auf gewuenschte Serveraenderungen geprueft werden.
