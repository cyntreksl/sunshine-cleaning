import type { Metadata } from "next";
import { CookieConsent } from "@/components/cookie-consent";
import { RevealController } from "@/components/reveal-controller";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sunshinecleaning.uk"),
  title: {
    default: "Sunshine Cleaning | Professional Cleaning in York",
    template: "%s | Sunshine Cleaning York",
  },
  description:
    "Thoughtful domestic and commercial cleaning for homes, workplaces and properties across York.",
  applicationName: "Sunshine Cleaning",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Sunshine Cleaning",
    title: "Professional cleaning for York homes and businesses",
    description: "Domestic, property and workplace cleaning across York city.",
    url: "/",
    images: [{ url: "/images/social-card.jpg", width: 1200, height: 630, alt: "Sunshine Cleaning — Professional cleaning in York" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunshine Cleaning in York",
    description: "Professional cleaning for York homes and businesses.",
    images: ["/images/social-card.jpg"],
  },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
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
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.brand,
          url: siteConfig.canonicalUrl,
          email: siteConfig.email,
          telephone: "+447426292238",
          areaServed: { "@type": "City", name: "York" },
          logo: `${siteConfig.canonicalUrl}/icon.svg`,
        }} />
      </body>
    </html>
  );
}
