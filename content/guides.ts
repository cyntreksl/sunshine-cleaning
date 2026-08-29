import type { GuideMetadata } from "./types";

export const guides: GuideMetadata[] = [
  {
    slug: "what-is-included-in-a-deep-clean",
    title: "What is included in a deep clean?",
    summary: "A practical room-by-room guide to scoping a deeper home clean without vague promises.",
    published: "2026-08-20",
    updated: "2026-08-20",
    readTime: "6 minute read",
    relatedService: "deep-cleaning",
    socialDescription: "Understand what a deep clean can include and how to agree the right scope for your York home.",
  },
  {
    slug: "end-of-tenancy-cleaning-checklist",
    title: "An end-of-tenancy cleaning checklist",
    summary: "A clear checklist for tenants and landlords preparing a York rental for handover.",
    published: "2026-08-19",
    updated: "2026-08-19",
    readTime: "7 minute read",
    relatedService: "end-of-tenancy-cleaning",
    socialDescription: "Prepare a York rental property for handover with a practical end-of-tenancy cleaning checklist.",
  },
  {
    slug: "york-holiday-let-turnover-checklist",
    title: "A York holiday-let turnover checklist",
    summary: "A repeatable sequence for cleaner, calmer changeovers between short-stay guests.",
    published: "2026-08-18",
    updated: "2026-08-18",
    readTime: "6 minute read",
    relatedService: "holiday-let-cleaning",
    socialDescription: "Build a reliable cleaning and presentation routine for holiday-let turnovers in York.",
  },
  {
    slug: "how-often-should-an-office-be-cleaned",
    title: "How often should an office be cleaned?",
    summary: "A sensible way to set cleaning frequencies around people, rooms and actual usage.",
    published: "2026-08-17",
    updated: "2026-08-17",
    readTime: "5 minute read",
    relatedService: "office-commercial-cleaning",
    socialDescription: "Plan a practical office-cleaning schedule for a small York workplace.",
  },
];

export const guideBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
