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
  tags: string[] | null;
};

export type VendorPackage = {
  id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  price: number;
  is_popular: boolean;
  is_active: boolean;
};

export type VendorWithStats = SupabaseVendor & {
  rating: number;
  reviewCount: number;
  minPrice: number | null;
};

export async function getVendorById(id: string): Promise<SupabaseVendor | null> {
  const { data, error } = await supabase
    .from("vendors")
    .select("id, user_id, name, category_id, description, location, logo_url, cover_url, tags")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gagal ambil vendor:", error);
    return null;
  }
  return data;
}

/**
 * Ambil paket AKTIF milik satu vendor (RLS otomatis membatasi ke is_active = true
 * untuk pengunjung publik, tapi kita filter eksplisit juga di sini untuk jelas).
 */
export async function getVendorPackages(vendorId: string): Promise<VendorPackage[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("id, vendor_id, name, description, price, is_popular, is_active")
    .eq("vendor_id", vendorId)
    .eq("is_active", true)
    .order("price");

  if (error) {
    console.error("Gagal ambil paket vendor:", error);
    return [];
  }
  return data || [];
}

export async function listVendors(filters?: {
  categoryId?: string;
  location?: string;
  search?: string;
}): Promise<SupabaseVendor[]> {
  let query = supabase
    .from("vendors")
    .select("id, user_id, name, category_id, description, location, logo_url, cover_url, tags");

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

/**
 * listVendors + rating/reviewCount (dari tabel reviews) + minPrice (dari paket AKTIF).
 */
export async function listVendorsWithStats(filters?: {
  categoryId?: string;
  location?: string;
  search?: string;
}): Promise<VendorWithStats[]> {
  const vendors = await listVendors(filters);
  if (vendors.length === 0) return [];

  const vendorIds = vendors.map(v => v.id);

  const [{ data: reviews, error: reviewErr }, { data: packages, error: pkgErr }] = await Promise.all([
    supabase.from("reviews").select("vendor_id, rating").in("vendor_id", vendorIds),
    supabase.from("packages").select("vendor_id, price").in("vendor_id", vendorIds).eq("is_active", true),
  ]);

  if (reviewErr) console.error("Gagal ambil statistik review:", reviewErr);
  if (pkgErr) console.error("Gagal ambil statistik paket:", pkgErr);

  const statsMap = new Map<string, { total: number; count: number }>();
  (reviews || []).forEach(r => {
    const s = statsMap.get(r.vendor_id) || { total: 0, count: 0 };
    s.total += r.rating;
    s.count += 1;
    statsMap.set(r.vendor_id, s);
  });

  const priceMap = new Map<string, number>();
  (packages || []).forEach(p => {
    const current = priceMap.get(p.vendor_id);
    if (current === undefined || p.price < current) priceMap.set(p.vendor_id, p.price);
  });

  return vendors.map(v => {
    const s = statsMap.get(v.id);
    return {
      ...v,
      rating: s ? Math.round((s.total / s.count) * 10) / 10 : 0,
      reviewCount: s ? s.count : 0,
      minPrice: priceMap.get(v.id) ?? null,
    };
  });
}