export type SiteConfig = {
  brand: string;
  strapline: string;
  canonicalUrl: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappHref: string;
  serviceArea: string;
};

export type ServiceRecord = {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: "home" | "sparkle" | "keys" | "bed" | "office" | "brush";
  benefits: string[];
  inclusions: string[];
  suitableFor: string[];
  faqs: { question: string; answer: string }[];
  relatedGuide?: string;
};

export type GuideMetadata = {
  slug: string;
  title: string;
  summary: string;
  published: string;
  updated: string;
  readTime: string;
  relatedService: string;
  socialDescription: string;
};

export type ProofRecord = {
  id: string;
  label: string;
  value: string;
  source?: string;
  published: boolean;
};
