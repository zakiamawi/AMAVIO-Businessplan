# AMAVIO One CRM – R3.12 Scope & Implementation

**Datum:** 13.10.2026  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben  
**Freigabestatus:** G1 NO-GO; C1 nicht autorisiert

## Ziel

R3.12 führt die nach R3.11 verbleibenden G1-Fremdnachweise und technischen Eintrittshürden bis an die tatsächlich lokal erreichbare Grenze. Der Block aktiviert weder reale Daten noch Login, Cloud, Provider, Import, Versand, App, ACC oder Deployment.

## Erhalten

- Datenmodell v7 und alle lokalen CRM-Funktionen;
- AMAVIO-Informationsarchitektur, Layout und synthetische Beispieldaten;
- Product-Owner-Arbeitsbeschluss PO-CRM-043 für G1-01, G1-05, G1-07 und G1-09;
- strikte Trennung von CRM, App und ACC;
- NO-GO-Flags für Echtdaten, externe Verbindungen und Versand.

## Neu umgesetzt

1. Ändernde lokale API-Aufrufe werden bei abweichender Origin oder `Sec-Fetch-Site: cross-site` abgewiesen.
2. API und statische Oberfläche liefern eine restriktive Content Security Policy sowie Frame-, Referrer-, MIME-, Permissions- und Cross-Origin-Schutzheader.
3. Lokaler Datenordner und Exportordner werden auf Modus `0700`, SQLite-/WAL-/SHM- und Exportdateien auf `0600` gesetzt.
4. Der Persistenztest prüft Header, Cross-Site-Abweisung und Dateirechte.
5. G1-06 zeigt sechs lokal belegte Schutzgrenzen getrennt von nicht implementierter Identität, Autorisierung, Sitzungssteuerung und offener Geräteabsicherung.
6. Ein read-only erhobener Gerätebefund wird ohne Sicherheitsfreigabe dokumentiert.
7. G1-03 erhält ein offizielles Quellen- und Review-Dossier, Entwürfe für Art.-13/14-Informationen, eine LIA-/Kanalentscheidungsvorlage und einen VVT-Entwurf.
8. G1-07/09 erhalten eine zusammenhängende Betriebsevidenz und einen Incident-Eskalationsentwurf.
9. C1 erhält einen aktuellen Provider-/Kostenrahmen und eine minimale Beschlussliste, aber keine technische Aktivierung.
10. G1-10 erhält ein konsolidiertes Entscheidungspaket mit NO-GO-Empfehlung.

## Bewusst nicht umgesetzt

- keine Änderung an macOS-Firewall, FileVault, Bildschirmsperre oder anderen Systemeinstellungen;
- keine Authentifizierung, Benutzerkonten, MFA, Rollen- oder RLS-Aktivierung;
- kein Supabase-Projekt, kein Kauf, kein Login und keine Providerkonfiguration;
- keine Rechtsfreigabe, kein Datenschutzfreigabevermerk und keine Verarbeitung realer Kontakte;
- keine Benennung einer Vertretung ohne Product-Owner-Entscheidung;
- kein produktiver Restore, kein externes Backup und keine Verschlüsselungsbehauptung;
- kein Deployment, Git-Push oder externe Übertragung.

## Ergebnisgrenze

R3.12 verbessert die lokale Angriffsminderung und vervollständigt Entscheidungsunterlagen. Es ist kein Nachweis eines sicheren Produktivbetriebs. G1-03, G1-06 und G1-10 bleiben gesperrt. C1 beginnt erst nach einem engen, gesonderten Beschluss und nach Schließung seiner Provider-, Verantwortungs-, Budget- und Datenschutzgates.
