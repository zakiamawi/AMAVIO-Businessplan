# AMAVIO One CRM – Lokale Persistenz, Backup und Import

**Stand:** 10.10.2026  
**Reife:** lokal synthetisch geprüft

## Architektur

```text
Browser auf 127.0.0.1
        ↓ relative /api-Aufrufe
lokaler Node-Server auf 127.0.0.1
        ↓
SQLite-Datei unter local-data/
```

Der Server besitzt keine öffentliche Bindung, kein Benutzerkonto, keine Fernzugriffsfunktion und keine externe Abhängigkeit. Wenn er nicht läuft, arbeitet die UI transparent mit dem bisherigen Browser-Fallback.

## SQLite-Schema

- `schema_migrations`: angewendete Schemafassungen;
- `crm_state`: genau ein kanonischer synthetischer Zustand;
- `state_snapshots`: versionierte lokale Sicherungen vor Restore, Import und Reset sowie manuelle Sicherungen.

Die Fachobjekte bleiben im versionierten kanonischen JSON-Vertrag. Das vermeidet in R3.3 eine parallele zweite Geschäftslogik und erhält die geprüften Zustandsübergänge. Eine spätere relationale Aufteilung benötigt einen eigenen Migrationsvertrag.

## Migration

Unterstützt ist ausschließlich:

- R3.2/v4 synthetisch → R3.3/v5 synthetisch;
- R3.3/v5 synthetisch → R3.3/v5 synthetisch.

Andere oder nicht-synthetische Zustände werden abgewiesen. v1-, v2-, v3- und v4-Browserstände werden nicht überschrieben.

## Backup und Restore

Eine manuelle Sicherung schreibt:

1. einen versionierten SQLite-Snapshot;
2. einen JSON-Export unter `local-data/exports/`.

Vor Restore, Import und Reset wird automatisch ein Snapshot erstellt. Restore ersetzt den aktiven Zustand erst nach synthetischer Vertragsprüfung. Physische Löschung alter Snapshots ist in R3.3 nicht implementiert.

## Import

Der Import ist zweistufig:

1. Datei lokal lesen und Vertrags-/Schema-Vorschau erzeugen;
2. erst nach ausdrücklicher Nutzeraktion übernehmen.

R3.3 ist kein Real-Daten-Import. CSV, XLSX, Airtable, Apollo, Brevo, Gmail und andere Anbieter sind nicht angeschlossen.

## Offene Betriebsanforderungen vor realen Daten

- verschlüsseltes Benutzergerät und gesicherter macOS-Zugang;
- definierter Backup-Zielort außerhalb des Arbeitsordners;
- getestete Wiederherstellung auf einem getrennten Testpfad;
- Aufbewahrungs- und Löschfristen;
- Protokollierung administrativer Eingriffe;
- dokumentierter Notfallzugang;
- bei Netzwerkfreigabe zwingend Authentifizierung, TLS und Zugriffsbeschränkung.
