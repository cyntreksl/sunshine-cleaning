import { expect, test, type Page } from "@playwright/test";

async function jsonLdNodes(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.flatMap((script) => {
    const data = JSON.parse(script.textContent ?? "{}");
    return Array.isArray(data["@graph"]) ? data["@graph"] : [data];
  })) as Promise<Record<string, unknown>[]>;
}

test("navigation and service discovery work", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Professional cleaning");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Services", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/$/);
  await page.getByRole("link", { name: "Deep cleaning", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/deep-cleaning\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Deep cleaning in York");
});

test("mobile menu exposes the primary routes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator(".menu-toggle");
  await menu.click();
  await expect(page.locator("details.mobile-nav")).toHaveAttribute("open", "");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Contact" })).toBeVisible();
});

test("quote form validates and submits with accessible success", async ({ page }) => {
  await page.goto("/contact/");
  await page.getByLabel("Your name").fill("Jamie Taylor");
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByRole("button", { name: "Send my enquiry" }).click();
  const emailValid = await page.getByLabel("Email address").evaluate((element: HTMLInputElement) => element.validity.valid);
  expect(emailValid).toBe(false);
  await page.getByLabel("Email address").fill("jamie@example.com");
  await page.getByLabel("Telephone").fill("07459935170");
  await page.getByLabel("YO postcode").fill("YO1 7AB");
  await page.getByLabel("Service").selectOption("deep-cleaning");
  await page.getByLabel("Property type").selectOption({ label: "House" });
  await page.getByLabel("Frequency").selectOption({ label: "One-off" });
  await page.getByLabel("Anything we should know?").fill("Three-bedroom house with kitchen and bathroom as priorities.");
  await page.getByLabel(/I have read the privacy notice/).check();
  await page.getByRole("button", { name: "Send my enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("has been sent");
});

test("quote form presents endpoint errors", async ({ page }) => {
  await page.route("**/api/enquiry", (route) => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false, message: "Temporary test error." }) }));
  await page.goto("/contact/");
  await page.getByLabel("Your name").fill("Jamie Taylor");
  await page.getByLabel("Email address").fill("jamie@example.com");
  await page.getByLabel("Telephone").fill("07459935170");
  await page.getByLabel("YO postcode").fill("YO1 7AB");
  await page.getByLabel("Service").selectOption("domestic-cleaning");
  await page.getByLabel("Property type").selectOption({ label: "Flat" });
  await page.getByLabel("Frequency").selectOption({ label: "Weekly" });
  await page.getByLabel("Anything we should know?").fill("A simple test enquiry.");
  await page.getByLabel(/I have read the privacy notice/).check();
  await page.getByRole("button", { name: "Send my enquiry" }).click();
  await expect(page.locator(".form-status.error")).toContainText("Temporary test error");
});

test("analytics is rejected, accepted only by choice, and can be revoked", async ({ page }) => {
  let analyticsRequested = false;
  await page.route("https://www.googletagmanager.com/**", (route) => { analyticsRequested = true; return route.fulfill({ status: 200, contentType: "application/javascript", body: "window.gtagLoaded=true;" }); });
  await page.goto("/");
  await expect(page.getByText("Your privacy, your choice")).toBeVisible();
  await expect.poll(() => analyticsRequested).toBe(false);
  await page.getByRole("button", { name: "Reject analytics" }).click();
  await page.reload();
  await expect(page.getByText("Your privacy, your choice")).toBeHidden();
  await expect.poll(() => analyticsRequested).toBe(false);
  await page.evaluate(() => localStorage.removeItem("sunshine-consent-v1"));
  await page.reload();
  await page.getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(() => analyticsRequested).toBe(true);
  await page.context().addCookies([{ name: "_ga", value: "test", domain: "127.0.0.1", path: "/" }]);
  await page.goto("/cookies/");
  await page.getByRole("button", { name: "Change cookie preferences" }).click();
  await page.getByRole("button", { name: "Reject analytics" }).click();
  await expect.poll(async () => (await page.context().cookies()).some((cookie) => cookie.name === "_ga")).toBe(false);
});

test("homepage presents York SEO metadata and answer-first business facts", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Cleaning Services in York | Sunshine Cleaning");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /York and the wider YO postcode area/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://sunshinecleaning.uk/");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Cleaning Services in York | Sunshine Cleaning");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Professional cleaning services in York.");
  await expect(page.getByRole("heading", { name: "Sunshine Cleaning at a glance." })).toBeVisible();
  await expect(page.getByText("York, United Kingdom", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Sunshine Cleaning at a glance." }).getByRole("link", { name: "sunshinecleaningyork@gmail.com" })).toBeVisible();
});

test("indexable landing and service pages have unique metadata", async ({ page }) => {
  const paths = [
    "/", "/services/", "/areas-we-cover/", "/about/", "/guides/", "/contact/",
    "/services/domestic-cleaning/", "/services/deep-cleaning/", "/services/end-of-tenancy-cleaning/",
    "/services/holiday-let-cleaning/", "/services/office-commercial-cleaning/", "/services/after-builders-cleaning/",
  ];
  const titles: string[] = [];
  const descriptions: string[] = [];

  for (const path of paths) {
    await page.goto(path);
    titles.push(await page.title());
    descriptions.push(await page.locator('meta[name="description"]').getAttribute("content") ?? "");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://sunshinecleaning.uk${path}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  }

  expect(new Set(titles).size).toBe(paths.length);
  expect(new Set(descriptions).size).toBe(paths.length);
  expect(descriptions.every((description) => description.length > 80)).toBe(true);
});

test("connected JSON-LD identifies the organisation, website, page, service and article", async ({ page }) => {
  await page.goto("/");
  let nodes = await jsonLdNodes(page);
  const organization = nodes.find((node) => node["@type"] === "Organization");
  const website = nodes.find((node) => node["@type"] === "WebSite");
  const homePage = nodes.find((node) => node["@type"] === "WebPage");
  expect(organization?.["@id"]).toBe("https://sunshinecleaning.uk/#organization");
  expect(organization?.telephone).toBe("+447459935170");
  expect(JSON.stringify(organization)).not.toContain("streetAddress");
  expect(JSON.stringify(organization)).toContain("YO62");
  expect(website?.publisher).toEqual({ "@id": "https://sunshinecleaning.uk/#organization" });
  expect(homePage?.isPartOf).toEqual({ "@id": "https://sunshinecleaning.uk/#website" });

  await page.goto("/services/deep-cleaning/");
  nodes = await jsonLdNodes(page);
  const service = nodes.find((node) => node["@type"] === "Service");
  const servicePage = nodes.find((node) => node["@type"] === "WebPage");
  expect(service?.provider).toEqual({ "@id": "https://sunshinecleaning.uk/#organization" });
  expect(servicePage?.mainEntity).toEqual({ "@id": "https://sunshinecleaning.uk/services/deep-cleaning/#service" });

  await page.goto("/guides/what-is-included-in-a-deep-clean/");
  nodes = await jsonLdNodes(page);
  const article = nodes.find((node) => node["@type"] === "Article");
  expect(article?.author).toEqual({ "@id": "https://sunshinecleaning.uk/#organization" });
  expect(article?.mainEntityOfPage).toEqual({ "@id": "https://sunshinecleaning.uk/guides/what-is-included-in-a-deep-clean/#webpage" });
});

test("coverage, sitemap and robots expose accurate crawlable location signals", async ({ page, request }) => {
  await page.goto("/areas-we-cover/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("York and the wider YO postcode area");
  await expect(page.locator(".postcode-grid section")).toHaveCount(10);
  const postcodes = await page.locator(".postcode-grid").innerText();
  const districts = postcodes.match(/YO\d+/g) ?? [];
  expect(new Set(districts).size).toBe(29);
  await expect(page.getByRole("link", { name: "Domestic cleaning in York" })).toBeVisible();

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("User-Agent: *");
  expect(await robots.text()).toContain("Disallow: /thank-you/");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("https://sunshinecleaning.uk/services/deep-cleaning/");
  expect(sitemapText).toContain("<lastmod>2026-08-31</lastmod>");
});

for (const userAgent of ["Googlebot", "Bingbot", "OAI-SearchBot"]) {
  test(`${userAgent} can fetch server-rendered homepage content`, async ({ playwright }) => {
    const crawler = await playwright.request.newContext({ baseURL: "http://127.0.0.1:4173", userAgent });
    const response = await crawler.get("/");
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain("Professional cleaning services in");
    await crawler.dispose();
  });
}
