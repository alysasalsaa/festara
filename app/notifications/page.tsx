"use client";
import { useState, useEffect } from "react";
import { Bell, Package, Tag, MessageCircle, ShieldCheck, Trash2, CheckCheck } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

type Notif = {
  id: string | number;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};

const icons: Record<string, React.ReactNode> = {
  order:  <Package className="w-5 h-5 text-[#1CABB4]" />,
  promo:  <Tag className="w-5 h-5 text-purple-500" />,
  chat:   <MessageCircle className="w-5 h-5 text-green-500" />,
  system: <ShieldCheck className="w-5 h-5 text-blue-500" />,
};

const bgColors: Record<string, string> = {
  order:  "bg-[#E8F8F9]",
  promo:  "bg-purple-100",
  chat:   "bg-green-100",
  system: "bg-blue-100",
};

const tabs = ["Semua", "Transaksi", "Chat", "Sistem"];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("festara_bookings") || "[]");
    const bookingNotifs: Notif[] = bookings.map((b: any, i: number) => ({
      id: `booking-${i}`,
      type: "order",
      title: "Booking Berhasil!",
      message: `Booking ${b.paket} — ${b.vendorName} untuk tanggal ${
        b.eventDate
          ? new Date(b.eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
          : "-"
      } sedang menunggu konfirmasi vendor.`,
      time: b.date || "Baru saja",
      isRead: false,
    }));

    const systemNotifs: Notif[] = user ? [{
      id: "welcome",
      type: "system",
      title: "Selamat Datang di Festara!",
      message: `Halo ${user.user_metadata?.full_name || user.email?.split("@")[0]}! Temukan vendor terbaik untuk acara spesialmu.`,
      time: "Baru saja",
      isRead: true,
    }] : [];

    setNotifs([...bookingNotifs, ...systemNotifs]);
  }, [user]);

  const filtered = notifs.filter(n => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Transaksi") return n.type === "order";
    if (activeTab === "Chat") return n.type === "chat";
    if (activeTab === "Sistem") return n.type === "system";
    return true;
  });

  const unreadCount = notifs.filter(n => !n.isRead).length;
  const markAllRead = () => setNotifs(p => p.map(n => ({ ...n, isRead: true })));
  const deleteNotif = (id: string | number) => setNotifs(p => p.filter(n => n.id !== id));
  const markRead = (id: string | number) => setNotifs(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#1A3A3C]"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Notifikasi
          </h1>
          {unreadCount > 0 && (
            <span className="bg-[#EF4444] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs text-[#1CABB4] font-semibold hover:underline">
            <CheckCheck size={14} /> Tandai semua dibaca
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors
              ${activeTab === t ? "bg-[#1CABB4] text-white" : "bg-white text-[#4A7A6D] hover:bg-[#E8F8F9] border border-[#D4EAC8]"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-[#E8F8F9] rounded-2xl flex items-center justify-center mb-4">
            <Bell size={28} className="text-[#1CABB4]" />
          </div>
          <h3 className="font-bold text-[#1A3A3C] mb-2">Belum ada notifikasi</h3>
          <p className="text-sm text-[#8ABDB5]">Notifikasi akan muncul setelah kamu melakukan booking</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer
                ${!n.isRead
                  ? "bg-white border-l-4 border-l-[#1CABB4] border-[#1CABB4]/20 shadow-[0_2px_12px_rgba(28,171,180,0.10)]"
                  : "bg-white/60 border-[#D4EAC8]"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bgColors[n.type] || "bg-[#E8F8F9]"}`}>
                {icons[n.type] || <Bell className="w-5 h-5 text-[#1CABB4]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm leading-tight ${!n.isRead ? "font-bold text-[#1A3A3C]" : "font-semibold text-[#4A7A6D]"}`}>
                    {n.title}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!n.isRead && <div className="w-2 h-2 bg-[#1CABB4] rounded-full" />}
                    <button onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                      className="text-[#8ABDB5] hover:text-[#EF4444] transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#4A7A6D] mt-1 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-[#8ABDB5] mt-1.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}