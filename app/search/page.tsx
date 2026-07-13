"use client";
import { useState, useEffect, Suspense } from "react";
import { SlidersHorizontal, X, Search, ChevronDown, Star, MapPin, BadgeCheck, Heart } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categories, formatPrice } from "@/data";
import { useWishlist } from "@/lib/useWishlist";
import { listVendorsForSearch, VendorSearchResult } from "@/lib/vendors";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReviewForm from "@/components/ReviewForm";

const SORT_OPTIONS = [
  { value: "popular", label: "Terpopuler" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "rating", label: "Rating Terbaik" },
];

const LOCATIONS = ["Semua Lokasi", "Yogyakarta", "Jakarta", "Bandung", "Semarang"];
const BUDGETS = [
  { label: "Semua Budget", min: 0, max: Infinity },
  { label: "< Rp2.000.000", min: 0, max: 2000000 },
  { label: "Rp2jt – Rp5jt", min: 2000000, max: 5000000 },
  { label: "Rp5jt – Rp10jt", min: 5000000, max: 10000000 },
  { label: "> Rp10.000.000", min: 10000000, max: Infinity },
];

function VendorListCard({ vendor }: { vendor: VendorSearchResult }) {
  const { toggle, isWished } = useWishlist();
  const categoryLabel = categories.find(c => c.id === vendor.category_id)?.name || "Vendor";
  const image = vendor.cover_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop";

  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(28,171,180,0.13)] transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full h-48 md:w-56 md:h-auto md:flex-shrink-0 overflow-hidden">
          <img src={image} alt={vendor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className="absolute top-3 left-3 bg-[#1CABB4] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            {categoryLabel}
          </span>
          <button onClick={e => { e.preventDefault(); toggle(vendor.id); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
            <Heart size={15} className={isWished(vendor.id) ? "fill-[#EF4444] text-[#EF4444]" : "text-[#8ABDB5]"} />
          </button>
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <h3 className="font-bold text-[#1A3A3C] text-base leading-tight">{vendor.name}</h3>
                <BadgeCheck size={15} className="text-[#1CABB4] flex-shrink-0" />
              </div>
              {vendor.reviewCount > 0 && (
                <div className="flex items-center gap-1 bg-[#FFFBEB] border border-[#F59E0B]/20 rounded-lg px-2 py-1 flex-shrink-0">
                  <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
                  <span className="text-xs font-bold text-[#1A3A3C]">{vendor.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#8ABDB5] mb-2">
              <MapPin size={11} />
              <span>{vendor.location || "-"}</span>
              {vendor.reviewCount > 0 && <span>· {vendor.reviewCount} ulasan</span>}
            </div>
            <p className="text-sm text-[#4A7A6D] leading-relaxed line-clamp-2 mb-3">
              {vendor.description || "Vendor ini belum menambahkan deskripsi."}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EAF5E4]">
            <div>
              <p className="text-[11px] text-[#8ABDB5]">Mulai dari</p>
              <p className="text-base font-extrabold text-[#1CABB4]">
                {vendor.minPrice > 0 ? formatPrice(vendor.minPrice) : "Belum ada paket"}
              </p>
            </div>
            <Link href={`/store/${vendor.id}`}
              className="bg-[#1CABB4] hover:bg-[#178E96] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              Lihat Paket
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string[]>(() => {
    const cat = searchParams.get("cat");
    return cat ? [cat] : [];
  });
  const [selectedBudget, setSelectedBudget] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("Semua Lokasi");
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [testimonialsKey, setTestimonialsKey] = useState(0);

  const [vendors, setVendors] = useState<VendorSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setSelectedCat([cat]);
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    async function fetchVendors() {
      setLoading(true);
      const data = await listVendorsForSearch({
        categoryId: selectedCat[0],
        location: selectedLocation !== "Semua Lokasi" ? selectedLocation : undefined,
        search: search || undefined,
      });
      setVendors(data);
      setLoading(false);
    }
    fetchVendors();
  }, [selectedCat, selectedLocation, search]);

  const budget = BUDGETS[selectedBudget];
  let filtered = vendors.filter(v => {
    if (v.minPrice > 0 && (v.minPrice < budget.min || v.minPrice > budget.max)) return false;
    if (minRating > 0 && v.rating < minRating) return false;
    return true;
  });

  filtered = [...filtered];
  if (sort === "price_asc") filtered.sort((a, b) => (a.minPrice || Infinity) - (b.minPrice || Infinity));
  if (sort === "price_desc") filtered.sort((a, b) => b.minPrice - a.minPrice);
  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  if (sort === "popular") filtered.sort((a, b) => b.reviewCount - a.reviewCount);

  const resetFilters = () => { setSelectedCat([]); setSelectedBudget(0); setSelectedLocation("Semua Lokasi"); setMinRating(0); setSearch(""); };
  const activeFilterCount = selectedCat.length + (selectedBudget > 0 ? 1 : 0) + (selectedLocation !== "Semua Lokasi" ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8">
      <div className="text-xs text-[#8ABDB5] flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#1CABB4]">Beranda</Link>
        <span>/</span>
        <span className="text-[#1A3A3C] font-medium">Cari Vendor</span>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-3 flex items-center gap-2 flex-wrap md:flex-nowrap">
        <div className="relative">
          <select value={selectedCat[0] || ""} onChange={e => setSelectedCat(e.target.value ? [e.target.value] : [])}
            className="appearance-none bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-3 pr-8 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] cursor-pointer min-w-[160px]">
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ABDB5] pointer-events-none" />
        </div>
        <div className="relative">
          <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}
            className="appearance-none bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-3 pr-8 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] cursor-pointer min-w-[140px]">
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ABDB5] pointer-events-none" />
        </div>
        <div className="relative">
          <select value={selectedBudget} onChange={e => setSelectedBudget(Number(e.target.value))}
            className="appearance-none bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-3 pr-8 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] cursor-pointer min-w-[160px]">
            {BUDGETS.map((b, i) => <option key={i} value={i}>{b.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ABDB5] pointer-events-none" />
        </div>
        <div className="flex-1 flex items-center gap-2 bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 min-w-[160px]">
          <Search size={14} className="text-[#8ABDB5] flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari vendor..."
            className="flex-1 text-sm text-[#1A3A3C] bg-transparent outline-none placeholder:text-[#8ABDB5]" />
          {search && <button onClick={() => setSearch("")}><X size={13} className="text-[#8ABDB5]" /></button>}
        </div>
        <button onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 bg-[#1CABB4] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#178E96] transition-colors whitespace-nowrap flex-shrink-0">
          <SlidersHorizontal size={14} />
          Filter {activeFilterCount > 0 && <span className="bg-white text-[#1CABB4] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="flex gap-5">
        <aside className={`fixed inset-0 z-40 md:relative md:inset-auto md:block md:w-56 flex-shrink-0 ${filterOpen ? "block" : "hidden md:block"}`}>
          <div className="md:hidden absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-4 md:sticky md:top-24 overflow-y-auto max-h-[calc(100vh-6rem)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1A3A3C] text-sm">Filter</h3>
              <div className="flex gap-2">
                {activeFilterCount > 0 && <button onClick={resetFilters} className="text-xs text-[#1CABB4] font-semibold">Reset</button>}
                <button onClick={() => setFilterOpen(false)} className="md:hidden"><X size={16} className="text-[#4A7A6D]" /></button>
              </div>
            </div>
            <div className="mb-5">
              <h4 className="text-xs font-bold text-[#1A3A3C] mb-2.5 uppercase tracking-wide">Kategori</h4>
              <div className="space-y-1.5">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group py-1">
                    <input type="checkbox" checked={selectedCat.includes(cat.id)}
                      onChange={e => setSelectedCat(e.target.checked ? [cat.id] : [])}
                      className="w-4 h-4 rounded accent-[#1CABB4]" />
                    <span className="text-xs text-[#4A7A6D] group-hover:text-[#1CABB4] transition-colors flex-1">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <h4 className="text-xs font-bold text-[#1A3A3C] mb-2.5 uppercase tracking-wide">Lokasi</h4>
              <div className="space-y-1.5">
                {LOCATIONS.map(loc => (
                  <button key={loc} onClick={() => setSelectedLocation(loc)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors ${selectedLocation === loc ? "bg-[#E8F8F9] text-[#1CABB4] font-semibold" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <h4 className="text-xs font-bold text-[#1A3A3C] mb-2.5 uppercase tracking-wide">Budget</h4>
              <div className="space-y-1.5">
                {BUDGETS.map((b, i) => (
                  <button key={i} onClick={() => setSelectedBudget(i)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors ${selectedBudget === i ? "bg-[#E8F8F9] text-[#1CABB4] font-semibold" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1A3A3C] mb-2.5 uppercase tracking-wide">Rating</h4>
              <div className="space-y-1.5">
                {[0, 4.5, 4.0, 3.5].map(r => (
                  <button key={r} onClick={() => setMinRating(r)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${minRating === r ? "bg-[#E8F8F9] text-[#1CABB4] font-semibold" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                    <Star size={11} fill="#F59E0B" className="text-[#F59E0B]" />
                    <span>{r > 0 ? `${r}+` : "Semua Rating"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center justify-between gap-3">
            <span className="text-sm text-[#4A7A6D] whitespace-nowrap">
              Menampilkan <span className="font-bold text-[#1A3A3C]">{filtered.length}</span> vendor
              {selectedCat.length > 0 && (
                <span className="ml-1 text-[#1CABB4] font-semibold">
                  · {categories.find(c => c.id === selectedCat[0])?.name}
                </span>
              )}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setSort(opt.value)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${sort === opt.value ? "bg-[#1CABB4] text-white" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.length > 0
                ? filtered.map(v => <VendorListCard key={v.id} vendor={v} />)
                : (
                  <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-bold text-[#1A3A3C] mb-2">Vendor tidak ditemukan</h3>
                    <p className="text-sm text-[#8ABDB5]">Coba ubah filter atau kata kunci pencarian</p>
                    <button onClick={resetFilters} className="mt-5 bg-[#1CABB4] text-white font-semibold px-5 py-2.5 rounded-2xl hover:bg-[#178E96] transition-colors">
                      Reset Filter
                    </button>
                  </div>
                )}
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
            <div className="mb-5">
              <h2 className="font-bold text-lg text-[#1A3A3C]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Kata Mereka</h2>
              <p className="text-xs text-[#8ABDB5] mt-0.5">Pengalaman nyata dari pengguna Festara</p>
            </div>
            <TestimonialsSection key={testimonialsKey} />
            <div className="mt-6">
              <ReviewForm onSubmitted={() => setTestimonialsKey((k) => k + 1)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}