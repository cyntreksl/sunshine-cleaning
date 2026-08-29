import { ServiceIcon } from "./service-icon";
import { ResponsiveImage } from "./responsive-image";
import { services } from "@/content/services";
import { siteConfig } from "@/content/site";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs page-shell" aria-label="Breadcrumb"><ol>{items.map((item, index) => <li key={item.label}>{item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}{index < items.length - 1 ? <span aria-hidden="true">/</span> : null}</li>)}</ol></nav>
  );
}

export function PageHero({ eyebrow, title, intro, image, imageAlt }: { eyebrow: string; title: string; intro: string; image?: string; imageAlt?: string }) {
  return <section className={`page-hero page-shell${image ? " with-image" : ""}`}><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-intro">{intro}</p></div>{image && imageAlt ? <ResponsiveImage name={image} alt={imageAlt} className="page-hero-image" eager /> : null}</section>;
}

export function ServiceCards({ compact = false }: { compact?: boolean }) {
  return <div className={`service-list-grid${compact ? " compact" : ""}`}>{services.map((service, index) => <article className="service-list-card" key={service.slug} data-reveal style={{ "--delay": `${index * 55}ms` } as React.CSSProperties}><div className="service-card-top"><ServiceIcon icon={service.icon} /><span>0{index + 1}</span></div><h3><a href={`/services/${service.slug}/`}>{service.shortName}</a></h3><p>{service.summary}</p><a className="arrow-link" href={`/services/${service.slug}/`}>Explore service <span aria-hidden="true">↗</span></a></article>)}</div>;
}

export function ContactBand({ title = "Tell us what would make your week feel lighter." }: { title?: string }) {
  return <section className="contact-band"><div className="page-shell" data-reveal><div><p className="eyebrow">Start with a conversation</p><h2>{title}</h2></div><div className="contact-band-actions"><a className="button button-sun" href="/contact/">Request a free quote <span aria-hidden="true">↗</span></a><a className="text-link light" href={siteConfig.phoneHref}>Call {siteConfig.phoneDisplay}</a><a className="text-link light" href={siteConfig.whatsappHref}>WhatsApp us</a></div></div></section>;
}

export function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return <div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>;
}
