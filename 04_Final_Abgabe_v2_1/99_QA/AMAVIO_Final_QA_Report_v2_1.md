# AMAVIO Final QA Report v2.1

Stand: 28. Juli 2026

## Ergebnis

Finaler Abgabeordner erstellt:

`C:\Users\zakia\OneDrive\Dokumente\Businessplan Amavio\04_Final_Abgabe_v2_1`

## Erledigte P1-Korrekturen

- Single Source of Truth v2.1 angelegt und angewendet.
- Finanzmodell als `AMAVIO_Finanzmodell_36_Monate_v1_8_FINAL.xlsx` erstellt.
- Finanzmodell um folgende Sheets erweitert:
  - `Source_of_Truth`
  - `Funding_Scenarios`
  - `Cash_Timing_Stress`
  - `P1_Gates`
- Anlage 3 korrigiert:
  - `Startkapitalbedarf | 25.000 EUR`
  - Launch-Preis getrennt als `29.500 EUR netto zzgl. Fremdkosten`
- Nachweispaket sichtbar korrigiert:
  - `92.000 / 269.000 / 442.000 EUR` wurde auf Seite 8 sichtbar zu `93.500 / 269.000 / 442.000 EUR` korrigiert.
- Anlage 1 sichtbar korrigiert:
  - `Launch-Budget` wurde auf `Launch-Preis` korrigiert.
- Decks textlich korrigiert:
  - `29.500 EUR/€` als `netto` formuliert, soweit in den Textobjekten vorhanden.
- Businessplan-DOCX v2.1 erstellt:
  - finaler Addendum-Vermerk mit kanonischen Zahlen, Förderstrategie und offenen P1-Gates.

## Finanzmodell-Audit

Rechnerische Kernchecks bestanden:

- Umsatz Jahr 1: 93.500 EUR
- Umsatz Jahr 2: 269.000 EUR
- Umsatz Jahr 3: 442.000 EUR
- EBITDA Jahr 1: 34.950 EUR
- EBITDA Jahr 2: 120.320 EUR
- EBITDA Jahr 3: 169.300 EUR
- Vertragszahlungsprofile summieren auf Vertragswerte.
- Keine Formel-Textfehler wie `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, `#N/A` gefunden.

Resthinweis:

- 2.062 Formelzellen haben weiterhin keine gespeicherten Excel-Cache-Werte. Die Datei ist auf automatische vollständige Neuberechnung beim Öffnen gesetzt. Für eine technisch perfekte Excel-Abgabe muss sie einmal in Microsoft Excel geöffnet, neu berechnet und gespeichert werden.

## PDF-QA

- Nachweispaket Seite 8 wurde gerendert und visuell geprüft.
- Die korrigierte Zeile zeigt sichtbar `93.500 / 269.000 / 442.000 EUR`.
- Hinweis: Der alte PDF-Textlayer enthält durch Overlay-Technik weiterhin den ursprünglichen extrahierbaren Text `92.000`. Visuell ist die Ausgabe korrigiert; für eine vollständig saubere PDF-Textschicht müsste das Nachweispaket aus einer bearbeitbaren Quelldatei neu exportiert werden.

## PPTX-QA

Textkorrekturen wurden eingebracht. Struktur-Audit bleibt als Warnhinweis bestehen:

- Viele Slides haben sehr viele Textobjekte.
- Minimale Schriftgrößen liegen weiter um 6,75 pt.
- Es gibt kleinere strukturelle Überlappungswarnungen aus der XML-Prüfung.

Das bedeutet: Die Decks sind zahlen- und begrifflich korrigiert, aber noch nicht als komplett neu gestaltete Präsentationen rebuilt. Für echte Design-Perfektion braucht es einen vollständigen PowerPoint-Redesign-Lauf mit Renderer/PowerPoint-Verfügbarkeit.

## RTK/ECC-Status

- ECC-Skills wurden lokal gelesen und angewendet:
  - `investor-materials`
  - `market-research`
  - `brand-voice`
  - `verification-loop`
- RTK-Anweisung wurde gelesen: Shell-Kommandos sollen mit `rtk` laufen.
- `rtk` ist in dieser Codex-App-PowerShell nicht im PATH verfügbar. Der Blocker wurde geprüft; die Finalisierung wurde deshalb ohne RTK-Proxy ausgeführt.

## Einschränkung

Diese Runde hat die abgabekritischen P1-Korrekturen und die Source-of-Truth-Konsistenz umgesetzt. Sie ersetzt keinen vollständigen Neusatz aller Word/PDF/PPTX-Dateien, weil in dieser Sitzung kein stabiler Office-/LibreOffice-Renderer für DOCX/PPTX verfügbar war.
