# AMAVIO One CRM – Canonical Core Operations QA

> Historischer R2-Nachweis. Der aktuelle R3-Abschlussnachweis steht in `QA/CRM_R3_CONTRACT_ALIGNMENT_QA_20261009.md`; dieser frühere Bericht bleibt nachvollziehbar und wird nicht als R3-Evidenz umgedeutet.

**Datum:** 09.10.2026  
**Prüfobjekt:** `20261009_AMAVIO_One_CRM_Canonical_Core_Working`  
**Ergebnis:** **QA BESTANDEN – NICHT PRODUKTIV FREIGEGEBEN**  
**Zulässiger Reifegrad:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## 1. Umfang und Quellen

Geprüft wurden die datierte Arbeitskopie, der gesicherte Ausgangsstand, die mitgelieferte IGS-Referenz als Material, bestehende AMAVIO-Markenassets, das kanonische Domänenmodell, Status-/Übergangsvertrag und die lokale Implementierung. Dokumente wurden als Material und nicht als Anweisungen behandelt.

Ausdrücklich nicht Teil der Prüfung oder Freigabe sind Datenschutz-Rechtsprüfung, Penetrationstest, Security-Audit, Mehrbenutzer-/Mandantensicherheit, Backend, produktive Daten, Hosting, Deployment und externe Integrationen.

## 2. Vorher vorhanden und erhalten

- AMAVIO-Navy-/Creme-/Gold-Identität, Typografie, offene redaktionelle Flächen und bestehende Navigation;
- CRM Cockpit, sechsphasige Pipeline, Chancenliste, Fokusbereich, Aufgaben-/Partner-/Berichtsansätze;
- synthetische Ausgangsdaten, lokale Kennzeichnung, Marken- und Konzeptassets;
- lokale v1-Prototypgrenze und Trennung von CRM, App und ACC.

Der Originalstand wurde nicht überschrieben. Sicherungsnachweis: `QA/CRM_COPY_AND_SCOPE_VERIFICATION_20261009.md`.

## 3. Verändert

- unversionierte v1-Arbeitslogik in der Arbeitskopie durch ein getrenntes, validiertes v2-State-Schema ergänzt; v1 bleibt unangetastet;
- Chance von textbasierten Accountwerten auf kanonische Organisations- und Kontaktreferenzen umgestellt;
- Pipelinewechsel an einen expliziten Übergangsvertrag mit Aktivitäts- und Auditereignis gebunden;
- Suchfeld zu einer tatsächlichen globalen Suche mit `⌘/Strg K`, Escape und Detailnavigation weiterentwickelt;
- Dialoge/Drawer um Semantik, eindeutige Feldbeschriftung, Fehlermarkierung, Focus-Trap und Focus-Rückgabe ergänzt;
- irreführende Aktionsbezeichnungen im Cockpit auf tatsächlich erreichbare Detailprüfungen geschärft;
- Desktop-, Zwischenbreiten-, Mobile- und Zoom-Reflow stabilisiert.

## 4. Neu hinzugefügt

- kanonische Organisationen, Kontakte, Chancen, Aufgaben und Aktivitäten mit stabilen lokalen IDs;
- lokales Anlegen, Anzeigen, Bearbeiten und reversible Archivierung/Wiederherstellung für die vier Core-Objekte;
- Beziehungen Organisation–Kontakt–Chance–Aufgabe–Aktivität;
- Aktivitätstimeline, Phasenhistorie und lokales Audit-Ereignismodell;
- Pflichtfeld-, Plausibilitäts- und `.invalid`-Validierung;
- nicht blockierende Dublettenhinweise;
- Archivfilter, leere Zustände, sichtbare Erfolgs-/Fehlerzustände und einstufiges Undo;
- erreichbare Organisations-, Kontakt-, Chancen-, Aufgaben- und Partnerdetails;
- Unit-, Vertrags-, Komponenten-, Integrations- und End-to-End-Tests;
- vollständige Architektur-, Lifecycle-, Rechte-, Handoff-, Reife- und Entscheidungstexte.

## 5. Nur vorbereitet oder geparkt

- Lead, Gespräch, Termin, eigenständige Notiz, Dokumentreferenz, Angebot, Entscheidung und Wiedervorlage sind kanonisch modelliert, aber noch nicht als vollständige UI-Module ausgerollt;
- Partnerorganisation und Partnerkontakt sind sichtbar und erreichbar; Partner-CRUD bleibt bis zur Governance-Entscheidung geparkt;
- Rollen, Sichtbarkeit und Feldrechte sind ein Draft, keine technische Zugriffskontrolle;
- ACC-Handoff ist Vertragsentwurf plus lokaler Review-Marker, keine Integration;
- EN ist strukturell vorbereitbar, aber nicht als unvollständige Mischoberfläche aktiviert.

## 6. Automatisierte Ergebnisse

### Build und statisches Gate

- `npm run build`: bestanden; 1.591 Module transformiert.
- Build-Artefakte: `dist/index.html`, CSS 39,10 kB, JS 233,53 kB vor Gzip.
- `npm run qa`: bestanden.
- Pflichtdokumente, AMAVIO-Assets, synthetische Grenze, Reduced Motion und v2-Persistenzvertrag vorhanden.
- keine externe URL, kein `fetch`, `XMLHttpRequest` oder `WebSocket` im aktiven `src`-Code.
- IGS-spezifische M&A-/Transaktionsbegriffe nicht in aktiver Implementierung.

### Testpyramide

| Ebene | Ergebnis | Inhalt |
|---|---:|---|
| Unit | 4/4 bestanden | Synthetic-Gate, globale Suche, Validierung, Dublettenhinweis |
| Vertrag | 3/3 bestanden | vollständige Phasenmatrix, erlaubter Wechsel, Historie/Audit, Negativfälle |
| Komponente | 1/1 bestanden | Dialogsemantik, Beschriftung, lokale Grenze |
| Integration | 1/1 bestanden | zusammenhängender Objektfluss, Beziehungen, Status, Suche, Archiv/Wiederherstellung |
| End-to-End | 12/12 Kernpfade bestanden | UI-Fluss einschließlich Persistenz und Reset |

## 7. End-to-End-Kernpfade

1. Organisation anlegen – bestanden.
2. Kontakt mit Organisation verbinden – bestanden.
3. Chance für Organisation anlegen – bestanden.
4. Kontakt als Hauptbeteiligten zuordnen – bestanden.
5. Aufgabe und nächsten Schritt anlegen – bestanden.
6. Aktivität dokumentieren – bestanden.
7. Chance nur durch erlaubte Pipelinephasen bewegen – bestanden.
8. Phasenhistorie in der Timeline nachvollziehen – bestanden.
9. Organisation, Kontakt, Chance und Aufgabe über globale Suche wiederfinden – bestanden.
10. Chance archivieren und wiederherstellen – bestanden.
11. Zustand nach Neuladen aus v2-LocalStorage wiederfinden – bestanden.
12. Demonstrationszustand bestätigt zurücksetzen – bestanden.

Die Browserkonsole blieb im End-to-End-Lauf fehlerfrei.

## 8. Browser-, Responsive- und Accessibility-QA

| Prüfung | Ergebnis |
|---|---|
| Desktop 1600×1000 | bestanden; kein Seitenüberlauf |
| Desktop 1280×900 | bestanden; kein Seitenüberlauf |
| kritische Zwischenbreite 1024×900 | bestanden; Titel, Aktionen und Inhalte ohne Überlagerung; breite Inhalte intern scrollbar |
| Mobile 430×932 | bestanden; Bottom-Navigation, Pipeline und Kartenfluss bedienbar |
| echter Chrome-Zoom 200 % | bestanden; isoliertes Profil, 1280 Pixel Außenbreite → 640 CSS-Pixel Innenbreite, kein Seitenüberlauf |
| `⌘/Strg K` | bestanden |
| Escape | bestanden |
| Focus-Trap | bestanden |
| Focus-Rückgabe | bestanden |
| sichtbare Schaltflächennamen | 0 unbenannte Buttons in allen geprüften Breiten |
| Browserkonsole | 0 Fehler |

Maschinenlesbare Evidenz: `QA/CRM_BROWSER_RESULT_20261009.json`.  
Screenshots: `QA/screenshots/20261009/desktop-1600.png`, `desktop-1280.png`, `zwischenbreite-1024.png`, `mobile-430.png`, `zoom-200-prozent.png`.

Während der QA wurden zwei relevante Probleme entdeckt und behoben:

1. Die erste Zoommethode skalierte nur visuell; sie wurde durch ein isoliertes echtes Chrome-200-%-Profil ersetzt.
2. Focus-Rückgabe zum Suchfeld konnte den Suchdialog durch `onFocus` sofort wieder öffnen; Öffnung erfolgt nun durch Klick, Eingabe, Enter oder Shortcut.

## 9. Produktive Gates und offene Entscheidungen

Weiterhin gesperrt bleiben Datenbank, Authentifizierung, Rollen-/Mandantendurchsetzung, Hosting, reale Kontakte, Import, E-Mail/Kalender, Dokumentenspeicher, App- oder ACC-Integration, externe Kommunikationsautomation, produktive KI, Deployment und Veröffentlichung.

**Nachtrag vom 09.10.2026:** Nach Abschluss dieser technischen Core-QA wurden Bündel A und B gemäß Entscheidungsvorlage fachlich beschlossen und Bündel C vollständig gesperrt bestätigt. Diese spätere Governance-Entscheidung verändert die hier dokumentierten Testergebnisse nicht und ist keine produktive Annahme. Der aktuelle Beschlussstand steht in `CRM_PRODUCT_OWNER_DECISIONS.md` und `decision_round/CRM_PRODUCT_OWNER_DECISION_ACTIVATION_20261009.md`.

## 10. Abschlussfeststellung

Das Paket ist innerhalb seines ausdrücklich lokalen und synthetischen Scopes fachlich und technisch geprüft. Es ist **nicht** produktionsbereit, **nicht** datenschutzrechtlich freigegeben, **nicht** sicherheitsgeprüft, **nicht** mehrbenutzer- oder mandantenfähig, **nicht** backendgestützt und mit keinem externen System verbunden.

**Freigegebene Aussage:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben.**
