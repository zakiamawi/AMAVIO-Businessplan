# AMAVIO Phase 1 Consolidation Log

Stand: 30. Juli 2026, Europe/Berlin

## Ergebnis

Phase 1 wurde kontrolliert konsolidiert. Es wurden nur vier geprüfte Desktop-Dateien ins Repo übernommen:

1. Finanzmodell v1.8
2. Businessplan DOCX
3. Businessplan PDF
4. Investor Readiness Deck

Keine Website-Dateien, keine Agent-/ECC-Artefakte, keine Build-Ordner und keine sonstigen Desktop-Dateien wurden übernommen.

## Backup

Vor dem Ersetzen wurden die bisherigen Repo-Dateien gesichert unter:

`04_Final_Abgabe_v2_1/_backups/phase1_consolidation_20260730_201026/`

Das Hash-Protokoll vor der Ersetzung liegt dort als:

`hashes_before_replacement.csv`

## Übernommene Dateien

| Datei | Quelle | Ziel | Ergebnis |
|---|---|---|---|
| `AMAVIO_Finanzmodell_36_Monate_v1_8_FINAL.xlsx` | Desktop `02_Finanzmodell` | Repo `02_Finanzmodell` | Übernommen; Repo-Hash entspricht Desktop-Hash. |
| `AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.docx` | Desktop `01_Businessplan` | Repo `01_Businessplan` | Übernommen; Repo-Hash entspricht Desktop-Hash. |
| `AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.pdf` | Desktop `01_Businessplan` | Repo `01_Businessplan` | Übernommen; Repo-Hash entspricht Desktop-Hash. |
| `AMAVIO_Living_Investor_Readiness_Deck_v3_2_FINAL.pptx` | Desktop `04_Decks` | Repo `04_Decks` | Übernommen; Repo-Hash entspricht Desktop-Hash. |

## Nachprüfung

### Finanzmodell

- Sheets: 14
- Sheet-Liste: `Cover`, `Source_of_Truth`, `Funding_Scenarios`, `Cash_Timing_Stress`, `P1_Gates`, `Assumptions`, `Contract_Cash`, `Monthly_Cash`, `Annual_P&L`, `Scenarios`, `Checks`, `Schedule_Inputs`, `Sources`, `Dashboard`
- Cover `A1`: `AMAVIO | Finanzmodell 36 Monate v1.8 FINAL`
- Dashboard `A1`: `AMAVIO | Managementübersicht · Baseline v1.8`
- zentrale Umsatzwerte: `93.500`, `269.000`, `442.000`

### Businessplan

- PDF-Seitenzahl: 57
- DOCX sichtbare Absätze: 1.732
- DOCX enthält `Excel-Datei v1.8 FINAL`: ja
- DOCX enthält `Excel-Datei v1.7 FINAL`: nein
- DOCX enthält KI-/Mehrmodell-Absatz: nein

### Investor Deck

- Folie 4 enthält `Finanzmodell v1.8`: ja
- Folie 4 enthält `Finanzmodell v1.7`: nein
- geprüfte Quellenzeile: `Quelle: internes 36-Monats-Finanzmodell v1.8; alle Werte sind steuerbare Planannahmen.`

## Beraterentscheidung

Der öffentliche Businessplan bleibt ohne den KI-/Mehrmodell-Absatz. Diese Entscheidung reduziert Prüfer-Reibung und vermeidet Nebenfragen im Bank-/Fachstellenkontext. KI bleibt als Arbeitsweise für Design, Website und Präsentationen ausdrücklich vorgesehen, aber nicht als unnötiger Risikopunkt im konservativen Businessplan-Kern.

## Nächster empfohlener Schritt

1. Businessplan visuell/layoutseitig verbessern, ohne ihn neu zu schreiben.
2. Danach Businessplan DOCX/PDF erneut als zusammengehöriges Paar rendern und prüfen.
3. Decks/One-Pager gezielt veredeln, nicht komplett neu starten.
4. Website erst danach selektiv aus Desktop migrieren und dann Premium-Motion-/Video-Konzept aufsetzen.
