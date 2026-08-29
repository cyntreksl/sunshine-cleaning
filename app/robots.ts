import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/thank-you/"] }, sitemap: "https://sunshinecleaning.uk/sitemap.xml", host: "https://sunshinecleaning.uk" };
}
