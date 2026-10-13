# Release P – Arrival Reliability & Intervention System

Stand: 13.10.2026  
Status: lokale, synthetische Arbeitskopie  
Vorgänger: `20261013_AMAVIO_ACC_Release_O_Pilot_Ready_Operational_Core_Working`

## Produktthese

Das Arrival Control Center verwaltet nicht nur Aufgaben und Programmphasen. Es verbindet ein überprüfbares Startversprechen mit einem konkreten Ausfallmodus, der betrieblichen Auswirkung, einer fachlich beschriebenen AMAVIO-Intervention, einer menschlichen Entscheidung, einem Abschlussnachweis und einem verwertbaren Arbeitsprodukt.

Zentrale Frage:

> Kann die synthetische Kohorte sicher anreisen, zum vereinbarten Termin starten und nach der Ankunft stabilisiert werden – und welche Intervention verhindert einen erkennbaren Ausfall?

## Produktobjekte

1. **Startversprechen** – Zieltermin, Kapazität, Standorte und Bedingungen.
2. **Ausfallmodus** – fachlich benannte Ursache mit Evidenz und Betriebsfolge.
3. **Handlungsoption** – Starttermin, Aufwand, Risiko, Voraussetzung und Trade-off.
4. **AMAVIO-Intervention** – Leistung, Owner, Zieltermin, Arbeitgeberbeitrag und Abschlussnachweis.
5. **Human Gate** – Arbeitgeber-Gesamtsteuerung wählt und begründet eine ausschließlich synthetische Demoentscheidung.
6. **Ausführung** – AMAVIO Operations dokumentiert den geprüften Abschlussnachweis.
7. **Arbeitsprodukt** – Übergabe- und Ankunftsplan sowie Arrival Readiness Brief.
8. **Stabilisierung** – synthetische 30-Tage-Rückmeldung nach bestätigter Startfähigkeit.

## Drei Ausnahmewege

| Ausnahmeweg | Betroffene Startplätze | Betriebsfolge | empfohlene Intervention |
|---|---:|---|---|
| Unterkunftsübergabe Solingen nicht bestätigt | 2 | möglicher Verzug bis 7 Tage | Standort- und Wohnübergabe absichern |
| Anreisefenster verschoben | 4 | Abholung, Unterkunft und Onboarding müssen neu getaktet werden | Ankunftskette neu planen |
| Standort- und Onboardingplan widersprechen sich | 3 | keine eindeutige betriebliche Übergabe | betriebliche Übergabe synchronisieren |

## Readiness-Zustände

`Ungeprüft → Gefährdet → Unter Bedingungen → Intervention aktiv → Bestätigt`

Die Zustände sind keine probabilistische KI-Bewertung und kein automatischer Score. Jeder Zustandswechsel verlangt eine fachlich definierte Voraussetzung:

- `Unter Bedingungen`: eine gültige Handlungsoption wurde ausgewählt oder der Start ist nur unter einer klar benannten Bedingung möglich.
- `Intervention aktiv`: die Arbeitgeber-Gesamtsteuerung hat die synthetische Entscheidung mit Begründung bestätigt.
- `Bestätigt`: AMAVIO Operations hat Nachweisreferenz und Prüfnotiz dokumentiert.

## Rollenvertrag

### Arbeitgeber · Gesamtsteuerung

- sieht Startversprechen, Betriebsfolge, Optionen, gemeinsame Arbeitsprodukte und Ergebnisstatus;
- wählt eine Option;
- bestätigt die Intervention mit Begründung;
- dokumentiert nach bestätigter Startfähigkeit die synthetische 30-Tage-Rückmeldung.

### Arbeitgeber · Personal, Standort und Budget

- sehen die gemeinsame, minimierte Programmlage;
- können die bereichsübergreifende Intervention nicht freigeben;
- erhalten keine interne Kernel-, Policy-, Evaluations- oder Providerlogik.

### AMAVIO Operations

- sieht alle drei Ausnahmewege und die vereinbarte Intervention;
- kann keine Arbeitgeberentscheidung ersetzen;
- prüft den Abschlussnachweis;
- setzt die Startfähigkeit erst nach Nachweisreferenz und Prüfnotiz auf `Bestätigt`;
- kann den lokalen synthetischen Demonstrationsstand zurücksetzen.

## Lokale API

| Route | Zweck |
|---|---|
| `GET /api/reliability/v1/bootstrap` | rollenbezogene Programmlage und ausgewählter Ausnahmeweg |
| `GET /api/reliability/v1/scenarios/:id` | ein Ausnahmeweg mit Optionen, Evidenz und Berechtigungen |
| `POST /api/reliability/v1/scenarios/:id/options` | menschliche Optionsauswahl der Gesamtsteuerung |
| `POST /api/reliability/v1/scenarios/:id/authorize` | Human Gate und Interventionsfreigabe |
| `POST /api/reliability/v1/scenarios/:id/complete` | Operations-Nachweis und Neubewertung |
| `GET /api/reliability/v1/work-products/:type` | reproduzierbares lokales Arbeitsprodukt |
| `POST /api/reliability/v1/scenarios/:id/outcomes` | synthetische 30-Tage-Rückmeldung |
| `POST /api/reliability/v1/reset` | lokaler Reset durch AMAVIO Operations |

Alle Mutationen laufen durch den vorhandenen Idempotenzvertrag. Versionsfelder schützen Optionsauswahl, Human Gate und Abschluss vor parallelen widersprüchlichen Änderungen.

## Harte Grenzen

- ausschließlich lokale und synthetische Daten;
- keine realen Personen, Arbeitgeber, Objekte oder Partner;
- keine produktive Registrierung oder Authentifizierung;
- keine Nachricht, Buchung, Freigabe oder sonstige Außenwirkung;
- kein externer KI-Provider und keine Providerkosten;
- keine CRM-, HRIS-, App-, Datei-, Messaging- oder Buchungsintegration;
- keine Aussage über produktiven Datenschutz, Security, Hosting, Betrieb oder Rechtskonformität;
- keine Kopplung an die getrennte Drei-Rollen-App oder das lokale CRM.
