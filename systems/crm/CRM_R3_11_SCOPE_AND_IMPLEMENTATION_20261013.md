# AMAVIO One CRM – R3.11 Scope und Umsetzung

**Datum:** 13.10.2026  
**Block:** G1 Product-Owner Decision Alignment  
**Reifegrad:** **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## Auftrag und Grenze

R3.11 überführt die zuvor formulierten Empfehlungen für G1-01, G1-05, G1-07 und G1-09 in datierte lokale Product-Owner-Arbeitsbeschlüsse. Der Block verändert nicht den Produktivstatus. G1-03, G1-06 und G1-10 bleiben gesperrt; reale Daten, Import, Versand, externe Verbindungen, Authentifizierung, C1, App und ACC werden nicht aktiviert.

## Erhalten

- vollständiger R3.10-Funktionsumfang und synthetischer v7-Datenvertrag;
- lokale SQLite-Persistenz, Snapshots, Export/Restore und isolierte Wiederherstellungsprobe;
- alle Arbeitsflächen, Markenmittel, Beispieldaten und bestehenden QA-Pfade;
- getrennte Codebasen und Verträge für CRM, App und ACC;
- unveränderte harte Flags `realDataEnabled=false`, `outboundEnabled=false`, `releaseEligible=false`.

## Geändert

- vier Gates besitzen den neuen Status `po_decided_local` statt nur `decision_ready`;
- Beschlussreferenz `PO-CRM-043`, Datum, Beschlussinhalt und Restnachweise sind im kanonischen G1-Vertrag gespeichert;
- bestehende synthetische v7-Zustände werden ohne Schema- oder Storage-Key-Wechsel kontrolliert auf die Beschlusslage angeglichen;
- die Oberfläche trennt lokale Evidenz, PO-Beschluss und weiterhin blockierende externe/technische Nachweise;
- Auditspur und Testverträge sichern die Beschlussgrenze ab.

## Neu hinzugefügt

- sichtbares Vier-Karten-Beschlussregister für G1-01, G1-05, G1-07 und G1-09;
- maschinenlesbare Scope-, Lifecycle-, Backup- und Incident-Policy;
- explizite Restnachweise je Fachbeschluss;
- Regressionstests gegen eine versehentliche G1-10-, Echt­daten- oder Outbound-Aktivierung.

## Nur vorbereitet oder weiterhin gesperrt

- G1-03: fallbezogene Rechts-, Datenschutz-, Quellen-, Kanal- und Pflichttextprüfung;
- G1-06: Authentifizierung, Autorisierung, Sitzungsschutz und Geräte-/Umgebungsnachweis;
- G1-07: Verschlüsselung, Speicherort, Vertretung und Restore in einer später freigegebenen Zielumgebung;
- G1-09: Vertretung, Erreichbarkeit, rechtliche Meldewege und Fristen;
- G1-10: gesonderter datierter Gesamtbeschluss nach kumulativer Gate-Schließung;
- C1 und alle produktiven Folgefähigkeiten.

## Technische Verträge

- Schema bleibt Version 7.
- Storage-Key und SQLite-Dateiname bleiben bewusst unverändert, weil kein Domänenobjekt und kein Persistenzschema geändert wurde.
- Migration ergänzt nur Governance-Defaults und genau ein idempotentes Audit-Ereignis, wenn `PO-CRM-043` noch fehlt.
- `productiveContactAllowed`, `productiveAccessAllowed` und `productiveRecoveryApproved` bleiben `false`.

## Abschlusskriterium

R3.11 ist abgeschlossen, wenn Build, statisches Gate, Unit-, Vertrags-, Komponenten-, Integrations-, Persistenz-, E2E-, Responsive-, Tastatur-, 200-Prozent-Zoom- und Konsolenprüfung bestanden sind und der laufende lokale Zustand die vier Beschlüsse bei unverändertem NO-GO zeigt.
