import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import { webPageNode } from "@/lib/structured-data";

const description = "Request a cleaning quote for a home, property or workplace in York or the wider YO postcode area. Contact Sunshine Cleaning online, by phone, email or WhatsApp.";

export const metadata: Metadata = { title: "Request a Cleaning Quote in York", description, alternates: { canonical: "/contact/" }, openGraph: { title: "Request a Sunshine Cleaning Quote", description, url: "/contact/" } };

export default function ContactPage() {
  return <main id="main-content"><PageHero eyebrow="Your free quote" title="Request a cleaning quote in York or your YO postcode." intro="Tell Sunshine Cleaning about the property, service, priorities, timing and postcode. We will confirm coverage and availability before agreeing the next step." /><section className="contact-layout page-shell section-space"><div className="contact-details" data-reveal><p className="eyebrow">Prefer a direct conversation?</p><h2>Choose the easiest channel.</h2><a href={siteConfig.phoneHref}><span>Telephone</span>{siteConfig.phoneDisplay}</a><a href={siteConfig.whatsappHref}><span>WhatsApp</span>{siteConfig.phoneDisplay}</a><a href={`mailto:${siteConfig.email}`}><span>Email</span>{siteConfig.email}</a><p className="small-print">York is our primary location and we accept enquiries across the wider YO postcode area. Include your postcode so we can confirm travel and availability.</p></div><div data-reveal><QuoteForm /></div></section><JsonLd data={webPageNode({ url: `${siteConfig.canonicalUrl}/contact/`, name: "Request a Cleaning Quote in York", description, type: "ContactPage" })} /></main>;
}
