const LOCAL_SITE_URL = new URL("http://localhost:3000");

function configuredSiteUrl() {
  const value = process.env.SITE_URL?.trim();

  if (!value) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("SITE_URL must be a valid absolute URL.");
  }

  if (url.protocol !== "https:") {
    throw new Error("SITE_URL must use HTTPS.");
  }

  if (url.username || url.password || url.search || url.hash) {
    throw new Error("SITE_URL must not contain credentials, a query, or a fragment.");
  }

  if (url.pathname !== "/") {
    throw new Error("SITE_URL must be an origin without a path.");
  }

  if (url.hostname.endsWith(".example")) {
    throw new Error("SITE_URL must not use a reserved .example domain.");
  }

  return url;
}

export function getSiteUrl() {
  return configuredSiteUrl() ?? LOCAL_SITE_URL;
}

export function hasProductionSiteUrl() {
  return configuredSiteUrl() !== null;
}
