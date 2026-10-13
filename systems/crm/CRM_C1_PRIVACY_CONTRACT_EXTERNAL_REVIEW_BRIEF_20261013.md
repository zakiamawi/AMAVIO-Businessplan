# C1 – externes Datenschutz- und Vertragsprüfbriefing

**Datum:** 13.10.2026  
**Interner Owner:** Zaki Amawi, Gründer  
**Status:** extern prüfbereit; keine Rechtsberatung und keine Datenschutz-/Vertragsfreigabe

## Enger Prüfgegenstand

Geprüft werden soll ausschließlich, ob ein einzelnes, nicht öffentliches Supabase-C1-Staging in der spezifischen Region Frankfurt `eu-central-1` mit synthetischen CRM-Fachdaten, Postgres und Auth unter den dokumentierten Grenzen vertretbar vorbereitet werden kann. Reale CRM-Daten, produktive Kommunikation, Storage, Realtime, Edge Functions, Webhooks, Social Login, App/ACC und Mehrbenutzerbetrieb sind nicht Teil des Auftrags.

Provider-Verwaltungsdaten wie Kontoinhaber-, Login-, Abrechnungs-, IP-, Geräte-, Session- und Supportdaten können dennoch real personenbezogen sein und müssen ausdrücklich bewertet werden.

## Zu prüfende Unterlagen

- Supabase DPA, Version 1 vom 01.08.2026;
- Data Residency and Transfers FAQ, Version 1 vom 06.10.2026;
- aktuelle Subprozessorenliste und Änderungsmechanismus;
- Terms, Privacy, Support- und Löschbedingungen;
- Transfermechanismen, SCCs und TIA für Singapur, USA und weitere Verarbeitungsorte;
- technische und organisatorische Maßnahmen sowie Shared-Responsibility-Modell;
- `CRM_C1_DATA_PROTECTION_AND_PROVIDER_DUE_DILIGENCE_20261010.md`;
- `CRM_C1_ENVIRONMENT_SECRET_AND_EXIT_STRATEGY_20261010.md`;
- `CRM_C1_BACKUP_RESTORE_RPO_RTO_DRAFT_20261010.md`.

## Entscheidungsmatrix für die externe Stelle

| ID | Frage | Erwartetes Ergebnis |
|---|---|---|
| DP-01 | Passt die Rollenverteilung Controller/Processor beziehungsweise mögliche Subprocessor-Konstellation? | begründete Einordnung |
| DP-02 | Erfüllt das einbezogene DPA die Anforderungen des konkreten engen C1-Scope? | akzeptiert / Auflage / nicht akzeptiert |
| DP-03 | Sind SCC/TIA und weitere Schutzmaßnahmen für Transfers und Supportzugriffe ausreichend? | dokumentierte Transferbewertung |
| DP-04 | Sind allgemeine Subprozessorfreigabe, Änderungsfrist und Einspruchsweg beherrschbar? | Prozess und Owner |
| DP-05 | Welche Provider-Verwaltungsdaten entstehen und auf welcher Grundlage werden sie verarbeitet? | Dateninventar und Rechtsgrundlage |
| DP-06 | Sind Aufbewahrung, Export, Rückgabe, Projektlöschung und Backupauslauf nachvollziehbar? | Exit- und Löschauflagen |
| DP-07 | Welche Informations-, VVT-, TOM- und Incidentdokumente braucht AMAVIO bereits vor Projektanlage? | konkrete Pflichtliste |
| DP-08 | Welche Vertrags-/Preisänderungen müssen erneut geprüft werden? | Monitoring- und Reviewintervall |

## Offizielle Prüfreferenzen

- https://supabase.com/legal/customer-resources/data-processing-addendum
- https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq
- https://supabase.com/legal/customer-resources/subprocessor-list
- https://supabase.com/docs/guides/platform/regions
- https://supabase.com/docs/guides/deployment/shared-responsibility-model
- https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A32016R0679
- https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en

## Abgabe und Freigabegrenze

Die externe Stelle soll Versionen und Abrufdaten, geprüften Scope, Findings, Auflagen, Restrestrisiken und ein eindeutiges Ergebnis `akzeptiert`, `akzeptiert mit Auflagen` oder `nicht akzeptiert` dokumentieren. Eine Freigabe für Synthetic-only-C1 ist ausdrücklich keine Freigabe für reale CRM-Daten, Outreach, Produktion oder App-/ACC-Verarbeitung.

- Prüfstelle/Person: `[auszufüllen]`
- Qualifikation/Mandat: `[auszufüllen]`
- Datum: `[auszufüllen]`
- Ergebnis: `[akzeptiert / mit Auflagen / nicht akzeptiert]`
- Auflagen/Referenzen: `[auszufüllen]`
- Bestätigung: `[auszufüllen]`

Bis zu diesem Ergebnis bleibt `externalPrivacyTermsApproved=false`.
