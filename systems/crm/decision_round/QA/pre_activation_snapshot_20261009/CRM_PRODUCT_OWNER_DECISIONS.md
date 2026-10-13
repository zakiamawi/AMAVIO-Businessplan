# AMAVIO One CRM – Product-Owner-Entscheidungsmatrix

**Regel:** Offene Punkte werden nicht produktiv angenommen. Lokale synthetische Defaults dienen nur der Testbarkeit.

**Entscheidungsvorlage:** Die nicht operative, QA-geprüfte Entscheidungsrunde liegt unter `decision_round/README_START_HERE.md`. Diese Verknüpfung ändert keinen Status in der nachfolgenden Matrix.

| ID | Entscheidung | Aktueller lokaler Default | Gate / Auswirkung | Status |
|---|---|---|---|---|
| PO-CRM-001 | finale Pipeline und Eintrittskriterien | sechs vorhandene Phasen plus verlorener Ausgang | Vertrieb/PO | offen |
| PO-CRM-002 | Verantwortungs- und Teamrollen | synthetische Owner-Referenzen | Auth/Rollen/Security | offen |
| PO-CRM-003 | Pflichtfelder je Phase | minimale lokale Validierung | Vertrieb/PO | offen |
| PO-CRM-004 | Definition von Lead vs. Opportunity | Lead modelliert, UI geparkt | Prozessdesign | offen |
| PO-CRM-005 | Partner-Governance und Bearbeitungsrechte | Detailansicht, kein Partner-CRUD | Vertrag/Datenschutz | offen |
| PO-CRM-006 | Kontakt- und Einwilligungsstatus | `unknown`, keine Außenwirkung | Recht/Datenschutz | offen |
| PO-CRM-007 | Aufbewahrung und Löschung | reversible Archivierung, keine Löschung | Recht/Datenschutz | offen |
| PO-CRM-008 | produktive Datenbank | keine | Kosten/Architektur/Security | gesperrt |
| PO-CRM-009 | Authentifizierung und MFA | keine | Security/PO | gesperrt |
| PO-CRM-010 | Mandantenmodell | nicht vorgesehen/behauptet | Produktarchitektur | offen |
| PO-CRM-011 | Import bestehender Daten | keiner | Datenqualität/Datenschutz | gesperrt |
| PO-CRM-012 | E-Mail-/Kalenderanbieter | keiner | Integration/Datenschutz/Kosten | gesperrt |
| PO-CRM-013 | Dokumentenspeicher | Dokumentreferenz nur modelliert | Security/Datenschutz/Kosten | gesperrt |
| PO-CRM-014 | ACC-Handoff-Freigaberollen | nur lokaler Review-Marker | ACC/PO/Datenschutz | offen |
| PO-CRM-015 | App-Bezug | keiner | getrennte Produktentscheidung | gesperrt |
| PO-CRM-016 | produktive KI | keine | Kosten/Datenschutz/Qualität | gesperrt |
| PO-CRM-017 | Hosting/Deployment | keines | Security/Kosten/Release | gesperrt |
| PO-CRM-018 | EN-Sprachumfang | Struktur vorbereitbar, Oberfläche DE | Produkt/Content | offen |
| PO-CRM-019 | Forecast-Definition | kein Forecast-Versprechen | Finance/Vertrieb | offen |
| PO-CRM-020 | Exportrechte und Formate | kein Export | Datenschutz/Rollen | offen |
