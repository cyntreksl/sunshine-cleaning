import { ContactBand, FaqList, ServiceCards } from "@/components/ui";
import { ResponsiveImage } from "@/components/responsive-image";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/content/guides";
import { siteConfig } from "@/content/site";
import { webPageNode } from "@/lib/structured-data";

const homeFaqs = [
  { question: "Which areas do you cover?", answer: "York is our primary location and we also accept enquiries from across the wider YO postcode area. Share your postcode so we can confirm travel and availability." },
  { question: "Is there a Sunshine cleaning service near me?", answer: "If you are in York or another YO postcode area, send us your postcode and cleaning brief. We will confirm whether we can travel to you before you make plans." },
  { question: "How much does a cleaning service cost?", answer: "The quote depends on the property, current condition, priorities, frequency and time required. Share those details and we will respond with the appropriate next step." },
  { question: "Can I book regular or one-off cleaning?", answer: "Yes. You can enquire about weekly, fortnightly, another regular schedule or a one-off clean. Availability is confirmed when we review your request." },
  { question: "How do I get a quote?", answer: "Use the short enquiry form, call, email or WhatsApp us. The property, service and timing details help us respond with the right next step." },
  { question: "Do you clean homes and workplaces?", answer: "Yes. Our listed services cover domestic homes, rental and holiday-let properties, offices and selected commercial spaces." },
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero page-shell">
        <div className="home-hero-copy"><p className="eyebrow">A brighter way to come home</p><h1>Professional cleaning services in <em>York</em>.</h1><p className="hero-intro">Sunshine Cleaning provides domestic, property and workplace cleaning in York and across the wider YO postcode area. Tell us about the space online, by phone, email or WhatsApp and we will confirm coverage, availability and the next step for your quote.</p><div className="hero-actions"><a className="button" href="/contact/">Request a free quote <span aria-hidden="true">↗</span></a><a className="text-link" href={siteConfig.whatsappHref}>Message on WhatsApp <span aria-hidden="true">→</span></a></div><p className="hero-note"><span className="note-line" aria-hidden="true" /> Domestic, commercial and property cleaning across York and the wider YO area.</p></div>
        <div className="home-hero-media"><ResponsiveImage name="domestic-hero" alt="Cleaner wiping a worktop in a characterful York kitchen" eager sizes="(max-width: 900px) 100vw, 48vw" /><div className="hero-floating-note"><span className="status-dot" />Now welcoming York enquiries</div><svg className="hero-sweep" viewBox="0 0 360 100" aria-hidden="true"><path d="M6 73c83-65 194-65 348 2"/><path d="M30 94c98-46 195-43 303 0"/></svg></div>
      </section>
      <section className="fact-band" aria-labelledby="sunshine-facts-title">
        <div className="page-shell">
          <div><p className="eyebrow">Clear local facts</p><h2 id="sunshine-facts-title">Sunshine Cleaning at a glance.</h2></div>
          <dl className="fact-list">
            <div><dt>Primary location</dt><dd>York, United Kingdom</dd></div>
            <div><dt>Coverage</dt><dd><a href="/areas-we-cover/">York and the wider YO postcode area</a></dd></div>
            <div><dt>Cleaning services</dt><dd><a href="/services/">Domestic, deep, tenancy, holiday-let, office and after-builders cleaning</a></dd></div>
            <div><dt>Contact</dt><dd><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a><br /><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></dd></div>
            <div><dt>Quotes</dt><dd><a href="/contact/">Request online</a>, call, email or WhatsApp</dd></div>
          </dl>
        </div>
      </section>
      <section className="home-intro page-shell section-space" data-reveal><p className="eyebrow">Cleaning, considered</p><div><h2>One York team.<br />Six useful ways to help.</h2><p>Choose the closest match and tell us what your property actually needs. We keep the quote process clear and the scope specific.</p></div></section>
      <section className="page-shell"><ServiceCards compact /></section>
      <section className="process-section section-space" id="process"><div className="page-shell"><div className="section-heading" data-reveal><p className="eyebrow">How it works</p><h2>From “we need a cleaner” to a clear plan.</h2></div><ol className="process-grid"><li data-reveal><span>01</span><h3>Tell us the essentials</h3><p>Share the service, postcode, property type, timing and anything that needs particular attention.</p></li><li data-reveal><span>02</span><h3>Agree the scope</h3><p>We clarify the priorities and what is included so expectations are useful on both sides.</p></li><li data-reveal><span>03</span><h3>Confirm the next step</h3><p>Once availability and details are agreed, you will know what happens next and when.</p></li></ol></div></section>
      <section className="york-section page-shell section-space"><div className="york-map-art" aria-hidden="true"><span>YO</span><svg viewBox="0 0 400 360"><path d="M38 70c57-40 93-18 134-35 60-25 125 3 165 50 48 57 18 102 33 153 12 41-31 84-91 89-77 7-97-26-148-23-46 3-93-24-91-75 2-56-38-91-2-159Z"/><path d="M76 164c64 19 127 24 247-11M190 51c13 81 31 158 17 257"/></svg></div><div data-reveal><p className="eyebrow">York first, wider YO coverage</p><h2>Cleaning for York and the wider postcode area.</h2><p>York is our primary location. We also accept enquiries from the wider YO postcode area, including Selby, Thirsk, Scarborough, Filey, Bridlington, Malton, Pickering, Whitby and Driffield. Send your postcode so we can confirm travel and availability.</p><a className="arrow-link" href="/areas-we-cover/">Check the full YO coverage list <span aria-hidden="true">↗</span></a></div></section>
      <section className="guides-preview section-space"><div className="page-shell"><div className="section-heading split" data-reveal><div><p className="eyebrow">Useful before you book</p><h2>Clear cleaning guides, without the fluff.</h2></div><a className="arrow-link" href="/guides/">View all guides <span aria-hidden="true">↗</span></a></div><div className="guide-grid">{guides.slice(0, 3).map((guide, index) => <article key={guide.slug} data-reveal><span>0{index + 1}</span><p>{guide.readTime}</p><h3><a href={`/guides/${guide.slug}/`}>{guide.title}</a></h3><a className="arrow-link" href={`/guides/${guide.slug}/`}>Read guide <span aria-hidden="true">→</span></a></article>)}</div></div></section>
      <section className="faq-section page-shell section-space"><div className="section-heading" data-reveal><p className="eyebrow">A few useful answers</p><h2>Before you enquire.</h2></div><FaqList faqs={homeFaqs} /></section>
      <ContactBand />
      <JsonLd data={webPageNode({ url: `${siteConfig.canonicalUrl}/`, name: "Cleaning Services in York | Sunshine Cleaning", description: "Professional domestic, property and workplace cleaning across York and the wider YO postcode area." })} />
    </main>
  );
}
