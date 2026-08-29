import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ContactBand, FaqList, PageHero } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { services, serviceBySlug } from "@/content/services";
import { guideBySlug } from "@/content/guides";
import { siteConfig } from "@/content/site";

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) return {};
  return { title: service.name, description: service.summary, alternates: { canonical: `/services/${service.slug}/` }, openGraph: { title: service.name, description: service.summary, url: `/services/${service.slug}/`, images: [{ url: `/images/${service.image}-1200.webp`, width: 1200, height: 800, alt: service.imageAlt }] } };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) notFound();
  const relatedGuide = service.relatedGuide ? guideBySlug.get(service.relatedGuide) : undefined;
  const url = `${siteConfig.canonicalUrl}/services/${service.slug}/`;
  return <main id="main-content"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: service.shortName }]} /><PageHero eyebrow={service.eyebrow} title={service.name} intro={service.summary} image={service.image} imageAlt={service.imageAlt} /><section className="service-overview page-shell section-space"><div data-reveal><p className="eyebrow">A clear, useful scope</p><h2>{service.description}</h2></div><ul className="benefit-list">{service.benefits.map((benefit) => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul></section><section className="included-section"><div className="page-shell"><div className="section-heading" data-reveal><p className="eyebrow">What we can include</p><h2>Built around the property, not a vague package.</h2><p>Final inclusions are confirmed with your quote.</p></div><div className="inclusion-grid">{service.inclusions.map((item, index) => <div key={item} data-reveal><span>0{index + 1}</span><p>{item}</p></div>)}</div></div></section><section className="suitable-section page-shell section-space"><div data-reveal><p className="eyebrow">A good fit for</p><h2>{service.suitableFor.join(", ")}.</h2></div>{relatedGuide ? <article className="related-guide" data-reveal><span>Related guide · {relatedGuide.readTime}</span><h3>{relatedGuide.title}</h3><p>{relatedGuide.summary}</p><Link className="arrow-link" href={`/guides/${relatedGuide.slug}/`}>Read the guide <span aria-hidden="true">↗</span></Link></article> : null}</section><section className="faq-section page-shell section-space"><div className="section-heading" data-reveal><p className="eyebrow">Useful answers</p><h2>{service.shortName} FAQs.</h2></div><FaqList faqs={service.faqs} /></section><ContactBand title={`Ask about ${service.shortName.toLowerCase()} in York.`} /><JsonLd data={[{ "@context": "https://schema.org", "@type": "Service", name: service.name, description: service.description, url, areaServed: { "@type": "City", name: "York" }, provider: { "@type": "Organization", name: siteConfig.brand, url: siteConfig.canonicalUrl } }, { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.canonicalUrl }, { "@type": "ListItem", position: 2, name: "Services", item: `${siteConfig.canonicalUrl}/services/` }, { "@type": "ListItem", position: 3, name: service.shortName, item: url }] }]} /></main>;
}
