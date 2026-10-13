# ACC Target Architecture – Releases A–C und späteres Zielbild

**Stand:** 03.10.2026  
**Status:** Demoarchitektur lokal umgesetzt; produktive Architektur ungeöffnet

## Aktuell implementierte Demoebenen

### 1. Presentation Layer

- bestehende ACC-Ansichten für AMAVIO Operations und Arbeitgeber;
- neues AI Command Center als primäre Operations-Ansicht;
- responsive Darstellung, Tastaturbedienung und geführte AI-Journey.

### 2. Synthetic Arrival Domain Model

`assets/release-a.js` enthält drei kanonische Szenarien mit:

- Anchor Case;
- Signalen;
- Evidenz;
- offenen Informationen;
- Critical Path;
- Entscheidungsvorlage;
- deterministischen Ereignissen.

Alle neuen Release-A-Module lesen denselben lokalen Szenariozustand.

### 3. Event and State Engine

Synthetische Signale verändern gemeinsam:

- Briefing;
- Anzahl offener Abhängigkeiten;
- Konfidenz;
- Evidenz;
- Critical Path;
- Natural-Language-Antwort.

Der Zustand besteht nur in der Browser-Sitzung und ist vollständig zurücksetzbar.

### 4. Local Explainable Intelligence

Der Resolver ordnet Fragen reproduzierbar den Kategorien Anreise, Critical Path, Entscheidung oder Zustandsänderung zu. Jede Antwort liefert:

- Zusammenfassung;
- Konfidenz;
- Belege;
- nächste sichere Aktionen;
- Human Gate.

### 5. Human-gated Decision Layer

Der Decision Room zeigt Optionen und Folgen vor der Auswahl. Erst ein bewusster menschlicher Klick setzt eine lokale Vormerkung. Es gibt keinen Versand, keine Buchung, keine Zahlung und keine produktive Freigabe.

### 6. QA Layer

- statische Prüfung inklusive Release-A-Assets und Netzwerkpfaden;
- JavaScript-Syntaxprüfung;
- Browsermatrix über sechs Viewports;
- Interaktionstests für Szenario, Resolver, Event Engine, Decision Room und AI-Journey;
- bestehende Rollen-, Board-, Freigabe-, Modal-, Responsive- und Reduced-Motion-Tests.

### 7. Local Automation and Simulation Layer

`assets/release-bc.js` nutzt eine lokale read-only Zustandsbrücke zu Release A und enthält:

- regelbasierte What-if-Ereignisse;
- kontrollierte Workflow-Vorlagen;
- synthetische Dokument-Fixtures;
- Datenqualitätsregeln;
- lokalen Audit Trail.

Diese Ebene führt nichts autonom aus und besitzt weder Persistenz noch Netzwerkzugriff.

### 8. Controlled Ecosystem and Learning Layer

- Signal Inbox mit ausschließlich synthetischen Minimal-Signalen der drei externen App-Rollen;
- AMAVIO-Prüfung vor jeder Rückprojektion in die Arbeitgeberansicht;
- 30/60/90/180-Lernpunkte;
- synthetische Kohortenlogik und lokaler Playbook-Entwurf;
- adaptive Arbeitgeber-Briefings für Sponsor, HR, Standort und Budget;
- gemeinsame achtstufige Founder-System-Journey.

Die App bleibt technisch und produktseitig getrennt. Der dargestellte Übergang ist ein fachliches Zielbild, keine Integration.

## Noch nicht implementiertes produktives Zielbild

- Backend und persistentes Domänenmodell;
- Identität, Rollenprüfung und Mandantentrennung;
- echter Eventbus oder Workflow-Service;
- Modellanbieter oder LLM;
- Retrieval, Vektorsuche oder Dokumentverarbeitung;
- App-, CRM-, HRIS-, Messaging- oder File-Service-Anbindung;
- Observability, Security, Hosting, Backup und Betrieb.

Diese Punkte bleiben an die dokumentierten Architektur-, Datenschutz-, Security-, Hosting-, Vertrags- und Betriebsgates gebunden.
