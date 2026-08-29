import { expect, test } from "@playwright/test";

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
  await page.getByLabel("Telephone").fill("07426 292238");
  await page.getByLabel("York postcode").fill("YO1 7AB");
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
  await page.getByLabel("Telephone").fill("07426 292238");
  await page.getByLabel("York postcode").fill("YO1 7AB");
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
