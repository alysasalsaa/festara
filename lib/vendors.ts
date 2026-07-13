import { supabase } from "@/lib/supabase";

export type SupabaseVendor = {
  id: string;
  user_id: string;
  name: string;
  category_id: string;
  description: string | null;
  location: string | null;
  logo_url: string | null;
  cover_url: string | null;
};

export async function getVendorById(id: string): Promise<SupabaseVendor | null> {
  const { data, error } = await supabase
    .from("vendors")
    .select("id, user_id, name, category_id, description, location, logo_url, cover_url")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gagal ambil vendor:", error);
    return null;
  }
  return data;
}

export async function listVendors(filters?: {
  categoryId?: string;
  location?: string;
  search?: string;
}): Promise<SupabaseVendor[]> {
  let query = supabase
    .from("vendors")
    .select("id, user_id, name, category_id, description, location, logo_url, cover_url");

  if (filters?.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters?.location) query = query.ilike("location", `%${filters.location}%`);
  if (filters?.search) query = query.ilike("name", `%${filters.search}%`);

  const { data, error } = await query.order("name");

  if (error) {
    console.error("Gagal ambil daftar vendor:", error);
    return [];
  }
  return data || [];
}

// ── SEARCH: vendor + harga termurah + rating asli ──

export type VendorSearchResult = SupabaseVendor & {
  minPrice: number;
  rating: number;
  reviewCount: number;
};

export async function listVendorsForSearch(filters?: {
  categoryId?: string;
  location?: string;
  search?: string;
}): Promise<VendorSearchResult[]> {
  const baseVendors = await listVendors(filters);

  if (baseVendors.length === 0) return [];

  const vendorIds = baseVendors.map(v => v.id);

  const { data: packagesData } = await supabase
    .from("packages")
    .select("vendor_id, price")
    .in("vendor_id", vendorIds)
    .eq("is_active", true);

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("vendor_id, rating")
    .in("vendor_id", vendorIds);

  const minPriceMap: Record<string, number> = {};
  (packagesData || []).forEach(p => {
    if (!minPriceMap[p.vendor_id] || p.price < minPriceMap[p.vendor_id]) {
      minPriceMap[p.vendor_id] = p.price;
    }
  });

  const ratingMap: Record<string, { sum: number; count: number }> = {};
  (reviewsData || []).forEach(r => {
    if (!ratingMap[r.vendor_id]) ratingMap[r.vendor_id] = { sum: 0, count: 0 };
    ratingMap[r.vendor_id].sum += r.rating;
    ratingMap[r.vendor_id].count += 1;
  });

  return baseVendors.map(v => ({
    ...v,
    minPrice: minPriceMap[v.id] || 0,
    rating: ratingMap[v.id] ? ratingMap[v.id].sum / ratingMap[v.id].count : 0,
    reviewCount: ratingMap[v.id]?.count || 0,
  }));
}