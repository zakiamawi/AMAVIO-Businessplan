# AMAVIO Operations Twin – Systemdesign V1

**Stand:** 08.10.2026  
**Datenmodus:** ausschließlich synthetisch und lokal

## Produktvertrag

Der Operations Twin beantwortet vier operative Fragen in einer Oberfläche:

1. Welches Ereignis verändert die Ankunftslage?
2. Welche Fälle, Belege und Meilensteine sind betroffen?
3. Welche Rolle muss was bis wann klären?
4. Welcher Arbeitsplan kann nach menschlicher Prüfung als beratende Grundlage dienen?

## Komponenten

### Event Layer

Typisierte Ereignisse (`evidence_conflict`, `location_gap`, `arrival_shift`, `review_overdue`, `budget_decision`) referenzieren Fälle und Belege. Sie verändern keinen Fall automatisch.

### Dependency Layer

Die bestehenden Fallmeilensteine werden kohortenweit als kritische Pfade projiziert. Status, Frist und harte Abhängigkeit stammen aus der kanonischen Fallakte.

### Handoff Layer

Offene Aufgaben werden auf AMAVIO Operations, Sponsor, HR, Standort und Budget verdichtet. Die Matrix zeigt Verantwortung; sie ersetzt keine produktive Rechteverwaltung.

### Planning Layer

Ein Ereignis wird über ein deterministisches Playbook in einen versionierten Arbeitsplan übersetzt. Jeder Schritt hat Verantwortung, Aktion, Frist und `humanGate: true`.

### Simulation Layer

Eine Terminverschiebung erzeugt eine isolierte Kohortenvariante. Ergebnisfelder benennen betroffene Fälle, kritische Meilensteine, Rollenübergaben und Budgetprüfungen. Der produktive Zustand wird nicht mutiert.

## Sicherheits- und Wirkungsgrenzen

- Tenant-ID wird in jeder Lese- und Schreibabfrage erzwungen.
- Arbeitgeberrollen werden vor der Twin-Domäne serverseitig abgewiesen.
- Mutationen verlangen persistente Idempotency Keys.
- Human-Gate-Review nutzt eine Versionsprüfung gegen parallele Entscheidungen.
- Alle Resultate sind `advisory_only` beziehungsweise `preview` und `externalEffect: false`.
- Es existiert kein externer Netzwerkpfad und kein aktivierter AI Provider.

## Spätere Erweiterbarkeit

Provider-Adapter dürfen später ausschließlich strukturierte Vorschläge für definierte Capabilities liefern. Policy Engine, Tenant-Bindung, Evidence Graph, Evaluation und Human Gate bleiben AMAVIO-eigene Kontrollschichten. Der Provider darf weder Arbeitszustände direkt verändern noch Außenwirkung auslösen.
