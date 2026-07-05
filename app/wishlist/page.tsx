"use client";
import Link from "next/link";
import { Heart, MapPin, Star, BadgeCheck, Trash2 } from "lucide-react";
import { vendors, formatPrice } from "@/data";
import { useWishlist } from "@/lib/useWishlist";

export default function WishlistPage() {
  const { wishlist, toggle } = useWishlist();
  const wishlistVendors = vendors.filter(v => wishlist.includes(v.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1A3A3C]"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Wishlist Saya
          </h1>
          <p className="text-sm text-[#8ABDB5] mt-0.5">
            {wishlistVendors.length} vendor tersimpan
          </p>
        </div>
        <Link href="/search"
          className="flex items-center gap-2 bg-[#1CABB4] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#178E96] transition-colors">
          + Cari Vendor
        </Link>
      </div>

      {/* Empty state */}
      {wishlistVendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="w-20 h-20 bg-[#FEF2F2] rounded-full flex items-center justify-center mb-4">
            <Heart size={32} className="text-[#EF4444]" />
          </div>
          <h2 className="text-lg font-bold text-[#1A3A3C] mb-2">Wishlist masih kosong</h2>
          <p className="text-sm text-[#8ABDB5] mb-6 max-w-xs">
            Tekan ikon ❤️ di halaman vendor atau halaman pencarian untuk menyimpan vendor favoritmu
          </p>
          <Link href="/search"
            className="bg-[#1CABB4] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#178E96] transition-colors">
            Cari Vendor Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistVendors.map(vendor => (
            <div key={vendor.id}
              className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_24px_rgba(28,171,180,0.15)] transition-all overflow-hidden group">
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img src={vendor.image} alt={vendor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-3 left-3 bg-[#1CABB4] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {vendor.categoryLabel}
                </span>
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/20 backdrop-blur rounded-lg px-2 py-1">
                  <Star size={11} fill="#F59E0B" className="text-[#F59E0B]" />
                  <span className="text-white text-xs font-bold">{vendor.rating}</span>
                  <span className="text-white/70 text-[10px]">({vendor.reviewCount})</span>
                </div>
                {/* Remove button */}
                <button onClick={() => toggle(vendor.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-[#FEF2F2] transition-colors group/btn">
                  <Heart size={15} className="fill-[#EF4444] text-[#EF4444] group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-1">
                  <img src={vendor.logo} alt="" className="w-8 h-8 rounded-lg object-cover border border-[#D4EAC8] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-bold text-sm text-[#1A3A3C] truncate">{vendor.name}</h3>
                      {vendor.isVerified && <BadgeCheck size={13} className="text-[#1CABB4] flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#8ABDB5]">
                      <MapPin size={9} />{vendor.location}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#4A7A6D] line-clamp-2 mb-3 leading-relaxed">{vendor.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {vendor.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-[#E8F8F9] text-[#1CABB4] font-medium px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EAF5E4]">
                  <div>
                    <p className="text-[10px] text-[#8ABDB5]">Mulai dari</p>
                    <p className="text-sm font-extrabold text-[#1CABB4]">{formatPrice(vendor.price)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(vendor.id)}
                      className="w-8 h-8 flex items-center justify-center border border-[#FEE2E2] text-[#EF4444] rounded-xl hover:bg-[#FEF2F2] transition-colors">
                      <Trash2 size={14} />
                    </button>
                    <Link href={`/store/${vendor.id}`}
                      className="bg-[#1CABB4] hover:bg-[#178E96] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors">
                      Lihat Paket
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}