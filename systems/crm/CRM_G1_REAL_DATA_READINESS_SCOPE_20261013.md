# G1 Real Data Readiness – Scope

**Status:** gestartet, nicht freigegeben  
**Datum:** 13.10.2026

## Zweck

G1 bereitet eine spätere, enge Product-Owner-Entscheidung vor, ob und unter welchen Bedingungen reale AMAVIO-Geschäftskontaktdaten in einem lokalen CRM verarbeitet werden dürfen. G1 ist kein Implementierungsauftrag für Echtdatenbetrieb.

## In Scope

- Dateninventar und Klassifikation;
- Zweckbindung und Datenminimierung;
- Kontakt-, Einwilligungs-, Widerspruchs- und Sperrstatus;
- Herkunft, Aktualität und Qualitätsstatus;
- Aufbewahrung, Archivierung, Berichtigung und Löschung;
- lokaler Zugriffsschutz und Geräteanforderungen;
- Sicherung, Wiederherstellung und Rückabwicklung;
- Rollen und Verantwortlichkeiten;
- Import-, Dubletten- und Bereinigungsprozess;
- Vorfall-, Stopp- und Freigabeverfahren;
- nachvollziehbare Go-/No-Go-Entscheidung.

## Out of Scope

- Import oder Eingabe realer Personen- oder Geschäftskontaktdaten;
- Authentifizierung oder Mehrbenutzerbetrieb;
- Cloud- oder Drittanbieterspeicherung;
- produktiver Versand oder Scraping;
- Provider-, App- oder ACC-Integration;
- Deployment oder Veröffentlichung.

## Definition of Ready für einen späteren G1-Beschluss

Ein Beschluss kann erst vorbereitet werden, wenn mindestens folgende Nachweise vorliegen:

1. beschlossener Datenumfang und zulässige Zwecke;
2. dokumentierter Rechts- und Informationspflichtenprozess je Kontaktart und Kanal;
3. technisch erzwungener Zugriffsschutz;
4. beschlossene Aufbewahrungs-, Lösch- und Betroffenenprozesse;
5. getesteter Import- und Rückabwicklungsweg;
6. getestete Sicherung und Wiederherstellung;
7. dokumentierter Incident- und Sperrprozess;
8. Product-Owner-Entscheidung mit verbleibenden Risiken.

## Aktueller Befund

Die lokale Architektur, synthetische Datenverträge, Archivierung, Herkunftsfelder und versionierte Sicherung bilden eine gute Vorstufe. Zugriffsschutz, reale Rechtsgrundlagen, Lebenszyklusvollzug, produktiver Import und Incident-Prozess sind nicht geschlossen. G1 bleibt gesperrt.

