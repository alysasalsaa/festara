"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, MapPin, Heart, SlidersHorizontal } from "lucide-react";
import { products, categories, formatPrice } from "@/data";

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = categories.find(c => c.id === params.id) || categories[0];
  const [sortBy, setSortBy] = useState("popular");
  const [wishlisted, setWishlisted] = useState<string[]>([]);

  // Show all products (in real app would filter by category)
  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.sold - a.sold;
  });

  const toggleWish = (id: string) => setWishlisted(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Category Hero */}
      <div className="bg-gradient-to-r from-[#1CABB4] to-[#0e8a92] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
            <Link href="/" className="hover:text-white">Beranda</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Kategori</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{category.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
              {category.icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{category.name}</h1>
              <p className="text-white/80 text-sm mt-1">{sorted.length} produk tersedia</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Categories Strip */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-none py-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  cat.id === category.id
                    ? "bg-[#1CABB4] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Sort & Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { key: "popular", label: "Terpopuler" },
              { key: "rating", label: "Rating Terbaik" },
              { key: "price_asc", label: "Harga Terendah" },
              { key: "price_desc", label: "Harga Tertinggi" },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  sortBy === opt.key
                    ? "bg-[#1CABB4] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#1CABB4]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-white transition-colors ml-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Sub-categories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {["Semua", "Terlaris", "Baru", "Diskon", "Gratis Ongkir"].map(sub => (
            <button
              key={sub}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sub === "Semua"
                  ? "bg-[#DBEBC9] text-[#1CABB4]"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#1CABB4]"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sorted.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                    -{product.discount}%
                  </div>
                )}
                {product.isFlashSale && (
                  <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                    ⚡ Flash
                  </div>
                )}
                <button
                  onClick={() => toggleWish(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Heart className={`w-4 h-4 ${wishlisted.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>

              <div className="p-3">
                <p className="text-xs text-gray-400 mb-1 truncate">{product.storeName}</p>
                <Link href={`/product/${product.id}`}>
                  <p className="text-sm font-medium text-[#1F2937] line-clamp-2 mb-2 leading-snug hover:text-[#1CABB4] transition-colors">
                    {product.name}
                  </p>
                </Link>

                <div className="mb-2">
                  <p className="text-sm font-bold text-[#1CABB4]">{formatPrice(product.price)}</p>
                  {product.originalPrice && (
                    <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-16">{product.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[1, 2, 3, "...", 8, 9].map((page, i) => (
            <button
              key={i}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                page === 1
                  ? "bg-[#1CABB4] text-white"
                  : page === "..."
                  ? "text-gray-400 cursor-default"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-[#1CABB4] hover:text-[#1CABB4]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
