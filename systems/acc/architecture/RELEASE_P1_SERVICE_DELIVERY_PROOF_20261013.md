# Release P.1 – Service Delivery Proof

Stand: 13.10.2026  
Status: lokale, synthetische Arbeitskopie ohne Außenwirkung  
Rückfallbasis: `20261013_AMAVIO_ACC_Release_P_Arrival_Reliability_Intervention_Working`

## Ausgangsbefund

Die Founder-Prüfung von Release P bestätigte Geschäftsproblem und Handlungsoptionen. Noch nicht vollständig überzeugend waren die sichtbare AMAVIO-Leistung, die Trennung zwischen Arbeitgeberentscheidung und AMAVIO-Ausführung sowie die Nutzbarkeit der Arbeitsprodukte.

Release P.1 ergänzt deshalb keine weitere Modulschicht. Es macht die bereits vorhandene Intervention als überprüfbare Dienstleistungskette sichtbar:

`Arbeitgeber entscheidet → Leistungsauftrag entsteht → AMAVIO übernimmt → Nachweise werden geschlossen → Ergebnis wird zurückgegeben → Arbeitsprodukt dokumentiert`

## Fachlicher Vertrag

### Arbeitgeber · Gesamtsteuerung

- vergleicht die Handlungsoptionen;
- wählt eine Option und begründet die synthetische Entscheidung;
- bestätigt den konkreten Leistungsrahmen und die eigene Mitwirkung;
- übergibt den Auftrag sichtbar an AMAVIO;
- kann die Entscheidung während der Ausführung nicht verändern;
- erhält Ergebnis, Restbedingung, nächsten Prüfpunkt und Arbeitsprodukte zurück.

### AMAVIO Operations

- kann die Arbeitgeberentscheidung nicht ersetzen;
- übernimmt nur einen ausdrücklich freigegebenen Auftrag;
- bearbeitet einen eigenen Ausführungsraum statt der Arbeitgeber-Entscheidungsoberfläche;
- schließt jeden Arbeitsschritt nur mit Nachweisreferenz und Prüferläuterung;
- kann das Ergebnis erst zurückgeben, wenn alle vereinbarten Schritte belegt sind;
- dokumentiert Ergebnis, Restbedingung, nächsten Prüfpunkt und zusammenfassenden Nachweis.

### Weitere Arbeitgeberbereiche

Personal & Onboarding, Standort & Übergabe sowie Budget & Freigaben sehen nur ihren gemeinsamen Status und die freigegebene Mitwirkung. Sie können den bereichsübergreifenden Auftrag weder erteilen noch operativ abschließen.

## Neue Produktobjekte

1. **Leistungsauftrag** mit Auftragsnummer, Option, Servicefenster, Leistungsumfang, Arbeitgeberbeitrag, Abnahmekriterien und ausdrücklicher Nicht-Leistung.
2. **Ausführungsschritt** mit Reihenfolge, Verantwortung, erforderlicher Evidenz, Status, Nachweisreferenz und interner Prüferläuterung.
3. **Ergebnisübergabe** mit Ergebniszusammenfassung, Restbedingung, nächstem Prüfpunkt und Abschlussnachweis.
4. **Versioniertes Arbeitsprodukt** mit Referenz, Version, Status, Verantwortung, Aktualisierungszeitpunkt und druckbarer Darstellung.

## Persistenz und Zustandsvertrag

Neue lokale Tabellen:

- `arrival_intervention_orders`
- `arrival_intervention_steps`

Auftragszustände:

`authorized → in_execution → completed`

Die Arbeitgeberentscheidung wird beim Übergang zu `authorized` fixiert. Optionsänderungen sind danach serverseitig gesperrt. Jeder Ausführungsschritt besitzt eine eigene optimistische Version. Der Gesamtabschluss scheitert geschlossen, solange mindestens ein Schritt offen ist.

## Lokale API-Erweiterung

| Route | Rolle | Zweck |
|---|---|---|
| `POST /api/reliability/v1/scenarios/:id/start-execution` | AMAVIO Operations | freigegebenen Leistungsauftrag übernehmen |
| `POST /api/reliability/v1/scenarios/:id/steps/:stepId/complete` | AMAVIO Operations | einzelnen Ausführungsschritt mit Evidenz schließen |
| `POST /api/reliability/v1/scenarios/:id/complete` | AMAVIO Operations | vollständiges Ergebnis an den Arbeitgeber zurückgeben |

Die bestehenden Optionen-, Freigabe-, Arbeitsprodukt-, Outcome- und Reset-Routen bleiben erhalten. Die 02A-Matrix umfasst nun 85 Routen und 51 Mutationen.

## Arbeitsprodukte

### Übergabe- und Ankunftsplan

Enthält Auftrag, gewählte Option, Leistungsumfang, Verantwortungsübergabe, Ausführungsschritte, Evidenzstatus, Ergebnis und nächsten Prüfpunkt.

### Arrival Readiness Brief

Enthält Startversprechen, Entscheidungslage, AMAVIO-Auftrag, Nachweis und Ergebnis, Rollenverantwortung und Geltungsgrenze. Beide Dokumente besitzen Referenz, Version, Status, Owner und Aktualisierungszeitpunkt und können lokal als Druckansicht geöffnet werden.

## Harte Grenzen

- ausschließlich lokale und synthetische Daten;
- kein externer KI-Provider und keine Providerkosten;
- keine produktive Identity, Registrierung oder Authentifizierung;
- keine realen Personen-, Arbeitgeber-, Objekt- oder Partnerdaten;
- keine Nachricht, Buchung, Freigabe oder sonstige Außenwirkung;
- keine CRM-, HRIS-, App-, Datei-, Messaging- oder Buchungsintegration;
- kein Hosting, Deployment oder Veröffentlichung;
- keine Aussage über produktiven Datenschutz, Security oder Betrieb.

## Abnahmekriterien

1. Innerhalb von 20 Sekunden ist erkennbar, was AMAVIO übernimmt, bis wann und mit welchem Ergebnis.
2. Arbeitgeber und AMAVIO Operations bearbeiten fachlich verschiedene Aufgaben auf demselben Fallstand.
3. Eine freigegebene Entscheidung ist während der Ausführung gesperrt.
4. Ein Ergebnis kann erst nach vollständig belegten Ausführungsschritten übergeben werden.
5. Übergabeplan und Readiness Brief sind ohne Demo-Erklärung intern lesbar, versioniert und druckbar.

