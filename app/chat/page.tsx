"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Search, MoreVertical, Phone, Star, BadgeCheck, MapPin, Calendar, CreditCard, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { vendors, formatPrice } from "@/data";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const STEPS = ["Pilih Paket", "Detail Acara", "Pembayaran", "Konfirmasi"];

const DUMMY_MSGS = [
  { id: 1, from: "vendor", text: "Halo kak! Selamat datang 😊 Ada yang bisa saya bantu untuk kebutuhan foto pernikahan kakak?", time: "09.00" },
  { id: 2, from: "buyer", text: "Halo! Saya tertarik dengan paket foto prewedding. Bisa cerita lebih detail?", time: "09.02" },
  { id: 3, from: "vendor", text: "Tentu kak! Kami punya 3 paket:\n• Paket Basic – Rp 3.500.000 (100 foto)\n• Paket Silver – Rp 5.500.000 (200 foto + album)\n• Paket Premium – Rp 9.000.000 (300 foto + video)", time: "09.03" },
  { id: 4, from: "buyer", text: "Untuk Paket Silver, apakah bisa outdoor?", time: "09.05" },
  { id: 5, from: "vendor", text: "Bisa banget kak! Kami biasa foto di Kaliurang, Kebun Bunga, atau lokasi pilihan kakak. Sudah termasuk tim makeup ya 🌸", time: "09.06" },
  { id: 6, from: "buyer", text: "Wah bagus! Saya mau booking untuk tanggal 12 Nov 2026", time: "09.08" },
  { id: 7, from: "vendor", text: "Tanggal tersebut masih tersedia kak! Silakan lanjut ke booking ya 😊", time: "09.09" },
];

const PACKAGES = [
  { name: "Paket Basic", desc: "100 foto editing, 1 hari", price: 3500000 },
  { name: "Paket Silver", desc: "200 foto + album, 1 hari", price: 5500000, popular: true },
  { name: "Paket Premium", desc: "300 foto + video, 2 hari", price: 9000000 },
];

export default function ChatBookingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const vendor = vendors[0];
  const [msgs, setMsgs] = useState(DUMMY_MSGS);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState(1);
  const [eventDate, setEventDate] = useState("2026-11-12");
  const [eventLocation, setEventLocation] = useState("Kaliurang, Yogyakarta");
  const [guestName, setGuestName] = useState("");
  const [notes, setNotes] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [payError, setPayError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { id: p.length + 1, from: "buyer", text: input, time: new Date().toTimeString().slice(0, 5) }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, { id: p.length + 1, from: "vendor", text: "Terima kasih! Ada lagi yang ingin ditanyakan? 😊", time: new Date().toTimeString().slice(0, 5) }]);
    }, 1500);
  };

  const pkg = PACKAGES[selectedPkg];

  const handlePay = async () => {
    setPaying(true);
    setPayError("");

    try {
      // Simpan ke localStorage untuk dashboard & notifikasi
      const booking = {
        id: `FST-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        status: "processing",
        vendorName: vendor.name,
        vendorLogo: vendor.logo,
        category: vendor.categoryLabel,
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
          image: vendor.image,
        }],
        storeName: vendor.name,
      };

      const existing = JSON.parse(localStorage.getItem("festara_bookings") || "[]");
      localStorage.setItem("festara_bookings", JSON.stringify([booking, ...existing]));

      // Simulasi delay pembayaran
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

        {/* ── PANEL 1: CHAT ── */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden" style={{ height: 600 }}>
          <div className="p-4 border-b border-[#EAF5E4] flex items-center gap-3">
            <div className="relative">
              <img src={vendor.logo} alt={vendor.name} className="w-10 h-10 rounded-xl object-cover" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-[#1A3A3C] truncate">{vendor.name}</p>
                <BadgeCheck size={13} className="text-[#1CABB4] flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#8ABDB5]">
                <MapPin size={9} />{vendor.location}
                <span className="ml-1 flex items-center gap-0.5"><Star size={9} fill="#F59E0B" className="text-[#F59E0B]" />{vendor.rating}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]"><Phone size={15} className="text-[#4A7A6D]" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]"><Search size={15} className="text-[#4A7A6D]" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]"><MoreVertical size={15} className="text-[#4A7A6D]" /></button>
            </div>
          </div>

          <div className="px-4 py-2 bg-[#F0FBF5] border-b border-[#EAF5E4]">
            <p className="text-xs font-bold text-[#1A3A3C]">Chat In-App</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map(m => (
              <div key={m.id} className={`flex ${m.from === "buyer" ? "justify-end" : "justify-start"}`}>
                {m.from === "vendor" && (
                  <img src={vendor.logo} alt="" className="w-7 h-7 rounded-lg object-cover mr-2 flex-shrink-0 self-end" />
                )}
                <div className={`max-w-[75%] ${m.from === "buyer" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                  <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${m.from === "buyer"
                    ? "bg-[#1CABB4] text-white rounded-br-sm"
                    : "bg-[#EAF5E4] text-[#1A3A3C] rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-[#8ABDB5] px-1">{m.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <img src={vendor.logo} alt="" className="w-7 h-7 rounded-lg object-cover" />
                <div className="bg-[#EAF5E4] px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#8ABDB5] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-2 border-t border-[#EAF5E4]">
            <button onClick={() => setActiveStep(1)}
              className="w-full text-xs font-semibold text-[#1CABB4] bg-[#E8F8F9] py-2 rounded-xl hover:bg-[#D0F0F2] transition-colors flex items-center justify-center gap-1.5">
              <Calendar size={13} /> Lanjut ke Booking <ChevronRight size={13} />
            </button>
          </div>

          <div className="p-3 border-t border-[#EAF5E4] flex items-center gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Tulis pesan..."
              className="flex-1 bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] placeholder:text-[#8ABDB5]" />
            <button onClick={send} disabled={!input.trim()}
              className="w-9 h-9 bg-[#1CABB4] disabled:bg-[#D4EAC8] text-white rounded-xl flex items-center justify-center hover:bg-[#178E96] transition-colors flex-shrink-0">
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* ── PANEL 2: BOOKING ── */}
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
            {/* Step 0: Pilih Paket */}
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

            {/* Step 1: Detail Acara */}
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

            {/* Step 2+: Ringkasan */}
            {activeStep >= 2 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#1A3A3C]">Ringkasan Booking</p>
                <div className="flex items-center gap-3 bg-[#F0FBF5] rounded-xl p-3">
                  <img src={vendor.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-bold text-[#1A3A3C]">{vendor.name}</p>
                    <p className="text-xs text-[#8ABDB5]">{vendor.categoryLabel} · {vendor.location}</p>
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

        {/* ── PANEL 3: PEMBAYARAN ── */}
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
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                      <p className="text-[10px] text-[#F59E0B] font-semibold">Menunggu pembayaran · 14:59</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {["Buka aplikasi dompet digital kamu", "Pilih menu Scan / Bayar QR", "Scan kode di atas & konfirmasi"].map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#4A7A6D]">
                        <span className="w-5 h-5 bg-[#E8F8F9] text-[#1CABB4] font-bold text-[10px] rounded-full flex items-center justify-center flex-shrink-0">{i+1}</span>
                        {t}
                      </div>
                    ))}
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
                <div className="bg-[#F0FBF5] rounded-2xl p-4 w-full text-left space-y-2.5">
                  {[
                    { label: "Vendor", value: vendor.name },
                    { label: "Paket", value: pkg.name },
                    { label: "Tanggal", value: new Date(eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
                    { label: "Lokasi", value: eventLocation },
                    { label: "Total", value: formatPrice(pkg.price) },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-xs">
                      <span className="text-[#8ABDB5]">{item.label}</span>
                      <span className="font-semibold text-[#1A3A3C] text-right max-w-[60%]">{item.value}</span>
                    </div>
                  ))}
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