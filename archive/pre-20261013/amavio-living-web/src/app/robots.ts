import type { MetadataRoute } from "next";
import { getSiteUrl, hasProductionSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  if (!hasProductionSiteUrl()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
