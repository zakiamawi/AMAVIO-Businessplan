# AMAVIO One CRM – R3.10 Local Operations Assurance

**Datum:** 13.10.2026  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Ziel

R3.10 schließt keine produktiven Gates. Der Block ergänzt die vorhandene G1-Prüfspur um eine tatsächlich ausführbare, aber vollständig isolierte Wiederherstellungsprobe und bereitet die noch offenen Product-Owner-Entscheidungen G1-01, G1-05, G1-07 und G1-09 als konkrete Vorschläge vor. Die in R3.9 geschärfte Informationsarchitektur bleibt erhalten; es entsteht kein neuer Workspace und keine zweite Sicherungsoberfläche.

## Erhalten

- Schema v7, Storage-Key, Migrationspfad und bestehender synthetischer SQLite-Zustand;
- getrennte Seitenzwecke für Arbeitstag, Cockpit, Pipeline, Auswertungen, Recherche & Outreach sowie System & Freigaben;
- alle CRUD-, Archiv-, Undo-, Such-, Filter-, Journal-, Growth- und G1-Funktionen;
- harte Grenzen `realDataEnabled=false`, `outboundEnabled=false`, `releaseEligible=false`;
- getrennte App-, CRM- und ACC-Codebasen ohne produktive Integration.

## Neu umgesetzt

1. `POST /api/assurance/restore-drill` führt einen Round-Trip des aktuellen synthetischen Zustands in einer ausschließlich temporären SQLite-In-Memory-Datenbank aus.
2. Schema, synthetischer Datenvertrag und SHA-256-Prüfsumme werden vor Rückmeldung geprüft.
3. Der produktiv wirkende lokale SQLite-Zustand wird weder ersetzt noch zurückgesetzt; die API bestätigt ausdrücklich `liveStateMutated=false`.
4. Ein bestandener Lauf wird als `restore_drill` in der vorhandenen G1-Kontrollspur und als Audit-Ereignis dokumentiert.
5. G1-07 bleibt auch nach bestandenem Lauf nur `decision_ready`, weil Geräteverschlüsselung, Sicherungsablage, RPO/RTO, Rotation und Verantwortlichkeit nicht durch einen lokalen Softwaretest bewiesen werden.
6. Die Ausführung ist im bestehenden Register „Prüfspur & Beschluss“ verortet und im Browser-Fallback deaktiviert.

## Bewusst nicht umgesetzt

- keine reale Datennutzung, kein Import realer Kontakte und keine Freigabe einer Datenquelle;
- keine Authentifizierung, technische Rollenprüfung, Mehrbenutzer- oder Mandantenfähigkeit;
- kein Versand, Massenversand, Live-Scraping oder Provider-Connector;
- keine Cloud-Sicherung, kein externer Dokumentenspeicher, kein Deployment;
- keine produktive KI und keine App-/ACC-Integration;
- keine automatische Löschung und kein produktiver Incident- oder Meldeprozess.

## Abschlussgrenze

R3.10 liefert lokale Betriebsevidenz, aber keine Betriebsfreigabe. G1 bleibt NO-GO. C1 bleibt gesperrt. Die Vorschläge für G1-01, G1-05, G1-07 und G1-09 werden erst durch einen ausdrücklichen, datierten Product-Owner-Beschluss verbindlich.
