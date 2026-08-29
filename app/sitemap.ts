import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { guides } from "@/content/guides";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sunshinecleaning.uk";
  const staticRoutes = ["", "/services", "/areas-we-cover", "/about", "/guides", "/contact", "/privacy", "/cookies"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}/`.replace(`${base}//`, `${base}/`), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : route === "/services" ? 0.9 : 0.6 })),
    ...services.map((service) => ({ url: `${base}/services/${service.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}/`, lastModified: guide.updated, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
