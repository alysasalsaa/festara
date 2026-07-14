"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Package, Heart, Bell, MapPin, Settings, ChevronRight, Star, CheckCircle2, Clock, XCircle, RotateCcw, Calendar, MessageCircle, X, Store } from "lucide-react";
import { formatPrice, categories } from "@/data";
import { useAuth } from "@/lib/useAuth";
import { useWishlist } from "@/lib/useWishlist";
import { supabase } from "@/lib/supabase";
import VendorRegisterForm from "@/components/VendorRegisterForm";

type Tab = "orders" | "wishlist" | "notifications" | "addresses" | "profile";

type BookingRow = {
  id: string;
  event_date: string;
  event_location: string | null;
  guest_name: string;
  status: string;
  total_price: number;
  created_at: string;
  vendors: { id: string; name: string; logo_url: string | null } | null;
  packages: { name: string } | null;
  transactions: { status: string; order_id: string; rejection_reason: string | null }[] | null;
};

type WishlistVendor = {
  id: string;
  name: string;
  category_id: string;
  location: string | null;
  logo_url: string | null;
  cover_url: string | null;
  minPrice: number | null;
};

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

function getNotificationIcon(type: string): { emoji: string; bg: string } {
  if (type.includes("payment")) return { emoji: "💳", bg: "bg-[#E8F8F9]" };
  if (type.includes("vendor")) return { emoji: "🏪", bg: "bg-[#FFF7ED]" };
  if (type.includes("chat") || type.includes("message")) return { emoji: "💬", bg: "bg-[#EEF2FF]" };
  if (type.includes("booking") || type.includes("order")) return { emoji: "📅", bg: "bg-[#E8F8F9]" };
  return { emoji: "🔔", bg: "bg-[#F0FBF5]" };
}

function getStatusInfo(booking: BookingRow): { label: string; color: string; icon: React.ReactNode } {
  const trx = booking.transactions?.[0];

  if (booking.status === "cancelled") {
    return { label: "Dibatalkan", color: "text-[#EF4444] bg-[#FEF2F2]", icon: <XCircle size={12} /> };
  }
  if (booking.status === "completed") {
    return { label: "Acara Selesai", color: "text-[#15803D] bg-[#DCFCE7]", icon: <CheckCircle2 size={12} /> };
  }
  if (!trx || trx.status === "pending") {
    return { label: "Menunggu Pembayaran", color: "text-[#F59E0B] bg-[#FFF7ED]", icon: <Clock size={12} /> };
  }
  if (trx.status === "waiting_verification") {
    return { label: "Menunggu Verifikasi", color: "text-[#F59E0B] bg-[#FFF7ED]", icon: <RotateCcw size={12} /> };
  }
  if (trx.status === "rejected") {
    return { label: "Bukti Ditolak", color: "text-[#EF4444] bg-[#FEF2F2]", icon: <XCircle size={12} /> };
  }
  if (trx.status === "paid" || trx.status === "disbursed") {
    return { label: "Terkonfirmasi", color: "text-[#22C55E] bg-[#DCFCE7]", icon: <CheckCircle2 size={12} /> };
  }
  return { label: "Diproses", color: "text-[#6366F1] bg-[#EEF2FF]", icon: <RotateCcw size={12} /> };
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("orders");
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [vendorStatus, setVendorStatus] = useState<"none" | "pending" | "approved">("none");
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorApplied, setVendorApplied] = useState(false);
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const [wishlistVendors, setWishlistVendors] = useState<WishlistVendor[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [notificationsList, setNotificationsList] = useState<NotificationRow[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  async function fetchNotifications(userId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setNotificationsList(data as NotificationRow[]);
    setNotificationsLoading(false);
  }

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id);

    const channel = supabase
      .channel(`buyer-notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => fetchNotifications(user.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function markAllNotificationsRead() {
    if (!user) return;
    setNotificationsList((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
  }

  useEffect(() => {
    async function fetchWishlistVendors() {
      if (wishlist.length === 0) {
        setWishlistVendors([]);
        setWishlistLoading(false);
        return;
      }
      setWishlistLoading(true);
      const { data, error } = await supabase
        .from("vendors")
        .select("id, name, category_id, location, logo_url, cover_url, packages(price, is_active)")
        .in("id", wishlist);

      if (!error && data) {
        const mapped: WishlistVendor[] = data.map((v: any) => {
          const activePackages = (v.packages || []).filter((p: any) => p.is_active);
          const minPrice = activePackages.length > 0 ? Math.min(...activePackages.map((p: any) => p.price)) : null;
          return {
            id: v.id,
            name: v.name,
            category_id: v.category_id,
            location: v.location,
            logo_url: v.logo_url,
            cover_url: v.cover_url,
            minPrice,
          };
        });
        setWishlistVendors(mapped);
      }
      setWishlistLoading(false);
    }
    fetchWishlistVendors();
  }, [wishlist]);

  async function fetchBookings(userId: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `id, event_date, event_location, guest_name, status, total_price, created_at,
        vendors ( id, name, logo_url ),
        packages ( name ),
        transactions ( status, order_id, rejection_reason )`
      )
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setBookings(data as unknown as BookingRow[]);
    setBookingsLoading(false);
  }

  useEffect(() => {
    if (!user) return;
    fetchBookings(user.id);

    // Dengarkan realtime perubahan status transaksi (misal admin baru saja verifikasi pembayaran)
    const channel = supabase
      .channel(`buyer-orders-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "transactions" },
        () => fetchBookings(user.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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

          {/* PESANAN — data asli dari Supabase (bookings + transactions) */}
          {tab === "orders" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#EAF5E4] flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Pesanan Saya</h2>
                {bookings.length > 0 && <span className="text-xs bg-[#1CABB4] text-white font-bold px-2.5 py-1 rounded-full">{bookings.length} booking</span>}
              </div>
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-base font-bold text-[#1A3A3C] mb-2">Belum ada booking</h3>
                  <p className="text-sm text-[#8ABDB5] mb-6">Temukan vendor terbaik dan lakukan booking pertamamu</p>
                  <Link href="/search" className="bg-[#1CABB4] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#178E96] transition-colors">Cari Vendor Sekarang</Link>
                </div>
              ) : (
                <div className="divide-y divide-[#EAF5E4]">
                  {bookings.map(order => {
                    const st = getStatusInfo(order);
                    const trx = order.transactions?.[0];
                    const logoImage = order.vendors?.logo_url || "https://api.dicebear.com/7.x/shapes/svg?seed=" + (order.vendors?.id || order.id);

                    return (
                      <div key={order.id} className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            {trx?.order_id && <p className="text-xs font-mono text-[#8ABDB5]">{trx.order_id}</p>}
                            <p className="text-xs text-[#8ABDB5]">
                              {new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · {order.vendors?.name || "Vendor"}
                            </p>
                          </div>
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${st.color}`}>{st.icon} {st.label}</span>
                        </div>

                        {st.label === "Bukti Ditolak" && trx?.rejection_reason && (
                          <div className="bg-[#FEF2F2] rounded-xl px-3 py-2 mb-3">
                            <p className="text-xs text-[#B91C1C]">Alasan: {trx.rejection_reason}</p>
                          </div>
                        )}

                        <div className="flex gap-3 mb-3">
                          <img src={logoImage} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-[#D4EAC8]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#8ABDB5] mb-0.5">{order.vendors?.name || "Vendor"}</p>
                            <p className="text-sm font-semibold text-[#1A3A3C] line-clamp-2">{order.packages?.name || "Paket"}</p>
                            {order.event_date && (
                              <div className="flex items-center gap-1 text-xs text-[#8ABDB5] mt-1">
                                <Calendar size={11} />
                                {new Date(order.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                              </div>
                            )}
                            <p className="text-sm font-bold text-[#1CABB4] mt-1">{formatPrice(order.total_price)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {order.vendors?.id && (
                            <Link href={`/chat?vendor=${order.vendors.id}`} className="flex items-center gap-1 text-xs border border-[#D4EAC8] text-[#4A7A6D] font-semibold px-3 py-2 rounded-xl hover:border-[#1CABB4] hover:text-[#1CABB4] transition-colors">
                              <MessageCircle size={12} /> Chat Vendor
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* NOTIFIKASI — data asli dari Supabase */}
          {tab === "notifications" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#EAF5E4] flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Notifikasi</h2>
                {notificationsList.some((n) => !n.is_read) && (
                  <button onClick={markAllNotificationsRead} className="text-xs text-[#1CABB4] font-semibold">Tandai semua dibaca</button>
                )}
              </div>
              {notificationsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notificationsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <div className="text-5xl mb-3">🔔</div>
                  <p className="font-bold text-[#1A3A3C] mb-1">Belum ada notifikasi</p>
                  <p className="text-sm text-[#8ABDB5]">Notifikasi soal pesanan & pembayaran akan muncul di sini</p>
                </div>
              ) : (
                <div className="divide-y divide-[#EAF5E4]">
                  {notificationsList.map((n) => {
                    const icon = getNotificationIcon(n.type);
                    return (
                      <div key={n.id} className={`flex gap-3 p-5 ${!n.is_read ? "bg-[#F0FBF5]" : ""}`}>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg ${icon.bg}`}>
                          {icon.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-[#1A3A3C]">{n.title}</p>
                            {!n.is_read && <div className="w-2 h-2 bg-[#1CABB4] rounded-full flex-shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-[#4A7A6D] mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-[#8ABDB5] mt-1">
                            {new Date(n.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST — data asli dari Supabase */}
          {tab === "wishlist" && (
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
              <h2 className="font-bold text-[#1A3A3C] mb-5">Wishlist Vendor</h2>
              {wishlistLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : wishlistVendors.length === 0 ? (
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
                  {wishlistVendors.map(v => {
                    const categoryLabel = categories.find(c => c.id === v.category_id)?.name || "Vendor";
                    const coverImage = v.cover_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop";
                    return (
                      <Link key={v.id} href={`/store/${v.id}`}
                        className="border border-[#D4EAC8] rounded-2xl overflow-hidden hover:border-[#1CABB4] hover:shadow-[0_4px_16px_rgba(28,171,180,0.12)] transition-all group">
                        <div className="relative h-32 overflow-hidden">
                          <img src={coverImage} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-2 left-2 bg-[#1CABB4] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{categoryLabel}</span>
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-bold text-[#1A3A3C] line-clamp-1">{v.name}</p>
                          <p className="text-xs text-[#8ABDB5] mt-0.5">{v.location || "-"}</p>
                          <p className="text-sm font-bold text-[#1CABB4] mt-1">{v.minPrice != null ? `Mulai ${formatPrice(v.minPrice)}` : "Hubungi vendor"}</p>
                        </div>
                      </Link>
                    );
                  })}
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