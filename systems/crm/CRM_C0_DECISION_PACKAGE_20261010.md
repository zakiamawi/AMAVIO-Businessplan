# AMAVIO One CRM – C0 Entscheidungspaket

**Stand:** 10.10.2026  
**Ergebnis:** C0 fachlich entschieden; C1 nicht freigegeben  
**Produktstatus:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Beschlussübersicht

Der Product-Owner-Auftrag vom 10.10.2026 wird wie folgt umgesetzt:

- R3.2 darf als begrenzter lokaler synthetischer Fachblock umgesetzt werden.
- C0 darf parallel fachlich entschieden werden.
- C1 darf erst nach Abschluss von R3.2 und nach einem neuen ausdrücklichen Beschluss beginnen.
- C2 bis C7 bleiben unverändert gesperrt.

## C0-Entscheidungen

1. **Plattformpräferenz:** Supabase Managed PostgreSQL/Auth in der spezifischen Region `eu-central-1` Frankfurt.
2. **Zugriffsmuster:** Weboberfläche → AMAVIO Server/API → PostgreSQL; kein privilegierter Direktzugriff aus dem Browser.
3. **Autorisierung:** serverseitige Rollen-/Objektprüfung plus restriktive RLS als zweite Schutzschicht.
4. **Identitäten:** nur interne Einladung, TOTP-MFA verpflichtend, keine Selbstregistrierung, keine Social- oder Partnerlogins.
5. **Arbeitsbereich:** genau ein interner Single Workspace; keine Mandantenfähigkeit.
6. **Umgebungen:** lokaler Prototyp bleibt bestehen; C1 würde nur ein getrenntes synthetisches Staging anlegen; Produktion bleibt gesperrt.
7. **Daten:** in C1 weiterhin ausschließlich K1 – interne synthetische Daten. Reale Kontakt- und Geschäftsdaten bleiben gesperrt.
8. **Audit:** minimierte append-only Ereignisse ohne unnötige Inhaltskopien oder Geheimnisse.
9. **Backups:** im C1-Staging mindestens verwaltete tägliche Datenbankbackups plus dokumentierter Restore-Test; produktive RPO/RTO/PITR-Entscheidung bleibt späteres Gate.
10. **Produktgrenzen:** keine gemeinsame Datenbank, Identität oder Secrets mit ACC und App.
11. **Nicht aktivierte Dienste:** Storage, Realtime, Edge Functions, Webhooks, E-Mail, Kalender, Import und KI bleiben aus.
12. **Exit-Fähigkeit:** portables PostgreSQL-Schema, versionierte Migrationen und dokumentierter Export-/Ablöseweg sind Pflicht für C1.

## Vergleichs- und Entscheidungsunterlagen

- `CRM_C0_PROVIDER_COMPARISON_20261010.md`
- `CRM_C0_ARCHITECTURE_DECISION_RECORD_20261010.md`
- `CRM_STEP_C_GATE_AND_SEQUENCE_PLAN_20261010.md`
- `CRM_PERMISSIONS_AND_VISIBILITY_DRAFT.md`
- `CRM_DATA_LIFECYCLE_AND_PRIVACY_DRAFT.md`

## C1-Entry-Gate – Fortschreibung nach dem Gate-Closure-Block

Der Stand dieses ursprünglichen C0-Pakets wurde mit `CRM_C1_ENTRY_GATE_REGISTER_20261010.md` konkretisiert. Interne Spezifikationsgates sind geschlossen; externe Freigaben bleiben offen:

| Gate | Erforderlicher Nachweis | Status 10.10.2026 |
|---|---|---|
| Anbieter/Vertrag | aktueller Vertrag, AVV/DPA, Unterauftragsverarbeiter | öffentliche Evidenz geprüft; qualifizierte Annahme **offen/BLOCKER** |
| Datenschutz | Transferbewertung, Zweck-/Datenklassenprüfung, Lösch-/Auskunftsprozess | technischer Draft vollständig; qualifizierte Freigabe **offen/BLOCKER** |
| Security | Bedrohungsmodell, API-/RLS-Matrix, MFA-/Recovery-Verfahren, Secret-Konzept | **auf Spezifikationsebene geschlossen**; Wirksamkeitsnachweis erst in C1 |
| Betrieb | verantwortliche Person, Monitoring, Incident-Verfahren, Restore-Runbook | Verfahren definiert; Personenzuordnung **offen/BLOCKER** |
| Kosten | bestätigtes Monats-/Jahreslimit einschließlich Backup, Logs und Datenverkehr | PO-CRM-045: Planungskorridor 50–100 EUR brutto/Monat, harte Obergrenze 100 EUR; Kauf weiterhin **offen/BLOCKER** |
| Architektur | C1-Schema-/Migrationsplan, Umgebungs- und Exit-Konzept | **auf Spezifikationsebene geschlossen**; Web/API bleiben in C1 lokal |
| Produkt | ausdrückliche Freigabe nur für synthetisches C1-Staging | Scope geschlossen; gesonderter C1-Beschluss **offen** |

## Nicht beschlossen

C0 ist keine Zustimmung zu Kontoeröffnung, Anbieterbeauftragung, Kosten, Login, Datenbankanlage, Authentifizierung, Hosting, DNS, Deployment, realen Daten, Import, Dokumentenspeicherung, E-Mail, Kalender, ACC/App, KI oder externer Übertragung.

## Nächster zulässiger Beschluss

Erst nach bestätigter R3.2-QA und geschlossenen C1-Entry-Gates kann der Product Owner C1 mit folgendem engen Umfang freigeben:

> Ich gebe ausschließlich C1 als getrennte sichere Plattformgrundlage mit synthetischem Staging frei. Die Umsetzung folgt dem C0-ADR, verwendet keine realen Daten und aktiviert weder Import, Dokumentenspeicher, E-Mail/Kalender, ACC/App, produktive KI noch öffentlichen Produktivbetrieb. C2 bis C7 bleiben gesperrt.
