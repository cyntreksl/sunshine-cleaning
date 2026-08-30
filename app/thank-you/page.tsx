import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = { title: "Thank You", description: "Your Sunshine Cleaning enquiry has been sent.", robots: { index: false, follow: false }, alternates: { canonical: "/thank-you/" } };

export default function ThankYouPage() { return <main id="main-content" className="message-page page-shell"><div><p className="eyebrow">Enquiry received</p><h1>Thank you. Your message is on its way.</h1><p>We will use the contact details you supplied to respond to your cleaning enquiry. If the timing is urgent, you can also call <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>.</p><Link className="button" href="/">Return home</Link></div></main>; }
