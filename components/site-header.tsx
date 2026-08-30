import { Brand } from "./brand";
import { siteConfig } from "@/content/site";

const nav = [{ href: "/services/", label: "Services" }, { href: "/areas-we-cover/", label: "Areas we cover" }, { href: "/guides/", label: "Guides" }, { href: "/about/", label: "About" }, { href: "/contact/", label: "Contact" }];
const NavigationLinks = () => <>{nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</>;

export function SiteHeader() {
  return <><div className="topline"><span>Serving {siteConfig.serviceArea}</span><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></div><header className="site-header"><Brand /><nav className="desktop-nav" aria-label="Primary navigation"><NavigationLinks /></nav><a className="button button-small header-quote" href="/contact/">Get a free quote</a><details className="mobile-nav"><summary className="menu-toggle"><span className="sr-only">Menu</span><span aria-hidden="true" /><span aria-hidden="true" /></summary><nav aria-label="Mobile navigation"><NavigationLinks /></nav></details></header></>;
}
