import type { ProofRecord, SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  brand: "Sunshine Cleaning",
  strapline: "Professional cleaning for York homes and businesses",
  canonicalUrl: "https://sunshinecleaning.uk",
  email: "info@sunshinecleaning.uk",
  phoneDisplay: "+44 7426 292238",
  phoneHref: "tel:+447426292238",
  whatsappHref:
    "https://wa.me/447426292238?text=Hello%20Sunshine%20Cleaning%2C%20I%27d%20like%20a%20quote.",
  serviceArea: "York city",
};

// Claims remain unavailable to the UI until a source is approved and published is true.
export const proofRecords: ProofRecord[] = [
  { id: "reviews", label: "Customer reviews", value: "Pending approval", published: false },
  { id: "insurance", label: "Insurance", value: "Pending evidence", published: false },
  { id: "experience", label: "Experience", value: "Pending evidence", published: false },
];
