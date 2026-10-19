import type { MetadataRoute } from "next";

// Lets Caesura be installed to a phone/desktop home screen with the right name, icon and colours.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Caesura",
    short_name: "Caesura",
    description: "Read and share stories",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ea580c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
