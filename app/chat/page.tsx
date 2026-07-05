"use client";
import { useState, useEffect, Suspense } from "react";
import { Search, MoreVertical, Phone, Star, BadgeCheck, MapPin, Calendar, CreditCard, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { formatPrice, categories } from "@/data";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import { getVendorById, SupabaseVendor } from "@/lib/vendors";
import ChatThread from "@/components/ChatThread";

const STEPS = ["Pilih Paket", "Detail Acara", "Pembayaran", "Konfirmasi"];

const PACKAGES = [
  { name: "Paket Basic", desc: "100 foto editing, 1 hari", price: 3500000 },
  { name: "Paket Silver", desc: "200 foto + album, 1 hari", price: 5500000, popular: true },
  { name: "Paket Premium", desc: "300 foto + video, 2 hari", price: 9000000 },
];

function ChatBookingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");

  const [vendor, setVendor] = useState<SupabaseVendor | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);

  const [activeStep, setActiveStep] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(1);
  const [eventDate, setEventDate] = useState("2026-11-12");
  const [eventLocation, setEventLocation] = useState("");
  const [guestName, setGuestName] = useState("");
  const [notes, setNotes] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
      setGuestName(name);
    }
  }, [user]);

  useEffect(() => {
    async function fetchVendor() {
      if (!vendorId) {
        setVendorLoading(false);
        return;
      }
      const v = await getVendorById(vendorId);
      setVendor(v);
      setVendorLoading(false);
    }
    fetchVendor();
  }, [vendorId]);

  if (loading || vendorLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  if (!vendorId || !vendor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-bold text-[#1A3A3C] mb-2">Vendor tidak ditemukan</p>
        <p className="text-sm text-[#8ABDB5] mb-6">Silakan mulai chat dari halaman detail vendor.</p>
        <Link href="/search" className="text-[#1CABB4] font-semibold hover:underline">Cari Vendor</Link>
      </div>
    );
  }

  const categoryLabel = categories.find(c => c.id === vendor.category_id)?.name || "Vendor";
  const logoImage = vendor.logo_url || "https://api.dicebear.com/7.x/shapes/svg?seed=" + vendor.id;
  const pkg = PACKAGES[selectedPkg];

  const handlePay = async () => {
    setPaying(true);
    setPayError("");

    try {
      const booking = {
        id: `FST-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        status: "processing",
        vendorName: vendor.name,
        vendorLogo: logoImage,
        category: categoryLabel,
        paket: pkg.name,
        eventDate,
        eventLocation,
        guestName,
        notes,
        total: pkg.price,
        items: [{
          productId: vendor.id,
          name: `${pkg.name} — ${vendor.name}`,
          qty: 1,
          price: pkg.price,
          image: logoImage,
        }],
        storeName: vendor.name,
      };

      const existing = JSON.parse(localStorage.getItem("festara_bookings") || "[]");
      localStorage.setItem("festara_bookings", JSON.stringify([booking, ...existing]));

      await new Promise(r => setTimeout(r, 1500));

      setPaying(false);
      setPaid(true);

    } catch (e) {
      console.error("Booking error:", e);
      setPayError("Terjadi kesalahan. Silakan coba lagi.");
      setPaying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="text-xs text-[#8ABDB5] mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#1CABB4]">Beranda</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-[#1CABB4]">Cari Vendor</Link>
        <span>/</span>
        <span className="text-[#1A3A3C] font-medium">Chat & Booking</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── PANEL 1: CHAT (REALTIME) ── */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden" style={{ height: 600 }}>
          <div className="p-4 border-b border-[#EAF5E4] flex items-center gap-3">
            <img src={logoImage} alt={vendor.name} className="w-10 h-10 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-[#1A3A3C] truncate">{vendor.name}</p>
                <BadgeCheck size={13} className="text-[#1CABB4] flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#8ABDB5]">
                <MapPin size={9} />{vendor.location || "-"}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]"><Phone size={15} className="text-[#4A7A6D]" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]"><MoreVertical size={15} className="text-[#4A7A6D]" /></button>
            </div>
          </div>

          <ChatThread currentUserId={user.id} otherUserId={vendor.user_id} />

          <div className="px-4 py-2 border-t border-[#EAF5E4]">
            <button onClick={() => setActiveStep(1)}
              className="w-full text-xs font-semibold text-[#1CABB4] bg-[#E8F8F9] py-2 rounded-xl hover:bg-[#D0F0F2] transition-colors flex items-center justify-center gap-1.5">
              <Calendar size={13} /> Lanjut ke Booking <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* ── PANEL 2: BOOKING (tetap sama seperti sebelumnya) ── */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden" style={{ height: 600 }}>
          <div className="px-4 pt-4 pb-3 border-b border-[#EAF5E4]">
            <p className="text-xs font-bold text-[#1A3A3C] mb-3">Booking</p>
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                      ${i < activeStep ? "bg-[#1CABB4] text-white" : i === activeStep ? "bg-[#1CABB4] text-white ring-4 ring-[#E8F8F9]" : "bg-[#EAF5E4] text-[#8ABDB5]"}`}>
                      {i < activeStep ? <Check size={10} /> : i + 1}
                    </div>
                    <span className={`text-[9px] mt-1 whitespace-nowrap ${i <= activeStep ? "text-[#1CABB4] font-semibold" : "text-[#8ABDB5]"}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < activeStep ? "bg-[#1CABB4]" : "bg-[#EAF5E4]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeStep === 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#1A3A3C] mb-2">Pilih Paket</p>
                {PACKAGES.map((p, i) => (
                  <div key={i} onClick={() => setSelectedPkg(i)}
                    className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${selectedPkg === i ? "border-[#1CABB4] bg-[#E8F8F9]/40" : "border-[#D4EAC8] hover:border-[#DBEBC9]"}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-[#1A3A3C]">{p.name}</p>
                          {p.popular && <span className="text-[9px] bg-[#1CABB4] text-white px-1.5 py-0.5 rounded-full font-bold">Terpopuler</span>}
                        </div>
                        <p className="text-xs text-[#8ABDB5] mt-0.5">{p.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-[#1CABB4]">{formatPrice(p.price)}</p>
                        <div className={`w-4 h-4 rounded-full border-2 mt-1 ml-auto flex items-center justify-center ${selectedPkg === i ? "bg-[#1CABB4] border-[#1CABB4]" : "border-[#D4EAC8]"}`}>
                          {selectedPkg === i && <Check size={9} className="text-white" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#1A3A3C]">Detail Acara</p>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Nama Pengantin / Penanggung Jawab</p>
                  <input value={guestName} onChange={e => setGuestName(e.target.value)}
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]" />
                </div>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Paket Dipilih</p>
                  <div className="border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] bg-[#F0FBF5] font-semibold">
                    {pkg.name} — <span className="text-[#1CABB4]">{formatPrice(pkg.price)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Tanggal Acara</p>
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]" />
                </div>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Lokasi Acara</p>
                  <input value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                    placeholder="Contoh: Kaliurang, Yogyakarta"
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]" />
                </div>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Catatan <span className="text-[#8ABDB5]">(opsional)</span></p>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    placeholder="Contoh: tema rustic, outdoor, golden hour..."
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] resize-none placeholder:text-[#8ABDB5] bg-[#F0FBF5]" />
                </div>
              </div>
            )}

            {activeStep >= 2 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#1A3A3C]">Ringkasan Booking</p>
                <div className="flex items-center gap-3 bg-[#F0FBF5] rounded-xl p-3">
                  <img src={logoImage} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-bold text-[#1A3A3C]">{vendor.name}</p>
                    <p className="text-xs text-[#8ABDB5]">{categoryLabel} · {vendor.location}</p>
                  </div>
                </div>
                {[
                  { label: "Paket", value: pkg.name },
                  { label: "Atas Nama", value: guestName },
                  { label: "Tanggal Acara", value: new Date(eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Lokasi", value: eventLocation },
                  { label: "Total Pembayaran", value: formatPrice(pkg.price), bold: true },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-[#EAF5E4]">
                    <span className="text-xs text-[#8ABDB5]">{item.label}</span>
                    <span className={`text-xs text-right max-w-[60%] ${item.bold ? "font-extrabold text-[#1CABB4]" : "font-semibold text-[#1A3A3C]"}`}>{item.value}</span>
                  </div>
                ))}
                {activeStep === 2 && (
                  <div className="mt-2">
                    <p className="text-xs font-bold text-[#1A3A3C] mb-2">Metode Pembayaran</p>
                    <div className="border-2 border-[#1CABB4] bg-[#E8F8F9]/40 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1CABB4] rounded-lg flex items-center justify-center">
                        <CreditCard size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1A3A3C]">QRIS</p>
                        <p className="text-[10px] text-[#8ABDB5]">Scan & bayar dari semua aplikasi</p>
                      </div>
                      <Check size={14} className="text-[#1CABB4] ml-auto" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#EAF5E4]">
            {activeStep < 2 ? (
              <button onClick={() => setActiveStep(s => Math.min(s + 1, 2))}
                className="w-full bg-[#1CABB4] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors">
                {activeStep === 0 ? "Pilih Paket Ini" : "Konfirmasi Detail"}
              </button>
            ) : (
              <button onClick={() => setActiveStep(3)}
                className="w-full bg-[#1CABB4] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors">
                Lanjut ke Pembayaran
              </button>
            )}
            {activeStep > 0 && (
              <button onClick={() => setActiveStep(s => s - 1)} className="w-full text-xs text-[#8ABDB5] mt-2 py-1 hover:text-[#4A7A6D] transition-colors">
                ← Kembali
              </button>
            )}
          </div>
        </div>

        {/* ── PANEL 3: PEMBAYARAN (tetap sama seperti sebelumnya) ── */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden" style={{ height: 600 }}>
          <div className="px-4 pt-4 pb-3 border-b border-[#EAF5E4]">
            <p className="text-xs font-bold text-[#1A3A3C]">Pembayaran</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-between p-5">
            {!paid ? (
              <>
                <div className="w-full">
                  <div className="border-2 border-[#1CABB4] bg-[#E8F8F9]/40 rounded-xl p-3 flex items-center gap-3 mb-5">
                    <span className="text-xl">🏦</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#1A3A3C]">QRIS</p>
                      <p className="text-[10px] text-[#8ABDB5]">Semua aplikasi dompet digital</p>
                    </div>
                    <Check size={14} className="text-[#1CABB4]" />
                  </div>

                  <div className="bg-[#F0FBF5] rounded-2xl p-4 flex flex-col items-center border border-[#D4EAC8] mb-4">
                    <p className="text-xs text-[#8ABDB5] mb-3">Scan QR Code untuk membayar</p>
                    <div className="w-36 h-36 bg-white border-2 border-[#1CABB4] rounded-xl flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                        {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
                          const inCorner = (r<3&&c<3)||(r<3&&c>3)||(r>3&&c<3);
                          const fill = inCorner || ((r * 7 + c * 3) % 2 === 0);
                          return <rect key={`${r}-${c}`} x={c*14+1} y={r*14+1} width={12} height={12} fill={fill?"#1CABB4":"white"} rx={1} />;
                        }))}
                      </svg>
                    </div>
                    <p className="text-sm font-extrabold text-[#1CABB4] mt-3">{formatPrice(pkg.price)}</p>
                    <p className="text-[10px] text-[#8ABDB5] mt-0.5">{pkg.name} · {vendor.name}</p>
                  </div>
                </div>

                {payError && (
                  <p className="text-xs text-[#EF4444] text-center mt-2">{payError}</p>
                )}

                <div className="w-full mt-4 space-y-2">
                  <button onClick={handlePay} disabled={paying}
                    className="w-full bg-[#1CABB4] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-70 flex items-center justify-center gap-2">
                    {paying
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Memverifikasi...</>
                      : "Saya Sudah Bayar"}
                  </button>
                  <p className="text-[10px] text-center text-[#8ABDB5]">Dana aman tersimpan hingga acara selesai</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-20 h-20 bg-[#E8F8F9] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(28,171,180,0.2)]">
                  <Check size={36} className="text-[#1CABB4]" strokeWidth={3} />
                </div>
                <div>
                  <p className="font-extrabold text-lg text-[#1A3A3C]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Pembayaran Berhasil!</p>
                  <p className="text-sm text-[#8ABDB5] mt-1">Booking kamu telah tersimpan</p>
                </div>
                <Link href="/dashboard" className="w-full bg-[#1CABB4] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors text-center">
                  Lihat Pesanan Saya →
                </Link>
                <Link href="/search" className="text-xs text-[#8ABDB5] hover:text-[#1CABB4] transition-colors">
                  Cari vendor lain
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ChatBookingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ChatBookingContent />
    </Suspense>
  );
}