# AMAVIO One CRM – R3.4 Product Experience QA

**Prüfdatum:** 10.10.2026  
**Prüfobjekt:** `20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working`  
**Zulässiger Status:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben.

## Scope

Geprüft werden R3.4-Founder-Fokus, Decision Brief, erklärbare Entscheidungsreife, Pipeline Movement, Aging Strip, Relationship Field, Datenvertrauen, lokale Assistenzgrenze, Navigation, Migration und Regression der R3.2-/R3.3-Funktionen. Produktive Außenfähigkeiten sind nicht Teil der Prüfung und bleiben deaktiviert.

## Prüfweg

- Build und statisches QA-Gate;
- Unit-, Vertrags-, Komponenten-, Integrations- und Persistenztests;
- vollständiger synthetischer E2E-Kernpfad;
- Browser-QA bei 1600, 1280, 1024, 768, 430 und 390 px;
- echter 200-%-Chrome-Reflow;
- Tastaturkürzel, Escape, Focus-Trap und Focus-Rückgabe;
- Browserkonsole sowie Seitenüberlauf;
- visueller Vergleich mit Desktop- und Mobilkonzept.

## Festgestellte und behobene Abweichungen

An der 1024-px-Breite wurde eine zu frühe Kürzung der ersten Priorität gefunden und durch mehrzeiligen Titel behoben. Der Pipeline-Container erhielt keine Grafikrolle mehr, weil er interaktive Schaltflächen enthält. Ein Skip-Link zum Hauptinhalt wurde ergänzt. Veraltete E2E-Navigationsbezeichnungen wurden an `Research & Outreach`, `Daten & Sicherung` und `Auswertungen` angeglichen. Die mobile Seite blieb bei 430 und 390 px ohne horizontalen Seitenüberlauf.

## Abschlussergebnis

- Build: PASS, 1.596 Module; CSS 74,13 kB, JS 362,06 kB vor gzip.
- Statisches R3.4-QA-Gate: PASS.
- Unit: 16/16 PASS, darunter 6 neue Decision-Intelligence-Tests.
- Vertrag: 9/9 PASS.
- Komponente: 5/5 PASS, darunter vollständiges SSR der R3.4-Oberfläche.
- Integration: 3/3 PASS.
- Persistenz: 1/1 PASS.
- End-to-End: 19 zusammenhängende lokale Kernabläufe PASS; Browserkonsole ohne Fehler.
- Browsermatrix: 1600, 1280, 1024, 768, 430 und 390 px ohne horizontalen Seitenüberlauf, ohne namenlose Buttons und mit exakt drei Founder-Focus-Einträgen.
- Tastatur: Strg/⌘ K, Escape, Focus-Trap und Focus-Rückgabe PASS.
- 200-%-Zoom: 1280 px Außenbreite reflowt auf 640 CSS-Pixel; kein Seitenüberlauf.
- Visuelle Prüfung: Desktop- und Mobilkonzept sowie aktuelle 1600-/430-Screenshots mit `view_image` verglichen; materielle Abweichungen behoben oder im Fidelity Ledger begründet.

Maschinenlesbare Evidenz: `QA/CRM_R3_4_BROWSER_RESULT_20261010.json`. Screenshots: `QA/Screenshots/20261010-r3-4/`.

## Ergebnisgrenze

Das lokale R3.4-Paket ist innerhalb seines synthetischen Scopes fachlich, technisch und visuell geprüft. Dieses PASS erlaubt keine Aussage zu Produktionsreife, Datenschutzfreigabe, Sicherheitsprüfung, realen Daten, Versand, produktiver KI, Mehrbenutzerbetrieb, Cloud, App oder ACC.
