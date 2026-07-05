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