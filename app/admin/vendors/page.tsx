"use client";
import { useState, useEffect } from "react";
import { MapPin, Star, Loader2, Power, BadgeCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { categories } from "@/data";

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

type VendorRow = {
  id: string;
  name: string;
  category_id: string;
  location: string | null;
  is_active: boolean;
  is_verified: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  user_id: string;
  users: { full_name: string; email: string } | null;
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchData() {
    setLoading(true);
    let query = supabase
      .from("vendors")
      .select(
        `id, name, category_id, location, is_active, is_verified, rating, review_count, created_at, user_id,
        users ( full_name, email )`
      )
      .order("created_at", { ascending: false });

    if (filter === "active") query = query.eq("is_active", true);
    if (filter === "inactive") query = query.eq("is_active", false);

    const { data, error } = await query;
    if (!error && data) setVendors(data as unknown as VendorRow[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function handleToggleActive(vendor: VendorRow) {
    setProcessingId(vendor.id);
    setErrorMsg("");

    const newActive = !vendor.is_active;
    const { error } = await supabase.from("vendors").update({ is_active: newActive }).eq("id", vendor.id);

    if (error) {
      setErrorMsg("Gagal mengubah status vendor: " + error.message);
      setProcessingId(null);
      return;
    }

    await supabase.from("notifications").insert({
      user_id: vendor.user_id,
      type: newActive ? "vendor_activated" : "vendor_deactivated",
      title: newActive ? "Toko Diaktifkan Kembali" : "Toko Dinonaktifkan",
      message: newActive
        ? "Toko kamu telah diaktifkan kembali oleh admin dan sekarang tampil di pencarian."
        : "Toko kamu dinonaktifkan sementara oleh admin. Hubungi tim Festara jika ini tidak sesuai.",
    });

    await fetchData();
    setProcessingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-bold text-[#1A3A3C]">Kelola Vendor</h2>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                filter === f.value ? "bg-[#1CABB4] text-white" : "bg-white text-[#4A7A6D] border border-[#D4EAC8]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-4 py-3">
          <p className="text-sm text-[#EF4444]">{errorMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : vendors.length === 0 ? (
        <p className="text-center text-sm text-[#8ABDB5] py-16 bg-white/80 rounded-2xl">Tidak ada vendor untuk filter ini</p>
      ) : (
        <div className="space-y-3">
          {vendors.map((v) => {
            const categoryLabel = categories.find((c) => c.id === v.category_id)?.name || v.category_id;

            return (
              <div key={v.id} className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-[#1A3A3C]">{v.name}</h3>
                      {v.is_verified && <BadgeCheck size={14} className="text-[#1CABB4]" />}
                    </div>
                    <p className="text-xs text-[#8ABDB5]">
                      {v.users?.full_name || "Pemilik"} ({v.users?.email})
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      v.is_active ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEF2F2] text-[#EF4444]"
                    }`}
                  >
                    {v.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#4A7A6D] mb-4 flex-wrap">
                  <span className="bg-[#E8F8F9] text-[#1CABB4] font-semibold px-2.5 py-1 rounded-full">{categoryLabel}</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} /> {v.location || "-"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" /> {v.rating?.toFixed(1) || "0.0"} ({v.review_count} ulasan)
                  </div>
                </div>

                <button
                  onClick={() => handleToggleActive(v)}
                  disabled={processingId === v.id}
                  className={`flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-60 ${
                    v.is_active
                      ? "border border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]"
                      : "bg-[#1CABB4] text-white hover:bg-[#178E96]"
                  }`}
                >
                  {processingId === v.id ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
                  {v.is_active ? "Nonaktifkan Toko" : "Aktifkan Toko"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}