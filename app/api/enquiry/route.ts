import { createHash, randomUUID } from "node:crypto";
import { Resend } from "resend";
import { serviceBySlug } from "@/content/services";
import { buildEnquiryEmailMessages } from "@/lib/enquiry-email";

export const runtime = "nodejs";

type FieldErrors = Record<string, string>;

const rateBuckets = new Map<string, number[]>();
const propertyTypes = new Set(["House", "Flat", "Holiday let", "Office", "Commercial space", "Other"]);
const frequencies = new Set(["One-off", "Weekly", "Fortnightly", "Other regular schedule", "Not sure yet"]);

function response(status: number, ok: boolean, message: string, fieldErrors?: FieldErrors) {
  return Response.json(
    { ok, message, ...(fieldErrors && Object.keys(fieldErrors).length > 0 ? { fieldErrors } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function value(formData: FormData, key: string, limit: number) {
  const input = formData.get(key);
  return typeof input === "string" ? input.trim().slice(0, limit + 1) : "";
}

function isRateLimited(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  const key = createHash("sha256").update(ip).digest("hex");
  const now = Date.now();
  const attempts = (rateBuckets.get(key) ?? []).filter((time) => time > now - 15 * 60 * 1000);
  if (attempts.length >= 5) return true;
  attempts.push(now);
  rateBuckets.set(key, attempts);
  return false;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const requestHost = request.headers.get("host") || new URL(request.url).host;
      if (new URL(origin).host !== requestHost) {
        return response(403, false, "This enquiry could not be verified. Please reload the page and try again.");
      }
    } catch {
      return response(403, false, "This enquiry could not be verified. Please reload the page and try again.");
    }
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return response(400, false, "We could not read this enquiry. Please reload the page and try again.");
  }

  if (value(formData, "website", 200) !== "") {
    return response(200, true, "Thank you. Your enquiry has been received.");
  }

  const startedAt = Number(value(formData, "startedAt", 20));
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 1800) {
    return response(429, false, "Please wait a moment before sending the form.");
  }
  if (isRateLimited(request)) {
    return response(429, false, "Too many enquiries have been sent from this connection. Please try again later or call us.");
  }

  const data = {
    name: value(formData, "name", 80),
    email: value(formData, "email", 160),
    phone: value(formData, "phone", 30),
    postcode: value(formData, "postcode", 12).toUpperCase(),
    service: value(formData, "service", 60),
    propertyType: value(formData, "propertyType", 50),
    frequency: value(formData, "frequency", 50),
    preferredDate: value(formData, "preferredDate", 10),
    message: value(formData, "message", 2000),
  };

  const limits = { name: 80, email: 160, phone: 30, postcode: 12, service: 60, propertyType: 50, frequency: 50, preferredDate: 10, message: 2000 };
  const required = ["name", "email", "phone", "postcode", "service", "propertyType", "frequency", "message"] as const;
  const errors: FieldErrors = {};

  for (const key of required) if (data[key] === "") errors[key] = "Please complete this field.";
  for (const [key, limit] of Object.entries(limits)) {
    const entry = data[key as keyof typeof data];
    if (entry.length > limit) errors[key] = "This field is too long.";
    if (key !== "message" && /[\r\n]/.test(entry)) errors[key] = "This field contains invalid characters.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address.";
  if (!/^[0-9+()\s.\-]{7,30}$/.test(data.phone)) errors.phone = "Enter a valid telephone number.";
  if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(data.postcode)) errors.postcode = "Enter a valid UK postcode.";
  if (data.preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate)) errors.preferredDate = "Enter a valid date.";
  if (!serviceBySlug.has(data.service)) errors.service = "Select a valid service.";
  if (!propertyTypes.has(data.propertyType)) errors.propertyType = "Select a valid property type.";
  if (!frequencies.has(data.frequency)) errors.frequency = "Select a valid frequency.";
  if (formData.get("privacyAccepted") !== "yes") errors.privacyAccepted = "Please acknowledge the privacy notice.";

  if (Object.keys(errors).length > 0) return response(422, false, "Please check the highlighted fields.", errors);

  if (process.env.SUNSHINE_FORM_TEST_MODE === "1") {
    return response(200, true, "Thank you. Your enquiry has been sent to Sunshine Cleaning.");
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "website@sunshinecleaning.uk";
  const toEmail = process.env.RESEND_TO_EMAIL?.trim() || "sunshinecleaningyork@gmail.com";
  if (!apiKey) {
    console.error("Enquiry delivery is unavailable: RESEND_API_KEY is not configured.");
    return response(500, false, "We could not send your enquiry just now. Please call, WhatsApp or email us instead.");
  }

  const service = serviceBySlug.get(data.service);
  const emailData = { ...data, service: service?.shortName ?? data.service };
  const emails = buildEnquiryEmailMessages(emailData, fromEmail, toEmail);
  const submissionId = startedAt > 0 ? String(startedAt) : randomUUID();
  const idempotencyKey = `website-enquiry/${createHash("sha256").update(`${submissionId}|${data.email}|${data.message}`).digest("hex")}`;
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send(
      emails.internal,
      { idempotencyKey: `${idempotencyKey}/internal` },
    );
    if (error) {
      console.error("Resend enquiry delivery failed:", error.name);
      return response(500, false, "We could not send your enquiry just now. Please call, WhatsApp or email us instead.");
    }
  } catch (error) {
    console.error("Resend enquiry delivery failed:", error instanceof Error ? error.name : "unknown_error");
    return response(500, false, "We could not send your enquiry just now. Please call, WhatsApp or email us instead.");
  }

  try {
    const { error } = await resend.emails.send(
      emails.customer,
      { idempotencyKey: `${idempotencyKey}/customer` },
    );
    if (error) console.error("Resend customer confirmation failed:", error.name);
  } catch (error) {
    console.error("Resend customer confirmation failed:", error instanceof Error ? error.name : "unknown_error");
  }

  return response(200, true, "Thank you. Your enquiry has been sent to Sunshine Cleaning.");
}
