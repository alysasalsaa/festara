"use client";
import Link from "next/link";
import { Heart, Star, MapPin, Zap } from "lucide-react";
import { useState } from "react";
import { Product, formatPrice, formatNumber } from "@/data";

export default function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(28,171,180,0.15)] transition-all duration-300 overflow-hidden hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#F8FAFC]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
              -{product.discount}%
            </div>
          )}
          {product.isFlashSale && (
            <div className="absolute top-2 left-2 bg-[#F59E0B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
              <Zap size={9} fill="white" />⚡ Flash
            </div>
          )}
          {product.discount > 0 && !product.isFlashSale && (
            <div className="absolute top-2 left-2 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
              -{product.discount}%
            </div>
          )}
          <button
            onClick={e => { e.preventDefault(); setWished(!wished); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart size={14} className={wished ? "fill-[#EF4444] text-[#EF4444]" : "text-[#9CA3AF]"} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-[#9CA3AF] mb-0.5 line-clamp-1">{product.storeName}</p>
          <h3 className="text-sm text-[#1F2937] font-medium line-clamp-2 leading-snug mb-2">{product.name}</h3>

          {/* Price */}
          <div className="mb-2">
            <div className="text-[#1CABB4] font-bold text-sm">{formatPrice(product.price)}</div>
            {product.originalPrice > product.price && (
              <div className="text-[#9CA3AF] text-xs line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between text-[10px] text-[#9CA3AF]">
            <div className="flex items-center gap-1">
              <Star size={10} fill="#F59E0B" className="text-[#F59E0B]" />
              <span className="text-[#6B7280] font-medium">{product.rating}</span>
              <span>· {formatNumber(product.sold)} terjual</span>
            </div>
            <div className="flex items-center gap-0.5">
              <MapPin size={9} />
              <span className="line-clamp-1 max-w-[60px]">{product.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
