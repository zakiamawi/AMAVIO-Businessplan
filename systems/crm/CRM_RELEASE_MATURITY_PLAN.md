# AMAVIO One CRM – Release-Reifeplan

| Reifestufe | Inhalt | Status |
|---|---|---|
| R0 Referenz | IGS-Material fachlich übersetzt | abgeschlossen |
| R1 Visual Prototype | AMAVIO Cockpit, synthetisch, localStorage v1 | abgeschlossen |
| R2 Canonical Core | kanonisches Modell, lokale CRUD-/Beziehungs-/Historienlogik, Tests | lokal QA-bestanden; nicht freigegeben |
| R3 Contract Alignment | Bündel A/B beschlossen und im lokalen synthetischen Core technisch angeglichen; Bündel C verriegelt | **lokal umgesetzt und technisch geprüft; UAT/produktive Freigabe ausstehend** |
| R3.2 Operational Fachblock | Arbeitsjournal mit sieben lokalen Fachobjekten, gespeicherten Ansichten und Alterungshinweisen; C0 nur fachlich entschieden | **lokal umgesetzt und technisch geprüft; nicht produktiv freigegeben** |
| R3.3 Owner Growth Core | lokale SQLite-API, Backup/Restore, synthetischer Import/Export, Zielsegmente, Research, Outreach-Entwürfe, Suppression und Kostenlimits | **lokal-synthetisch umgesetzt und geprüft; keine Außenwirkung** |
| R3.4 Founder Decision Cockpit | Mein Arbeitstag, drei erklärte Prioritäten, Decision Brief, Pipeline Movement, Aging, Relationship Field, Datenvertrauen und lokale Assistenzsimulation | **lokal-synthetisch umgesetzt und geprüft; keine externe KI und keine Außenwirkung** |
| R3.5 Operational Readiness | Kontaktentscheidung, Outreach-Preflight, Operational Signals, lokale Aufgabenconversion und getrennte Gate-Vorbereitung | **lokal-synthetisch umgesetzt und geprüft; keine Rechtsfreigabe, keine realen Daten und kein Versand** |
| R3.6 Workspaces, Analytics & G1 Readiness | getrennte Arbeitsflächen für Arbeitstag, Cockpit und Pipeline; visuelle Auswertungen; interne und bereinigte Berichtsansicht; sichtbare G1-Gates | **lokal-synthetisch umgesetzt; G1 bleibt NO-GO und jede produktive Außenwirkung gesperrt** |
| R3.7 G1 Entry Gate Closure | Datenklassen, Zwecke, Fristen, Import/Quarantäne, Betroffenen- und Incident-Playbook, Verantwortungsregister und vier synthetische Kontrollläufe | **lokal-synthetisch umgesetzt; G1 entscheidungsvorbereitet, aber nicht freigegeben** |
| R3.8 G1 Legal & Access Assurance | sieben Quellen-/Zweck-/Kanalpfade, vier Informationspflicht-Bausteine, neun Zugriffsschutzkontrollen und sechs synthetische Prüfungen | **lokal-synthetisch umgesetzt; G1-03 extern und G1-06 technisch gesperrt, G1-10 NO-GO** |
| R3.9 IA Consolidation | vollständige Doppelungsprüfung, eigenständiger System-/Freigabebereich, fokussierter Growth-Bereich und eindeutige G1-Registerzwecke | **lokal-synthetisch umgesetzt; Datenmodell v7 und sämtliche Produktivgates unverändert** |
| R3.10 Local Operations Assurance | isolierte SQLite-Wiederherstellungsprobe mit Prüfsumme sowie konkrete G1-01/05/07/09-Beschlussvorschläge | **lokal-synthetisch umgesetzt; G1 weiterhin NO-GO, keine Betriebs- oder Produktivfreigabe** |
| R3.11 G1 PO Decision Alignment | vier lokale Fachbeschlüsse in Vertrag, UI, Audit und Tests angeglichen | **lokal-synthetisch umgesetzt; G1-03, G1-06, externe Evidenz und G1-10 weiterhin NO-GO** |
| R3.12 G1 External & Technical Readiness | Origin-Schutz, Security-Header, Dateirechte, offizielle G1-03-Arbeitsunterlagen, Geräte-/Betriebsevidenz sowie aktueller C1-Provider-/Kostenrahmen | **lokal-synthetisch umgesetzt; Firewall-Blocker, Rechts-/Geräte-/Betriebsnachweise, C1-Beschluss und G1-10 offen** |
| R3.13 C1 Decision Closure | C1-Teilbeschlüsse, Betreiber/Vertretung, Budgetrahmen, Synthetic-only sowie lokale Firewall-/FileVault-/Sperrnachweise | **teilweise beschlossen und lokal-synthetisch angeglichen; Security Review, Provider/Region, externe Prüfung und Firewall-Nachweiswiderspruch offen; C1 NO-GO** |
| R3.14 C1 External Review Readiness | Security-Review-Brief, Vertretungsübergabe, Datenschutz-/Vertragsbriefing, Provider-/Regionsentscheidung und geschärfter Firewall-Nachweis | **Prüf- und Entscheidungspakete lokal vollständig; externe Annahmen und Entscheidungen offen; C1 NO-GO** |
| C0 Architecture Decision | Plattform-, Zugriffs-, Identitäts-, Umgebungs- und Datengrenzen für eine spätere C1-Planung | **fachlich entschieden; keine technische Aktivierung** |
| C1 Entry-Gate Closure | Threat Model, API-/RLS-Vertrag, Provider-/Privacy-Prüfung, RPO/RTO, Betrieb, Kosten, Secrets und Exit | **Entscheidungspaket erstellt; drei externe Freigabeblocker offen; C1 NO-GO** |
| G1 Real-Data Readiness | Geräte-, Backup-, Privacy-, Lifecycle- und operative Freigabe für begrenzte AMAVIO-Daten | kurzfristig priorisiert; gesperrt bis Einzelbeschluss |
| G2/G3 Provider & Controlled Send | austauschbare Connectoren und kontrollierter produktiver Versand | kurzfristig priorisiert; gesperrt bis Einzelbeschluss |
| G4/G5 Automation & Licensed Research | begrenzte Sequenzen und erlaubte Datenquellen | kurzfristig priorisiert; Schutzumgehung ausgeschlossen |
| G6/G7 Team & Isolation | Mehrbenutzerbetrieb, danach nur bei Bedarf Workspace-/Mandantenisolation | kurzfristig priorisiert; Auth-/Security-Gate offen |
| G8 Integration Contracts | minimale CRM↔ACC/App-Verträge bei weiter getrennten Codebasen | fachlich priorisiert; technische Integration gesperrt |
| R6 Production Release | Datenschutz-/Security-/Betriebsfreigabe und Migration | gesperrt |

Die höchste zulässige Aussage auch nach R3 lautet: **„Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben“**.

Nicht zulässig sind Aussagen zu Produktionsreife, Datenschutzfreigabe, Sicherheitsprüfung, Mehrbenutzer-/Mandantenfähigkeit, Backend, realen Daten oder aktiven Integrationen.

## Beschlusswirkung vom 09.10.2026

- Die zwölf Entscheidungen der Bündel A und B wurden im ausdrücklich beauftragten R3-Paket lokal-synthetisch technisch angeglichen.
- Die acht Entscheidungen von Bündel C bestätigen die vollständige Sperre von Datenbank, Authentifizierung, Import, E-Mail/Kalender, Dokumentenspeicher, App, produktiver KI sowie Hosting/Deployment.
- Der technische R3-Umsetzungsabgleich und die lokalen automatisierten Prüfungen sind abgeschlossen; Product-Owner-UAT und jede produktive Freigabe bleiben offen.
- R4 bis R6 bleiben unverändert gesperrt.

## Beschlusswirkung vom 10.10.2026

- R3.2 erweitert nur den lokalen synthetischen Core.
- C0 legt Supabase Managed PostgreSQL/Auth in der spezifischen Frankfurter Region hinter einer AMAVIO-Server/API-Grenze als Planungspräferenz fest.
- C0 ist keine C1-Freigabe: Anbieterbeauftragung, Projektanlage, Authentifizierung, Backend und Hosting bleiben gesperrt.
- C1 benötigt einen neuen ausdrücklichen Product-Owner-Beschluss; C2 bis C7 bleiben gesperrt.
- Vor diesem Beschluss müssen Provider-/Datenschutzannahme, benannte Betriebs-/Prüfverantwortung und Budgetentscheidung geschlossen sein. Das Entry-Gate-Paket selbst ist keine C1-Aktivierung.
- R3.4 verbessert die lokale Entscheidungs- und Beziehungsarbeit, ohne C1 oder ein anderes produktives Gate zu öffnen.
- R3.5 macht Kontakt- und Outreach-Nachweise operativ bearbeitbar, ohne Reale-Daten-, Versand- oder Live-Research-Gates zu öffnen.
- R3.6 trennt Tagesarbeit, Managementsteuerung und operative Pipeline fachlich und visuell. Auswertungen zeigen ausschließlich ableitbare lokale Fakten; die Berichtsansicht ist keine externe Freigabe. G1 wurde nur als Readiness-Register begonnen und bleibt NO-GO.
- R3.9 beseitigt ausschließlich belegte Informationsarchitektur-Doppelungen. Übersicht, operative Detailarbeit und Analyse bleiben getrennt, wenn sie unterschiedliche Entscheidungen unterstützen. Der Systembereich aktiviert kein produktives Gate.
- R3.10 belegt einen isolierten synthetischen Restore-Round-Trip. Dieser technische Nachweis ersetzt weder Geräteverschlüsselung und RPO/RTO noch Verantwortungs-, Rechts-, Security- oder Product-Owner-Freigaben.
- R3.11 beschließt die lokale Arbeitslogik für G1-01, G1-05, G1-07 und G1-09. Diese Teilbeschlüsse schließen keine Fremdnachweise, aktivieren keine Echtdaten und ersetzen G1-10 nicht.
- R3.12 härtet den lokalen synthetischen Server und vervollständigt Entscheidungsunterlagen. Die read-only beobachtete deaktivierte Firewall und ungeklärte Geräteabsicherung verhindern eine G1-06-Freigabe; C1 bleibt bis zu Verantwortungs-, Vertrags-, Budget- und Abnahmebeschluss gesperrt.
- R3.13 übernimmt die eindeutigen C1-Teilentscheidungen und die freigegebene lokale Gerätehärtung. Mehrdeutige oder leere Felder werden nicht als Go interpretiert. Der UI-/CLI-Widerspruch der Firewall, fehlender Security Reviewer und fehlende Provider-/Regionsauswahl halten C1 gesperrt.
- R3.14 macht die offenen C1-Gates einzeln abnehmbar. Die aktuelle Betriebssystemprüfung stuft die Firewall als nicht wirksam belegt ein. Vollständige Reviewpakete ersetzen weder Reviewer, externe Fachprüfung, Vertreterannahme, Providerwahl noch den gesonderten C1-Beschluss.
- R3.15 erlaubt nach direktem Product-Owner-Auftrag die lokale Sichtbarkeit der benannten realen Altbestände in einer getrennten Staging-Zone. Dies ändert den synthetischen Core-Reifegrad nicht und ist kein G1-Go-live. Alle realen Kontakte bleiben gesperrt; Core-Übernahme, Outreach, Cloud, Supabase, App, ACC und produktiver Betrieb benötigen jeweils eigene Freigaben.
