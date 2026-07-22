import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://festara.id";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const { data: vendors } = await supabase
    .from("vendors")
    .select("id, created_at")
    .eq("is_active", true);

  const vendorRoutes: MetadataRoute.Sitemap = (vendors || []).map((v) => ({
    url: `${baseUrl}/store/${v.id}`,
    lastModified: v.created_at ? new Date(v.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...vendorRoutes];
}