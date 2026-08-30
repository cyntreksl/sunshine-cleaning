import { expect, test } from "@playwright/test";
import { buildEnquiryEmailMessages, renderCustomerEnquiryEmail, renderInternalEnquiryEmail } from "@/lib/enquiry-email";

const enquiry = {
  name: "Jamie Taylor",
  email: "jamie@example.com",
  phone: "07459935170",
  postcode: "YO1 7AB",
  service: "Deep cleaning",
  propertyType: "House",
  frequency: "One-off",
  preferredDate: "2026-09-15",
  message: "Three-bedroom house with kitchen and bathroom as priorities.",
};

test("internal enquiry email is branded and includes the complete enquiry", () => {
  const email = renderInternalEnquiryEmail(enquiry);

  expect(email.subject).toBe("Website cleaning enquiry: Deep cleaning");
  expect(email.html).toContain("Sunshine Cleaning");
  expect(email.html).toContain("#16231f");
  expect(email.html).toContain("#f2bd3f");
  expect(email.html).toContain("https://sunshinecleaning.uk/icons/icon-192.png");
  expect(email.html).toContain("Jamie Taylor");
  expect(email.html).toContain("2026-09-15");
  expect(email.html).toContain(enquiry.message);
  expect(email.text).toContain("Email: jamie@example.com");
  expect(email.text).toContain("Preferred date: 2026-09-15");
});

test("customer confirmation contains contact options and submitted details", () => {
  const email = renderCustomerEnquiryEmail(enquiry);

  expect(email.subject).toBe("We’ve received your Sunshine Cleaning enquiry");
  expect(email.html).toContain("Thank you, Jamie Taylor.");
  expect(email.html).toContain("mailto:sunshinecleaningyork@gmail.com");
  expect(email.html).toContain("tel:07459935170");
  expect(email.html).toContain("Deep cleaning");
  expect(email.text).toContain("Your enquiry details");
  expect(email.text).toContain("https://sunshinecleaning.uk");
});

test("email messages keep recipients separate and route replies correctly", () => {
  const messages = buildEnquiryEmailMessages(enquiry, "website@sunshinecleaning.uk", "sunshinecleaningyork@gmail.com");

  expect(messages.internal.to).toEqual(["sunshinecleaningyork@gmail.com"]);
  expect(messages.internal.replyTo).toBe("jamie@example.com");
  expect(messages.customer.to).toEqual(["jamie@example.com"]);
  expect(messages.customer.replyTo).toBe("sunshinecleaningyork@gmail.com");
  expect(messages.internal.to).not.toEqual(messages.customer.to);
});

test("email HTML escapes submitted values and supplies an absent preferred date", () => {
  const unsafe = {
    ...enquiry,
    name: "Jamie <script>alert('name')</script>",
    preferredDate: "",
    message: "Kitchen & bath\n<img src=x onerror=alert(1)>",
  };

  for (const email of [renderInternalEnquiryEmail(unsafe), renderCustomerEnquiryEmail(unsafe)]) {
    expect(email.html).not.toContain("<script>");
    expect(email.html).not.toContain("<img src=x");
    expect(email.html).toContain("Jamie &lt;script&gt;alert(&#39;name&#39;)&lt;/script&gt;");
    expect(email.html).toContain("Kitchen &amp; bath<br>&lt;img src=x onerror=alert(1)&gt;");
    expect(email.html).toContain("Not supplied");
    expect(email.text).toContain("Preferred date: Not supplied");
  }
});
