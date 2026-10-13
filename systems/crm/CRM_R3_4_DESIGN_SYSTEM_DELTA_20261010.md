# AMAVIO One CRM – R3.4 Design-System-Delta

**Stand:** 10.10.2026  
**Basis:** bestehendes AMAVIO CRM Design System; kein generischer Neuaufbau.

## Beibehalten

Brand Navy `#0B1F3A`, Stage Navy `#081527`, Cream `#F7F4EC`, Gold `#C6A35A`, Bronze `#7D6130`, bestätigtes Blau und Attention-Rot bleiben die führenden Tokens. Geist trägt UI und Fließtext, Fraunces kurze redaktionelle Überschriften und Zahlenmomente, Geist Mono Zeit- und Systemangaben. Eine-Pixel-Linien, offene Flächen und geringe Radien bleiben verbindlich.

## Neu in R3.4

- `decision-cockpit` als zentrierte Bühne bis 1360 px;
- `focus-ledger` statt KPI-Karten;
- `brief-ledger` mit semantisch benannten Belegtypen;
- code-native Balkendarstellung ohne externe Grafikbibliothek;
- Aging- und Relationship-Ledger als fachlich lesbare Raster;
- sichtbare Systemlinie für Persistenz, Außenwirkung und KI-Grenze;
- Skip-Link zum Hauptinhalt;
- reduzierte Bewegung für Balken bei `prefers-reduced-motion`.

## Typografie und Dichte

Die Hauptfrage skaliert responsiv und bleibt auf kritischen Zwischenbreiten ohne Überlappung. Fokuszeilen dürfen an 1024 px mehrzeilig werden, statt Kernhandlungen abzuschneiden. Kleine Status- und Charttexte werden nur dort eingesetzt, wo sie durch klare Überschrift und zugängliche Schaltflächennamen ergänzt sind. Touch-Ziele erreichen in den mobilen Fokusaktionen mindestens 44 px.

## Nicht eingeführt

Keine Gradienten, kein Glasmorphismus, keine generischen KPI-Karten, keine KI-Sterne, keine dekorativen Netzwerkpunkte und keine Schatten außerhalb bestehender Overlays. Die Diagramme verwenden ausschließlich die vorhandenen AMAVIO-Farben und tatsächliche lokale Werte.

## Visuelle Referenz

Die freigegebene Gestaltungsrichtung liegt unter `design/r3-4/AMAVIO_ONE_CRM_R3_4_DESKTOP_CONCEPT_20261010.png` und `design/r3-4/AMAVIO_ONE_CRM_R3_4_MOBILE_CONCEPT_20261010.png`. Die Implementierung folgt ihr strukturell, ersetzt illustrative Platzhalter aber durch belegbare Zustandswerte.
