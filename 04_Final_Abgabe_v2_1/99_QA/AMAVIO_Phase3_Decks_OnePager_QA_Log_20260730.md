# AMAVIO Phase 3 – Decks und One-Pager QA Log

Datum: 2026-07-30

## Ziel

Die vorhandenen Präsentationen und One-Pager aus Desktop und Repo wurden abgeglichen, in den finalen Repo-Ordnern konsolidiert und als PDF exportiert.

## Finaler Ordner

`04_Final_Abgabe_v2_1/04_Decks/`

## Quellenabgleich Desktop ↔ Repo

Alle vier PPTX-Dateien im Repo sind byte-identisch mit den Desktop-Quellen:

| Datei | Folien | Ergebnis |
|---|---:|---|
| `AMAVIO_Living_Employer_Decision_Deck_v5_2_FINAL.pptx` | 12 | Desktop und Repo identisch |
| `AMAVIO_Living_Investor_Readiness_Deck_v3_2_FINAL.pptx` | 9 | Desktop und Repo identisch |
| `AMAVIO_Living_One_Pager_v2_2_FINAL.pptx` | 1 | Desktop und Repo identisch |
| `AMAVIO_Living_Partner_Capability_Deck_v3_2_FINAL.pptx` | 7 | Desktop und Repo identisch |

## PDF-Exporte

Aus den finalen PPTX-Dateien wurden PDF-Versionen im selben Ordner erstellt:

| PDF | Seiten | Prüfung |
|---|---:|---|
| `AMAVIO_Living_Employer_Decision_Deck_v5_2_FINAL.pdf` | 12 | Seitenzahl entspricht PPTX-Folienzahl |
| `AMAVIO_Living_Investor_Readiness_Deck_v3_2_FINAL.pdf` | 9 | Seitenzahl entspricht PPTX-Folienzahl |
| `AMAVIO_Living_One_Pager_v2_2_FINAL.pdf` | 1 | Seitenzahl entspricht PPTX-Folienzahl |
| `AMAVIO_Living_Partner_Capability_Deck_v3_2_FINAL.pdf` | 7 | Seitenzahl entspricht PPTX-Folienzahl |

## Renderchecks

Die vorhandenen Desktop-Renderchecks wurden in den Repo-QA-Bereich übernommen:

`04_Final_Abgabe_v2_1/99_QA/deck_render_checks/`

Enthalten:

- Kontaktbogen Investor Readiness Deck
- Kontaktbogen Employer Decision Deck
- Kontaktbogen Partner Capability Deck
- Kontaktbogen One-Pager
- Einzel-Folien-PNGs für die gerenderten Decks

## Designbefund

Die Decks sind konsistent mit dem aktuellen AMAVIO-System:

- Navy/Gold/Creme-Farbwelt
- klare B2B-/Investorensprache
- wenig UI-Kitsch
- gute Deck-Rhythmik durch Wechsel aus Bildstart, hellen Arbeitsfolien und dunklen Abschluss-/Schwerpunktfolien

Für spätere Innovation/Website-Phase:

- Decks nicht blind neu bauen.
- Eher selektiv mit Motion-/Video-/Website-Ästhetik ergänzen.
- Bei Präsentationen erst nach Website-Visualsystem entscheiden, ob zusätzlich animierte oder stärker visuelle Versionen gebraucht werden.

## Entscheidung

Die bestehenden PPTX-Dateien bleiben als führende Quellen erhalten. Ergänzt wurden nur die PDF-Exporte und die Repo-QA-Renderchecks.

