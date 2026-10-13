# Founder- und Präsentationsabnahme – Arrival Control Center

**Datum:** 30.09.2026  
**Prüfstand:** lokale Konzeptdemo, ausschließlich synthetische Daten  
**Abnahmestatus:** für interne Founder- und Arbeitgeberpräsentationen freigegeben; nicht extern veröffentlicht, nicht als Produktivsystem freigegeben

## 1. Prüfgegenstand

Geprüft wurde die lokale Arbeitskopie `index.html` entlang der vorgesehenen 6–8-Minuten-Journey aus `DEMO_GUIDE_20260930.md`:

1. Produktgrenze und Reifegrad;
2. AMAVIO Operations und Steuerungskette;
3. Risiko bis zur Fallakte und nächsten Verantwortung;
4. Arbeitgeberperspektive und Rollenmodell;
5. Board-Phasenwechsel und Freigabe;
6. Reporting und Lerntransfer;
7. Abschluss mit klarer App-/ACC-Grenze.

Die Prüfung erfolgte im lokalen In-App-Browser bei 1280 × 720 Pixeln sowie anhand der vorhandenen Desktop-, Tablet- und Mobile-QA. Es wurden keine echten Kunden-, Fachkräfte- oder Partnerdaten verwendet.

## 2. Gesamturteil

Die Demo erklärt den AMAVIO-Kernnutzen überzeugend: Aus einem Portfolio-Signal wird ein eingegrenzter Standortfall mit klarer nächster Verantwortung, Entscheidung und anschließendem Lerntransfer. Das Produkt wirkt damit nicht wie eine lose Aufgabenliste oder ein beliebiges Dashboard, sondern wie eine arbeitgeberseitige Steuerungslogik nach der Recruiting-Zusage.

Die zwei Perspektiven sind inhaltlich nachvollziehbar:

- **AMAVIO Operations:** Portfolio, Signale, Eskalation und Mandatssteuerung;
- **Arbeitgeber:** zugewiesene Verantwortung, Freigaben, Phasen und Reporting.

Die separate AMAVIO One App bleibt sichtbar außerhalb des Control Center. Die Demo behauptet weder produktive Authentifizierung noch Backend, Kundendatenbetrieb, Integration oder automatische KI-Entscheidungen.

## 3. Festgestellte Mängel und Korrekturen

| Befund | Präsentationsrisiko | Korrektur |
|---|---|---|
| Kopfbereich bei 1280 Pixeln zusammengedrückt | Kontext und Seitentitel wirkten abgeschnitten | Suche unter 1500 Pixeln ausgeblendet und Titelbereich flexibel stabilisiert |
| relative Zeiten ohne Bezugsdatum | Fälle konnten am tatsächlichen Kalendertag widersprüchlich wirken | sichtbarer simulierter Stichtag `06.09.2026` ergänzt und Falllogik angeglichen |
| Freigabeaktion ließ den Status `Prüfung offen` stehen | sichtbarer Widerspruch im wichtigsten Entscheidungsschritt | Status wechselt nun zu `Freigegeben · Demo` oder `Abgelehnt · Demo` |
| Link `Alle 14 Standortfälle ansehen` führte im Demo-Ausschnitt auf dieselbe Ansicht | konnte als defekte Funktion gelesen werden | durch nicht interaktives Label `Demo-Ausschnitt: 6 von 14 synthetischen Fällen` ersetzt |
| Tour startete bei neuer lokaler Sitzung automatisch | verdeckte den für die Moderation vorgesehenen ersten Eindruck | Tour startet nur noch bewusst über das Kompass-Symbol |
| Reporting nannte den Illustrationsstatus nur indirekt | Kennzahlen konnten zu schnell als reale Wirkung gelesen werden | Reporting direkt als illustrativ und nicht real gekennzeichnet |

## 4. Bewertungsmatrix

| Kriterium | Urteil | Begründung |
|---|---|---|
| Problemverständnis | bestanden | operative Lücke nach der Zusage wird als Arbeitgeberproblem sichtbar |
| Produktnutzen | bestanden | Signal, Verantwortung, Freigabe und Lerntransfer bilden eine nachvollziehbare Kette |
| Rollenverständnis | bestanden | AMAVIO und Arbeitgeber sind getrennt; Arbeitgeber-Unterrollen sind als Zielstruktur markiert |
| Gesprächsfluss | bestanden | Journey ist ohne Seitensprünge in etwa 6–8 Minuten moderierbar |
| Visuelle Hierarchie | bestanden nach Korrektur | Kernpfad und Hauptentscheidungen sind bei 1280 Pixeln lesbar |
| Claim- und Reifegradsicherheit | bestanden | Demo-, Daten-, Wirkungs-, App- und Produktivgrenzen bleiben sichtbar |
| Interaktionskonsistenz | bestanden nach Korrektur | Phase und Freigabe liefern eindeutige lokale Rückmeldung |
| Externe Verwendbarkeit | nicht freigegeben | Designpartner-, Legal-, Security-, Hosting- und Release-Gates sind offen |

## 5. Empfohlene Moderation

Die Präsentation sollte nicht mit einer Funktionsliste beginnen. Der stärkste Einstieg ist:

> „Recruiting endet mit der Zusage. Das Control Center macht die operative Strecke danach steuerbar: Wer muss bis wann welche Entscheidung treffen – und was lernen wir für die nächste Kohorte?“

Danach zuerst die Steuerungskette und den Demo-Pfad zeigen. Erst im konkreten Fall auf Detailfunktionen eingehen. Der Arbeitgeberwechsel folgt, sobald die nächste Verantwortung sichtbar ist. Reporting bildet den Abschluss, nicht den Einstieg.

## 6. Freigabegrenze

Freigegeben ist ausschließlich:

- die lokale, moderierte Konzeptpräsentation;
- die Verwendung synthetischer Daten;
- das Gespräch über Problem, Zielbild, Rollen, Entscheidungskette und Lerntransfer.

Nicht freigegeben sind:

- Veröffentlichung oder Deployment;
- Verwendung echter Arbeitgeber-, Fachkräfte-, Partner- oder Falldaten;
- Zusagen zu SaaS-, Pilot-, Datenschutz-, Security- oder Integrationsreife;
- externe Designpartneransprache ohne den freigegebenen Validierungsscope;
- produktive Architektur- oder Beschaffungsentscheidungen.

## 7. Rückfallbasis

Vor den Präsentationskorrekturen wurde die Arbeitskopie unter `archive/20260930_181739_founder_presentation_baseline/` gesichert.

- SHA-256 aktive `index.html` vor Korrektur: `bd6697bd22443b9b8f3ff8a62337b88e091a935bd3d68b3461504faa5478c4e6`
- SHA-256 archivierte `index.html`: `bd6697bd22443b9b8f3ff8a62337b88e091a935bd3d68b3461504faa5478c4e6`

Die Hashes stimmen überein.
