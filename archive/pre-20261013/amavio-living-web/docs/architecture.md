# Architektur

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Server Route Handler für strikte Anfragevalidierung und HTTPS-Webhook-Zustellung
- Lokale strukturierte Inhalte als CMS-vorbereitete Übergangslösung

## Struktur

- `src/app`: Seitenrouten, Metadata Routes und Anfrage-API
- `src/components`: wiederverwendbare UI- und Marketing-Komponenten
- `src/lib/content.ts`: strukturierte Inhalte, später durch CMS/DB ersetzbar
- `src/lib/site-url.ts`: zentrale, validierte Produktions-URL
- `public/images`: Platzhaltermedien

## Erweiterung

Der Webhook ist die aktuelle Integrationsgrenze. Das empfangende System kann
später durch CRM, Datenbank oder Workflow-Automation ersetzt werden. Auth,
Storage, rollenbasierte Portale, Audit Logs und Datei-Uploads sind nicht Teil
dieser Version.
