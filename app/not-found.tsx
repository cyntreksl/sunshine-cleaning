import Link from "next/link";

export default function NotFound() { return <main id="main-content" className="message-page page-shell"><div><p className="eyebrow">404 · Page not found</p><h1>This page has slipped out of sight.</h1><p>Try the services page or return to the Sunshine Cleaning homepage.</p><div className="hero-actions"><Link className="button" href="/">Return home</Link><Link className="text-link" href="/services/">View services</Link></div></div></main>; }
