# ADR-010 · Release M · Operational Execution Loop

**Datum:** 13.10.2026  
**Status:** lokal implementiert und technisch geprüft  
**Basis:** Release L.2 Operational Clarity (unveränderte Rückfallbasis)  
**Produkt:** AMAVIO Arrival Control Center, getrennt von Drei-Rollen-App und CRM

## Entscheidung

Release M ergänzt die freigegebene fünfstufige Fallreise um einen zusammenhängenden lokalen Ausführungszyklus:

1. AMAVIO Operations schließt einen fachlich zugeordneten Arbeitsauftrag ab.
2. Erst dadurch wird die abhängige Arbeitgeberübergabe freigegeben.
3. Ausschließlich die zugeordnete Arbeitgeberrolle kann diese Übergabe bestätigen oder als Rückfrage zurückgeben.
4. Nach bestätigter Übergabe wird die Auswirkungsprüfung für AMAVIO Operations freigegeben.
5. Erst nach deren Abschluss öffnet sich eine menschliche Entscheidungsvorlage.
6. Die dokumentierte Entscheidung erzeugt eine rein beratende, nicht angewendete Programmfolge.

Die Oberfläche erhält keinen neuen Haupttab und kein sichtbares KI-Modul. Der Ausführungszyklus sitzt innerhalb der bereits abgenommenen Stufen Verantwortung, Entscheidung und Ergebnis sowie in der vorhandenen Arbeitgeber- und Programmprojektion.

## Warum diese Entscheidung

Die bisherigen Releases enthielten belastbare Fachlogik, Evidenz, Simulation, Entscheidungen, Arbeitsprodukte, Arbeitgebermitwirkung und Programme. Ihre Verbindung war jedoch überwiegend erklärend. Release M macht daraus einen prüfbaren Zustandsautomaten: Ein Schritt wird erst ausführbar, wenn seine Abhängigkeit erfüllt ist; Rollen können nur die ihnen zugewiesene Handlung ausführen; die finale Wirkung bleibt hinter einem menschlichen Gate.

Damit steigt die Produkttiefe ohne neue Provider-, Hosting-, Authentifizierungs- oder Integrationskosten.

## Domänenmodell

Release M führt fünf tenantgebundene SQLite-Entitäten ein:

- `execution_plans`: verbindet synthetischen Fall und Ankunftsprogramm;
- `execution_work_orders`: versionierte Arbeitsaufträge mit Reihenfolge, Rolle, Frist und Abhängigkeit;
- `execution_handoffs`: bewusste Übergabe an genau eine Arbeitgeberrolle;
- `execution_decision_packages`: begründete menschliche Entscheidung mit Empfehlung und Alternative;
- `execution_program_impacts`: beratende Programmfolge ohne automatische Anwendung.

Der synthetische Referenzweg `SYN-EXEC-001` besteht aus vier Arbeitsaufträgen:

1. Wohnungsgrundlage fachlich klären — AMAVIO Operations;
2. Standortbestätigung einholen — Arbeitgeber Standort;
3. Auswirkung auf Arbeitsstart prüfen — AMAVIO Operations;
4. Fallentscheidung dokumentieren — AMAVIO Operations.

## Zustands- und Rollenvertrag

### Arbeitsaufträge

`blocked → ready → in_progress → completed`

Für die moderierte Demo ist auch der direkte, versionierte Abschluss `ready → completed` erlaubt. Ein Abschluss benötigt eine nachvollziehbare Notiz. Ein abgeschlossener Schritt schaltet höchstens seinen unmittelbar abhängigen Folgeschritt frei.

### Rollenübergabe

`waiting → open → acknowledged | returned`

Nur `employer_location` kann die Referenzübergabe bearbeiten. Eine Bestätigung schließt den zugehörigen Arbeitgeberauftrag und schaltet die lokale AMAVIO-Auswirkungsprüfung frei. Sponsor, HR und Budget erhalten dafür keine Schreibberechtigung.

### Entscheidung

`blocked → open → reviewed`

Nur AMAVIO Operations dokumentiert die abschließende lokale Fallentscheidung. Zulässig sind ausschließlich die in der Entscheidungsvorlage enthaltene Empfehlung oder Alternative. Version, Option und Begründung sind verpflichtend.

### Programmfolge

Die Programmfolge hat ausschließlich den Zustand `advisory`. Sie trägt immer:

- `advisoryOnly: true`;
- `applied: false`;
- `externalEffect: false`;
- `synthetic: true`.

Sie verändert keinen Programm-Workstream, keine Buchung, keine Nachricht und keinen externen Prozess.

## API-Vertrag

- `GET /api/execution/v1/cases/:caseId`
- `POST /api/execution/v1/work-orders/:id/transitions`
- `POST /api/execution/v1/handoffs/:id/respond`
- `POST /api/execution/v1/decision-packages/:id/review`
- `GET /api/execution/v1/programs/:programId/impacts`

Alle Mutationen laufen über den bestehenden persistenten Idempotenzvertrag. Ressourcen werden immer mit `tenant_id` aufgelöst. Versionskonflikte liefern `409`; Rollenverletzungen `403`; fremde Mandanten sehen `404`.

## Oberflächenvertrag

- Kein neuer Hauptnavigationspunkt.
- AMAVIO Operations sieht die vollständige Kette, kann aber keinen Arbeitgeberauftrag ausführen.
- Arbeitgeber Standort sieht genau die eigene Übergabe; interne Entscheidungsvorlage und Programmableitung bleiben verborgen.
- Bei aktiver Ausführungsübergabe tritt das allgemeine Beitragsformular zurück, damit keine doppelte Handlung konkurriert.
- Ergebnis und Programmfolge werden erst nach der dokumentierten menschlichen Entscheidung sichtbar.
- Desktop, Tablet und Mobil behalten die L.2-Typografie, Farben, Geometrie und progressive Offenlegung.

## Nicht enthalten

Nicht Gegenstand von Release M sind:

- produktive Identity, Registrierung oder Authentifizierung;
- produktive Mandantentrennung oder echte Personen-/Arbeitgeberdaten;
- externer KI-Provider oder Providerkosten;
- Backend- oder Datenbankbetrieb außerhalb des lokalen Demoservers;
- CRM-, HRIS-, App-, Datei-, Messaging- oder Buchungsintegration;
- automatische Entscheidung oder automatische Anwendung einer Programmfolge;
- Hosting, Deployment, Veröffentlichung oder externe Validierung.

## Sicherheits- und Produktinvarianten

- ausschließlich synthetische Testdaten;
- `providerCalls = 0`;
- `externalEffects = false`;
- keine automatische fachliche Entscheidung;
- jede Mutation idempotent, tenantgebunden und versionsgeschützt;
- L.2 bleibt unverändert als freigegebene Rückfallbasis;
- Drei-Rollen-App und CRM bleiben getrennte Produkte.

## Konsequenz

Release M ist ein lokaler, ausführbarer Produktbeweis für geschlossene operative Fallsteuerung. Es ist keine produktive Architektur- oder Betriebsfreigabe. Der nächste fachliche Schritt darf erst nach Founder-Abnahme dieser Arbeitskopie geplant werden.
