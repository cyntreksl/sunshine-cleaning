import type { Metadata } from "next";
import { ContactBand, PageHero, ServiceCards } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = { title: "Cleaning Services in York", description: "Explore domestic, deep, end-of-tenancy, holiday-let, office and after-builders cleaning services across York city.", alternates: { canonical: "/services/" }, openGraph: { title: "Cleaning services in York", description: "Practical cleaning for York homes, properties and workplaces.", url: "/services/" } };

export default function ServicesPage() {
  return <main id="main-content"><PageHero eyebrow="Services for York" title="The right kind of clean for the space in front of you." intro="From regular home upkeep to a full property reset, every quote starts with a specific scope rather than a one-size-fits-all promise." /><section className="page-shell section-space"><ServiceCards /></section><section className="split-feature page-shell section-space"><div data-reveal><p className="eyebrow">Not sure where to start?</p><h2>Describe the outcome, not the service name.</h2></div><div data-reveal><p>Tell us what is happening: a busy week, a moving date, new guests, a workplace routine or the end of building work. We can help identify the closest service and the details needed for a quote.</p><p>No service listed here implies an unverified accreditation, guarantee or specialist hazardous-cleaning capability.</p></div></section><ContactBand title="Tell us what needs cleaning and when." /><JsonLd data={services.map((service) => ({ "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.summary, url: `${siteConfig.canonicalUrl}/services/${service.slug}/`, areaServed: { "@type": "City", name: "York" }, provider: { "@type": "Organization", name: siteConfig.brand, url: siteConfig.canonicalUrl } }))} /></main>;
}
