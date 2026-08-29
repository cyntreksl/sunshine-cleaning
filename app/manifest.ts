import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Sunshine Cleaning", short_name: "Sunshine", description: "Professional cleaning for York homes and businesses", start_url: "/", display: "standalone", background_color: "#f5f0e6", theme_color: "#16231f", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] };
}
