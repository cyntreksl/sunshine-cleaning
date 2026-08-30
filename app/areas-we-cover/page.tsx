import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, PageHero } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { services } from "@/content/services";
import { webPageNode } from "@/lib/structured-data";

const description = "Cleaning services based in York and available across the wider YO postcode area, including Selby, Thirsk, Scarborough, Bridlington and Whitby.";

export const metadata: Metadata = {
  title: "Cleaning Across York and the YO Postcode Area",
  description,
  alternates: { canonical: "/areas-we-cover/" },
  openGraph: { title: "York and YO Cleaning Service Coverage", description, url: "/areas-we-cover/" },
};

export default function AreasPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="York and wider YO coverage" title="Cleaning services across York and the wider YO postcode area." intro="York is Sunshine Cleaning’s primary location. We also accept enquiries from the wider YO postal area across North Yorkshire and parts of the East Riding of Yorkshire. Send your postcode before booking so we can confirm travel and availability." />
      <section className="coverage-feature page-shell section-space">
        <div className="coverage-art" aria-hidden="true"><span>YO</span><svg viewBox="0 0 500 380"><path d="M51 101c39-74 113-42 171-70 74-36 133 25 190 71 62 50 21 112 42 167 20 53-58 87-125 77-67-10-96 25-157 5-53-18-70-74-118-106-48-32-33-93-3-144Z"/><path d="M84 201c88-21 193-2 325-48M225 45c-16 92 24 186 11 290"/></svg></div>
        <div data-reveal>
          <p className="eyebrow">What the coverage means</p>
          <h2>York first, with a much wider postal area.</h2>
          <p>The YO postcode area extends well beyond York city. It includes post towns such as Scarborough, Bridlington, Whitby and Driffield, so we describe those places accurately rather than presenting every location as York.</p>
          <p>Coverage is always subject to the service requested, travel, timing and current availability.</p>
          <Link className="button" href="/contact/">Check your postcode</Link>
        </div>
      </section>
      <section className="coverage-list page-shell section-space" aria-labelledby="postcode-title">
        <div className="section-heading"><p className="eyebrow">Postcode districts</p><h2 id="postcode-title">The geographic YO areas we serve.</h2><p>These 29 postcode districts are grouped by their principal post town or local area.</p></div>
        <div className="postcode-grid">
          {siteConfig.serviceAreas.map((area) => <section key={area.name}><h3>{area.name}</h3><p>{area.postcodes.join(", ")}</p></section>)}
        </div>
      </section>
      <section className="entity-links page-shell section-space" aria-labelledby="coverage-services-title">
        <div><p className="eyebrow">Available services</p><h2 id="coverage-services-title">Choose the cleaning service that fits.</h2></div>
        <div className="link-list">
          {services.map((service) => <p key={service.slug}><Link href={`/services/${service.slug}/`}>{service.name}</Link> — {service.summary}</p>)}
        </div>
      </section>
      <ContactBand title="Send your YO postcode and cleaning brief." />
      <JsonLd data={webPageNode({ url: `${siteConfig.canonicalUrl}/areas-we-cover/`, name: "Cleaning Across York and the YO Postcode Area", description, type: "CollectionPage" })} />
    </main>
  );
}
