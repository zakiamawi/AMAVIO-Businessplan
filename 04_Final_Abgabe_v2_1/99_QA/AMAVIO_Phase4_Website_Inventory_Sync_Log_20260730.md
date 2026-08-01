# AMAVIO Phase 4 – Website Inventory & Sync Log

Datum: 2026-07-30

## Ziel

Den Website-Stand aus Repo und Desktop abgleichen, ohne die Desktop-Vermüllung aus ECC/Agents/Kimi/Caches unkontrolliert in das finale Repo zu übernehmen.

## Projekt

`amavio-living-web/`

Framework:

- Next.js `16.2.12`
- React `19.2.4`
- TypeScript
- Tailwind CSS v4

## Quellenbefund

Der Desktop-Ordner enthielt deutlich mehr Dateien als das Repo, jedoch überwiegend durch Zusatzmaterial:

- ECC
- `.agents`
- Kimi-K3
- Build-/Dev-Artefakte
- `dev.log`

Diese Dateien wurden bewusst nicht übernommen.

## Durchgeführter Sync

Vor dem Sync wurde der bisherige Repo-Webstand gesichert:

`04_Final_Abgabe_v2_1/_backups/website_repo_before_desktop_sync_20260730/`

Übernommen wurden nur echte Web-Projektdateien aus Desktop:

- `src/`
- `docs/`
- `public/`
- Config-Dateien
- `package.json`
- `package-lock.json`
- `.env.example`
- `scripts/validate-site-url.mjs`
- `src/lib/site-url.ts`

Nicht übernommen:

- `ECC/`
- `.agents/`
- `Kimi-K3/`
- `dev.log`
- Build-/Cacheordner

Repo-only erhalten:

- `src/components/ai-orchestration-studio.tsx`

## Technische Prüfung nach Sync

Installation:

- `npm ci` erfolgreich
- Hinweis: `npm audit` meldet 12 high severity vulnerabilities

Build:

- `npm run build` erfolgreich
- 19 Seiten generiert
- API-Route `/api/inquiries` vorhanden
- `/sitemap.xml` und `/robots.txt` vorhanden

Lint:

- `npm run lint` erfolgreich

Wichtiger Deployment-Hinweis:

- `SITE_URL` ist lokal nicht gesetzt.
- Der Build nutzt dadurch `http://localhost:3000` und blockt Indexing.
- Für eine deploybare Umgebung muss `SITE_URL` auf eine echte HTTPS-Origin gesetzt werden.

## Designbefund

Die Website ist technisch und strukturell deutlich weiter als ein Starterprojekt:

- mehrere Zielgruppenrouten
- Anfrage-API
- Content-Modell
- Datenschutz/Impressum
- Standort-/Wohnseiten
- Higgsfield-Prompts für Bild- und Videoassets

Aber:

- aktuelle Farbwelt ist zu stark Petrol/Sage/Grün geprägt
- User-Vorgabe für Businessplan/Decks ist Navy/Gold/Creme und ausdrücklich kein Grün
- alle Medien in `public/images` sind aktuell SVG-Konzeptdarstellungen / Placeholder
- Website wirkt solide, aber noch nicht „cinematic / AI-generated but professional“

## Empfehlung für nächste Website-Umsetzung

Nicht sofort neu bauen und nicht blind Desktop übernehmen.

Nächster sinnvoller Schritt:

1. Website-Farbwelt auf AMAVIO Navy/Gold/Creme umstellen.
2. Hero-Section stärker cinematic machen.
3. Placeholder-SVGs durch echte/generierte Medienstrategie ersetzen.
4. Motion-System ergänzen: dezente Scroll-Reveals, Parallax, Video-Layer, Premium-Microinteractions.
5. Keine grünen/Sage-Tokens mehr.
6. Danach Browser-Preview + responsive QA.
7. Erst danach Hosting/Deployment mit gesetztem `SITE_URL`.

