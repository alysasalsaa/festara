"use client";
import Link from "next/link";
import { CheckCircle, ArrowRight, Star, MessageCircle, Calendar, MapPin, Camera } from "lucide-react";
import { formatPrice } from "@/data";

export default function PaymentSuccessPage() {
  const bookingDetail = {
    orderNo: "FST-2026-001345",
    vendorName: "Lavinia Wedding Fotografer",
    vendorLogo: "https://api.dicebear.com/7.x/shapes/svg?seed=lavinia&backgroundColor=1CABB4",
    category: "Photographer",
    paket: "Paket Silver",
    tanggal: "12 November 2026",
    lokasi: "Kaliurang, Yogyakarta",
    total: 5500000,
    dp: 2750000,
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden">

        {/* Success header */}
        <div className="bg-gradient-to-b from-[#E8F8F9] to-white pt-10 pb-6 text-center px-6">
          <div className="w-24 h-24 bg-[#1CABB4] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(28,171,180,0.3)]">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A3C] mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Booking Berhasil!
          </h1>
          <p className="text-sm text-[#4A7A6D]">Vendor akan segera mengkonfirmasi pesananmu</p>
        </div>

        <div className="px-6 pb-6">

          {/* Order info */}
          <div className="bg-[#F0FBF5] rounded-2xl p-4 mb-5 space-y-2.5">
            {[
              { label: "No. Booking", value: bookingDetail.orderNo, mono: true },
              { label: "Total Pembayaran", value: formatPrice(bookingDetail.total), bold: true },
              { label: "DP Dibayar", value: formatPrice(bookingDetail.dp) },
              { label: "Metode Pembayaran", value: "QRIS" },
              { label: "Tanggal Transaksi", value: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
              { label: "Status", value: "✓ Terkonfirmasi", green: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[#8ABDB5]">{item.label}</span>
                <span className={`font-semibold ${item.green ? "text-[#22C55E]" : "text-[#1A3A3C]"} ${item.mono ? "font-mono text-xs" : ""} ${item.bold ? "text-[#1CABB4]" : ""}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Booking Detail */}
          <div className="border border-[#D4EAC8] rounded-2xl overflow-hidden mb-5">
            <div className="px-4 py-3 border-b border-[#D4EAC8] flex items-center gap-2 bg-[#F0FBF5]">
              <Camera size={14} className="text-[#1CABB4]" />
              <span className="text-xs font-bold text-[#1A3A3C]">Detail Booking</span>
            </div>
            <div className="p-4 space-y-3">
              {/* Vendor info */}
              <div className="flex items-center gap-3">
                <img src={bookingDetail.vendorLogo} alt={bookingDetail.vendorName}
                  className="w-12 h-12 rounded-xl object-cover border border-[#D4EAC8] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[#8ABDB5]">{bookingDetail.category}</p>
                  <p className="text-sm font-bold text-[#1A3A3C]">{bookingDetail.vendorName}</p>
                </div>
              </div>
              <div className="h-px bg-[#EAF5E4]" />
              {/* Detail rows */}
              {[
                { icon: <Camera size={13} className="text-[#1CABB4]" />, label: "Paket", value: bookingDetail.paket },
                { icon: <Calendar size={13} className="text-[#1CABB4]" />, label: "Tanggal Acara", value: bookingDetail.tanggal },
                { icon: <MapPin size={13} className="text-[#1CABB4]" />, label: "Lokasi", value: bookingDetail.lokasi },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5 text-sm">
                  <div className="w-7 h-7 bg-[#E8F8F9] rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className="text-[#8ABDB5] text-xs">{item.label}</span>
                    <span className="text-xs font-semibold text-[#1A3A3C]">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info sisa pembayaran */}
          <div className="bg-[#FFFBEB] border border-[#F59E0B]/20 rounded-2xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-sm font-semibold text-[#1A3A3C]">Sisa Pembayaran</p>
                <p className="text-xs text-[#4A7A6D] mt-0.5">
                  Sisa <span className="font-bold text-[#F59E0B]">{formatPrice(bookingDetail.dp)}</span> dibayar H-7 sebelum acara.
                  Dana aman disimpan sistem escrow hingga acara selesai.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="w-full bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-4 rounded-2xl text-center transition-colors flex items-center justify-center gap-2">
              Lihat Pesanan Saya <ArrowRight size={16} />
            </Link>
            <Link href="/chat" className="w-full bg-[#F0FBF5] hover:bg-[#E5E7EB] text-[#4A7A6D] font-semibold py-3 rounded-2xl text-center transition-colors flex items-center justify-center gap-2 text-sm">
              <MessageCircle size={15} /> Chat dengan Vendor
            </Link>
            <Link href="/search" className="w-full text-center text-sm text-[#1CABB4] font-semibold py-2 hover:underline">
              Cari Vendor Lain →
            </Link>
          </div>
        </div>
      </div>

      {/* Rate prompt */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] mt-4 p-5 text-center">
        <div className="flex justify-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={28} className="text-[#E5E7EB] hover:text-[#F59E0B] cursor-pointer transition-colors" />
          ))}
        </div>
        <p className="text-sm font-semibold text-[#1A3A3C] mb-1">Bagaimana pengalaman booking-mu?</p>
        <p className="text-xs text-[#8ABDB5]">Ulasanmu membantu calon pelanggan lain memilih vendor</p>
      </div>
    </div>
  );
}