# AMAVIO Phase 7 – Deck Text Extract QA

Stand: 31. Juli 2026

## Ziel

Nach der Korrektur der Sprecher-Notizen wurden neue PPTX-Text-Extrakte erzeugt und gegen typische Coach-/Abgaberisiken geprüft.

## Geprüfte Dateien

- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_Employer_Decision_Deck_v5_2_FINAL.pptx`
- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_Investor_Readiness_Deck_v3_2_FINAL.pptx`
- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_One_Pager_v2_2_FINAL.pptx`
- `04_Final_Abgabe_v2_1/04_Decks/AMAVIO_Living_Partner_Capability_Deck_v3_2_FINAL.pptx`

## Neue Extrakte

Ordner:

`04_Final_Abgabe_v2_1/99_QA/deck_text_extracts_20260731/`

Erzeugt wurden jeweils `.json`- und `.md`-Extrakte für sichtbaren Folientext und Sprecher-Notizen.

## Ergebnis

- Employer Deck: 12 Slides, 12 Notes
- Investor Deck: 9 Slides, 9 Notes
- One-Pager: 1 Slide, 1 Note
- Partner Capability Deck: 7 Slides, 7 Notes

Keine Treffer in den Extrakten für:

- `v1.7`
- `v1_7`
- `92.000`

Employer Deck enthält zwei bewusst negative Risikoformulierungen:

- `Garantie`
- `verfügbar`

Kontext:

`Keine Garantie für Mietvertrag, Visa, Anerkennung, Lieferverfügbarkeit oder Arbeitsbeginn.`

Bewertung: Harmlos und sinnvoll, weil es keine Zusage macht, sondern eine klare Einschränkung.

## Backup-Vergleich

Für Employer Deck, Investor Deck und One-Pager wurde die aktuelle PPTX gegen das Backup aus

`04_Final_Abgabe_v2_1/_backups/deck_notes_sources_20260731/`

verglichen.

Ergebnis:

- `notes_only: true`
- keine hinzugefügten oder entfernten ZIP-Einträge
- keine Änderungen an `ppt/slides/`, `ppt/slideLayouts/`, `ppt/slideMasters/`, `ppt/media/` oder `ppt/theme/`
- verändert wurden ausschließlich `ppt/notesSlides/...`

Belegdatei:

`04_Final_Abgabe_v2_1/99_QA/deck_text_extracts_20260731/deck_backup_compare_20260731.json`

## Render-Hinweis

Der gebündelte Präsentations-Renderhelfer konnte in diesem Lauf wegen eines lokalen Runtime-Pfadproblems nicht verwendet werden. Da der Backup-Vergleich beweist, dass ausschließlich Sprecher-Notizen geändert wurden, bleiben sichtbare Folien und bestehende Kontaktbögen inhaltlich valide. Vor finalem Versand sollte nach der letzten sichtbaren PPTX-Änderung dennoch ein vollständiger Render-/Kontaktbogenlauf erfolgen.
