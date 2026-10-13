# AMAVIO Phase 2.2 – Businessplan Layout Pilot Log

Datum: 2026-07-30  
Arbeitsmodus: Pilotkopien, kein direkter Eingriff in finale Dateien

## Ziel

Nach dem erfolgreichen Design-Token-Rollout aus Phase 2.1 wurde geprüft, ob zusätzliche globale Layout-Eingriffe die Lesbarkeit des Businessplans weiter verbessern können, insbesondere bei Tabellen, Callouts und Kapitelmarkern.

## Quelle

Finaler Stand vor Phase 2.2:

- `04_Final_Abgabe_v2_1/01_Businessplan/AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.docx`
- `04_Final_Abgabe_v2_1/01_Businessplan/AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.pdf`

Kontrollwert:

- Word/PDF-Seitenzahl der finalen DOCX: 57 Seiten

## Pilot v0.2

Datei:

- `04_Final_Abgabe_v2_1/99_QA/businessplan_design_pilot_20260730/AMAVIO_Businessplan_DesignPilot_v0_2.docx`

Änderung:

- stärkere Tabellenatmung
- Tabellen-Font-/Spacing-Normalisierung
- Kapitelmarker- und Bullet-Feinschliff

Ergebnis:

- Word-Export: 48 Seiten
- Bewertung: verworfen, zu invasiv; Seitenfluss wurde zu stark verändert.

## Pilot v0.3

Datei:

- `04_Final_Abgabe_v2_1/99_QA/businessplan_design_pilot_20260730/AMAVIO_Businessplan_DesignPilot_v0_3.docx`

Änderung:

- konservativer als v0.2
- keine Fontgrößen-Kompression
- weiterhin Tabelleninnenabstände und Absatznormalisierung

Ergebnis:

- Word-Export: 50 Seiten
- Bewertung: verworfen, weiterhin zu starker Eingriff in den Seitenfluss.

## Pilot v0.4

Dateien:

- `04_Final_Abgabe_v2_1/99_QA/businessplan_design_pilot_20260730/AMAVIO_Businessplan_DesignPilot_v0_4.docx`
- `04_Final_Abgabe_v2_1/99_QA/businessplan_design_pilot_20260730/AMAVIO_Businessplan_DesignPilot_v0_4.pdf`
- Rendercheck: `04_Final_Abgabe_v2_1/99_QA/businessplan_render_checks/phase2_pilot_v0_4_20260730/`

Änderung:

- keine Schriftgrößenänderung
- keine Tabellen-Abstandsänderung
- nur dezente Farb-/Linienlogik, Callout-Farben und Kapitel-/Bullet-Farbfeinschliff

Ergebnis:

- Word-Export: 57 Seiten
- PDF-Render: 57 Seiten / 57 PNGs
- Bewertung: technisch stabil, aber nicht eindeutig besser.

Designbefund:

- v0.4 nimmt den Tabellenköpfen zu viel Navy-Kontrast.
- Das Dokument wird wärmer, aber weniger entschieden/premium.
- Der leichte Grün-/Teal-Eindruck bei Kapitelmarkern widerspricht der Vorgabe, Grün zu vermeiden.

## Entscheidung

Kein Rollout von Phase-2.2-Piloten auf die finalen Businessplan-Dateien.

Der finale Businessplan-Stand aus Phase 2.1 bleibt vorerst die bessere Version:

- 57 Seiten
- v1.8-Finanzmodell-Bezug korrekt
- warme Seitenfläche bereits umgesetzt
- Navy/Gold-Identität stärker und seriöser als v0.4

## Empfehlung

Für den Businessplan keine weiteren globalen Tabellen-Styles anwenden. Wenn später noch verfeinert wird, dann nur seitenweise bzw. abschnittsweise:

1. einzelne besonders schwache Tabellen in redaktionelle Blöcke umwandeln,
2. Callouts selektiv stärken,
3. keine globalen Tabellenkopf-Overrides mehr,
4. kein Teal/Grün verwenden.

