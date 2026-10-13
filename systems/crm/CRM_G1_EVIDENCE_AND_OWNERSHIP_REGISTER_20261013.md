# G1 Nachweis- und Verantwortungsregister

**Datum:** 13.10.2026  
**Gesamtstatus:** lokale Vorbereitung vollständig dokumentiert; G1 nicht freigegeben

| Gate | Verantwortung | Lokaler Nachweis | Fehlender Nachweis | Einstufung |
|---|---|---|---|---|
| G1-01 | Product Owner | Zweck-/Umfangsmatrix, Ausschlussklasse und PO-CRM-043 | Quellen-/Kanalprüfung für produktive Nutzung | lokal PO-beschlossen |
| G1-02 | CRM-Administration | sechs Datenklassen, Feld- und Ausschlussregeln | Pflegeprozess bei Felderweiterung | lokal belegt |
| G1-03 | Datenschutz/Recht | Kontaktstatus, Sperre und Pflichtfeldvertrag | Rechtsgrundlagen-/Informationspflichtenprüfung | extern gesperrt |
| G1-04 | CRM-Administration | Quelle, Datum, Qualität; 100-%-Testabdeckung im Seed | realer Stichprobenstandard | lokal belegt |
| G1-05 | PO/Datenschutz | Reviewintervalle, Verbot automatischer Löschung und synthetischer Lebenszykluslauf | Datenschutzvalidierung und realer Vollzugsprozess | lokal PO-beschlossen; extern offen |
| G1-06 | Technik/PO | Zugriffskontrollvertrag | Auth, Gerät, Sitzung und Rechte technisch getestet | technisch gesperrt |
| G1-07 | CRM-Administration | lokale SQLite-Snapshots/Restore, RPO/RTO, Rhythmus und Hauptverantwortung | Verschlüsselung, Speicherort, Vertretung und Ziel-Restore | lokal PO-beschlossen; Betriebsevidenz offen |
| G1-08 | CRM-Administration | synthetischer Preview-/Quarantäne-/Rollbacklauf | freigegebene reale Quelle | lokal belegt |
| G1-09 | Product Owner | synthetischer Incident-Trockenlauf, Erstablauf und Hauptkoordination | Vertretung, Erreichbarkeit, Rechtsfristen und realer Wiederanlauf | lokal PO-beschlossen; externe Fristen offen |
| G1-10 | Product Owner | vollständige Entscheidungsvorlage | ausdrücklicher datierter Beschluss | PO-gesperrt |

## Evidenzregeln

Ein UI-Häkchen ersetzt keinen externen Nachweis. „Lokal belegt“ gilt nur für Code, Vertrag und synthetischen Test. „Entscheidungsreif“ bedeutet, dass Entscheidungstext, Folgen und offene Nachweise klar sind. Extern oder technisch gesperrte Gates dürfen durch Kontrollläufe nicht hochgestuft werden. Jeder spätere Nachweis benötigt Datum, Verantwortlichen, Quelle, Prüfmethode und Ergebnis.

