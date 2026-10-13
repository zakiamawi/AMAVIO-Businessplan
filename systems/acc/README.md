# AMAVIO Arrival Control Center – Release Q True Workspaces

**Stand:** 13.10.2026  
**Status:** neue datierte Arbeitskopie; lokal QA-geprüft, synthetisch, providerfrei und ohne Außenwirkung

## Aktiver Release Q

Release Q macht aus der visuellen Rollentrennung von P.3 zwei fachlich vollständige Arbeitsplätze. Seitenwechsel und Arbeitgeberperspektiven verändern jetzt tatsächlich Aufgabe, Informationshierarchie, Bearbeitungslogik und Arbeitsprodukt.

- Arbeitgeber: vier unterschiedliche Funktionsperspektiven für Gesamtsteuerung, Personal & Onboarding, Standort & Übergabe sowie Budget & Freigaben;
- Operations: vier getrennte Arbeitsflächen für Arbeitsvorrat, aktive Aufträge, Übergabebereit und Leistungsnachweise;
- operative Auftragsakte mit Übersicht, Aufgaben, Nachweisen, Klärungen und Verlauf;
- vollständige lokale Golden Journey von Entscheidung und Auftrag bis Ausführung, Nachweis, Übergabedossier und Ergebnisbrief;
- eigenständige Desktop-, Tablet- und Mobilprojektionen statt abgeschnittener Desktop-Tabellen;
- 337/337 Regressionstests sowie Static-, Brandbook-, Browser-, Responsive-, Interaktions-, Konsolen- und Netzwerk-QA grün;
- keine externe KI, echten Daten, produktive Identity, Integration, Außenwirkung, Veröffentlichung oder Deployment.

Lokaler Einstieg nach `npm start`:

- Arbeitgeber: `http://127.0.0.1:4220/?page=readiness&role=employer&lens=governance&scenario=housing-handover`
- Operations: `http://127.0.0.1:4220/?page=readiness&role=operations&scenario=housing-handover`
- Architektur: `architecture/RELEASE_Q_TRUE_WORKSPACES_20261013.md`
- Designsystem: `design/RELEASE_Q_DESIGN_SYSTEM_20261013.md`
- QA: `QA/ACC_RELEASE_Q_TRUE_WORKSPACES_QA_20261013.md`
- unveränderte Rückfallbasis: Release P.3 auf Port 4219

---

# Erhalten – Release P.3 Dual Product Surfaces

**Stand:** 13.10.2026  
**Status:** neue datierte Arbeitskopie; lokal, synthetisch, providerfrei und ohne Außenwirkung

## Erhaltener Release P.3

Release P.3 ersetzt das noch gemeinsame visuelle Grundgerüst durch zwei echte Produktoberflächen:

- Arbeitgeberportal ohne Operations-Seitenleiste, mit horizontaler Navigation und ruhiger Entscheidungs-/Ergebnislogik;
- AMAVIO Operations als dichte interne Arbeitskonsole mit Seitenleiste, Arbeitsvorrat, Workbench und Auftragskontext;
- Golden Journey, Rollenrechte und vier Arbeitsprodukte bleiben erhalten;
- keine externe KI, echte Daten oder Außenwirkung.

Lokaler Einstieg nach `npm start`:

- Arbeitgeber: `http://127.0.0.1:4219/?page=readiness&role=employer&lens=governance&scenario=housing-handover`
- Operations: `http://127.0.0.1:4219/?page=readiness&role=operations&scenario=housing-handover`
- Architektur: `architecture/RELEASE_P3_DUAL_PRODUCT_SURFACES_20261013.md`
- Designsystem: `design/RELEASE_P3_DESIGN_SYSTEM_20261013.md`
- QA: `QA/ACC_RELEASE_P3_DUAL_PRODUCT_SURFACES_QA_20261013.md`
- unveränderte Rückfallbasis: Release P.2 auf Port 4218

---

# Erhalten – Release P.2 Role Separation & Usable Work Products

**Stand:** 13.10.2026  
**Status:** neue datierte Arbeitskopie; lokal, synthetisch, providerfrei und ohne Außenwirkung

## Aktiver Release P.2

Release P.2 korrigiert den Founder-Befund, dass Arbeitgeber und AMAVIO Operations trotz unterschiedlicher Überschriften dieselbe Produktstruktur zeigten und die Arbeitsprodukte noch nicht eigenständig nutzbar wirkten.

- Arbeitgeber: `Startübersicht → Entscheidungen → Aufträge an AMAVIO → Ergebnisse`;
- Operations: `Arbeitsvorrat → Aktive Aufträge → Übergabebereit → Leistungsnachweise`;
- Arbeitgeber sieht Entscheidung, Leistungsumfang, Status, Wirkung und Abnahme;
- Operations sieht Auftrag, aktuellen Arbeitsschritt, Nachweisanforderung, Abhängigkeit und Übergabe;
- vier rollenspezifische, serverseitig geschützte Arbeitsprodukte;
- keine externe KI, echte Daten oder Außenwirkung.

Lokaler Einstieg nach `npm start`:

- Arbeitgeber: `http://127.0.0.1:4218/?page=readiness&role=employer&lens=governance&scenario=housing-handover`
- Operations: `http://127.0.0.1:4218/?page=readiness&role=operations&scenario=housing-handover`
- Architektur: `architecture/RELEASE_P2_ROLE_SEPARATION_WORK_PRODUCTS_20261013.md`
- Designsystem: `design/RELEASE_P2_DESIGN_SYSTEM_20261013.md`
- QA: `QA/ACC_RELEASE_P2_ROLE_SEPARATION_WORK_PRODUCTS_QA_20261013.md`
- unveränderte Rückfallbasis: Release P.1 auf Port 4217

---

# Erhalten – Release P.1 Service Delivery Proof

**Stand:** 13.10.2026  
**Status:** neue datierte Arbeitskopie; lokal, synthetisch, providerfrei und ohne Außenwirkung

## Aktiver Release P.1

Release P.1 schließt die noch offene Lücke zwischen verständlicher Arbeitgeberentscheidung und sichtbar erbrachter AMAVIO-Leistung. Der priorisierte Unterkunftsfall ist jetzt als vollständige Dienstleistungskette umgesetzt:

`Option wählen → Leistungsauftrag übergeben → AMAVIO übernimmt → drei Nachweise schließen → Ergebnis zurückgeben → Arbeitsprodukt prüfen`

Wesentliche Änderungen:

- verbindlicher Leistungsauftrag mit Auftragsnummer, Leistungsumfang, Arbeitgeberbeitrag, Servicefenster, Abnahmekriterien und Nicht-Leistung;
- fixierte Arbeitgeberentscheidung nach Übergabe an AMAVIO;
- eigenständiger Operations-Ausführungsraum statt derselben Oberfläche mit anderen Buttons;
- drei evidenzpflichtige Ausführungsschritte je Ausnahmeweg;
- geschlossene Ergebnisübergabe mit Ergebnis, Restbedingung, nächstem Prüfpunkt und Nachweis;
- versionierter Übergabe- und Ankunftsplan sowie Arrival Readiness Brief mit lokaler Druckansicht;
- 85 API-Routen und 51 Mutationen in der vollständigen 02A-Assurance-Matrix;
- weiterhin ausschließlich lokale, synthetische Daten und null Provideraufrufe.

Lokaler Einstieg nach `npm start`:

- Arbeitgeber · Gesamtsteuerung: `http://127.0.0.1:4217/?page=readiness&role=employer&lens=governance&scenario=housing-handover`
- AMAVIO Operations: `http://127.0.0.1:4217/?page=readiness&role=operations&scenario=housing-handover`
- Ausführung: `http://127.0.0.1:4217/?page=decisions&role=operations&scenario=housing-handover`
- Arbeitsprodukte: `http://127.0.0.1:4217/?page=work-products&role=employer&lens=governance&scenario=housing-handover`
- Architektur: `architecture/RELEASE_P1_SERVICE_DELIVERY_PROOF_20261013.md`
- Designsystem: `design/RELEASE_P1_DESIGN_SYSTEM_20261013.md`
- QA: `QA/ACC_RELEASE_P1_SERVICE_DELIVERY_PROOF_QA_20261013.md`
- unveränderte Rückfallbasis: `20261013_AMAVIO_ACC_Release_P_Arrival_Reliability_Intervention_Working` auf Port 4216

Grenze: keine echte Person, kein reales Unternehmen, Objekt oder Partner; keine produktive Identity, externe KI, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.

---

# Erhalten – Release O Pilot-Ready Operational Core

**Stand:** 13.10.2026  
**Status:** neue datierte Arbeitskopie; lokal, synthetisch, providerfrei und ohne Außenwirkung

## Aktiver Release O

Release O konsolidiert die bisher gewachsene Produkttiefe in einen einzigen aktiven Oberflächenkern und eine vollständig durchgehende operative Fallsteuerung. Es entsteht keine neue Modulschicht: `index.html` lädt nur lokale Fonts, `assets/core.css` und `assets/core.js`. Die vorhandenen Domänenverträge bleiben als Backend-Fachbasis erhalten.

Die Golden Journey lautet:

`Evidenz klären → Arbeitgeberbeitrag sichern → Auswirkung prüfen → menschlich entscheiden → Arrival Readiness Brief`

Umgesetzt sind:

- eine klar geführte AMAVIO-Fallarbeit mit genau einer dominanten Aufgabe und schmalem Arbeitskontext;
- eine getrennte Arbeitgeberfläche mit verständlichen Arbeitsbereichen und strukturierter Standortbestätigung;
- drei kontrollierte Ausnahmewege: Evidenzkonflikt, verspätete Arbeitgeberantwort und geändertes Ankunftsdatum;
- echte lokale Arbeitsprodukte mit Ausgangslage, fehlender Grundlage, Verantwortung, Entscheidung, Programmfolge und Wirkungsgrenze;
- Suche, Filter, rollenbewusste Übergabe, isolierte Terminsimulation, Human Gate und reproduzierbarer Pilot-Reset;
- Pilotmessung für Aufgabenerfolg, Bearbeitungszeit, Übergabelatenz, Nacharbeit und Evidenzvollständigkeit – ausdrücklich ohne reale Leistungsbehauptung;
- technische Konsolidierung mit einem aktiven UI-Runtime-Vertrag statt der früheren kaskadierenden Release-CSS-/JS-Schichten.

Lokaler Einstieg:

- AMAVIO Operations: `http://127.0.0.1:4215/?page=cases&opsCase=SYN-CASE-001`
- Arbeitgeber: `http://127.0.0.1:4215/?page=tasks&role=employer&lens=location&opsCase=SYN-CASE-001`
- QA: `QA/ACC_RELEASE_O_PILOT_READY_OPERATIONAL_CORE_QA_20261013.md`
- Architekturentscheidung: `architecture/ADR-012_RELEASE_O_PILOT_READY_OPERATIONAL_CORE_20261013.md`
- Designsystem: `design/RELEASE_O_DESIGN_SYSTEM_20261013.md`
- Rückfallbasis: unveränderte Arbeitskopie `20261013_AMAVIO_ACC_Release_N_Employer_Workspace_Working` auf Port 4214

Grenze: ausschließlich lokale synthetische Pilot-Simulation. Keine produktive Identity, realen Daten, externe KI, CRM-/HRIS-/App-/Datei-/Messaging-/Buchungsintegration, Veröffentlichung oder Deployment.

---

# Erhalten – Release N Employer Workspace

**Stand:** 13.10.2026  
**Status:** neue datierte Arbeitskopie; lokal, synthetisch, providerfrei und ohne Außenwirkung

## Aktiver Release N

Release N korrigiert die Arbeitgeberseite fachlich und sprachlich. Der unklare sichtbare Begriff „Sponsor“ ist durch den verständlichen Arbeitsbereich **Gesamtsteuerung** ersetzt. Die vier Funktionssichten heißen jetzt **Gesamtsteuerung**, **Personal & Onboarding**, **Standort & Übergabe** sowie **Budget & Freigaben**. Es handelt sich um Funktionssichten innerhalb eines Arbeitgeber-Arbeitsraums, nicht um vier gleichartige Kopien der AMAVIO-Operationsoberfläche.

Die Arbeitgebernavigation besitzt zwei bewusst getrennte, aber wieder fachlich vollständige Ziele:

- **Aufgaben & Entscheidungen:** nur tatsächlich bearbeitbare Vorgänge des gewählten Arbeitsbereichs; jeweils mit Auftrag, Grundlage, Dringlichkeit, Folge, begründeter Übergabe und gemeinsamem Status;
- **Ankunftsprogramme:** vereinbarte Leistungen, sechs Programmphasen, Verantwortungen, Termine, eigener Programmbeitrag, Entscheidungen und Ergebnisrückmeldung; interne AMAVIO-Analyse bleibt ausgeblendet.

- Aufgaben & Entscheidungen: `http://127.0.0.1:4214/?page=collaboration&role=employer&lens=sponsor&opsCase=SYN-CASE-001`
- Ankunftsprogramme: `http://127.0.0.1:4214/?page=programs&role=employer&lens=sponsor&program=SYN-PROG-001`
- QA: `QA/ACC_RELEASE_N_EMPLOYER_WORKSPACE_QA_20261013.md`
- Architekturentscheidung: `architecture/ADR-011_RELEASE_N_EMPLOYER_WORKSPACE_20261013.md`
- Rückfallbasis: unveränderte Arbeitskopie `20261013_AMAVIO_ACC_Release_M_Operational_Execution_Loop_Working` auf Port 4213
- Grenze: weiterhin ausschließlich lokale, synthetische Konzeptdemo; keine produktive Identity, realen Daten, externe KI, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment

## Erhalten – Release L.2 Operational Clarity

**Stand:** 13.10.2026  
**Status:** neue datierte Arbeitskopie; lokal, synthetisch und ohne Außenwirkung

## Aktiver Release L.2

Release L.2 ordnet die bestehende Produkttiefe neu, ohne Fachfunktionen aus dem System zu entfernen. Die Standardnavigation besteht jetzt aus fünf verständlichen Arbeitsbereichen: **Überblick, Fälle, Programme, Entscheidungen und Qualität**. Technische Tiefenrouten bleiben erhalten, konkurrieren aber nicht mehr als gleichrangige Tabs mit der täglichen Arbeit.

Die zentrale Fallreise lautet nun:

`Lage → Verantwortung → Auswirkung → Entscheidung → Ergebnis`

- Einstieg: `http://127.0.0.1:4212/?page=cases`
- operative Fallarbeit: `http://127.0.0.1:4212/?page=operations&opsCase=SYN-CASE-001`
- Programme: `http://127.0.0.1:4212/?page=programs&program=SYN-PROG-001`
- Entscheidungen: `http://127.0.0.1:4212/?page=twin-decisions`
- Qualität: `http://127.0.0.1:4212/?page=learning-quality`
- Arbeitgeber-Mitwirkung: `http://127.0.0.1:4212/?page=collaboration&role=employer&lens=sponsor&opsCase=SYN-CASE-001`
- QA: `QA/ACC_RELEASE_L2_OPERATIONAL_CLARITY_QA_20261013.md`
- Architekturentscheidung: `architecture/ADR-009_RELEASE_L2_OPERATIONAL_CLARITY_20261013.md`
- Rückfallbasis: unveränderte Arbeitskopie `20261013_AMAVIO_ACC_Release_L1_Web_Fidelity_Working` auf Port 4211

## Erhalten – Release L.1 Web Fidelity

**Stand:** 13.10.2026  
**Status:** neue datierte Web-Fidelity-Arbeitskopie auf Basis von Release L; ausschließlich lokal und synthetisch

## Aktiver Release L.1

Release L.1 überträgt die bereits freigegebene editoriale Designsprache des Programmraums und der Planungsentscheidung auf den bisher älteren Einstieg „Fälle“. Die Fallübersicht arbeitet nun nach dem Prinzip `Portfolio → Auswahl → fokussierte Vorschau → vollständige Fallarbeit`. Funktionen wurden nicht entfernt; die vollständige Fallreise öffnet sich bewusst erst nach der Auswahl.

- Fallzentrale: `http://127.0.0.1:4211/?page=cases`
- vollständige Fallarbeit: `http://127.0.0.1:4211/?page=today&case=A-2233`
- Programmraum: `http://127.0.0.1:4211/?page=programs&program=SYN-PROG-001`
- Planungsentscheidung: `http://127.0.0.1:4211/?page=planning`
- QA: `QA/ACC_RELEASE_L1_WEB_FIDELITY_QA_20261013.md`
- Rückfallbasis: unveränderte Arbeitskopie `20261012_AMAVIO_ACC_Release_L_Intelligence_Kernel_V3_Working` auf Port 4210

## Erhalten – Release L Intelligence Kernel V3

**Stand:** 12.10.2026  
**Status:** Release K Program Delivery plus providerunabhängige lokale Fach- und Evaluationsschicht; ausschließlich synthetisch

## Release L

Release L ergänzt die Programmlieferung um drei unsichtbar integrierte AMAVIO-Fähigkeiten: Lieferbelege abgleichen, kritischen Pfad neu planen und einen reproduzierbaren Programmbrief erzeugen. Jede Ausgabe bleibt advisory-only, benötigt ein Human Gate und besitzt keine automatische oder externe Wirkung.

- Planungsentscheidung: `http://127.0.0.1:4210/?page=planning`
- Operations-Programmraum: `http://127.0.0.1:4210/?page=programs&program=SYN-PROG-001`
- Arbeitgeber-Programmraum: `http://127.0.0.1:4210/?page=programs&role=employer&lens=sponsor&program=SYN-PROG-001`
- moderierte synthetische Testkonsole: `http://127.0.0.1:4210/usability-program/index.html`
- Architektur: `architecture/AMAVIO_INTELLIGENCE_KERNEL_V3_20261012.md`
- QA: `QA/ACC_RELEASE_L_QA_20261012.md`

## Erhalten – Release K Program & Delivery OS

**Stand:** 12.10.2026  
**Status:** lokale synthetische Programmlieferung für AMAVIO Operations und Arbeitgeber; keine Außenwirkung

## Aktiver Release K

Release K verbindet Kohorten, Service Blueprint, Kapazität, Arbeitgeberentscheidungen, kritische-Pfad-Simulationen, Outcome-Rückmeldungen und Arbeitsprodukte zu einem steuerbaren Ankunftsprogramm. Operations und Arbeitgeber arbeiten am selben synthetischen Programmstand, erhalten aber getrennte Projektionen.

- Operations: `http://127.0.0.1:4209/?page=programs&program=SYN-PROG-001`
- Arbeitgeber-Sponsor: `http://127.0.0.1:4209/?page=programs&role=employer&lens=sponsor&program=SYN-PROG-001`
- Architektur: `architecture/RELEASE_K_PROGRAM_DELIVERY_OS_20261012.md`
- QA: `QA/ACC_RELEASE_K_QA_20261012.md`

## Erhalten – Release J.5 Dual-Sided Workflow

**Stand:** 10.10.2026  
**Status:** getrennte, gekoppelte Arbeitsflächen für AMAVIO Operations und Arbeitgeber; lokal, synthetisch und Founder-Evaluationsfassung

## Aktiver Release J.5

Release J.5 schließt die bisherige Produktlücke zwischen interner Fallsteuerung und Arbeitgebermitwirkung. Die beiden Zielgruppen sehen nicht dieselbe Oberfläche in anderer Beschriftung, sondern zwei fachlich unterschiedliche Arbeitsräume auf demselben synthetischen Fallbestand:

- **AMAVIO Operations** steuert Evidenz, Verantwortung, Simulation, Entscheidung und Arbeitsprodukt und erhält Arbeitgeberbeiträge in einem eigenen Eingang;
- **Arbeitgeber** sehen ausschließlich ihre freigegebenen Fälle, Aufgaben, Entscheidungen, Belege und gemeinsamen Status – keine internen AMAVIO-Regeln, Simulationen, Kernel-, Audit- oder Lerninformationen;
- Sponsor, HR Operations, Standort und Budget behalten ihre jeweils minimierte serverseitige Projektion;
- ein Arbeitgeberbeitrag wird bewusst übergeben, von Operations fachlich geprüft und erst danach als gemeinsamer Status sichtbar;
- eine Ergebnisrückmeldung gelangt nur nach einer zusätzlichen ausdrücklichen Operations-Auswahl in die interne Lernschleife;
- alle Daten, Rollen, Entscheidungen und Aktionen bleiben synthetisch, lokal und ohne Außenwirkung.

Die gemeinsame Reise lautet:

`Arbeitgeberaufgabe → bewusster Beitrag → Operations-Prüfung → gemeinsamer Status → optionales internes Lernsignal`

- Arbeitgeber-Mitwirkung: `http://127.0.0.1:4208/?page=collaboration&role=employer&lens=sponsor&opsCase=SYN-CASE-001`
- operative Fallsteuerung: `http://127.0.0.1:4208/?page=operations&role=admin&opsCase=SYN-CASE-001`
- interne Lernschleife: `http://127.0.0.1:4208/?page=learning&role=admin`
- Architekturentscheidung: `architecture/ADR-008_RELEASE_J5_DUAL_SIDED_WORKFLOW_20261010.md`
- QA-Nachweis: `QA/ACC_RELEASE_J5_DUAL_SIDED_WORKFLOW_QA_20261010.md`
- Rückfallbasis: `archive/20261010_release_j5_dual_sided_baseline/`
- Release J.4.1 auf Port 4207 bleibt unverändert erhalten.

## Aktiver Release J.4.1

Release J.4.1 setzt die Founder-Abnahme vom 10.10.2026 gezielt um: Reload und Browser-Zurück waren bereits bestätigt. Korrigiert wurden ausschließlich der visuelle Ersteindruck, zu helle Sekundärtexte sowie der noch nicht vollständig verständliche Datei- und Serverfehlerzustand.

Die drei Runtime-Zustände folgen jetzt derselben ruhigen Logik:

`kurze Erklärung → zwei konkrete Schritte → eine primäre Handlung → sichtbarer Demorahmen`

- der Startzustand erklärt knapp, dass die Demo automatisch öffnet;
- der direkte Datei-Aufruf heißt jetzt „Lokale Demo starten“ und führt in zwei Schritten zum lokalen Server;
- der Serverfehler heißt „Demo ist noch nicht erreichbar“ und verbindet Startbefehl und erneute Prüfung;
- redundante oder missverständliche Fehlerlinks wurden entfernt;
- Einleitung, Kennzahlenhinweise, Journey-Beschreibungen, Rückmeldungsmetadaten und obere Systemzeile besitzen höheren Kontrast und sinnvolle Mindestgrößen;
- J.4-Navigation, Deep Links, Rollenlogik und Fachfunktionen bleiben unverändert.

- Rückmeldungsarbeit: `http://127.0.0.1:4207/?page=learning`
- Qualitätsprüfung: `http://127.0.0.1:4207/?page=learning-quality`
- operative Arbeitsfläche: `http://127.0.0.1:4207/?page=operations`
- Runtime-Clarity-QA: `QA/ACC_RELEASE_J4_1_RUNTIME_CLARITY_QA_20261010.md`
- Rückfallbasis: `archive/20261010_release_j4_1_runtime_clarity_baseline/`
- Release J.4 auf Port 4206 bleibt unverändert erhalten.

## Erhalten – Release J.4 Runtime & Navigation Integrity

Release J.4 macht die bestehende fachliche Produkttiefe zuverlässig aufrufbar. Die Demo unterscheidet nun ausdrücklich zwischen einer statisch geöffneten HTML-Datei und der vollständigen lokalen Anwendung. Fachoberfläche und Anwendungslogik werden erst geladen, wenn der lokale Health-Check Datenbank, synthetische Grenze und Null-Außenwirkung bestätigt.

Zusätzlich besitzt die Oberfläche einen reproduzierbaren Navigationsvertrag:

`Adresse öffnen → Laufzeit prüfen → Seite und Rolle herstellen → Fall und Arbeitsstufe fortsetzen`

- `file://` zeigt nur einen verständlichen lokalen Start-Hinweis und lädt keine Fachlogik;
- fehlgeschlagene Health-Checks zeigen einen geschlossenen Fehlerzustand mit bewusster Wiederholung;
- `?page=`-Deep-Links, Zurück, Vorwärts und Reload erhalten die aktuelle Arbeitsseite;
- Arbeitgeberrolle und Funktionsperspektive werden wiederhergestellt, interne Seiten bleiben gesperrt;
- ausgewählter Fall und Arbeitsstufe bleiben in Basisreise und operativer Arbeitsfläche erhalten;
- ein Altfehler der Seitenumschaltung ist behoben: Nur echte Inhaltsseiten werden ein- und ausgeblendet, nicht der Dokumentkörper.

- Rückmeldungsarbeit: `http://127.0.0.1:4206/?page=learning`
- Qualitätsprüfung: `http://127.0.0.1:4206/?page=learning-quality`
- operative Arbeitsfläche: `http://127.0.0.1:4206/?page=operations`
- Runtime-/Navigations-QA: `QA/ACC_RELEASE_J4_RUNTIME_NAVIGATION_QA_20261009.md`
- Rückfallbasis: `archive/20261009_release_j4_runtime_navigation_baseline/`
- Release J.3 auf Port 4205 bleibt unverändert erhalten.

## Erhalten – Release J.3 Guided Learning

Release J.3 setzt das Founder-Feedback zur J.2-Abnahme strukturell um: Die ruhige Gesamtwirkung bleibt erhalten, die Bedienlogik wird jedoch eindeutig geführt und die Qualitätsprüfung vollständig aus der täglichen Rückmeldungsarbeit herausgelöst.

Die Rückmeldungsarbeit folgt nun sichtbar drei Schritten:

`1 · Rückmeldung auswählen → 2 · Soll und Ist klären → 3 · nächste Anpassung festhalten`

Die Qualitätsprüfung besitzt eine eigenständige Operations-Seite. Dort werden derselbe aktuelle Stand und derselbe Verbesserungsvorschlag mit 24 synthetischen Prüffällen verglichen. Interne IDs, Fingerprints, Fixture-Namen, Provider- und Policy-Metadaten erscheinen nicht mehr in der Bedienoberfläche oder im Vergleichsdialog; sie bleiben ausschließlich Teil der lokalen technischen QA- und Auditbasis.

- Rückmeldungsarbeit: `http://127.0.0.1:4205/?page=learning`
- Qualitätsprüfung: `http://127.0.0.1:4205/?page=learning-quality`
- Visual-QA: `QA/ACC_RELEASE_J3_GUIDED_LEARNING_QA_20261008.md`
- Rückfallbasis: `archive/20261008_release_j3_guided_learning_baseline/`
- Release J.2 auf Port 4204 bleibt unverändert erhalten.

## Erhalten – Release J.2 Operator Focus

Release J.2 korrigiert die Founder-Befunde „zu voll“, „zu intern“, „abgeschnitten“ und „ohne Luft“, ohne die fachliche Release-J-Tiefe zu verlieren.

Die Oberfläche arbeitet jetzt mit zwei bewusst getrennten Ebenen:

1. **Rückmeldungen:** Beobachtung, Soll-Ergebnis, Ist-Ergebnis und vorgeschlagene Anpassung.
2. **Qualität & Version:** reproduzierbarer Vergleich, Versionsstand und fachliche Prüfung.

Interne IDs, Belegreferenzen, Fingerprints, Fixture-Namen, Providerstatus und Regeländerungen sind aus der Primäransicht entfernt. Sie bleiben über geschlossene Prüfdetails gezielt erreichbar. Schriftgrößen, Abstände und Arbeitsbreiten wurden neu geordnet; Desktop und Mobile besitzen keine abgeschnittenen Rückmeldungstexte oder horizontalen Dokumentüberläufe.

- Einstieg: `http://127.0.0.1:4204/?page=learning`
- Visual-QA: `QA/ACC_RELEASE_J2_OPERATOR_FOCUS_QA_20261008.md`
- Rückfallbasis: `archive/20261008_release_j_operator_focus_baseline/`
- Release J auf Port 4203 bleibt unverändert erhalten.

## Erhalten – Release J

Release J verbindet die operative Arbeit erstmals mit einem reproduzierbaren Qualitäts- und Versionszyklus:

`Feedback erfassen → Outcome zuordnen → Qualität bewerten → Version vergleichen → Entscheidung dokumentieren`

Umgesetzt sind:

- strukturierte Operator-Rückmeldungen mit Beobachtung, Erwartung, tatsächlichem Outcome, Korrekturtyp, Evidenzreferenzen und Notiz;
- sichtbare Outcome-Lücken statt stiller Freitextablage;
- ein deterministisches Evaluation Harness mit 24 synthetischen Fixtures und fünf Qualitätsdimensionen;
- richtungsrichtige Metriken, darunter geringerer Korrekturaufwand als Verbesserung;
- reproduzierbare SHA-256-Fingerprints für Baseline, Kandidat und Vergleich;
- getrennte Versionierung für Policy Set, Capability, lokale AMAVIO Engine und späteren Provideradapter;
- Outcome-, Qualitäts- und Policy-Diff in einer prüfbaren Vergleichsansicht;
- ein begründungspflichtiger Human-Gate-Review, der den Kandidaten fachlich markiert, aber nicht aktiviert;
- vollständige serverseitige Operations-only-, Tenant-, Idempotenz-, Concurrency- und Failure-Injection-Grenzen.

Der Provideradapter bleibt registriert, aber deaktiviert: **0 externe Calls, 0 EUR, keine Credentials und kein Live-Provider-Test**. Release J schafft damit die AMAVIO-eigene Messbasis, gegen die spätere austauschbare Adapter erst nach einem separaten Gate verglichen werden können.

- Einstieg: `http://127.0.0.1:4203/?page=learning`
- ADR: `architecture/ADR-007_RELEASE_J_OPERATIONAL_LEARNING_20261008.md`
- Systemdesign: `architecture/AMAVIO_OPERATIONAL_LEARNING_SYSTEM_DESIGN_V1_20261008.md`
- Route-Matrix: `QA/ACC_RELEASE_J_ROUTE_MATRIX_20261008.md`
- QA-Nachweis: `QA/ACC_RELEASE_J_QA_20261008.md`
- Coverage: `QA/ACC_RELEASE_J_COVERAGE_20261008.json`
- visuelle Konzepte: `design/ACC_RELEASE_J_OPERATIONAL_LEARNING_CONCEPT_20261008.png` und `design/ACC_RELEASE_J_VERSION_COMPARE_CONCEPT_20261008.png`
- Rückfallbasis: `archive/20261008_release_j_source_baseline/`

## Erhalten – Release I

Release I ist der bewusste Produktsprung von einzelnen Fallfunktionen zu einem lokalen **Arrival Operations Twin**. Die Oberfläche verbindet fünf zuvor getrennte Ebenen in einer kohortenweiten Arbeitslage:

`Ereignis → betroffene Fälle → kritischer Pfad → Rollenübergabe → prüfbarer Arbeitsplan → Human Gate`

Umgesetzt sind:

- ein kohortenweiter Ereignisstrom mit fünf priorisierten synthetischen Ereignissen;
- drei kritische Ereignisse und eine eigene Entscheidungsgrundlage über fünf operative Fälle;
- kritische Pfade und Meilensteine je Fall;
- eine Rollenübergabematrix für AMAVIO, Sponsor, HR, Standort und Budget;
- ereignisbezogene, reproduzierbare Arbeitspläne mit begründungspflichtigem Human Gate;
- ein eigener Entscheidungsraum statt verteilter Einzelentscheidungen;
- eine isolierte Kohortensimulation, die Fälle, Meilensteine, Übergaben und Budgetprüfung berechnet, den Originalbestand aber nicht verändert;
- serverseitige Tenant- und Rollenbegrenzung, Idempotenz, optimistische Review-Version und Audit Trail.

Der Operations Twin ist ausschließlich AMAVIO Operations zugeordnet. Arbeitgeberrollen bleiben auf den Release-H-Projektionen und erhalten weder Twin-Endpunkte noch interne Kohortenlogik.

- Einstieg: `http://127.0.0.1:4202/?page=twin`
- ADR: `architecture/ADR-006_RELEASE_I_OPERATIONS_TWIN_20261008.md`
- Systemdesign: `architecture/AMAVIO_OPERATIONS_TWIN_SYSTEM_DESIGN_V1_20261008.md`
- QA-Nachweis: `QA/ACC_RELEASE_I_QA_20261008.md`
- visuelles Konzept: `design/ACC_RELEASE_I_OPERATIONS_TWIN_CONCEPT_20261008.png`
- Rückfallbasis: `archive/20261008_release_i_source_baseline/`

## Erhaltene Release-H-Rollentrennung

Release H korrigiert die zuvor zu ähnliche Operations-/Arbeitgeberdarstellung. Der Rollenwechsel verändert nicht nur Profil und Texte, sondern Sitzung, Fallprojektion, sichtbare Felder, Journey und serverseitig zulässige Aktionen:

- **AMAVIO Operations:** fünf Fälle und vollständige interne Fallsteuerung einschließlich Kernel-V2-Fähigkeiten;
- **Arbeitgeber-Sponsor:** fünf verdichtete Fälle, Eskalationsstatus und zugewiesene Sponsorentscheidungen;
- **HR Operations:** ein HR-Fall mit HR-Beleg und HR-Aufgabe;
- **Standort:** zwei Standortfälle mit Standort-/Übergabebelegen und zugewiesenen Aufgaben;
- **Budget:** ein eigener Budgetfall mit zwei synthetischen Kostengrundlagen, Budgetaufgabe und Budgetentscheidung.

Verbotene Arbeitgeberaufrufe werden serverseitig vor der Domänenverarbeitung mit `403 role_scope_denied` beendet. Die Demo verwendet weiterhin keine produktive Identity. Alle Sitzungen, Personen, Unternehmen, Belege, Kosten und Entscheidungen sind synthetisch und lokal.

- ADR: `architecture/ADR-005_RELEASE_H_ROLE_CONTRACT_VIEW_PROJECTION_20261008.md`
- Rollenvertrag: `architecture/AMAVIO_ACC_ROLE_CONTRACT_V1_20261008.md`
- ausführbare Rollenmatrix: `QA/ACC_RELEASE_H_ROLE_MATRIX_20261008.md`
- QA-Nachweis: `QA/ACC_RELEASE_H_QA_20261008.md`
- Rückfallbasis: `archive/20261008_release_h_source_baseline/`

## Erhaltene operative Basis

Release G bleibt die ruhige operative Fallsteuerung:

`Evidenz → Verantwortung → Simulation → Entscheidung → Arrival Readiness Brief`

Darunter arbeitet nun der AMAVIO Intelligence Kernel V2. Er erweitert V1 um drei nutzbare vertikale Fähigkeiten innerhalb der bestehenden Fallreise:

- `Evidence Reconciliation`: Quellenkonflikte, Pflichtbelege und einen prüfbaren Klärungsauftrag;
- `Critical-Path Replanning`: lokale Neuberechnung von Aufgaben, Abhängigkeiten und Fristen als nicht angewendete Anpassungsvorlage;
- `Arrival Readiness Brief Composer`: reproduzierbarer interner Brief aus Graph, Policies, Simulation und menschlicher Entscheidung mit 100-Punkte-Qualitätsrubrik.

Alle drei Artefakte sind versioniert, mandantengebunden, idempotent, synthetisch und begründungspflichtig human-gated. Sie ändern keinen Fall automatisch.

Aktiv und kostenfrei:

- lokaler deterministischer Provider;
- vier V1-Capabilities plus drei vertikale V2-Capabilities;
- acht zentrale Policies;
- 34 Kernel-Evaluationsszenarien;
- persistente Kernel-Läufe und Human-Gate-Reviews;
- acht zusätzliche tenantgebundene Kernel-V2-API-Routen;
- 48 vertikale Evaluationsszenarien.

Weiterhin geschlossen:

- OpenAI- und Mistral-Livebetrieb;
- Credentials, externe Calls und Providerkosten;
- automatische Entscheidungen und Außenwirkungen.

- ADR: `architecture/ADR-003_AMAVIO_INTELLIGENCE_KERNEL_V1_20261007.md`
- Systemdesign: `architecture/AMAVIO_INTELLIGENCE_KERNEL_SYSTEM_DESIGN_V1_20261007.md`
- API-Vertrag: `architecture/AMAVIO_INTELLIGENCE_KERNEL_API_CONTRACT_V1_20261007.yaml`
- Kernel-QA: `QA/ACC_INTELLIGENCE_KERNEL_V1_QA_20261007.md`
- Kernel-Route-Matrix: `QA/ACC_INTELLIGENCE_KERNEL_ROUTE_MATRIX_V1_20261007.md`
- V2-ADR: `architecture/ADR-004_AMAVIO_INTELLIGENCE_KERNEL_V2_VERTICAL_CAPABILITIES_20261008.md`
- V2-Systemdesign: `architecture/AMAVIO_INTELLIGENCE_KERNEL_SYSTEM_DESIGN_V2_20261008.md`
- V2-API-Vertrag: `architecture/AMAVIO_INTELLIGENCE_KERNEL_API_CONTRACT_V2_20261008.yaml`
- V2-QA: `QA/ACC_INTELLIGENCE_KERNEL_V2_QA_20261008.md`
- V2-Route-Matrix: `QA/ACC_INTELLIGENCE_KERNEL_ROUTE_MATRIX_V2_20261008.md`
- V2-Rückfallbasis: `archive/20261008_kernel_v2_source_baseline/`
- Rückfallbasis: `archive/20261007_intelligence_kernel_source_baseline/`

- Release-Spezifikation: `RELEASE_G_OPERATIONAL_ORCHESTRATION_SPEC_20261007.md`
- Release-QA: `QA/ACC_RELEASE_G_QA_20261007.md`
- Desktop-Konzept: `design/ACC_RELEASE_G_DESKTOP_CONCEPT_20261007.png`
- Mobil-Konzept: `design/ACC_RELEASE_G_MOBILE_CONCEPT_20261007.png`
- Rückfallbasis: `archive/20261007_release_g_source_baseline/`

- Roadmap: `architecture/ACC_PRODUCTIZATION_GATES_02_04_ROADMAP_20261007.md`
- Route-Matrix: `QA/ACC_ROUTE_RESILIENCE_MATRIX_V2_20261007.md`
- Maschinenlesbarer Coverage-Status: `QA/ACC_ROUTE_RESILIENCE_COVERAGE_20261007.json`
- Abschlussbericht: `QA/ACC_PRODUCTIZATION_GATE_02A_QA_20261007.md`
- kostenbewusste Identity-Vorentscheidung: `architecture/IDENTITY_COST_DECISION_20261007.md`
- Usability-Testplan: `usability/USABILITY_TEST_PLAN_20261007.md`
- Moderationsleitfaden: `usability/USABILITY_MODERATION_GUIDE_20261007.md`
- Beobachtungsschema: `usability/USABILITY_OBSERVATION_SCHEMA_20261007.md`
- interner Probelauf: `QA/ACC_MODERATED_USABILITY_REHEARSAL_QA_20261007.md`
- Brandbook-Korrektur-QA: `QA/ACC_MODERATED_USABILITY_BRANDBOOK_QA_20261007.md`
- Founder-Gate Welle 1: `usability/FOUNDER_GATE_WAVE_1_SCOPE_20261007.md`
- Rückfallbasis: `archive/20261007_gate_02_foundation_baseline/`

## Ergebnis

Productization Gate 01.5 `Operational Product Depth & AI Readiness` ist als zusammenhängender lokaler Produktschnitt umgesetzt:

- Release D: kanonische Fallarbeit mit Portfolio, Meilensteinen, Aufgaben, Evidenz, Entscheidung und Verlauf;
- Release E: zehn lokale Fachregeln, Ausnahmen und isolierte Simulation mit Human Gate;
- Release F: sieben belegte Arbeitsprodukte, 24 Evaluationsszenarien und providerneutrale Intelligence-Fähigkeiten;
- OpenAI- und Mistral-Adapter sind strukturell implementiert, aber nicht aktiviert, authentifiziert oder live getestet;
- Gate 02 bleibt bis zu einer separaten Founder-, Datenschutz-, Vertrags- und Budgetentscheidung geschlossen.

Diese datierte Arbeitskopie bewahrt die ruhige Calm-but-Capable-V2-Sprache und erweitert den Gate-01-Systemlauf zu einem tieferen Arrival-Operations-Produkt: API-Backend, persistente SQLite-Datenbank, serverseitiger synthetischer Mandantenkontext, Critical Path, Evidenz, Regeln, Simulation, Human Gate, Audit Trail, Arbeitsprodukte und Evaluation.

Die aktive Fallarbeit lautet:

`Evidenz → Verantwortung → Simulation → Entscheidung → Arbeitsprodukt`

Die technische Sicherheitskette lautet:

`persistierter synthetischer Fall → lokale Fachlogik → belegter Vorschlag → Human Gate → Audit → sink_only`

Externe KI, echte Prognosen, produktive Registrierung, reale Daten, Versand, Buchung, Hosting und automatische Entscheidungen bleiben technisch und fachlich gesperrt.

## Lokal starten

```bash
npm start
```

Dann öffnen:

```text
http://127.0.0.1:4208/?page=operations
```

Moderationskonsole:

```text
http://127.0.0.1:4208/usability/index.html
```

## QA ausführen

```bash
npm test
npm run qa:static
npm run qa:brandbook
npm run qa:browser
npm run qa:usability
npm run qa:all
```

## Aktive Dateien

- `index.html` – ruhige ACC-Arbeitsoberfläche und fünf verbundene Fallstufen
- `assets/runtime-integrity.css` – ruhiger Lade-, Datei- und Fehlerzustand für die lokale Demo
- `assets/runtime-integrity.js` – Protokollgrenze, Health Gate, Retry und verzögertes Laden der Fachlogik
- `assets/calm-capable-v2.css` – Designsystem und responsive Komponenten
- `assets/calm-capable-v2.js` – URL-, History-, Rollen-, Fall- und Arbeitsstufenvertrag der lokalen Demo
- `assets/release-j5.css` – gekoppelte, Brandbook-konforme Operations- und Arbeitgeber-Arbeitsräume
- `assets/release-j5.js` – Arbeitgeberbeitrag, Operations-Prüfung, gemeinsamer Status und bewusstes Lernsignal
- `backend/collaboration.mjs` – mandanten- und rollenbegrenzter Collaboration-Vertrag mit drei API-Routen
- `assets/release-k.css` – editoriale Programmarbeitsfläche für Operations und Arbeitgeber
- `assets/release-k.js` – Programm-Journey, Human-Gate-Simulation, Arbeitgeberentscheidung, Outcome und Arbeitsprodukt
- `backend/program-delivery.mjs` – mandanten- und rollenbegrenztes Program-Delivery-Domänenmodell mit acht API-Routen
- `assets/release-l.css` – ruhige interne Planungsentscheidung ohne sichtbare KI-Modulinszenierung
- `assets/release-l.js` – Evidenzabgleich, Replanning, Programmbrief, Human Gate und Evaluation
- `backend/intelligence-kernel-v3.mjs` – Program Evidence Graph, Policies, Capabilities, Providerstatus und 36er-Harness
- `usability-program/` – achtstufige moderierte synthetische Testkonsole mit lokalem Export
- `architecture/RELEASE_K_PROGRAM_DELIVERY_OS_20261012.md` – Zielbild, Rollenvertrag und Systemgrenzen
- `QA/ACC_RELEASE_K_QA_20261012.md` – datierter Prüf- und Grenznachweis
- `assets/gate-01-5.css` – Operational Workbench, Kontextleiste und responsive Verdichtung
- `assets/release-g.css` – Brandbook-konforme Release-G-Orchestrierung und Responsive-Verhalten
- `assets/release-g.js` – verbundene Fallreise, Kontext, Human Gate und Arrival Readiness Brief
- `assets/release-i.css` – kohortenweite Operations-Twin-Oberfläche, Critical Path und Rollenübergaben
- `assets/release-i.js` – Ereignissteuerung, Arbeitsplan-Human-Gate, Entscheidungsraum und Kohortensimulation
- `backend/operations-twin.mjs` – mandantengebundene Twin-Domäne und sieben Operations-Endpunkte
- `assets/release-j.css` – responsive Lernschleife, Qualitätsmatrix, Versionslineage und Vergleichs-Drawer
- `assets/release-j.js` – Feedback-/Outcome-Bearbeitung, Evaluation, Vergleich und Human-Gate-Interaktion
- `backend/operational-learning.mjs` – persistente Lern-, Evaluations-, Vergleichs- und Versionsdomäne mit zehn Endpunkten
- `backend/intelligence-kernel.mjs` – Orchestrator, Persistenz und Kernel-HTTP-Vertrag
- `backend/role-contract.mjs` – zentraler Rollenvertrag, View Projection und serverseitige Aktionsgrenzen
- `backend/intelligence-kernel-v2.mjs` – V2-Orchestrator für Reconciliation, Replanning und Brief Composer
- `backend/kernel/artifact-store.mjs` – reproduzierbare, tenantgebundene Artefakte und Human-Gate-Reviews
- `backend/kernel/evidence-reconciliation.mjs` – fachlicher Quellenvergleich und Klärungsauftrag
- `backend/kernel/critical-path-replanning.mjs` – isolierte Ereignis- und Fristen-Neuplanung
- `backend/kernel/readiness-brief-composer.mjs` – belegter Brief und sechsteilige Qualitätsrubrik
- `backend/kernel/vertical-capability-evaluation.mjs` – 48 deterministische V2-Szenarien
- `backend/kernel/evidence-graph.mjs` – typisierter, deterministischer Evidence Graph
- `backend/kernel/policy-engine.mjs` – acht zentrale Ausführungs- und Wirkungsgrenzen
- `backend/kernel/capability-registry.mjs` – vier providerunabhängige AMAVIO-Capabilities
- `backend/kernel/human-gate.mjs` – begründungspflichtiger Advisory-Review-Vertrag
- `backend/kernel/evaluation-harness.mjs` – 34 lokale Kernel-Szenarien
- `backend/server.mjs` – lokaler Server, Gate-01-Kompatibilität und SQLite-Laufzeit
- `backend/gate-01-5.mjs` – Domänenmodell, Regeln, Simulation, Arbeitsprodukte und Evaluation
- `backend/provider-adapters.mjs` – lokaler Provider sowie geschlossene OpenAI-/Mistral-Adapter
- `architecture/ADR-005_RELEASE_H_ROLE_CONTRACT_VIEW_PROJECTION_20261008.md` – Architekturentscheidung zur echten Rollentrennung
- `architecture/AMAVIO_ACC_ROLE_CONTRACT_V1_20261008.md` – Rollen-, Sicht- und Aktionsvertrag
- `QA/release-h-role-contract.test.mjs` – API-Projektions- und Negativtests
- `QA/release-h-browser-check.js` – Desktop-/Mobile-Journeys für alle fünf Rollen
- `architecture/ACC_PRODUCTIZATION_GATE_01_20261007.md` – technische, fachliche und rechtliche Produktentscheidung
- `architecture/ACC_API_CONTRACT_V1_20261007.yaml` – versionierter API-Vertrag
- `architecture/ACC_API_CONTRACT_V1_5_20261007.yaml` – Gate-01.5-API- und Sicherheitsvertrag
- `architecture/AI_PROVIDER_ADAPTER_IMPLEMENTATION_20261007.md` – Providerstatus und Aktivierungsgates
- `architecture/FOUNDER_DECISIONS_GATE_02_20261007.md` – Entscheidungen für den ersten externen KI-Sandbox-Test
- `architecture/ACC_PRODUCTIZATION_GATE_01_5_OPERATIONAL_DEPTH_PLAN_20261007.md` – Zielbild und umgesetzter vertikaler Schnitt
- `QA/ACC_PRODUCTIZATION_GATE_01_QA_20261007.md` – datierter Gate-01-Prüfnachweis
- `QA/ACC_GATE_01_5_ACCEPTANCE_MATRIX_20261007.md` – verbindliche Abnahme- und Sicherheitsmatrix für Releases D–F
- `QA/ACC_PRODUCTIZATION_GATE_01_5_QA_20261007.md` – aktueller Test-, Visual- und Grenznachweis
- `design/ACC_GATE_01_5_OPERATIONAL_WORKBENCH_REFERENCE_20261007.png` – freigegebene visuelle Arbeitsreferenz
- `CALM_CAPABLE_V2_SPEC_20261003.md` – Produkt- und Architekturentscheidung
- `QA/ACC_CALM_CAPABLE_V2_QA_20261003.md` – datierter Prüfnachweis
- `design/ACC_CALM_CAPABLE_V2_DESKTOP_REFERENCE_20261003.png` – Desktop-Referenz
- `design/ACC_CALM_CAPABLE_V2_MOBILE_REFERENCE_20261003.png` – Mobil-Referenz
- `archive/20261007_gate_01_5_implementation_baseline/` – datierte Implementierungsrückfallbasis
- `archive/20261007_release_g_source_baseline/` – unveränderte Ausgangsbasis dieser Release-G-Arbeitskopie
- `archive/20261007_intelligence_kernel_source_baseline/` – unveränderte Release-G-Ausgangsbasis für Kernel V1

Die bisherigen V1- und Release-A/B/C-Dateien bleiben im Ordner erhalten, werden von der aktiven `index.html` aber nicht geladen.

## Harte Grenze

ACC bleibt die Arbeitgeber-/AMAVIO-Oberfläche. Fachkraft, Wohnanbieter und lokaler Partner gehören weiterhin zur getrennten AMAVIO One App. Die lokale Demo-Sitzung ist keine produktive Authentifizierung; SQLite ist keine freigegebene Produktionsdatenbank. Produktive Architektur, Datenschutz, Security, Hosting, Vertragsmodell, Datenquellen, Authentifizierung, Mandantentrennung, externer KI-Anbieter, Außenkanäle und Betrieb brauchen separate Founder-Gates.
