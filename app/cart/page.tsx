"use client";
import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, Tag, FileText, ShoppingBag, ArrowRight, ChevronLeft } from "lucide-react";
import { products, formatPrice } from "@/data";

const initCart = [
  { product: products[0], qty: 1 },
  { product: products[2], qty: 2 },
  { product: products[4], qty: 1 },
];

export default function CartPage() {
  const [cart, setCart] = useState(initCart);
  const [voucher, setVoucher] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [notes, setNotes] = useState("");

  const updateQty = (i: number, delta: number) => {
    setCart(prev => prev.map((item, idx) => idx === i ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };
  const removeItem = (i: number) => setCart(prev => prev.filter((_, idx) => idx !== i));

  const subtotal = cart.reduce((s, item) => s + item.product.price * item.qty, 0);
  const discount = voucherApplied ? 50000 : 0;
  const shipping = 25000;
  const total = subtotal - discount + shipping;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/search" className="w-9 h-9 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center hover:border-[#1CABB4] transition-colors">
          <ChevronLeft size={18} className="text-[#6B7280]" />
        </Link>
        <h1 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Keranjang Belanja</h1>
        <span className="bg-[#E8F8F9] text-[#1CABB4] text-xs font-bold px-2 py-1 rounded-full">{cart.length} item</span>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-2">Keranjang Kosong</h3>
          <p className="text-sm text-[#9CA3AF] mb-5">Yuk mulai belanja produk favoritmu!</p>
          <Link href="/search" className="inline-flex items-center gap-2 bg-[#1CABB4] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#178E96] transition-colors">
            <ShoppingBag size={16} /> Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="p-4 border-b border-[#E5E7EB] flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#1CABB4]" />
                <span className="font-semibold text-sm text-[#1F2937]">Produk Dipilih</span>
              </div>
              <div className="divide-y divide-[#F8FAFC]">
                {cart.map((item, i) => (
                  <div key={i} className="p-4 flex gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-2xl bg-[#F8FAFC] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#9CA3AF] mb-0.5">{item.product.storeName}</p>
                      <h3 className="text-sm font-medium text-[#1F2937] line-clamp-2 mb-2">{item.product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[#1CABB4] font-bold text-sm">{formatPrice(item.product.price)}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden">
                            <button onClick={() => updateQty(i, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#F8FAFC]">
                              <Minus size={12} className="text-[#6B7280]" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold">{item.qty}</span>
                            <button onClick={() => updateQty(i, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#F8FAFC]">
                              <Plus size={12} className="text-[#6B7280]" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(i)} className="w-7 h-7 flex items-center justify-center text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[#9CA3AF] mt-1">Subtotal: <span className="font-semibold text-[#1F2937]">{formatPrice(item.product.price * item.qty)}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Voucher */}
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-[#1CABB4]" />
                <span className="font-semibold text-sm text-[#1F2937]">Kode Voucher</span>
              </div>
              <div className="flex gap-2">
                <input value={voucher} onChange={e => setVoucher(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1CABB4] font-mono tracking-wider"
                  placeholder="Masukkan kode voucher" />
                <button onClick={() => setVoucherApplied(voucher === "HEMAT50" ? true : false)}
                  className="bg-[#1CABB4] hover:bg-[#178E96] text-white font-semibold text-sm px-4 rounded-xl transition-colors">
                  Pakai
                </button>
              </div>
              {voucherApplied && <p className="text-xs text-[#22C55E] mt-2 font-semibold">✓ Voucher HEMAT50 berhasil — Hemat Rp50.000!</p>}
              <p className="text-xs text-[#9CA3AF] mt-2">Coba kode: <span className="font-mono font-bold">HEMAT50</span></p>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} className="text-[#1CABB4]" />
                <span className="font-semibold text-sm text-[#1F2937]">Catatan Pesanan</span>
              </div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1CABB4] resize-none"
                placeholder="Tulis catatan untuk penjual (opsional)..." />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 sticky top-24">
              <h3 className="font-bold text-[#1F2937] mb-4">Ringkasan Pesanan</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} item)</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Ongkos Kirim</span>
                  <span className="font-semibold">{formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#22C55E]">Diskon Voucher</span>
                    <span className="font-semibold text-[#22C55E]">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="border-t border-[#E5E7EB] pt-3 flex justify-between">
                  <span className="font-bold text-[#1F2937]">Total Pembayaran</span>
                  <span className="font-extrabold text-[#1CABB4] text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-4 rounded-2xl transition-colors">
                Lanjut ke Checkout <ArrowRight size={16} />
              </Link>
              <p className="text-center text-xs text-[#9CA3AF] mt-3">🔒 Pembayaran aman via QRIS</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
