import type { MetadataRoute } from "next";
import { housingConcepts } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const routes = [
    "",
    "/wohnen",
    "/arbeitgeber",
    "/bewohner",
    "/immobilienpartner",
    "/so-funktioniert-es",
    "/standorte",
    "/kontakt",
    "/impressum",
    "/datenschutz",
  ];

  return [
    ...routes.map((route) => ({
      url: new URL(route || "/", baseUrl).toString(),
      changeFrequency: "monthly" as const,
    })),
    ...housingConcepts.map((concept) => ({
      url: new URL(`/wohnen/${concept.slug}`, baseUrl).toString(),
      changeFrequency: "monthly" as const,
    })),
  ];
}
