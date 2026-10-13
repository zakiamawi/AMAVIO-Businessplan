# Founder-Entscheidungen für Productization Gate 02

**Stand:** 07.10.2026  
**Zweck:** die Entscheidungen dokumentieren, die nach Abschluss von Gate 01.5 für einen externen generativen KI-Test mit weiterhin synthetischen Fällen benötigt würden

## Sequenzentscheidung vom 07.10.2026

Gate 02 ist bewusst geparkt. Zuerst wird Productization Gate 01.5 als eigenständige lokale Produktstufe geplant und nach separater Founder-Freigabe umgesetzt. Es baut Fallarbeit, Abhängigkeiten, Ausnahmen, Simulationen, Arbeitsprodukte, Evidenz und Evaluation so weit aus, dass eine externe KI später nur eine klar begrenzte und messbare Verstärkung darstellt.

Maßgeblich sind:

- `ACC_PRODUCTIZATION_GATE_01_5_OPERATIONAL_DEPTH_PLAN_20261007.md`;
- `../QA/ACC_GATE_01_5_ACCEPTANCE_MATRIX_20261007.md`.

Der vorliegende Gate-02-Precheck bleibt als vorbereitete Entscheidungsvorlage erhalten. Er löst keine Anbieter-, Konto-, Vertrags-, Kosten- oder Implementierungsfreigabe aus.

## Frühestens nach Gate 01.5 möglicher Release

**Gate 02 – External Assistance Sandbox**

Ein externer Modellanbieter erzeugt für ausschließlich synthetische ACC-Fälle strukturierte Arbeitsvorschläge hinter dem bereits implementierten Provider-Interface. Ergebnisse werden validiert, versioniert, gespeichert und müssen weiterhin menschlich angenommen oder zurückgewiesen werden. Versand, Buchung und sonstige Außenwirkung bleiben im Sink.

Nicht empfohlen als nächster Release sind eine echte Risikoprognose oder automatische Personenentscheidung. Dafür fehlen heute Datengrundlage, Validierungsnachweis und rechtliche Zweckfestlegung.

## Benötigte Founder-Entscheidungen

### D1 – Produktzweck der KI

**Empfehlung:** Assistenz für AMAVIO Operations: Fallzusammenfassung, Evidenzprüfung, Arbeitsplan und Kommunikationsentwurf.  
**Ausgeschlossen:** Rekrutierung, Auswahl, Eignungsbewertung, Leistungsbewertung, Verhaltensprofiling, automatische Priorisierung einer Person oder Entscheidung über Arbeitsbedingungen.

### D2 – Testdaten

**Empfehlung:** ausschließlich synthetische, klar markierte Fixtures ohne Bezug zu realen Personen, Arbeitgebern, Objekten oder Partnern.  
**Späteres Gate:** pseudonymisierte oder reale Daten erst nach Zweck-/Rechtsgrundlage, Datenfluss, Löschkonzept, AVV/DPA, Unterauftragnehmerprüfung und DSFA-Vorprüfung.

### D3 – AI Provider

**Recherchefortschritt 07.10.2026:** Der aktuelle Datenschutz- und Kostenvergleich ist in `AI_PROVIDER_DATENSCHUTZ_KOSTENVERGLEICH_20261007.md` dokumentiert. Der öffentliche Vertrags- und Kontofähigkeits-Precheck liegt in `AI_PROVIDER_ACCOUNT_CONTRACT_PRECHECK_20261007.md`. Als Finalisten bleiben Mistral API über den EU-Endpunkt und OpenAI API über den EU-Endpunkt; Mistral ist der bevorzugte Kandidat für eine zweite Founder-Freigabe. Eine Aktivierung oder Kostenfreigabe ist daraus nicht abgeleitet; ZDR-, Training-, Modell-, Konto- und Vertragsnachweise bleiben offen.

Zu entscheiden und vertraglich zu prüfen:

- Anbieter und konkretes Modell;
- EU-/EWR-Verarbeitung und internationale Übermittlungen;
- Nutzung von Ein-/Ausgaben zum Training;
- Aufbewahrung und Löschung;
- Unterauftragnehmer;
- DPA/AVV und technische Sicherheitsmaßnahmen;
- Kostenlimit und Rate Limits;
- Verfügbarkeit, Exit und Providerwechsel.

**Architekturentscheidung:** providerneutrales Interface beibehalten; kein Modellaufruf aus dem Browser; kein API-Key im Frontend.

### D4 – Ausgabe- und Sicherheitsvertrag

**Empfehlung:** ausschließlich JSON-Schema-Ausgaben mit:

- `summary`;
- `recommendation`;
- `evidence[]`;
- `confidence` und `uncertainty`;
- `forbiddenActions[]`;
- `proposedSteps[]` mit `ownerRole` und `humanGate`.

Serverseitige Validierung, Zeitlimit, Größenlimit, Redaction, Prompt-/Modellversion und deterministischer Fallback sind Pflicht.

### D5 – Identität und Datenbankziel

**Empfehlung:** Gate 02 bleibt intern und synthetisch. Parallel wird für das spätere MVP ein Vergleich vorbereitet:

- verwalteter Identity Provider mit MFA/SSO-Option;
- PostgreSQL in freigegebener EU-Region;
- Tenant-ID serverseitig erzwungen;
- Row-Level-/Policy-Isolation plus automatisierte Negativtests;
- getrennte Rollen für AMAVIO Operations und Arbeitgeber;
- keine Fachkraft-, Wohnanbieter- oder Partnerrolle im ACC.

### D6 – Wirkung

**Empfehlung:** Nachrichten- und Buchungsadapter bleiben `sink_only`. Eine spätere Live-Aktivierung braucht je Kanal einen eigenen Founder-, Datenschutz-, Vertrags-, Kosten- und Betriebsgate.

### D7 – Prognosen

Vor einem Prognoseprojekt muss der Founder genau einen Outcome definieren. Beispiele wie „Start gefährdet“ sind zu unscharf. Ein valider Outcome wäre etwa: „Anreise wurde bis 12:00 Uhr am geplanten Datum erfolgreich bestätigt – ja/nein“. Erst danach können Datenverfügbarkeit, Klassengleichgewicht, Baseline, Fehlkosten und Fairness geprüft werden.

### D8 – Automatisierte Entscheidungen

**Empfehlung:** für den nächsten Release ausgeschaltet. Kein Vorschlag darf ohne sinnvolle menschliche Prüfung eine Person bewerten, eine Freigabe wirksam setzen, einen Zugang sperren, eine Buchung auslösen oder eine Nachricht versenden.

## Freigabeformel für Gate 02

Eine ausreichende Freigabe sollte ausdrücklich enthalten:

> Freigegeben ist ein lokaler oder geschützter synthetischer Gate-02-Test mit dem benannten AI Provider und Modell, dem vereinbarten Kostenlimit und dem dokumentierten Daten-/Aufbewahrungsmodus. Alle Ausgaben bleiben strukturierte Vorschläge mit menschlicher Prüfung. Reale Daten, produktive Registrierung, Live-Nachrichten, Buchungen, Personenprognosen, automatisierte Entscheidungen, Hosting und Veröffentlichung bleiben ausgeschlossen.

Ohne diese Angaben und ohne den dokumentierten Abschluss von Gate 01.5 bleibt der externe Provider technisch deaktiviert. Gate 01 kann weiter lokal getestet werden; Gate 01.5 darf erst nach eigener Founder-Freigabe in einer neuen datierten Arbeitskopie umgesetzt werden.
