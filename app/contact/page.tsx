import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = { title: "Request a Cleaning Quote in York", description: "Tell Sunshine Cleaning about your York home, property or workplace and request a clear, no-obligation quote.", alternates: { canonical: "/contact/" }, openGraph: { title: "Request a Sunshine Cleaning quote", description: "Tell us what needs cleaning in York and we will make the next step simple.", url: "/contact/" } };

export default function ContactPage() {
  return <main id="main-content"><PageHero eyebrow="Your free quote" title="Tell us about the space. We’ll take it from there." intro="A few practical details help us understand the work and respond with the right next step. There is no need to make your message perfect." /><section className="contact-layout page-shell section-space"><div className="contact-details" data-reveal><p className="eyebrow">Prefer a direct conversation?</p><h2>Choose the easiest channel.</h2><a href={siteConfig.phoneHref}><span>Telephone</span>{siteConfig.phoneDisplay}</a><a href={siteConfig.whatsappHref}><span>WhatsApp</span>{siteConfig.phoneDisplay}</a><a href={`mailto:${siteConfig.email}`}><span>Email</span>{siteConfig.email}</a><p className="small-print">We currently serve York city. Include your postcode so we can confirm coverage.</p></div><div data-reveal><QuoteForm /></div></section></main>;
}
