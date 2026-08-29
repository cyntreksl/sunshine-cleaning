import type { ComponentType } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ContactBand } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { guides, guideBySlug } from "@/content/guides";
import { serviceBySlug } from "@/content/services";
import { siteConfig } from "@/content/site";
import DeepCleanGuide from "@/guides/what-is-included-in-a-deep-clean.mdx";
import TenancyGuide from "@/guides/end-of-tenancy-cleaning-checklist.mdx";
import HolidayLetGuide from "@/guides/york-holiday-let-turnover-checklist.mdx";
import OfficeGuide from "@/guides/how-often-should-an-office-be-cleaned.mdx";

const bodies: Record<string, ComponentType> = { "what-is-included-in-a-deep-clean": DeepCleanGuide, "end-of-tenancy-cleaning-checklist": TenancyGuide, "york-holiday-let-turnover-checklist": HolidayLetGuide, "how-often-should-an-office-be-cleaned": OfficeGuide };

export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params; const guide = guideBySlug.get(slug); if (!guide) return {};
  return { title: guide.title, description: guide.socialDescription, alternates: { canonical: `/guides/${guide.slug}/` }, openGraph: { type: "article", title: guide.title, description: guide.socialDescription, url: `/guides/${guide.slug}/`, publishedTime: guide.published, modifiedTime: guide.updated } };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params; const guide = guideBySlug.get(slug); const Body = bodies[slug]; if (!guide || !Body) notFound();
  const service = serviceBySlug.get(guide.relatedService); const url = `${siteConfig.canonicalUrl}/guides/${guide.slug}/`;
  return <main id="main-content"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides/" }, { label: guide.title }]} /><article className="guide-article"><header className="guide-header page-shell" data-reveal><p className="eyebrow">Sunshine guide</p><h1>{guide.title}</h1><p>{guide.summary}</p><div><time dateTime={guide.published}>Published {new Date(`${guide.published}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time><span>{guide.readTime}</span></div></header><div className="guide-layout page-shell"><aside><p>In this guide</p><span>{guide.summary}</span>{service ? <Link className="button button-small" href={`/services/${service.slug}/`}>View {service.shortName.toLowerCase()}</Link> : null}</aside><div className="mdx-content"><Body /></div></div></article><ContactBand /><JsonLd data={[{ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.socialDescription, datePublished: guide.published, dateModified: guide.updated, mainEntityOfPage: url, author: { "@type": "Organization", name: siteConfig.brand }, publisher: { "@type": "Organization", name: siteConfig.brand, url: siteConfig.canonicalUrl }, image: `${siteConfig.canonicalUrl}/images/social-card.jpg` }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.canonicalUrl }, { "@type": "ListItem", position: 2, name: "Guides", item: `${siteConfig.canonicalUrl}/guides/` }, { "@type": "ListItem", position: 3, name: guide.title, item: url }] }]} /></main>;
}
