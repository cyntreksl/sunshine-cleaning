import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ContactBand, FaqList, PageHero } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { services, serviceBySlug } from "@/content/services";
import { guideBySlug } from "@/content/guides";
import { siteConfig } from "@/content/site";
import { breadcrumbNode, serviceNode, webPageNode } from "@/lib/structured-data";

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}/` },
    openGraph: {
      title: service.name,
      description: service.metaDescription,
      url: `/services/${service.slug}/`,
      images: [{ url: `/images/${service.image}-1200.webp`, width: 1200, height: 800, alt: service.imageAlt }],
    },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) notFound();
  const relatedGuide = service.relatedGuide ? guideBySlug.get(service.relatedGuide) : undefined;
  const url = `${siteConfig.canonicalUrl}/services/${service.slug}/`;
  const pageFaqs = [
    ...service.faqs,
    { question: `Where is ${service.shortName.toLowerCase()} available?`, answer: "York is our primary location and we also accept enquiries from across the wider YO postcode area. Send your postcode so we can confirm travel and availability." },
    { question: "How do I request a quote?", answer: "Use the online enquiry form or contact Sunshine Cleaning by phone, email or WhatsApp. Include the property, condition, priorities, timing and postcode." },
  ];

  return (
    <main id="main-content">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services", href: "/services/" }, { label: service.shortName }]} />
      <PageHero eyebrow={service.eyebrow} title={service.name} intro={`${service.summary} Available in York and by enquiry across the wider YO postcode area.`} image={service.image} imageAlt={service.imageAlt} />
      <section className="service-facts page-shell" aria-label={`${service.shortName} at a glance`}>
        <dl className="fact-list">
          <div><dt>Service</dt><dd>{service.shortName}</dd></div>
          <div><dt>Suitable for</dt><dd>{service.suitableFor.join(", ")}</dd></div>
          <div><dt>Coverage</dt><dd><Link href="/areas-we-cover/">York and the wider YO postcode area</Link></dd></div>
          <div><dt>Quote</dt><dd><Link href="/contact/">Send the property, priorities, timing and postcode</Link></dd></div>
        </dl>
      </section>
      <section className="service-overview page-shell section-space"><div data-reveal><p className="eyebrow">What the service is</p><h2>{service.description}</h2></div><ul className="benefit-list">{service.benefits.map((benefit) => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul></section>
      <section className="included-section"><div className="page-shell"><div className="section-heading" data-reveal><p className="eyebrow">What we can include</p><h2>Built around the property, not a vague package.</h2><p>Final inclusions are confirmed with your quote.</p></div><div className="inclusion-grid">{service.inclusions.map((item, index) => <div key={item} data-reveal><span>0{index + 1}</span><p>{item}</p></div>)}</div></div></section>
      <section className="suitable-section page-shell section-space"><div data-reveal><p className="eyebrow">Who it is for</p><h2>{service.suitableFor.join(", ")}.</h2></div>{relatedGuide ? <article className="related-guide" data-reveal><span>Related guide · {relatedGuide.readTime}</span><h3>{relatedGuide.title}</h3><p>{relatedGuide.summary}</p><Link className="arrow-link" href={`/guides/${relatedGuide.slug}/`}>Read the guide <span aria-hidden="true">↗</span></Link></article> : <div className="link-list"><p><Link href="/guides/">Read Sunshine Cleaning guides</Link> for practical property-cleaning advice.</p><p><Link href="/services/">Compare all cleaning services</Link> before requesting a quote.</p></div>}</section>
      <section className="faq-section page-shell section-space"><div className="section-heading" data-reveal><p className="eyebrow">Useful answers</p><h2>{service.shortName} FAQs.</h2></div><FaqList faqs={pageFaqs} /></section>
      <ContactBand title={`Ask about ${service.shortName.toLowerCase()} in York or your YO postcode.`} />
      <JsonLd data={[
        { ...webPageNode({ url, name: service.name, description: service.metaDescription }), mainEntity: { "@id": `${url}#service` } },
        serviceNode(service),
        breadcrumbNode([
          { name: "Home", url: `${siteConfig.canonicalUrl}/` },
          { name: "Services", url: `${siteConfig.canonicalUrl}/services/` },
          { name: service.shortName, url },
        ]),
      ]} />
    </main>
  );
}
