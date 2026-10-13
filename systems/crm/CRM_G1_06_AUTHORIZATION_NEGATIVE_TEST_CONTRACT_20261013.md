# G1-06 – Autorisierungs-Negativtestvertrag

Stand: 13.10.2026  
Status: Zielvertrag für spätere C1-Grundlage, nicht implementiert

## Grundsatz

Eine künftige Authentifizierung gilt erst dann als belastbar, wenn nicht nur ein erlaubter Zugriff funktioniert, sondern verbotene Zugriffe zuverlässig scheitern. UI-Ausblendung allein genügt nicht; die Daten- und Serviceebene muss die Entscheidung erzwingen.

## Erforderliche Negativtests

| Test | Erwartung |
|---|---|
| nicht authentifizierte Sitzung liest CRM-Daten | 401/gesperrt, keine Daten im Response |
| Rolle `operations_viewer` verändert Kontakt | 403/gesperrt, keine Zustandsänderung |
| kommerzielle Rolle liest Datenschutzprüfnotiz ohne Recht | 403/gesperrt |
| manipulierte Objekt-ID greift auf fremden Scope zu | 403/404, kein Metadatenleck |
| abgelaufene oder widerrufene Sitzung | erneute Authentifizierung erforderlich |
| deaktivierter Benutzer nutzt alten Link/Token | gesperrt |
| Rollenänderung während aktiver Sitzung | Rechte werden serverseitig aktualisiert/widerrufen |
| Import umgeht Rechte oder Synthetic-Gate | Import abgewiesen und auditiert |
| Backup- oder Exportfunktion ohne Sonderrecht | gesperrt und auditiert |
| Auditereignis wird durch Fachrolle geändert | unveränderlich/gesperrt |

## Abbruchkriterien

Jeder erfolgreiche unzulässige Zugriff, jede nur clientseitige Rechteprüfung, fehlende Ereignisprotokollierung oder ein unklarer Wiederherstellungsweg hält G1-06 und G1-10 auf NO-GO. Die aktuelle R3.8-Version führt nur den Negativtest aus, dass die produktiven Kontrollmechanismen tatsächlich als „nicht implementiert“ sichtbar bleiben.

