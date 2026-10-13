# ACC Gate 04A – Moderationsleitfaden

**Stand:** 07.10.2026  
**Status:** intern testbereit; keine externe Einladung oder Durchführung freigegeben  
**Testbasis:** ausschließlich lokale Arbeitskopie `20261007_AMAVIO_ACC_Moderated_Usability_Test_Working`

## Ziel

Der Test prüft, ob eine Person sechs zentrale Arrival-Operations-Aufgaben versteht und ausführen kann. Er prüft keine Kaufbereitschaft, keine Marktvalidierung, keinen produktiven Datenschutz und keine Leistungsfähigkeit mit realen Daten.

## Dauer und Rollen

- 5 Minuten Einführung und Scope;
- 20–25 Minuten für sechs Aufgaben;
- 5–10 Minuten Nachbefragung;
- eine moderierende und eine beobachtende Person, wenn intern verfügbar;
- Teilnehmer ausschließlich über einen Code wie `SYN-UT-01`, niemals über Name oder E-Mail erfassen.

## Vorbereitung

1. `npm start` in der datierten Arbeitskopie ausführen.
2. Demo unter `http://127.0.0.1:4197/?page=operations` öffnen.
3. Moderationskonsole unter `http://127.0.0.1:4197/usability/index.html` öffnen.
4. Vor jeder Session eine neue lokale synthetische Datenbankdatei verwenden oder einen unveränderten Seedstand bereitstellen.
5. Browser-Tabs, Systembenachrichtigungen und vertrauliche Inhalte schließen.
6. Keine Aufzeichnung starten.

## Einleitung – wortnah

„Wir testen heute die Arbeitsoberfläche, nicht Sie. Alle dargestellten Personen, Arbeitgeber, Termine, Objekte und Belege sind synthetisch. Bitte verwenden Sie keine echten Namen oder Fälle. Die Anwendung versendet nichts, bucht nichts und trifft keine produktive Entscheidung. Bitte denken Sie während der Aufgaben laut. Ich helfe zunächst nicht; wenn Sie feststecken, gebe ich einen neutralen Hinweis.“

## Moderationsregel

Hilfen werden gestuft und dokumentiert:

| Stufe | Zulässige Hilfe |
|---|---|
| 0 | keine Hilfe |
| 1 | neutral: „Was würden Sie als Nächstes prüfen?“ |
| 2 | Navigation: „Schauen Sie in den Bereich Evidenz.“ |
| 3 | Moderator zeigt oder führt den Schritt aus |

Keine Funktionsweise erklären, bevor die Person versucht hat, die Aufgabe selbst zu lösen. Keine Zustimmung signalisieren und keine Produktversprechen ergänzen.

## Sechs Aufgaben

1. Blockade und Produktzweck erkennen – Zielzeit 90 Sekunden.
2. Evidenzkonflikt erklären – Zielzeit 120 Sekunden.
3. nächste Verantwortung bestimmen – Zielzeit 90 Sekunden.
4. Simulation ohne versehentliche Übernahme – Zielzeit 150 Sekunden.
5. menschliche Entscheidung dokumentieren – Zielzeit 150 Sekunden.
6. Arbeitsprodukt und Wirkungsgrenze verstehen – Zielzeit 120 Sekunden.

Die exakten Aufgabenformulierungen und Erfolgskriterien sind in der lokalen Moderationskonsole hinterlegt.

## Nachbefragung

1. Was war die Aufgabe dieser Oberfläche in einem Satz?
2. Was hat Ihnen als Erstes gezeigt, dass Handlungsbedarf besteht?
3. Wo war unklar, ob etwas nur vorbereitet oder bereits ausgeführt wurde?
4. Welche Information fehlte Ihnen für eine sichere Entscheidung?
5. Welche Darstellung würden Sie in Ihrer Rolle täglich benötigen – und welche nicht?
6. Welche Aktion dürfte das System niemals automatisch ausführen?

## Abbruch

Session sofort unterbrechen, wenn echte Personen-, Arbeitgeber-, Gesundheits-, Visa-, Vertrags- oder Objektdaten eingegeben werden sollen, eine Aufzeichnung ohne Freigabe läuft oder die Demo als produktives System verstanden beziehungsweise dargestellt wird.

## Abschluss

Die Person darauf hinweisen, dass ihre Rückmeldung eine einzelne Usability-Beobachtung ist. Keine Designpartner-, Pilot-, Kunden- oder Produktzusage ableiten. Exportdateien bleiben lokal und werden erst nach einer separat definierten Aufbewahrungs- und Zugriffsentscheidung zusammengeführt.
