import type { ProofRecord, SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  brand: "Sunshine Cleaning",
  strapline: "Professional cleaning for York homes and businesses",
  canonicalUrl: "https://sunshinecleaning.uk",
  email: "sunshinecleaningyork@gmail.com",
  phoneDisplay: "07459935170",
  phoneHref: "tel:07459935170",
  phoneInternational: "+447459935170",
  whatsappHref:
    "https://wa.me/447459935170?text=Hello%20Sunshine%20Cleaning%2C%20I%27d%20like%20a%20quote.",
  serviceArea: "York and the wider YO postcode area",
  serviceAreas: [
    { name: "York", postcodes: ["YO1", "YO10", "YO19", "YO23", "YO24", "YO26", "YO30", "YO31", "YO32", "YO41", "YO42", "YO43", "YO51", "YO60", "YO61", "YO62"] },
    { name: "Thirsk", postcodes: ["YO7"] },
    { name: "Selby", postcodes: ["YO8"] },
    { name: "Scarborough", postcodes: ["YO11", "YO12", "YO13"] },
    { name: "Filey", postcodes: ["YO14"] },
    { name: "Bridlington", postcodes: ["YO15", "YO16"] },
    { name: "Malton", postcodes: ["YO17"] },
    { name: "Pickering", postcodes: ["YO18"] },
    { name: "Whitby", postcodes: ["YO21", "YO22"] },
    { name: "Driffield", postcodes: ["YO25"] },
  ],
};

// Claims remain unavailable to the UI until a source is approved and published is true.
export const proofRecords: ProofRecord[] = [
  { id: "reviews", label: "Customer reviews", value: "Pending approval", published: false },
  { id: "insurance", label: "Insurance", value: "Pending evidence", published: false },
  { id: "experience", label: "Experience", value: "Pending evidence", published: false },
];
