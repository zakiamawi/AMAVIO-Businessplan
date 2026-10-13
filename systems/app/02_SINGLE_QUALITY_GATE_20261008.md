# Ein abschließendes Qualitätsgate

**Prüfdatum:** 8. Oktober 2026  
**Gegenstand:** AMAVIO One App – Contract & Brand Experience  
**Ergebnis:** **BESTANDEN / LOKAL UND SYNTHETISCH / NICHT PRODUKTIV**

## Gate-Entscheidung

Das App-Paket besteht das lokale Gesamtgate. Brandbook-Abgleich, Produktgrenze, Rollenverträge, Schnittstellenverträge, Statusmodell, synthetischer Arrival-Fall, DE/EN, Desktop/Mobile, Dialogfokus, Touchziele, Browserkonsolen, Build und visuelle Zielprojektion wurden gemeinsam geprüft.

## Konsolidierte Evidenz

| Prüfbereich | Ergebnis |
|---|---:|
| ESLint | PASS |
| Vertrags-, Struktur-, Rollen- und Accessibility-Tests | 36/36 PASS |
| Vite Single-Entry-Build | PASS |
| Aktive App-Rollen | 3/3 |
| Aktive App-Routen | 18/18 |
| Definierte DE/EN-Zustände | 20/20 |
| Arrival-Phasen im synthetischen Vertrag | 7/7 |
| Deterministische Golden-Case-Schritte | 44/44 |
| Störklassen | 4/4 |
| Browsermatrix | 24/24 PASS |
| Engines | Chromium + WebKit |
| Sprachen | DE + EN |
| Viewports | 1440×1024 + 390×844 |
| Rollen je Browser | Fachkraft + Wohnanbieter + lokaler Partner |
| Browserkonsolenfehler | 0 |
| Dialogfokus und Fokus-Rückgabe | PASS |
| Mobile Navigation und Touchziele | PASS |
| Horizontales Seiten-Overflow | 0 Befunde |
| Aktiver ACC-Entry-Point oder ACC-Rollen | 0 |

## Visuelle Abnahme

Die gerenderten Desktop- und Mobile-Screens wurden gegen die neuen Designreferenzen geprüft. Bestätigt wurden Original-Logo, Navy/Creme/Gold-Farbführung, editoriale Typografie, klare nächste Handlung, siebenphasige Journey und die rollenfeste Navigation. Ein im ersten Lauf sichtbarer deutscher Nichtwirkungs-Hinweis in der englischen Ansicht wurde systematisch für alle 18 Routen korrigiert und durch Vertrags- sowie Browserprüfung abgesichert.

## Evidenzdateien

- `QA/AMAVIO_ONE_APP_CONTRACT_BRAND_EXPERIENCE_QA_20261008.md`
- `QA/APP_CONTRACT_BRAND_BROWSER_RESULT_20261008.json`
- `QA/APP_CONTRACT_BRAND_ROLE_MATRIX_20261008.csv`
- `QA/Screenshots/Contract_Brand_Experience/Desktop_Professional_DE_Viewport.png`
- `QA/Screenshots/Contract_Brand_Experience/Desktop_Professional_DE_Full.png`
- `QA/Screenshots/Contract_Brand_Experience/Mobile_Housing_DE_Viewport.png`
- `QA/Screenshots/Contract_Brand_Experience/Mobile_Housing_DE_Full.png`
- `QA/Screenshots/Contract_Brand_Experience/Desktop_Partner_EN_Viewport.png`

## Bewusste Grenzen

- WebKit ist eine lokale Browserengine-Referenz und kein Beleg für einen physischen iOS-Gerätetest.
- Die Prüfung ist keine reale Rollenvalidierung und verwendet ausschließlich synthetische Inhalte.
- Die maschinenlesbaren Verträge sind keine produktive App-/ACC-Anbindung.
- Keine Produktivarchitektur, Veröffentlichung oder externe Wirkung wurde freigegeben oder ausgeführt.

## Abschlussurteil

**AMAVIO ONE APP CONTRACT & BRAND EXPERIENCE BESTANDEN / DREI ROLLEN / EIN APP-BUILD / ACC VOLLSTÄNDIG GETRENNT / GEMEINSAME VERSIONIERTE VERTRÄGE / BRANDBOOK-KONFORME ZIELPROJEKTION / NICHT PRODUKTIV**

