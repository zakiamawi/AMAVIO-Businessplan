# Product-Owner-Entscheidungsmatrix – App, ACC und CRM

**Stand:** 10. Oktober 2026  
**Paket:** Cross-System Ownership & Contract Alignment  
**Auslegung:** Die Freigabe dieses lokalen Entwicklungspakets erlaubt Verträge, Tests und Dokumentation. Sie erlaubt keine Aktivierung eines produktiven oder externen Systems.

## Beschlossener Arbeitsrahmen

| ID | Entscheidung | Arbeitsbeschluss dieses Pakets | Produktive Wirkung |
|---|---|---|---|
| XS-001 | Produktschnitt | App, ACC und CRM bleiben drei eigenständige Produkte | keine |
| XS-002 | Code- und Oberflächengrenze | getrennte Codebasen, Rollen, Oberflächen und Releases | keine |
| XS-003 | Datenbankgrenze | keine gemeinsame Datenbank und kein direkter Cross-DB-Zugriff | keine |
| XS-004 | App-Rollen | Fachkraft, Wohnanbieter und lokaler Partner ausschließlich in der App | keine |
| XS-005 | ACC-Rollen | AMAVIO Operations und Arbeitgeberrollen ausschließlich im ACC | keine |
| XS-006 | CRM-Rollen | interne kommerzielle Rollen ausschließlich im CRM | keine |
| XS-007 | App↔CRM | direkter Weg verboten | keine |
| XS-008 | CRM→ACC | nur vorhandener lokaler Review-Marker; kein Payload und keine ACC-ID | keine |
| XS-009 | App↔ACC | fachliche Richtungen definiert; Transport geschlossen | keine |
| XS-010 | Objektverantwortung | genau ein führendes System je Objektklasse | keine |
| XS-011 | Referenzwirkung | Referenz überträgt weder Eigentum noch Zugriffsrecht | keine |
| XS-012 | Ausgangsdaten | ausschließlich synthetisch | keine |

## Noch zu treffende Product-Owner-Entscheidungen

| ID | Entscheidung | Empfohlener nächster Beschluss | Aktueller Status |
|---|---|---|---|
| XS-020 | Identity-Betriebsmodell | produktgetrennte Clients und Rollen; gemeinsamer Provider nur nach eigener Prüfung | **OFFEN – keine Aktivierung** |
| XS-021 | Organisationsadministration | Einladungs-, Verifikations-, Rollenwechsel- und Offboardingprozess je Produkt | **OFFEN** |
| XS-022 | MFA und Recovery | risikobasiertes MFA, Re-Authentifizierung, Recovery und Break-Glass | **OFFEN** |
| XS-023 | Cross-System-Referenzen | pseudonyme, zweckgebundene Referenzen mit Provenienz und Löschverhalten | **OFFEN** |
| XS-024 | Reale Daten | Verantwortlichkeit, Zweck, Rechtsgrundlage, Speicherort, Empfänger und Datenklassen | **GESPERRT** |
| XS-025 | Retention und Löschung | Fristen, Korrektur, Export, Backuplöschung und Betroffenenprozess | **GESPERRT** |
| XS-026 | App-/ACC-Envelope | gemeinsame Version, Korrelation, Idempotenz, Revision und Negativrechte | **ENTSCHEIDUNGSREIF, NICHT IMPLEMENTIERT IM ACC** |
| XS-027 | App-/ACC-Transport | API/Queue, Authentifizierung, Retry, Dead Letter, Reconciliation und Betrieb | **GESPERRT** |
| XS-028 | CRM-/ACC-Handoff | ACC-seitige Annahme, minimales Schema, Rücknahme und Audit | **GESPERRT** |
| XS-029 | produktive Security | Threat Model, Secret-/Key-Management, Penetrationstest und Incident-Prozess | **GESPERRT** |
| XS-030 | Deployment und Betrieb | Umgebungen, Hosting, Monitoring, Backup, Restore und Rollback | **GESPERRT** |

## Nicht zu vermischende Entscheidungen

- Die CRM-C0-Präferenz für Supabase ist keine App- oder ACC-Providerentscheidung.
- Die lokalen SQLite-Datenbanken der drei Prototypen sind keine gemeinsame Produktivdatenbank.
- ACC J.5 ist keine App-Schnittstelle, obwohl es einen Arbeitgeber-/Operations-Beitragsprozess besitzt.
- Ein CRM-Review-Marker ist kein technischer ACC-Handoff.
- Ein erfolgreicher lokaler Contract-Test ist keine Rechts-, Datenschutz-, Security- oder Deploymentfreigabe.

## Empfohlener nächster großer Umsetzungsblock

Als nächstes sollte kein viertes System und kein weiterer Parallelprototyp entstehen. Der nächste zusammenhängende Block ist:

> **Shared App–ACC Contract v1 – gemeinsamer Envelope und Consumer-driven Contract-Evidenz in beiden getrennten Codebasen**

Voraussetzung ist eine ausdrückliche Freigabe, auch den vorhandenen ACC-J.5-Arbeitsstrang anzupassen. Der Block umfasst dann in einem Durchgang:

1. gemeinsames versioniertes Nachrichtenschema;
2. Korrelations-, Idempotenz- und Revisionsregeln;
3. App→ACC-Consumer und ACC→App-Sender ausschließlich synthetisch;
4. Negativrechte und feldminimierte Projektionen;
5. Retry-, Replay-, Reconciliation- und Konfliktfälle;
6. Consumer-driven Tests in App und ACC;
7. ein gemeinsames Abschlussgate ohne Live-Daten, externe Wirkung oder Deployment.

Das CRM bleibt in diesem Block unverändert. Erst nach stabiler App-/ACC-Grenze wird entschieden, ob der vorhandene CRM-Handoffmarker überhaupt eine technische Fortsetzung benötigt.
