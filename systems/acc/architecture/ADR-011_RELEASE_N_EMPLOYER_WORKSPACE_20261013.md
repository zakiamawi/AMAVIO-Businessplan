# ADR-011 – Release N Employer Workspace

**Datum:** 13.10.2026  
**Status:** lokal umgesetzt und QA-geprüft  
**Geltungsbereich:** Arbeitgeberprojektion des AMAVIO Arrival Control Center

## Ausgangslage

Die bisherige Arbeitgeberoberfläche verwendete „Sponsor“ als sichtbare Rolle und reduzierte den Arbeitgeberzugang auf zwei knappe Navigationsziele. „Sponsor“ ist im Projektkontext eine interne Bezeichnung für übergreifende Entscheidungsverantwortung, erklärt einem Arbeitgebernutzer aber weder Zuständigkeit noch Aufgabe. Gleichzeitig war die fachliche Tiefe zwar im System vorhanden, wurde jedoch nicht entlang der Arbeitgeberarbeit erklärt.

## Entscheidung

1. Die technische Rollenkennung `employer_sponsor` bleibt intern bestehen, damit bestehende Rollen-, API-, Idempotenz- und Regressionverträge stabil bleiben.
2. Sichtbar heißt die Funktion **Gesamtsteuerung**.
3. Die vier Arbeitgeber-Funktionssichten heißen:
   - Gesamtsteuerung
   - Personal & Onboarding
   - Standort & Übergabe
   - Budget & Freigaben
4. Die Arbeitgebernavigation trennt zwei Aufgaben:
   - **Aufgaben & Entscheidungen** für konkrete eigene Vorgänge;
   - **Ankunftsprogramme** für gemeinsamen Lieferstand, Meilensteine und Programmbeiträge.
5. Reduktion erfolgt durch progressive Offenlegung und Aufgabenbezug. Informationen ohne aktuellen eigenen Schritt erscheinen nicht in „Ihre Vorgänge“, bleiben aber im gemeinsamen Programmraum verfügbar.
6. Interne AMAVIO-Regeln, Simulationen, Provider-, Lern-, Audit- und technische Prüfdaten bleiben aus der Arbeitgeberprojektion ausgeschlossen.

## Konsequenzen

- Die sichtbare Sprache ist für Arbeitgeber verständlicher, ohne die serverseitige Rechte- und Projektionsebene neu zu verdrahten.
- Aufgabenraum und Programmraum ergänzen sich, statt dieselben Inhalte unterschiedlich zu kürzen.
- Die Oberfläche zeigt mehr fachliche Bedeutung bei weniger gleichzeitiger Konkurrenz.
- Bestehende Deep Links verwenden weiterhin den internen Parameter `lens=sponsor`; dieser Parameter ist kein sichtbarer Produktbegriff.

## Nicht entschieden

- keine produktive Identity oder Authentifizierung;
- keine reale Mandantentrennung oder produktive Rechteverwaltung;
- keine echten Personen-, Arbeitgeber-, Objekt- oder Partnerdaten;
- keine externe KI, kein Providerkonto und keine Providerkosten;
- keine Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
