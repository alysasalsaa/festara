"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, Share2, Star, MapPin, Filter } from "lucide-react";
import { products, formatPrice } from "@/data";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(products.slice(0, 6));
  const [removing, setRemoving] = useState<string | null>(null);

  const remove = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      setWishlist(w => w.filter(p => p.id !== id));
      setRemoving(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]">Wishlist Saya</h1>
            <p className="text-sm text-gray-500 mt-0.5">{wishlist.length} produk tersimpan</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white transition-colors">
              <Share2 className="w-4 h-4" />
              Bagikan
            </button>
          </div>
        </div>

        {wishlist.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-3xl p-16 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="w-24 h-24 bg-[#DBEBC9]/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-[#1CABB4]" />
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Wishlist Masih Kosong</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Simpan produk favorit kamu agar mudah ditemukan nanti. Klik ikon hati pada produk untuk menyimpannya.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1CABB4] to-[#0e8a92] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 ${
                  removing === product.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                      -{product.discount}%
                    </div>
                  )}
                  <button
                    onClick={() => remove(product.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-400 mb-1">{product.storeName}</p>
                  <p className="text-sm font-medium text-[#1F2937] line-clamp-2 mb-2 leading-snug">
                    {product.name}
                  </p>

                  <div className="mb-2">
                    <p className="text-base font-bold text-[#1CABB4]">{formatPrice(product.price)}</p>
                    {product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{product.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => remove(product.id)}
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:border-red-200 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#1CABB4] to-[#0e8a92] text-white py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Beli
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary bar (if items exist) */}
        {wishlist.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#1F2937]">{wishlist.length} produk di wishlist</p>
              <p className="text-xs text-gray-500">Total estimasi: {formatPrice(wishlist.reduce((s, p) => s + p.price, 0))}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setWishlist([])}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Hapus Semua
              </button>
              <Link
                href="/cart"
                className="flex items-center gap-2 bg-gradient-to-r from-[#1CABB4] to-[#0e8a92] text-white px-6 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="w-4 h-4" />
                Tambah ke Keranjang
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
