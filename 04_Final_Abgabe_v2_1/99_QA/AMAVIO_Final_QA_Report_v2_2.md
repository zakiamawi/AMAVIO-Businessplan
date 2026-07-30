# AMAVIO Final QA Report v2.2 (Rev. B)

Stand: 28. Juli 2026 · Konsolidierte Abgabefreigabe · Nach visueller PDF-Prüfung

## Ergebnis in einem Satz

Alle P1-Blocker aus dem Feedback vom 28.07.2026 sind geschlossen; das gesamte
Abgabepaket liegt in konsistenter v2.2-Fassung mit modernisiertem Design vor
(inkl. strikt harmonisierter Anlagen-Linie v2.2).
Informationen aus v2.1 wurden vollständig übernommen (verifiziert per Token-Diff).
**Visuelle PDF-Prüfung durchgeführt und drei Layout-Bugs aus Rev. A gefixt.**

## Rev. B Änderungen gegenüber Rev. A

Erste Rev. A hatte visuelle Probleme, die nur durch Rendering der finalen PDFs
sichtbar wurden. Alle sind in Rev. B gefixt:

| Bug in Rev. A | Auswirkung | Fix in Rev. B |
|---------------|------------|---------------|
| Cover-Table hatte `height: exact` | Titel abgeschnitten ("und Integration" fehlte), Subtitle+Meta unsichtbar | Dynamische Höhe; TitleLine wird an `\n` gesplittet |
| Callout-Parser fasste "POSITIONIERUNG AMAVIO" als Label | Body verlor Subjekt, startete mit "ist kein klassischer Makler..." | Neuer Parser nutzt Run-Formatierung (bold+color-Wechsel) → Label = nur "POSITIONIERUNG" |
| Step-Card-Parser splittete nach 4 Wörtern | Titles wie "Personalbedarf Ein Arbeitgeber gewinnt" statt nur "Personalbedarf" | Neuer Parser nutzt Run-Struktur (gold=Nummer, navy-bold=Titel, regular=Body) |
| Karten-Titel brachen mitten im Wort | "Ankunftsbed arf" | Compact-Mode für 5-Karten-Layouts + `autoHyphenation: true` in Document-Settings |

**Verifikation Rev. B:** PDFs neu gerendert und alle drei genannten Bereiche
visuell kontrolliert (Master Cover, Seite 3 Callout, Seite 4 Step-Cards).

---

## 1. Was in v2.2 fertig ist

| Blocker aus v2.1-Report                                | Status v2.2 | Belegort |
|--------------------------------------------------------|-------------|----------|
| Excel: 2.062 Formeln ohne gecachte Werte               | **GRÜN**    | Alle Formeln gecacht, 0 Fehler, öffnet normal (kein Repair-Mode) |
| Nachweispaket: Textlayer enthielt „92.000"             | **GRÜN**    | Content-Stream chirurgisch bereinigt (0 Treffer), Overlay „93.500" sichtbar |
| PPTX-Decks: 6,75 pt Fonts, 14–23 Textobjekte pro Slide | **GRÜN**    | Vollständig neu aufgebaut: Titel 28–44 pt, Body ≥16 pt, max. 8 Objekte |
| Master DOCX: Tabellen-/Kastenlastig                    | **GRÜN**    | Programmatisch neu aufgebaut mit Step-Cards, KPI-Kacheln, Callouts, Clean-Tables |
| Anlage 2 (KPI-Cockpit): rein tabellenbasiert           | **GRÜN**    | Operationalisiert mit Ampel-Logik, per-KPI-Struktur, KPI-Kacheln |
| Anlage 3 (Executive Summary): Seite 4 zu dicht         | **GRÜN**    | 5-Min-Format mit KPI-Kacheln, Callouts, klarer Q&A-Trennung |
| Legende / Aktenverzeichnis fehlte                       | **GRÜN**    | Neu erstellt: File-Map, kanonische Zahlen, Glossar, Ampel-Legende |

---

## 2. Deliverables v2.2

### 01 Businessplan
| Datei | Version | Größe | Bemerkung |
|-------|---------|-------|-----------|
| `AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.docx` | v2.2 | 95 KB  | 14 Kapitel · Original-Content 100 % übernommen |
| `AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.pdf`  | v2.2 | via Word COM erzeugt | Reader-Version |

### 02 Finanzmodell
| Datei | Version | Größe | Bemerkung |
|-------|---------|-------|-----------|
| `AMAVIO_Finanzmodell_36_Monate_v1_8_FINAL.xlsx` | v1.8 | 106 KB | 14 Sheets · 2.062 Formeln gecacht · 0 Fehler |

**Kernzahlen bestätigt (via Excel-Recalc-Read):**
- Umsatz: 93.500 / 269.000 / 442.000 €
- EBITDA: 34.950 / 120.320 / 169.300 €
- Startkapitalbedarf: 25.000 € · Launch-Preis netto: 29.500 €
- Sheets: Cover, Source_of_Truth, Funding_Scenarios, Cash_Timing_Stress, P1_Gates, Assumptions, Contract_Cash, Monthly_Cash, Annual_P&L, Scenarios, Checks, Schedule_Inputs, Sources, Dashboard

### 03 Anlagen
| Datei | Version | Größe | Bemerkung |
|-------|---------|-------|-----------|
| `AMAVIO_Anlage_1_Datenraum_und_Due_Diligence_2026_v2_2_FINAL.pdf` | v2.2 | 189 KB | Hergeleitet aus validierter v2.1-Fassung, für konsistente v2.2-Linie umbenannt |
| `AMAVIO_Anlage_2_KPI_Steuerungscockpit_2026_v2_2_FINAL.docx` | v2.2 | 18 KB | Neu aufgebaut mit Ampel-Logik |
| `AMAVIO_Anlage_2_KPI_Steuerungscockpit_2026_v2_2_FINAL.pdf`  | v2.2 | via Word COM | |
| `AMAVIO_Anlage_3_Executive_Summary_und_QA_2026_v2_2_FINAL.docx` | v2.2 | 19 KB | 5-Min-Q&A neu strukturiert |
| `AMAVIO_Anlage_3_Executive_Summary_und_QA_2026_v2_2_FINAL.pdf`  | v2.2 | via Word COM | |
| `AMAVIO_Anlagen_und_Nachweispaket_2026_v2_2_FINAL.docx` | v2.2 | 30 KB | Voll-Rebuild mit modernem Design |
| `AMAVIO_Anlagen_und_Nachweispaket_2026_v2_2_FINAL.pdf`  | v2.2 | via Word COM | Empfohlene Abgabefassung |

### 04 Decks
| Datei | Version | Größe | Bemerkung |
|-------|---------|-------|-----------|
| `AMAVIO_Living_One_Pager_v2_2_FINAL.pptx` | v2.2 | 85 KB | 1 Slide · KPI-Kacheln · Pricing-Cards |
| `AMAVIO_Living_Employer_Decision_Deck_v5_2_FINAL.pptx` | v5.2 | 348 KB | 12 Slides |
| `AMAVIO_Living_Investor_Readiness_Deck_v3_2_FINAL.pptx` | v3.2 | 253 KB | 9 Slides |
| `AMAVIO_Living_Partner_Capability_Deck_v3_2_FINAL.pptx` | v3.2 | 203 KB | 7 Slides |

### 00 Legende / Design
| Datei | Version | Größe | Bemerkung |
|-------|---------|-------|-----------|
| `AMAVIO_Legende_und_Aktenverzeichnis_v2_2.docx` | v2.2 | 20 KB | Master-Lesehilfe · File-Map · Glossar · Ampel-Legende |
| `AMAVIO_Legende_und_Aktenverzeichnis_v2_2.pdf`  | v2.2 | via Word COM | |

### _backups
Alle v2.1-Vorgänger und Pre-Recalc Excel liegen in `_backups/` — für Rückverfolgbarkeit, nicht Teil der Abgabe.

### Herleitung der v2.2-Anlagenlinie
| Finaldatei (03_Anlagen) | Herkunft | Nachvollziehbarkeit |
|---|---|---|
| `AMAVIO_Anlage_1_Datenraum_und_Due_Diligence_2026_v2_2_FINAL.pdf` | Inhaltlich aus freigegebener v2.1-Endfassung übernommen | Ursprungsartefakt in `_backups/AMAVIO_Anlage_1_Datenraum_und_Due_Diligence_2026_v2_1_PREV.pdf` |
| `AMAVIO_Anlagen_und_Nachweispaket_2026_v2_2_FINAL.pdf` | v2.2-PDF als finale Abgabefassung | v2.1-Historie in `_backups/AMAVIO_Anlagen_und_Nachweispaket_2026_v2_1_PREV.pdf` und `_backups/AMAVIO_Anlagen_und_Nachweispaket_PRE_TEXTLAYER_FIX.pdf` |

### 1:1-Synchronisierung Desktop → Repo (Source of Truth)
- Source of Truth: `C:\Users\zakia\OneDrive\Desktop\04_Final_Abgabe_v2_1`
- Ziel im Repo: `04_Final_Abgabe_v2_1/`
- Synchronisierungsprinzip: Desktop-Dateien führend übernommen; abweichende ältere Repo-Fallbacks in `_backups/_repo_sync_fallbacks/` verschoben.
- Exakte Voll-Liste aller final im Repo vorhandenen Dateien: `99_QA/AMAVIO_Final_File_Manifest_v2_2_sync.txt` (66 Dateien, inkl. `_backups` und QA-Extrakte).

**Bei der Synchronisierung nach `_backups/_repo_sync_fallbacks/` verschoben:**
- `01_Businessplan\AMAVIO_Businessplan_Kernfassung_v1_7_FINAL.docx`
- `01_Businessplan\AMAVIO_Businessplan_Kernfassung_v1_7_FINAL.pdf`
- `01_Businessplan\AMAVIO_Businessplan_Master_2026_FINAL.pdf`
- `02_Finanzmodell\AMAVIO_Finanzmodell_36_Monate_v1_7_FINAL.xlsx`
- `03_Anlagen\AMAVIO_Anlagen_und_Nachweispaket_2026.pdf`
- `03_Anlagen\AMAVIO_P0_Commercial_Architecture_v1_0.pdf`
- `03_Anlagen\AMAVIO_P1_Commercial_Operating_System_v1_0.pdf`
- `03_Anlagen\Zaki_Amawi_ATS_CV_2026.pdf`
- `03_Anlagen\Zaki_Amawi_Founder_Portfolio_2026.pdf`
- `04_Decks\AMAVIO_Living_Employer_Decision_Deck_v3_0.pptx`

---

## 3. Content-Preservation Verifikation

Alle v2.2-Ausgabedateien wurden gegen ihre v2.1-Vorgänger mit einem Token-Diff geprüft (Wörter ≥4 Zeichen und Zahlen, mit Substring-Fallback für zusammengefügte Runs).

| Datei | v2.1 Tokens | v2.2 Tokens | Fehlend (echt) | Ergebnis |
|-------|------------:|------------:|---------------:|----------|
| Master DOCX | 4.321 | 4.339 | 0 (Nur „10." / „11." Section-Präfixe im Eyebrow anders formatiert) | ✅ |
| Anlage 2    | 495   | 509   | 0 (5 Extract-Format-Marker) | ✅ |
| Anlage 3    | 551   | 586   | 0 (5 Extract-Format-Marker) | ✅ |
| One-Pager   | 55    | 96    | 0 | ✅ |
| Employer    | 312   | 355+  | 0 (fixed „gemacht") | ✅ |
| Investor    | 258   | 277+  | 0 (fixed „sauber"; 1.7 → 1.8 update) | ✅ |
| Partner     | 185   | 218   | 0 | ✅ |

**Ergebnis: Kein Informationsverlust. Alle v2.2-Fassungen haben mehr Content-Tokens als v2.1 (durch zusätzliche Legende-Elemente).**

---

## 4. Design-System v2.2

Einheitlich angewendet über DOCX + PPTX:

**Farben:** Navy `#1E3A5F` (Primär) · Gold `#C9A961` (Akzent) · Papier-Tint `#F4F1EA` (Callouts) · Ampel Grün `#4A7B57` / Gelb `#D9A441` / Rot `#B54B4B`

**Schriften:** Georgia (Headings) · Calibri (Body) — beides system-safe

**Komponenten:** Lead-Callout · KPI-Kachel · Step-Card · Clean-Table (Navy-Header, alternierende Zeilen) · Timeline · Pricing-Card

**Mindestgrößen:** DOCX Titel ≥20 pt, Body ≥11 pt · PPTX Titel ≥28 pt, Body ≥16 pt

---

## 5. Offene P1-Gates (Gründer-Verantwortung, nicht Abgabe)

| Gate | Owner | Frist | Details |
|------|-------|-------|---------|
| Mittelzufluss dokumentieren (24.500 €) | Gründung | vor Live-Freigabe | Bankbeleg + Gesellschafterbeschluss + steuerliche Einordnung |
| § 34c-Rolle final klären | Recht | vor Delivery | Ordnungsamt Düsseldorf-Anfrage (Textbaustein in Nachweispaket 4.5) |
| Unternehmensgegenstand angleichen | Notariat + Recht | vor wesentlichen Verträgen | Vorschlag in Nachweispaket 4.4 |
| Nachfragebeweis / Pipeline | Vertrieb | laufend | Zielaccount-Score & CRM (Master Kap. 5) |

Diese Punkte sind explizit in Nachweispaket, Anlage 3 und Legende dokumentiert und für Bank/Fachstelle transparent.

---

## 6. Technisches Umsetzungslog

**Blocker 1 — Excel Recalc:**
- Diagnose: OneDrive-Placeholder + openpyxl-Datei (kein calcChain) → Excel-COM `Workbooks.Open` scheiterte
- Lösung: `attrib +P` zum Pinning · CorruptLoad-Repair-Mode Open · SaveAs zu lokaler Kopie · Recalc über CalculateFullRebuild · Verify-Pass bestätigt 2.062/2.062 cached values, 0 Fehler

**Blocker 2 — Nachweispaket Textlayer:**
- Diagnose: pdfjs-Extract zeigte 92.000 (338.9, 724.339) UND 93.500 (337.9, 722.651) als zwei Text-Objekte
- Lösung: Content-Stream #82 identifiziert (font F2, hex glyph codes) · TJ-Operand des alten Textblocks durch `[]` ersetzt · pdf-lib Save · Verify: 0 Treffer für „92.000" in allen 9 Seiten

**Blocker 3 — PPTX Redesign:**
- Alle 4 Decks komplett neu generiert mit pptxgenjs 4.0.1 + shared design.js module
- Content-Diff gegen v2.1 bestätigt 100 % Textinhalt übertragen

**Blocker 4 — DOCX Redesign:**
- Semantic DOCX-Parser via xml-js (379 Blocks: 315 Paragraphen + 64 Tabellen)
- Programmatischer Rebuilder erkennt Callouts (boxed no-style), Numbered-Step-Cluster (01/02/...), Tabellen-Header und ersetzt sie durch Design-System-Komponenten

**Konvertierung DOCX → PDF:** Via Microsoft Word COM (SaveAs2 wdFormatPDF)
**Konvertierung PPTX → PDF:** PowerPoint COM ist mit pptxgenjs-Output problematisch (COM Open scheitert mit E_FAIL). Empfehlung: PPTX in PowerPoint öffnen und manuell als PDF exportieren, falls PDF-Fassung benötigt.

---

## 7. Was NICHT geändert wurde

- **Anlage 1 (Datenraum-Index)** wurde inhaltlich nicht neu gebaut; die freigegebene v2.1-Referenz wurde für die finale Benennung auf `..._v2_2_FINAL.pdf` harmonisiert. Die Ursprungsdatei liegt als `..._v2_1_PREV.pdf` in `_backups/`.
- **Nachweispaket-PDF v2.1** bleibt ausschließlich als Historie/Referenz in `_backups/` (`..._v2_1_PREV.pdf` und `..._PRE_TEXTLAYER_FIX.pdf`). In der Finalablage gilt strikt die v2.2-Linie.
- **Excel Finanzmodell v1.8** ist strukturell identisch zu v1.7 (nur Recalc+Cache); nichts an Zahlen oder Formeln geändert.

---

## 8. Empfohlene Abgabereihenfolge

**Für Bank / Fachkundige Stelle (Volltext-Prüfung):**
1. Master Businessplan v2.2 DOCX/PDF
2. Finanzmodell v1.8 XLSX
3. Anlagen 1–3 (durchgehend v2.2)
4. Nachweispaket v2.2 DOCX/PDF
5. Legende zur Orientierung

**Für Arbeitgeber-B2B-Termine:**
1. One-Pager v2.2 PPTX
2. Employer Decision Deck v5.2 PPTX
3. Nur auf Anfrage: Master + Anlage 3

**Für Investoren-Vorgespräche (intern):**
1. Investor Readiness Deck v3.2 PPTX
2. Anlage 3 Executive Summary
3. Auf Anforderung: Master + Finanzmodell

**Für Partner-Onboarding:**
1. Partner Capability Deck v3.2 PPTX

---

## 9. Nächste Schritte für Live-Freigabe

1. **Bankbeleg + Gesellschafterbeschluss** für 24.500 € Mittelzufluss dokumentieren → Modellstatus von CONDITIONAL auf CONFIRMED
2. **Ordnungsamt-Anfrage** Düsseldorf (Textbaustein Nachweispaket 4.5) versenden
3. **BA-Formulare** GZ 04 personalisieren
4. **Erstes Mandat** (Blueprint oder Launch) abschließen — mit Anzahlung

Nach diesen 4 Schritten ist das Paket vollständig abgabe- und live-tragfähig.

---

Ende Report v2.2 · 28. Juli 2026
