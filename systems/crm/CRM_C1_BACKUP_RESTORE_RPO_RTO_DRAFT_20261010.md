# AMAVIO One CRM – C1 Backup-, Restore-, RPO- und RTO-Vertrag

**Stand:** 10.10.2026  
**Geltung:** ausschließlich synthetisches, nichtproduktives C1-Staging  
**Status:** Zielwerte beschlossen für die technische Planung; Wirksamkeitsnachweis erst im C1-Restore-Test

## Zielwerte

| Kennzahl | C1-Ziel | Begründung |
|---|---|---|
| RPO | maximal 24 Stunden | tägliche Providerbackups reichen für synthetisches Staging; kein produktiver Geschäftsbetrieb |
| Ziel-RTO | 8 Betriebsstunden | Neuaufbau/Restore innerhalb eines Arbeitstags; kein 24/7-Versprechen |
| Backup-Retention | mindestens 7 Tage | entspricht der am 10.10.2026 dokumentierten Pro-Plan-Basis |
| Migrations-Recovery | Neuaufbau aus versionierten Migrationen plus Seed ohne reale Daten | unabhängig vom Providerbackup testbar |
| Restore-Drill | einmal vor C1-Abnahme sowie nach grundlegender Schema-/Backupänderung | Backup ohne Wiederherstellungsnachweis gilt nicht als belastbar |

Diese Zielwerte sind nicht für Produktion, reale Kontaktdaten oder vertragliche Verfügbarkeit geeignet.

## Sicherungsumfang

- PostgreSQL-Schema und fachliche Tabellen;
- synthetische Seeds und deterministische Testdaten getrennt vom Datenbankbackup;
- versionierte Migrationen und Rollen-/RLS-Definitionen;
- minimierte Audit-Ereignisse;
- Konfigurationsinventar ohne Geheimniswerte;
- Auth-Konfigurationsbeschreibung und Wiederanlagerunbook, aber keine Klartextpasswörter oder TOTP-Seeds.

Supabase-Datenbankbackups sichern nach Providerdokumentation nicht die Inhalte des Storage API. Storage ist in C1 ohnehin deaktiviert.

## Wiederherstellungswege

### Weg A – reproduzierbarer Neuaufbau

1. leere lokale beziehungsweise freigegebene Testdatenbank bereitstellen;
2. Migrationen in definierter Reihenfolge ausführen;
3. Rollen und RLS anwenden;
4. synthetischen Seed laden;
5. Vertrags-, Autorisierungs- und E2E-Tests ausführen;
6. Hash/Version und Ergebnis dokumentieren.

Dieser Weg ist für C1 der primäre Nachweis für Portabilität und Schemaqualität.

### Weg B – Provider-Restore

1. Incident-/Testfreigabe und erwarteten Wiederherstellungspunkt dokumentieren;
2. aktuellen Stand und mögliche Verluste bestimmen;
3. Providerbackup auf kontrolliertem Ziel wiederherstellen;
4. Verbindung, Migrationstand, Rollen/RLS, Auth und Datenintegrität prüfen;
5. keine Anwendung freigeben, bevor Negativtests bestanden sind;
6. Start, Ende, tatsächliches RPO/RTO, Abweichungen und Freigabe protokollieren.

Ein Restore, der den einzigen aktiven Stand überschreibt, benötigt eine zweite Freigabe. Die Durchführung darf erst in C1 erfolgen.

## C1-Restore-Abnahmekriterien

- Wiederherstellung ist mit synthetischen Daten erfolgreich;
- Schema- und Migrationsversion stimmen;
- alle Objektbeziehungen und Auditketten sind konsistent;
- RLS und API-Autorisierung sind nach Restore unverändert wirksam;
- keine deaktivierten Dienste wurden durch Restore aktiviert;
- keine Geheimnisse erscheinen im Protokoll;
- RPO von 24 Stunden und Ziel-RTO von 8 Betriebsstunden werden eingehalten oder die Abweichung führt zu einer neuen Entscheidung;
- der Restore ist durch Technical Operator und QA/Security Reviewer bestätigt.

## PITR-Entscheidung

PITR ist für C1 ausdrücklich **nicht** vorgesehen. Die am 10.10.2026 dokumentierte Providerpreisangabe beginnt bei ungefähr 100 USD pro Monat für sieben Tage und verlangt mindestens Small Compute. Dieser Aufwand ist für das rein synthetische C1-Staging nicht verhältnismäßig. Vor realen Daten oder produktiver Nutzung muss RPO/RTO neu bewertet und PITR gesondert beschlossen werden.

## Offizielle Providerquellen

- [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups)
- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod)

## Nicht belegt

Es wurde kein Providerbackup erzeugt, kein Restore durchgeführt und kein RPO/RTO gemessen. Diese Evidenz kann erst nach dem gesonderten C1-Beschluss in der dann angelegten synthetischen Umgebung entstehen.

