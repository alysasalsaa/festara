"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { categories } from "@/data";
import { supabase } from "@/lib/supabase";

const SLIDES = [
  {
    title: "Temukan Vendor Acara Terbaik untuk Momen Istimewamu",
    subtitle: "Marketplace terpercaya untuk Wedding, Wisuda, Event, dan Merchandise dengan ribuan vendor profesional di Yogyakarta.",
    bg: "from-[#0D545A] via-[#1CABB4] to-[#DBEBC9]",
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
  },
  {
    title: "Abadikan Momen Berharga Bersama Fotografer Terbaik",
    subtitle: "Fotografer profesional dengan gaya natural, sinematik, dan elegan untuk hari spesialmu.",
    bg: "from-[#178E96] via-[#1CABB4] to-[#C1DC9E]",
    img: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
  },
  {
    title: "Venue Eksklusif untuk Setiap Acara Spesialmu",
    subtitle: "Ballroom mewah hingga garden venue outdoor — temukan tempat sempurna untuk momenmu.",
    bg: "from-[#0F6B72] via-[#1CABB4] to-[#DBEBC9]",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop",
  },
];

const LOCATIONS = ["Semua Lokasi", "Yogyakarta", "Jakarta", "Bandung", "Semarang", "Surabaya", "Bali"];

export default function HeroBanner() {
  const [cur, setCur] = useState(0);
  const [auto, setAuto] = useState(true);
  const [selCat, setSelCat] = useState("");
  const [selLoc, setSelLoc] = useState("");
  const [selDate, setSelDate] = useState("");
  const [selBudget, setSelBudget] = useState("");
  const router = useRouter();

  const [vendorCount, setVendorCount] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const { count } = await supabase
        .from("vendors")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);
      setVendorCount(count ?? 0);

      const { data: reviews } = await supabase.from("reviews").select("rating");
      if (reviews && reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setAvgRating(avg);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCur(p => (p + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, [auto]);

  const prev = () => { setAuto(false); setCur(p => (p - 1 + SLIDES.length) % SLIDES.length); };
  const next = () => { setAuto(false); setCur(p => (p + 1) % SLIDES.length); };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selCat) params.set("cat", selCat);
    if (selLoc) params.set("loc", selLoc);
    if (selDate) params.set("date", selDate);
    if (selBudget) params.set("budget", selBudget);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl mx-4 md:mx-6 mt-4" style={{ minHeight: 440 }}>
      <AnimatePresence mode="wait">
        <motion.div key={cur}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`absolute inset-0 bg-gradient-to-r ${SLIDES[cur].bg}`}>
          <div className="absolute inset-0 overflow-hidden">
            <img src={SLIDES[cur].img} alt="" className="w-full h-full object-cover opacity-20 scale-105" />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div key={cur}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3 leading-tight"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {SLIDES[cur].title}
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-8 leading-relaxed">
              {SLIDES[cur].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {/* Kategori */}
            <div>
              <label className="text-[10px] font-bold text-[#8ABDB5] uppercase tracking-wide block mb-1.5">Kategori</label>
              <div className="relative">
                <select value={selCat} onChange={e => setSelCat(e.target.value)}
                  className="w-full appearance-none bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] cursor-pointer">
                  <option value="">Semua Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ABDB5] pointer-events-none" />
              </div>
            </div>

            {/* Lokasi */}
            <div>
              <label className="text-[10px] font-bold text-[#8ABDB5] uppercase tracking-wide block mb-1.5">Lokasi</label>
              <div className="relative">
                <select value={selLoc} onChange={e => setSelLoc(e.target.value)}
                  className="w-full appearance-none bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] cursor-pointer">
                  {LOCATIONS.map(l => <option key={l} value={l === "Semua Lokasi" ? "" : l}>{l}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ABDB5] pointer-events-none" />
              </div>
            </div>

            {/* Tanggal Acara */}
            <div>
              <label className="text-[10px] font-bold text-[#8ABDB5] uppercase tracking-wide block mb-1.5">Tanggal Acara</label>
              <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)}
                className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
            </div>

            {/* Budget */}
            <div>
              <label className="text-[10px] font-bold text-[#8ABDB5] uppercase tracking-wide block mb-1.5">Budget</label>
              <div className="relative">
                <select value={selBudget} onChange={e => setSelBudget(e.target.value)}
                  className="w-full appearance-none bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] cursor-pointer">
                  <option value="">Semua Budget</option>
                  <option value="0-2000000">{"< Rp 2.000.000"}</option>
                  <option value="2000000-5000000">Rp 2jt – Rp 5jt</option>
                  <option value="5000000-10000000">Rp 5jt – Rp 10jt</option>
                  <option value="10000000-999999999">{"> Rp 10.000.000"}</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ABDB5] pointer-events-none" />
              </div>
            </div>
          </div>

          <button onClick={handleSearch}
            className="w-full bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <Search size={16} /> Cari Vendor
          </button>
        </div>

        <div className="flex items-center gap-4 mt-5 flex-wrap">
          {vendorCount != null && (
            <span className="text-white/70 text-xs font-medium">💍 {vendorCount} Vendor</span>
          )}
          {avgRating != null && (
            <span className="text-white/70 text-xs font-medium">⭐ {avgRating.toFixed(1)} Rating</span>
          )}
          <span className="text-white/70 text-xs font-medium">🔒 Pembayaran Aman</span>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center transition-colors">
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center transition-colors">
        <ChevronRight size={20} className="text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => { setAuto(false); setCur(i); }}
            className={`rounded-full transition-all ${i === cur ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}