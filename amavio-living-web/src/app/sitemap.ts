import type { MetadataRoute } from "next";
import { housingConcepts } from "@/lib/content";

const baseUrl = "https://amavio-living.example";

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...housingConcepts.map((concept) => ({
      url: `${baseUrl}/wohnen/${concept.slug}`,
      lastModified: new Date(),
    })),
  ];
}
