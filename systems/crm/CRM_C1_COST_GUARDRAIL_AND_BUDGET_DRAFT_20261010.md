# AMAVIO One CRM – C1 Kostenleitplanke und Budgetvorlage

**Stand und Preisabruf:** 10.10.2026  
**Status:** durch PO-CRM-045 fortgeschriebene Planungsleitplanke; weiterhin keine Beauftragung oder Kaufberechtigung  
**Währung der Providerpreise:** USD, vorbehaltlich Steuern, Wechselkurs und späterer Preisänderungen

## Empfohlene C1-Konfiguration

| Position | Aktuelle öffentliche Preisbasis | C1-Entscheidung |
|---|---:|---|
| Supabase Pro | ab 25 USD/Monat; erstes Micro-Projekt durch monatlichen Compute-Credit abgedeckt | Planungsbasis |
| zusätzliches Projekt | ab etwa 10 USD/Monat | verboten; genau ein C1-Projekt |
| PITR 7 Tage | ab etwa 100 USD/Monat; mindestens Small Compute | nicht freigegeben |
| Log Drain | 60 USD/Monat je Drain | nicht freigegeben |
| Custom Domain | 10 USD/Monat | nicht benötigt/nicht freigegeben |
| Team | ab 599 USD/Monat | nicht verhältnismäßig für C1 |
| Enterprise | individuell | nicht Teil von C1 |
| AMAVIO API-/Web-Hosting | nicht ausgewählt | 0 in C1, da API/Web lokal bleiben |

Der Pro-Tarif enthält nach aktueller Preisdokumentation tägliche Backups mit sieben Tagen Aufbewahrung und sieben Tage Logaufbewahrung. Er enthält keine Uptime-SLA; die Provider-SLA gilt für Enterprise, Support-SLAs für Team/Enterprise. Das ist für ein nichtöffentliches synthetisches C1-Staging akzeptabel, nicht für Produktion.

## Beschlossener Planungskorridor

PO-CRM-045 ersetzt den früheren 40-EUR-Vorschlag:

- Arbeitskorridor **50–100 EUR brutto pro Kalendermonat**;
- harte Planungsobergrenze **100 EUR brutto pro Kalendermonat**;
- genau eine bezahlte Organisation und ein Projekt;
- Spend Cap aktiviert;
- Micro Compute, keine Erhöhung ohne neuen Beschluss;
- keine Add-ons, keine weiteren Projekte und keine kostenpflichtigen Integrationen;
- monatliche Rechnungskontrolle durch Product Owner und Technical Operator;
- automatischer Stop der C1-Arbeit bei prognostizierter Überschreitung statt stiller Mehrkosten.

Der Korridor ist eine Planungsleitplanke und kein Providerangebot. Er erlaubt weder Kauf noch Nutzung. Eine kostenwirksame Aktion benötigt zusätzlich aktuelle Preis-, Steuer- und Währungsprüfung, Zahlungsowner sowie unmittelbare Product-Owner-Freigabe.

## Kostenrisiken

- Compute wird stundenweise berechnet; zusätzliche oder größere Instanzen erhöhen Kosten.
- Der Spend Cap deckt laut Compute-Dokumentation nicht jede Compute-Nutzung ab; er ersetzt keine Rechnungskontrolle.
- Egress, Datenbankgröße und weitere nutzungsabhängige Positionen können bei Überschreitung von Inklusivgrenzen anfallen.
- Tarif- und Preisänderungen sind zeitlich volatil und vor Kauf erneut zu prüfen.
- Ein später öffentlich gehosteter AMAVIO-API-Dienst ist in diesem Budget nicht enthalten.
- SLA, erweiterte Auditnachweise, längere Logs oder Support können einen deutlich höheren Tarif erfordern.

## Beschaffungs- und Änderungsregel

Vor kostenwirksamer Aktion müssen in einem einzigen Protokoll stehen:

1. aktueller Preis-/Tarifabruf;
2. Steuer-/Währungsannahme;
3. Product-Owner-Freigabe mit Monatslimit;
4. benannte zahlungsverantwortliche Person;
5. Projektzahl, Compute-Größe und aktivierte Add-ons;
6. Kündigungs-/Exitdatum oder Reviewtermin;
7. Screenshot/Export der Konfiguration ohne Kontodaten oder Geheimnisse.

Jede Tarif-, Compute-, Add-on- oder Projektänderung ist ein neuer Kostenbeschluss. Agenten und Automationen dürfen keine kostenwirksame Änderung auslösen.

## Product-Owner-Feld

| Entscheidung | Wert |
|---|---|
| Planungskorridor 50–100 EUR brutto/Monat | **durch PO-CRM-045 bestätigt** |
| harte Planungsobergrenze 100 EUR brutto/Monat | **durch PO-CRM-045 bestätigt** |
| Supabase Pro als C1-Tarif | **noch nicht bestätigt** |
| genau ein Micro-Projekt | **noch nicht bestätigt** |
| PITR/Log Drain/Domain/Team/Enterprise gesperrt | **noch nicht bestätigt** |
| zahlungsverantwortliche Person | **nicht benannt** |

## Offizielle Quellen

- [Supabase Pricing](https://supabase.com/pricing)
- [Supabase Compute Usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)
- [Supabase Billing FAQ](https://supabase.com/docs/guides/platform/billing-faq)
- [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups)
- [Supabase Support Policy](https://supabase.com/support-policy)
- [Supabase SLA](https://supabase.com/sla)

