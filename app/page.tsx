"use client";
import Link from "next/link";
import { Star, ArrowRight, Shield, Clock, Award, Search, Lock, CheckCircle, MessageCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import HeroBanner from "@/components/HeroBanner";
import AnimatedSection from "@/components/AnimatedSection";
import CounterAnimation from "@/components/CounterAnimation";
import NotificationToast from "@/components/NotificationToast";
import CategoryIcon from "@/components/CategoryIcon";
import { vendors, categories, formatPrice } from "@/data";

const STEPS = [
  {
    icon: <Search size={28} className="text-[#1CABB4]" />,
    step: "1", title: "Cari Vendor", desc: "Temukan vendor sesuai kebutuhanmu"
  },
  {
    icon: <MessageCircle size={28} className="text-[#1CABB4]" />,
    step: "2", title: "Konsultasi", desc: "Diskusikan detail acara dengan vendor"
  },
  {
    icon: <Calendar size={28} className="text-[#1CABB4]" />,
    step: "3", title: "Booking", desc: "Pilih paket dan lakukan pemesanan"
  },
  {
    icon: <Lock size={28} className="text-[#1CABB4]" />,
    step: "4", title: "Pembayaran Aman", desc: "Transaksi aman dengan sistem escrow"
  },
  {
    icon: <CheckCircle size={28} className="text-[#1CABB4]" />,
    step: "5", title: "Acara Selesai", desc: "Beri ulasan dan bagikan pengalamanmu"
  },
];

const TESTIMONIALS = [
  { name: "Anisa & Budi", event: "Wedding · Yogyakarta", text: "Festara sangat memudahkan proses booking vendor pernikahan kami. Semua vendor profesional dan responsif!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anisa", rating: 5 },
  { name: "PT. Maju Bersama", event: "Corporate Event · Jakarta", text: "Kami berhasil menemukan EO terbaik dalam waktu singkat. Sistemnya mudah dan pembayaran sangat aman.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maju", rating: 5 },
  { name: "Rina Sari", event: "Sweet 17 · Bandung", text: "Dekorasi ultah impian akhirnya terwujud! Vendor dari Festara hasilnya luar biasa, harga juga transparan.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rina", rating: 5 },
];

export default function HomePage() {
  return (
    <div className="space-y-8 py-4">
      <NotificationToast />
      <HeroBanner />

      {/* Stats */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: 1200, suffix: "+", label: "Vendor Terdaftar" },
            { value: 8500, suffix: "+", label: "Booking Selesai" },
            { value: 98, suffix: "%", label: "Kepuasan Klien" },
            { value: 50, suffix: "+", label: "Kota di Indonesia" },
          ].map((stat, i) => (
            <motion.div key={stat.label} className="text-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <p className="text-2xl md:text-3xl font-extrabold text-[#1CABB4]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                <CounterAnimation target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs text-[#4A7A6D] mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Kategori */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#0D545A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Kategori Populer</h2>
          <Link href="/search" className="text-sm text-[#1CABB4] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Lihat Semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          {categories.map((cat, i) => (
            <motion.div key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.97 }}>
              <Link href={`/search?cat=${cat.id}`}
                className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl hover:shadow-[0_8px_24px_rgba(28,171,180,0.15)] transition-all text-center group border border-[#EAF5E4]">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: cat.color + "12" }}>
                  <CategoryIcon id={cat.id} color={cat.color} size={32} />
                </div>
                <p className="text-xs font-semibold text-[#1A3A3C] leading-tight group-hover:text-[#1CABB4] transition-colors">{cat.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Vendor Unggulan */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#0D545A]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Vendor Unggulan</h2>
          <Link href="/search" className="text-sm text-[#1CABB4] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.slice(0, 3).map((vendor, i) => (
            <motion.div key={vendor.id}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }} className="cursor-pointer">
              <Link href={`/store/${vendor.id}`} className="block bg-white/90 backdrop-blur rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(28,171,180,0.08)] hover:shadow-[0_12px_32px_rgba(28,171,180,0.2)] transition-all">
                <div className="relative h-44 overflow-hidden">
                  <motion.img src={vendor.image} alt={vendor.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }} transition={{ duration: 0.4 }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#1CABB4] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{vendor.categoryLabel}</span>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/20 backdrop-blur rounded-lg px-2 py-1">
                    <Star size={11} fill="#F59E0B" className="text-[#F59E0B]" />
                    <span className="text-white text-xs font-bold">{vendor.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={vendor.logo} alt="" className="w-8 h-8 rounded-lg object-cover border border-[#D4EAC8]" />
                    <p className="font-bold text-sm text-[#1A3A3C]">{vendor.name}</p>
                  </div>
                  <p className="text-xs text-[#4A7A6D] mb-3 line-clamp-2">{vendor.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#8ABDB5]">Mulai dari</p>
                      <p className="font-extrabold text-[#1CABB4]">{formatPrice(vendor.price)}</p>
                    </div>
                    <span className="text-xs bg-[#E8F8F9] text-[#1CABB4] font-semibold px-3 py-1.5 rounded-xl">Lihat Paket</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Cara Kerja */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white/80 backdrop-blur rounded-3xl p-7 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold text-[#0D545A] text-center mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Cara Kerja Festara</h2>
          <p className="text-center text-sm text-[#4A7A6D] mb-10">Proses mudah dari pencarian hingga acara selesai</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {STEPS.map((item, index) => (
              <motion.div key={item.step} className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                {index < 4 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-gradient-to-r from-[#1CABB4] to-[#DBEBC9] z-0" />
                )}
                <motion.div
                  className="w-16 h-16 bg-white rounded-3xl shadow-[0_4px_16px_rgba(28,171,180,0.15)] flex items-center justify-center mb-3 relative z-10"
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

      {/* Testimonial */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-xl font-bold text-[#0D545A] mb-5 text-center" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Kata Mereka</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-[0_2px_12px_rgba(28,171,180,0.08)]">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="#F59E0B" className="text-[#F59E0B]" />)}
              </div>
              <p className="text-sm text-[#4A7A6D] leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt="" className="w-10 h-10 rounded-full bg-[#E8F8F9]" />
                <div>
                  <p className="font-bold text-sm text-[#1A3A3C]">{t.name}</p>
                  <p className="text-xs text-[#8ABDB5]">{t.event}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 md:px-6 pb-4">
        <motion.div className="bg-gradient-to-r from-[#0D545A] via-[#1CABB4] to-[#DBEBC9] rounded-3xl p-8 md:p-12 text-center"
          whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 200 }}>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Siap Wujudkan Acara Impianmu?
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">Bergabung dengan ribuan pelanggan yang sudah mempercayakan momen spesial mereka ke Festara</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/search" className="inline-flex items-center gap-2 bg-white text-[#1CABB4] font-bold px-6 py-3.5 rounded-2xl hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-shadow">
                Cari Vendor Sekarang <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/seller" className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-white/30 transition-colors border border-white/30">
                Daftarkan Vendor
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedSection>
    </div>
  );
}