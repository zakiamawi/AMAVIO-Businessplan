# AMAVIO One CRM – Test- und Qualitätsstrategie

## R3.12-Ergänzung – lokale Security- und Gate-Regression

Der Persistenztest muss zusätzlich die vollständige Sicherheitsheadergruppe, die 403-Abweisung einer Cross-Site-Mutation sowie `0700` für den Datenordner und `0600` für SQLite und JSON-Export prüfen. Die Browsermatrix prüft das auf dreizehn Kontrollen erweiterte Zugriffsschutzregister, den sichtbaren Geräteblocker, alle bisherigen Breakpoints, Tastatur/Fokus, echten 200-%-Reflow und eine fehlerfreie Konsole. Ein bestandener lokaler Test darf nicht als Penetrationstest, Security-Zertifizierung, Datenschutzfreigabe oder Produktivabnahme bezeichnet werden.

## R3.8-Zusatzvertrag

- Unit: Quellen-/Zweck-/Kanal-Matrix, Informationspflicht-Bausteine, Zugriffsschutzkontrollen und unveränderte Produktivsperren.
- Vertrag: Migration R3.7/v6 → R3.8/v7 darf `realDataEnabled`, `outboundEnabled`, produktive Kontakt- oder Zugriffsfreigabe nicht aktivieren.
- Komponente: „Recht & Quellen“ und „Zugriff & Gerät“ sind semantisch erreichbar und enthalten keine Aktivierungsschaltfläche.
- Integration: sechs Kontrollläufe erzeugen Auditspur; G1-03, G1-06 und G1-10 bleiben gesperrt.
- E2E: beide neuen Register öffnen, erwartete Zeilen/Kontrollen prüfen und NO-GO nach Kontrolllauf nachweisen.
- Browser: 1600, 1280, 1024, 768, 430 und 390 Pixel sowie echter 200-%-Zoom; keine Konsolefehler und kein Seiten-Overflow.
- Negativ: keine externen Fetch-/WebSocket-Pfade, keine realen E-Mail-Adressen, keine Secret-Felder, kein Login-/Security-Claim, keine Aktivierung realer Daten.

## R3.7-/G1-Erweiterung vom 13.10.2026

Das G1-Closure-Paket ergänzt Unit-Tests für Datenklassen, synthetischen Vertrag, Kontrollsuite und unveränderliche Freigabesperren; Vertragstests für v5→v6-Migration; Integrationstests für Kontrolllauf, Auditspur und NO-GO; Komponententests für das vierteilige G1-Entscheidungszentrum; Persistenztests mit Schema v6; E2E für Kontrolllauf, Nachweisansicht und sichtbares NO-GO. Browser-QA prüft Eintrittsgates, Datenklassen, Lebenszyklus und Nachweise bei 1600, 1280, 1024, 768, 430 und 390 Pixeln sowie echtem 200-%-Zoom.

Harte Negativkriterien: Ein Kontrolllauf darf `realDataEnabled`, `outboundEnabled` oder `releaseEligible` nie aktivieren. G1-03 muss extern gesperrt, G1-06 technisch gesperrt und G1-10 PO-gesperrt bleiben. Nicht-synthetischer Import, reale E-Mail-Domain, externe Browserverbindungen, Provider-Schreibrecht, Versand und App-/ACC-Payload bleiben verboten. Ein bestandener Test bedeutet ausschließlich lokale synthetische Entscheidungsreife.

## R3.6-Erweiterung vom 13.10.2026

R3.6 prüft die Zwecktrennung der drei zentralen Arbeitsflächen, die datenbasierte Diagrammlogik, den Wechsel zwischen interner Analyse und bereinigter Berichtsansicht sowie das geschlossene G1-Readiness-Gate. Der Browserlauf umfasst Arbeitstag, Cockpit, Pipeline, Auswertungen und Daten & Sicherheit bei 1600, 1280, 1024, 768, 430 und 390 Pixeln sowie 200-%-Reflow. Zusätzlich werden Seitenüberlauf, unbeschriftete Schaltflächen, Fokusführung, Browserkonsole und sichtbare Entwicklungs-/Assistenzbegriffe geprüft.

Die Diagramme dürfen ausschließlich aus dem aktuellen lokalen Zustand und tatsächlich datierten Ereignissen berechnet werden. Fehlende Historie wird nicht synthetisch ergänzt. Die bereinigte Berichtsansicht entfernt den internen Management-Brief und Detailinformationen, ist aber ohne Rollenmodell, Freigabeverfahren, Export- und Versandvertrag ausdrücklich nicht extern freigegeben. Das G1-Panel ist ein Readiness-Register mit NO-GO-Wirkung und darf keine Aktivierung realer Daten anbieten.

## R3.4-Erweiterung vom 10.10.2026

R3.4 ergänzt Unit-Tests für Founder-Fokus, Entscheidungsreife, Decision Brief, Pipelinebewegung, Aging und Datenvertrauen sowie einen serverseitigen Komponententest für die gesamte Entscheidungsoberfläche. Der E2E-Pfad prüft den Standard-Einstieg, exakt drei Prioritäten, das Öffnen und Schließen des Chancen-Briefings, die Kernmodule und die sichtbare Grenze `keine externe KI`. Browser-QA umfasst 1600, 1280, 1024, 768, 430 und 390 Pixel, echten 200-%-Reflow, Skip-Link, Tastaturdialoge, Seitenüberlauf und Browserkonsole.

Ein Erfolg dieser Prüfungen gilt ausschließlich für den lokalen synthetischen Prototyp. Er ersetzt weder Security-/Privacy-Audit noch Screenreader-Zertifizierung, produktive Datenfreigabe oder Integrationsprüfung.

## Testpyramide

1. **Unit:** ID-, Validierungs-, Such-, Dubletten-, Archiv- und Berechnungslogik.
2. **Vertrag:** kanonische Objekte, Referenzen und erlaubte Pipelineübergänge.
3. **Komponente:** Formulare/Dialoge, Pflichtfelder, Beschriftung, Escape, Fokus und Bestätigung.
4. **Integration:** State-Aktionen über zusammenhängende Organisation–Kontakt–Chance–Aufgabe–Aktivität-Beziehungen.
5. **E2E:** fünfzehn synthetische Kernpfade einschließlich R3-Verträge, vollständigem R3.2-Arbeitsjournal, Persistenz, Archiv/Wiederherstellung und Reset.
6. **Visuell/Accessibility:** Desktop, Zwischenbreiten, Mobile, 200-%-Zoom, Tastatur, Konsole und Screenshotvergleich.

## Pflichtumgebungen

- Chromium/Google Chrome lokal;
- 1600×1000, 1280×900, 1024×768 als kritische Zwischenbreite, 430×932;
- echter Chrome-200-%-Zoom in einem isolierten temporären Profil: 1280 Pixel Außenbreite müssen auf 640 CSS-Pixel reflowen;
- nur synthetische Seeds und `.invalid`-Adressen.

## Kernpfade

1. Organisation anlegen.
2. Kontakt mit Organisation verbinden.
3. Chance für Organisation anlegen.
4. Kontakt als Beteiligten zuordnen.
5. Aufgabe und nächsten Schritt anlegen.
6. Aktivität dokumentieren.
7. Chance durch erlaubte Phasen bewegen.
8. Statushistorie prüfen.
9. Lead qualifizieren und kontrolliert konvertieren.
10. Partnerorganisation und getrennten Partnerkontakt pflegen.
11. Kontaktstatus-Sperre und lokale ACC-Doppelfreigabe prüfen.
12. alle angekündigten Objekttypen suchen sowie Chance archivieren/wiederherstellen.
13. Reload-Persistenz, ungegewichteten Bericht und gesperrten Export prüfen.
14. Demo kontrolliert zurücksetzen.

15. Notiz, Gespräch, Termin, Wiedervorlage, Angebot, Entscheidung und Dokumentreferenz anlegen, suchen und öffnen; lokale Ansicht speichern; Alterungsregel ändern.

## R3.2-spezifische Prüfverträge

- jedes der sieben Fachobjekte besitzt Pflichtfeld-, Beziehungs- und Negativtests;
- jede Neuanlage erzeugt ein Audit-Ereignis und einen verknüpften Aktivitätseintrag;
- Dokumentreferenzen enthalten ausschließlich Metadaten und keine Datei-/URL-Übertragung;
- Angebotsstatus `marked_sent` führt zu keiner Netzwerk- oder Versandaktion;
- gespeicherte Ansichten bleiben lokal und reversibel archivierbar;
- Alterungsregeln erzeugen ausschließlich lokale Hinweise;
- v4-Persistenz überschreibt die vorhandenen v1-, v2- und v3-Schlüssel nicht;
- globale Suche findet jeden angekündigten R3.2-Objekttyp.

## Abnahmekriterien

- Build, Unit, Vertrag, Integration und E2E grün.
- Keine relevanten Browserfehler/-warnungen.
- Keine inerte sichtbare Aktion ohne klare Kennzeichnung.
- Tastaturweg ohne Fokusverlust; Escape schließt aktive Dialoge/Drawer.
- Kein Seitenüberlauf; Tabellen/Schienen dürfen kontrolliert intern scrollen.
- Quell-/Rendervergleich bewahrt AMAVIO-Palette, Typografie, offene Flächen und Navigation.
- Keine produktiven Integrations- oder Reifegradbehauptungen.

## Vertragstest-Erweiterung nach Product-Owner-Beschluss vom 09.10.2026

Vor einem Abschluss von R3 müssen zusätzlich geprüft werden:

- phasenbezogene Mindestkriterien für alle sieben Pipelineausgänge;
- explizit zulässige offene Evidenz ohne erfundene Ersatzwerte;
- Lead-zu-Opportunity-Konvertierung nur mit Organisation, Bedarf, Owner und fälligem nächsten Schritt;
- getrennte Partner-, Account- und Kontaktobjekte ohne Partnerlogin;
- Trennung von Beziehungs-, Kontakt- und Einwilligungs-/Rechtsstatus;
- Sperrwirkung von `withdrawn` und `blocked` auf jede später eingeführte Außenaktion;
- Single-Workspace-Grenze und Negativtest gegen behauptete Mandantenfähigkeit;
- ACC-Handoff-Marker erst nach beiden fachlichen Freigaben, ohne Personendaten im Default;
- kein gewichteter Forecast, kein Export und keine unvollständige Mischsprache;
- Negativtests, dass sämtliche Gates von Bündel C geschlossen bleiben.

Diese Anforderungen sind in der R3-Arbeitskopie durch Unit-, Vertrags-, Komponenten-, Integrations- und End-to-End-Tests abgedeckt. Der Nachweis gilt ausschließlich lokal und synthetisch; er ersetzt weder UAT noch Rechts-, Datenschutz-, Security- oder Produktivfreigabe.

## R3.3-Testergänzung

- Unit: Schema v5, neue Suchtypen, synthetische Grenze und geschlossene Außenfähigkeiten.
- Vertrag: Recherche→Lead nur mit Quelle; Outreach-Freigabe nur mit dokumentiertem Status; Suppression blockiert Entwürfe.
- Persistenz: SQLite-Health, Speichern, Snapshot, JSON-Ausgabe, Reset, Restore und Abweisung nicht-synthetischer Importe.
- E2E: Rechercheeintrag anlegen, kontrolliert zum Lead übernehmen, Outreach-Entwurf anlegen, gesperrten Versand prüfen und Browser-Fallback sichtbar nachweisen.
- Browser-QA: Growth-Oberfläche bei 1600, 1280, 1024 und 430 Pixel sowie bei echtem 200-%-Reflow; Konsole ohne Fehler.
- Negativ: kein aktiver externer Fetch, kein Sendestatus, keine Provider-Credentials, keine reale E-Mail-Adresse und keine ACC-/App-Übertragung.

## R3.5-Testergänzung

- Unit: Kontaktentscheidung für offen, vollständig dokumentiert und gesperrt; Preflight-Missing-Evidence; stabile Operational Signals; alle Zukunftsgates geschlossen.
- Integration: ein abgeleiteter Prüfpunkt wird als verknüpfte Aufgabe angelegt; identischer `readinessKey` wird abgewiesen; Audit bleibt nachvollziehbar.
- Komponente: „Darf kontaktiert werden?“, Outreach-Preflight, produktive Versandsperre, Aufgabenaktion und drei getrennte Gates sind semantisch sichtbar.
- E2E: Operational Readiness öffnen, Versandsperre verifizieren, ersten Prüfpunkt in eine Aufgabe überführen, Erfolgsmeldung und deaktivierte Dublettenaktion prüfen, Aufgabe in der Aufgabenliste wiederfinden.
- Browser: neue Arbeitsfläche bei 1600, 1280, 1024, 768, 430 und 390 Pixeln sowie echtem 200-%-Zoom; kein Seitenoverflow und keine Konsolenfehler.
- Negativ: `productiveSendAllowed` bleibt immer `false`; kein externer Fetch, kein Live Research, kein Provider-Login, kein realer Kontaktdatensatz und keine Rechtsfreigabe-Behauptung.

## R3.9-Testergänzung – Informationsarchitektur

- Statisch: „Daten & Sicherung“ darf nicht mehr als Growth-Unterregister vorkommen; „Sicherung & Datenvertrag“ muss im Systemmodus vorhanden sein.
- Komponente: Growth-Modus zeigt Recherche/Outreach/Kontaktfreigabe ohne Systembereich; Systemmodus zeigt Sicherung, Datenvertrag und G1 ohne Growth-Navigation.
- E2E: Hauptnavigation „System & Freigaben“ öffnet die gleichnamige Seite; G1-Prüfspur bleibt erreichbar; Rücksprung zu Research & Outreach erhält die konkrete Kontaktfreigabe.
- Browser: neue Systemansicht bei 1600, 1280, 1024, 768, 430 und 390 Pixeln, ohne Seitenüberlauf und ohne Growth-Unterregister.
- Regression: Arbeitstag, Cockpit, Pipeline und Auswertungen bleiben als getrennte Zwecke und Oberflächen erreichbar.
- Datenvertrag: Schema v7, Storage-Key und bestehende synthetische Migration bleiben unverändert; R3.9 erzeugt keine Datenmigration.

## R3.10-Testergänzung – Local Operations Assurance

- Unit: Ein protokollierter `restore_drill` wird als lokale G1-07-Evidenz erkannt, ohne `releaseEligible` zu aktivieren.
- Integration: Nur ein Ergebnis mit `status=passed`, `syntheticOnly=true` und `liveStateMutated=false` darf in Kontrollspur und Audit übernommen werden.
- Persistenz: Der aktuelle Zustand wird in einer frischen SQLite-In-Memory-Datenbank round-trip-geprüft; Schema, synthetischer Vertrag und SHA-256-Prüfsumme müssen übereinstimmen.
- Negativ: Ein zuvor gespeicherter Testmarker bleibt nach der Probe unverändert; abweichende oder nicht-synthetische Erfolgsbehauptungen werden abgewiesen.
- Komponente/E2E: Die Aktion steht nur in „Prüfspur & Beschluss“, ist im Browser-Fallback deaktiviert und behauptet keine produktive Wiederherstellung.
- Regression/Browser: vollständige Logik-, E2E- und Browsermatrix einschließlich 200-Prozent-Zoom und fehlerfreier Konsole; Schema v7 bleibt unverändert.

## R3.11-Testergänzung – G1 Product-Owner Decision Alignment

- Unit: `PO-CRM-043` enthält genau G1-01, G1-05, G1-07 und G1-09; alle vier Gates werden `po_decided_local`.
- Vertrag/Migration: bestehende v7-Zustände erhalten die vier Policies und genau ein idempotentes Beschluss-Audit; Schema und Storage-Key bleiben unverändert.
- Komponente: Beschlusslage, vier Beschlusskarten, Restnachweise und NO-GO sind gemeinsam sichtbar.
- Integration: Kontrollläufe erhalten den Beschlussvertrag und können `releaseDecision`, `releaseEligible`, `realDataEnabled` oder `outboundEnabled` nicht öffnen.
- E2E/Browser: vier PO-beschlossene Gates und vier Beschlusskarten sind bei allen Zielbreiten erreichbar; G1-10 bleibt NO-GO.
- Negativ: G1-03 bleibt extern, G1-06 technisch und G1-10 PO-gesperrt; keine produktive Kontakt-, Zugriffs-, Recovery- oder Löschfreigabe.

## R3.15-Testergänzung – lokales Echtdaten-Staging

- Import/Dry-Run: Quellen, Hashes, Pflichtfelder, Fremdschlüssel, externe IDs, 31 Mehrfachgruppen, 48 Namensprüfkontakte und Quarantäneregeln vor Schreibzugriff prüfen.
- Transaktion: jede Verletzung führt zum vollständigen Rollback; keine Teilübernahme.
- Vertrag: exakte Bestandszahlen, 238 Beziehungen, 407 Revieweinträge, 93 Quarantänehinweise, sechs Dublettensignale und sieben Quellregistereinträge.
- Sperre: 3.213/3.213 Poolkontakte und 166/166 bestätigte Kontakte erfüllen `do_not_contact=1` und `outreach_approved=0`.
- Idempotenz: zweiter identischer Lauf erzeugt null neue Datensätze.
- API: ausschließlich lokale GET-Endpunkte unter `/api/staging/*`; keine Browsermutation und kein externer Fetch.
- Komponente: sechs Register, Suche, Filter, Pagination, Leer-/Fehlerzustände, Detaildialog, Provenienz und klare Nichtkontaktkennzeichnung.
- Integration: synthetischer Demo-Reset verändert die Staging-SQLite nicht; Stagingdaten erscheinen nicht in Core-Auswertungen oder Core-Suche.
- E2E/Browser: Navigation, Bestandskennzahlen, Namensfilter, Detaildialog, Tastatur, 1600/1280/1024/768/430 Pixel, 200-%-Zoom und fehlerfreie Konsole.
- Negativ: Cloud, Supabase, Versand, App und ACC bleiben `false`; kein Test darf reale Außenwirkung auslösen.
