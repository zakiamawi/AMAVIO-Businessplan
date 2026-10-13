# AMAVIO One CRM – C1 Freigabeentscheidung (Entwurf)

**Stand:** 10.10.2026  
**Aktueller Status:** nicht freigegeben; drei Entry-Gates und der ausdrückliche Beschluss sind offen  
**Wirkung dieses Dokuments:** keine Kontoanlage, keine Beschaffung, keine technische Aktivierung

## Vorbedingungscheck

| Voraussetzung | Nachweis | Status |
|---|---|---|
| R3.2 geschützt und Gate-Arbeitskopie getrennt | QA-Gatebericht | erfüllt |
| C1-Scope/Negativumfang eindeutig | Entry-Gate-Register | erfüllt |
| Architektur/Umgebung/Exit spezifiziert | C0-ADR + Environment/Exit-Strategie | erfüllt |
| Threat Model und Stop-Kriterien | Security-/Bedrohungsmodell | erfüllt auf Spezifikationsebene |
| API-/RLS-/Rollenvertrag | Autorisierungs- und RLS-Testmatrix | erfüllt auf Spezifikationsebene |
| RPO/RTO/Restore-Abnahme | Backup-/Restore-Vertrag | erfüllt auf Spezifikationsebene |
| DPA/TIA/Subprozessoren/Transfers qualifiziert geprüft | Due-Diligence, Freigabevermerk | **offen** |
| Technical Operator und zweite Prüffunktion benannt | Betriebsmodell | **offen** |
| Budget/Tarif/Kostenlimit bestätigt | Kostenvorlage | **offen** |
| eigener enger Product-Owner-Beschluss | nachfolgender Wortlaut | **offen** |

## Empfohlener enger Beschlusswortlaut – erst nach Schließen der offenen Punkte

> Ich gebe ausschließlich C1 als getrennte sichere Plattformgrundlage für synthetisches AMAVIO-One-CRM-Staging frei. Erlaubt sind genau ein Supabase-Pro-Projekt in `eu-central-1` Frankfurt, PostgreSQL und Auth sowie die lokale Anbindung über eine AMAVIO-Server/API-Grenze. Weboberfläche und API bleiben lokal; es wird kein öffentlicher Endpunkt, Hosting oder Deployment eingerichtet. Es werden ausschließlich synthetische CRM-Fachdaten verwendet. TOTP-MFA, AAL2, serverseitige Rollen-/Objektprüfung, restriktive RLS, versionierte Migrationen, minimiertes Audit, tägliche Backups und ein Restore-Test sind Pflicht. Der Planungsrahmen beträgt 50–100 EUR brutto pro Monat mit einer harten Obergrenze von 100 EUR; Kauf, Add-ons und weitere Projekte benötigen weiterhin eine gesonderte unmittelbare Freigabe. Reale CRM-Daten, Import, Storage/Dokumentdateien, CRM-E-Mail/Kalender, Realtime, Webhooks, ACC/App, produktive KI, Produktion und C2 bis C7 bleiben gesperrt.

## Zusätzlich auszufüllende Freigabefelder

| Feld | Eintrag |
|---|---|
| Product Owner / Datum |  |
| Technical Operator |  |
| Security Reviewer / zweite Freigabe |  |
| Privacy/Contract Review / Datum / Ergebnis |  |
| Budget und Zahlungsverantwortung |  |
| erneuter Preis-/DPA-/Subprozessoren-Abruf am Starttag |  |
| geplantes C1-Ende/Reviewdatum |  |

## Nicht zulässige verkürzte Auslegung

Eine spätere Zustimmung zu C1 wäre keine Freigabe für:

- reale Organisationen, Kontakte, Mitarbeiter, Kunden, Partner oder Research-Teilnehmer;
- öffentliche oder produktive Nutzung;
- E-Mail-/Kalender-Kommunikation oder automatische Einladungs-/Kampagnenlogik des CRM;
- Datei-/Dokumentspeicher;
- Hosting der AMAVIO-Weboberfläche oder API;
- ACC-/App-Verknüpfung;
- Import, Export, KI oder Automatisierung;
- einen zweiten Workspace, externe Rollen oder Mandantenfähigkeit;
- C2, C3, C4, C5, C6 oder C7.

## Aktuelle Entscheidung

**NO-GO für C1 am 10.10.2026.** Der technische Entscheidungsraum ist vorbereitet, aber eine qualifizierte Datenschutz-/Vertragsannahme, personelle Betriebsverantwortung und Budgetfreigabe fehlen. Das ist ein kontrollierter Gate-Status, kein Projektfehler.

