import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const value = process.env.SITE_URL?.trim();

if (!value) {
  console.warn(
    "[SITE_URL] Not set. This build will use http://localhost:3000 and block indexing. Set SITE_URL before every deployable environment build.",
  );
  process.exit(0);
}

let url;

try {
  url = new URL(value);
} catch {
  fail("must be a valid absolute URL");
}

if (url.protocol !== "https:") {
  fail("must use HTTPS");
}

if (url.username || url.password || url.search || url.hash) {
  fail("must not contain credentials, a query, or a fragment");
}

if (url.pathname !== "/") {
  fail("must be an origin without a path");
}

if (url.hostname.endsWith(".example")) {
  fail("must not use a reserved .example domain");
}

console.log(`[SITE_URL] Validated build origin: ${url.origin}`);

function fail(reason) {
  console.error(
    `[SITE_URL] Invalid value "${value}": ${reason}. Set the environment-specific canonical HTTPS origin before running npm run build.`,
  );
  process.exit(1);
}
