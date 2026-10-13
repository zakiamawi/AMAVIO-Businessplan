# AMAVIO One CRM – Vertrag für lokales Echtdaten-Staging R3.15

**Version:** `amavio-real-data-staging-r3.15-v1`  
**Datum:** 13.10.2026  
**Geltung:** ausschließlich datierte lokale R3.15-Arbeitskopie

## 1. Systemgrenze

Das Echtdaten-Staging ist eine eigenständige lokale Datenzone. Es ist weder der synthetische CRM-Core noch ein produktives CRM-Backend. Es besitzt keine schreibende Browserfunktion, keinen Versandadapter und keine Cloudverbindung.

```text
Excel-Arbeitsmappen (read-only)
        │ kontrollierter lokaler Import
        ▼
separate SQLite-Staging-Datei
        │ GET-only über 127.0.0.1
        ▼
Altdaten-Staging-Oberfläche

Kein Pfad zu Versand, Supabase, App, ACC oder externen Connectoren
```

## 2. Kanonische Staging-Objekte

| Objekt | ID-/Schlüsselregel | Zweck | Änderungsregel |
|---|---|---|---|
| `pool_organization` | stabile externe Organisations-ID | großer bereinigter Organisationspool | Upsert nur durch kontrollierten Import |
| `pool_contact` | stabile Quellkontakt-ID | großer Kontaktkandidatenpool | Upsert nur durch kontrollierten Import |
| `organization` | externe ID aus bestätigter Importvorbereitung | bestätigter Organisationsteilbestand | Organisation vor Kontakt/Beziehung |
| `contact` | deduplizierte Kontakt-ID | bestätigt aktueller Kontakt | keine Vervielfachung wegen Mehrfachzuordnung |
| `contact_organization_relationship` | deterministische Beziehungs-ID | n:m-Zuordnung | Quelle und Zuordnungsreferenz bleiben erhalten |
| `review_queue_item` | deterministische Prüf-ID | Aktualität/Status differenzieren | keine automatische Hochstufung |
| `quarantine_item` | deterministische Quarantäne-ID | unklare/konfliktäre Zeile isolieren | keine stille Übernahme |
| `duplicate_signal` | deterministische Signal-ID | mögliche Dublette zeigen | keine automatische Zusammenführung |
| `suppression_entry` | Entität plus Sperrgrund | Außenwirkung verhindern | strengstes Signal gewinnt |
| `provenance` | Entität plus Quelle/Zeile | Herkunft nachweisen | unverändert aus Quelle ableiten |
| `import_batch` | deterministischer Batch-Schlüssel | Lauf, Hashes und Idempotenz dokumentieren | wiederholter Lauf aktualisiert denselben Batch |

## 3. Reihenfolge und Referenzauflösung

1. Quellen registrieren und Hashes prüfen.
2. Organisationspool anlegen/abgleichen.
3. Kontaktpool anlegen/abgleichen.
4. Bestätigte Organisationen anlegen/abgleichen.
5. Bestätigte Kontakte anhand der deduplizierten Kontakt-ID anlegen/abgleichen.
6. Quellzuordnungen über `Source_Contact_IDs` zur deduplizierten Kontakt-ID auflösen.
7. Beziehungen anlegen; Mehrfachgruppen als n:m-Beziehungen erhalten.
8. Provenienz, Prüfqueue, Quarantäne, Dublettensignale und Sperrregister schreiben.
9. Invarianten prüfen; bei Fehler vollständiges Transaktions-Rollback.

## 4. Harte Invarianten

- Organisationen existieren vor verweisenden Beziehungen.
- Jede Beziehung verweist auf genau eine vorhandene Organisation und einen vorhandenen Kontakt.
- Alle 238 bestätigten Zuordnungen müssen auflösbar sein.
- 31 Mehrfachgruppen und 103 zugehörige Beziehungszeilen bleiben erhalten.
- 48 eindeutige Kontakte mit Namensprüfung bleiben markiert.
- Kein Quarantäne- oder Dublettensignal wird still verworfen.
- Für alle realen Kontakte gilt `do_not_contact = 1`.
- Für alle realen Kontakte gilt `outreach_approved = 0`.
- `consent_status = unknown` erzeugt niemals eine Einwilligung oder Versandfreigabe.
- `blocked` und `withdrawn` dürfen nicht zu `unknown` abgeschwächt werden.
- zweiter identischer Lauf erzeugt null neue Fachdatensätze.
- `outboundEnabled`, `cloudSyncEnabled`, `supabaseEnabled`, `appIntegrationEnabled` und `accIntegrationEnabled` bleiben `false`.

## 5. Sichtbarkeit und Rechte

R3.15 ist eine lokale Einzelplatzansicht für den Product Owner. Die Browseroberfläche besitzt ausschließlich GET-Endpunkte. Änderungen erfolgen nicht interaktiv, sondern nur über den kontrollierten Importer mit Dry-Run, Snapshot und Transaktion. Es gibt keine Authentifizierung; deshalb ist die Datenzone nicht für Netzfreigabe, Mehrbenutzerbetrieb oder öffentliches Hosting geeignet.

## 6. Archivierung, Löschung und Reset

- Der synthetische Demo-Reset verändert die Staging-Datenbank nicht.
- R3.15 implementiert keine physische Einzelobjektlöschung.
- Korrekturen werden in einer neuen kontrollierten Quelle beziehungsweise Importversion nachvollziehbar vorgenommen.
- Snapshots werden vor einem schreibenden Import lokal erzeugt.
- Rechtliche Löschung, Betroffenenanfrage und Aufbewahrungsentscheidung bleiben ein separates Verfahren und dürfen nicht durch UI-Ausblendung ersetzt werden.

## 7. Freigabezustand

Die Daten sind lokal sichtbar und fachlich strukturiert. Sie sind nicht produktiv aktiviert, nicht kontaktfreigegeben, nicht rechtsgeprüft und nicht mit Supabase oder einem anderen System synchronisiert. Eine spätere Core-Übernahme benötigt einen neuen Product-Owner-Beschluss und die einschlägigen G1-/Rechts-/Datenschutz-/Security-Nachweise.

