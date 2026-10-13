# App–ACC Compatibility Audit

**Stand:** 10. Oktober 2026  
**Audit:** read-only, keine Änderung der ACC-Codebasis  
**ACC-Referenz:** J.5 Dual-Sided Workflow  
**Ergebnis:** **NOT_COMPATIBLE_YET**

## Beobachtete gemeinsame Grundlage

- ausschließlich synthetischer Betrieb: ja;
- externe Wirkung: ausgeschlossen;
- SQLite-Persistenz: belegt;
- Human Gate: belegt;
- Idempotenz: belegt;
- rollenbezogene Projektion: belegt;
- ACC-interner Arbeitgeber-/Operations-Beitragsprozess: belegt.

## Vertragsfähigkeiten

| Fähigkeit | ACC J.5 |
|---|---|
| `versioned_message_envelope` | missing |
| `correlation_id` | missing |
| `idempotency_key` | observed |
| `expected_revision` | observed |
| `app_to_acc_consumer` | missing |
| `acc_to_app_sender` | missing |
| `negative_rights_enforcement` | observed |
| `role_minimised_projection` | observed |
| `audit_trace` | observed |
| `replay_and_reconciliation_behavior` | missing |

## Harte Feststellung

Das ACC J.5 besitzt nun einen lokal persistierten, rollengetrennten Arbeitgeber-/Operations-Beitragsprozess mit Idempotenz, serverseitigen Rollenprüfungen und Null-Außenwirkung. Dieser Prozess ist jedoch ACC-intern: Das ACC deklariert den App-Schnittstellenvertrag `1.1.0-local-r2-foundation` weiterhin nicht. App-Inbound- und App-Outbox-Routen sind im geprüften ACC-Stand nicht vorhanden. Deshalb sind die Produkte **nicht live-kompatibel** und bleiben technisch unverbunden.

Fehlende Fähigkeiten: `versioned_message_envelope`, `correlation_id`, `app_to_acc_consumer`, `acc_to_app_sender`, `replay_and_reconciliation_behavior`.

## Nächste Freigabebedingung

Ein gemeinsamer Consumer-driven Contract-Test muss in beiden getrennten Codebasen denselben Envelope, dieselbe Objekt-/Statusübersetzung, Negativrechte, Replay-, Revisions- und Reconciliation-Fälle bestätigen. Erst danach darf ein Transportdesign entschieden werden.
