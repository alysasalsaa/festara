"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, BadgeCheck, MessageCircle, Heart, Share2, ChevronLeft, ChevronRight, Check, Camera } from "lucide-react";
import { formatPrice, categories } from "@/data";
import { useAuth } from "@/lib/useAuth";
import { useWishlist } from "@/lib/useWishlist";
import { getVendorById, SupabaseVendor } from "@/lib/vendors";
import { getPortfolioImages, PortfolioImage } from "@/lib/sellerVendor";
import { supabase } from "@/lib/supabase";
import LoginPromptModal from "@/components/LoginPromptModal";

const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

function MiniCalendar({ onSelect }: { onSelect?: (date: string) => void }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selected, setSelected] = useState<number | null>(null);
  const bookedDays = [3, 7, 14, 21, 28];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const handleSelect = (day: number) => {
    setSelected(day);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onSelect?.(dateStr);
  };
  return (
    <div className="bg-white rounded-2xl border border-[#D4EAC8] p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0FBF5]"><ChevronLeft size={15} /></button>
        <span className="text-sm font-bold text-[#1A3A3C]">{MONTHS[month]} {year}</span>
        <button onClick={next} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F0FBF5]"><ChevronRight size={15} /></button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-[#8ABDB5] py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isBooked = bookedDays.includes(day);
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isSel = selected === day;
          return (
            <button key={day} onClick={() => !isBooked && handleSelect(day)}
              className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-colors
                ${isBooked ? "bg-[#FEE2E2] text-[#EF4444] cursor-not-allowed" :
                  isSel ? "bg-[#1CABB4] text-white font-bold" :
                  isToday ? "border-2 border-[#1CABB4] text-[#1CABB4] font-bold" :
                  "hover:bg-[#E8F8F9] text-[#1A3A3C]"}`}>
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#EAF5E4]">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#FEE2E2]" /><span className="text-[10px] text-[#8ABDB5]">Tidak tersedia</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-[#1CABB4]" /><span className="text-[10px] text-[#8ABDB5]">Dipilih</span></div>
      </div>
    </div>
  );
}

const TABS = ["Profil", "Paket", "Portofolio", "Ulasan", "Ketersediaan"];

type VendorReview = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  buyer_name: string;
  buyer_avatar: string | null;
};

export default function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toggle, isWished } = useWishlist();

  const [vendor, setVendor] = useState<SupabaseVendor | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);

  const [tab, setTab] = useState("Profil");
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [packages, setPackages] = useState<{ id: string; name: string; description: string | null; price: number; is_popular: boolean }[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>([]);
  const [reviews, setReviews] = useState<VendorReview[]>([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    async function fetchVendor() {
      const v = await getVendorById(id);
      setVendor(v);
      setVendorLoading(false);
    }
    fetchVendor();
  }, [id]);

  useEffect(() => {
    if (!vendor) return;

    async function fetchPackages() {
      const { data } = await supabase
        .from("packages")
        .select("id, name, description, price, is_popular")
        .eq("vendor_id", vendor!.id)
        .eq("is_active", true)
        .order("price");
      setPackages(data || []);
    }

    async function fetchPortfolio() {
      const images = await getPortfolioImages(vendor!.id);
      setPortfolio(images);
    }

    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, buyer_id")
        .eq("vendor_id", vendor!.id)
        .order("created_at", { ascending: false });

      if (error || !data) {
        setReviews([]);
        setAvgRating(0);
        return;
      }

      const buyerIds = [...new Set(data.map(r => r.buyer_id))];
      let buyerMap: Record<string, { full_name: string; avatar_url: string | null }> = {};
      if (buyerIds.length > 0) {
        const { data: usersData } = await supabase
          .from("users")
          .select("id, full_name, avatar_url")
          .in("id", buyerIds);
        buyerMap = Object.fromEntries((usersData || []).map(u => [u.id, u]));
      }

      const mapped: VendorReview[] = data.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        buyer_name: buyerMap[r.buyer_id]?.full_name || "Pengguna Festara",
        buyer_avatar: buyerMap[r.buyer_id]?.avatar_url || null,
      }));

      setReviews(mapped);
      if (mapped.length > 0) {
        setAvgRating(mapped.reduce((sum, r) => sum + r.rating, 0) / mapped.length);
      } else {
        setAvgRating(0);
      }
    }

    fetchPackages();
    fetchPortfolio();
    fetchReviews();
  }, [vendor]);

  if (vendorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-bold text-[#1A3A3C] mb-2">Vendor tidak ditemukan</p>
        <p className="text-sm text-[#8ABDB5] mb-6">Vendor yang kamu cari mungkin sudah tidak tersedia.</p>
        <Link href="/search" className="text-[#1CABB4] font-semibold hover:underline">Kembali ke pencarian</Link>
      </div>
    );
  }

  const categoryLabel = categories.find(c => c.id === vendor.category_id)?.name || "Vendor";
  const coverImage = vendor.cover_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop";
  const logoImage = vendor.logo_url || "https://api.dicebear.com/7.x/shapes/svg?seed=" + vendor.id;

  const goToChat = () => {
    if (!user) { setShowLoginModal(true); return; }
    router.push(`/chat?vendor=${vendor.id}`);
  };
  const handleDateSelect = (date: string) => {
  setSelectedDate(date);
  if (!user) { setTimeout(() => setShowLoginModal(true), 300); return; }
  setTimeout(() => router.push(`/chat?vendor=${vendor.id}&date=${date}`), 500);
};

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}

      {/* Cover */}
      <div className="relative rounded-3xl overflow-hidden h-44 md:h-60 mb-0">
        <img src={coverImage} alt={vendor.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <Link href="/search" className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1A3A3C] flex items-center gap-1.5 hover:bg-white transition-colors">
          <ChevronLeft size={13} /> Kembali
        </Link>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => toggle(vendor.id)}
            className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white transition-colors">
            <Heart size={16} className={isWished(vendor.id) ? "fill-[#EF4444] text-[#EF4444]" : "text-[#4A7A6D]"} />
          </button>
          <button className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white transition-colors">
            <Share2 size={16} className="text-[#4A7A6D]" />
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-5 mb-5 -mt-10 relative z-10 mx-2">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0 -mt-10 bg-white">
              <img src={logoImage} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 pt-1 md:hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-lg text-[#1A3A3C] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{vendor.name}</h1>
                <BadgeCheck size={18} className="text-[#1CABB4] flex-shrink-0" />
              </div>
              <div className="flex items-center gap-3 flex-wrap mt-2.5 text-xs text-[#4A7A6D] leading-none">
                <span className="inline-flex items-center bg-[#E8F8F9] text-[#1CABB4] font-semibold px-2.5 py-1 rounded-full leading-none">{categoryLabel}</span>
                <div className="inline-flex items-center gap-1 leading-none"><MapPin size={11} className="flex-shrink-0" />{vendor.location || "-"}</div>
                {reviews.length > 0 && (
                  <div className="inline-flex items-center gap-1 leading-none">
                    <Star size={11} fill="#F59E0B" className="text-[#F59E0B]" />
                    <span className="font-semibold text-[#1A3A3C]">{avgRating.toFixed(1)}</span>
                    <span>({reviews.length} ulasan)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 pt-1 hidden md:block">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-lg text-[#1A3A3C] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{vendor.name}</h1>
              <BadgeCheck size={18} className="text-[#1CABB4] flex-shrink-0" />
            </div>
            <div className="flex items-center gap-3 flex-wrap mt-2.5 text-xs text-[#4A7A6D] leading-none">
              <span className="inline-flex items-center bg-[#E8F8F9] text-[#1CABB4] font-semibold px-2.5 py-1 rounded-full leading-none">{categoryLabel}</span>
              <div className="inline-flex items-center gap-1 leading-none"><MapPin size={11} className="flex-shrink-0" />{vendor.location || "-"}</div>
              {reviews.length > 0 && (
                <div className="inline-flex items-center gap-1 leading-none">
                  <Star size={11} fill="#F59E0B" className="text-[#F59E0B]" />
                  <span className="font-semibold text-[#1A3A3C]">{avgRating.toFixed(1)}</span>
                  <span>({reviews.length} ulasan)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
            <button onClick={goToChat} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-semibold border border-[#D4EAC8] text-[#4A7A6D] hover:border-[#1CABB4] hover:text-[#1CABB4] px-3 py-2.5 rounded-xl transition-colors">
              <MessageCircle size={13} /> Chat
            </button>
            <button onClick={goToChat} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 text-xs font-bold bg-[#1CABB4] text-white px-4 py-2.5 rounded-xl hover:bg-[#178E96] transition-colors">
              Booking Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-5 flex overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3.5 text-sm font-semibold whitespace-nowrap px-4 transition-colors ${tab === t ? "text-[#1CABB4] border-b-2 border-[#1CABB4] bg-[#E8F8F9]/60" : "text-[#8ABDB5] hover:text-[#4A7A6D]"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* TAB: Profil */}
      {tab === "Profil" && (
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              <h2 className="font-bold text-[#1A3A3C] mb-3">Tentang Kami</h2>
              <p className="text-sm text-[#4A7A6D] leading-relaxed mb-4">{vendor.description || "Vendor ini belum menambahkan deskripsi."}</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              <h2 className="font-bold text-[#1A3A3C] mb-1">Pilih Tanggal Acara</h2>
              <p className="text-xs text-[#8ABDB5] mb-3">Klik tanggal → langsung ke booking</p>
              <MiniCalendar onSelect={handleDateSelect} />
              {selectedDate && <p className="text-xs text-center text-[#1CABB4] font-semibold mt-2 animate-pulse">{user ? "Mengarahkan ke booking..." : "Silakan login dulu..."}</p>}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Paket */}
      {tab === "Paket" && (
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-[#1A3A3C]">Pilihan Paket Harga</h2>
            {packages.length === 0 ? (
              <p className="text-center text-sm text-[#8ABDB5] py-10 bg-white rounded-2xl">Vendor ini belum menambahkan paket layanan.</p>
            ) : (
              packages.map((pkg, i) => (
                <div key={pkg.id} onClick={() => setSelectedPkg(i)}
                  className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 cursor-pointer border-2 transition-all ${selectedPkg === i ? "border-[#1CABB4]" : "border-transparent hover:border-[#DBEBC9]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#1A3A3C]">{pkg.name}</h3>
                        {pkg.is_popular && <span className="text-[10px] bg-[#1CABB4] text-white font-bold px-2 py-0.5 rounded-full">Terpopuler</span>}
                      </div>
                      <p className="text-sm text-[#4A7A6D]">{pkg.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-[#1CABB4] text-lg">{formatPrice(pkg.price)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {selectedPkg !== null && packages[selectedPkg] && (
              <button onClick={goToChat} className="w-full bg-[#1CABB4] text-white font-bold text-center py-3.5 rounded-2xl hover:bg-[#178E96] transition-colors">
                Booking {packages[selectedPkg].name} — Pilih Tanggal
              </button>
            )}
          </div>
          <div>
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              <h2 className="font-bold text-[#1A3A3C] mb-1">Pilih Tanggal Acara</h2>
              <MiniCalendar onSelect={handleDateSelect} />
            </div>
          </div>
        </div>
      )}

      {/* TAB: Portofolio — data asli dari Supabase */}
      {tab === "Portofolio" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Camera size={18} className="text-[#1CABB4]" />
            <h2 className="font-bold text-[#1A3A3C]">Portofolio ({portfolio.length} karya)</h2>
          </div>
          {portfolio.length === 0 ? (
            <p className="text-center text-sm text-[#8ABDB5] py-16 bg-white rounded-2xl">Vendor ini belum menambahkan portofolio.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {portfolio.map((img) => (
                <div key={img.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Ulasan — data asli dari Supabase */}
      {tab === "Ulasan" && (
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              {reviews.length === 0 ? (
                <p className="text-center text-sm text-[#8ABDB5] py-10">Belum ada ulasan untuk vendor ini.</p>
              ) : (
                <>
                  <div className="flex items-center gap-6 mb-5">
                    <div className="text-center">
                      <div className="text-4xl font-extrabold text-[#1CABB4]">{avgRating.toFixed(1)}</div>
                      <div className="flex gap-0.5 mt-1 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} fill={i < Math.round(avgRating) ? "#F59E0B" : "transparent"} className={i < Math.round(avgRating) ? "text-[#F59E0B]" : "text-[#EAF5E4]"} />
                        ))}
                      </div>
                      <p className="text-xs text-[#8ABDB5] mt-1">{reviews.length} ulasan</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="flex gap-3 pb-4 border-b border-[#EAF5E4] last:border-0">
                        <img
                          src={r.buyer_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.buyer_name}`}
                          alt={r.buyer_name}
                          className="w-10 h-10 rounded-full bg-[#E8F8F9] flex-shrink-0 object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-[#1A3A3C]">{r.buyer_name}</span>
                            <span className="text-xs text-[#8ABDB5]">
                              {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <div className="flex gap-0.5 mb-1.5">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star key={j} size={11} fill="#F59E0B" className="text-[#F59E0B]" />
                            ))}
                          </div>
                          <p className="text-sm text-[#4A7A6D] leading-relaxed">{r.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB: Ketersediaan */}
      {tab === "Ketersediaan" && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
            <h2 className="font-bold text-[#1A3A3C] mb-1">Pilih Tanggal Acara</h2>
            <MiniCalendar onSelect={handleDateSelect} />
            {selectedDate && <p className="text-xs text-center text-[#1CABB4] font-semibold mt-2 animate-pulse">{user ? "Mengarahkan ke booking..." : "Silakan login dulu..."}</p>}
          </div>
        </div>
      )}
    </div>
  );
}