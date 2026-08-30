import { siteConfig } from "@/content/site";

export type EnquiryEmailData = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  service: string;
  propertyType: string;
  frequency: string;
  preferredDate: string;
  message: string;
};

export type EnquiryEmail = {
  subject: string;
  html: string;
  text: string;
};

export type EnquiryEmailMessage = EnquiryEmail & {
  from: string;
  to: string[];
  replyTo: string;
};

type Detail = { label: string; value: string };

const colours = {
  ink: "#16231f",
  inkSoft: "#4c5a55",
  cream: "#f5f0e6",
  paper: "#fffdf8",
  sun: "#f2bd3f",
  sunLight: "#ffe8a3",
  line: "#d6d3c9",
};

export function escapeEmailHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function detailsFor(data: EnquiryEmailData): Detail[] {
  return [
    { label: "Name", value: data.name },
    { label: "Email", value: data.email },
    { label: "Telephone", value: data.phone },
    { label: "Postcode", value: data.postcode },
    { label: "Service", value: data.service },
    { label: "Property type", value: data.propertyType },
    { label: "Frequency", value: data.frequency },
    { label: "Preferred date", value: data.preferredDate || "Not supplied" },
    { label: "Message", value: data.message },
  ];
}

function detailRows(details: Detail[]) {
  return details.map(({ label, value }) => {
    const safeValue = escapeEmailHtml(value).replaceAll("\n", "<br>");
    return `<tr>
      <td style="padding:12px 16px;border-bottom:1px solid ${colours.line};color:${colours.inkSoft};font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;vertical-align:top;width:130px;">${escapeEmailHtml(label)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid ${colours.line};color:${colours.ink};font-family:Arial,sans-serif;font-size:15px;line-height:1.55;vertical-align:top;word-break:break-word;">${safeValue}</td>
    </tr>`;
  }).join("");
}

function textDetails(details: Detail[]) {
  return details.map(({ label, value }) => `${label}: ${value}`).join("\n");
}

function emailShell({ preheader, eyebrow, heading, intro, details, footerNote }: {
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  details: Detail[];
  footerNote: string;
}) {
  return `<!doctype html>
<html lang="en-GB">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeEmailHtml(heading)}</title></head>
  <body style="margin:0;padding:0;background:${colours.cream};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeEmailHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:${colours.cream};">
      <tr><td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:${colours.paper};border:1px solid ${colours.line};border-radius:20px;overflow:hidden;">
          <tr><td style="padding:24px 28px;background:${colours.ink};">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
              <td style="padding-right:12px;"><img src="${siteConfig.canonicalUrl}/icons/icon-192.png" width="44" height="44" alt="" style="display:block;width:44px;height:44px;border:0;"></td>
              <td style="color:${colours.paper};font-family:Arial,sans-serif;font-size:18px;font-weight:800;line-height:1.1;">Sunshine Cleaning<br><span style="color:${colours.sun};font-size:11px;letter-spacing:.12em;text-transform:uppercase;">Professional cleaning · York</span></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:38px 28px 20px;">
            <p style="margin:0 0 12px;color:${colours.inkSoft};font-family:Arial,sans-serif;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;"><span style="color:${colours.sun};">—</span>&nbsp; ${escapeEmailHtml(eyebrow)}</p>
            <h1 style="margin:0;color:${colours.ink};font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:500;letter-spacing:-.02em;line-height:1.08;">${escapeEmailHtml(heading)}</h1>
            <p style="margin:18px 0 0;color:${colours.inkSoft};font-family:Arial,sans-serif;font-size:16px;line-height:1.65;">${escapeEmailHtml(intro)}</p>
          </td></tr>
          <tr><td style="padding:12px 28px 32px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:${colours.cream};border:1px solid ${colours.line};border-radius:12px;overflow:hidden;">${detailRows(details)}</table>
          </td></tr>
          <tr><td style="padding:24px 28px;background:${colours.sunLight};color:${colours.ink};font-family:Arial,sans-serif;font-size:14px;line-height:1.6;">${escapeEmailHtml(footerNote)}</td></tr>
          <tr><td style="padding:22px 28px;color:${colours.inkSoft};font-family:Arial,sans-serif;font-size:12px;line-height:1.6;">
            <a href="${siteConfig.canonicalUrl}" style="color:${colours.ink};font-weight:700;">sunshinecleaning.uk</a>&nbsp; · &nbsp;<a href="mailto:${siteConfig.email}" style="color:${colours.ink};font-weight:700;">${siteConfig.email}</a>&nbsp; · &nbsp;<a href="${siteConfig.phoneHref}" style="color:${colours.ink};font-weight:700;">${siteConfig.phoneDisplay}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export function renderInternalEnquiryEmail(data: EnquiryEmailData): EnquiryEmail {
  const details = detailsFor(data);
  return {
    subject: `Website cleaning enquiry: ${data.service}`,
    html: emailShell({
      preheader: `New ${data.service} enquiry from ${data.name}`,
      eyebrow: "New website enquiry",
      heading: `A new ${data.service.toLowerCase()} enquiry has arrived.`,
      intro: "The customer’s details are below. Reply to this email to respond directly to them.",
      details,
      footerNote: "This enquiry was submitted through the Sunshine Cleaning website.",
    }),
    text: [
      "New Sunshine Cleaning website enquiry",
      "",
      textDetails(details),
      "",
      "Reply to this email to respond directly to the customer.",
    ].join("\n"),
  };
}

export function renderCustomerEnquiryEmail(data: EnquiryEmailData): EnquiryEmail {
  const details = detailsFor(data);
  return {
    subject: "We’ve received your Sunshine Cleaning enquiry",
    html: emailShell({
      preheader: "Your cleaning enquiry has reached Sunshine Cleaning in York.",
      eyebrow: "Enquiry received",
      heading: `Thank you, ${data.name}.`,
      intro: "Your enquiry has reached Sunshine Cleaning. We’ll review the details and contact you using the information you supplied.",
      details,
      footerNote: "Need to add something? Reply to this email, call us or use WhatsApp and we’ll include it with your enquiry.",
    }),
    text: [
      `Thank you, ${data.name}.`,
      "",
      "Your enquiry has reached Sunshine Cleaning. We’ll review the details and contact you using the information you supplied.",
      "",
      "Your enquiry details",
      textDetails(details),
      "",
      `Need to add something? Reply to this email, call ${siteConfig.phoneDisplay}, or visit ${siteConfig.canonicalUrl}.`,
      siteConfig.email,
    ].join("\n"),
  };
}

export function buildEnquiryEmailMessages(data: EnquiryEmailData, fromEmail: string, toEmail: string): {
  internal: EnquiryEmailMessage;
  customer: EnquiryEmailMessage;
} {
  return {
    internal: {
      from: `Sunshine Cleaning website <${fromEmail}>`,
      to: [toEmail],
      replyTo: data.email,
      ...renderInternalEnquiryEmail(data),
    },
    customer: {
      from: `Sunshine Cleaning <${fromEmail}>`,
      to: [data.email],
      replyTo: toEmail,
      ...renderCustomerEnquiryEmail(data),
    },
  };
}
