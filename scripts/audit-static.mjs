import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const routes = [
  "/", "/services/", "/services/domestic-cleaning/", "/services/deep-cleaning/", "/services/end-of-tenancy-cleaning/",
  "/services/holiday-let-cleaning/", "/services/office-commercial-cleaning/", "/services/after-builders-cleaning/", "/areas-we-cover/",
  "/about/", "/guides/", "/guides/what-is-included-in-a-deep-clean/", "/guides/end-of-tenancy-cleaning-checklist/",
  "/guides/york-holiday-let-turnover-checklist/", "/guides/how-often-should-an-office-be-cleaned/", "/contact/", "/privacy/", "/cookies/", "/thank-you/",
];

const fileFor = (route) => route === "/" ? path.join(out, "index.html") : path.join(out, route, "index.html");
const titles = new Map();
const descriptions = new Map();
const failures = [];

for (const route of routes) {
  let html;
  try { html = await fs.readFile(fileFor(route), "utf8"); }
  catch { failures.push(`${route}: generated HTML missing`); continue; }
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const h1s = [...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length;
  if (!title) failures.push(`${route}: title missing`);
  else if (titles.has(title)) failures.push(`${route}: duplicate title with ${titles.get(title)}`);
  else titles.set(title, route);
  if (!description) failures.push(`${route}: meta description missing`);
  else if (descriptions.has(description)) failures.push(`${route}: duplicate description with ${descriptions.get(description)}`);
  else descriptions.set(description, route);
  const expectedCanonical = `https://sunshinecleaning.uk${route}`;
  if (canonical !== expectedCanonical) failures.push(`${route}: canonical is ${canonical ?? "missing"}, expected ${expectedCanonical}`);
  if (h1s !== 1) failures.push(`${route}: expected one h1, found ${h1s}`);
  for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(block[1]); } catch { failures.push(`${route}: malformed JSON-LD`); }
  }
  for (const match of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/api/") || href.includes("#")) continue;
    const target = href === "/" ? path.join(out, "index.html") : href.endsWith("/") ? path.join(out, href, "index.html") : path.join(out, href);
    try { await fs.access(target); } catch { failures.push(`${route}: broken internal link ${href}`); }
  }
}

for (const required of ["robots.txt", "sitemap.xml", "manifest.webmanifest", "404.html", ".htaccess", "api/enquiry.php"]) {
  try { await fs.access(path.join(out, required)); } catch { failures.push(`Missing export file: ${required}`); }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Audited ${routes.length} routes: links, unique metadata, canonicals and structured data are valid.`);
