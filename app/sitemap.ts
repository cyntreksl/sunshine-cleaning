import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { guides } from "@/content/guides";
import { siteConfig } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1, updated: "2026-08-31" },
    { path: "/services", priority: 0.9, updated: "2026-08-31" },
    { path: "/areas-we-cover", priority: 0.8, updated: "2026-08-31" },
    { path: "/about", priority: 0.7, updated: "2026-08-31" },
    { path: "/guides", priority: 0.7, updated: "2026-08-31" },
    { path: "/contact", priority: 0.8, updated: "2026-08-31" },
    { path: "/privacy", priority: 0.4, updated: "2026-08-30" },
    { path: "/cookies", priority: 0.4, updated: "2026-08-30" },
  ];
  return [
    ...staticRoutes.map((route) => ({ url: `${siteConfig.canonicalUrl}${route.path}/`.replace(`${siteConfig.canonicalUrl}//`, `${siteConfig.canonicalUrl}/`), lastModified: route.updated, changeFrequency: route.path === "" ? "weekly" as const : "monthly" as const, priority: route.priority })),
    ...services.map((service) => ({ url: `${siteConfig.canonicalUrl}/services/${service.slug}/`, lastModified: service.updated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...guides.map((guide) => ({ url: `${siteConfig.canonicalUrl}/guides/${guide.slug}/`, lastModified: guide.updated, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
