"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, ArrowRight, Shield, Clock, Award, X, Store } from "lucide-react";
import { motion } from "framer-motion";
import HeroBanner from "@/components/HeroBanner";
import AnimatedSection from "@/components/AnimatedSection";
import StatsSection from "@/components/StatsSection";
import CategoryIcon from "@/components/CategoryIcon";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReviewForm from "@/components/ReviewForm";
import NotificationToast from "@/components/NotificationToast";
import VendorRegisterForm from "@/components/VendorRegisterForm";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import { categories, formatPrice } from "@/data";

const STEPS = [
  { icon: "🔍", step: "1", title: "Cari Vendor", desc: "Temukan vendor sesuai kebutuhanmu" },
  { icon: "💬", step: "2", title: "Konsultasi", desc: "Diskusikan detail acara dengan vendor" },
  { icon: "📅", step: "3", title: "Booking", desc: "Pilih paket dan lakukan pemesanan" },
  { icon: "🔒", step: "4", title: "Pembayaran Aman", desc: "Transaksi aman dengan sistem escrow" },
  { icon: "🎉", step: "5", title: "Acara Selesai", desc: "Beri ulasan dan bagikan pengalamanmu" },
];

type FeaturedVendor = {
  id: string;
  name: string;
  category_id: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  rating: number | null;
  minPrice: number | null;
};

export default function HomePage() {
  const { user } = useAuth();
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [vendorApplied, setVendorApplied] = useState(false);
  const [testimonialsKey, setTestimonialsKey] = useState(0);

  const [featuredVendors, setFeaturedVendors] = useState<FeaturedVendor[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    // Tunggu sebentar supaya animasi masuk halaman (PageTransition) selesai dulu,
    // baru scroll manual ke elemen anchor-nya — browser sering gagal auto-scroll
    // karena elemen belum "settle" posisinya waktu masih dianimasikan.
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function scrollToHash(delay: number) {
      if (!window.location.hash) return;
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, delay);
    }

    // Kalau halaman ini baru dimuat langsung dengan hash di URL (misal buka dari halaman lain)
    scrollToHash(400);

    // Kalau user sudah di halaman ini dan klik link hash — browser cuma ganti hash tanpa reload,
    // jadi perlu didengarkan terpisah lewat event "hashchange"
    function handleHashChange() {
      scrollToHash(100);
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="space-y-8 py-4">
      <NotificationToast />

      {/* Modal Daftar Vendor */}
      {showVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowVendorModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]">
              <X size={18} className="text-[#8ABDB5]" />
            </button>
            {vendorApplied ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-lg font-bold text-[#1A3A3C] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  Pendaftaran Terkirim!
                </h2>
                <p className="text-sm text-[#4A7A6D] mb-5">
                  Tim Festara akan meninjau pendaftaranmu dalam 1-3 hari kerja. Kamu akan mendapat notifikasi via email.
                </p>
                <button onClick={() => setShowVendorModal(false)}
                  className="w-full bg-[#1CABB4] text-white font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors">
                  Tutup
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <div className="w-12 h-12 bg-[#E8F8F9] rounded-2xl flex items-center justify-center mb-3">
                    <Store size={22} className="text-[#1CABB4]" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1A3A3C]"
                    style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    Daftarkan Vendor
                  </h2>
                  <p className="text-xs text-[#8ABDB5] mt-1">
                    Isi data bisnis kamu untuk bergabung sebagai vendor Festara
                  </p>
                </div>
                {user ? (
                  <VendorRegisterForm onSuccess={() => setVendorApplied(true)} />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-[#4A7A6D] mb-5">
                      Kamu perlu login dulu sebelum mendaftarkan vendor
                    </p>
                    <div className="space-y-3">
                      <a href="/login"
                        className="block w-full bg-[#1CABB4] text-white font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors text-center">
                        Masuk ke Akun
                      </a>
                      <a href="/register"
                        className="block w-full border border-[#D4EAC8] text-[#4A7A6D] font-semibold py-3 rounded-xl hover:border-[#1CABB4] hover:text-[#1CABB4] transition-colors text-center">
                        Daftar Gratis
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <HeroBanner />

      {/* Stats — data asli dari Supabase (components/StatsSection.tsx) */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <StatsSection />
      </AnimatedSection>

      {/* Kategori */}
<AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-xl font-bold text-[#0D545A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Kategori Populer</h2>
    <Link href="/search" className="text-sm text-[#1CABB4] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
      Lihat Semua <ArrowRight size={14} />
    </Link>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-fr">
    {categories.map((cat, i) => (
      <motion.div key={cat.id}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
        whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }}
        className="h-full">
        <Link href={`/search?cat=${cat.id}`}
          className="h-full flex flex-col items-center justify-start gap-3 p-4 bg-white rounded-2xl hover:shadow-[0_8px_24px_rgba(28,171,180,0.15)] transition-all text-center group border border-[#EAF5E4]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: cat.color + "12" }}>
            <CategoryIcon id={cat.id} color={cat.color} size={30} />
          </div>
          <p className="text-xs font-semibold text-[#1A3A3C] leading-tight group-hover:text-[#1CABB4] transition-colors flex items-center justify-center min-h-[2rem]">
            {cat.name}
          </p>
        </Link>
      </motion.div>
    ))}
  </div>
</AnimatedSection>

      {/* Vendor Unggulan — data asli dari Supabase, 3 vendor aktif dengan rating tertinggi */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#0D545A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Vendor Unggulan</h2>
          <Link href="/search" className="text-sm text-[#1CABB4] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>
        {featuredLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : featuredVendors.length === 0 ? (
          <p className="text-center text-sm text-[#4A7A6D] py-16 bg-white/80 rounded-2xl">Belum ada vendor untuk ditampilkan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredVendors.map((vendor, i) => {
              const categoryLabel = categories.find(c => c.id === vendor.category_id)?.name || "Vendor";
              const coverImage = vendor.cover_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop";
              const logoImage = vendor.logo_url || "https://api.dicebear.com/7.x/shapes/svg?seed=" + vendor.id;

              return (
                <motion.div key={vendor.id}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }} className="cursor-pointer">
                  <Link href={`/store/${vendor.id}`} className="block bg-white/90 backdrop-blur rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(28,171,180,0.08)] hover:shadow-[0_12px_32px_rgba(28,171,180,0.2)] transition-all">
                    <div className="relative h-44 overflow-hidden">
                      <motion.img src={coverImage} alt={vendor.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }} transition={{ duration: 0.4 }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute top-3 left-3 bg-[#1CABB4] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{categoryLabel}</span>
                      {vendor.rating != null && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/20 backdrop-blur rounded-lg px-2 py-1">
                          <Star size={11} fill="#F59E0B" className="text-[#F59E0B]" />
                          <span className="text-white text-xs font-bold">{vendor.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={logoImage} alt="" className="w-8 h-8 rounded-lg object-cover border border-[#D4EAC8]" />
                        <p className="font-bold text-sm text-[#1A3A3C]">{vendor.name}</p>
                      </div>
                      <p className="text-xs text-[#4A7A6D] mb-3 line-clamp-2">{vendor.description || "Vendor ini belum menambahkan deskripsi."}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-[#8ABDB5]">Mulai dari</p>
                          <p className="font-extrabold text-[#1CABB4]">{vendor.minPrice != null ? formatPrice(vendor.minPrice) : "Hubungi vendor"}</p>
                        </div>
                        <span className="text-xs bg-[#E8F8F9] text-[#1CABB4] font-semibold px-3 py-1.5 rounded-xl">Lihat Paket</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatedSection>

      {/* Cara Kerja */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white/80 backdrop-blur rounded-3xl p-7 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold text-[#0D545A] text-center mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Cara Kerja Festara</h2>
          <p className="text-center text-sm text-[#4A7A6D] mb-10">Proses mudah dari pencarian hingga acara selesai</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {STEPS.map((item, index) => (
              <motion.div key={item.step} className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                {index < 4 && <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-gradient-to-r from-[#1CABB4] to-[#DBEBC9] z-0" />}
                <motion.div className="w-16 h-16 bg-white rounded-3xl shadow-[0_4px_16px_rgba(28,171,180,0.15)] flex items-center justify-center text-3xl mb-3 relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#1CABB4] text-white text-xs font-bold rounded-full flex items-center justify-center">{item.step}</span>
                </motion.div>
                <h3 className="font-bold text-sm text-[#1A3A3C] mb-1">{item.title}</h3>
                <p className="text-xs text-[#4A7A6D] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Keunggulan */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Shield size={28} className="text-[#1CABB4]" />, title: "Pembayaran Aman", desc: "Dana tersimpan di escrow, hanya cair setelah acara selesai dan kamu konfirmasi" },
            { icon: <Award size={28} className="text-[#1CABB4]" />, title: "Vendor Terverifikasi", desc: "Semua vendor melewati proses seleksi dan verifikasi ketat dari tim Festara" },
            { icon: <Clock size={28} className="text-[#1CABB4]" />, title: "Booking Real-time", desc: "Langsung chat, pilih tanggal, dan bayar — proses booking selesai dalam menit" },
          ].map((item, i) => (
            <motion.div key={item.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-[0_2px_12px_rgba(28,171,180,0.08)]">
              <div className="w-14 h-14 bg-[#E8F8F9] rounded-2xl flex items-center justify-center mb-4">{item.icon}</div>
              <h3 className="font-bold text-[#1A3A3C] mb-2">{item.title}</h3>
              <p className="text-sm text-[#4A7A6D] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Testimonial — data asli dari Supabase (components/TestimonialsSection.tsx) */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-xl font-bold text-[#0D545A] mb-5 text-center"
          style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Kata Mereka</h2>
        <TestimonialsSection key={testimonialsKey} />
        <div className="mt-8">
          <ReviewForm onSubmitted={() => setTestimonialsKey((k) => k + 1)} />
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6 pb-4">
        <motion.div className="bg-gradient-to-r from-[#0D545A] via-[#1CABB4] to-[#DBEBC9] rounded-3xl p-8 md:p-12 text-center"
          whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 200 }}>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Siap Wujudkan Acara Impianmu?
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Bergabung dengan ribuan pelanggan yang sudah mempercayakan momen spesial mereka ke Festara
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/search" className="inline-flex items-center gap-2 bg-white text-[#1CABB4] font-bold px-6 py-3.5 rounded-2xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow">
                Cari Vendor Sekarang <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button onClick={() => setShowVendorModal(true)}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-white/30 transition-colors border border-white/30">
                Daftarkan Vendor
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
}