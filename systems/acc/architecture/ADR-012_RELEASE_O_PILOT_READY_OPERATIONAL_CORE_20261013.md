# ADR-012 – Release O Pilot-Ready Operational Core

**Datum:** 13.10.2026  
**Status:** angenommen für die lokale synthetische Arbeitskopie  
**Rückfallbasis:** Release N auf Port 4214

## Entscheidung

Release O führt keine neue sichtbare Modulschicht ein. Die bisher gewachsene Fachlogik wird hinter einem konsolidierten Oberflächenvertrag zusammengeführt:

- `index.html` lädt lokale Fonts, `assets/core.css` und `assets/core.js`;
- bestehende Backend-Domänen bleiben Fach- und Sicherheitsbasis;
- die Primärreise besitzt fünf abhängige Arbeitsschritte;
- Arbeitgeber und AMAVIO Operations erhalten getrennte Projektionen desselben synthetischen Arbeitsstands;
- jede Entscheidung bleibt menschlich, lokal, begründet und ohne Außenwirkung;
- externe Provider und produktive Integrationen bleiben geschlossen.

## Golden Journey

1. AMAVIO vergleicht widersprüchliche Evidenz und erzeugt einen prüfbaren Klärungsauftrag.
2. Der Arbeitgeber-Arbeitsbereich „Standort & Übergabe“ bestätigt einen strukturierten Beitrag.
3. AMAVIO prüft die Auswirkung auf Arbeitsstart und Programmabhängigkeiten.
4. AMAVIO dokumentiert eine menschliche Entscheidung mit Begründung.
5. Das ACC erzeugt einen Arrival Readiness Brief mit belegtem Stand, Verantwortung, Entscheidung, Programmfolge und Wirkungsgrenze.

Kein Schritt darf seinen Vorgänger still überspringen. Rollenfremde Aktionen, veraltete Versionen, Parallelbearbeitung und unvollständige Beiträge scheitern geschlossen.

## Drei Ausnahmewege

- **Evidenzkonflikt:** Quellen, Widerspruch, fehlende Grundlage und Klärungsauftrag.
- **Verspätete Arbeitgeberantwort:** lokale Eskalationsvorlage ohne Versand.
- **Geändertes Ankunftsdatum:** isolierte Neuberechnung von Folgefristen; Übernahme nur nach Human Gate.

## Konsolidierungsvertrag

Die vorherigen Release-Dateien bleiben als historische Fach- und Rückfallbasis im Arbeitsordner, werden jedoch nicht mehr vom aktiven HTML geladen. Das vermeidet eine riskante Big-Bang-Neuentwicklung des Backends, entfernt aber die UI-Kaskade aus dem Produktlauf.

## Messvertrag

Lokale Ereignisse erfassen Aufgabenerfolg, Bearbeitungszeit, Übergabe und Human Gates. Nacharbeit und Evidenzvollständigkeit sind Kriterien für den moderierten Pilot. Kein lokaler Wert wird als reale Produktivitäts- oder Wirkungsbehauptung ausgegeben.

## Sicherheits- und Produktgrenze

- ausschließlich synthetische Daten und lokale Demo-Sitzungen;
- kein externer KI-Provider, keine Providerkosten und keine Credentials;
- keine produktive Identity, Authentifizierung oder Mandanteneinrichtung;
- keine CRM-, HRIS-, App-, Datei-, Messaging- oder Buchungsintegration;
- keine Veröffentlichung, kein Deployment und keine externe Validierung durch diesen Release.

## Konsequenzen

Release O ist pilotbereit im Sinn eines moderierten synthetischen Produkttests, nicht produktionsbereit. Produktive Architekturentscheidungen bleiben getrennte Founder-, Datenschutz-, Security-, Hosting-, Vertrags- und Betriebsgates.
