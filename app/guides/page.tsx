import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, PageHero } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/content/guides";
import { siteConfig } from "@/content/site";
import { webPageNode } from "@/lib/structured-data";

const description = "Practical cleaning guides for York homes, rental properties, holiday lets and workplaces, written by Sunshine Cleaning for useful planning.";

export const metadata: Metadata = { title: "Cleaning Guides for York Homes and Businesses", description, alternates: { canonical: "/guides/" }, openGraph: { title: "Cleaning Guides from Sunshine Cleaning", description, url: "/guides/" } };

export default function GuidesPage() {
  return <main id="main-content"><PageHero eyebrow="Sunshine guides" title="Useful cleaning advice for York properties." intro="Straightforward checklists and planning guides to help you scope a clean, prepare a property and ask better questions before requesting a quote." /><section className="guide-index page-shell section-space">{guides.map((guide, index) => <article key={guide.slug} data-reveal><div><span>0{index + 1}</span><p>{guide.readTime}</p></div><div><h2><Link href={`/guides/${guide.slug}/`}>{guide.title}</Link></h2><p>{guide.summary}</p><Link className="arrow-link" href={`/guides/${guide.slug}/`}>Read the guide <span aria-hidden="true">↗</span></Link></div></article>)}</section><section className="entity-links page-shell section-space"><div><p className="eyebrow">Next steps</p><h2>Move from research to a clear request.</h2></div><div className="link-list"><p><Link href="/services/">Compare Sunshine Cleaning services</Link> and find the closest fit for your property.</p><p><Link href="/areas-we-cover/">Check York and wider YO coverage</Link> before choosing a date.</p><p><Link href="/contact/">Request a quote</Link> with your priorities, property details and postcode.</p></div></section><ContactBand title="Need help turning a checklist into a quote?" /><JsonLd data={webPageNode({ url: `${siteConfig.canonicalUrl}/guides/`, name: "Cleaning Guides for York Homes and Businesses", description, type: "CollectionPage" })} /></main>;
}
