# AMAVIO One CRM – Kanonisches Domänenmodell

**Version:** Draft 0.2 · 09.10.2026  
**Geltung:** lokaler synthetischer CRM-Core; keine produktive Datenbankfestlegung

## Gemeinsame Konventionen

Jedes Objekt besitzt eine stabile lokale ID mit Typpräfix, `createdAt`, `updatedAt`, `archivedAt`, `dataSourceId`, `qualityStatus` und `synthetic: true`. IDs sind innerhalb des lokalen Zustands eindeutig, aber noch keine produktiven Primärschlüssel. Archivierung ist reversibel; physische Löschung ist im Core nicht vorgesehen. Änderungen an geschäftskritischen Objekten erzeugen ein Audit-Ereignis.

Qualitätsstatus: `synthetic`, `unverified`, `reviewed`, `confirmed`. Im aktuellen Paket ist nur `synthetic` zulässig. Sichtbarkeit und Bearbeitungsrechte sind Metadaten beziehungsweise Draft-Vertrag; ohne Authentifizierung werden sie nicht als Sicherheit behauptet.

## Kanonische Objekte

### 1. Organisation / Account (`org-`)

- **Zweck:** Arbeitgeber- oder Interessentenorganisation als eigenständiger Beziehungsknoten.
- **Pflicht:** `id`, `displayName`, `sector`, `region`, `ownerId`, `status`.
- **Optional:** `legalName`, `website`, `phone`, `address`, `employeeBand`, `notes`.
- **Beziehungen:** Kontakte, Leads, Chancen, Aufgaben, Aktivitäten, Angebote.
- **Status:** `active`, `on_hold`, `archived`.
- **Rechte:** Draft `crm_admin`/`commercial_owner` schreiben; `operations_viewer` lesen.
- **Lebenszyklus:** anlegen → aktiv bearbeiten → optional on hold → archivieren → wiederherstellen.

### 2. Kontakt (`con-`)

- **Zweck:** natürliche Person im kommerziellen Beziehungskontext.
- **Pflicht:** `firstName`, `lastName`, `organizationId`, `ownerId`, `contactStatus`.
- **Optional:** `role`, `email`, `phone`, `preferredChannel`, `consentStatus`, `notes`.
- **Beziehungen:** Organisation, Chancen als Beteiligter/Hauptkontakt, Aufgaben, Aktivitäten, Gespräche, Termine.
- **Status:** `active`, `do_not_contact`, `archived`.
- **Rechte:** Kontaktfelder und Kommunikationsstatus getrennt zu berechtigen; produktiv offen.
- **Lebenszyklus:** anlegen → prüfen → aktiv/Do-not-contact → archivieren/wiederherstellen; produktive Löschlogik Gate.

### 3. Partnerorganisation (`par-`)

- **Zweck:** potenzielle oder bestätigte Beziehungs-/Leistungsquelle, getrennt vom Arbeitgeber-Account.
- **Pflicht:** `displayName`, `category`, `relationshipStatus`, `ownerId`.
- **Optional:** `nextAction`, `scopeNote`, `contractStatus`.
- **Beziehungen:** Partnerkontakte, Chancenquelle, Aktivitäten.
- **Status:** `prospect`, `qualified`, `active`, `paused`, `archived`.
- **Core-Reife:** Detaildarstellung; Bearbeitung geparkt bis Partner-Governance entschieden ist.

### 4. Partnerkontakt (`pcon-`)

- **Zweck:** Ansprechpartner innerhalb einer Partnerorganisation.
- **Pflicht:** Name, `partnerOrganizationId`, `contactStatus`.
- **Optional:** Rolle, E-Mail, Telefon.
- **Lebenszyklus/Rechte:** wie Kontakt, aber separate Objektklasse; keine Vermischung.

### 5. Lead / qualifizierter Geschäftskontakt (`lead-`)

- **Zweck:** frühes Signal vor einer Opportunity.
- **Pflicht:** Titel, Organisation oder Organisationshinweis, Owner, Status, Quelle.
- **Status:** `new`, `reviewing`, `qualified`, `disqualified`, `converted`, `archived`.
- **Übergang:** Konvertierung erzeugt referenziert eine Opportunity; im Core fachlich modelliert, UI geparkt.

### 6. Chance / Opportunity (`opp-`)

- **Zweck:** konkreter kommerzieller Bedarf mit steuerbarem nächsten Schritt.
- **Pflicht:** `organizationId`, `title`, `pipelineId`, `stageId`, `ownerId`, `nextAction`, `nextActionDue`.
- **Optional:** `primaryContactId`, `participantContactIds`, `potential`, `priority`, `sourceId`, `note`, `lossReason`.
- **Beziehungen:** Organisation, Kontakte, Aufgaben, Aktivitäten, Angebote, Entscheidungen, Übergabereferenz.
- **Status:** `active`, `on_hold`, `won`, `lost`, `archived`.
- **Lebenszyklus:** zulässige Phasen gemäß Statusvertrag; jede Änderung wird historisiert.

### 7. Pipeline / Pipelinephase (`pipe-`, `stage-`)

- **Zweck:** geordneter, fachlich definierter Verkaufsprozess.
- **Pflicht Pipeline:** Name, Version, aktive Phasen.
- **Pflicht Phase:** Code, Name, Reihenfolge, Eintritts-/Austrittskriterien.
- **Core-Pipeline:** Erstkontakt → Qualifiziert → Scoping → Angebot → Entscheidung → Gewonnen; `Verloren` als terminaler Ausgang außerhalb der Erfolgsrail.

### 8. Aufgabe (`task-`)

- **Zweck:** konkrete, verantwortete nächste Arbeit.
- **Pflicht:** Titel, Owner, Fälligkeit, Status, mindestens eine Objektbeziehung.
- **Optional:** Priorität, Beschreibung, `opportunityId`, `organizationId`, `contactId`.
- **Status:** `open`, `in_progress`, `completed`, `archived`.
- **Lebenszyklus:** anlegen → bearbeiten → in Arbeit/erledigt → archivieren/wiederherstellen.

### 9. Aktivität (`act-`)

- **Zweck:** append-only fachliche Timeline.
- **Pflicht:** Typ, Datum, Zusammenfassung, Verfasser, Objektbezug.
- **Typen:** `call`, `email_note`, `meeting_note`, `internal_note`, `stage_change`, `task_event`, `system_event`.
- **Regel:** keine externe E-Mail-Aussage; `email_note` dokumentiert nur eine synthetische Aktivität.

### 10. Gespräch (`conv-`)

- **Zweck:** strukturierter Gesprächsdatensatz, nicht Audio/Transkript.
- **Pflicht:** Datum, Typ, Teilnehmerreferenzen, Ergebnis.
- **Optional:** Agenda, nächste Schritte.
- **Core-Reife:** modelliert, über Aktivität repräsentiert; eigenständige UI geparkt.

### 11. Termin (`appt-`)

- **Zweck:** geplanter interner oder externer Termin.
- **Pflicht:** Beginn, Titel, Owner, Objektbezug.
- **Optional:** Ende, Ort, Teilnehmer, Status.
- **Status:** `planned`, `completed`, `cancelled`.
- **Gate:** keine Kalendersynchronisation.

### 12. Notiz (`note-`)

- **Zweck:** versionierbare interne Notiz mit Objektbezug.
- **Pflicht:** Text, Verfasser, Objektbezug.
- **Core-Reife:** Modell definiert; Opportunity-Arbeitsnotiz plus Timeline im UI.

### 13. Dokumentreferenz (`docref-`)

- **Zweck:** Metadatenreferenz auf ein Dokument, nicht der produktive Speicher.
- **Pflicht:** Titel, Typ, Objektbezug, Status.
- **Gate:** Dokumentenspeicher, Upload, Rechte und Aufbewahrung offen.

### 14. Angebot (`quote-`)

- **Zweck:** versionierter Angebotsstand.
- **Pflicht:** Opportunity, Version, Status, Währung.
- **Optional:** Betrag, Leistungsumfang, Gültigkeit.
- **Status:** `draft`, `review`, `approved`, `sent_marker`, `accepted`, `rejected`, `archived`.
- **Gate:** kein Versand und keine produktive Preisfreigabe.

### 15. Entscheidung (`dec-`)

- **Zweck:** dokumentierte fachliche oder kommerzielle Entscheidung.
- **Pflicht:** Gegenstand, Status, Entscheiderrolle, Datum, Objektbezug.
- **Status:** `open`, `approved`, `rejected`, `deferred`.

### 16. Wiedervorlage (`follow-`)

- **Zweck:** zeitgebundener Rückkehrpunkt ohne externe Automation.
- **Pflicht:** Datum, Owner, Grund, Objektbezug.
- **Status:** `open`, `done`, `cancelled`.

### 17. Verantwortlicher (`usr-`)

- **Zweck:** lokale synthetische Verantwortungsreferenz.
- **Pflicht:** Anzeigename, Kürzel, Rollenreferenzen, aktiv.
- **Gate:** kein Login, keine Identitätsprüfung.

### 18. Team / Rolle (`team-`, `role-`)

- **Zweck:** Entwurf für Zuständigkeit und spätere Berechtigungen.
- **Rollen-Draft:** `crm_admin`, `commercial_owner`, `commercial_editor`, `operations_viewer`, `privacy_reviewer`.
- **Gate:** produktive Durchsetzung erst mit Authentifizierung.

### 19. Einwilligungs- und Kontaktstatus (`consent-`)

- **Zweck:** Kommunikations- und Rechtsgrundlagenstatus getrennt von Beziehungspflege.
- **Pflicht produktiv:** Zweck, Status, Quelle, Zeitpunkt, Nachweisreferenz.
- **Status-Draft:** `unknown`, `not_required_review`, `documented`, `withdrawn`, `blocked`.
- **Gate:** keine rechtliche Annahme im Prototyp; Standard `unknown`.

### 20. Datenherkunft (`source-`)

- **Zweck:** Quelle, Erfassungsart und Qualitätskontext.
- **Core-Quellen:** synthetischer Seed, lokale manuelle Eingabe, Partnerhinweis-Demo.
- **Pflicht:** Typ, Label, Erfassungszeit, Qualitätsstatus.

### 21. Archivierungsstatus

- **Zweck:** gemeinsame reversible Stilllegung.
- **Felder:** `archivedAt`, `archivedBy`, `archiveReason`.
- **Regel:** archivierte Objekte sind standardmäßig ausgeblendet, bleiben referenziell erhalten und können lokal wiederhergestellt werden.

### 22. ACC-Übergabereferenz (`handoff-`)

- **Zweck:** kontrollierter lokaler Hinweis auf eine mögliche spätere Übergabe.
- **Pflicht:** Opportunity, Status, Vertragsversion, Prüffelder.
- **Status:** `not_eligible`, `draft`, `review_required`, `approved_marker`, `cancelled`.
- **Regel:** keine Fallanlage, kein Versand, keine ACC-ID und keine produktive Integration.

### 23. Audit-Ereignis (`audit-`)

- **Zweck:** nachvollziehbare lokale Änderungshistorie.
- **Pflicht:** Zeitpunkt, Akteur-Referenz, Aktion, Objekttyp, Objekt-ID, Kurzbeschreibung.
- **Optional:** Feldänderungen als `before`/`after` ohne Geheimnisse.
- **Regel:** append-only im lokalen Zustand; kein manipulationssicheres Audit-Log behaupten.

## Vollständiger Objektvertrag

Die folgenden Angaben ergänzen die Zweck- und Felddefinitionen oben. **Gemeinsame Pflichtfelder jedes persistenten Objekts** sind kanonische `id`, `synthetic`, `qualityStatus`, `dataSourceId`, `createdAt`, `updatedAt` und `archivedAt`, soweit die Zeile keine bewusst unveränderliche Konfiguration oder ein append-only Ereignis bezeichnet. **Gemeinsame optionale Felder** sind `archivedBy`, `archiveReason` und objektbezogene interne Hinweise. Standard-Sichtbarkeit ist `commercial_internal`; Kontakt-, Consent- und Auditfelder werden gemäß Berechtigungsdraft enger klassifiziert. Im aktuellen Prototyp sind Rechte nur Vertragstext, keine technische Zugriffskontrolle.

| Nr. / Objekt | Beziehungen | Status und erlaubte Übergänge | Sichtbarkeit / Bearbeitung | Archivierung, Verlauf, Herkunft und Qualität |
|---|---|---|---|---|
| 1 Organisation | Kontakt, Lead, Chance, Aufgabe, Aktivität, Angebot | `active ↔ on_hold`; separat archivieren/wiederherstellen | CRM Admin/Commercial Owner bearbeiten; Viewer lesen | keine Kaskadenlöschung; alle Mutationen Audit; `source-*`, aktuell nur `synthetic` |
| 2 Kontakt | genau eine Organisation; Chancen, Aufgaben, Aktivitäten, Gespräche, Termine | `active ↔ do_not_contact`; separat archivieren/wiederherstellen | `restricted_contact`; Kontakt- und Kommunikationsrechte später getrennt | keine produktive Löschung; Audit; reale Herkunft/Qualität gesperrt |
| 3 Partnerorganisation | Partnerkontakte, Chancenquelle, Aktivitäten | `prospect → qualified → active`; `active ↔ paused`; archivieren/wiederherstellen | lesen im Core; Bearbeitung bis PO-CRM-005 geparkt | keine Kaskade; Änderungen später Audit; synthetischer Seed |
| 4 Partnerkontakt | genau eine Partnerorganisation | `active ↔ do_not_contact`; Archivvertrag wie Kontakt | `restricted_contact`; Bearbeitung geparkt | getrennt vom normalen Kontakt; keine Löschung; synthetisch |
| 5 Lead | Organisation/-hinweis, Owner, Quelle; Konvertierungsreferenz zu Chance | `new → reviewing → qualified/disqualified`; `qualified → converted`; archivieren | Commercial Rollen; UI geparkt | Konvertierung löscht nicht; Verlauf/Audit verpflichtend; aktuell leere synthetische Collection |
| 6 Chance | Organisation, Beteiligte, Pipeline/Phase, Aufgaben, Aktivitäten, Angebote, Entscheidungen, Handoff | gemäß `CRM_STATUS_AND_TRANSITION_CONTRACT.md`; Archiv separat | Commercial Rollen schreiben; Handoff-Sicht gesondert | Phasenwechsel erzeugt Aktivität plus Audit; keine physische Löschung; synthetisch |
| 7 Pipeline/Phase | Chancen; versionierte geordnete Phasen | Pipelineversion unveränderlich; Aktivierung/Stilllegung später PO-Gate; Phasenübergänge separat vertraglich | Konfiguration nur CRM Admin nach PO-Freigabe | Konfiguration nicht im UI archiviert; Versionierung statt Überschreiben; synthetische v1-Pipeline |
| 8 Aufgabe | mindestens Organisation, Kontakt oder Chance; Owner | `open ↔ in_progress`, `open/in_progress → completed`, `completed → open/in_progress`; archivieren | Commercial Rollen; zugewiesene Owner-Sicht später | Status und Bearbeitung Audit; keine Löschung; synthetisch |
| 9 Aktivität | mindestens ein CRM-Objekt; Verfasser | append-only; Korrektur nur über späteres Gegenereignis; Archivierung im UI nicht angeboten | interne Timeline; `restricted_contact` falls Personenbezug | Inhalt nicht still überschreiben; System-/manuelle Quelle; synthetisch |
| 10 Gespräch | Kontakte, Organisation, Chance, Aktivitäten | `planned → held/cancelled`; fachlicher Ergebnisstatus später | interne kommerzielle Sicht; eigenständige Bearbeitung geparkt | keine Audio-/Transkriptdaten; Audit; aktuell leer/synthetisch |
| 11 Termin | Objektbezug, Owner, Teilnehmer | `planned → completed/cancelled`; Rücksetzung nur mit Audit | intern; Kalenderrechte nicht vorweggenommen | keine Kalenderkopie/-synchronisation; lokale Referenz, synthetisch |
| 12 Notiz | Objektbezug, Verfasser | `draft → final`; Korrektur als neue Version; UI-CRUD geparkt | intern; sensible Klassen später | Versionieren statt still überschreiben; keine Löschung im Core; aktuell leer/synthetisch |
| 13 Dokumentreferenz | CRM-Objekt und späterer Speicherverweis | `draft → reviewed → approved/obsolete`; keine Upload-Transition | Metadaten nach Rollen; Speicherzugriff nicht vorhanden | Referenz archivieren, Datei nicht verwalten; aktuell leer/synthetisch |
| 14 Angebot | genau eine Chance; Version, Freigaben | `draft → review → approved → sent_marker → accepted/rejected`; archivieren | Commercial Owner/Admin; Versand gesperrt | jede Version separat; keine externe Zustellung; aktuell leer/synthetisch |
| 15 Entscheidung | Objektbezug, Entscheiderrolle | `open → approved/rejected/deferred`; `deferred → open` | intern; Freigaberollen offen | append-only Ergebnis plus Audit; keine Löschung; aktuell leer/synthetisch |
| 16 Wiedervorlage | Objektbezug, Owner | `open → done/cancelled`; `cancelled → open` nur mit Audit | intern/zugewiesen | keine externe Erinnerung; archivieren nach Fristentscheidung; aktuell leer/synthetisch |
| 17 Verantwortlicher | Team/Rollen und zugewiesene Objekte | `active ↔ inactive` erst nach Auth-Gate | im Core sichtbare synthetische Referenz; keine Identitätssicherheit | nicht löschen, solange referenziert; Herkunft lokaler Seed |
| 18 Team/Rolle | Nutzer, Sichtbarkeits- und Bearbeitungsvertrag | `draft → approved → retired` erst nach PO/Security-Gate | Vertrag, nicht technisch erzwungen | versionieren; keine produktive Rollenannahme; synthetisch |
| 19 Consent/Kontaktstatus | Kontakt, Zweck, Quelle/Nachweis | `unknown → documented/not_required_review/blocked`; `documented → withdrawn/blocked` | `restricted_contact`, Privacy Reviewer; im Core nur Statusfeld | nie Einwilligungsbeweis aus UI ableiten; keine Löschung ohne Rechtskonzept; synthetisch |
| 20 Datenherkunft | alle persistenten Objekte | `synthetic`; spätere Qualitätsfolge `unverified → reviewed → confirmed` nur nach Gate | Provenienz sichtbar; Änderung nur prüfbar | Quellreferenz bleibt erhalten; kein Überschreiben ohne Audit |
| 21 Archivierungsstatus | jedes archivierbare Objekt | aktiv → archiviert → wiederhergestellt | gleiche Objektklasse; Archivfilter erforderlich | reversible Stilllegung, keine Löschung und keine Kaskade; Audit mit Grund/Zeit/Akteur |
| 22 ACC-Handoff-Referenz | gewonnene Chance, Organisation, spätere Freigaben | `not_eligible/draft → review_required → approved_marker/cancelled`; kein Sendestatus | `handoff_review`; keine technische ACC-Berechtigung | Marker versionieren; keine ACC-ID oder Übertragung; synthetisch |
| 23 Audit-Ereignis | Akteur- und Objekt-Referenz | append-only; keine Statusmutation | `system_audit`; im Prototyp lokal einsehbar über Timeline-Kontext, kein Admin-Log-UI | nicht archivieren/löschen im Core; vor/nach optional; lokale manuelle/Systemquelle, synthetisch |

## Integritätsregeln

1. Eine aktive Opportunity referenziert genau eine aktive oder archivierte Organisation.
2. Ein Kontakt referenziert genau eine Organisation; organisationslose Kontakte sind im Core nicht zulässig.
3. Haupt- und Beteiligtenkontakte einer Opportunity müssen zur gleichen Organisation gehören, sofern keine dokumentierte Ausnahme existiert.
4. Eine Aufgabe benötigt mindestens einen gültigen Objektbezug.
5. Archivierung löst keine Kaskadenlöschung aus.
6. Phasenänderungen müssen dem Statusvertrag entsprechen und erzeugen Aktivität plus Audit-Ereignis.
7. E-Mail-Adressen der Seeds enden auf `.invalid`; reale personenbezogene Daten sind untersagt.
8. `synthetic` bleibt für alle Objekte `true`.
