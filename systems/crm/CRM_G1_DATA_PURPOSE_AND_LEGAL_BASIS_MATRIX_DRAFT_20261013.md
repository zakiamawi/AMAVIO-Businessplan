# G1 Datenzweck- und Rechtsgrundlagenmatrix – Entwurf

**Status:** fachliche Entscheidungsvorlage, keine Rechtsberatung und keine Rechtsfreigabe

| Datenklasse | Enger CRM-Zweck | Minimierung | Vor Nutzung realer Daten erforderlich | Status |
|---|---|---|---|---|
| Unternehmensstammdaten | B2B-Account- und Chancensteuerung | Name, Branche, Region, öffentliche Unternehmensdaten | Zweck bestätigen; Quelle und Aktualität dokumentieren | entscheidungsreif |
| Geschäftliche Kontaktdaten | Ansprechpartner und dokumentierter Kontaktprozess | Name, Funktion, geschäftliche Kontaktdaten, Organisationsbezug | Rechtsgrundlage, Kanal, Informationspflicht und Widerspruchsweg fachlich/rechtlich prüfen | gesperrt |
| Beziehungs- und Verlaufsdaten | Gespräch, Aufgabe, nächster Schritt und Entscheidung nachvollziehen | sachliche Ergebnisse; keine privaten Nebenumstände oder Werturteile | Schreibregel und Einsichtsberechtigung beschließen | entscheidungsreif |
| Kommerzielle Daten | Chance, Angebot, Betrag und Entscheidungsweg steuern | nur geschäftlich erforderliche Angebotsdaten | Zugriffs- und Aufbewahrungsregel beschließen | entscheidungsreif |
| Herkunfts- und Nachweisdaten | Quelle, Qualität und Bearbeitung prüfbar halten | Quellenart, URL/Referenz, Datum, Qualität | zulässige Quellentypen und Evidenzstandard bestätigen | entscheidungsreif |
| Besondere/private Daten | kein Zweck im G1-Erstumfang | keine Erfassung | bleiben ausgeschlossen; neue Nutzung nur über gesondertes Gate | ausgeschlossen |

## Erlaubnislogik im Entwurf

Der technische Status `consentStatus` ist kein automatischer Rechtsgrundlagennachweis. `documented` bedeutet nur, dass Zweck, Quelle, Zeitpunkt und Referenz vollständig erfasst wurden. `not_required_review` bedeutet ausschließlich, dass ein gesonderter fachlicher Prüfpfad dokumentiert wurde; es ist keine pauschale Erlaubnis. `withdrawn`, `blocked`, Widerspruch und Kontaktsperre müssen jede spätere Außenaktion sperren.

## Offene Rechtsentscheidungen

- Welche Rechtsgrundlage gilt je Kontaktgruppe, Quelle, Zweck und Kanal?
- Wann und in welcher Form wird die Informationspflicht erfüllt?
- Welche öffentlichen Quellen dürfen für manuelle B2B-Recherche genutzt werden?
- Welche Nachweise müssen für Widerspruch, Berichtigung und Löschung erhalten bleiben?
- Welche Aufbewahrung folgt aus handels- oder steuerrechtlichen Pflichten für Angebote und Vertragsbezug?

Bis zur dokumentierten Prüfung bleiben reale Kontakte, produktiver Import und Versand NO-GO.

