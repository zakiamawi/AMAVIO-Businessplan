# Content Model

## Entitäten

- `Company`: Marke, Rechtsträger, Standort, Claim
- `AudiencePath`: Zielgruppe, Nutzen, CTA
- `Service`: Name, Preislogik, Leistungsbeschreibung, Quellenhinweis
- `HousingConcept`: Slug, Titel, Standortlogik, Badge, Zielgruppe, Beschreibung, Merkmale
- `CampusFeature`: Community- und Raumfeatures
- `Inquiry`: Profil, Nachricht, Name, E-Mail, Einwilligung, Status

## CMS-Vorbereitung

Alle öffentlichen Inhalte liegen strukturiert in `src/lib/content.ts` und können später durch CMS- oder Datenbankabfragen ersetzt werden.
