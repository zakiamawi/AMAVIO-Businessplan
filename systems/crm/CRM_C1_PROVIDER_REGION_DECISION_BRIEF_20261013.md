# C1 – eindeutiger Provider- und Regionsbeschluss

**Datum:** 13.10.2026  
**Status:** entscheidungsreif; keine Auswahl vorweggenommen; kein Kauf

## Entscheidungsvorschlag

Planungskandidat ist genau ein Supabase-Projekt mit Postgres und Auth in der spezifischen AWS-Region Frankfurt `eu-central-1`. Die Region ist bei Projektanlage ausdrücklich zu wählen; eine allgemeine Regionsgruppe reicht nicht. C1 bleibt synthetisch, lokal angebunden, nicht öffentlich und ohne Storage, Realtime, Edge Functions, Webhooks, Social Login oder Connectoren.

Supabase führt `eu-central-1` als spezifische Frankfurter Region. Die Regionswahl steuert den primären Standort von Datenbank, Auth und Backups, beweist aber keine vollständige EU-Verarbeitung oder Compliance. Der Provider dokumentiert mögliche Verarbeitung außerhalb der Region für Verwaltungs-, Support-, Betriebs- und Telemetriezwecke.

## Kostenrahmen

- beschlossener Planungskorridor: 50–100 EUR brutto pro Monat;
- harte Planungsobergrenze: 100 EUR brutto pro Monat;
- Kauf, Zahlungsart und Add-ons: nicht freigegeben;
- öffentliche Preisbasis zum 13.10.2026: Pro ab 25 USD/Monat, erstes Micro-Projekt durch 10-USD-Compute-Credit abgedeckt;
- Spend Cap standardmäßig relevant, aber nicht alle Positionen wie Compute, PITR, Custom Domain oder weitere explizite Add-ons sind davon erfasst;
- genau ein Projekt, Micro Compute, keine Add-ons und monatliche Rechnungskontrolle sind für einen späteren C1-Beschluss vorgesehen.

## Verbindliche Auswahl

Genau eine Option ist durch den Product Owner ausdrücklich zu markieren:

- [ ] **FREIGEGEBEN FÜR C1-PLANUNG:** Supabase, spezifische Region Frankfurt `eu-central-1`, ausschließlich im dokumentierten synthetischen Minimalumfang. Diese Auswahl erlaubt noch kein Projekt, keinen Kauf und keine Implementierung; sie schließt nur das Provider-/Regionsentscheidungsgate.
- [ ] **NICHT FREIGEGEBEN:** Supabase beziehungsweise Frankfurt `eu-central-1` wird nicht weiterverfolgt. C1 bleibt gesperrt und die qualifizierte Rückfalloption muss neu bewertet werden.
- [ ] **ZURÜCKGESTELLT:** Entscheidung wird bis zum Abschluss des externen Security- und Datenschutz-/Vertragsreviews vertagt.

## Pflichtbedingungen bei Auswahl „freigegeben“

1. unabhängiges Security Review oder ausdrücklich befristete Ausnahme ist dokumentiert;
2. externe Datenschutz-/Vertragsprüfung ist akzeptiert oder mit erfüllbaren Auflagen versehen;
3. Vertretung hat angenommen und der Übergabeweg ist belegt;
4. Firewall-/Geräteblocker und lokaler Zugriffsschutz sind vor C1-Start geklärt;
5. eine unmittelbar vor Provisionierung erneut eingeholte Kosten- und Vertragsprüfung liegt vor;
6. ein gesonderter C1-Implementierungs- und Kaufbeschluss wird erteilt.

## Product-Owner-Beschlussfeld

- ausgewählte Option: `[FREIGEGEBEN / NICHT FREIGEGEBEN / ZURÜCKGESTELLT]`
- Entscheider: Zaki Amawi
- Datum: `[auszufüllen]`
- Auflagen/Kommentar: `[auszufüllen]`
- dokumentierter Nachweis: `[auszufüllen]`

Ohne eindeutige Auswahl bleiben `providerDecision=pending_explicit_choice`, `regionDecision=pending_explicit_choice`, `purchaseApproved=false` und `c1ImplementationAuthorized=false`.

## Offizielle Quellen

- https://supabase.com/docs/guides/platform/regions
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/cost-control
- https://supabase.com/docs/guides/platform/billing-faq
- https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq
