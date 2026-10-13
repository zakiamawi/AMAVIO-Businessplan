# QA – R3.10 Local Operations Assurance

**Datum:** 13.10.2026  
**Prüfobjekt:** datierte R3.10-Arbeitskopie  
**Daten:** ausschließlich synthetisch

## Prüfumfang

- Build und statisches QA-Gate;
- Unit-, Vertrags-, Komponenten- und Integrationstests;
- lokaler SQLite-Persistenztest einschließlich isoliertem Restore-Round-Trip;
- End-to-End-Pfade und Browser-QA bei 1600, 1280, kritischen Zwischenbreiten, Mobile, Tastatur und 200-Prozent-Zoom;
- Browserkonsole sowie sichtbare Deaktivierung der Restore-Probe im Browser-Fallback;
- G1-Gate-Wirkung, Auditspur und unveränderte Real-Data-/Outbound-Sperren.

## Abnahmekriterien

Die Probe darf nur mit aktivem lokalen SQLite-Server ausführbar sein. Sie muss eine neue In-Memory-Datenbank verwenden, Schema v7 und `synthetic=true` prüfen, eine identische Prüfsumme melden und `liveStateMutated=false` zurückgeben. Der zuvor gespeicherte Testmarker muss nach der Probe unverändert vorhanden sein. Ein erfolgreicher Nachweis darf weder `releaseEligible`, `realDataEnabled` noch `outboundEnabled` aktivieren.

## Ergebnisgrenze

Der Abschlussbericht darf höchstens „Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben“ lauten. Geräteverschlüsselung, RPO/RTO, verantwortliche Personen, Rechtsprüfung, Authentifizierung und produktive Notfallfähigkeit bleiben offene Gates.

## Ausführungsprotokoll

| Prüfung | Ergebnis |
|---|---|
| Build | 1.603 Module transformiert, Build erfolgreich |
| statisches QA-Gate | bestanden |
| Unit-Tests | 32/32 bestanden |
| Vertragstests | 11/11 bestanden |
| Komponententests | 10/10 bestanden |
| Integrationstests | 6/6 bestanden |
| Logik gesamt | 59/59 bestanden |
| Persistenztest | 1/1 bestanden; Testmarker nach In-Memory-Restore unverändert |
| End-to-End | 20 zusammenhängende lokale Kernabläufe bestanden |
| Browsergrößen | 1600, 1280, 1024, 768, 430 und 390 Pixel ohne Seitenüberlauf |
| Accessibility-Interaktion | Skip-Link, `⌘ K`, Escape, Focus-Trap und Focus-Rückgabe bestanden |
| echter 200-%-Zoom | 1280 Pixel Außenbreite → 640 CSS-Pixel; kein horizontaler Überlauf |
| Browserkonsole | 0 Fehler |
| visuelle Evidenz | 62 lokale Screenshots einschließlich G1-07-Restore-Assurance und abschließendem Live-SQLite-Nachweis |

Der abschließende Lauf in der tatsächlichen R3.10-Arbeitskopie bestätigte zusätzlich: Schema v7, 71 synthetische Einträge, Prüfsummenpräfix `b6e65058a7b3`, `liveStateMutated=false`, weiterhin `outboundEnabled=false` und sichtbares G1-NO-GO.

Die erste Browser-QA-Ausführung wurde durch einen konkurrierenden, später beendeten lokalen Testserver unterbrochen. Nach sauberem Neustart lief die vollständige Matrix ohne Produktänderung grün durch. Das ist als QA-Infrastrukturereignis dokumentiert und kein Anwendungsfehler.

## Abschluss

**BESTANDEN innerhalb des freigegebenen R3.10-Scope.** Ein grüner lokaler Lauf ist kein Deployment- oder Produktionsnachweis. G1 bleibt NO-GO; reale Daten, Versand, externe Anbindungen, C1 und produktiver Wiederanlauf bleiben gesperrt.
