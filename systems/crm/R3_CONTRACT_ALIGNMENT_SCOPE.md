# AMAVIO One CRM – R3 Contract Alignment Scope

**Datum:** 09.10.2026  
**Reifegrad:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## Autorisierter Umfang

Dieses Paket setzt ausschließlich die technische Angleichung des lokalen synthetischen CRM-Cores an die beschlossenen Bündel A und B um. Es ist kein allgemeiner Funktionsausbau, kein HubSpot-Nachbau und keine produktive Architekturentscheidung.

Enthalten sind Pipeline v1.0 mit phasenbezogener Evidenz, ein getrenntes Lead-Objekt mit kontrollierter Konvertierung, Partnerorganisationen und Partnerkontakte als eigene Objektklassen, vollständige deutsche UI-Texte, ungegewichtete Kennzahlen, gesperrter Export, fünf deklarative Zielrollen, getrennte Kontakt-/Einwilligungsstatus, sichere Archivierung, ein interner Single-Workspace und zwei lokale ACC-Prüfmarker ohne Übertragung.

## Schutz und Arbeitskopien

- unveränderte Canonical-Core-Quelle: `20261009_AMAVIO_One_CRM_Canonical_Core_Working`;
- vollständige Sicherung vor R3: `20261009_AMAVIO_One_CRM_Canonical_Core_Sicherung_Pre_R3`;
- bearbeitete Arbeitskopie: `20261009_AMAVIO_One_CRM_R3_Contract_Alignment_Working`;
- neuer isolierter Speichervertrag: `amavio-one-crm-r3-contract-alignment-v3`;
- vorhandene v1- und v2-Speicherstände werden nicht migriert, gelesen oder überschrieben.

## Bündel-C-Sperre

Vollständig ausgeschlossen bleiben Datenbank, Authentifizierung/MFA, Import, E-Mail/Kalender, Dokumentenspeicher, App-Integration, produktive KI und Hosting/Deployment. Ebenfalls ausgeschlossen bleiben reale personenbezogene Daten, externe Übertragung, Veröffentlichung, Git-Push, Anbieterwahl und ACC-Integration.

## Produktgrenzen

CRM, AMAVIO One App und Arrival Control Center bleiben getrennte Produkte und Codebasen. Der R3-Handoff ist nur ein lokaler synthetischer Prüfstatus. Er erzeugt keinen ACC-Fall, keinen Payload, keine Nachricht und keine Betriebsfreigabe. Rollen sind Vertragsbegriffe, keine durchgesetzten Berechtigungen.

## Nicht behauptet

Diese Arbeitskopie ist weder produktionsbereit noch datenschutzrechtlich, rechtlich oder sicherheitstechnisch freigegeben. Sie ist nicht mehrbenutzerfähig, nicht mandantenfähig, nicht backendgestützt und nicht für reale Kontakte freigegeben.
