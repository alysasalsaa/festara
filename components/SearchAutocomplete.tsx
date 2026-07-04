"use client";
import { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { vendors } from "@/data";

const TRENDING = ["Wedding Organizer Jogja", "Photographer Jakarta", "Venue Bandung", "MUA Semarang"];

export default function SearchAutocomplete({ placeholder = "Cari vendor..." }: { placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  const suggestions = query.length > 1
    ? vendors.filter(v =>
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.categoryLabel.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (q: string) => {
    setQuery(q);
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex bg-white border-2 border-[#D4EAC8] rounded-2xl overflow-hidden focus-within:border-[#1CABB4] focus-within:shadow-[0_0_0_4px_rgba(28,171,180,0.15)] transition-all">
        <div className="flex items-center pl-4">
          <Search size={18} className="text-[#8ABDB5]" />
        </div>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => e.key === "Enter" && go(query)}
          placeholder={placeholder}
          className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-[#1A3A3C] placeholder:text-[#8ABDB5]"
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} className="pr-3">
            <X size={16} className="text-[#8ABDB5]" />
          </button>
        )}
        <button onClick={() => go(query)} className="bg-[#1CABB4] hover:bg-[#178E96] px-5 text-white font-semibold text-sm transition-colors whitespace-nowrap">
          Cari
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_32px_rgba(28,171,180,0.15)] border border-[#D4EAC8] z-50 overflow-hidden">
          {suggestions.length > 0 ? (
            <div>
              <p className="text-[10px] font-bold text-[#8ABDB5] uppercase tracking-wide px-4 pt-3 pb-1">Vendor</p>
              {suggestions.map(v => (
                <button key={v.id} onClick={() => go(v.name)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0FBF5] transition-colors text-left">
                  <img src={v.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A3A3C]">{v.name}</p>
                    <p className="text-xs text-[#8ABDB5]">{v.categoryLabel} · {v.location}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <p className="text-[10px] font-bold text-[#8ABDB5] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <TrendingUp size={11} /> Pencarian Populer
              </p>
              {TRENDING.map(t => (
                <button key={t} onClick={() => go(t)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-[#F0FBF5] transition-colors text-left">
                  <Search size={13} className="text-[#8ABDB5]" />
                  <span className="text-sm text-[#4A7A6D]">{t}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}