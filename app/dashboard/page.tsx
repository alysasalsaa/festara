"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Package, Heart, Bell, MapPin, Settings, ChevronRight, Star, CheckCircle2, Clock, XCircle, RotateCcw, Calendar, MessageCircle, X, Store } from "lucide-react";
import { notifications, formatPrice, vendors } from "@/data";
import { useAuth } from "@/lib/useAuth";
import { useWishlist } from "@/lib/useWishlist";
import { supabase } from "@/lib/supabase";
import VendorRegisterForm from "@/components/VendorRegisterForm";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "Menunggu Bayar",      color: "text-[#F59E0B] bg-[#FFF7ED]",  icon: <Clock size={12} /> },
  paid:       { label: "DP Terkonfirmasi",    color: "text-[#1CABB4] bg-[#E8F8F9]",  icon: <CheckCircle2 size={12} /> },
  processing: { label: "Menunggu Konfirmasi", color: "text-[#6366F1] bg-[#EEF2FF]",  icon: <RotateCcw size={12} /> },
  confirmed:  { label: "Terkonfirmasi",       color: "text-[#22C55E] bg-[#DCFCE7]",  icon: <CheckCircle2 size={12} /> },
  delivered:  { label: "Acara Selesai",       color: "text-[#15803D] bg-[#DCFCE7]",  icon: <CheckCircle2 size={12} /> },
  cancelled:  { label: "Dibatalkan",          color: "text-[#EF4444] bg-[#FEF2F2]",  icon: <XCircle size={12} /> },
};

type Tab = "orders" | "wishlist" | "notifications" | "addresses" | "profile";

interface Booking {
  id: string; date: string; status: string; vendorName: string; vendorLogo: string;
  category: string; paket: string; eventDate: string; eventLocation: string;
  guestName: string; total: number;
  items: { productId: string; name: string; qty: number; price: number; image: string }[];
  storeName: string;
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("orders");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vendorStatus, setVendorStatus] = useState<"none" | "pending" | "approved">("none");
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorApplied, setVendorApplied] = useState(false);
  const { user } = useAuth();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("festara_bookings") || "[]");
    setBookings(saved);
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("vendor_applications").select("status").eq("user_id", user.id).single()
      .then(({ data }) => {
        if (data) setVendorStatus(data.status === "approved" ? "approved" : "pending");
      });
  }, [user]);

  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Pengguna";
  const email = user?.email || "";
  const phone = user?.user_metadata?.phone || "";
  const avatarLetter = fullName[0]?.toUpperCase() || "?";
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) : "";

  const wishlistVendors = vendors.filter(v => wishlist.includes(v.id));

  const sideItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "profile",       icon: <User size={17} />,    label: "Profil Saya" },
    { id: "orders",        icon: <Package size={17} />, label: "Pesanan Saya" },
    { id: "wishlist",      icon: <Heart size={17} />,   label: "Wishlist" },
    { id: "notifications", icon: <Bell size={17} />,    label: "Notifikasi" },
    { id: "addresses",     icon: <MapPin size={17} />,  label: "Alamat" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">

      {/* Modal Daftar Vendor */}
      {showVendorForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowVendorForm(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]">
              <X size={18} className="text-[#8ABDB5]" />
            </button>
            {vendorApplied ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-lg font-bold text-[#1A3A3C] mb-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Pendaftaran Terkirim!</h2>
                <p className="text-sm text-[#4A7A6D] mb-5">Tim Festara akan meninjau pendaftaranmu dalam 1-3 hari kerja.</p>
                <button onClick={() => { setShowVendorForm(false); setVendorStatus("pending"); }}
                  className="w-full bg-[#1CABB4] text-white font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors">Tutup</button>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <div className="w-12 h-12 bg-[#E8F8F9] rounded-2xl flex items-center justify-center mb-3">
                    <Store size={22} className="text-[#1CABB4]" />
                  </div>
                  <h2 className="text-lg font-bold text-[#1A3A3C]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Daftarkan Vendor</h2>
                  <p className="text-xs text-[#8ABDB5] mt-1">Isi data bisnis kamu untuk bergabung sebagai vendor Festara</p>
                </div>
                <VendorRegisterForm onSuccess={() => setVendorApplied(true)} />
              </>
            )}
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold text-[#1A3A3C] mb-6" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Akun Saya</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-3">
          <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1CABB4] to-[#178E96] flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">{avatarLetter}</div>
            <p className="font-bold text-[#1A3A3C] text-sm truncate w-full px-1">{fullName}</p>
            <p className="text-xs text-[#8ABDB5] truncate w-full px-1">{email}</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
              <span className="text-xs font-semibold text-[#1A3A3C]">Baru</span>
              <span className="text-xs text-[#8ABDB5]">Member</span>
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
            {vendorStatus === "approved" ? (
              <Link href="/seller" className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-[#4A7A6D] hover:bg-[#F0FBF5] border-t border-[#EAF5E4] transition-colors">
                <Settings size={17} /><span className="text-sm">Dashboard Seller</span><ChevronRight size={14} className="ml-auto" />
              </Link>
            ) : vendorStatus === "pending" ? (
              <div className="px-4 py-3.5 border-t border-[#EAF5E4]">
                <div className="flex items-center gap-2 text-[#F59E0B]"><Clock size={16} /><span className="text-xs font-semibold">Pendaftaran Vendor</span></div>
                <p className="text-[10px] text-[#8ABDB5] mt-1">Sedang ditinjau tim Festara</p>
              </div>
            ) : (
              <button onClick={() => setShowVendorForm(true)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-[#1CABB4] hover:bg-[#E8F8F9] border-t border-[#EAF5E4] transition-colors">
                <Store size={17} /><span className="text-sm font-semibold">Daftarkan Vendor</span><ChevronRight size={14} className="ml-auto" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">

          {/* PROFIL */}
          {tab === "profile" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
              <h2 className="font-bold text-[#1A3A3C] mb-5">Profil Saya</h2>
              <div className="flex items-center gap-4 mb-7">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1CABB4] to-[#178E96] flex items-center justify-center text-white text-3xl font-bold">{avatarLetter}</div>
                <div>
                  <p className="font-bold text-[#1A3A3C]">{fullName}</p>
                  {joinDate && <p className="text-sm text-[#8ABDB5]">Bergabung sejak {joinDate}</p>}
                  <button className="text-xs text-[#1CABB4] font-semibold mt-1 hover:underline">Ganti Foto Profil</button>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Nama Lengkap", value: fullName },
                  { label: "Email", value: email },
                  { label: "Nomor HP", value: phone },
                ].map(field => (
                  <div key={field.label}>
                    <label className="text-xs font-medium text-[#8ABDB5] block mb-1">{field.label}</label>
                    <input defaultValue={field.value} className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-4 py-3 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
                  </div>
                ))}
                <button className="w-full bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-3.5 rounded-2xl transition-colors mt-2">Simpan Perubahan</button>
              </div>
            </div>
          )}

          {/* PESANAN */}
          {tab === "orders" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#EAF5E4] flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Pesanan Saya</h2>
                {bookings.length > 0 && <span className="text-xs bg-[#1CABB4] text-white font-bold px-2.5 py-1 rounded-full">{bookings.length} booking</span>}
              </div>
              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-base font-bold text-[#1A3A3C] mb-2">Belum ada booking</h3>
                  <p className="text-sm text-[#8ABDB5] mb-6">Temukan vendor terbaik dan lakukan booking pertamamu</p>
                  <Link href="/search" className="bg-[#1CABB4] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#178E96] transition-colors">Cari Vendor Sekarang</Link>
                </div>
              ) : (
                <div className="divide-y divide-[#EAF5E4]">
                  {bookings.map(order => {
                    const st = statusConfig[order.status] || statusConfig["processing"];
                    return (
                      <div key={order.id} className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs font-mono text-[#8ABDB5]">{order.id}</p>
                            <p className="text-xs text-[#8ABDB5]">{order.date} · {order.storeName}</p>
                          </div>
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>{st.icon} {st.label}</span>
                        </div>
                        <div className="flex gap-3 mb-3">
                          <img src={order.items[0].image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-[#D4EAC8]" />
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
                        <div className="flex gap-2">
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

          {/* NOTIFIKASI */}
          {tab === "notifications" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#EAF5E4] flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Notifikasi</h2>
                <button className="text-xs text-[#1CABB4] font-semibold">Tandai semua dibaca</button>
              </div>
              <div className="divide-y divide-[#EAF5E4]">
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

          {/* WISHLIST */}
          {tab === "wishlist" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
              <h2 className="font-bold text-[#1A3A3C] mb-5">Wishlist Vendor</h2>
              {wishlistVendors.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">🤍</div>
                  <p className="font-bold text-[#1A3A3C] mb-2">Wishlist masih kosong</p>
                  <p className="text-sm text-[#8ABDB5] mb-5">Tekan ikon ❤️ di halaman vendor untuk menyimpan</p>
                  <Link href="/search" className="bg-[#1CABB4] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[#178E96] transition-colors">
                    Cari Vendor
                  </Link>
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* ALAMAT */}
          {tab === "addresses" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
              <h2 className="font-bold text-[#1A3A3C] mb-5">Daftar Alamat</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border-2 border-[#1CABB4] bg-[#E8F8F9]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-[#D4EAC8]">Utama</span>
                      <span className="text-xs font-bold bg-[#1CABB4] text-white px-2 py-0.5 rounded-full">Aktif</span>
                    </div>
                    <button className="text-xs text-[#1CABB4] font-semibold">Edit</button>
                  </div>
                  <p className="text-sm font-semibold text-[#1A3A3C]">{fullName}</p>
                  <p className="text-xs text-[#8ABDB5]">{phone || "-"}</p>
                  <p className="text-xs text-[#4A7A6D] mt-1">Belum diisi</p>
                </div>
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