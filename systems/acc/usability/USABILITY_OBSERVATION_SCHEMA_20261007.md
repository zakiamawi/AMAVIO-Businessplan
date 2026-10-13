# ACC Gate 04A – Beobachtungs- und Auswertungsschema

## Messgrößen je Aufgabe

| Feld | Bedeutung |
|---|---|
| `seconds` | aktive Aufgabenzeit ohne Einleitung und Nachbefragung |
| `outcome` | erfolgreich, teilweise, nicht erfolgreich, abgebrochen oder nicht getestet |
| `assistance` | Hilfestufe 0–3 gemäß Moderationsleitfaden |
| `ease` | Single Ease Question, 1 sehr schwierig bis 7 sehr leicht |
| `errors` | sichtbare Fehlversuche oder fachlich falsche Pfade |
| `observation` | ausschließlich beobachtbares Verhalten |
| `quote` | sinngemäße, nicht personenbezogene Aussage |
| `interpretation` | getrennte AMAVIO-Hypothese |
| `severity` | `P0`, `P1`, `P2` oder kein Befund |

## Schweregrade

- `P0`: Kernaufgabe nicht lösbar, falsche Außenwirkung angenommen, Mandanten-/Rollengrenze missverstanden oder riskante Handlung nahegelegt.
- `P1`: erhebliche Reibung, wiederholter Suchweg, wesentliche Information wird übersehen oder nur mit Hilfestufe 2/3 gefunden.
- `P2`: Verbesserung von Text, Reihenfolge, visueller Hierarchie oder Komfort ohne Blockade.

## Entscheidungsregel nach mehreren Sessions

- einzelner P0: sofort analysieren, Testsequenz gegebenenfalls pausieren;
- wiederholter P1 in mindestens zwei Sessions: als priorisiertes Produktproblem behandeln;
- P2 erst bündeln, wenn Kernaufgaben stabil verstanden werden;
- Funktionswünsche getrennt von beobachteten Nutzungsproblemen führen;
- keine Prozentzahl als Markt- oder Kundennachweis darstellen.

## Exportgrenze

Die Konsole exportiert `amavio.acc.usability.v1` als lokales JSON sowie eine lokale CSV. Beide enthalten nur Teilnehmercode, Funktionsrolle, Aufgabenmessung und nicht personenbezogene Notizen. Es gibt keinen Upload, keinen Versand, keine Cloud-Synchronisierung und keine automatische Zusammenführung.
