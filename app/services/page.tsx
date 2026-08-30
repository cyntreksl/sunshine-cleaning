import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, PageHero, ServiceCards } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";
import { serviceNode, webPageNode } from "@/lib/structured-data";

const description = "Explore domestic, deep, end-of-tenancy, holiday-let, office and after-builders cleaning services in York and across the wider YO postcode area.";

export const metadata: Metadata = {
  title: "Cleaning Services in York",
  description,
  alternates: { canonical: "/services/" },
  openGraph: { title: "Cleaning Services in York", description, url: "/services/" },
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Services for York and the wider YO area" title="Cleaning services for homes, properties and workplaces." intro="Sunshine Cleaning provides six practical cleaning services in York and accepts enquiries from across the wider YO postcode area. Choose the closest match, then tell us about the property, priorities, timing and postcode so we can prepare the right next step." />
      <section className="page-shell section-space"><ServiceCards /></section>
      <section className="split-feature page-shell section-space">
        <div data-reveal><p className="eyebrow">Not sure where to start?</p><h2>Describe the outcome, not the service name.</h2></div>
        <div data-reveal><p>Tell us what is happening: a busy week, a moving date, new guests, a workplace routine or the end of building work. We can help identify the closest service and the details needed for a quote.</p><p><Link className="arrow-link" href="/areas-we-cover/">Check the areas we cover <span aria-hidden="true">↗</span></Link></p><p><Link className="arrow-link" href="/contact/">Request a cleaning quote <span aria-hidden="true">↗</span></Link></p></div>
      </section>
      <ContactBand title="Tell us what needs cleaning and where." />
      <JsonLd data={[
        webPageNode({ url: `${siteConfig.canonicalUrl}/services/`, name: "Cleaning Services in York", description, type: "CollectionPage" }),
        ...services.map(serviceNode),
      ]} />
    </main>
  );
}
