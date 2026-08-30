import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, PageHero } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { ResponsiveImage } from "@/components/responsive-image";
import { siteConfig } from "@/content/site";
import { webPageNode } from "@/lib/structured-data";

const description = "Learn how Sunshine Cleaning provides clear, practical domestic and commercial cleaning services across York and the wider YO postcode area.";

export const metadata: Metadata = {
  title: "About Our York Cleaning Service",
  description,
  alternates: { canonical: "/about/" },
  openGraph: { title: "About Sunshine Cleaning in York", description, url: "/about/" },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="About Sunshine" title="A York cleaning service built around clear expectations." intro="Sunshine Cleaning provides domestic, property and workplace cleaning in York and accepts enquiries from across the wider YO postcode area. Every job starts with the property, priorities and practical details needed for a clear quote." />
      <section className="about-story page-shell section-space">
        <ResponsiveImage name="holiday-let" alt="Cleaner preparing a bed in a York townhouse" sizes="(max-width: 800px) 100vw, 46vw" />
        <div data-reveal>
          <p className="eyebrow">How we work</p>
          <h2>Warm service. Specific expectations.</h2>
          <p>Good cleaning starts before anyone arrives: with an honest description of the space, a practical scope and a shared understanding of priorities.</p>
          <ol>
            <li><span>01</span><div><h3>Listen first</h3><p>The property, occasion and preferred timing shape the plan.</p></div></li>
            <li><span>02</span><div><h3>Agree the scope</h3><p>We clarify the rooms, tasks and priorities before the work is confirmed.</p></div></li>
            <li><span>03</span><div><h3>Keep every claim truthful</h3><p>Reviews, insurance, prices and statistics appear only when evidence is available.</p></div></li>
          </ol>
        </div>
      </section>
      <section className="entity-links page-shell section-space" aria-labelledby="about-details-title">
        <div><p className="eyebrow">Business details</p><h2 id="about-details-title">Find the information you need.</h2></div>
        <div className="link-list">
          <p><Link href="/services/">Explore all cleaning services</Link> for homes, rental properties, holiday lets, offices and selected commercial spaces.</p>
          <p><Link href="/areas-we-cover/">Check York and wider YO coverage</Link>, then send your postcode so travel and availability can be confirmed.</p>
          <p><Link href="/guides/">Read practical cleaning guides</Link> about deep cleans, tenancy handovers, holiday lets and office schedules.</p>
          <p><Link href="/contact/">Request a cleaning quote</Link>, call <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or use WhatsApp.</p>
        </div>
      </section>
      <section className="values-band"><div className="page-shell"><p>York-based</p><p>Wider YO coverage</p><p>British English</p><p>Clear contact</p></div></section>
      <ContactBand />
      <JsonLd data={webPageNode({ url: `${siteConfig.canonicalUrl}/about/`, name: "About Sunshine Cleaning in York", description, type: "AboutPage" })} />
    </main>
  );
}
