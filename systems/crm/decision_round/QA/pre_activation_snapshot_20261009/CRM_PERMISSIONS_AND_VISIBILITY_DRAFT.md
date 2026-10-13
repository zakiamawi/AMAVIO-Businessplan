# AMAVIO One CRM – Berechtigungen und Sichtbarkeit (Draft)

**Status:** Product-Owner- und Security-Gate offen; im lokalen Prototyp nicht sicherheitswirksam

| Rolle | Lesen | Bearbeiten | Archivieren | Export/Integration |
|---|---|---|---|---|
| CRM Admin | alle CRM-Core-Objekte | alle Core-Objekte | ja | nur nach separatem Gate |
| Commercial Owner | eigene/zugewiesene Accounts und Chancen | eigene/zugewiesene Datensätze | eingeschränkt | nein |
| Commercial Editor | freigegebene Accounts, Kontakte, Chancen, Aufgaben | freigegebene Datensätze | nein | nein |
| Operations Viewer | gewonnene und freigegebene Übergabekontexte | nein | nein | nein |
| Privacy Reviewer | Kontaktstatus, Herkunft, Audit-Metadaten | nur Datenschutzstatus | Sperr-/Prüfmarker | kontrollierter Auskunftsprozess, Gate |

## Sichtbarkeitsklassen

- `commercial_internal`: Standard für CRM-Beziehungsdaten.
- `restricted_contact`: Kontakt- und Kommunikationsstatus.
- `handoff_review`: nur für kontrollierte ACC-Übergabeprüfung.
- `system_audit`: Audit-Metadaten.

## Noch zu entscheiden

- tatsächliche Nutzerzahl und Teamstruktur;
- Feldrechte für Kontakt- und Datenschutzdaten;
- Vertretungs- und Freigabelogik;
- Trennung eigener und teamweiter Datensätze;
- Rollen für externe Partner – im aktuellen Zielbild nicht vorgesehen;
- Authentifizierungsanbieter, MFA, Sessiondauer und Notfallzugriff;
- Mandantenfähigkeit – aktuell ausdrücklich nicht behauptet.
