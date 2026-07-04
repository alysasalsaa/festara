"use client";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Star, MessageCircle } from "lucide-react";
import { formatPrice } from "@/data";

export default function PaymentSuccessPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden">
        {/* Success header */}
        <div className="bg-gradient-to-b from-[#DCFCE7] to-white pt-10 pb-6 text-center px-6">
          <div className="w-24 h-24 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(34,197,94,0.3)]">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#1A3A3C] mb-1" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Pembayaran Berhasil!</h1>
          <p className="text-sm text-[#4A7A6D]">Pesananmu sedang diproses oleh penjual</p>
        </div>

        <div className="px-6 pb-6">
          {/* Order info */}
          <div className="bg-[#F0FBF5] rounded-2xl p-4 mb-5 space-y-2.5">
            {[
              { label: "No. Pesanan", value: "ORD-2025-001345", mono: true },
              { label: "Total Pembayaran", value: formatPrice(1897000), bold: true },
              { label: "Metode Pembayaran", value: "QRIS" },
              { label: "Tanggal", value: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
              { label: "Status", value: "✓ Lunas", green: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[#8ABDB5]">{item.label}</span>
                <span className={`font-semibold ${item.green ? "text-[#22C55E]" : "text-[#1A3A3C]"} ${item.mono ? "font-mono" : ""} ${item.bold ? "text-[#1CABB4]" : ""}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Products */}
          <div className="border border-[#D4EAC8] rounded-2xl overflow-hidden mb-5">
            <div className="px-4 py-3 border-b border-[#D4EAC8] flex items-center gap-2">
              <Package size={14} className="text-[#1CABB4]" />
              <span className="text-xs font-bold text-[#1A3A3C]">Detail Produk</span>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {[
                { name: "Wireless Earbuds Pro X5", qty: 1, price: 299000, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=80&h=80&fit=crop" },
                { name: "Smartwatch Series 8 AMOLED", qty: 2, price: 1299000, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1A3A3C] line-clamp-1">{item.name}</p>
                    <p className="text-[10px] text-[#8ABDB5]">x{item.qty} · {formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-[#E8F8F9] rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚚</div>
              <div>
                <p className="text-sm font-semibold text-[#1A3A3C]">Estimasi Pengiriman</p>
                <p className="text-xs text-[#4A7A6D]">2 – 5 Juli 2025 · JNE Regular</p>
                <p className="text-xs text-[#1CABB4] font-semibold mt-1">Nomor resi akan dikirim setelah dikemas</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="w-full bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-4 rounded-2xl text-center transition-colors flex items-center justify-center gap-2">
              Lacak Pesanan <ArrowRight size={16} />
            </Link>
            <Link href="/chat" className="w-full bg-[#F0FBF5] hover:bg-[#E5E7EB] text-[#4A7A6D] font-semibold py-3 rounded-2xl text-center transition-colors flex items-center justify-center gap-2 text-sm">
              <MessageCircle size={15} /> Chat dengan Penjual
            </Link>
            <Link href="/" className="w-full text-center text-sm text-[#1CABB4] font-semibold py-2 hover:underline">
              Lanjut Belanja →
            </Link>
          </div>
        </div>
      </div>

      {/* Rate prompt */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] mt-4 p-5 text-center">
        <div className="flex justify-center gap-1 mb-2">
          {[1,2,3,4,5].map(i => <Star key={i} size={28} className="text-[#E5E7EB] hover:text-[#F59E0B] cursor-pointer transition-colors" />)}
        </div>
        <p className="text-sm font-semibold text-[#1A3A3C] mb-1">Bagaimana pengalaman belanjamu?</p>
        <p className="text-xs text-[#8ABDB5]">Ulasanmu membantu penjual dan pembeli lain</p>
      </div>
    </div>
  );
}
