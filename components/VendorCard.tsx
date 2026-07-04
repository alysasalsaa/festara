"use client";
import Link from "next/link";
import { Star, MapPin, BadgeCheck, Heart } from "lucide-react";
import { useState } from "react";
import { Vendor, formatPrice } from "@/data";

export default function VendorCard({ vendor }: { vendor: Vendor }) {
  const [wished, setWished] = useState(false);
  return (
    <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(28,171,180,0.08)] hover:shadow-[0_8px_32px_rgba(28,171,180,0.18)] transition-all duration-300 overflow-hidden flex flex-col md:flex-row group">
      <div className="relative md:w-56 lg:w-64 flex-shrink-0 overflow-hidden">
        <img src={vendor.image} alt={vendor.name} className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-3 left-3 bg-[#1CABB4] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">{vendor.categoryLabel}</span>
        <button onClick={e => { e.preventDefault(); setWished(!wished); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform">
          <Heart size={14} className={wished ? "fill-[#EF4444] text-[#EF4444]" : "text-[#8ABDB5]"} />
        </button>
      </div>
      <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-3 mb-2">
            <img src={vendor.logo} alt={vendor.name} className="w-10 h-10 rounded-xl border border-[#D4EAC8] object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-[#1A3A3C] text-sm md:text-base leading-tight">{vendor.name}</h3>
                {vendor.isVerified && <BadgeCheck size={15} className="text-[#1CABB4] flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-[#4A7A6D]">
                <MapPin size={11} /><span>{vendor.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#FFFBEB] border border-[#F59E0B]/20 rounded-xl px-2.5 py-1 flex-shrink-0">
              <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
              <span className="text-xs font-bold text-[#1A3A3C]">{vendor.rating}</span>
              <span className="text-[10px] text-[#8ABDB5]">({vendor.reviewCount})</span>
            </div>
          </div>
          <p className="text-xs text-[#4A7A6D] leading-relaxed line-clamp-2 mb-3">{vendor.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {vendor.tags.map(tag => (
              <span key={tag} className="text-[11px] bg-[#E8F8F9] text-[#1CABB4] font-medium px-2.5 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#EAF5E4]">
          <div>
            <p className="text-[10px] text-[#8ABDB5] mb-0.5">Mulai dari</p>
            <p className="text-[#1CABB4] font-bold text-sm md:text-base">{formatPrice(vendor.price)}</p>
          </div>
          <Link href={`/store/${vendor.id}`} className="bg-[#1CABB4] hover:bg-[#178E96] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors">
            Lihat Paket
          </Link>
        </div>
      </div>
    </div>
  );
}