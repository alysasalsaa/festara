import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/seller", "/admin", "/chat", "/checkout", "/api"],
    },
    sitemap: "https://festara.id/sitemap.xml",
  };
}