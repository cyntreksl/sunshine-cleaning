import type { Metadata } from "next";
import Link from "next/link";
import { ContactBand, PageHero } from "@/components/ui";
import { guides } from "@/content/guides";

export const metadata: Metadata = { title: "Cleaning Guides for York Homes and Businesses", description: "Practical guides to deep cleaning, tenancy handovers, holiday-let turnovers and office-cleaning schedules.", alternates: { canonical: "/guides/" }, openGraph: { title: "Cleaning guides from Sunshine Cleaning", description: "Useful, straightforward cleaning advice for York properties.", url: "/guides/" } };

export default function GuidesPage() {
  return <main id="main-content"><PageHero eyebrow="Sunshine guides" title="Useful cleaning advice, written for real properties." intro="Straightforward checklists and planning guides to help you scope a clean, prepare a property and ask better questions." /><section className="guide-index page-shell section-space">{guides.map((guide, index) => <article key={guide.slug} data-reveal><div><span>0{index + 1}</span><p>{guide.readTime}</p></div><div><h2><Link href={`/guides/${guide.slug}/`}>{guide.title}</Link></h2><p>{guide.summary}</p><Link className="arrow-link" href={`/guides/${guide.slug}/`}>Read the guide <span aria-hidden="true">↗</span></Link></div></article>)}</section><ContactBand title="Need help turning a checklist into a quote?" /></main>;
}
