# QA – AMAVIO ACC Productization Gate 01

**Stand:** 07.10.2026  
**Arbeitskopie:** `20261007_AMAVIO_ACC_Productization_Gate_01_Working`  
**Status:** Abschlussprüfung grün

## Prüfgegenstand

- HTML/CSS/JavaScript und lokale Assets;
- Node.js-Backend und SQLite-Persistenz;
- synthetischer Mandantenkontext und Cross-Tenant-Negativtest;
- strukturierter Assistenzlauf;
- Human Gate;
- Outbox- und Buchungs-Sink;
- Audit Trail;
- Browserinteraktionen, Responsive-Darstellung und grundlegende Accessibility-Indikatoren.

## Geplante Befehle

```bash
npm test
npm run qa:static
PORT=4192 npm start
npm run qa:browser
```

## Ergebnisse

### Backend und Datenbank

- `node --test QA/backend.test.mjs`: **2/2 Tests bestanden**.
- synthetische Demo-Sitzung ohne Header: `401` wie erwartet;
- zweiter synthetischer Mandant kann `SYN-CASE-001` nicht verwenden: `404` wie erwartet;
- strukturierter Assistenzlauf persistent gespeichert;
- Outbox-Vorschau vor Human Gate: `409` wie erwartet;
- positive menschliche Prüfung persistent gespeichert;
- Nachricht- und Buchungsvorschau danach jeweils `sink_only` und `externalEffect: false`;
- Audit Trail enthält Assistenzlauf, Review und beide Vorschauen;
- nach Serverneustart bleiben Lauf, Review und Audit vorhanden;
- externer Provider-Modus ohne Freigabe: `503` wie erwartet.

### Statische Prüfung

- `npm run qa:static`: **bestanden**;
- HTML-Landmarks, Skip-Link und `lang="de"` vorhanden;
- zwei ACC-Perspektiven und vier Hauptbereiche wie erwartet;
- fünf Fallarbeitsmodi unverändert;
- keine aktive Fachkraft-, Wohnanbieter- oder Partnerrolle im ACC;
- keine eingebetteten API-Keys oder Secret-Muster;
- Backend-Syntax, Tenant-Grenze, Human Gate und `sink_only`-Grenze vorhanden;
- alle neuen lokalen Assets, Architektur- und QA-Dateien vorhanden;
- `Naechsten` kommt in den aktiven Quellen nicht vor.

### Browser, Responsive, Accessibility und Interaktion

- `npm run qa:browser`: **bestanden**;
- Chromium-Viewports: `1505×1045`, `1280×800`, `1024×900`, `768×900`, `390×844`, `360×800`;
- keine Console Errors, Page Errors, defekten Bilder, doppelten IDs, unbenannten Buttons oder ungelabelten sichtbaren Felder;
- kein horizontaler Seitenüberlauf;
- Reduced Motion geprüft;
- HTTP `200` und `404` geprüft;
- bestehende Plan-, Simulation-, Entwurfs-, Vollständigkeits-, Verlauf-, Such- und Rollenpfade bestanden;
- Produktpilot lädt Backend und Datenbank, erzeugt strukturierten Lauf, speichert Human Gate, schaltet erst danach den Outbox-Sink frei und schreibt Audit;
- mobile Navigation schließt beim Seitenwechsel;
- der Produktpilot öffnet nach einem Bereichswechsel wieder am Seitenanfang.

### Visuelle Prüfung

Referenzen unter `QA/gate-01-screens/` wurden für alle sechs Viewports erzeugt und visuell geprüft. Desktop und Mobile bewahren die ruhige AMAVIO-Sprache; Produktleistung wird als zusammenhängender Systemlauf statt als dominante KI-Kartenwand dargestellt. Im ersten Lauf blieb die alte Scrollposition beim Bereichswechsel erhalten und verdeckte mobil Teile des Titels. Der Seitenwechsel setzt nun kontrolliert auf den Seitenanfang zurück; der Abschlusslauf ist grün.

## Abschlussurteil

Gate 01 ist als **lokaler, ausschließlich synthetischer technischer Produktpilot** funktionsfähig und präsentationsfähig. Der Nachweis umfasst echte lokale Persistenz und serverseitige Zustandsübergänge, aber keine produktive Sicherheits- oder Außenwirkung.

## Grenzen

Die QA weist keine Produktionsreife, Datenschutzkonformität, Security, echte Authentifizierung, produktive Mandantentrennung, externe AI-Qualität, Rechtskonformität, Versand-, Buchungs-, Hosting- oder Betriebseignung nach.
