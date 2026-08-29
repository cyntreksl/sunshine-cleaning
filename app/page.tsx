import { ContactBand, FaqList, ServiceCards } from "@/components/ui";
import { ResponsiveImage } from "@/components/responsive-image";
import { guides } from "@/content/guides";
import { siteConfig } from "@/content/site";

const homeFaqs = [
  { question: "Which parts of York do you cover?", answer: "Sunshine Cleaning currently serves York city. Share your postcode when enquiring and we will confirm whether we can help." },
  { question: "How do I get a quote?", answer: "Use the short enquiry form, call, email or WhatsApp us. The property, service and timing details help us respond with the right next step." },
  { question: "Do you clean homes and workplaces?", answer: "Yes. Our listed services cover domestic homes, rental and holiday-let properties, offices and selected commercial spaces." },
  { question: "Are prices shown online?", answer: "Not yet. A sensible quote depends on the property, condition, scope and frequency, so we ask for a few details first." },
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero page-shell">
        <div className="home-hero-copy"><p className="eyebrow">A brighter way to come home</p><h1>Professional cleaning for <em>York</em> homes &amp; businesses.</h1><p className="hero-intro">Thoughtful cleaning for the places you live, work and welcome guests. Tell us what you need and we&apos;ll make the next step simple.</p><div className="hero-actions"><a className="button" href="/contact/">Request a free quote <span aria-hidden="true">↗</span></a><a className="text-link" href={siteConfig.whatsappHref}>Message on WhatsApp <span aria-hidden="true">→</span></a></div><p className="hero-note"><span className="note-line" aria-hidden="true" /> Domestic, commercial and property cleaning across York city.</p></div>
        <div className="home-hero-media"><ResponsiveImage name="domestic-hero" alt="Cleaner wiping a worktop in a characterful York kitchen" eager sizes="(max-width: 900px) 100vw, 48vw" /><div className="hero-floating-note"><span className="status-dot" />Now welcoming York enquiries</div><svg className="hero-sweep" viewBox="0 0 360 100" aria-hidden="true"><path d="M6 73c83-65 194-65 348 2"/><path d="M30 94c98-46 195-43 303 0"/></svg></div>
      </section>
      <section className="home-intro page-shell section-space" data-reveal><p className="eyebrow">Cleaning, considered</p><div><h2>One York team.<br />Six useful ways to help.</h2><p>Choose the closest match and tell us what your property actually needs. We keep the quote process clear and the scope specific.</p></div></section>
      <section className="page-shell"><ServiceCards compact /></section>
      <section className="process-section section-space" id="process"><div className="page-shell"><div className="section-heading" data-reveal><p className="eyebrow">How it works</p><h2>From “we need a cleaner” to a clear plan.</h2></div><ol className="process-grid"><li data-reveal><span>01</span><h3>Tell us the essentials</h3><p>Share the service, postcode, property type, timing and anything that needs particular attention.</p></li><li data-reveal><span>02</span><h3>Agree the scope</h3><p>We clarify the priorities and what is included so expectations are useful on both sides.</p></li><li data-reveal><span>03</span><h3>Confirm the next step</h3><p>Once availability and details are agreed, you will know what happens next and when.</p></li></ol></div></section>
      <section className="york-section page-shell section-space"><div className="york-map-art" aria-hidden="true"><span>YO</span><svg viewBox="0 0 400 360"><path d="M38 70c57-40 93-18 134-35 60-25 125 3 165 50 48 57 18 102 33 153 12 41-31 84-91 89-77 7-97-26-148-23-46 3-93-24-91-75 2-56-38-91-2-159Z"/><path d="M76 164c64 19 127 24 247-11M190 51c13 81 31 158 17 257"/></svg></div><div data-reveal><p className="eyebrow">Local focus</p><h2>Made for homes and businesses in York.</h2><p>We focus on York city rather than publishing thin pages for every nearby place. That keeps the service honest and lets us build genuinely useful local information.</p><a className="arrow-link" href="/areas-we-cover/">Check our York coverage <span aria-hidden="true">↗</span></a></div></section>
      <section className="guides-preview section-space"><div className="page-shell"><div className="section-heading split" data-reveal><div><p className="eyebrow">Useful before you book</p><h2>Clear cleaning guides, without the fluff.</h2></div><a className="arrow-link" href="/guides/">View all guides <span aria-hidden="true">↗</span></a></div><div className="guide-grid">{guides.slice(0, 3).map((guide, index) => <article key={guide.slug} data-reveal><span>0{index + 1}</span><p>{guide.readTime}</p><h3><a href={`/guides/${guide.slug}/`}>{guide.title}</a></h3><a className="arrow-link" href={`/guides/${guide.slug}/`}>Read guide <span aria-hidden="true">→</span></a></article>)}</div></div></section>
      <section className="faq-section page-shell section-space"><div className="section-heading" data-reveal><p className="eyebrow">A few useful answers</p><h2>Before you enquire.</h2></div><FaqList faqs={homeFaqs} /></section>
      <ContactBand />
    </main>
  );
}
