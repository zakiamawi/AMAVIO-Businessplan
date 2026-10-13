# Source-of-Truth- und Handoff-Entscheidung

**Datum:** 30.09.2026  
**Geltungsbereich:** AMAVIO Arrival Control Center, Arbeitgeber-/AMAVIO-Steuerungsdemo  
**Status:** lokale interne Arbeitsentscheidung; keine Veröffentlichung oder Produktivfreigabe

## Verbindliche Entscheidung

### Fachliche Autorität

Der `AMAVIO_One_Product_Truth_V1_Arbeitsmaster_20260930.md` ist für Produktstatus, Rollen, Systemgrenzen, Reifegrad und Claims führend. Er definiert das ACC als Arbeitgeber- und AMAVIO-Steuerung und trennt es von der separaten AMAVIO One App.

### Technische Ausgangsbasis

Die Datei

`08_Website/amavio-living-site/20260930_V17_Product_Truth_A11y_Working/control-center.html`

ist die technische Ausgangsbasis dieser eigenständigen Arbeitskopie. Begründung:

- sie ist gegenüber der älteren Deploy-Demo die neuere, Product-Truth-nahe Arbeitsfassung;
- sie kennzeichnet synthetische Daten, Konzeptdemo und fehlenden Produktivbetrieb sichtbar;
- sie bezeichnet die frühere Arbeitnehmeransicht bereits als ältere Demo und verweist auf die separate App;
- sie ergänzt lokale Fonts, Noindex-Schutz, Tastaturbedienung, Fokusführung, ARIA-Zustände, reduzierte Bewegung und mobile Rollennavigation;
- sie enthält die fachlich breiteste vorhandene ACC-Interaktionsbasis.

Die Datei

`08_Website/amavio-control-center-demo-deploy/index.html`

bleibt unveränderte Referenz für den älteren demonstrierbaren Funktionsstand. Sie ist weder fachlich noch technisch die aktive Entwicklungsquelle.

### Aktive Entwicklungsfläche

Ab diesem Handoff erfolgen Änderungen ausschließlich unter:

`10_Control_Center/20260930_AMAVIO_Arrival_Control_Center_Demo_Working/`

Die Website-, App- und Brandbook-Arbeitsstände werden nicht verändert.

### Markenbasis

Der gezielt geprüfte Brandbook-Master unter `08_Website/brand/AMAVIO_One_Brandbook_Master_20260930/` ist als **intern verbindliche Arbeitsgrundlage** gekennzeichnet. Deshalb wurden ausschließlich die belastbaren Navy-/Cream-/Gold-, Funktionsfarben- und Typografieanker in dieser lokalen ACC-Arbeitskopie übernommen. Logoassets, Brandbook-Dateien und externe Freigabestati blieben unverändert.

## Audit der vorhandenen Quellen

### Tatsächlich nachgewiesene Funktionen

- AMAVIO-Portfolioansicht mit synthetischen Mandaten, Fällen, Phasen, Risiken, Eskalationen und Reporting;
- Arbeitgeberansicht mit zwei synthetischen Mandaten, Liste/Board, Planung, Freigaben, Dokumenten und Reporting;
- Fallakten-Drawer mit Risiken, Checkliste, Freigaben, Dokumentstatus und Aktivität;
- Suche, Benachrichtigungen, Mandatswechsel, geführte Tour und lokaler Reset;
- browserlokales Anlegen eines Demo-Falls;
- browserlokale Freigabe-/Ablehnungsmarkierungen;
- Drag-and-drop im Demo-Board;
- Platzhalteraktionen für Export, Einladung, Nachricht und Upload;
- zusätzliche Konzeptmodule für Prüfstatus und Raumlogik.

### Reifegrad und technische Grenzen

- statisches HTML/CSS/JavaScript;
- synthetische Daten im Quellcode;
- keine Persistenz außer temporären Browserzuständen beziehungsweise Tour-Marker;
- keine produktive Authentifizierung, Autorisierung oder Mandantentrennung;
- kein Backend, keine Datenbank, kein File-Service, kein Messaging und kein Export;
- keine produktive App-/ACC-, CRM- oder HRIS-Verbindung;
- keine produktive KI-Funktion;
- lokale Browser-QA der Website-V17 ist dokumentiert, ersetzt aber weder eigenständige ACC-QA noch echte Nutzer-, Datenschutz-, Security- oder Betriebsnachweise.

## Festgestellte Abweichungen zur Product Truth

| Priorität | Fundstelle | Abweichung/Risiko | Entscheidung |
|---|---|---|---|
| P0 | aktive Rollennavigation der V17 | Die historische Fachkraftansicht bleibt als voll interaktive dritte ACC-Rolle sichtbar. | Aus der aktiven Navigation und dem aktiven Routing entfernen; separate App als einzige künftige Fachkraftoberfläche benennen. |
| P0 | rollenübergreifende Übersichten | Nächste Verantwortung, Frist und Eskalationsweg sind nicht überall als zusammenhängende Entscheidung sichtbar. | Arbeitgeber- und AMAVIO-Journey um Verantwortungs-/Gate-Sicht ergänzen. |
| P0 | einzelne Zukunftstexte | Formulierungen wie eine spätere Anbindung „erfolgt“ können vorhandene Integration nahelegen. | Als Zielbild beziehungsweise nicht implementierten Anschluss kennzeichnen. |
| P1 | Drag-and-drop-Board | Mausbedienung ist möglich; eine gleichwertige Tastaturalternative fehlt. | Tastaturfähige Phasenaktion ergänzen oder Drag-and-drop klar als Maus-Demonstrator begrenzen. |
| P1 | eigenständige Kopie | V17 verweist auf Website-Dateien, Canonical/OG und Website-Navigation. | Standalone-Assets und interne Navigation herstellen; keine Deployment-Metadaten übernehmen. |
| P1 | Responsive-Nachweis | dokumentiert sind 1440 × 1000 und 390 × 844; 768 und 360 Pixel fehlen im ACC-spezifischen Nachweis. | dedizierte ACC-Matrix für 1440, 1024, 768, 390 und 360 Pixel ausführen. |
| P1 | Interaktionsnachweis | der bisherige Website-Browsercheck prüft die Seite, aber nicht alle zentralen ACC-Aktionen. | rollen- und aktionsbezogene Browserassertions ergänzen. |
| P2 | Brandbook | das neue Brandbook-Master ist nicht Teil dieses Audits und darf nicht vorweggenommen werden. | bestehende belastbare Markenbasis beibehalten; spätere Übernahme nur nach belastbarem Handoff. |

## Rollen- und Produktgrenze

Aktive ACC-Rollen in dieser Arbeitskopie:

1. **AMAVIO Operations** – mandatsübergreifende Steuerung, Risiken, Aufgaben, Freigaben, Eskalation und Lerntransfer.
2. **Arbeitgeber** – mandatsbezogene Sicht für Management/Sponsor, HR/Fachbereich/Standortleitung und Budget-/Freigaberolle.

Nicht Teil der aktiven ACC-Demo:

- Fachkraftoberfläche;
- Wohnanbieteroberfläche;
- lokale Partneroberfläche;
- Community-/Benefit-Nutzung.

Diese Rollen gehören in die separate AMAVIO One App. Ein künftiges Interface wird nur fachlich beschrieben: Das ACC gibt minimal erforderlichen Kontext frei; die App sendet ein minimiertes Signal oder einen Entwurf; AMAVIO prüft; ein zulässiger Status wird zurückprojiziert. Eine solche Verbindung ist nicht implementiert.

## Unveränderte Quellen und Rückfallstand

- alle Website- und App-Quellen bleiben unverändert;
- die V17-Ausgangsdatei liegt unverändert unter `archive/20260930_V17_source_baseline/control-center.html`;
- die ältere Deploy-Demo bleibt an ihrem ursprünglichen Ort unverändert;
- keine Datei wurde deployed, veröffentlicht, synchronisiert oder extern versendet.
