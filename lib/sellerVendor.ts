import { supabase } from "@/lib/supabase";

export type VendorProfile = {
  id: string;
  user_id: string;
  name: string;
  category_id: string;
  description: string | null;
  location: string | null;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
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

export type PortfolioImage = {
  id: string;
  vendor_id: string;
  image_url: string;
  caption: string | null;
  order_index: number;
};

export type VendorOrder = {
  id: string;
  guest_name: string;
  event_date: string;
  event_time: string | null;
  event_location: string | null;
  status: string;
  total_price: number;
  created_at: string;
  package_name?: string;
};

// Ambil profil vendor milik user yang sedang login
export async function getMyVendor(): Promise<VendorProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("vendors")
    .select("id, user_id, name, category_id, description, location, logo_url, cover_url, is_active")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Gagal ambil profil vendor:", error);
    return null;
  }
  return data;
}

export async function updateMyVendor(vendorId: string, updates: Partial<VendorProfile>) {
  const { error } = await supabase
    .from("vendors")
    .update(updates)
    .eq("id", vendorId);

  if (error) {
    console.error("Gagal update vendor:", error);
    return false;
  }
  return true;
}

// ── PACKAGES ──
export async function getVendorPackages(vendorId: string): Promise<VendorPackage[]> {
  const { data, error } = await supabase
    .from("packages")
    .select("id, vendor_id, name, description, price, is_popular, is_active")
    .eq("vendor_id", vendorId)
    .order("price");

  if (error) {
    console.error("Gagal ambil paket:", error);
    return [];
  }
  return data || [];
}

export async function createPackage(vendorId: string, pkg: { name: string; description: string; price: number; is_popular?: boolean }) {
  const { error } = await supabase.from("packages").insert({
    vendor_id: vendorId,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    is_popular: pkg.is_popular || false,
  });
  if (error) {
    console.error("Gagal tambah paket:", error);
    return false;
  }
  return true;
}

export async function deletePackage(packageId: string) {
  const { error } = await supabase.from("packages").delete().eq("id", packageId);
  if (error) {
    console.error("Gagal hapus paket:", error);
    return false;
  }
  return true;
}

export async function togglePackageActive(packageId: string, isActive: boolean) {
  const { error } = await supabase.from("packages").update({ is_active: isActive }).eq("id", packageId);
  if (error) {
    console.error("Gagal update status paket:", error);
    return false;
  }
  return true;
}

// ── PORTFOLIO ──
export async function getPortfolioImages(vendorId: string): Promise<PortfolioImage[]> {
  const { data, error } = await supabase
    .from("portfolio_images")
    .select("id, vendor_id, image_url, caption, order_index")
    .eq("vendor_id", vendorId)
    .order("order_index");

  if (error) {
    console.error("Gagal ambil portofolio:", error);
    return [];
  }
  return data || [];
}

export async function uploadPortfolioImage(vendorId: string, userId: string, file: File): Promise<boolean> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Gagal upload file:", uploadError);
    return false;
  }

  const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(fileName);

  const { error: insertError } = await supabase.from("portfolio_images").insert({
    vendor_id: vendorId,
    image_url: urlData.publicUrl,
  });

  if (insertError) {
    console.error("Gagal simpan data portofolio:", insertError);
    return false;
  }
  return true;
}

export async function deletePortfolioImage(imageId: string, imageUrl: string, userId: string) {
  const pathMatch = imageUrl.match(/portfolio\/(.+)$/);
  if (pathMatch) {
    const filePath = pathMatch[1];
    await supabase.storage.from("portfolio").remove([filePath]);
  }

  const { error } = await supabase.from("portfolio_images").delete().eq("id", imageId);
  if (error) {
    console.error("Gagal hapus portofolio:", error);
    return false;
  }
  return true;
}

// ── ORDERS (dari bookings) ──
export async function getVendorOrders(vendorId: string): Promise<VendorOrder[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, guest_name, event_date, event_time, event_location, status, total_price, created_at, package_id")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal ambil pesanan:", error);
    return [];
  }

  const packageIds = [...new Set((data || []).map(b => b.package_id).filter(Boolean))];
  let packageMap: Record<string, string> = {};
  if (packageIds.length > 0) {
    const { data: pkgs } = await supabase.from("packages").select("id, name").in("id", packageIds);
    packageMap = Object.fromEntries((pkgs || []).map(p => [p.id, p.name]));
  }

  return (data || []).map(b => ({
    ...b,
    package_name: b.package_id ? packageMap[b.package_id] : undefined,
  }));
}

// Vendor mengatur/mengubah jam acara booking miliknya
export async function updateBookingTime(bookingId: string, eventTime: string) {
  const { error } = await supabase
    .from("bookings")
    .update({ event_time: eventTime })
    .eq("id", bookingId);

  if (error) {
    console.error("Gagal update jam booking:", error);
    return false;
  }
  return true;
}

// ── AVAILABILITY ──
export async function getVendorAvailability(vendorId: string, month: number, year: number) {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-31`;

  const { data, error } = await supabase
    .from("vendor_availability")
    .select("date, is_available")
    .eq("vendor_id", vendorId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error("Gagal ambil ketersediaan:", error);
    return [];
  }
  return data || [];
}

export async function toggleAvailability(vendorId: string, date: string, isAvailable: boolean) {
  const { error } = await supabase
    .from("vendor_availability")
    .upsert({ vendor_id: vendorId, date, is_available: isAvailable }, { onConflict: "vendor_id,date" });

  if (error) {
    console.error("Gagal update ketersediaan:", error);
    return false;
  }
  return true;
}

// ── REVENUE (dari transactions yang sudah paid) ──
export async function getVendorRevenue(vendorId: string): Promise<number> {
  const { data: bookings, error: bookingError } = await supabase
    .from("bookings")
    .select("id")
    .eq("vendor_id", vendorId);

  if (bookingError || !bookings || bookings.length === 0) return 0;

  const bookingIds = bookings.map(b => b.id);

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("amount")
    .in("booking_id", bookingIds)
    .eq("status", "paid");

  if (error) {
    console.error("Gagal ambil pendapatan:", error);
    return 0;
  }

  return (transactions || []).reduce((sum, t) => sum + Number(t.amount), 0);
}