import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Han Zhang — Portfolio",
    short_name: "HZ Portfolio",
    description: "Computer science, architecture and visual work by Han Zhang.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1d2329",
    icons: [
      {
        src: "/icon-hz-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-hz-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
