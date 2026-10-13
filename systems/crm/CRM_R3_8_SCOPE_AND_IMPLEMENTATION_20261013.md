# AMAVIO One CRM – R3.8 G1 Legal & Access Assurance

Stand: 13.10.2026  
Reifegrad: **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## Auftrag und Grenze

R3.8 schließt keine Rechts- oder Sicherheitsfreigabe durch Behauptung. Der Block macht die noch offenen G1-Gates G1-03 und G1-06 entscheidbar, prüfbar und negativ testbar. Reale Daten, produktive Authentifizierung, externe Importe, Versand, Connectoren, App-/ACC-Integration, Hosting und Deployment bleiben deaktiviert.

## Sicherung und Arbeitskopie

- Erhaltener Ausgangsstand: `20261013_AMAVIO_One_CRM_R3_7_G1_Entry_Gate_Closure_Working`
- Vollständige Sicherung vor R3.8: `20261013_AMAVIO_One_CRM_R3_7_Sicherung_Pre_G1_Legal_Access_Closure`
- Neue Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_8_G1_Legal_Access_Assurance_Working`
- Sicherung und Arbeitskopie wurden mit jeweils 6.449 Dateien und rund 178 MB kontrolliert angelegt.

## Erhalten

- CRM-Core, Growth-Core, Fachblock und lokale SQLite-Persistenz;
- AMAVIO-Markensprache, Informationsarchitektur und responsive Grundstruktur;
- synthetische Beispieldaten, Historien, Auditspur und bestehende Snapshots;
- unveränderte Produktgrenzen zwischen CRM, App und ACC;
- alle R3.7-Gates und die harte NO-GO-Entscheidung.

## Neu umgesetzt

- Schema v7 mit kontrollierter Migration aus R3.7/v6;
- kanonische Quellen-/Zweck-/Kanal-Matrix mit sieben Pfaden;
- vier versionierte Informationspflicht- und Betroffenenrechte-Bausteine;
- Zugriffsschutzregister mit neun Kontrollen auf Anwendungs-, Identitäts-, Autorisierungs-, Sitzungs-, Geräte- und Sicherungsebene;
- zwei zusätzliche synthetische Negativprüfungen für Rechts-/Informationspflicht-Vertrag und Zugriffsschutz;
- neue, getrennte UI-Bereiche „Recht & Quellen“ sowie „Zugriff & Gerät“;
- ausdrückliche Kennzeichnung, dass lokale Schutzgrenzen keine Authentifizierung und keine rechtliche Freigabe ersetzen.

## Nur vorbereitet

- externe Prüfung der Rechtsgrundlage je konkreter Quelle, Zweck und Kanal;
- freigegebene Art.-13-/Art.-14-Informationstexte und deren operativer Zustellnachweis;
- produktive Authentifizierung und technisch erzwungene Rollen;
- Geräteverschlüsselungs-, Backupverschlüsselungs- und dauerhafter Screen-Lock-Nachweis;
- enger, datierter G1-10-Product-Owner-Beschluss.

## Weiterhin gesperrt

`realDataEnabled=false`, `outboundEnabled=false`, Provider-Adapter deaktiviert, Versandlimits null. Geschützte Plattformen, Login-/CAPTCHA-/Paywall-Umgehung, produktive Datenanbieter, Massenversand und externe Automatisierung bleiben ausgeschlossen.

