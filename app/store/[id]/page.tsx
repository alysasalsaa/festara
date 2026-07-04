"use client";
import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, BadgeCheck, MessageCircle, Heart, Share2, ChevronLeft, ChevronRight, Check, Camera } from "lucide-react";
import { vendors, formatPrice } from "@/data";
import { useAuth } from "@/lib/useAuth";
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

const PACKAGES = [
  { name: "Paket Basic", desc: "Dokumentasi 1 hari | 3 fotografer | 100 foto editing", price: 3500000, popular: false },
  { name: "Paket Silver", desc: "Dokumentasi 1 hari | 5 fotografer | 200 foto + album", price: 5500000, popular: true },
  { name: "Paket Premium", desc: "Dokumentasi 2 hari | 7 fotografer | 300 foto + video", price: 9000000, popular: false },
];

const PORTFOLIO_IMGS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583939411023-14783179e581?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop",
];

const REVIEWS = [
  { name: "Dewi Santika", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dewi", rating: 5, date: "20 Jun 2025", comment: "Hasilnya luar biasa! Foto-foto sangat natural dan elegan. Tim sangat profesional dan ramah selama sesi foto." },
  { name: "Budi Prasetyo", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi", rating: 5, date: "12 Jun 2025", comment: "Sangat puas! Prewedding kami terasa seperti di majalah. Highly recommended buat yang cari fotografer profesional." },
  { name: "Anita Lestari", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anita", rating: 4, date: "5 Jun 2025", comment: "Hasilnya bagus, komunikasi responsif. Hanya sedikit terlambat di hari H tapi overall memuaskan." },
];

export default function VendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const vendor = vendors.find(v => v.id === id) || vendors[0];
  const [tab, setTab] = useState("Profil");
  const [wished, setWished] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleBooking = () => {
    if (!user) { setShowLoginModal(true); return; }
    router.push("/chat");
  };

  const handleChat = () => {
    if (!user) { setShowLoginModal(true); return; }
    router.push("/chat");
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (!user) { setTimeout(() => setShowLoginModal(true), 300); return; }
    setTimeout(() => router.push("/chat"), 500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      {showLoginModal && <LoginPromptModal onClose={() => setShowLoginModal(false)} />}

      {/* Cover */}
      <div className="relative rounded-3xl overflow-hidden h-44 md:h-60 mb-0">
        <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <Link href="/search" className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1A3A3C] flex items-center gap-1.5 hover:bg-white transition-colors">
          <ChevronLeft size={13} /> Kembali
        </Link>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setWished(!wished)} className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white transition-colors">
            <Heart size={16} className={wished ? "fill-[#EF4444] text-[#EF4444]" : "text-[#4A7A6D]"} />
          </button>
          <button className="w-9 h-9 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white transition-colors">
            <Share2 size={16} className="text-[#4A7A6D]" />
          </button>
        </div>
      </div>

      {/* Vendor Header Card */}
      <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-5 mb-5 -mt-10 relative z-10 mx-2">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0 -mt-10 bg-white">
            <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-extrabold text-lg text-[#1A3A3C] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{vendor.name}</h1>
              {vendor.isVerified && <BadgeCheck size={18} className="text-[#1CABB4]" />}
            </div>
            <div className="flex items-center gap-3 flex-wrap mt-1 text-xs text-[#4A7A6D]">
              <span className="bg-[#E8F8F9] text-[#1CABB4] font-semibold px-2.5 py-0.5 rounded-full">{vendor.categoryLabel}</span>
              <div className="flex items-center gap-1"><MapPin size={11} />{vendor.location}</div>
              <div className="flex items-center gap-1"><Star size={11} fill="#F59E0B" className="text-[#F59E0B]" /><span className="font-semibold text-[#1A3A3C]">{vendor.rating}</span><span>({vendor.reviewCount} ulasan)</span></div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={handleChat} className="flex items-center gap-1.5 text-xs font-semibold border border-[#D4EAC8] text-[#4A7A6D] hover:border-[#1CABB4] hover:text-[#1CABB4] px-3 py-2 rounded-xl transition-colors">
              <MessageCircle size={13} /> Chat
            </button>
            <button onClick={handleBooking} className="flex items-center gap-1.5 text-xs font-bold bg-[#1CABB4] text-white px-4 py-2 rounded-xl hover:bg-[#178E96] transition-colors">
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
              <p className="text-sm text-[#4A7A6D] leading-relaxed mb-4">{vendor.description} Kami berkomitmen memberikan dokumentasi terbaik untuk momen spesial Anda dengan sentuhan artistik dan profesional.</p>
              <div className="space-y-2">
                {["Fotografer berpengalaman lebih dari 5 tahun", "Peralatan kamera profesional terkini", "Edit foto natural & cinematic", "Pengiriman hasil tepat waktu"].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-[#4A7A6D]">
                    <div className="w-5 h-5 rounded-full bg-[#E8F8F9] flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-[#1CABB4]" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              <h2 className="font-bold text-[#1A3A3C] mb-3">Spesialisasi</h2>
              <div className="flex flex-wrap gap-2">
                {vendor.tags.map(tag => (
                  <span key={tag} className="text-sm bg-[#E8F8F9] text-[#1CABB4] font-medium px-3 py-1.5 rounded-xl">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              <h2 className="font-bold text-[#1A3A3C] mb-1">Pilih Tanggal Acara</h2>
              <p className="text-xs text-[#8ABDB5] mb-3">Klik tanggal → langsung ke booking</p>
              <MiniCalendar onSelect={handleDateSelect} />
              {selectedDate && (
                <p className="text-xs text-center text-[#1CABB4] font-semibold mt-2 animate-pulse">
                  {user ? "Mengarahkan ke booking..." : "Silakan login dulu..."}
                </p>
              )}
            </div>
            <div className="bg-gradient-to-br from-[#E8F8F9] to-[#F5FAF0] rounded-2xl p-4 border border-[#DBEBC9]">
              <p className="text-xs text-[#4A7A6D] mb-1">Mulai dari</p>
              <p className="text-xl font-extrabold text-[#1CABB4] mb-3">{formatPrice(vendor.price)}</p>
              <button onClick={handleBooking} className="w-full bg-[#1CABB4] text-white text-sm font-bold text-center py-3 rounded-xl hover:bg-[#178E96] transition-colors">
                Booking Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Paket */}
      {tab === "Paket" && (
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-[#1A3A3C]">Pilihan Paket Harga</h2>
            {PACKAGES.map((pkg, i) => (
              <div key={i} onClick={() => setSelectedPkg(i)}
                className={`bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 cursor-pointer border-2 transition-all ${selectedPkg === i ? "border-[#1CABB4]" : "border-transparent hover:border-[#DBEBC9]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#1A3A3C]">{pkg.name}</h3>
                      {pkg.popular && <span className="text-[10px] bg-[#1CABB4] text-white font-bold px-2 py-0.5 rounded-full">Terpopuler</span>}
                    </div>
                    <p className="text-sm text-[#4A7A6D]">{pkg.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-[#1CABB4] text-lg">{formatPrice(pkg.price)}</p>
                    <div className={`w-5 h-5 rounded-full border-2 mt-2 ml-auto flex items-center justify-center ${selectedPkg === i ? "bg-[#1CABB4] border-[#1CABB4]" : "border-[#D4EAC8]"}`}>
                      {selectedPkg === i && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {selectedPkg !== null && (
              <button onClick={handleBooking} className="w-full bg-[#1CABB4] text-white font-bold text-center py-3.5 rounded-2xl hover:bg-[#178E96] transition-colors">
                Booking {PACKAGES[selectedPkg].name} — Pilih Tanggal
              </button>
            )}
          </div>
          <div>
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              <h2 className="font-bold text-[#1A3A3C] mb-1">Pilih Tanggal Acara</h2>
              <p className="text-xs text-[#8ABDB5] mb-3">Klik tanggal → langsung ke booking</p>
              <MiniCalendar onSelect={handleDateSelect} />
            </div>
          </div>
        </div>
      )}

      {/* TAB: Portofolio */}
      {tab === "Portofolio" && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Camera size={18} className="text-[#1CABB4]" />
            <h2 className="font-bold text-[#1A3A3C]">Portofolio ({PORTFOLIO_IMGS.length} karya)</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PORTFOLIO_IMGS.map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer">
                <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Ulasan */}
      {tab === "Ulasan" && (
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              <div className="flex items-center gap-6 mb-5">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-[#1CABB4]">{vendor.rating}</div>
                  <div className="flex gap-0.5 mt-1 justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(vendor.rating) ? "#F59E0B" : "transparent"} className={i < Math.floor(vendor.rating) ? "text-[#F59E0B]" : "text-[#EAF5E4]"} />
                    ))}
                  </div>
                  <p className="text-xs text-[#8ABDB5] mt-1">{vendor.reviewCount} ulasan</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-[#8ABDB5] w-3">{star}</span>
                      <Star size={10} fill="#F59E0B" className="text-[#F59E0B]" />
                      <div className="flex-1 bg-[#EAF5E4] rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : 3}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {REVIEWS.map((r, i) => (
                  <div key={i} className="flex gap-3 pb-4 border-b border-[#EAF5E4] last:border-0">
                    <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full bg-[#E8F8F9] flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-[#1A3A3C]">{r.name}</span>
                        <span className="text-xs text-[#8ABDB5]">{r.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-1.5">
                        {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={11} fill="#F59E0B" className="text-[#F59E0B]" />)}
                      </div>
                      <p className="text-sm text-[#4A7A6D] leading-relaxed">{r.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="bg-gradient-to-br from-[#E8F8F9] to-[#F5FAF0] rounded-2xl p-4 border border-[#DBEBC9]">
              <p className="text-xs text-[#4A7A6D] mb-1">Mulai dari</p>
              <p className="text-xl font-extrabold text-[#1CABB4] mb-3">{formatPrice(vendor.price)}</p>
              <button onClick={handleBooking} className="w-full bg-[#1CABB4] text-white text-sm font-bold text-center py-3 rounded-xl hover:bg-[#178E96] transition-colors">
                Booking Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Ketersediaan */}
      {tab === "Ketersediaan" && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
            <h2 className="font-bold text-[#1A3A3C] mb-1">Pilih Tanggal Acara</h2>
            <p className="text-xs text-[#8ABDB5] mb-3">Klik tanggal yang tersedia → langsung ke booking</p>
            <MiniCalendar onSelect={handleDateSelect} />
            {selectedDate && (
              <p className="text-xs text-center text-[#1CABB4] font-semibold mt-2 animate-pulse">
                {user ? "Mengarahkan ke booking..." : "Silakan login dulu..."}
              </p>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
            <h2 className="font-bold text-[#1A3A3C] mb-4">Informasi Ketersediaan</h2>
            <div className="space-y-3">
              {[
                { label: "Hari kerja", value: "Senin – Jumat" },
                { label: "Hari libur", value: "Sabtu & Minggu (tersedia)" },
                { label: "Waktu mulai", value: "07.00 – 17.00 WIB" },
                { label: "Durasi minimal", value: "4 jam" },
                { label: "Booking min.", value: "7 hari sebelum acara" },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-[#EAF5E4]">
                  <span className="text-xs text-[#8ABDB5]">{item.label}</span>
                  <span className="text-xs font-semibold text-[#1A3A3C]">{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleBooking} className="w-full mt-5 bg-[#1CABB4] text-white font-bold text-center py-3 rounded-xl hover:bg-[#178E96] transition-colors">
              Lanjutkan Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}