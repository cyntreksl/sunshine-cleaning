import { Brand } from "./brand";
import { siteConfig } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main page-shell">
        <div>
          <Brand />
          <p>Professional domestic, property and workplace cleaning across York and the wider YO postcode area.</p>
        </div>
        <div>
          <h2>Explore</h2>
          <a href="/services/">Services</a>
          <a href="/areas-we-cover/">Areas we cover</a>
          <a href="/guides/">Cleaning guides</a>
          <a href="/about/">About us</a>
        </div>
        <div>
          <h2>Talk to us</h2>
          <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <a href={siteConfig.whatsappHref}>WhatsApp Sunshine</a>
        </div>
      </div>
      <div className="footer-legal page-shell">
        <span>© {new Date().getFullYear()} Sunshine Cleaning</span>
        <div><a href="/privacy/">Privacy</a><a href="/cookies/">Cookies</a></div>
      </div>
    </footer>
  );
}
