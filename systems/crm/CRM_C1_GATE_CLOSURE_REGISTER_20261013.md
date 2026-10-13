# C1 – Gate-Closure-Register R3.14

**Datum:** 13.10.2026  
**Gesamtstatus:** `NO-GO`; Unterlagen vorbereitet, externe und menschliche Nachweise offen

| Gate | Aktueller Wahrheitsstatus | Vorbereitete Evidenz | Noch erforderlicher Abschluss | Verantwortlich |
|---|---|---|---|---|
| C1-01 Betreiber | bestätigt | PO-CRM-045: Zaki Amawi | kein weiterer Beschluss für die Rollenbenennung; Betriebsnachweis erst in C1 | Product Owner / Technical Operator |
| C1-02 Vertretung | benannt, nicht angenommen | `CRM_C1_DELEGATE_ACCEPTANCE_AND_HANDOVER_DRAFT_20261013.md` | Van Vardanian bestätigt Rolle, getrennten Erreichbarkeitsweg und Trockenlauf | Van Vardanian / Zaki Amawi |
| C1-03 Security Review | Reviewer fehlt | `CRM_C1_SECURITY_REVIEW_BRIEF_20261013.md` | unabhängige Person benennen und Review durchführen oder befristete Ausnahme beschließen | Product Owner / Security Reviewer |
| C1-04 Datenschutz/Vertrag | interner Owner bestätigt, externe Prüfung fehlt | `CRM_C1_PRIVACY_CONTRACT_EXTERNAL_REVIEW_BRIEF_20261013.md` | qualifizierte Stelle bewertet DPA, Transfers, Subprozessoren, Verwaltungsdaten und Exit | Zaki Amawi / externe Prüfstelle |
| C1-05 Budget | Korridor und harte Obergrenze bestätigt, Kauf gesperrt | 50–100 EUR brutto, hart 100 EUR; aktualisierte Kostenbasis | Kaufberechtigung, Zahlungsowner, aktuelle Preisprüfung und Stopregel im gesonderten Beschluss | Product Owner |
| C1-06 Provider/Region | keine eindeutige Auswahl | `CRM_C1_PROVIDER_REGION_DECISION_BRIEF_20261013.md` | genau eine Option markieren und datieren | Product Owner |
| C1-07 Geräteschutz | FileVault/Sperre belegt; Firewall nicht wirksam belegt | `QA/CRM_R3_14_FIREWALL_VERIFICATION_20261013.md` | Firewall mit Systemrechten aktivieren und durch zwei übereinstimmende OS-Nachweise prüfen | Technical Operator / Geräteadmin |
| C1-08 Synthetic-only | bestätigt | Governance-Vertrag und Health-Endpunkt | bei jedem späteren Schritt erneut negativ prüfen | Technical Operator / QA |
| C1-09 Kauf/Provisionierung | nicht erlaubt | Sperrflags und lokaler Netzwerkvertrag | separater unmittelbarer Schreib-/Kostenbeschluss | Product Owner |
| C1-10 Implementierung | nicht autorisiert | `c1ImplementationAuthorized=false` | kumulativ geschlossene Pflichtgates und enger C1-Beschluss | Product Owner |

## Mindestabfolge

1. Reviewer und externe Prüfstelle benennen.
2. Vertretungsannahme dokumentieren und synthetischen Übergabetrockenlauf planen.
3. Datenschutz-/Vertrags- und Security-Review durchführen.
4. Firewall-/Gerätenachweis schließen.
5. Provider/Region eindeutig entscheiden.
6. Befunde, Kostenstand und Auflagen konsolidieren.
7. Erst dann einen getrennten C1-Implementierungs- und Kaufbeschluss vorlegen.

Keine Zeile dieses Registers aktiviert eine externe Ressource oder erlaubt reale Daten.
