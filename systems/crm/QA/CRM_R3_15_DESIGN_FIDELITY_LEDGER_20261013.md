# QA – R3.15 Design-Fidelity-Ledger

**Datum:** 13.10.2026  
**Designgrundlage:** bestehendes AMAVIO One CRM Designsystem und die Konzeptbilder vom 08.10.2026

## Bewusst erhalten

- dunkles AMAVIO-Navy als Navigations- und Vertrauensanker;
- warmes Creme als Arbeitsfläche;
- Gold ausschließlich als fokussierter Akzent;
- redaktionelle Hierarchie statt gleichförmiger SaaS-Karten;
- bestehende Typografie, Abstände, Aktionsmuster und Dialogkomponente;
- klare DE-Texte ohne sichtbare Entwicklungs-, Prompt- oder Assistenzsprache.

## R3.15-spezifische Erweiterung

- breite redaktionelle Kopfzone für Datenumfang, Grenze und Reifegrad;
- analytische Segmentbalken und Statusfluss statt dekorativer Diagramme;
- eigene Schutzleiste für lokale Trennung, Kontaktsperre und Idempotenz;
- Tabellen mit ruhiger Informationsdichte, horizontalem Schutz bei kleinen Breiten und serverseitiger Pagination;
- sichtbare Statuschips für Aktualität, Namensprüfung, Quarantäne und Kontaktverbot;
- ein breiter, weiterhin semantisch korrekter Detaildialog mit Provenienz und Beziehungsansicht.

## Abgrenzung gegen Designbruch

Nicht eingeführt wurden ein neues Logo, neue Markenfarben, ein fremdes SaaS-Dashboardraster, HubSpot-Muster, generische KI-Widgets oder ungesicherte Erfolgskennzahlen. Diagramme zeigen ausschließlich nachweisbare lokale Verteilungen.

## Responsive Soll

| Breite | Erwartung |
|---:|---|
| 1600 px | vollständige Navigation, Zwei-Spalten-Analyse, breite Tabellen |
| 1280 px | verdichtete, aber nicht überlappende Kopf- und Analysebereiche |
| 1024 px | einspaltige Analyse bei erhaltener Navigation und Filterlogik |
| 768 px | mobile Navigation, gestapelte Filter, horizontal geschützte Tabelle |
| 430 px | lesbare Kennzahlen, Touchziele, Dialog und Tabs ohne Inhaltsverlust |
| 200 % Zoom | Reflow ohne verdeckte Primärfunktion; horizontales Scrollen nur innerhalb breiter Datentabellen |

## Prüfergebnis

**PASS für die lokale R3.15-Arbeitskopie.** Das Desktopkonzept `design/AMAVIO_ONE_CRM_DESKTOP_CONCEPT_20261008.png` wurde visuell gegen den finalen 1600-px-Staging-Screenshot geprüft. Hierarchie, Markenfarben, Typografiekontrast, Navigationslogik und redaktionelle Dichte bleiben erkennbar im selben System; der neue Bereich ist fachlich eigenständig und keine generische SaaS-Kartenwand.

Geprüfte Screenshots:

- `desktop-1600-altdaten-staging.png`
- `desktop-1280-altdaten-staging.png`
- `zwischenbreite-1024-altdaten-staging.png`
- `tablet-768-altdaten-staging.png`
- `mobile-430-altdaten-staging.png`
- `mobile-390-altdaten-staging.png`
- `zoom-200-prozent-altdaten-staging.png`

Die automatisierte Browserprüfung bestätigt keinen horizontalen Seiten-Overflow bei den sechs Zielbreiten. Tabs, 407er-Prüfstruktur und breite Datentabellen scrollen innerhalb ihrer jeweiligen Module. Der mobile feste Navigationsbereich besitzt ausreichenden unteren Inhaltsabstand. Diese Ledger-Datei ist Teil des lokalen QA-Gates und keine Markenfreigabe für eine externe Veröffentlichung.

