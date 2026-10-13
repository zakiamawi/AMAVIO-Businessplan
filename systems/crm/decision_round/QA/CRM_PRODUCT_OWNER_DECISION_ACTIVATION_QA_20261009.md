# AMAVIO One CRM – QA der Product-Owner-Beschlussaktivierung

**Datum:** 09.10.2026  
**Autorisierung:** ausdrücklicher Product-Owner-Beschluss im aktuellen Chat  
**Status:** **BESCHLUSS KONSISTENT ÜBERFÜHRT / QA BESTANDEN / NICHT PRODUKTIV FREIGEGEBEN**  
**Produktstand:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## 1. Geprüfter Beschluss

> „Ich beschließe Bündel A und Bündel B gemäß Empfehlung. Bündel C bleibt vollständig gesperrt.“

Der Beschluss wurde ausschließlich als fachliche Zielentscheidung interpretiert. Er wurde nicht als Auftrag für Codeänderung, Anbieterwahl, Integration, reale Daten, Authentifizierung, Hosting, Deployment oder Veröffentlichung ausgelegt.

## 2. Schutz und Wiederherstellbarkeit

- Vor der Aktivierung wurde unter `QA/pre_activation_snapshot_20261009/` ein lokaler Snapshot aller betroffenen Quell- und Entscheidungsdokumente angelegt.
- Das zuvor QA-bestandene Entscheidungspaket wurde über sein Prä-Aktivierungsmanifest verifiziert.
- SHA-256 des Prä-Aktivierungsmanifests: `bd9b9758f82247d2bc2e346f62497f1b0748cb5f618a46b184fc181d669771cd`.
- Es wurde nichts gelöscht, veröffentlicht, übertragen oder in ein externes System geschrieben.

## 3. Konsistenzprüfung des Entscheidungsstands

Ausgeführt:

```text
node decision_round/scripts/qa-decision-round.mjs
```

Ergebnis: **BESTANDEN**

- `20/20` PO-IDs im Entscheidungsregister und Crosswalk, jeweils genau einmal;
- `12` fachliche Entscheidungen der Bündel A und B als `decided_accepted` dokumentiert;
- `8` produktive Gates des Bündels C als `gate_confirmed_closed` dokumentiert;
- keine veralteten offenen Registerstatuswerte;
- Pipeline-, Rollen-, Privacy-, Lifecycle-, ACC- und Release-Verträge konsistent;
- fachlicher Beschluss, technische Umsetzung und produktive Freigabe klar getrennt;
- keine externe URL im Entscheidungspaket.

## 4. Fachverträge und Wahrheitsmatrix

| Bereich | Ergebnis nach Beschluss | Technische Wahrheit |
|---|---|---|
| Pipeline | v1.0 fachlich beschlossen | vorhandene Übergänge funktionieren; verschärfte Phasenkriterien noch nicht vollständig technisch erzwungen |
| Lead/Opportunity | fachliche Grenze beschlossen | Lead-UI und Konvertierungsablauf bleiben geparkt |
| Partner | getrennte Objektklasse und interne Pflege beschlossen | Partner-CRUD bleibt nicht implementiert; kein Partnerlogin |
| Rollen | fünf interne Zielrollen beschlossen | keine Authentifizierung oder technische Autorisierung |
| Consent/Kontakt | getrennte Statuslogik beschlossen | keine Außenaktionen, keine Rechtsgrundlagenwirkung |
| Lifecycle | Archivierung als Standard beschlossen | keine physische Löschung; Rechts- und Fristenkonzept offen |
| Arbeitsbereich | interner Single-Workspace beschlossen | kein Backend, kein Mehrbenutzerbetrieb, keine Mandantenfähigkeit |
| ACC-Handoff | Dual Approval und minimales personendatenfreies Default-Paket beschlossen | nur lokale Marker; kein Payload und keine Übertragung |
| Sprache | DE-first beschlossen | keine unvollständige EN-Oberfläche aktiviert |
| Forecast | sichtbares Potenzial ohne gewichteten Forecast beschlossen | kein neues Forecast-Modul |
| Export | für R3 deaktiviert beschlossen | keine Exportfunktion aktiviert |
| Bündel C | alle acht Gates geschlossen bestätigt | keine produktive Technik oder Integration aktiviert |

Die Capability-Gap-Matrix führt die Pipeline nach dem Beschluss korrekt als **teilweise implementiert**, weil der neue Fachvertrag 1.0 über die bisherige technische Mindestvalidierung hinausgeht.

## 5. Technische Regression

Obwohl kein Anwendungscode verändert wurde, wurde die vollständige bestehende lokale QA erneut ausgeführt.

### Build, statisches QA-Gate und Logiktests

```text
npm run qa:full
```

Ergebnis: **BESTANDEN**

- Vite-Build erfolgreich;
- statisches CRM-QA-Gate erfolgreich;
- `4/4` Unit-Tests bestanden;
- `3/3` Vertragstests bestanden;
- `1/1` Komponententest bestanden;
- `1/1` Integrationstest bestanden.

Die bestehenden Vertragstests bestätigen den bisherigen Core-Vertrag. Zusätzliche Tests für die neu beschlossenen, strengeren R3-Regeln sind in `CRM_TEST_AND_QUALITY_STRATEGY.md` als Voraussetzung vor R3-Abschluss dokumentiert; sie werden nicht als bereits implementiert ausgegeben.

### End-to-End

```text
npm run test:e2e
```

Ergebnis nach zulässigem Chrome-Start außerhalb der Sandbox: **BESTANDEN**

- `12/12` zusammenhängende lokale Kernabläufe bestanden;
- Persistenz, Archiv/Wiederherstellung und Reset bestanden;
- Browserkonsole ohne Fehler.

Der erste Startversuch brach beim lokalen Chrome-Prozess mit `SIGABRT` und `kill EPERM` ab. Dies war ein Ausführungs-/Sandboxproblem vor dem Browserstart, kein fehlgeschlagener CRM-Nutzerpfad. Die identische Testsuite wurde anschließend mit erlaubtem lokalen Chrome-Start erfolgreich ausgeführt.

### Browser-, Responsive-, Tastatur- und Zoom-QA

```text
npm run qa:browser
```

Ergebnis: **BESTANDEN**

- 1600, 1280, 1024 und 430 Pixel ohne Seiten-Overflow;
- Tastaturbedienung, Escape, Focus-Trap und Focus-Rückgabe bestanden;
- echter Chrome-Zoom bei 200 Prozent in isoliertem Profil bestanden;
- lokale Screenshots und maschinenlesbare Browser-Evidenz aktualisiert.

## 6. Veränderte Dokumentbereiche

- Product-Owner-Matrix und Entscheidungspaket;
- kanonisches Domänenmodell;
- Status- und Übergangsvertrag;
- Berechtigungs- und Sichtbarkeitsvertrag;
- Datenlebenszyklus- und Privacy-Vertrag;
- ACC-Handoff-Fachvertrag;
- Capability-Gap-Matrix;
- Test- und Qualitätsstrategie;
- Release-Reifeplan, Produktgrenzen und README;
- historischer Core-QA-Bericht ausschließlich durch einen datierten Nachtrag.

## 7. Unveränderte Bereiche

- `src/`, aktive UI-Komponenten und Styles;
- synthetische Seed-Daten und lokale Persistenzlogik;
- App- und ACC-Codebasen;
- Authentifizierung, Datenbank, Import und Drittanbieter;
- produktive Konfiguration, Hosting, Deployment und externe Übertragung.

Der Build hat ausschließlich lokale Build-Artefakte neu erzeugt; er ist kein Deployment.

## 8. Toolstatus

- Node.js/npm: lokal installiert, callable und für Build/Test smoke-getestet;
- Google Chrome: lokal installiert und nach Freigabe für die isolierten lokalen E2E-/Browserprüfungen callable und smoke-getestet;
- externe CRM-, Cloud- oder Connector-Werkzeuge: für diesen Schritt weder benötigt noch aufgerufen;
- Authentifizierungsstatus externer Systeme: nicht geprüft und nicht behauptet.

## 9. Verbleibende Gates

Vollständig gesperrt bleiben Datenbank, Authentifizierung/MFA, Import realer Daten, E-Mail/Kalender, Dokumentenspeicher, App-Integration, ACC-Integration, produktive KI sowie Hosting/Deployment. Zusätzlich fehlen weiterhin Rechts-, Datenschutz-, Security-, Betriebs- und Releasefreigaben.

## 10. Schlussurteil

Der Product-Owner-Beschluss wurde vollständig und widerspruchsfrei in die fachlichen CRM-Verträge überführt. Der lokale synthetische Core ist nach der Dokumentaktualisierung technisch regressionsgeprüft. Eine technische R3-Angleichung oder produktive Aktivierung wurde weder vorgenommen noch durch diesen Beschluss autorisiert.
