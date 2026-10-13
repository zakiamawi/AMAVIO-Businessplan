# AMAVIO One CRM – Produktgrenze und Übersetzung

**Datum:** 08.10.2026  
**Arbeitsstatus:** lokal / synthetisch / nicht produktiv

## Übersetzung aus dem IGS-Material

| IGS-Funktion | AMAVIO-CRM-Umsetzung |
|---|---|
| Deal-, Lead- und Projektpipeline | Arbeitgeber-Opportunity-Pipeline von Erstkontakt bis Gewonnen |
| Makro- und Mikroansicht | Cockpitübersicht plus editierbare Opportunity-Akte |
| Pflegeunion-Karte | nicht übernommen; für AMAVIO CRM nicht Kern der ersten Arbeitsfassung |
| M&A-Kennzahlen und Kaufpreisindikation | AMAVIO-Potenzial und definierter Angebots-/Pilotkontext |
| Partner & Deal-Quellen | Partner- und Empfehlungsquellen mit Beziehungsstatus |
| Fristen, Termine und Aufgaben | gemeinsame nächste Handlungen mit Owner und Fälligkeit |
| Weekly Report | lokaler Weekly Brief ohne Versand |
| HubSpot, Drive, Gmail | nicht übernommen; externe Integrationen bleiben geschlossen |

## Trennung der AMAVIO-Produkte

1. **CRM:** Beziehung, Account, Kontakt, Opportunity, nächste Handlung, kommerzielle Übergabe.
2. **Arrival Control Center:** Arbeitgeber-/AMAVIO-Fallsteuerung nach einem kontrollierten Pilotstart.
3. **AMAVIO One App:** getrennte externe Rollen Fachkraft, Wohnanbieter und lokaler Partner.

Ein gewonnener CRM-Datensatz erzeugt keinen ACC-Fall. Die sichtbare Übergabe ist ein lokaler Planungsmarker ohne technische oder externe Wirkung.

## Offene Produktivgates

- Rechtsgrundlagen, Löschfristen und rechtliche Aufbewahrung; Archivierung bleibt der beschlossene operative Standard;
- Authentifizierung, technische Rollenwirkung und Berechtigungsdurchsetzung; fachlich sind fünf interne Zielrollen beschlossen;
- produktiver interner Single-Workspace; Mandantenfähigkeit und externe Zugänge sind nicht vorgesehen und nicht freigegeben;
- produktive Datenbank und Backup;
- Importlogik; Export bleibt im R3-Zielvertrag deaktiviert;
- technische Angleichung der beschlossenen phasenbezogenen Mindestkriterien;
- Integrationsentscheidung Airtable / eigenes Backend / anderes CRM;
- E-Mail-, Kalender- und Dokumentanbindung;
- technische ACC-Schnittstelle; die fachliche Dual-Approval-Grenze löst keine Integration aus;
- Hosting, Security, Datenschutzprüfung und Release-Freigabe.

Die Product-Owner-Entscheidungen vom 09.10.2026 sind in `CRM_PRODUCT_OWNER_DECISIONS.md` dokumentiert. Sie verändern die oben genannten Produktivgates nicht.
