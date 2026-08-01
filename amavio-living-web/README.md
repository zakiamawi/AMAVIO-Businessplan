# AMAVIO Living Web

Next.js 16 App-Router website for AMAVIO Living. Public content is sourced from
`src/lib/content.ts`; no real property inventory or unverified legal data is
created by the application.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without `SITE_URL`, metadata uses this local
origin and `robots.txt` blocks indexing.

## Environment

Copy `.env.example` to `.env.local`:

- `SITE_URL`: build-time canonical production origin. It must be a valid HTTPS
  origin and cannot use a reserved `.example` domain.
- `INQUIRY_WEBHOOK_URL`: server-only HTTPS endpoint receiving validated inquiry
  JSON. When absent or invalid, the API returns `503` and the UI does not report
  success.

`SITE_URL` is evaluated while Next.js statically builds metadata, `robots.txt`,
and `sitemap.xml`. It must be present and correct before **each
environment-specific `npm run build`**. Changing it in a running deployment
does not update those artifacts; rebuild and redeploy the application.

`npm run build` automatically runs:

```bash
npm run validate:site-url
```

The validator loads the same production `.env*` files through Next.js,
rejects malformed configured values with one actionable error, and warns when
the local no-index fallback is used.

Webhook delivery uses a 10-second timeout, rejects redirects, and treats
non-success responses as delivery failures. The receiver must decide retention,
access, deletion, and notification behavior.

## Structure

- `src/app`: pages, metadata routes, and `/api/inquiries`
- `src/components`: shared navigation, footer, and request UI
- `src/lib/content.ts`: current structured concept content
- `src/lib/site-url.ts`: validated canonical URL configuration
- `docs`: architecture, deployment, privacy, and security readiness notes

## Validation

```bash
npm run lint
npm run validate:site-url
npm run build
```

The legal pages intentionally remain marked incomplete until verified mandatory
company and processing details are supplied.
