# AMAVIO Phase 5 – Deck Notes Source QA

Stand: 31. Juli 2026

## Ziel

Alte `v1.7`-Quellen in Sprecher-Notizen der coach-relevanten Decks korrigieren, ohne sichtbare Folien, Layouts oder finale Story zu verändern.

## Geänderte Dateien

- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_Employer_Decision_Deck_v5_2_FINAL.pptx`
- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_Investor_Readiness_Deck_v3_2_FINAL.pptx`
- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_One_Pager_v2_2_FINAL.pptx`

## Backup

Vor der Änderung wurden die PPTX-Dateien gesichert unter:

`04_Final_Abgabe_v2_1/_backups/deck_notes_sources_20260731/`

## Änderung

Nur XML-Einträge unter `ppt/notesSlides/` wurden bearbeitet.

- Employer Deck: 12 Notes-XML-Einträge geändert
- Investor Deck: 9 Notes-XML-Einträge geändert
- One-Pager: 1 Notes-XML-Eintrag geändert

Ersetzte Quellenlogik:

- `Businessplan v1.7` → `Businessplan v2.2`
- `Finanzmodell v1.7` → `Finanzmodell v1.8`
- technische Varianten mit `v1_7` → `v1_8`, sofern in Notes vorhanden

## QA-Ergebnis

Nach der Korrektur wurden die drei PPTX-Dateien erneut gescannt.

Ergebnis:

- Employer Deck: keine `v1.7`-/`v1_7`-Treffer im PPT-XML
- Investor Deck: keine `v1.7`-/`v1_7`-Treffer im PPT-XML
- One-Pager: keine `v1.7`-/`v1_7`-Treffer im PPT-XML

## Einschränkung

Es wurde keine visuelle Neugestaltung vorgenommen und noch kein neuer Kontaktbogen gerendert. Da ausschließlich Sprecher-Notizen geändert wurden, ist das sichtbare Foliendesign unverändert. Für die finale Abgabe sollte dennoch nach der letzten PPTX-Änderung ein vollständiger Render-/Kontaktbogenlauf erfolgen.
