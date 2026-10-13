# AMAVIO One CRM – R3.3 Owner Growth QA

**Datum:** 10.10.2026  
**Prüfobjekt:** `20261010_AMAVIO_One_CRM_R3_3_Owner_Growth_Working`  
**Zulässiger Reifegrad:** **Lokales AMAVIO Owner-CRM mit synthetisch geprüftem Growth- und Outreach-Core – noch ohne produktiven Versand und ohne externe Datenanbindung.**

## Ausgang und Schutz

- Quelle: `20261010_AMAVIO_One_CRM_C1_Entry_Gates_Working`;
- vollständige Sicherung: `20261010_AMAVIO_One_CRM_C1_Entry_Gates_Sicherung_Pre_R3_3`;
- separate Arbeitskopie: `20261010_AMAVIO_One_CRM_R3_3_Owner_Growth_Working`;
- Quelle, Sicherung und Arbeitskopie hatten vor Bearbeitung jeweils rund 127 MB und 6.161 Dateien;
- macOS meldete beim Kopieren ausschließlich `chflags`-Warnungen für `node_modules/.bin`-Symlinks; außerhalb `node_modules` war der SHA-256-Vergleich ohne Differenz.

## Geprüfte Implementierung

- R3.3/v5-Datenvertrag und v4→v5-Migration;
- lokale Node-/SQLite-API auf `127.0.0.1`;
- Browser-Fallback bei nicht laufender API;
- SQLite-Speichern, Snapshots, JSON-Ausgabe, Reset und Restore;
- synthetische Importvorschau und Abweisung nicht-synthetischer Zustände;
- Zielsegmente, Recherche, Quellen- und Fit-Metadaten;
- lokale Recherche-Dublettenhinweise über identische Quellen-URL oder Organisationsbezeichnung;
- Recherche→Lead-Konvertierung;
- Outreach-Entwurf, lokale Freigabevoraussetzungen und gesperrter Versand;
- Suppression und Blockierung verbundener Entwürfe;
- Kosten- und Kontingentgrenzen;
- globale Suche über neue R3.3-Objekte;
- responsive Growth-Oberfläche im AMAVIO-Stil.

## Automatisierte Ergebnisse

| Prüfung | Ergebnis |
|---|---|
| `npm run build` | bestanden; Vite-Produktionsbuild erzeugt |
| `npm run qa` | bestanden; R3.3-Grenzen, Dokumente, lokale API und fehlende externe Browserpfade statisch geprüft |
| Unit | 10/10 bestanden |
| Vertrag | 9/9 bestanden |
| Komponenten | 4/4 bestanden |
| Integration | 3/3 bestanden |
| Persistenz | 1/1 bestanden |
| E2E | 18 zusammenhängende lokale Kernabläufe bestanden |
| Browserkonsole | keine Fehler im E2E- und Browser-QA-Lauf |

## Browser- und visuelle QA

- 1600 × 1000: Growth-Fläche zentriert, Headline, Reifegrad, Kennzahlen und Rechercheledger klar ausgerichtet;
- 1280 × 900: bestanden, kein horizontaler Seitenüberlauf;
- 1024 × 900: Headline kontrolliert zweizeilig; Kennzahlen und Aktionen bleiben lesbar;
- 430 × 932: responsive Zwei-Spalten-Kennzahlen, scrollbare Tabs und einspaltige Aktionen; kein Seitenüberlauf;
- echter 200-%-Chrome-Zoom bei 1280 px Außenbreite reflowt auf 640 CSS-Pixel ohne Seitenüberlauf;
- Tastaturkürzel, Escape, Focus-Trap und Focus-Rückgabe bestanden;
- lokale Screenshots: `QA/Screenshots/20261010-r3-3/`;
- Messwerte: `QA/CRM_R3_3_BROWSER_RESULT_20261010.json`.

## Negative Nachweise

- kein Brevo-, Gmail-, Apollo-, Airtable-, Supabase- oder sonstiger Connector aktiviert;
- keine Zugangsdaten oder Secrets gelesen oder geschrieben;
- kein produktiver Versandstatus;
- kein automatischer Massenversand;
- kein Live-Scraping;
- keine Schutzumgehung;
- keine reale Person oder reale E-Mail-Adresse im Testbestand;
- keine Authentifizierung, kein Mehrbenutzer- oder Mandantenbetrieb;
- keine App-/ACC-Übertragung;
- kein Deployment, Git-Push oder externe Veröffentlichung.

## Neue kurzfristige Prioritäten

Der Product Owner hat Versand, Automation, erlaubtes Live Research, Connectoren, Mehrbenutzerbetrieb, Mandantenfähigkeit sowie App-/ACC-Verträge als kurzfristig wichtig eingeordnet. Sie sind in `CRM_NEAR_TERM_CAPABILITY_ROADMAP_20261010.md` als getrennte Folgeblöcke dokumentiert. Die Umgehung von Login, CAPTCHA, Paywall oder Zugriffsschutz bleibt ausgeschlossen; Ersatz sind offizielle APIs, lizenzierte Exporte oder ausdrückliche Anbieterfreigaben.

## Offene Gates

- reale Daten und Operational-Activation;
- Rechts-/Privacy-Prüfung für Datenquellen und Versandkanäle;
- aktuelle DPA-/AV-, Anbieter- und Kostenentscheidung;
- Domain-/Deliverability-Prüfung vor E-Mail-Go-live;
- Auth/MFA und zentrale Autorisierung vor Mehrbenutzerbetrieb;
- Datenisolation vor Mandantenfähigkeit;
- versionierte Integrationsverträge vor ACC/App-Anbindung.

## QA-Urteil

R3.3 ist als lokaler synthetischer Owner-Growth-Core technisch konsistent und browserbasiert geprüft. Der Stand ist eine tragfähige Grundlage für die priorisierten Folgeblöcke, aber keine Freigabe für reale Daten, produktiven Versand oder externe Systeme.
