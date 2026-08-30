import type { ServiceRecord } from "@/content/types";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";

export type JsonLdNode = Record<string, unknown>;

export const organizationId = `${siteConfig.canonicalUrl}/#organization`;
export const websiteId = `${siteConfig.canonicalUrl}/#website`;

const country = { "@type": "Country", name: "United Kingdom", identifier: "GB" };

export const serviceAreaNodes = siteConfig.serviceAreas.map((area) => ({
  "@type": area.name === "York" ? "City" : "AdministrativeArea",
  name: area.name,
  identifier: area.postcodes,
  containedInPlace: country,
}));

export const organizationNode: JsonLdNode = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: siteConfig.brand,
  description: "Professional domestic, property and workplace cleaning based in York and serving the wider YO postcode area.",
  url: siteConfig.canonicalUrl,
  email: siteConfig.email,
  telephone: siteConfig.phoneInternational,
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.canonicalUrl}/icon.svg`,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: siteConfig.phoneInternational,
    email: siteConfig.email,
    availableLanguage: "English",
    areaServed: country,
  },
  areaServed: serviceAreaNodes,
  knowsAbout: services.map((service) => service.shortName),
};

export const websiteNode: JsonLdNode = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name: siteConfig.brand,
  url: `${siteConfig.canonicalUrl}/`,
  inLanguage: "en-GB",
  publisher: { "@id": organizationId },
};

export function webPageNode({ url, name, description, type = "WebPage" }: { url: string; name: string; description: string; type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" }): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en-GB",
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
  };
}

export function serviceNode(service: ServiceRecord): JsonLdNode {
  const url = `${siteConfig.canonicalUrl}/services/${service.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    serviceType: service.shortName,
    description: service.description,
    url,
    provider: { "@id": organizationId },
    areaServed: serviceAreaNodes,
  };
}

export function breadcrumbNode(items: { name: string; url: string }[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
