"use client";
import { useState, useMemo } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import VendorCard from "@/components/VendorCard";
import { vendors, categories } from "@/data";

const SORT_OPTIONS = [
  { value: "popular", label: "Terpopuler" },
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "rating", label: "Rating Terbaik" },
];

export default function SearchPage() {
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = [...vendors];
    if (selectedCat.length > 0) result = result.filter(v => selectedCat.includes(v.category));
    if (minPrice) result = result.filter(v => v.price >= parseInt(minPrice));
    if (maxPrice) result = result.filter(v => v.price <= parseInt(maxPrice));
    if (minRating > 0) result = result.filter(v => v.rating >= minRating);
    if (search) result = result.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.categoryLabel.toLowerCase().includes(search.toLowerCase()));
    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    if (sort === "popular") result.sort((a, b) => b.reviewCount - a.reviewCount);
    return result;
  }, [selectedCat, minPrice, maxPrice, minRating, sort, search]);

  const resetFilters = () => { setSelectedCat([]); setMinPrice(""); setMaxPrice(""); setMinRating(0); setSearch(""); };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Search bar top */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-3 mb-5 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2">
          <Search size={15} className="text-[#8ABDB5]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari vendor..."
            className="flex-1 text-sm text-[#1A3A3C] bg-transparent outline-none placeholder:text-[#8ABDB5]"
          />
          {search && <button onClick={() => setSearch("")}><X size={14} className="text-[#8ABDB5]" /></button>}
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="md:hidden flex items-center gap-2 text-sm text-[#4A7A6D] border border-[#D4EAC8] rounded-xl px-3 py-2 whitespace-nowrap"
        >
          <SlidersHorizontal size={15} /> Filter
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <aside className={`fixed inset-0 z-40 md:relative md:inset-auto md:block md:w-60 lg:w-64 flex-shrink-0 ${filterOpen ? "block" : "hidden md:block"}`}>
          <div className="md:hidden absolute inset-0 bg-black/40" onClick={() => setFilterOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 h-fit md:sticky md:top-24 overflow-y-auto max-h-[calc(100vh-6rem)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1A3A3C]">Filter</h3>
              <div className="flex gap-2">
                <button onClick={resetFilters} className="text-xs text-[#1CABB4] font-semibold">Reset</button>
                <button onClick={() => setFilterOpen(false)} className="md:hidden"><X size={18} className="text-[#4A7A6D]" /></button>
              </div>
            </div>

            {/* Kategori */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#1A3A3C] mb-3">Kategori</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={selectedCat.includes(cat.id)}
                      onChange={e => setSelectedCat(p => e.target.checked ? [...p, cat.id] : p.filter(c => c !== cat.id))}
                      className="w-4 h-4 rounded accent-[#1CABB4]" />
                    <span className="text-sm text-[#4A7A6D] group-hover:text-[#1CABB4] transition-colors">{cat.icon} {cat.name}</span>
                    <span className="ml-auto text-[10px] text-[#8ABDB5]">{cat.productCount}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Harga */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#1A3A3C] mb-3">Budget</h4>
              <div className="flex gap-2">
                <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" className="flex-1 bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] w-0" />
                <span className="text-[#8ABDB5] self-center">—</span>
                <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" className="flex-1 bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] w-0" />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-sm font-semibold text-[#1A3A3C] mb-3">Rating Minimum</h4>
              <div className="space-y-1.5">
                {[4.5, 4.0, 3.5, 0].map(r => (
                  <button key={r} onClick={() => setMinRating(r)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${minRating === r ? "bg-[#E8F8F9] text-[#1CABB4] font-semibold" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                    <span>{"⭐".repeat(Math.floor(r || 1))}</span>
                    <span>{r > 0 ? `${r}+` : "Semua"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-3 mb-5 flex items-center justify-between gap-3">
            <span className="text-sm text-[#4A7A6D] whitespace-nowrap">
              <span className="font-semibold text-[#1A3A3C]">{filtered.length}</span> vendor ditemukan
            </span>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setSort(opt.value)}
                  className={`text-xs font-medium px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${sort === opt.value ? "bg-[#1CABB4] text-white" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vendor list */}
          <div className="flex flex-col gap-4">
            {filtered.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-[#1A3A3C] mb-2">Vendor tidak ditemukan</h3>
              <p className="text-sm text-[#8ABDB5]">Coba ubah filter atau kata kunci pencarian</p>
              <button onClick={resetFilters} className="mt-5 bg-[#1CABB4] text-white font-semibold px-5 py-2.5 rounded-2xl hover:bg-[#178E96] transition-colors">
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
