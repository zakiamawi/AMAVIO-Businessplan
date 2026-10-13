# AMAVIO One CRM – Growth- und Outreach-Domänenvertrag

**Stand:** 10.10.2026  
**Geltung:** lokaler synthetischer R3.3-Core

## Zielsegment

Pflichtfelder: kanonische ID `segment-*`, Name, Passungskriterien, Owner, Status, Herkunfts- und Zeitmetadaten. Optional: Branche, Region, Ausschlusskriterien. Status: `active`, später `paused` oder archiviert. Änderungen erzeugen Audit-Ereignisse.

## Rechercheeintrag

Pflichtfelder: ID `research-*`, Organisationshinweis, Quellen-URL, Quellenart, Recherchezeitpunkt, Bearbeiter/Owner, Status, synthetischer Qualitätsstatus. Optional: Webseite, Zielsegment, Fit-Score, Passungsnotiz, Ansprechpartnerhinweis, Hinweis auf Personenbezug und dokumentierte Quellenbedingungen.

Statusübergänge:

```text
captured → reviewing → qualified → converted
                    └→ rejected
```

Eine Lead-Übernahme ist nur aus `reviewing` oder `qualified` möglich und verlangt Quelle sowie Recherchezeitpunkt. Die Übernahme erzeugt einen neuen Lead; der Rechercheeintrag bleibt als Herkunftsnachweis erhalten.

## Outreach-Entwurf

Pflichtfelder: ID `outreach-*`, Kontakt, Organisation, Zweck, Kanal, Betreff, Inhalt, Owner, Prüfnachweis und Status. Der Anbieteradapter bleibt in R3.3 deaktiviert.

Statusübergänge:

```text
draft → review_required → approved_local
                    └→ blocked
                    └→ cancelled
```

`approved_local` bedeutet nur, dass Inhalt und lokale Voraussetzungen dokumentiert wurden. Es bedeutet niemals „versendet“. R3.3 besitzt keinen externen Sendestatus.

Lokale Freigabekriterien:

- Kontakt ist aktiv und nicht archiviert;
- kein `do_not_contact`;
- kein Status `withdrawn` oder `blocked`;
- Kontakt-/Rechtsstatus ist `documented` oder `not_required_review`;
- Versand- und Kanalprüfung ist dokumentiert;
- `outboundEnabled` bleibt dennoch `false`.

## Kontaktsperre

Pflichtfelder: ID `suppress-*`, Kontakt, Grund, wirksam ab, Quelle und Owner. Eine Sperre setzt den Kontakt auf `do_not_contact`, markiert `outreachEligibility` als `blocked` und blockiert alle verbundenen offenen Outreach-Entwürfe. Die Sperre darf nicht durch eine Sequenz oder einen Providerimport aufgehoben werden.

## Anbieteradapter und Kostenbremse

R3.3 enthält lediglich einen deaktivierten Brevo-Adapter als Fachvertrag. Zugangsdaten, API-Aufrufe und Synchronisierung existieren nicht. Kostenlimits sind lokale Planungswerte und dürfen einen Versand niemals selbst aktivieren.

## Recherchegrenze

Zulässig vorbereitet sind öffentliche Unternehmenswebseiten, lizenzierte Datenquellen, freigegebene APIs und manuelle Importe mit Quellenbeleg. Nicht vorgesehen sind Schutzumgehung, Zugangsmissbrauch, CAPTCHA-Bypass, Paywall-Umgehung, private Kontaktdatensammlung oder ein automatischer Übergang von Recherche zu Versand.
