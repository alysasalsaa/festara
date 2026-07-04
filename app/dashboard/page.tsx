"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Package, Heart, Bell, MapPin, Settings, ChevronRight, Star, CheckCircle2, Clock, XCircle, RotateCcw, Calendar, MessageCircle } from "lucide-react";
import { notifications, formatPrice, vendors } from "@/data";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "Menunggu Bayar",   color: "text-[#F59E0B] bg-[#FFF7ED]",  icon: <Clock size={12} /> },
  paid:       { label: "DP Terkonfirmasi", color: "text-[#1CABB4] bg-[#E8F8F9]",  icon: <CheckCircle2 size={12} /> },
  processing: { label: "Menunggu Konfirmasi Vendor", color: "text-[#6366F1] bg-[#EEF2FF]", icon: <RotateCcw size={12} /> },
  confirmed:  { label: "Terkonfirmasi",    color: "text-[#22C55E] bg-[#DCFCE7]",  icon: <CheckCircle2 size={12} /> },
  delivered:  { label: "Acara Selesai",    color: "text-[#15803D] bg-[#DCFCE7]",  icon: <CheckCircle2 size={12} /> },
  cancelled:  { label: "Dibatalkan",       color: "text-[#EF4444] bg-[#FEF2F2]",  icon: <XCircle size={12} /> },
};

type Tab = "orders" | "wishlist" | "notifications" | "addresses" | "profile";

interface Booking {
  id: string;
  date: string;
  status: string;
  vendorName: string;
  vendorLogo: string;
  category: string;
  paket: string;
  eventDate: string;
  eventLocation: string;
  guestName: string;
  notes: string;
  total: number;
  items: { productId: string; name: string; qty: number; price: number; image: string }[];
  storeName: string;
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("orders");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("festara_bookings") || "[]");
    setBookings(saved);
  }, []);

  const wishlistVendors = vendors.slice(0, 3);

  const sideItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "profile",       icon: <User size={17} />,    label: "Profil Saya" },
    { id: "orders",        icon: <Package size={17} />, label: "Pesanan Saya" },
    { id: "wishlist",      icon: <Heart size={17} />,   label: "Wishlist" },
    { id: "notifications", icon: <Bell size={17} />,    label: "Notifikasi" },
    { id: "addresses",     icon: <MapPin size={17} />,  label: "Alamat" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-xl font-bold text-[#1A3A3C] mb-6" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Akun Saya</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-3">
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1CABB4] to-[#178E96] flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">A</div>
            <p className="font-bold text-[#1A3A3C] text-sm">Alysa Salsabila</p>
            <p className="text-xs text-[#8ABDB5]">alysa@email.com</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
              <span className="text-xs font-semibold text-[#1A3A3C]">4.9</span>
              <span className="text-xs text-[#8ABDB5]">Member Silver</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
            {sideItems.map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${tab === item.id ? "bg-[#E8F8F9] text-[#1CABB4] font-semibold" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                {item.icon}
                <span className="text-sm">{item.label}</span>
                {tab === item.id && <ChevronRight size={14} className="ml-auto" />}
              </button>
            ))}
            <Link href="/seller" className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-[#4A7A6D] hover:bg-[#F0FBF5] border-t border-[#F8FAFC]">
              <Settings size={17} />
              <span className="text-sm">Dashboard Seller</span>
              <ChevronRight size={14} className="ml-auto" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">

          {/* ── TAB: PESANAN ── */}
          {tab === "orders" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#D4EAC8] flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Pesanan Saya</h2>
                {bookings.length > 0 && (
                  <span className="text-xs bg-[#1CABB4] text-white font-bold px-2.5 py-1 rounded-full">{bookings.length} booking</span>
                )}
              </div>

              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-base font-bold text-[#1A3A3C] mb-2">Belum ada booking</h3>
                  <p className="text-sm text-[#8ABDB5] mb-6">Temukan vendor terbaik dan lakukan booking pertamamu</p>
                  <Link href="/search" className="bg-[#1CABB4] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#178E96] transition-colors">
                    Cari Vendor Sekarang
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#F8FAFC]">
                  {bookings.map(order => {
                    const st = statusConfig[order.status] || statusConfig["processing"];
                    return (
                      <div key={order.id} className="p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-mono text-[#8ABDB5]">{order.id}</p>
                            <p className="text-xs text-[#8ABDB5]">{order.date} · {order.storeName}</p>
                          </div>
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>
                            {st.icon} {st.label}
                          </span>
                        </div>

                        {/* Vendor + paket */}
                        <div className="flex gap-3 mb-3">
                          <img
                            src={order.items[0].image}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-[#D4EAC8]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#8ABDB5] mb-0.5">{order.storeName}</p>
                            <p className="text-sm font-semibold text-[#1A3A3C] line-clamp-2">{order.items[0].name}</p>
                            {order.eventDate && (
                              <div className="flex items-center gap-1 text-xs text-[#8ABDB5] mt-1">
                                <Calendar size={11} />
                                {new Date(order.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                              </div>
                            )}
                            <p className="text-sm font-bold text-[#1CABB4] mt-1">{formatPrice(order.total)}</p>
                          </div>
                        </div>

                        {/* Status info */}
                        {order.status === "processing" && (
                          <div className="mb-3 bg-[#FFFBEB] border border-[#F59E0B]/20 rounded-xl px-3 py-2 text-xs text-[#F59E0B] font-semibold">
                            ⏳ Menunggu konfirmasi dari vendor
                          </div>
                        )}
                        {order.status === "paid" && (
                          <div className="mb-3 bg-[#E8F8F9] rounded-xl px-3 py-2 text-xs text-[#1CABB4] font-semibold">
                            ✓ DP terkonfirmasi — Tanggal acara sudah diamankan
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          {order.status === "delivered" && (
                            <button className="flex items-center gap-1 text-xs bg-[#1CABB4] text-white font-semibold px-3 py-2 rounded-xl hover:bg-[#178E96] transition-colors">
                              <Star size={12} /> Beri Ulasan
                            </button>
                          )}
                          <Link href="/chat" className="flex items-center gap-1 text-xs border border-[#D4EAC8] text-[#4A7A6D] font-semibold px-3 py-2 rounded-xl hover:border-[#1CABB4] hover:text-[#1CABB4] transition-colors">
                            <MessageCircle size={12} /> Chat Vendor
                          </Link>
                          <button className="flex items-center gap-1 text-xs border border-[#D4EAC8] text-[#4A7A6D] font-semibold px-3 py-2 rounded-xl hover:border-[#1CABB4] hover:text-[#1CABB4] transition-colors">
                            Detail Booking
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: NOTIFIKASI ── */}
          {tab === "notifications" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#D4EAC8] flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Notifikasi</h2>
                <button className="text-xs text-[#1CABB4] font-semibold">Tandai semua dibaca</button>
              </div>
              <div className="divide-y divide-[#F8FAFC]">
                {notifications.map(n => (
                  <div key={n.id} className={`flex gap-3 p-5 ${!n.isRead ? "bg-[#F0FBF5]" : ""}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg ${n.type === "order" ? "bg-[#E8F8F9]" : n.type === "promo" ? "bg-[#FFF7ED]" : n.type === "chat" ? "bg-[#EEF2FF]" : "bg-[#F0FBF5]"}`}>
                      {n.type === "order" ? "📅" : n.type === "promo" ? "🎁" : n.type === "chat" ? "💬" : "🔔"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#1A3A3C]">{n.title}</p>
                        {!n.isRead && <div className="w-2 h-2 bg-[#1CABB4] rounded-full flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-xs text-[#4A7A6D] mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-[#8ABDB5] mt-1">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: PROFIL ── */}
          {tab === "profile" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
              <h2 className="font-bold text-[#1A3A3C] mb-5">Profil Saya</h2>
              <div className="flex items-center gap-4 mb-7">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1CABB4] to-[#178E96] flex items-center justify-center text-white text-3xl font-bold">A</div>
                <div>
                  <p className="font-bold text-[#1A3A3C]">Alysa Salsabila Irfan Putri</p>
                  <p className="text-sm text-[#8ABDB5]">Bergabung sejak Januari 2024</p>
                  <button className="text-xs text-[#1CABB4] font-semibold mt-1 hover:underline">Ganti Foto Profil</button>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Nama Lengkap", value: "Alysa Salsabila Irfan Putri" },
                  { label: "Email", value: "alysa@email.com" },
                  { label: "Nomor HP", value: "0812-3456-7890" },
                  { label: "Tanggal Lahir", value: "15 Maret 2000" },
                ].map(field => (
                  <div key={field.label}>
                    <label className="text-xs font-medium text-[#8ABDB5] block mb-1">{field.label}</label>
                    <input defaultValue={field.value} className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-4 py-3 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
                  </div>
                ))}
                <button className="w-full bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-3.5 rounded-2xl transition-colors mt-2">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* ── TAB: WISHLIST ── */}
          {tab === "wishlist" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
              <h2 className="font-bold text-[#1A3A3C] mb-5">Wishlist Vendor</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlistVendors.map(v => (
                  <Link key={v.id} href={`/store/${v.id}`}
                    className="border border-[#D4EAC8] rounded-2xl overflow-hidden hover:border-[#1CABB4] hover:shadow-[0_4px_16px_rgba(28,171,180,0.12)] transition-all group">
                    <div className="relative h-32 overflow-hidden">
                      <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-2 left-2 bg-[#1CABB4] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{v.categoryLabel}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-[#1A3A3C] line-clamp-1">{v.name}</p>
                      <p className="text-xs text-[#8ABDB5] mt-0.5">{v.location}</p>
                      <p className="text-sm font-bold text-[#1CABB4] mt-1">Mulai {formatPrice(v.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: ALAMAT ── */}
          {tab === "addresses" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
              <h2 className="font-bold text-[#1A3A3C] mb-5">Daftar Alamat</h2>
              <div className="space-y-3">
                {[
                  { label: "Rumah", name: "Alysa Salsabila", phone: "0812-3456-7890", detail: "Jl. Pahlawan No. 12, Kec. Sukajadi, Bandung, Jawa Barat 40122", isMain: true },
                  { label: "Kantor", name: "Alysa Salsabila", phone: "0812-3456-7890", detail: "Jl. Gatot Subroto No. 45, Jakarta Selatan, DKI Jakarta 12950", isMain: false },
                ].map((addr, i) => (
                  <div key={i} className={`p-4 rounded-2xl border-2 ${addr.isMain ? "border-[#1CABB4] bg-[#E8F8F9]" : "border-[#D4EAC8]"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-[#D4EAC8]">{addr.label}</span>
                        {addr.isMain && <span className="text-xs font-bold bg-[#1CABB4] text-white px-2 py-0.5 rounded-full">Utama</span>}
                      </div>
                      <button className="text-xs text-[#1CABB4] font-semibold">Edit</button>
                    </div>
                    <p className="text-sm font-semibold text-[#1A3A3C]">{addr.name}</p>
                    <p className="text-xs text-[#8ABDB5]">{addr.phone}</p>
                    <p className="text-xs text-[#4A7A6D] mt-1">{addr.detail}</p>
                  </div>
                ))}
                <button className="w-full py-4 border-2 border-dashed border-[#D4EAC8] rounded-2xl text-sm text-[#8ABDB5] hover:border-[#1CABB4] hover:text-[#1CABB4] transition-colors">
                  + Tambah Alamat Baru
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}