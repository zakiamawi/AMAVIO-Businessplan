# AMAVIO One CRM – Schritt C Gate- und Sequenzplan

**Stand:** 10.10.2026  
**Aktueller Status:** C0 fachlich entschieden; C1-Entry-Gates dokumentarisch bearbeitet; C1 bis C7 technisch nicht aktiviert  
**Reifegrad des CRM:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Beschlussfortschreibung 10.10.2026

Der Product Owner hat die Reihenfolge verbindlich enger gefasst: R3.2 lokal umsetzen, parallel nur C0 entscheiden, C1 erst nach einem neuen kontrollierten Beschluss freigeben. C0 ist mit `CRM_C0_DECISION_PACKAGE_20261010.md` abgeschlossen. Die bevorzugte spätere Grundlage ist Supabase Managed PostgreSQL/Auth in `eu-central-1` Frankfurt hinter einer AMAVIO-eigenen serverseitigen API-Grenze. Es wurde nichts provisioniert oder verbunden.

Der nachfolgende Product-Owner-Auftrag legt als nächsten Block ausdrücklich das Schließen der dokumentierten C1-Entry-Gates vor jede C1-Implementierung. Das Ergebnis steht in `CRM_C1_ENTRY_GATE_REGISTER_20261010.md`: fünf Gates sind geschlossen beziehungsweise auf Spezifikationsebene geschlossen; Provider-/Datenschutzannahme, personelle Verantwortung und Budget bleiben echte Freigabeblocker. C1 bleibt im NO-GO.

## Empfehlung

Schritt C sollte **nicht parallel** zu offenen R3.1-Design- oder Fachkorrekturen implementiert werden. Die sinnvolle Reihenfolge ist:

1. R3.2 visuell, fachlich und technisch abnehmen;
2. die offenen C1-Entry-Gates aus dem C0-Paket mit Datenschutz, Security, Kosten und Betriebsverantwortung schließen;
3. C1 erst nach neuem Product-Owner-Beschluss als isolierte sichere Plattformbasis mit synthetischem Staging umsetzen;
4. erst danach Import, Dokumente, Kommunikation und getrennte Produktverträge einzeln freigeben.

Parallele Arbeit ist nur für unabhängige Dokumentation, Bedrohungsmodell, Datenklassifikation und Testplanung sinnvoll. Datenbank, Authentifizierung, Import und Integrationen dürfen nicht gleichzeitig ohne festgelegte Verträge entstehen.

## Schrittfolge

| Stufe | Inhalt | Ergebnis | Freigabe vor Umsetzung |
|---|---|---|---|
| C0 | Architekturentscheidung, Datenklassifikation, Aufbewahrung/Löschung, EU-Hosting-/AVV-Anforderungen, Rollenwirkung, Umgebungen, Kostenrahmen | unterschriftsreife Entscheidungsmatrix; keine Integration | Product Owner, Datenschutz, Security, Kosten |
| C1 | Backend-Grundlage, Authentifizierung/MFA, serverseitige Rollen, Audit, Backups, Monitoring, Secret-Handhabung | internes Staging mit weiterhin ausschließlich synthetischen Daten | Datenbank-, Auth-, Hosting- und Security-Gate |
| C2 | kontrollierter Importkanal, Mapping, Dublettenprüfung, Dry Run, Quarantäne und Rückrollplan | importfähige technische Strecke ohne reale Datenfreigabe | Daten-, Datenschutz- und Migrationsgate |
| C3 | Dokumentreferenz und optionaler Dokumentenspeicher mit Rollen, Aufbewahrung, Virenprüfung und Löschprozess | sicherer Dokumentpfad | Dokument-/Security-/Kosten-/Datenschutzgate |
| C4 | E-Mail und Kalender mit expliziter Aktion, Einwilligungs-/Kontaktstatus und Protokollierung | kontrollierte Kommunikationsunterstützung | Anbieter-, Datenschutz-, Rechts- und Kommunikationsgate |
| C5 | getrennte ACC-/App-Verträge; minimierter Handoff-Payload; idempotente API; keine gemeinsame Datenbank | getestete Integrationsverträge, weiterhin getrennte Produkte | gesondertes ACC- beziehungsweise App-Gate |
| C6 | optionale produktive KI mit Zweck, Modell-/Anbieterprüfung, Datenminimierung, menschlicher Freigabe und Kostenlimit | begrenzte, abschaltbare Assistenzfunktion | KI-, Datenschutz-, Rechts-, Qualitäts- und Kostengate |
| C7 | Staging-Abnahme, Penetrations-/Security-Prüfung, Betriebsmodell, Incident/Backup/Restore, Release-Checkliste | produktive Freigabeentscheidung | Hosting-, Security-, Datenschutz- und Releasegate |

## C1 – erst nach Entry-Gate-Abschluss

C1 ist der kleinste sinnvolle produktive Unterbau. Er darf erst beginnen, wenn mindestens entschieden ist:

- Datenbank-/Backend-Anbieter und EU-Region;
- Authentifizierungsanbieter, MFA und Session-Regeln;
- serverseitig wirksame Rollen und Admin-Prozess;
- Single-Workspace bleibt verbindlich oder wird ausdrücklich ersetzt;
- Staging- und Produktionsumgebung;
- AVV/DPA, Unterauftragsverarbeiter und technische/organisatorische Maßnahmen;
- Backup, Wiederherstellung, Protokollaufbewahrung und Löschkonzept;
- Kostenlimit und verantwortliche Person;
- welche Datenklassen zu diesem Zeitpunkt überhaupt verarbeitet werden dürfen.

## Architekturprinzipien

- CRM, Arrival Control Center und App bleiben getrennte Codebasen und getrennte Produkte.
- Keine gemeinsame produktive Datenbank zwischen CRM, ACC und App.
- Integration ausschließlich über versionierte Verträge und minimale Referenzen.
- Produktive Identitäten werden nie aus den synthetischen IDs abgeleitet.
- Frontend-Status ist keine Berechtigung; jede Mutation wird serverseitig autorisiert.
- `deny by default`, geringste Rechte, MFA für privilegierte Rollen.
- Audit-Ereignisse sind nachvollziehbar, aber enthalten keine unnötigen Inhaltskopien.
- Secrets liegen nie im Repository, in Dokumentationen oder Browser-Logs.
- Staging beginnt mit synthetischen Daten; reale Daten erhalten ein separates Freigabedatum.
- KI, E-Mail, Kalender, Import und externe Automatisierung sind standardmäßig ausgeschaltet.

## Nicht als eine Freigabe behandeln

Die Aussage „Schritt C entwickeln“ ist kein ausreichender Ersatz für die voneinander unabhängigen Entscheidungen zu Datenbank, Authentifizierung, realen Daten, Import, Dokumenten, Kommunikation, ACC, App, KI, Hosting und Veröffentlichung. Jede dieser Wirkungen besitzt einen eigenen Risiko- und Kostenpfad.

## Nächster Product-Owner-Beschluss

Ein C1-Beschluss ist erst zulässig, wenn `C1-EG-06` bis `C1-EG-08` geschlossen und die Pflichtfelder in `CRM_C1_RELEASE_DECISION_DRAFT_20261010.md` ausgefüllt sind. Maßgeblich ist dann der dortige enge Beschlusswortlaut. Bis dahin lautet die Entscheidung **NO-GO**.

Früherer Kurzvorschlag, nicht zur unmittelbaren Freigabe zu verwenden:

> Ich gebe ausschließlich C1 als getrennte sichere Plattformgrundlage mit synthetischem Staging frei. Die Umsetzung folgt dem C0-ADR. Reale Daten, Import, Dokumentenspeicher, E-Mail/Kalender, ACC-/App-Integration, produktive KI und öffentlicher Produktivbetrieb bleiben gesperrt. C2 bis C7 werden nicht vorweggenommen.

