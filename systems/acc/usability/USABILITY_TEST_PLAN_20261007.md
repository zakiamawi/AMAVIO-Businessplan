# ACC Gate 04A – Testplan für die erste synthetische Welle

**Stand:** 07.10.2026  
**Reifegrad:** technisch testbereit; externe Rekrutierung und Terminierung noch nicht freigegeben  
**Kostenannahme:** 0 EUR für lokale Durchführung; keine Identity-, Hosting-, Aufzeichnungs- oder Providerkosten

## Forschungsfrage

Können relevante Rollen aus einem synthetischen Arrival-Fall die Blockade, Evidenzlage, nächste Verantwortung, Simulationsgrenze, menschliche Entscheidung und das lokale Arbeitsprodukt ohne produktive Systemannahmen verstehen und bearbeiten?

## Wellenmodell

### Welle 0 – interner technischer Probelauf

- Status: abgeschlossen;
- Zweck: Instrument, Navigation, Messung, Export und Responsive-Verhalten prüfen;
- Ergebnis: technisch grün;
- Evidenzwert: kein menschlicher Usability-Nachweis.

### Welle 1 – fünf moderierte synthetische Sessions

| Code | Zielrolle | Zweck |
|---|---|---|
| `SYN-UT-01` | Arbeitgeber HR/People Operations | Fallarbeit, Evidenz und nächste Verantwortung |
| `SYN-UT-02` | Arbeitgeber Sponsor/Management | Entscheidung, Überblick und Wirkungsgrenze |
| `SYN-UT-03` | Standort/Fachbereich | Aufgaben, Fristen und Übergabeabhängigkeiten |
| `SYN-UT-04` | AMAVIO Operations | operative Tiefe und Ausnahmebearbeitung |
| `SYN-UT-05` | Arbeitgeber HR oder Sponsor | Wiederholungsprüfung der stärksten Befunde |

Die Codes sind Platzhalter und enthalten keinerlei Personen- oder Organisationsinformation. Eine reale Person wird erst nach Founder-Freigabe eingeladen; Kontaktdaten werden nicht in dieser Arbeitskopie gespeichert.

## Primäre Messgrößen

- Erfolgsquote je Aufgabe;
- Median der Aufgabenzeit;
- Anteil ohne Hilfe beziehungsweise nur mit Hilfestufe 1;
- SEQ-Mittelwert je Aufgabe;
- Anzahl P0-/P1-Befunde;
- Verständnis der Aussagen `synthetisch`, `local_only`, `sink_only` und `keine Außenwirkung`.

## Vorläufige Exit-Kriterien

- kein P0-Befund zur Außenwirkung, Rollen-/Mandantengrenze oder automatischen Entscheidung;
- mindestens vier von fünf Personen lösen Aufgaben 1, 2, 3 und 6 erfolgreich oder teilweise ohne Hilfestufe 3;
- Aufgabe 4 wird von mindestens vier Personen als Simulation erkannt, bevor eine Übernahme erfolgt;
- mindestens vier Personen können nach Aufgabe 5 erklären, dass die Verantwortung beim Menschen bleibt;
- kein wiederholter P1-Befund bleibt ohne priorisierte Korrekturentscheidung.

Diese Schwellen bewerten die Verständlichkeit der getesteten Oberfläche. Sie sind kein Nachweis für Marktakzeptanz, Produkt-Markt-Fit, Datenschutzreife oder produktive Einsatzfähigkeit.

## Entscheidungslogik

1. P0-Befund: Testwelle pausieren, Ursache analysieren, gezielte Korrektur auf neuer Rückfallbasis, danach Retest.
2. wiederholter P1: in P1-Backlog aufnehmen und vor Gate 02B entscheiden.
3. P2: bündeln; erst nach Stabilität der Kernjourney priorisieren.
4. Funktionswunsch ohne beobachtetes Problem: Discovery-Backlog, nicht automatisch umsetzen.
5. Erst nach Auswertung aller fünf Sessions eine Entscheidung zu Gate 02B treffen.

## Harte Grenzen

- keine realen Fälle oder Dokumente;
- keine produktive Registrierung oder Authentifizierung;
- keine Nachricht, Buchung, Integration oder Freigabe;
- keine Audio-, Video- oder Bildschirmaufzeichnung;
- keine Speicherung von Namen, E-Mail-Adressen oder Organisationen;
- keine externe Einladung oder Terminbuchung ohne neue Founder-Freigabe.
