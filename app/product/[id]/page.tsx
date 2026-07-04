"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, MessageCircle, Shield, Truck, RotateCcw, Share2, ChevronLeft, ChevronRight, Award, MapPin, Store, Minus, Plus, CheckCircle2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products, stores, reviews, formatPrice } from "@/data";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id) || products[0];
  const store = stores.find(s => s.id === product.storeId) || stores[0];
  const productReviews = reviews.filter(r => r.productId === product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id);

  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "spec" | "reviews">("desc");
  const [added, setAdded] = useState(false);

  const handleAddCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const imgs = product.images?.length ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#9CA3AF] mb-5">
        <Link href="/" className="hover:text-[#1CABB4]">Beranda</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-[#1CABB4]">Produk</Link>
        <span>/</span>
        <span className="text-[#1F2937] line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-10">
        {/* Gallery */}
        <div>
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-3 aspect-square relative group">
            <img src={imgs[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
            {imgs.length > 1 && (
              <>
                <button onClick={() => setImgIdx(p => (p - 1 + imgs.length) % imgs.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setImgIdx(p => (p + 1) % imgs.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {imgs.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-[#1CABB4] shadow-[0_0_0_2px_rgba(28,171,180,0.2)]" : "border-transparent"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              {product.isFlashSale && (
                <span className="inline-flex items-center gap-1 bg-[#F59E0B] text-white text-xs font-bold px-2 py-1 rounded-lg mb-2">⚡ Flash Sale</span>
              )}
              <h1 className="text-xl md:text-2xl font-bold text-[#1F2937] leading-snug" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{product.name}</h1>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setWished(!wished)} className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-center hover:border-[#EF4444] transition-colors">
                <Heart size={18} className={wished ? "fill-[#EF4444] text-[#EF4444]" : "text-[#9CA3AF]"} />
              </button>
              <button className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-2xl flex items-center justify-center hover:border-[#1CABB4] transition-colors">
                <Share2 size={18} className="text-[#9CA3AF]" />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "#F59E0B" : "transparent"} className={i < Math.floor(product.rating) ? "text-[#F59E0B]" : "text-[#E5E7EB]"} />
              ))}
              <span className="ml-1 font-bold text-sm text-[#1F2937]">{product.rating}</span>
            </div>
            <span className="text-sm text-[#9CA3AF]">|</span>
            <span className="text-sm text-[#9CA3AF]">{productReviews.length} ulasan</span>
            <span className="text-sm text-[#9CA3AF]">|</span>
            <span className="text-sm text-[#9CA3AF]">{product.sold.toLocaleString("id-ID")} terjual</span>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-[#E8F8F9] to-[#F5FAF0] rounded-2xl p-4 mb-5">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#1CABB4]">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-[#9CA3AF] text-sm line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="inline-block bg-[#EF4444] text-white text-xs font-bold px-2 py-0.5 rounded-lg mt-1">Hemat {product.discount}%</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-medium text-[#1F2937]">Jumlah:</span>
            <div className="flex items-center border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
                <Minus size={15} className="text-[#6B7280]" />
              </button>
              <span className="w-10 text-center text-sm font-semibold text-[#1F2937]">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
                <Plus size={15} className="text-[#6B7280]" />
              </button>
            </div>
            <span className="text-xs text-[#9CA3AF]">Stok: {product.stock}</span>
          </div>

          {/* Total */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-[#6B7280]">Total:</span>
            <span className="text-lg font-bold text-[#1CABB4]">{formatPrice(product.price * qty)}</span>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddCart}
              className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all ${added ? "bg-[#22C55E] text-white" : "bg-[#E8F8F9] text-[#1CABB4] hover:bg-[#1CABB4] hover:text-white"}`}>
              {added ? <><CheckCircle2 size={18} /> Ditambahkan!</> : <><ShoppingCart size={18} /> Keranjang</>}
            </button>
            <Link href="/checkout" className="flex-1 flex items-center justify-center gap-2 bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-3.5 rounded-2xl transition-colors">
              Beli Sekarang
            </Link>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { icon: Shield, label: "Original", desc: "Terjamin asli" },
              { icon: Truck, label: "Pengiriman", desc: "Hari ini dikirim" },
              { icon: RotateCcw, label: "Retur", desc: "7 hari retur" },
            ].map(g => (
              <div key={g.label} className="flex flex-col items-center gap-1 p-3 bg-[#F8FAFC] rounded-2xl text-center">
                <g.icon size={16} className="text-[#1CABB4]" />
                <span className="text-[10px] font-semibold text-[#1F2937]">{g.label}</span>
                <span className="text-[9px] text-[#9CA3AF]">{g.desc}</span>
              </div>
            ))}
          </div>

          {/* Store */}
          <Link href={`/store/${store.id}`} className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-2xl hover:border-[#1CABB4] hover:bg-[#E8F8F9] transition-all">
            <img src={store.logo} alt={store.name} className="w-12 h-12 rounded-xl" />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-[#1F2937]">{store.name}</span>
                {store.isVerified && <Award size={13} className="text-[#1CABB4]" fill="#1CABB4" />}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <MapPin size={10} /><span>{store.location}</span>
                <span>·</span>
                <Star size={10} fill="#F59E0B" className="text-[#F59E0B]" /><span>{store.rating}</span>
              </div>
            </div>
            <Link href={`/chat`} onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-xs text-[#1CABB4] border border-[#1CABB4] px-3 py-2 rounded-xl hover:bg-[#1CABB4] hover:text-white transition-colors">
              <MessageCircle size={13} /> Chat
            </Link>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-8 overflow-hidden">
        <div className="flex border-b border-[#E5E7EB]">
          {(["desc", "spec", "reviews"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === tab ? "text-[#1CABB4] border-b-2 border-[#1CABB4]" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}>
              {tab === "desc" ? "Deskripsi" : tab === "spec" ? "Spesifikasi" : `Ulasan (${productReviews.length})`}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === "desc" && <p className="text-sm text-[#6B7280] leading-relaxed">{product.description}</p>}
          {activeTab === "spec" && (
            <div className="space-y-2">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="flex gap-4 py-2 border-b border-[#F8FAFC]">
                  <span className="text-sm font-medium text-[#6B7280] w-36 flex-shrink-0">{k}</span>
                  <span className="text-sm text-[#1F2937]">{v}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-5">
              {productReviews.length === 0 && <p className="text-sm text-[#9CA3AF] text-center py-8">Belum ada ulasan untuk produk ini.</p>}
              {productReviews.map(rev => (
                <div key={rev.id} className="flex gap-3">
                  <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-[#1F2937]">{rev.userName}</span>
                      <div className="flex gap-0.5">{Array.from({ length: rev.rating }).map((_, i) => <Star key={i} size={11} fill="#F59E0B" className="text-[#F59E0B]" />)}</div>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{rev.comment}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">{rev.date}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-[#E5E7EB] pt-4 text-center text-sm text-[#9CA3AF]">
                Tampilkan lebih banyak ulasan dari {product.sold} pembeli
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[#1F2937] mb-4" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Produk Serupa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
