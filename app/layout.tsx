import type { Metadata } from "next";
import { CookieConsent } from "@/components/cookie-consent";
import { RevealController } from "@/components/reveal-controller";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { organizationNode, websiteNode } from "@/lib/structured-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sunshinecleaning.uk"),
  title: {
    default: "Cleaning Services in York | Sunshine Cleaning",
    template: "%s | Sunshine Cleaning York",
  },
  description:
    "Professional domestic and commercial cleaning services across York and the wider YO postcode area. Call, WhatsApp, email or request a free quote.",
  applicationName: "Sunshine Cleaning",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Sunshine Cleaning",
    title: "Cleaning Services in York | Sunshine Cleaning",
    description: "Professional domestic, property and workplace cleaning across York and the wider YO postcode area.",
    url: "/",
    images: [{ url: "/images/social-card.jpg", width: 1200, height: 630, alt: "Sunshine Cleaning — Professional cleaning in York" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Services in York | Sunshine Cleaning",
    description: "Professional cleaning for York homes, properties and businesses across the wider YO postcode area.",
    images: ["/images/social-card.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieConsent />
        <RevealController />
        <JsonLd data={[organizationNode, websiteNode]} />
      </body>
    </html>
  );
}
