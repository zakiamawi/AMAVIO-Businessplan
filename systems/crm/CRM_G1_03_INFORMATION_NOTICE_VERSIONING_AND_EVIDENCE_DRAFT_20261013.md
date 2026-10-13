# G1-03 – Informationspflicht-Versionierung und Nachweis

Stand: 13.10.2026  
Status: Entwurf, fachkundig zu prüfen

## Zweck

Das CRM soll nicht nur ein Feld „Information versendet“ besitzen, sondern nachvollziehbar halten, welche geprüfte Version in welchem Erhebungskontext wann über welchen Weg bereitgestellt wurde. Die lokale Struktur erzeugt noch keinen Versand und enthält keine finalen Rechtstexte.

## Artefaktregister

| Artefakt | Referenz | Auslöser | Mindestnachweis | Status |
|---|---|---|---|---|
| Hinweis direkte Erhebung | Art. 13 DSGVO | direkte Aufnahme beim Kontakt | Version, Zeitpunkt, Weg, Kontaktbezug | externe Prüfung erforderlich |
| Hinweis indirekte Erhebung | Art. 14 DSGVO | Aufnahme aus öffentlicher/anderer Quelle | Quelle, Version, Zeitpunkt, Weg, Kontaktbezug | externe Prüfung erforderlich |
| Widerspruch/Kontaktsperre | Art. 21 DSGVO und Kanalprüfung | Widerspruch, Abmeldung, Widerruf | Sperrzeitpunkt, minimaler Sperrgrund, blockierte Entwürfe | lokal testbar |
| Auskunft/Berichtigung/Löschprüfung | Art. 15–18 DSGVO | Betroffenenanfrage | Identitätsprüfung, Frist, Entscheidung, Vollzug, Abschluss | Playbook-Entwurf |

## Versionierungsvertrag

Eine künftige freigegebene Fassung benötigt eine unveränderliche Versions-ID, Freigabedatum, fachlich verantwortliche Rolle, geltenden Erhebungspfad, Sprache, Gültigkeitsbeginn, ersetzte Vorgängerversion und eine lokale Referenz auf die freigegebene Datei. Änderungen an Zweck, Empfängern, Speicherdauer, Kontaktweg oder Rechtsgrundlage erzeugen eine neue Version.

## Evidenzgrenze

Ein Zeitstempel allein beweist keine ordnungsgemäße Information. Der produktive Nachweis muss Version, Empfängerbezug, Bereitstellungsweg und Zeitpunkt zusammenführen. Bis ein solcher Prozess beschlossen und getestet ist, bleibt `informationDutyStatus=structured_external_review_required` und jede produktive Kontaktaufnahme gesperrt.

