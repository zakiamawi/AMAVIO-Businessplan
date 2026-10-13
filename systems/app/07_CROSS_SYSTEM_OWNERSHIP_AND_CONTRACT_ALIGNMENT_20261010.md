# Cross-System Ownership & Contract Alignment

**Stand:** 10. Oktober 2026  
**Geltung:** AMAVIO One App, AMAVIO Arrival Control Center und AMAVIO One CRM  
**Reifegrad:** lokale synthetische Vertragsgrundlage; keine technische Integration und keine Produktivfreigabe

## 1. Entscheidung

AMAVIO arbeitet mit einer gemeinsamen Produktarchitektur, aber drei eigenständigen Systemen:

1. Die App führt die externe Rollenerfahrung.
2. Das ACC führt den operativen Arrival-Fall und die Arbeitgeber-/Operationsentscheidungen.
3. Das CRM führt kommerzielle Beziehungen, Chancen und vorbereitende Ansprache.

Kein System wird in einem anderen nachgebaut. Gemeinsam sind nur ausdrücklich versionierte Verträge, minimierte Referenzen und synthetische Testwahrheiten. Oberflächen, Rollenmodelle, Codebasen, Datenbanken und Release-Gates bleiben getrennt.

## 2. Verwendete tatsächliche Arbeitsstände

| Produkt | Geprüfter Stand | Ausschlaggebende vorhandene Quelle |
|---|---|---|
| App | `2.4.3-r2-contract-closure.1` | bestehende Identity-, Daten-, App-/ACC- und Readiness-Verträge |
| ACC | J.5 Dual-Sided Workflow | J.5-ADR, Rollenvertrag, Collaboration-Service und J.5-QA |
| CRM | R3.4 Founder Decision | kanonisches Domänenmodell, Berechtigungsentwurf, Product-Owner-Matrix und ACC-Handoff-Fachvertrag |

Die SHA-256-Werte der geprüften ACC-/CRM-Quellen stehen in `QA/CROSS_SYSTEM_SOURCE_AUDIT_20261010.json`. Weder ACC noch CRM wurden für dieses Paket verändert.

## 3. Führende Verantwortung

### App

Die App führt die externe Rollenführung für Fachkraft, Wohnanbieter und lokalen Partner, rollenminimierte Darstellungen, eigene Eingabe- und Angebotsentwürfe, strukturierte Rückfragen sowie verständliche externe Statusprojektionen. Sie führt keine Arbeitgeberentscheidung, interne Operationsentscheidung, Arrival-Auditspur oder CRM-Chance.

### ACC

Das ACC führt Mandat, Standort, Kohorte, Arrival Case, Risiken, Evidenz, operative Aufgaben, Freigaben, Arbeitgeberbeiträge, Arbeitgeber- und Operationsentscheidungen sowie den internen Auditkontext. Es führt weder das kommerzielle CRM-Journal noch externe App-Rollenkonten.

### CRM

Das CRM führt kommerzielle Organisationen, Kontakte, Leads, Opportunities, Aktivitäten, Recherche und Outreach-Entwürfe. Es führt keine Arrival Cases, App-Konten, Arbeitgeberentscheidungen oder kanonische Arrival-Auditspur.

## 4. Identität, Mandant und Rechte

| Produkt | Rollenraum | Aktueller technischer Zustand |
|---|---|---|
| App | Fachkraft, Wohnanbieter, lokaler Partner | lokaler synthetischer Rollenkontext |
| ACC | AMAVIO Operations sowie Sponsor, HR, Standort und Budget auf Arbeitgeberseite | lokale synthetische Sitzungen und serverseitige Rollenprüfung |
| CRM | CRM Admin, Commercial Owner/Editor, Operations Viewer, Privacy Reviewer | lokaler Single-Workspace ohne produktive Identität |

Ein gemeinsamer Identity Provider ist nicht beschlossen. Selbst wenn später derselbe Anbieter eingesetzt würde, benötigt jedes Produkt einen getrennten Client, getrennte Rollen, getrennte Audiences und getrennte Autorisierung. Eine Anmeldung in einem Produkt begründet keinen Zugriff auf ein anderes Produkt.

Ein CRM-Kontakt ist keine digitale Identität. Ein Arbeitgeberkontakt im CRM erhält dadurch weder eine ACC- noch eine App-Sitzung. Ebenso wird aus einer App-Rolle kein CRM-Benutzer.

## 5. System of Record

Jede Objektklasse hat genau ein führendes System. Andere Systeme dürfen nur eine minimierte Referenz oder abgeleitete Projektion besitzen, wenn ein eigener Vertrag dies zulässt.

| Objektgruppe | Führendes System | Zulässige andere Darstellung |
|---|---|---|
| Organisation, Kontakt, Lead, Chance, kommerzielle Aktivität | CRM | nur ausdrücklich freigegebene Referenz |
| Mandat, Standort, Kohorte, Arrival Case, Risiko, operative Aufgabe | ACC | rollenminimierte Referenz oder Projektion |
| Arbeitgeber-/Operationsentscheidung, interne Notiz, Arrival-Audit | ACC | nur erklärtes externes Ergebnis; interne Inhalte bleiben gesperrt |
| Fachkraft-, Wohnanbieter- und Partnerentwurf | App | validierte Übergabenachricht; kein gemeinsamer Datensatz |
| externe Rollenprojektion | App | aus freigegebenem Vertragsereignis abgeleitet |

Eine Projektion ist keine zweite kanonische Wahrheit. Sie enthält Quelle, Version und Zweck und wird nicht stillschweigend zurückgeschrieben.

## 6. Übergabeverträge

### App → ACC

Fachlich zulässig ist eine minimierte externe Einreichung zur menschlichen Prüfung. Die lokale App besitzt dafür einen Referenzvertrag. Ein ACC-Consumer existiert im aktuellen J.5-Stand nicht. Deshalb ist kein Transport erlaubt.

### ACC → App

Fachlich zulässig sind nur ein erklärter externer Status, nächste Verantwortung und erlaubte nächste Aktion. Interne Notizen, Budgets, Policies, Risiken anderer Personen und Auditdetails bleiben im ACC. Ein ACC→App-Sender existiert nicht.

### CRM → ACC

Der bestehende CRM-Vertrag erlaubt derzeit ausschließlich lokale, payloadfreie Review-Marker. Selbst bei einer gewonnenen Opportunity sind zwei fachliche Prüfmarker erforderlich. „Gewonnen“ bedeutet nicht „operativ startbereit“.

Eine spätere technische Übergabe dürfte erst nach ACC-seitiger Annahme eines versionierten Consumer-Vertrags entstehen. Im Default enthält sie keine Kontakt- oder Personendaten und erzeugt keinen Arrival Case automatisch.

### App ↔ CRM

Es gibt keinen zulässigen Direktweg. Ein App-Konto darf nicht aus einem CRM-Kontakt erzeugt werden, und App-Interaktionen dürfen nicht direkt als CRM-Aktivität synchronisiert werden. Ein späterer geschäftlicher Bedarf müsste zunächst seinen Zweck und die Zuständigkeit über ACC oder einen neuen, ausdrücklich freigegebenen Vertrag belegen.

## 7. ACC-J.5-Kompatibilität

J.5 verbessert die operative Grundlage deutlich: lokaler Arbeitgeber-/Operations-Beitragsprozess, persistente synthetische Beiträge, serverseitige Rollenprüfung, Idempotenz, Revisionslogik, rollenminimierte Projektion, Audit und Null-Außenwirkung sind beobachtet.

Für den App-Vertrag fehlen weiterhin fünf Fähigkeiten:

1. versionierter gemeinsamer Message-Envelope;
2. Korrelations-ID;
3. App→ACC-Consumer;
4. ACC→App-Sender;
5. appbezogenes Replay-/Reconciliation-Verhalten.

Darum lautet der Status weiterhin `NOT_COMPATIBLE_YET`. Der Befund ist kein Qualitätsurteil über J.5, sondern eine präzise Aussage: Der neue J.5-Collaboration-Prozess ist ein ACC-interner Arbeitgeberprozess und nicht die App-Schnittstelle.

## 8. Ausführbare Schutzregeln

`server/system-boundaries.mjs` und `tests/cross-system-contracts.test.js` prüfen lokal:

- nur drei eigenständige Produkte;
- überschneidungsfreie Rollenräume;
- keine gemeinsame Datenbank;
- genau ein führendes System je Objektklasse;
- direkte App-/CRM-Wege werden abgewiesen;
- App-/ACC-Richtungen sind nur Vertragsreferenzen mit geschlossenem Transport;
- CRM-/ACC-Handoff bleibt payloadfrei und ohne automatische Fallanlage;
- reale Daten werden an der Vertragsgrenze abgewiesen.

`GET /api/v1/system-boundaries` gibt ausschließlich den read-only Vertragsstatus aus. Der Endpunkt transportiert keine Produktdaten und verändert keinen Zustand.

## 9. Nicht entschieden

- Identity Provider, produktive Authentifizierung oder Sitzungsföderation;
- produktiver Speicher, reale Daten, Retention, Löschung und Rechtsgrundlage;
- Transporttechnologie zwischen App und ACC;
- technische CRM-/ACC-Integration;
- Provider, Hosting, Deployment oder Kosten;
- produktive KI, Matching, Scoring oder automatische Entscheidung;
- reale Rollentests oder Außenkommunikation.

Diese Punkte bleiben in der Product-Owner-Matrix als gesonderte Gates sichtbar.
