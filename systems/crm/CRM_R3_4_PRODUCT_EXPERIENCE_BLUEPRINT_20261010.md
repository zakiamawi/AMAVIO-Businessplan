# AMAVIO One CRM – R3.4 Product Experience Blueprint

**Stand:** 10.10.2026  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben.  
**Arbeitskopie:** `20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working`

## Produktziel

R3.4 übersetzt den vorhandenen CRM-Core in einen AMAVIO-eigenen Founder-Arbeitsplatz. Die Oberfläche soll nicht möglichst viele Kennzahlen zeigen, sondern innerhalb weniger Sekunden vier Fragen beantworten: Was ist heute wichtig? Wo fehlt Bewegung? Welche Entscheidung ist offen? Was ist die nächste belegbare Handlung?

## Kernkomposition

- **Mein Arbeitstag:** Standard-Einstieg mit drei aus dem lokalen Zustand abgeleiteten Prioritäten.
- **Founder Focus:** Rang, Handlung, Organisation, Begründung und direkter Detailpfad; maximal drei Einträge.
- **Decision Brief:** strikte Trennung von bestätigt, Annahme, offene Frage und Empfehlung.
- **Pipeline Movement:** aktueller Bestand je Phase und ausschließlich dokumentierte Phasenereignisse.
- **Aging Strip:** Inaktivität seit letzter tatsächlicher Aktivität, nicht seit einem geschätzten Datum.
- **Relationship Field:** Organisation, Schlüsselkontakt, Fachbereich, Entscheiderstatus und Partnerbezug.
- **Datenvertrauen:** Quelle, Aktualität, Vollständigkeit und lokaler Dublettenhinweis.
- **Systemgrenze:** SQLite, synthetische Daten, deaktivierter Versand und keine externe KI bleiben sichtbar.

## Founder-Arbeitsrhythmus

Der gewünschte Rhythmus lautet: Fokus erkennen → Evidenz prüfen → Detail öffnen → lokale Handlung dokumentieren → Entscheidung nachvollziehen. Jede Priorität und jedes Visual besitzt deshalb einen realen Navigations- oder Detailpfad. Es gibt keine tote Kennzahl und keine automatische Außenaktion.

## Erhaltene Grundlagen

CRUD, Beziehungen, Phasenvertrag, Aktivitäts- und Statushistorie, Arbeitsjournal, Research, Outreach-Entwürfe, Suppression, Sicherung, Restore, Suche, Archivierung, Undo und synthetische Schutzgrenzen bleiben erhalten. Der vorherige Dashboard-Code wird nicht gelöscht; R3.4 ersetzt nur den Standard-Einstieg durch die neue Entscheidungsoberfläche.

## Bewusste Grenzen

R3.4 aktiviert weder reale Daten noch produktive KI, Versand, Scraping, Connectoren, Authentifizierung, Mehrbenutzerbetrieb, Mandantenfähigkeit, Cloud, Deployment oder App-/ACC-Integration. Empfehlungen sind lokale regelbasierte Entwürfe und benötigen menschliche Prüfung.
