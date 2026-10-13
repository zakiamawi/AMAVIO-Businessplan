# AMAVIO One CRM – R3.4 Design Fidelity Ledger

**Stand:** 10.10.2026  
**Vergleich:** generierte Desktop-/Mobilkonzepte gegen laufende R3.4-Implementierung.

| Vergleichspunkt | Konzept | Implementierung | Bewertung |
|---|---|---|---|
| Gesamtkomposition | dunkle Primärnavigation, cremefarbene Entscheidungsbühne | umgesetzt | hohe strukturelle Treue |
| Above the fold | Leitfrage, drei Prioritäten, lokale Agenda | umgesetzt; echte synthetische Namen und Werte | bewusst datenwahr |
| Founder Focus | drei begründete Zeilen | exakt drei regelbasierte Prioritäten | umgesetzt |
| Decision Brief | Fakt, Annahme, Frage, Empfehlung | vier explizite Ledger-Zeilen | umgesetzt |
| Pipeline | Balken und Bewegungshinweis | aktueller Bestand plus dokumentierte Phasenbewegung | fachlich präzisiert |
| Aging | vier Alterszonen | 0–7, 8–14, 15–30, >30 Tage | umgesetzt |
| Relationship Field | Beziehungskontext | Organisation, Kontakt, Fachbereich, Entscheider, Partner | umgesetzt |
| Datenvertrauen | kompakte Qualitätszeile | vier transparente Dimensionen | umgesetzt |
| Mobile | gestapelter Fokus vor Charts | umgesetzt; breite Fachgrafiken intern scrollbar | umgesetzt |
| KI-Grenze | erklärbare Assistenz | sichtbare lokale Simulation, keine externe KI | stärker präzisiert |

## Bewusste Abweichungen

Illustrative Trendwerte aus dem Konzept wurden nicht übernommen, wenn der lokale Zustand keine entsprechende Historie enthält. Die Implementierung zeigt deshalb `keine Bewegung` oder dokumentierte Ereigniszahlen. Die mobile Tagesagenda ist ausgeblendet, um Handlung und Briefing oberhalb der Visualisierungen zu halten; Termine und Aufgaben bleiben über Navigation und Suche erreichbar. Die feste mobile Navigation kann im Vollseiten-Screenshot einen Inhaltsteil überlagern, bleibt in der realen Scroll-Nutzung jedoch am unteren Viewportrand und wahrt den Primärzugriff.

## Abnahme

Die visuelle Agentur-Sign-off-Bedingung ist erfüllt. Beide Konzeptbilder wurden mit `view_image` gegen aktuelle 1600- und 430-px-Browserscreenshots geprüft. Hierarchie, Navy-/Creme-/Gold-System, redaktionelle Typografie, drei Prioritäten, Brief-Ledger, Diagramme, Beziehungsfeld und Datenvertrauen stimmen materiell überein. 1024, 768, 430 und 390 px bleiben ohne Seitenüberlauf; der echte 200-%-Reflow ist bestanden. Verbleibende Abweichungen sind die bewusst datenwahre Ersetzung illustrativer Zahlen sowie das technisch bedingte Auftreten der fixen Mobilnavigation innerhalb eines Vollseiten-Screenshots.

## Above-the-fold-Copy-Diff

Konzept und Implementierung verwenden identisch die Leitfrage `Was heute entschieden werden sollte`, den erklärenden Untertitel und `Founder Focus`. `Angebotsgrenzen entscheiden` wurde in der Implementierung zu `Angebot finalisieren`, weil dies die tatsächlich im synthetischen Datensatz hinterlegte nächste Handlung ist. Die illustrative Uhrzeit-/Kalenderagenda wurde durch reale lokale Termine und Aufgaben ersetzt; eine Kalenderintegration wird nicht behauptet.
