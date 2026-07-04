"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Shield, Calendar, MapPin, Camera, ArrowRight, Check, FileText } from "lucide-react";
import { vendors, formatPrice } from "@/data";

const PACKAGES = [
  { name: "Paket Basic", desc: "100 foto editing · 1 hari · 3 fotografer", price: 3500000 },
  { name: "Paket Silver", desc: "200 foto + album · 1 hari · 5 fotografer", price: 5500000, popular: true },
  { name: "Paket Premium", desc: "300 foto + video · 2 hari · 7 fotografer", price: 9000000 },
];

export default function CheckoutPage() {
  const vendor = vendors[0];
  const [selectedPkg, setSelectedPkg] = useState(1);
  const [eventDate, setEventDate] = useState("2026-11-12");
  const [eventLocation, setEventLocation] = useState("Kaliurang, Yogyakarta");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);

  const pkg = PACKAGES[selectedPkg];
  const dp = Math.floor(pkg.price * 0.5);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-xl font-bold text-[#1A3A3C] mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
        Konfirmasi Booking
      </h1>
      <p className="text-sm text-[#8ABDB5] mb-6">Periksa detail booking sebelum melanjutkan pembayaran</p>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-7">
        {["Pilih Vendor", "Konfirmasi", "Pembayaran", "Selesai"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${i === 1 ? "bg-[#1CABB4] text-white" : i < 1 ? "bg-[#22C55E] text-white" : "bg-[#E5E7EB] text-[#8ABDB5]"}`}>
              {i < 1 ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block
              ${i === 1 ? "text-[#1CABB4]" : i < 1 ? "text-[#22C55E]" : "text-[#8ABDB5]"}`}>
              {step}
            </span>
            {i < 3 && <ChevronRight size={14} className="text-[#E5E7EB]" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">

          {/* Vendor info */}
          <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Camera size={16} className="text-[#1CABB4]" />
              <span className="font-bold text-sm text-[#1A3A3C]">Vendor</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#F0FBF5] rounded-2xl">
              <img src={vendor.logo} alt={vendor.name} className="w-14 h-14 rounded-xl object-cover border border-[#D4EAC8] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#8ABDB5] mb-0.5">{vendor.categoryLabel}</p>
                <p className="font-bold text-[#1A3A3C]">{vendor.name}</p>
                <div className="flex items-center gap-1 text-xs text-[#8ABDB5] mt-0.5">
                  <MapPin size={10} />{vendor.location}
                </div>
              </div>
              <Link href={`/store/${vendor.id}`} className="text-xs text-[#1CABB4] font-semibold whitespace-nowrap">
                Lihat Profil
              </Link>
            </div>
          </div>

          {/* Pilih paket */}
          <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-[#1CABB4]" />
              <span className="font-bold text-sm text-[#1A3A3C]">Pilih Paket</span>
            </div>
            <div className="space-y-3">
              {PACKAGES.map((p, i) => (
                <label key={i} onClick={() => setSelectedPkg(i)}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all
                    ${selectedPkg === i ? "border-[#1CABB4] bg-[#E8F8F9]" : "border-[#D4EAC8] hover:border-[#DBEBC9]"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${selectedPkg === i ? "bg-[#1CABB4] border-[#1CABB4]" : "border-[#D4EAC8]"}`}>
                      {selectedPkg === i && <Check size={10} className="text-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-[#1A3A3C]">{p.name}</p>
                        {p.popular && <span className="text-[9px] bg-[#1CABB4] text-white font-bold px-1.5 py-0.5 rounded-full">Terpopuler</span>}
                      </div>
                      <p className="text-xs text-[#8ABDB5]">{p.desc}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-sm text-[#1CABB4] flex-shrink-0 ml-3">{formatPrice(p.price)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detail acara */}
          <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-[#1CABB4]" />
              <span className="font-bold text-sm text-[#1A3A3C]">Detail Acara</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#4A7A6D] mb-1.5 block">Tanggal Acara</label>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                  className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
              </div>
              <div>
                <label className="text-xs text-[#4A7A6D] mb-1.5 block">Lokasi Acara</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
                  <input value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                    className="w-full border border-[#D4EAC8] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]"
                    placeholder="Masukkan lokasi acara..." />
                </div>
              </div>
              <div>
                <label className="text-xs text-[#4A7A6D] mb-1.5 block">Catatan untuk Vendor <span className="text-[#8ABDB5]">(opsional)</span></label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  placeholder="Contoh: tema rustic, outdoor, sesi golden hour, dll..."
                  className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] resize-none placeholder:text-[#8ABDB5]" />
              </div>
            </div>
          </div>

          {/* Syarat */}
          <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-[#1CABB4]" />
              <span className="font-bold text-sm text-[#1A3A3C]">Syarat & Ketentuan</span>
            </div>
            <div className="bg-[#F0FBF5] rounded-xl p-3 text-xs text-[#4A7A6D] leading-relaxed mb-3 space-y-1.5">
              <p>• DP 50% dibayar saat booking untuk mengamankan tanggal</p>
              <p>• Sisa 50% dibayar maksimal H-7 sebelum acara</p>
              <p>• Pembatalan sebelum H-14: DP dikembalikan 80%</p>
              <p>• Dana aman disimpan sistem escrow hingga acara selesai</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#1CABB4] flex-shrink-0" />
              <span className="text-xs text-[#4A7A6D]">
                Saya menyetujui <span className="text-[#1CABB4] font-semibold">Syarat & Ketentuan</span> dan{" "}
                <span className="text-[#1CABB4] font-semibold">Kebijakan Privasi</span> Festara
              </span>
            </label>
          </div>
        </div>

        {/* Ringkasan */}
        <div>
          <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 sticky top-24">
            <h3 className="font-bold text-[#1A3A3C] mb-4">Ringkasan Booking</h3>

            <div className="space-y-2.5 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8ABDB5]">Vendor</span>
                <span className="font-semibold text-[#1A3A3C] text-right max-w-[60%] leading-tight">{vendor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ABDB5]">Paket</span>
                <span className="font-semibold text-[#1A3A3C]">{pkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ABDB5]">Tanggal</span>
                <span className="font-semibold text-[#1A3A3C]">
                  {eventDate ? new Date(eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ABDB5]">Lokasi</span>
                <span className="font-semibold text-[#1A3A3C] text-right max-w-[60%] leading-tight">{eventLocation || "-"}</span>
              </div>
              <div className="border-t border-[#D4EAC8] pt-2.5 flex justify-between">
                <span className="text-[#8ABDB5]">Total Paket</span>
                <span className="font-bold text-[#1A3A3C]">{formatPrice(pkg.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8ABDB5]">DP Sekarang (50%)</span>
                <span className="font-extrabold text-[#1CABB4] text-base">{formatPrice(dp)}</span>
              </div>
            </div>

            <div className="bg-[#E8F8F9] rounded-xl p-3 mb-4 flex items-start gap-2">
              <span className="text-base">🔒</span>
              <p className="text-[10px] text-[#1CABB4] font-medium leading-relaxed">
                Dana aman disimpan sistem escrow. Dibayarkan ke vendor setelah acara selesai.
              </p>
            </div>

            <div className="text-xs text-[#8ABDB5] text-center mb-3">Pembayaran via QRIS</div>

            <Link href={agreed ? "/payment" : "#"}
              onClick={e => !agreed && e.preventDefault()}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-colors
                ${agreed
                  ? "bg-[#1CABB4] hover:bg-[#178E96] text-white"
                  : "bg-[#E5E7EB] text-[#8ABDB5] cursor-not-allowed"}`}>
              Bayar DP via QRIS <ArrowRight size={16} />
            </Link>
            {!agreed && (
              <p className="text-[10px] text-[#8ABDB5] text-center mt-2">Centang syarat & ketentuan dulu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}