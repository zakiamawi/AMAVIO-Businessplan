# AMAVIO One CRM – Product-Owner Decision Brief

**Datum:** 09.10.2026  
**Entscheidungsumfang:** `PO-CRM-001` bis `PO-CRM-020`  
**Status:** **BÜNDEL A+B GEMÄSS EMPFEHLUNG BESCHLOSSEN / BÜNDEL C VOLLSTÄNDIG GESPERRT / NICHT PRODUKTIV FREIGEGEBEN**

## 1. Ausgangslage

Der Canonical Core ist als lokaler synthetischer Prototyp funktions- und browsergeprüft. Er besitzt belastbare Kernobjekte und Arbeitsabläufe, aber keine produktive Datenbank, Authentifizierung, Rollen-Durchsetzung, realen Daten oder Integrationen. Die nächste sinnvolle Stufe ist daher keine weitere Funktionssammlung, sondern die Festlegung des fachlichen Zielvertrags und die ausdrückliche Bestätigung der produktiven Gates.

## 2. Entscheidungsvorschlag

### Bündel A – Kommerzieller CRM-Kern

**Empfehlung: als R3-Zielvertrag annehmen, mit späterer versionierter Änderung statt stiller Erweiterung.**

| ID | Empfehlung | Wesentliche Konsequenz |
|---|---|---|
| PO-CRM-001 | Die sechs vorhandenen Erfolgsphasen plus `Verloren` als separaten Ausgang für R3 beibehalten. | Kein Pipeline-Neudesign vor Pilotlernen; Phasenänderungen werden versioniert. |
| PO-CRM-003 | Phasenbezogene Mindestkriterien verbindlich definieren; fehlende Evidenz darf als „offen“, nicht als erfundener Wert geführt werden. | Qualifizierung wird prüfbar, ohne Daten vorzutäuschen. |
| PO-CRM-004 | Lead und Opportunity trennen: Lead = ungeprüftes Signal; Opportunity = benannte Organisation, konkreter Bedarf, Owner und fälliger nächster Schritt. | Verhindert eine überfüllte Pipeline und ermöglicht später einen sauberen Konvertierungsprozess. |
| PO-CRM-005 | Partner als getrennte Objektklasse führen; interne Pflege nur durch berechtigte AMAVIO-Rollen, kein Partnerlogin im CRM. | Verhindert die Vermischung von Arbeitgeber-, Partner- und App-Rollen. |
| PO-CRM-018 | Deutsch als vollständige Primärsprache für R3; EN erst als geschlossenes, getestetes Sprachpaket. | Keine unvollständige Mischsprache. |
| PO-CRM-019 | Bis zu belastbaren Erfahrungswerten nur Anzahl und sichtbares Potenzial zeigen; keine gewichtete Forecast-Zahl. | Keine Scheingenauigkeit und keine Verwechslung mit Finanzplanung. |
| PO-CRM-020 | Export in R3 deaktiviert lassen; später nur rollenbezogen, zweckgebunden und auditiert spezifizieren. | Kein unkontrollierter Abfluss von Kontakt- oder Geschäftsdaten. |

### Bündel B – Governance und Produktgrenzen

**Empfehlung: als fachlichen Vertrag annehmen; technische Wirksamkeit bleibt bis Authentifizierung und Security-Architektur ausdrücklich offen.**

| ID | Empfehlung | Wesentliche Konsequenz |
|---|---|---|
| PO-CRM-002 | Fünf interne Zielrollen beibehalten: CRM Admin, Commercial Owner, Commercial Editor, Operations Viewer, Privacy Reviewer. | Klare Verantwortungsbegriffe; noch keine Zugriffsgarantie. |
| PO-CRM-006 | Beziehungsstatus strikt von Einwilligung/Rechtsgrundlage trennen; Default `unknown`; `withdrawn` und `blocked` sperren spätere Außenaktionen. | Ein CRM-Status wird nicht als Rechtsgrundlage missverstanden. |
| PO-CRM-007 | Archivierung als operative Standardaktion beibehalten; physische Löschung erst nach Rechts-, Fristen- und Referenzkonzept. | Reversibilität ohne falsche Löschbehauptung. |
| PO-CRM-010 | Für die erste produktive Architektur einen internen AMAVIO-Arbeitsbereich vorsehen; keine Mandantenfähigkeit behaupten. | Reduziert Komplexität; externe Kunden-/Partnerzugänge bleiben eigenes Produktvorhaben. |
| PO-CRM-014 | ACC-Handoff nur nach doppelter fachlicher Freigabe durch Commercial/Product Owner und Operations; minimaler, versionierter Datensatz, keine Personendaten im Default. | „Gewonnen“ bedeutet nicht automatisch „operativ startbereit“. |

### Bündel C – Produktive Technik und Integrationen

**Empfehlung: die Sperren bestätigen. Keine Anbieter- oder Architekturentscheidung innerhalb dieser Runde.**

| ID | Empfohlener Rundenbeschluss | Voraussetzung für eine spätere Auswahl |
|---|---|---|
| PO-CRM-008 | Datenbank bleibt gesperrt. | fachlicher Vertrag, EU-/EWR-Betriebsoption, Transaktionen, Migrationen, Backup/Restore, Portabilität, Kosten und Security-Anforderungen |
| PO-CRM-009 | Authentifizierung/MFA bleibt gesperrt. | Rollenvertrag, Session-/MFA-/Recovery-Konzept, Admin- und Notfallprozess, Security Review |
| PO-CRM-011 | Datenimport bleibt gesperrt. | Dateninventar, Rechtsgrundlage, Feldmapping, Staging, Dublettenbericht, Dry Run, Rollback |
| PO-CRM-012 | E-Mail/Kalender bleibt gesperrt. | Zweck, Provider, Berechtigungen, Logging, Datenminimierung, Kosten, Datenschutzprüfung |
| PO-CRM-013 | Dokumentenspeicher bleibt gesperrt. | Klassifikation, Speicherort, Rechte, Aufbewahrung, Verschlüsselung, Backup und Löschung |
| PO-CRM-015 | App-Integration bleibt gesperrt. | separat genehmigter Vertrag; kein direkter CRM-Datenzugriff durch App-Rollen |
| PO-CRM-016 | Produktive KI bleibt gesperrt. | klarer Use Case, Datenklassen, Human Review, Messkriterien, Kosten-, Datenschutz- und Security-Prüfung |
| PO-CRM-017 | Hosting/Deployment bleibt gesperrt. | R3-Abnahme, R4-Architektur, Betriebsverantwortung, Monitoring, Backup, Incident- und Releaseprozess |

## 3. Vorgeschlagene phasenbezogene Mindestkriterien

Diese Kriterien konkretisieren PO-CRM-003, ohne produktive Datenannahmen zu erzeugen:

| Phase | Mindestkriterien für Eintritt | Offen zulässig |
|---|---|---|
| Erstkontakt | Organisation, Chancenbezeichnung, Owner, nächster Schritt mit Datum | Kontaktperson, Potenzial |
| Qualifiziert | dokumentierter Bedarf, zuständige Kontaktrolle oder begründete offene Kontaktfrage, nächste Handlung | Budgethöhe, Zeitplan |
| Scoping | Zielbild/Scope-Notiz, offene Punkte, Hauptkontakt oder dokumentierte Ausnahme | finaler Umfang, Preis |
| Angebot | Angebotskontext, Leistungsgrenze, Betrag oder begründeter offener Betrag, Gültigkeits-/Folgeschritt | formale Freigabe |
| Entscheidung | Entscheiderrolle, Entscheidungspfad, Entscheidungsdatum/-korridor, nächster Schritt | Ergebnis |
| Gewonnen | ausdrücklicher lokaler Gewinnmarker und dokumentierter Scope; ACC-Readiness separat | ACC-Freigabe, operative Startbereitschaft |
| Verloren | sachlicher Verlustgrund und Abschlussdatum | spätere Wiedervorlage |

## 4. Nicht zur Entscheidung in dieser Runde

- konkreter Datenbank-, Auth-, Hosting-, E-Mail-, Kalender- oder Dokumentenanbieter;
- Preise oder Vertragsabschluss mit einem Anbieter;
- Rechtsfreigabe, Datenschutzfreigabe oder Security-Freigabe;
- Verarbeitung realer Kontakte;
- App- oder ACC-Integration;
- Deployment, Veröffentlichung oder Git-Push.

## 5. Product-Owner-Beschluss vom 09.10.2026

Beschlusswortlaut:

> „Ich beschließe Bündel A und Bündel B gemäß Empfehlung. Bündel C bleibt vollständig gesperrt.“

Damit sind die Empfehlungen der Bündel A und B als fachlicher R3-Zielvertrag angenommen. Für Bündel C wurde kein Discovery- oder Umsetzungsauftrag erteilt. Dieser Beschluss ist keine technische, rechtliche, datenschutzrechtliche, sicherheitsbezogene oder produktive Freigabe.
