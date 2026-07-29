"use client";
import { useState, useEffect } from "react";
import { MapPin, Star, Loader2, Power, BadgeCheck, ChevronDown, ChevronUp, Package, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { categories, formatPrice } from "@/data";

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

type PackageRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  promo_price: number | null;
  is_active: boolean;
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);
  const [packagesByVendor, setPackagesByVendor] = useState<Record<string, PackageRow[]>>({});
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [editingPkgId, setEditingPkgId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ price: "", promo_price: "" });
  const [savingPkgId, setSavingPkgId] = useState<string | null>(null);
  const [pkgErrorMsg, setPkgErrorMsg] = useState("");

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

  async function fetchPackagesForVendor(vendorId: string) {
    setLoadingPackages(true);
    setPkgErrorMsg("");
    const { data, error } = await supabase
      .from("packages")
      .select("id, name, description, price, promo_price, is_active")
      .eq("vendor_id", vendorId)
      .order("price");

    if (error) {
      setPkgErrorMsg("Gagal ambil paket: " + error.message);
    } else {
      setPackagesByVendor((prev) => ({ ...prev, [vendorId]: data || [] }));
    }
    setLoadingPackages(false);
  }

  function handleToggleExpand(vendorId: string) {
    if (expandedVendorId === vendorId) {
      setExpandedVendorId(null);
      return;
    }
    setExpandedVendorId(vendorId);
    setEditingPkgId(null);
    if (!packagesByVendor[vendorId]) {
      fetchPackagesForVendor(vendorId);
    }
  }

  function startEditPackage(pkg: PackageRow) {
    setEditingPkgId(pkg.id);
    setEditDraft({
      price: String(pkg.price),
      promo_price: pkg.promo_price != null ? String(pkg.promo_price) : "",
    });
    setPkgErrorMsg("");
  }

  async function handleSavePackage(vendorId: string, pkgId: string) {
    const priceNum = Number(editDraft.price);
    const promoNum = editDraft.promo_price.trim() === "" ? null : Number(editDraft.promo_price);

    if (!editDraft.price || isNaN(priceNum) || priceNum <= 0) {
      setPkgErrorMsg("Harga harus diisi dengan angka yang benar");
      return;
    }
    if (promoNum != null && (isNaN(promoNum) || promoNum <= 0)) {
      setPkgErrorMsg("Harga promo harus berupa angka yang benar, atau kosongkan kalau tidak ada promo");
      return;
    }
    if (promoNum != null && promoNum >= priceNum) {
      setPkgErrorMsg("Harga promo harus lebih kecil dari harga asli");
      return;
    }

    setSavingPkgId(pkgId);
    setPkgErrorMsg("");

    const { error } = await supabase
      .from("packages")
      .update({ price: priceNum, promo_price: promoNum })
      .eq("id", pkgId);

    if (error) {
      setPkgErrorMsg("Gagal simpan perubahan: " + error.message);
      setSavingPkgId(null);
      return;
    }

    await fetchPackagesForVendor(vendorId);
    setEditingPkgId(null);
    setSavingPkgId(null);
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
            const isExpanded = expandedVendorId === v.id;
            const vendorPackages = packagesByVendor[v.id] || [];

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

                <div className="flex gap-2 flex-wrap">
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

                  <button
                    onClick={() => handleToggleExpand(v.id)}
                    className="flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 px-4 rounded-xl border border-[#D4EAC8] text-[#4A7A6D] hover:border-[#1CABB4] hover:text-[#1CABB4] transition-colors"
                  >
                    <Package size={14} />
                    Kelola Paket
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#EAF5E4] space-y-3">
                    {pkgErrorMsg && (
                      <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-3 py-2">
                        <p className="text-xs text-[#EF4444]">{pkgErrorMsg}</p>
                      </div>
                    )}

                    {loadingPackages ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-5 h-5 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : vendorPackages.length === 0 ? (
                      <p className="text-center text-xs text-[#8ABDB5] py-6 bg-[#F0FBF5] rounded-xl">Vendor ini belum punya paket layanan</p>
                    ) : (
                      vendorPackages.map((pkg) => {
                        const isEditing = editingPkgId === pkg.id;
                        const hasPromo = pkg.promo_price != null && pkg.promo_price < pkg.price;

                        return (
                          <div key={pkg.id} className="bg-[#F0FBF5] rounded-xl p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#1A3A3C]">{pkg.name}</p>
                                {pkg.description && <p className="text-xs text-[#8ABDB5] mt-0.5">{pkg.description}</p>}
                              </div>
                              {!isEditing && (
                                <div className="text-right flex-shrink-0">
                                  {hasPromo ? (
                                    <>
                                      <p className="text-[10px] text-[#8ABDB5] line-through">{formatPrice(pkg.price)}</p>
                                      <p className="text-sm font-extrabold text-[#EF4444]">{formatPrice(pkg.promo_price!)}</p>
                                    </>
                                  ) : (
                                    <p className="text-sm font-extrabold text-[#1CABB4]">{formatPrice(pkg.price)}</p>
                                  )}
                                </div>
                              )}
                            </div>

                            {isEditing ? (
                              <div className="space-y-2 mt-2">
                                <div>
                                  <label className="text-[10px] font-semibold text-[#4A7A6D] block mb-1">Harga Asli</label>
                                  <input
                                    type="number"
                                    value={editDraft.price}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, price: e.target.value }))}
                                    className="w-full border border-[#D4EAC8] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1CABB4] bg-white"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-semibold text-[#4A7A6D] block mb-1">Harga Promo (opsional)</label>
                                  <input
                                    type="number"
                                    placeholder="Kosongkan kalau tidak ada promo"
                                    value={editDraft.promo_price}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, promo_price: e.target.value }))}
                                    className="w-full border border-[#D4EAC8] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1CABB4] bg-white"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSavePackage(v.id, pkg.id)}
                                    disabled={savingPkgId === pkg.id}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#1CABB4] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#178E96] transition-colors disabled:opacity-60"
                                  >
                                    {savingPkgId === pkg.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                    Simpan
                                  </button>
                                  <button
                                    onClick={() => setEditingPkgId(null)}
                                    className="flex-1 text-xs font-semibold text-[#8ABDB5] border border-[#D4EAC8] py-2 rounded-lg hover:bg-white transition-colors"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditPackage(pkg)}
                                className="text-xs font-semibold text-[#1CABB4] hover:underline mt-1"
                              >
                                Edit harga & promo
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}