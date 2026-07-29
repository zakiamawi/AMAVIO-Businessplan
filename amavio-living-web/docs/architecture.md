# Architektur

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Server Route Handler für Anfragevalidierung
- Lokale strukturierte Inhalte als CMS-vorbereitete Übergangslösung

## Struktur

- `src/app`: Routen, SEO-Dateien und API
- `src/components`: wiederverwendbare UI- und Marketing-Komponenten
- `src/lib/content.ts`: strukturierte Inhalte, später durch CMS/DB ersetzbar
- `public/images`: Platzhaltermedien

## Erweiterung

Nächste Backend-Stufe: Supabase/PostgreSQL, Auth, Storage, rollenbasierte Portale, Audit Logs, E-Mail-Versand und CRM-Anbindung.
