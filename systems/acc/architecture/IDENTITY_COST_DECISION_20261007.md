# Gate 02B – kostenbewusste Identity-Vorentscheidung

**Stand:** 07.10.2026  
**Status:** Anbieterrecherche und technische Empfehlung; kein Konto, kein Projekt, keine Aktivierung, keine Kosten  
**Entscheidung jetzt:** Für Gate 02A und den moderierten synthetischen Usability-Test wird kein Identity-Anbieter integriert.

## Founder-Entscheidung

1. Der nächste Test bleibt vollständig lokal und verwendet ausschließlich synthetische Demo-Sitzungen. Kosten: `0 EUR`.
2. Erst nach dem Usability-Test wird Gate 02B in einer getrennten Staging-Arbeitskopie geöffnet.
3. Für dieses spätere Staging ist **Supabase Free in einer ausdrücklich gewählten EU-Region** der bevorzugte Startkandidat.
4. Die Free-Stufe ist kein Produktionsentscheid: Verfügbarkeit, Backup, DPA/TOMs, SMTP, RLS, Rollenmodell, Export und Exit werden vor Produktivnutzung separat geprüft.
5. Keycloak bleibt die ausweichbare Open-Source-Option, falls Anbieterunabhängigkeit höher gewichtet wird als Betriebsaufwand.
6. Clerk wird nicht als erste Wahl empfohlen, weil die kostenfreie B2B-Stufe zwar Organisationen und Einladungen bietet, aber nur begrenzte Organisationsmitglieder und Basisrollen; das geplante AMAVIO-Rollenmodell würde voraussichtlich früher in bezahlte Funktionen führen.

## Aktueller offizieller Vergleich

| Option | Einstieg | Passung | Kosten-/Betriebsrisiko | Urteil |
|---|---:|---|---|---|
| lokale synthetische Session | 0 EUR | reicht für moderierten Usability-Test | kein echter Auth-Nachweis | **jetzt verwenden** |
| Supabase Free | 0 USD/Monat laut Preisseite; bis 50.000 MAU, zwei Free-Projekte | Auth plus Postgres-RLS; EU-Region wählbar | Free-Projekte können bei Inaktivität pausieren; keine Produktionsgarantie | **späterer Staging-Favorit** |
| Keycloak self-hosted | Software Open Source | OIDC, SAML, MFA, feingranulare Policies | Hosting, Updates, Backups, Monitoring und Incident-Betrieb liegen bei AMAVIO | technisch stark, derzeit operativ zu teuer |
| Clerk Hobby | 0 USD; 50.000 MRU, 100 Organisationen, 20 Mitglieder je Organisation | schnelle B2B-UI, Einladungen und Basis-RBAC | Custom Roles/MFA beziehungsweise erweiterte B2B-Funktionen führen in Pro/Add-on | nicht erste Wahl für AMAVIO |

## Warum Supabase als späterer Staging-Favorit

- Authentifizierung und Datenbankautorisierung lassen sich über JWT plus Row Level Security gemeinsam prüfen.
- Die AMAVIO-Tenantgrenze kann damit nicht nur im Servercode, sondern zusätzlich auf Zeilenebene getestet werden.
- Eine konkrete EU-Region wie Frankfurt kann gewählt werden; eine allgemeine Regionsbezeichnung allein ist ausdrücklich kein Compliance-Nachweis.
- Der Einstieg kann ohne Monatskosten erfolgen, solange die Free-Grenzen akzeptiert werden.
- Die Architektur bleibt durch standardisierte JWT-/Postgres-Muster und den dokumentierten Exportpfad weniger gebunden als bei einer stark proprietären B2B-Abstraktion.

## Quellen

- [Supabase Pricing](https://supabase.com/pricing) – Free: 0 USD, 50.000 MAU, zwei aktive Projekte; Pro ab 25 USD/Monat.
- [Supabase verfügbare Regionen](https://supabase.com/docs/guides/platform/regions) – konkrete EU-Regionen einschließlich Frankfurt; Regionswahl ist kein Compliance-Beweis.
- [Supabase Auth](https://supabase.com/docs/guides/auth) – JWT-basierte Authentifizierung und Integration mit Row Level Security.
- [Supabase Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod) – Free-Projekte können bei geringer Aktivität pausieren; RLS, SMTP, Backup und Verfügbarkeit bleiben eigene Aufgaben.
- [Keycloak](https://www.keycloak.org/) und [Keycloak Guides](https://www.keycloak.org/guides) – Open-Source-IAM, OIDC/SAML, MFA sowie eigener Produktions-, Datenbank-, TLS-, Backup- und Betriebsaufwand.
- [Clerk Pricing](https://clerk.com/pricing) – Hobby-Grenzen, MRU-Logik, B2B-Organisationsgrenzen und kostenpflichtige Erweiterungen.

## Gate zum Start von 02B

Vor irgendeiner Konto- oder Projektanlage braucht es eine neue ausdrückliche Founder-Freigabe für: Anbieter, EU-Region, Stagingzweck, erlaubte synthetische Testidentitäten, Rollenmatrix, Löschfrist, maximale Monatskosten und Exit-Test. Bis dahin bleibt diese Datei eine Empfehlung, keine Aktivierung.
