# AMAVIO One CRM – Lokaler Übergangsvertrag zu einer späteren C1-Supabase-Grundlage

**Datum:** 13.10.2026  
**Status:** Planungs- und Gate-Dokument; keine technische Aktivierung

## Zweck

Dieses Dokument hält fest, welche lokalen Verträge vor einer späteren C1-Grundlage erhalten bleiben müssen. Es autorisiert weder die Anlage eines Supabase-Projekts noch Login, Kauf, Schlüsselverwendung, Cloud-Synchronisierung oder Datenmigration.

## Aktueller technischer Wahrheitsstatus

| Ebene | Status |
|---|---|
| Lokale Node-API und SQLite-Core-Persistenz | lokal vorhanden und getestet |
| Getrennte lokale Import-Staging-Datenbank | lokal vorhanden, schreibgeschützt in Organisationen/Kontakte eingebunden |
| Supabase-Connector oder CLI | in R3.17 nicht aufgerufen und nicht geprüft |
| Supabase-Authentifizierung | nicht geprüft, nicht aktiviert |
| Supabase-Projekt/Region | nicht angelegt; Frankfurt bleibt Planungspräferenz, keine technische Tatsache |
| Zugangsdaten/API-Schlüssel | nicht gelesen, nicht geschrieben, nicht angefordert |
| Cloud-Schema/RLS | nur fachlich vorbereitet, nicht implementiert oder smoke-tested |
| Migration realer Daten | nicht autorisiert |

## Verträge, die C1 übernehmen muss

1. kanonische IDs und getrennte Objekttypen für Organisation, Kontakt, Chance, Aufgabe und Aktivität;
2. Organisation vor Kontakt und belastbare Beziehungsreferenzen;
3. unverlierbare externe IDs und nachvollziehbare Datenherkunft;
4. `Do_Not_Contact` als harte Sperre und `Outreach_Approved = FALSE` als Ausgangszustand;
5. kein Rückschluss von `consentStatus: unknown` auf eine Einwilligung;
6. sichere Archivierung, Änderungsverlauf und Audit-Ereignisse;
7. Importvorschau, Dublettenhinweis, Quarantäne und Rollback vor Mutation;
8. klare Trennung von CRM, App und ACC;
9. kein Browserzugriff auf privilegierte Datenbankrechte; serverseitige API-Grenze;
10. Nachweis von Backup, Restore, RPO/RTO und Exit vor Freigabe.

## C1-Entry-Gates vor jeder Aktivierung

- eindeutiger datierter Product-Owner-Beschluss zu Provider, Region, Budget und zulässigem synthetischem Umfang;
- benannter und akzeptierender Security Reviewer mit abgeschlossenem Review;
- externe Datenschutz-/Vertragsprüfung einschließlich DPA, Subprozessoren, Transfer und Löschung;
- bestätigte Vertretung sowie dokumentierter Betriebs- und Incident-Trockenlauf;
- aufgelöster Firewall-Nachweiswiderspruch und belastbarer Geräte-/Zugriffsschutz;
- getrennte Umgebungen, keine Selbstregistrierung, interne Einladung und TOTP-MFA;
- versioniertes Schema, Migrationen, restriktive RLS-Negativtests und Service-Role-Grenze;
- verschlüsselter Backup-/Restore-Nachweis mit kontrolliertem Rollback;
- ausdrücklich synthetischer C1-Testbestand;
- gesonderter Beschluss für jede reale Datenmigration.

## Reihenfolge nach Freigabe

1. leeres synthetisches C1-Projekt in der ausdrücklich bestätigten Region;
2. Authentifizierung und Rollenmodell ohne CRM-Daten;
3. Schema und RLS inklusive Negativtests;
4. synthetische Referenzdaten und Vertrags-/Integrationstests;
5. Backup-, Restore- und Exit-Probe;
6. dokumentierter Abnahmebeschluss;
7. erst danach getrennte Entscheidung über reale Daten.

## Rollback-Grundsatz

Bis zur gesonderten C1-Abnahme bleibt die lokale R3.17-Arbeitskopie Referenz und Rückfallpunkt. Ein späteres Staging darf lokale Daten nicht automatisch überschreiben. Jede Migration benötigt Vorschau, Zählabgleich, Prüfsummen, Fehlerliste, Wiederholbarkeit und einen dokumentierten Rückweg.

