# ACC – lebender priorisierter Backlog

**Stand:** 13.10.2026  
**Produktgrenze:** nur Arbeitgeber- und AMAVIO-Steuerungsdemo; separate App bleibt außerhalb

**Namenshinweis:** `Productization Gate 01/01.5/02` bezeichnet die technische Produktreife. Die weiter unten erhaltenen `GATE-01` bis `GATE-04` sind ältere Governance-/Freigabegates für Präsentation, externe Validierung, produktive Architektur und Veröffentlichung; sie öffnen kein Productization Gate automatisch.

## Aktiv – Release Q True Workspaces

- **Founder-Befund:** P.3 trennt die Produktoberflächen visuell, aber Arbeitsbereiche, Tabs und Seiten verändern die tatsächliche Arbeit noch nicht ausreichend.
- **Ziel:** zwei echte Rollenarbeitsplätze und funktionsspezifische Arbeitgeberprojektionen auf demselben kontrollierten synthetischen Fallzustand.
- **Arbeitskopie:** `20261013_AMAVIO_ACC_Release_Q_True_Workspaces_Working` auf Port 4220; P.3 auf Port 4219 bleibt unverändert.
- **Arbeitgeber:** vier fachlich unterschiedliche Perspektiven sowie getrennte Ziele für Übersicht, Entscheidungen, Aufträge und Ergebnisse.
- **Operations:** Arbeitsvorrat, aktive Aufträge, Übergabebereit und Leistungsnachweise als vier eigenständige Aufgaben; fünf Register innerhalb der Auftragsakte.
- **Geschlossene Reise:** `Entscheidung → Auftrag → Übernahme → Aufgaben/Nachweise → Abschluss → Dossier → Ergebnisbrief`.
- **Qualität:** 337/337 Regressionstests; Static-, Brandbook-, Browser-, Responsive-, Interaktions-, Konsolen- und Netzwerk-QA grün.
- **Grenzen:** 0 Provideraufrufe; keine echten Daten, produktive Identity, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme der tatsächlichen Aufgabenunterschiede und der vollständigen Golden Journey; danach nur gezielte Korrektur auf neuer datierter Basis oder ein neu freigegebener fachlicher Release.

## Erhalten – Release P.3 Dual Product Surfaces

- **Founder-Befund:** Fachlogik unterschiedlich, Produktwahrnehmung durch dasselbe visuelle Grundgerüst weiterhin zu ähnlich.
- **Ziel:** Arbeitgeberportal und AMAVIO Operations als zwei sofort unterscheidbare Produktoberflächen auf demselben kontrollierten Fallzustand führen.
- **Arbeitskopie:** `20261013_AMAVIO_ACC_Release_P3_Dual_Product_Surfaces_Working` auf Port 4219; P.2 auf Port 4218 bleibt unverändert.
- **Umgesetzt:** eigener Arbeitgeber-Masthead ohne Seitenleiste; eigene Operations-Shell mit dunkler Navigation, Queue, Workbench und Kontext; gemeinsame Golden Journey unverändert.
- **Qualität:** 337/337 Regressionstests; Static-, Brandbook-, Browser-, Responsive-, Interaktions-, Rollen- und Netzwerk-QA grün.
- **Grenzen:** 0 Provideraufrufe; keine echten Daten, produktive Identity, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme, ob beide Oberflächen ohne Erklärung als Arbeitgeberportal beziehungsweise Operations-Konsole erkannt werden.

## Erhalten – Release P.2 Role Separation & Usable Work Products

- **Founder-Befund:** Leistungsumfang verständlich; Rollentrennung und Arbeitsprodukte in P.1 nicht ausreichend.
- **Ziel:** Arbeitgebersteuerung und AMAVIO-Ausführung als zwei unterschiedliche Aufgabenmodelle mit getrennten Dokumentenverträgen umsetzen.
- **Arbeitskopie:** `20261013_AMAVIO_ACC_Release_P2_Role_Separation_Work_Products_Working` auf Port 4218; P.1 auf Port 4217 bleibt unverändert.
- **Umgesetzt:** getrennte Navigationen, Arbeitgeber-Entscheidungsposteingang, Auftrags- und Ergebnisregister, Operations-Arbeitsvorrat, Nachweis-Workbench und vier rollenspezifische Arbeitsprodukte.
- **Qualität:** 337/337 Regressionstests; Static-, Brandbook-, Browser-, Responsive-, Interaktions-, Rollen- und Netzwerk-QA grün.
- **Grenzen:** 0 Provideraufrufe; keine echten Daten, produktive Identity, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme nur der sichtbar unterschiedlichen Rollenarbeit und der Nutzbarkeit der vier Arbeitsprodukte.

## Erhalten – Release P.1 Service Delivery Proof

- **Founder-Befund:** Geschäftsproblem und Optionen bestätigt; sichtbare AMAVIO-Leistung, Rollentrennung und Arbeitsprodukte noch nicht vollständig abgenommen.
- **Ziel:** aus der gewählten Option einen verbindlichen, nachvollziehbaren Leistungsauftrag mit getrennter Ausführung und prüfbarer Ergebnisübergabe machen.
- **Arbeitskopie:** `20261013_AMAVIO_ACC_Release_P1_Service_Delivery_Proof_Working` auf lokalem Port 4217; Release P auf Port 4216 bleibt unverändert.
- **Umgesetzt:** Leistungsauftrag, fixierte Arbeitgeberentscheidung, sichtbare Übergabe an AMAVIO, eigener Operations-Ausführungsraum, evidenzpflichtige Schritte, Ergebnisrückgabe sowie versionierte und druckbare Arbeitsprodukte.
- **Geschlossene Reise:** `Entscheidung → Auftrag → Übernahme → Ausführung → Evidenz → Ergebnisübergabe → Arbeitsprodukt`.
- **Rollen:** Arbeitgeber-Gesamtsteuerung entscheidet und übergibt; AMAVIO Operations führt aus und belegt; weitere Arbeitgeberbereiche verfolgen nur gemeinsame Mitwirkung und Status.
- **Technik:** lokale SQLite-Auftrags- und Schrittdomäne, optimistische Versionen, Idempotenz, Entscheidungssperre und fail-closed Abschlussbedingung.
- **Assurance:** 85 Routen und 51 Mutationen mit Tenant-, Rollen-, Idempotenz-, Fuzz-, Concurrency- und Failure-Injection-Prüfung.
- **Kosten und Grenzen:** 0 EUR; 0 Provideraufrufe; keine echten Daten, produktive Identity, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme der drei vormals offenen Punkte 3–5 am Unterkunftsfall. Erst danach Übertragung des vollständigen Service-Delivery-Musters auf weitere priorisierte Fälle oder gezielte Korrektur auf neuer Rückfallbasis.

## Erhalten – Release O Pilot-Ready Operational Core

- **Ziel:** die vorhandene Produkttiefe als eine geschlossene, verständliche und wiederholbar prüfbare operative Fallsteuerung nutzbar machen.
- **Arbeitskopie:** `20261013_AMAVIO_ACC_Release_O_Pilot_Ready_Operational_Core_Working` auf lokalem Port 4215; Release N auf Port 4214 bleibt unverändert.
- **Umgesetzt:** ein aktiver UI-Kern, vollständige Golden Journey, drei Ausnahmewege, fachliche Arbeitsprodukte, Suche/Filter, Rollenübergabe, Terminsimulation, Human Gate, Pilotmessung und reproduzierbarer Reset.
- **Technische Konsolidierung:** aktive Laufzeit von zehn Release-Skripten und vierzehn Stylesheet-Schichten auf ein Runtime-Skript, ein Produktstylesheet und lokale Fonts reduziert; vorhandene Backend-Domänen bleiben erhalten.
- **Golden Journey:** `Lage klären → Verantwortung sichern → Wirkung prüfen → Entscheidung dokumentieren → Ergebnis übergeben`.
- **Pilotkriterien:** Aufgabenerfolg, Bearbeitungszeit, Übergabelatenz, Nacharbeit und Evidenzvollständigkeit; noch keine reale Effizienz- oder Wirksamkeitsbehauptung.
- **Qualität:** 298/298 Node-Tests; Release-O-Static-, Brandbook- und Browser-QA grün; vollständige Journey sowie Desktop 1440, Tablet 820 und Mobil 390 Pixel ohne externe Requests geprüft.
- **Kosten und Grenzen:** 0 EUR; 0 Provideraufrufe; keine echten Daten, produktive Identity, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** moderierter synthetischer Pilotdurchlauf mit klarer Beobachtungsmatrix; erst danach gezielte Produktkorrekturen auf einer neuen datierten Rückfallbasis.

## Erhalten – Release N Employer Workspace

- **Ziel:** eine verständliche, eigenständige Arbeitgeber-Arbeitsoberfläche schaffen, die fachliche Tiefe nicht durch Weglassen, sondern durch Hierarchie, Zuständigkeit und progressive Offenlegung ordnet.
- **Arbeitskopie:** `20261013_AMAVIO_ACC_Release_N_Employer_Workspace_Working` auf lokalem Port 4214; Release M auf Port 4213 bleibt unverändert.
- **Umgesetzt:** verständliche Funktionsbereiche, klarer Aufgabenraum, nur bearbeitbare Vorgänge, begründete Beiträge, sichtbare Folge und vollständiger gemeinsamer Programmraum.
- **Produktlogik:** `Arbeitsbereich → eigener Vorgang → Grundlage und Folge → bewusste Entscheidung → gemeinsamer Status`; vollständiger Programmstand getrennt unter „Ankunftsprogramme“.
- **Technische Kontinuität:** interne Rollenkennungen, Tenantgrenzen, Idempotenz, Human Gates, lokale Ausführungslogik und Null-Außenwirkung bleiben erhalten.
- **Qualität:** 296/296 Node-Tests; vollständige Static-, Brandbook-, Browser-, Responsive-, Accessibility-, Interaktions- und Usability-Regression grün; gezielte Release-N-Prüfung auf 1440, 820 und 390 Pixeln grün.
- **Kosten und Grenzen:** 0 EUR; keine externen Calls, echten Daten, produktive Identity, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme genau der beiden Arbeitgeberziele und der vier Arbeitsbereiche; danach nur konkret benannte fachliche oder visuelle Korrekturen auf einer neuen datierten Basis.

## Erhalten – Release L.1 Web Fidelity

- **Ziel:** die bereits freigegebene visuelle Qualität des Programmraums und der Planungsentscheidung konsequent auf den Web-Einstieg „Fälle“ übertragen und die wahrgenommene Überladung reduzieren.
- **Arbeitskopie:** `20261013_AMAVIO_ACC_Release_L1_Web_Fidelity_Working` auf lokalem Port 4211; Release L auf Port 4210 bleibt unverändert.
- **Umgesetzt:** Portfolio-Kopf, priorisierte Arbeitsliste, fokussierte Fallvorschau und bewusster Übergang in die vollständige Fallarbeit.
- **Informationsarchitektur:** `Portfolio → Auswahl → Vorschau → vollständige Fallarbeit`; keine Fachfunktion entfernt.
- **Qualität:** 274/274 Node-Tests sowie Static-, L.1- und Brandbook-QA grün; HTML, CSS und Health-Endpunkt liefern HTTP 200 beziehungsweise Status `ok`.
- **Visuelle Grenze:** automatisierte Browserbindung wurde durch die lokale Browser-Sicherheitsrichtlinie blockiert; deshalb ist die Founder-Sichtprüfung auf Port 4211 der nächste echte Abnahmepunkt.
- **Kosten und Grenzen:** 0 EUR; keine externen Calls, echten Daten, produktive Identity, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme der neuen Fallzentrale auf Desktop und Mobil; danach nur gezielte visuelle Korrekturen auf dieser datierten Basis.

## Erhalten – Release J.5 Dual-Sided Workflow

- **Ziel:** AMAVIO Operations und Arbeitgeber als zwei eigenständige, aber fachlich gekoppelte Arbeitsräume statt als nahezu identische Ansichten führen.
- **Arbeitskopie:** `20261010_AMAVIO_ACC_Release_J_5_Dual_Sided_Workflow_Working` auf lokalem Port 4208; Release J.4.1 auf Port 4207 bleibt unverändert.
- **Operations:** vollständige interne Fallsteuerung plus separater Arbeitgeberbeitrags-Eingang und begründungspflichtige Fachprüfung.
- **Arbeitgeber:** eigener Mitwirkungsraum mit rollenminimiertem Fallbestand, aktueller Aufgabe, bewusstem Beitrag, Übergabeverlauf und gemeinsamem Status.
- **Lernkopplung:** Ergebnisrückmeldungen werden nur nach expliziter Operations-Auswahl als internes Lernsignal angelegt; keine automatische Aktivierung oder Außenwirkung.
- **Rollenvertrag:** Sponsor, HR Operations, Standort und Budget behalten getrennte serverseitige Projektionen; interne Lern-, Kernel-, Twin-, Audit- und Simulationsdomänen bleiben gesperrt.
- **Qualität:** 210/210 Node-Tests; 54 Routen und 31 Mutationen in der vollständigen 02A-Matrix; Idempotenz, Fuzzing, Concurrency und Failure Injection einschließlich Collaboration grün; vollständige Static-, Brandbook-, Desktop-, Mobile-, Accessibility-, Rollen-, Netzwerk- und Usability-Regression grün.
- **Kosten und Grenzen:** 0 EUR; keine externen Calls, echten Daten, produktive Identity, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme der Arbeitgeberreise und der sichtbaren Übergabe zu Operations; anschließend höchstens priorisierte fachliche Korrekturen auf neuer Rückfallbasis.

## Erhalten – Release J.4.1 Runtime Clarity

- **Ziel:** den lokalen Ersteindruck, den direkten Datei-Hinweis und den Serverfehler mit höherem Kontrast, klarer Hierarchie und einem einheitlichen Zwei-Schritt-Ablauf verständlich machen.
- **Arbeitskopie:** `20261010_AMAVIO_ACC_Release_J_4_1_Runtime_Clarity_Working` auf lokalem Port 4207; Release J.4 auf 4206 bleibt unverändert.
- **Founder-Befund:** lokaler Servereinstieg grundsätzlich verständlich, aber unübersichtlich und teilweise schwer lesbar; Reload und Browser-Zurück bestätigt; Datei-Hinweis und Serverfehler noch nicht vollständig verständlich.
- **Umgesetzt:** einheitliche Startlogik, zwei konkrete Handlungsschritte, eine primäre Aktion, sichtbarer Demorahmen, präzisere Fehlersprache, stärkere Sekundärtextfarben und höhere Mindestschriftgrößen.
- **Unverändert:** Fachlogik, Rollenvertrag, Deep Links, History, Reload, Fall- und Arbeitsstufenwiederherstellung.
- **Qualität:** 196/196 Node-Tests sowie Static-, Brandbook-, Runtime-Clarity-, Release-G/H/I/J.3-, Desktop-, Mobile-, Accessibility-, Rollen-, Netzwerk- und Usability-QA vollständig grün; 51 Routen und 29 Mutationen abgedeckt; keine externen Requests.
- **Kosten und Grenzen:** 0 EUR; keine externen Calls, echten Daten, produktive Identity, Integration, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme ausschließlich von Lesbarkeit, Startübersicht, Datei-Hinweis und Serverfehler.

## Erhalten – Release J.4 Runtime & Navigation Integrity

- **Ziel:** den Unterschied zwischen statischer HTML-Datei und vollständig laufender lokaler Anwendung schließen sowie Browseradresse und sichtbaren Arbeitszustand reproduzierbar verbinden.
- **Arbeitskopie:** `20261009_AMAVIO_ACC_Release_J_4_Runtime_Navigation_Integrity_Working` auf lokalem Port 4206; Release J.3 auf 4205 bleibt unverändert.
- **Umgesetzt:** File-Protokoll-Sperre mit lokalem Startpfad; Health Gate vor Laden der Fachlogik; geschlossener Fehlerzustand und Retry; Deep Links; Browser-History; Reload-Wiederherstellung für Seite, Rolle, Arbeitgeberperspektive, Basisfall/-stufe und operativen Fall/-stufe.
- **Zusatzkorrektur:** Seitenumschaltung auf echte `main .page`-Elemente begrenzt; der Dokumentkörper wird nicht mehr irrtümlich als Inhaltsseite behandelt.
- **Qualität:** 196/196 Node-Tests sowie Static-, Brandbook-, Runtime-, Release-G/H/I/J.3-, Desktop-, Mobile-, Accessibility-, Rollen-, Netzwerk- und Usability-QA vollständig grün; 51 Routen und 29 Mutationen abgedeckt; keine externen Requests.
- **Kosten und Grenzen:** 0 EUR; keine externen Calls, echten Daten, produktive Identity, Integration, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme von direktem Einstieg, Reload/History und den zwei verständlichen Grenzzuständen. Danach keine weitere UI-Ausweitung ohne fachlichen Produktauftrag.

## Erhalten – Release J.3 Guided Learning

- **Ziel:** Rückmeldungsarbeit als verständlichen Drei-Schritt-Ablauf führen, Qualitätsprüfung als eigene Operations-Arbeitsfläche trennen und technische Innendaten vollständig aus der Bedienoberfläche entfernen.
- **Arbeitskopie:** `20261008_AMAVIO_ACC_Release_J_3_Guided_Learning_Working` auf lokalem Port 4205; Release J.2 auf 4204 bleibt unverändert.
- **Founder-Befund:** Ruhe der J.2-Ansicht bestätigt; Links-/Rechts-Logik noch nicht eindeutig, Qualität und Version nicht ausreichend getrennt, technische Details weiterhin an der falschen Stelle.
- **Umgesetzt:** sichtbarer Weg `Auswählen → Ergebnis klären → Anpassung festhalten`; Standardfilter „Offen“; eigenständige Seite „Qualitätsprüfung“; technikfreier Vergleichsdialog; verständliche fachliche Änderungserklärung.
- **Technische Grundlage:** unveränderte lokale Release-J-Fachlogik, 24 synthetische Prüffälle, fünf Qualitätsdimensionen, Human Gate und Audit Trail.
- **Qualität:** 196/196 Node-Tests sowie Static-, Brandbook-, Release-G/H/I/J.3-, Desktop-, Mobile-, Accessibility-, Rollen-, Netzwerk- und Usability-QA grün; keine externen Requests.
- **Kosten und Grenzen:** 0 EUR; keine externen Calls, echte Daten, produktive Identity, Integration, Veröffentlichung oder Deployment.
- **Status:** Founder-Abnahme der drei korrigierten Punkte Führung, Trennung und Platzierung interner Details bestätigt; als unveränderte Rückfallfassung auf Port 4205 erhalten.

## Erhalten – Release J.2 Operator Focus

- **Ziel:** die volle Release-J-Fachlogik in eine verständliche, luftige Operator-Journey mit progressiver Offenlegung übersetzen.
- **Arbeitskopie:** `20261008_AMAVIO_ACC_Release_J_2_Operator_Focus_Working` auf lokalem Port 4204; Release J auf 4203 bleibt unverändert.
- **Umgesetzt:** zwei Arbeitsmodi statt vier gleichzeitig sichtbarer Bereiche; verständliche Fallbezüge; fokussierter Rückmeldungseditor; technische Details nur auf Anforderung; vereinfachte Qualitäts- und Versionsansicht; mobile Kartenansicht statt Mikro-Tabelle.
- **Behoben:** Text-Clipping, horizontal verschobene Rückmeldungsspalte, zu kleine Typografie, enge Feldabstände und sichtbare interne IDs/Providerinformationen.
- **Qualität:** 196/196 Node-Tests, 165/165 Assurance-Tests, Static-, Brandbook-, Desktop-, Mobile-, Accessibility-, Rollen- und Netzwerk-QA grün.
- **Kosten und Grenzen:** 0 EUR; keine externen Calls, echte Daten, produktive Identity, Integration, Veröffentlichung oder Deployment.
- **Nächster Gate-Punkt:** Founder-Abnahme der beiden Ansichten und der reduzierten Informationshierarchie. Keine neue Funktion vor dieser Layoutabnahme.

## Erhalten – Release J Operational Learning & Evaluation Loop

- **Ziel:** operative Beobachtung, tatsächliches Outcome, reproduzierbare Qualität, Policy-/Capability-Version und menschliche Entscheidung zu einem belastbaren Lernzyklus verbinden.
- **Arbeitskopie:** `20261008_AMAVIO_ACC_Release_J_Operational_Learning_Loop_Working` auf lokalem Port 4203; Release I auf 4202 bleibt unverändert.
- **Umgesetzt:** sechs strukturierte Feedbackeinträge, fünf bereits zugeordnete Outcomes, neue Feedback-/Outcome-Erfassung, fünf Qualitätsdimensionen, 24 synthetische Fixtures, Outcome-Vergleich, Policy-Diff, Fingerprints, vier Versionslinien und begründungspflichtiger Human-Gate-Review.
- **Technik:** zehn neue Operations-only-Routen, vier persistente Lerndomänentabellen, 51 Routen/29 Mutationen in der vollständigen Assurance Registry, optimistische Versionen, Idempotenz und Audit Trail.
- **Produktwirkung:** AMAVIO erhält eine eigene reproduzierbare Qualitätsbasis vor jedem Providerentscheid; spätere Adapter werden austauschbar gegen dieselben Fixtures und Verträge verglichen.
- **Qualität:** 196/196 Node-Tests, 165/165 Assurance-Tests, Static-, Desktop-, Mobile-, Accessibility-, Rollen- und Netzwerk-QA grün.
- **Kosten:** 0 EUR; Provideradapter deaktiviert, 0 Calls, keine Credentials, kein Konto und kein Live-Test.
- **Grenze:** kein Modelltraining, keine automatische Aktivierung, keine echte Identity, reale Daten, Integration, Veröffentlichung, Deployment oder Außenwirkung.
- **Nächster Gate-Punkt:** Founder-Abnahme der Feedbacktaxonomie, Qualitätsmetriken, Versionslogik und Vergleichsverständlichkeit. Erst danach kann Release K als lokales Scenario Lab/Evaluation Dataset geplant werden; ein Live-Provider bleibt separat geschlossen.

## Erhalten – Release I Operations Twin

- **Ziel:** nicht weitere Einzelfunktionen ergänzen, sondern Ereignis, Fallabhängigkeiten, Verantwortung, Simulation und Entscheidung kohortenweit in einem operativen Steuerungssystem verbinden.
- **Arbeitskopie:** `20261008_AMAVIO_ACC_Release_I_Operations_Twin_Working` auf lokalem Port 4202; Release H auf 4201 bleibt unverändert.
- **Umgesetzt:** fünf priorisierte Ereignisse, zwölf geplante Anreisen, fünf operative Fälle, vier visualisierte kritische Pfade, fünf Rollenübergaben, ereignisbezogene Arbeitspläne, Human-Gate-Review, Entscheidungsraum und isolierte Kohortensimulation.
- **Technik:** sieben neue tenantgebundene Twin-Routen, vier persistente Domänentabellen, Idempotenz, Versionskonflikt und Audit Trail.
- **Produktwirkung:** von der reinen Fallreise zur kohortenweiten Leitstelle; Intelligence bleibt eingebettet und wird nicht als dominantes KI-Modul inszeniert.
- **Kosten:** 0 EUR; lokale deterministische Logik, kein Providerkonto, keine externe Anfrage.
- **Grenze:** keine echte Identity, realen Daten, produktive Automatisierung, Nachricht, Buchung, Integration, Veröffentlichung oder Deployment.
- **Status:** als funktionale Grundlage von Release J erhalten; Port 4202 und Arbeitskopie bleiben unverändert.

## Erhalten – Release H Role Contract & View Projection

- **Ziel:** AMAVIO Operations, Sponsor, HR, Standort und Budget fachlich wie technisch unterschiedlich nutzbar machen.
- **Arbeitskopie:** `20261008_AMAVIO_ACC_Release_H_Role_Contract_View_Projection_Working` bleibt unverändert auf lokalem Port 4201.
- **Umgesetzt:** fünf synthetische Rollenverträge, serverseitige Portfolio-/Fallprojektionen, Rollenjourneys, Aufgaben-/Beleg-/Entscheidungsrechte und Fail-closed-Negativsperren.
- **Fallzuschnitt:** Operations 5, Sponsor 5 verdichtet, HR 1, Standort 2, Budget 1 eigener synthetischer Budgetfall.
- **Qualität:** 137/137 Tests, bestehende 34-Routen-Assurance, sechs Release-G-Browserbreiten, Desktop-/Mobile-Rollenmatrix, Brandbook, Accessibility-Basis und Usability-Regression vollständig grün.
- **Kosten:** 0 EUR; keine produktive Identity und kein externer Provider aktiviert.
- **Grenze:** lokale synthetische Sitzung ist kein produktives Authentifizierungs- oder Security-System.
- **Nächster sinnvoller Schritt:** gemeinsame Founder-Abnahme der fünf Rollenjourneys. Danach nur gezielte Korrekturen auf neuer datierter Rückfallbasis; produktive Identity/RBAC bleibt ein separates Gate.

## Erhaltene Basis – AMAVIO Intelligence Kernel V2

- **Ziel:** drei vertikale Fachfähigkeiten in die bestehende operative Fallreise integrieren, ohne Providerabhängigkeit oder sichtbare KI-Modulfläche.
- **Arbeitskopie:** `20261008_AMAVIO_ACC_Intelligence_Kernel_V2_Vertical_Capabilities_Working` bleibt unverändert auf lokalem Port 4200 erhalten.
- **Capabilities:** Evidence Reconciliation, Critical-Path Replanning und Arrival Readiness Brief Composer.
- **Artefaktvertrag:** deterministisch, reproduzierbar, tenantgebunden, versioniert, advisory-only und Human-Gate-pflichtig.
- **Qualität:** 134/134 Tests, 34/34 Routen, 48/48 V2-Evaluationen, sechs Browserbreiten, Brandbook und Usability vollständig grün.
- **Kosten:** 0 EUR; kein externer Provider aktiviert oder aufgerufen.
- **Nächster sinnvoller Gate-Punkt:** Founder-Abnahme der drei Arbeitsabläufe und ihrer Fachsprache. Danach erst Evaluationsdatensatz und Capability-Versionierung ausbauen; Live-Provider bleibt separat geschlossen.

## Erhaltene Basis – AMAVIO Intelligence Kernel V1

- **Ziel:** AMAVIO-Fachintelligenz als eigene providerunabhängige Schicht unter Release G etablieren.
- **Arbeitskopie:** `20261007_AMAVIO_ACC_Intelligence_Kernel_V1_Working` auf lokalem Port 4199.
- **Module:** Evidence Graph, Policy Engine, Capability Registry, Evaluation Harness, Provider Boundary und Human-Gate-Vertrag.
- **Capabilities:** `case.orchestrate`, `evidence.resolve_conflict`, `simulation.explain_impact`, `brief.compose`.
- **Integration:** bestehende Release-G-Kontextleiste nutzt Kernel-Kontext mit sicherem lokalem Fallback; kein sichtbares KI-Modul.
- **Sicherheit:** lokal, synthetisch, tenantgebunden, belegt, idempotent, advisory-only und ohne Außenwirkung.
- **Provider:** lokal aktiv und kostenfrei; OpenAI/Mistral implementiert, aber Gate geschlossen, nicht authentifiziert und nicht live getestet.
- **Status:** unverändert als V1-Ausgangsbasis erhalten; V2 arbeitet ausschließlich in der neuen datierten Kopie.
- **Nächstes Gate:** Founder-Bewertung der Kernel-Verträge und Priorisierung der nächsten Capability-Ausbaustufe; keine Live-Provider-Aktivierung in V1.

## Aktiv – Release G Operational Orchestration

- **Ziel:** Evidenz, Verantwortung, Simulation, Entscheidung und Arbeitsprodukt als eine verständliche, auditierbare Fallreise verbinden.
- **Arbeitskopie:** `20261007_AMAVIO_ACC_Release_G_Operational_Orchestration_Working` auf lokalem Port 4198.
- **Vertikaler Schnitt:** vier synthetische Fälle, drei Startbelege, fünf Meilensteine, zehn Fachregeln, isolierte Simulation, Human Gate und ein belegter `Arrival Readiness Brief`.
- **Oberflächenentscheidung:** ruhige Brandbook-V2-Arbeitsoberfläche; lokale Fachlogik bleibt kontextbezogen und wird nicht als dominantes KI-Modul inszeniert.
- **Rückfallbasis:** `archive/20261007_release_g_source_baseline/`; laufende Demo auf Port 4197 bleibt unverändert.
- **Status:** am 07.10.2026 lokal implementiert; 78/78 Tests, Static-/Brandbook-QA, sechs Browserbreiten, vollständige Journey, 24/24 Evaluationen und Usability-Regression grün.
- **Grenze:** keine Providerkosten, externe KI, Identity, reale Daten, Integration, Veröffentlichung, Deployment oder Außenwirkung.
- **Nächster Gate-Punkt:** Founder-Bewertung der Release-G-Gesamtwirkung; erst danach Planung des providerunabhängigen AMAVIO Intelligence Kernel.

## Abgeschlossen – Productization Gate 02A Assurance Core

- **Ziel:** vollständige Fuzz-, Concurrency-, Idempotenz-, Failure-Injection-, Tenant- und Recovery-Matrix für jede API-Route.
- **Arbeitskopie:** `20261007_AMAVIO_ACC_Productization_Gate_02_Foundation_Working`.
- **Status:** am 07.10.2026 vollständig lokal implementiert; 20/20 Routen, 13/13 Mutationen, 78/78 Tests, Static QA und sechs Browserbreiten grün.
- **Keine Parallelfreigabe:** produktive Identity, reale Daten, externe Connectoren, Hosting, Usability-Einladungen und Live-Provider bleiben separate Folgegates.
- **Plan:** `architecture/ACC_PRODUCTIZATION_GATES_02_04_ROADMAP_20261007.md`.
- **Matrix:** `QA/ACC_ROUTE_RESILIENCE_MATRIX_V2_20261007.md`.

## Aktiver nächster Fokus – moderierter synthetischer Usability-Test

- **Ziel:** Verständlichkeit und Nutzbarkeit der sechs operativen Kernaufgaben prüfen, bevor Identity-, Hosting- oder Integrationskosten entstehen.
- **Scope:** ausschließlich synthetische Fälle, lokale Arbeitskopie auf Port 4196, keine reale Registrierung und keine Außenwirkung.
- **Vorbereitung lokal zulässig:** Moderationsleitfaden, sechs Aufgaben, Erfolgs-/Zeit-/Verständnismaße, Beobachtungsbogen, Schweregrade und Auswertungsformat.
- **Weiterhin geschlossen:** externe Einladung, Terminierung oder Aufzeichnung ohne neue Founder-Freigabe; Identity-/Hostingkonto; Live-Provider; reale Daten oder Integrationen.
- **Identity-Kostenentscheidung:** jetzt 0 EUR durch lokale Demo-Sitzungen; Supabase Free lediglich als späterer EU-Staging-Favorit dokumentiert, nicht aktiviert.
- **Vorbereitung abgeschlossen:** eigenständige Moderationskonsole mit sechs Aufgaben, Timer, Hilfestufen, SEQ, Fehlerzahl, Beobachtung/Aussage/Interpretation, P0–P2, lokaler Auswertung sowie JSON-/CSV-Export implementiert und intern browsergeprüft.
- **Interner Probelauf:** technisch grün; kein Ersatz für eine Session mit menschlicher teilnehmender Person.
- **Jetzt benötigt:** Founder benennt die erste rein synthetische Testwelle und gibt externe Einladung beziehungsweise Terminierung ausdrücklich frei. Bis dahin keine Kontaktaufnahme.

## Aktiver Founder-Review – Productization Gate 01.5

- **Entscheidung:** Vor einem externen AI Provider wird die operative Produkttiefe lokal und deterministisch aufgebaut.
- **Ziel:** ein vollständiges Arrival-Operations-Produkt mit kanonischer Fallarbeit, Abhängigkeiten, Evidenz, Ausnahmen, Simulationen, Arbeitsprodukten und Evaluation.
- **Releases:** D `Operational Case Workbench`, E `Exceptions, Automation & Simulation`, F `Work Products, Evidence & Evaluation`.
- **Umsetzungsplan:** `architecture/ACC_PRODUCTIZATION_GATE_01_5_OPERATIONAL_DEPTH_PLAN_20261007.md`.
- **Freigabematrix:** `QA/ACC_GATE_01_5_ACCEPTANCE_MATRIX_20261007.md`.
- **Status:** Releases D–F am 07.10.2026 in der neuen datierten Arbeitskopie als zusammenhängende lokale Founder-Evaluationsfassung implementiert; automatisierte API-, Browser-, Responsive-, Accessibility-Basis- und Interaktions-QA grün.
- **Umgesetzt:** 8 Fälle/2 Mandanten, kanonische Fallakte, 5-stufiger Critical Path, 10 Regeln, Evidenzkonflikt, Ausnahmebearbeitung, Simulation mit Human Gate, 7 Arbeitsprodukttypen, 24 Evaluationsszenarien und providerneutraler Capability-Vertrag.
- **Grenze:** ausschließlich synthetische Daten und lokale Fachlogik; OpenAI/Mistral nur als geschlossene Adapter ohne Konto, Authentifizierung, Live-Test, Providerkosten, produktive Integration, Außenwirkung, Veröffentlichung oder Deployment.
- **Jetzt benötigt:** Founder-Bewertung von Verständlichkeit, Nutzen, Dichte und Richtung; danach nur gezielte Korrekturen auf einer neuen Rückfallbasis.
- **Gate 02:** External Assistance Sandbox bleibt geschlossen. Die implementierten Adapter öffnen weder Provider-, Datenschutz-, Vertrags- noch Kostenfreigabe.

## Aktiver Stand – Productization Gate 01

- **Ziel:** aus der rein statischen Konzeptlogik einen echten, kontrollierten lokalen Systemlauf machen.
- **Umgesetzt:** API-Backend, SQLite-Persistenz, synthetischer Tenant-Kontext, strukturierter Assistenzlauf, Human Gate, Audit Trail, Outbox- und Buchungs-Sink.
- **Wirkungsgrenze:** kein externer AI Provider, keine echte Registrierung, keine realen Daten, keine echte Prognose, keine automatische Personenentscheidung, kein Versand und keine Buchung.
- **P0 abgeschlossen:** Cross-Tenant-Negativtest, Persistenz über Neustart, Human-Gate-Pflicht vor jeder Vorschau und `sink_only`-Status.
- **Nächstes Gate:** `PRODUCTIZATION-GATE-01.5-OPERATIONAL-DEPTH`; `GATE-02-EXTERNAL-ASSISTANCE-SANDBOX` bleibt bis zu dessen Abschluss geparkt.

### GATE-02-EXTERNAL-ASSISTANCE-SANDBOX

- **Ziel:** genau einen externen Modellanbieter hinter dem bestehenden strukturierten Provider-Interface gegen ausschließlich synthetische Fälle testen.
- **Benötigt:** benannter Anbieter und Modell, DPA-/Datenmodus, Training/Retention, Region, Kostenlimit, Rate Limit, Prompt-/Output-Vertrag und ausdrückliche Founder-Freigabe.
- **Akzeptanz:** Schema-Validierung, deterministischer Fallback, Prompt-Injection-/Fehlermodus-Tests, vollständiges Audit, menschliche Prüfung, keine Außenwirkung.
- **Recherche:** Anbieter-, Datenschutz- und Kostenvergleich sowie öffentlicher Vertrags-/Kontofähigkeits-Precheck am 07.10.2026 dokumentiert. Beide Finalisten sind `CONDITIONAL GO`; Mistral EU ist der bevorzugte Kandidat, OpenAI EU der Alternativpfad. Öffentliche Quellen ersetzen noch keine konto- oder vertragsseitige Freischaltung.
- **Status:** bewusst geparkt; Gate 01.5 ist fachlich und technisch vorgeschaltet. Provider-/Modellentscheidung, ZDR-/Retention-Nachweis, Kostenlimit und ausdrückliche Founder-Freigabe bleiben zusätzlich offen.

### GATE-03-FORECAST-VALIDATION

- **Ziel:** genau einen klar definierten operativen Outcome offline prognostizieren und gegen eine Baseline validieren.
- **Benötigt:** rechtmäßig nutzbarer historischer Datensatz, Zielvariable, Datenqualität, Train-/Validation-/Test-Trennung, Fehlermetriken, Fairness, Kalibrierung, Drift und Modellkarte.
- **Status:** nicht geöffnet; keine belastbare Datengrundlage nachgewiesen.

### GATE-04-LIVE-EFFECTS

- **Ziel:** einen einzelnen Außenkanal kontrolliert aus dem Sink in einen Sandbox- und später Live-Modus überführen.
- **Benötigt:** eigener Datenschutz-, Security-, Vertrags-, Kosten-, Betriebs-, Support-, Einwilligungs-/Rechtsgrundlagen- und Rollback-Gate je Kanal.
- **Status:** nicht geöffnet; Outbox und Booking bleiben `sink_only`.

## Aktiver Stand – Calm but Capable V2

- **Problem aus V1:** visuell ruhig, aber zu wenig erkennbare Produktleistung.
- **V2-Entscheidung:** gleiches ruhiges Designsystem; Produktfunktionen erscheinen kontextbezogen innerhalb des ausgewählten Falls.
- **Umgesetzt:** Verstehen, bearbeitbarer Plan, Folgenabschätzung, lokale Arbeitsprodukte sowie Entscheidung und Verlauf.
- **Status:** lokal implementiert und technisch, interaktiv, responsive sowie visuell QA-geprüft; Founder-Gesamtwirkung noch offen.
- **Nächstes Gate:** Founder-Bewertung der Funktionsverständlichkeit und Gesamtwirkung anhand der geöffneten lokalen V2; danach nur gezielte Korrekturen auf neuer datierter Rückfallbasis.

## Aktiver Stand – Product Design Reset

- **Status:** lokal umgesetzt und am 03.10.2026 technisch, interaktiv und visuell QA-geprüft; Founder-Gesamtwirkung noch offen.
- **Entscheidung:** Release A–C bleiben als fachliche Vorarbeit und Rückfallbasis erhalten, sind aber nicht mehr die aktive Präsentationsoberfläche.
- **Aktive Journey:** Priorität → Grund → menschliche Entscheidung oder lokale Auswirkungsprüfung → nächster Schritt.
- **Sichtbare Struktur:** Heute, Fälle, Erkenntnisse; keine eigenständigen KI-Produktmodule.
- **Nächstes Gate:** Founder-Bewertung der neuen Gesamtwirkung anhand der geöffneten lokalen Demo; danach nur punktuelle Korrekturen auf neuer datierter Rückfallbasis.

## Strategische Releases

### ACC-RELEASE-A – AI Command Center

- **Ziel:** Signal, Evidenz, Critical Path und menschliche Entscheidung als ein zusammenhängendes AI-natives Produkt-Erlebnis demonstrieren.
- **Umfang:** drei Szenarien, Event-/State-Engine, Daily Brief, Natural-Language Command Center, erklärbare Priorisierung, Critical Path, Decision Room, AI-Journey und erweiterte QA.
- **Status:** am 03.10.2026 lokal umgesetzt; seit dem Product Design Reset nicht mehr aktiv geladen und nur als Rückfall-/Fachbasis erhalten.
- **Reifegrad:** lokaler deterministischer Intelligence-Modus; keine externe oder produktive KI.
- **Gate:** keine externe Validierung, Veröffentlichung oder produktive Architektur durch diesen Abschluss freigegeben.

### ACC-RELEASE-B – Automation and Simulation

- **Umfang:** What-if Copilot, Workflow Composer, synthetische Dokumentprüfung, Data-Quality Assistant und Explainable Audit Trail auf gemeinsamem lokalem Zustand.
- **Status:** am 03.10.2026 lokal umgesetzt; nach negativem Founder-Feedback zur Übersichtlichkeit aus der aktiven Oberfläche entfernt und in der datierten Rückfallbasis erhalten.
- **Reifegrad:** deterministische Simulation und lokale Vormerkung; keine Prognose, Ausführung, Integration oder Außenwirkung.
- **Gate:** Founder-Bewertung der Gesamtwirkung; produktive Architektur bleibt ungeöffnet.

### ACC-RELEASE-C – Ecosystem Intelligence and Learning

- **Umfang:** kontrollierte App-Signalgrenze, Signal Inbox, 30/60/90/180-Lernschleife, Kohortenvergleich, Learning Copilot, Arbeitgeber-Role-Intelligence und achtstufige Founder-System-Journey.
- **Status:** am 03.10.2026 lokal umgesetzt; nach dem Product Design Reset nicht aktiv geladen, ausschließlich als fachliche Rückfallbasis erhalten.
- **Reifegrad:** fachliches Zielbild auf lokalen Fixtures; keine Registrierung, Authentifizierung, Synchronisierung oder Mandantentrennung.
- **Gate:** Founder-Bewertung; externe Validierung und produktive Architektur bleiben separat freigabepflichtig.

## P0

### ACC-P0-01 – Historische Fachkraftansicht aus aktivem ACC entfernen

- **Nutzerrolle:** AMAVIO Operations, Arbeitgeber
- **Problem:** Die ältere Fachkraftansicht wirkt trotz Label weiterhin wie eine dritte ACC-Rolle.
- **Ziel:** Aktive ACC-Demo enthält nur AMAVIO Operations und Arbeitgeber; direkte historische URL-Parameter fallen sicher auf AMAVIO zurück.
- **Akzeptanzkriterien:** keine aktive Fachkraft-Rollenschaltfläche; keine Fachkraft-Navigation; `?view=arbeitnehmer` öffnet AMAVIO; sichtbarer Hinweis auf die getrennte App; ursprünglicher Stand archiviert.
- **Abhängigkeiten:** Product Truth V1.
- **Risiken:** ältere HTML-Elemente können bei unvollständiger Bereinigung verborgen im DOM bleiben.
- **Freigabegate:** keines für lokale reversible Umsetzung.
- **Status:** abgeschlossen am 30.09.2026; aktive Navigation/Routing auf zwei Rollen begrenzt, historischer Bestand verborgen und inert, Rückfallstand archiviert.

### ACC-P0-02 – Demo-Journey und nächste Verantwortung schärfen

- **Nutzerrolle:** AMAVIO Operations, Arbeitgeber-Sponsor, HR/Fachbereich/Standortleitung, Budget-/Freigaberolle
- **Problem:** Mandat, Standort, Kohorte, Fall, Risiko, Freigabe und Reporting sind vorhanden, aber nicht als eine durchgängige Steuerungskette lesbar.
- **Ziel:** Ein sichtbarer Weg zeigt Objekt, nächsten Schritt, Verantwortung, Frist und Eskalationsregel.
- **Akzeptanzkriterien:** Steuerungskette in AMAVIO- und Arbeitgeberansicht; mindestens drei konkrete offene Verantwortungen; verantwortliche Rolle und Zeitpunkt sichtbar; Fallakte bleibt erreichbar.
- **Abhängigkeiten:** ACC-P0-01.
- **Risiken:** zu viele Karten oder Produktivitätsversprechen.
- **Freigabegate:** keines für synthetische lokale Daten.
- **Status:** abgeschlossen am 30.09.2026; Steuerungskette, Verantwortungsboards und nächste Verantwortung in der Fallakte ergänzt.

### ACC-P0-03 – Demo-Aktion und echte Wirkung durchgängig trennen

- **Nutzerrolle:** alle Demo-Nutzenden
- **Problem:** einzelne Texte können echte Anbindung oder Wirkung nahelegen.
- **Ziel:** jede schreibend wirkende Aktion benennt unmittelbar, dass sie lokal, synthetisch und wirkungslos ist.
- **Akzeptanzkriterien:** Fallanlage, Freigabe/Ablehnung, Export, Einladung, Nachricht, Upload und Reset eindeutig gelabelt; keine Formulierung behauptet Backend, Versand, Upload, Buchung oder Integration.
- **Abhängigkeiten:** keine.
- **Risiken:** überladene Warntexte.
- **Freigabegate:** keines.
- **Status:** abgeschlossen am 30.09.2026; schreibend wirkende Kernaktionen und Zukunftsaussagen reifegradklar beschriftet.

## P1

### ACC-P1-01 – Tastaturalternative für Board-Phasenwechsel

- **Nutzerrolle:** Arbeitgeber, AMAVIO Operations
- **Problem:** Drag-and-drop ist nicht gleichwertig per Tastatur bedienbar.
- **Ziel:** fokussierte Karte kann ohne Zeigegerät in eine Prozessphase verschoben werden.
- **Akzeptanzkriterien:** sichtbare oder fokussierbare Phasenaktion; Live-Region meldet Ergebnis; keine echte Persistenzbehauptung.
- **Abhängigkeiten:** stabile Boardstruktur.
- **Risiken:** Kartenklick und Phasenaktion kollidieren.
- **Freigabegate:** keines.
- **Status:** abgeschlossen am 30.09.2026; `Alt + Pfeil links/rechts` ergänzt und browserbasiert geprüft.

### ACC-P1-02 – Standalone-Paket und reproduzierbare QA

- **Nutzerrolle:** interne Demo-Moderation
- **Problem:** die V17-Datei ist in eine Website eingebettet und deren QA prüft keine vollständige ACC-Interaktionsmatrix.
- **Ziel:** eigenständig startbarer lokaler Ordner mit statischer, Browser- und Interaktions-QA.
- **Akzeptanzkriterien:** keine fehlenden lokalen Assets/Links; HTTP 200; keine Console Errors; kein horizontaler Überlauf; Desktop/Tablet/Mobile; Rollen-, Mandats-, Fall-, Freigabe-, Modal- und Resetpfad geprüft.
- **Abhängigkeiten:** ACC-P0-Pakete.
- **Risiken:** lokales Chromium kann durch Sandbox blockiert sein; dann Browser-CUA als dokumentierter Fallback.
- **Freigabegate:** keines.
- **Status:** abgeschlossen am 30.09.2026; Standalone-Paket, HTTP-, statische und Chromium-QA über fünf Viewports vorhanden.

### ACC-P1-03 – Rollenmatrix im Arbeitgebermandat

- **Nutzerrolle:** Sponsor/Management, HR/Fachbereich/Standortleitung, Budget-/Freigaberolle
- **Problem:** Arbeitgeber wird derzeit als eine Rolle dargestellt.
- **Ziel:** Verantwortungsbereiche und Sichtgrenzen werden als fachliche Zielstruktur klar, ohne produktive Rechteprüfung zu behaupten.
- **Akzeptanzkriterien:** Rollenmatrix sichtbar; als Zielstruktur/Demo gelabelt; interne AMAVIO-Notizen und Daten anderer Mandanten ausgeschlossen.
- **Abhängigkeiten:** Product Truth.
- **Risiken:** UI-Trennung kann mit echter Autorisierung verwechselt werden.
- **Freigabegate:** Rechts-/Security-Gate erst für produktive Umsetzung.
- **Status:** abgeschlossen am 30.09.2026; sichtbare Rollenmatrix als Zielstruktur ergänzt, ohne Autorisierungsclaim.

## P2

### ACC-P2-01 – Brandbook-Handoff

- **Nutzerrolle:** Präsentation/Founder
- **Problem:** ein neuer Brandbook-Master kann visuelle Tokens verändern.
- **Ziel:** belastbare Tokens selektiv übernehmen, ohne aktuelle Funktionalität oder Barrierefreiheit zu verschlechtern.
- **Akzeptanzkriterien:** schriftlicher Brandbook-Handoff; Token-Diff; Kontrast- und Responsive-Retest.
- **Abhängigkeiten:** intern verbindliche Brandbook-Master-Arbeitsfassung vom 30.09.2026.
- **Risiken:** Paralleländerungen im Brandbook-Chat.
- **Freigabegate:** externe Nutzung bleibt separat freigabepflichtig.
- **Status:** lokal abgeschlossen am 30.09.2026; belastbare Design-Tokens übernommen, Logoassets unverändert, Responsive-/Interaktions-QA erneut grün.

### ACC-P2-02 – Fachliche App-/ACC-Übergabematrix

- **Nutzerrolle:** AMAVIO Operations, spätere App-Rollen
- **Problem:** Zielinterface ist beschrieben, aber in der Demo nicht als kontrollierte Grenze visualisiert.
- **Ziel:** nur die erlaubten minimierten Signaltypen, Prüfschritte und Rückprojektionen fachlich darstellen.
- **Akzeptanzkriterien:** keine Integration simuliert; keine sensiblen Freitexte; jede Richtung mit Zweck, Minimaldaten, Verantwortung und Reifegradlabel.
- **Abhängigkeiten:** separater App-Handoff.
- **Risiken:** Architekturentwurf könnte als implementiert missverstanden werden.
- **Freigabegate:** fachlicher Handoff aus App-Chat; Datenschutz-/Security-Gates erst für MVP.
- **Status:** Dokumentebene abgeschlossen am 30.09.2026; Release C visualisiert seit 03.10.2026 ausschließlich die kontrollierte Zielgrenze mit synthetischen Minimal-Signalen. Eine technische Integration bleibt vollständig ungeöffnet.

## Verbleibende Gates / nächster Plan

### RELEASE-K – Arrival Program & Delivery Operating System

- **Status:** lokal implementiert und technisch QA-geprüft am 12.10.2026.
- **Enthalten:** Programmportfolio, Kohorten, Service Blueprint, Kapazitätsband, rollenbezogene Arbeitgeberentscheidungen, kritische-Pfad-Simulation mit Human Gate, Outcome-Rückmeldung und reproduzierbarer Wochenstatus.
- **Grenze:** ausschließlich synthetische Daten und lokale Sitzungen; keine produktive Identity, keine Integrationen, keine externe KI, kein Versand, keine Buchung und kein Deployment.
- **Nächster technischer Schritt:** Release L als providerunabhängiger Intelligence Kernel V3 unterhalb der Programmreise.

### RELEASE-L – AMAVIO Intelligence Kernel V3

- **Status:** lokal implementiert und vollständig regressionsgeprüft am 12.10.2026.
- **Enthalten:** Program Evidence Graph, acht Policies, drei versionierte Capabilities, lokale Provider-Baseline, Human Gate und 36 reproduzierbare Evaluationsszenarien.
- **Moderation:** achtstufige synthetische Testkonsole und interner Probelauf abgeschlossen; echte externe Testpersonen nicht eingeladen.
- **Grenze:** OpenAI- und Mistral-Adapter sind installiert, aber nicht aktiviert, nicht callable, nicht authentifiziert und nicht smoke-getestet. Es entstanden 0 Providerkosten.
- **Nächstes Gate:** Founder entscheidet separat über eine echte moderierte Welle mit ausschließlich freigegebenen Funktionsrollen und synthetischen Fällen. Erst danach kann ein kontrollierter Live-Provider-Test erwogen werden.

### GATE-01 – Menschliche Präsentationsabnahme

- **Benötigt:** Founder-/Nutzerfeedback zur Gesamtwirkung, Informationsdichte und Gesprächsführung anhand der lokalen Demo und `DEMO_GUIDE_20260930.md`.
- **Warum Gate:** technische QA kann die inhaltliche und visuelle Gesprächswirkung nicht freigeben.
- **Danach:** nur gezielte P0/P1-Korrekturen in einer neuen datierten Rückfallkopie.
- **Status:** abgeschlossen am 30.09.2026. Rückfallbasis `archive/20260930_181739_founder_presentation_baseline/`; Kopfbereich, simulierter Stichtag, Freigabestatus, Demo-Ausschnitt, optionaler Tourstart und Reporting-Hinweis gezielt korrigiert. Abnahmeprotokoll: `FOUNDER_PRAESENTATIONSABNAHME_20260930.md`.

### GATE-02 – Echte Arbeitgeber-/Designpartner-Validierung

- **Benötigt:** ausdrücklich freigegebener Testumfang, Rollen, synthetisches Testszenario, Beobachtungsbogen und Claim-/Nutzungsrechte.
- **Warum Gate:** ein Gespräch oder lokaler Klicktest ist kein Designpartner-, Pilot- oder Marktbeleg.
- **Danach:** priorisierte P0/P1-Auswertung; keine echten Daten ohne separate Rechts-/Datenfreigabe.
- **Status:** Scope vorbereitet in `DESIGNPARTNER_VALIDIERUNG_SCOPE_20260930.md`; nicht extern freigegeben, niemand eingeladen, keine Durchführung erfolgt.

### GATE-03 – Produktive Architektur

- **Benötigt:** Backend-/Datenmodell-, Identity-, Rechte-, Datenschutz-, Security-, Hosting-, Vertrags- und Betriebsgates.
- **Warum Gate:** lokale Demo-Qualität ersetzt keine produktive Systemreife.
- **Danach:** gesondertes MVP-Projekt; nicht in dieser statischen Arbeitskopie.
- **Status:** Entscheidungsrahmen vorbereitet in `PRODUKTIVE_ARCHITEKTUR_GATES_20260930.md`; keine Architektur-, Anbieter-, Budget- oder Implementierungsentscheidung getroffen.

### GATE-04 – Veröffentlichung/Deployment

- **Benötigt:** ausdrückliche Founder-Freigabe plus Legal-, Medien-, Hosting- und Release-QA.
- **Warum Gate:** diese Arbeitskopie ist absichtlich lokal und `noindex`.
- **Danach:** eigene Release-Kopie; niemals diese Arbeitskopie stillschweigend veröffentlichen.
