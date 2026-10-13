# G1-10 – Entscheidungspaket R3.12

**Entscheidungsdatum:** 13.10.2026  
**Empfehlung:** NO-GO beibehalten  
**Geltung:** reale personenbezogene Daten, produktiver Import und produktive Kontaktaufnahme

## Lokal erreicht

- vollständiger synthetischer CRM-Core mit v7-Datenvertrag und SQLite-Persistenz;
- vier Product-Owner-Arbeitsbeschlüsse für Umfang, Lebenszyklus, Sicherungsziel und Incident-Ablauf;
- strukturierte Quellen-/Zweck-/Kanalmatrix und Informationspflicht-Bausteine;
- offizielle Primärquellen und konkrete Arbeitsentwürfe für externe G1-03-Prüfung;
- sechs lokal belegte Schutzgrenzen einschließlich Herkunftsschutz, Browserheader und eigentümergebundener Dateien;
- isolierte synthetische Restore-Probe und dokumentierte Betriebsziele;
- vollständige NO-GO-Flags für reale Daten, Provider und Outbound.

## Verbleibende harte Blocker

1. **G1-03 Recht/Datenschutz:** Verantwortliche Rechtseinheit, Rechtsgrundlage je Prozess/Kanal, finale Art.-13/14-Texte, VVT und externe Freigabe fehlen.
2. **G1-06 Security/Betriebsgerät:** macOS-Firewall wurde deaktiviert beobachtet; FileVault und Bildschirmsperre sind nicht verifiziert; Login, MFA, Autorisierung und Sitzungsschutz sind nicht implementiert.
3. **G1-07 Betrieb:** verschlüsselter Sicherungsort, Vertretung, tägliche Betriebsdurchführung und Zielumgebungs-Restore fehlen.
4. **G1-09 Incident:** Vertretung, Datenschutz-/Rechtskontakt, Erreichbarkeit und rechtlich bestätigte Meldewege fehlen.
5. **C1:** Provider-, Budget-, Vertrags-, Verantwortungs- und Abnahmeentscheidung fehlt; kein Projekt ist autorisiert.

## Entscheidung

G1-10 wird nicht freigegeben. `releaseEligible=false`, `realDataEnabled=false`, `outboundEnabled=false`, `productiveContactAllowed=false` und `productiveAccessAllowed=false` bleiben unverändert.

## Nächster zulässiger Schritt

1. Product Owner beantwortet die minimale C1-Entscheidungsliste.
2. Geräte-Firewall, Verschlüsselung und Sperrzeit werden bewusst außerhalb des Projektcodes konfiguriert und anschließend neu belegt.
3. Externe Datenschutz-/Rechtsprüfung schließt G1-03 mit datierten Versionen.
4. Vertretung und externe Incident-/Betriebsrollen werden benannt.
5. Erst danach wird ein enger C1-Beschluss vorbereitet. C1-Implementierung und G1-10-Echtfreigabe bleiben getrennte Entscheidungen.

## Reifegrad

Der zulässige Reifegrad bleibt: **„Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben“**. Es werden keine Aussagen zu Produktionsreife, Datenschutzfreigabe, Security-Zertifizierung, Mehrbenutzerfähigkeit, Backendbetrieb oder realen Daten getroffen.
