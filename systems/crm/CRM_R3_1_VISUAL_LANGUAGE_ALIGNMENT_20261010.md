# AMAVIO One CRM – R3.1 Visual & Language Alignment

**Stand:** 10.10.2026  
**Status:** lokal geprüft; ausschließlich synthetische Daten; nicht produktiv freigegeben  
**Arbeitskopie:** `20261010_AMAVIO_One_CRM_R3_1_Visual_Coverage_Working`

## Auftrag und Abgrenzung

Diese Korrekturrunde schärft das bestehende CRM-Cockpit. Sie ersetzt weder die fachliche R3-Architektur noch aktiviert sie Bündel C. Unverändert bleiben das kanonische Datenmodell, die technischen IDs, die Übergangslogik, die lokale Persistenzgrenze, die synthetischen Daten und die Trennung von CRM, App und Arrival Control Center.

Führende Gestaltungsquelle ist die AMAVIO-One-Master-Arbeitsfassung vom 30.09.2026. Die ältere Teal-/Coral-Quelle vom 19.08.2026 ist bei Widersprüchen nicht führend.

## Vorher-Nachher-Wahrheit

| Fläche | Vorher | R3.1-Korrektur | Begründung |
|---|---|---|---|
| Farben | Navy/Gold/Creme war grundsätzlich richtig, aber Gold Deep wurde als primärer CTA und Grün als Erfolgsmarker eingesetzt. | Primäraktionen jetzt in Brand Navy; Gold bleibt Arrival-Line/Akzent; Erfolgsmarker in Statusblau; Grün entfernt. | Entspricht dem Master: Navy/Gold/Creme führt, Statusfarben nur funktional. |
| Schriften | CSS nannte Geist/Fraunces, die Dateien waren im CRM jedoch nicht eingebunden. | Vorhandene lokale AMAVIO-Webfonts eingebunden; Browserprüfung bestätigt Geist und Fraunces. | Verhindert unkontrollierte System-Fallbacks. |
| Lesbarkeit | Zahlreiche sichtbare Texte lagen bei 9–11 px. | Body 15 px; UI- und Mikrotexte kontrolliert auf 12–14 px angehoben; Beschreibungen 16 px. | Nähert die App-Regel 15–16 px an; 12 px bleibt nur für echte Labels/Mikrotext. |
| Zentrierung | Dashboard und Fachseiten nutzten keine verbindliche Content-/Stage-Maxbreite. | Dashboard auf maximal 1360 px, Fachseiten auf maximal 1200 px zentriert. | Entspricht der AMAVIO-Rasterregel und stabilisiert sehr breite Ansichten. |
| Zwischenbreiten | Der rechte Kontextbereich komprimierte bei 1024–1280 px den Hauptinhalt. | Kontextbereich wird bis 1280 px unter den Hauptinhalt geführt; 1024 px bleibt ohne Seitenüberlauf. | Verhindert Kollisionen und erhält eine ruhige Hauptspalte. |
| Mobil | Die feste Navigation konnte den letzten Teil der Hauptliste überdecken. | Zusätzlicher unterer Sicherheitsabstand und Safe-Area-Unterstützung. | Inhalte bleiben erreichbar; die Navigation bleibt fest. |
| Sprache | Sichtbare Mischung aus `Scoping`, `Owner`, `Core Operations`, `Commercial / Product Owner`, `Operations`, `Review`, `Opportunity`, `Forecast` und internen R3-Hinweisen. | `Leistungsrahmen`, `Verantwortlich`, `Nächste Schritte`, `Vertrieb / Produktverantwortung`, `Operative Prüfung`, `Prüfung`, `Chance`, `gewichtete Umsatzprognose`; interne R3-Texte aus dem Arbeitsfluss entfernt. | DE-first und entscheidungsnahe AMAVIO-Sprache. |
| Datum | Sichtbare Standsangaben waren hart auf den 09.10.2026 gesetzt. | `Aktueller lokaler Stand`. | Kein veralteter Scheingenauigkeitswert in der laufenden Demo. |

## Design-QA-Mismatch-Ledger

Verglichen wurden die vorhandenen Desktop-/Mobilkonzepte, der laufende UAT-Stand und die neu gerenderten R3.1-Ansichten.

1. **P1 – Zwischenbreite:** Hauptinhalt und rechter Kontextbereich konkurrierten um Breite. Behoben durch frühere Rastervereinfachung bei 1280 px.
2. **P1 – Typografie:** Deklarierte Markenschriften waren nicht tatsächlich geladen. Behoben durch lokale Einbettung der vorhandenen AMAVIO-Fontassets.
3. **P1 – Lesbarkeit:** Relevante Hinweise, Status- und Detailtexte lagen mehrfach unter dem AMAVIO-Mindestniveau. Behoben durch typografische Mindestrollen.
4. **P1 – Farbrolle:** Gold Deep trug kleine weiße CTA-Texte; grüne Marker widersprachen dem aktuellen Master. Behoben durch Navy-Aktionen und Statusblau.
5. **P2 – Zentrierung:** Fachseiten hatten keine maximale, zentrierte Inhaltsbreite. Behoben mit 1200-/1360-px-Rahmen.
6. **P2 – Sprache:** Interne englische Rollen-, Phasen- und Releasewörter waren in der Bedienoberfläche sichtbar. Behoben, ohne technische Schlüssel umzubenennen.
7. **P2 – Mobil:** Feste Navigation und lange Inhalte benötigten einen belastbaren unteren Abstand. Behoben einschließlich Safe Area.
8. **P3 – Konzeptabweichung:** Das Mobilkonzept zeigt eine eigene Fokus-Ikone und ein reduzierteres erstes Bildschirmbild. R3.1 übernimmt diese Bildmarke nicht neu, weil keine zusätzliche Logo-/Icon-Zeichnung ohne freigegebenes Asset erfolgen soll. Diese Abweichung ist dokumentiert, nicht stillschweigend ersetzt.

## Erhalten

- bestehende AMAVIO-One-Logo-SVGs;
- Navy-/Creme-/Gold-Grundsystem;
- redaktionelle Titelhierarchie und Arrival Line;
- synthetischer Demonstrationsbestand;
- alle CRM-Core-Funktionen, Beziehungen und Verträge;
- Dialog-, Tastatur-, Fokus-, Archiv-, Undo-, Reset- und Suchlogik;
- lokale Trennung von CRM, App und ACC.

## Nicht Bestandteil

- keine neue Bildwelt und keine Bildgenerierung;
- keine produktive Datenbank, Authentifizierung oder Rechteerzwingung;
- keine realen Daten;
- keine E-Mail-, Kalender-, Dokument-, App- oder ACC-Anbindung;
- kein Deployment und keine Veröffentlichung;
- kein externer WCAG-/Screenreader-Audit.

## Visuelle Prüfevidenz

- `design/AMAVIO_ONE_CRM_DESKTOP_CONCEPT_20261008.png`
- `design/AMAVIO_ONE_CRM_MOBILE_CONCEPT_20261008.png`
- `QA/Screenshots/20261010-r3-1/desktop-1600.png`
- `QA/Screenshots/20261010-r3-1/desktop-1280.png`
- `QA/Screenshots/20261010-r3-1/zwischenbreite-1024.png`
- `QA/Screenshots/20261010-r3-1/mobile-430.png`
- `QA/Screenshots/20261010-r3-1/zoom-200-prozent.png`

