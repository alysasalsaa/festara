"use client";

import { useState } from "react";
import { Bell, Package, Tag, MessageCircle, Star, ShieldCheck, Trash2, CheckCheck } from "lucide-react";

type Notif = {
  id: string | number;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};

const icons: Record<string, React.ReactNode> = {
  order: <Package className="w-5 h-5 text-[#1CABB4]" />,
  promo: <Tag className="w-5 h-5 text-purple-500" />,
  chat: <MessageCircle className="w-5 h-5 text-green-500" />,
  review: <Star className="w-5 h-5 text-yellow-500" />,
  system: <ShieldCheck className="w-5 h-5 text-blue-500" />,
};

const bgColors: Record<string, string> = {
  order: "bg-[#1CABB4]/10",
  promo: "bg-purple-100",
  chat: "bg-green-100",
  review: "bg-yellow-100",
  system: "bg-blue-100",
};

const allNotifs: Notif[] = [
  { id: 1, type: "order", title: "Pesanan Diproses", message: "Pesanan #ORD-2024-001 sedang diproses oleh penjual.", time: "10 menit lalu", isRead: false },
  { id: 2, type: "order", title: "Pesanan Dikirim 🚚", message: "Pesanan #ORD-2024-002 telah dikirim. No. resi: JNE123456789.", time: "1 jam lalu", isRead: false },
  { id: 3, type: "promo", title: "Flash Sale Dimulai! ⚡", message: "Flash sale spesial hari ini dengan diskon hingga 70%. Jangan sampai ketinggalan!", time: "1 jam lalu", isRead: false },
  { id: 4, type: "chat", title: "Pesan Baru dari TechNusa", message: "Halo kak, untuk produk yang kakak tanyakan stoknya masih ada. Mau dipesan sekarang?", time: "2 jam lalu", isRead: false },
  { id: 5, type: "promo", title: "Voucher Kamu Hampir Kadaluarsa!", message: "Voucher HEMAT50 kamu akan kadaluarsa dalam 2 hari. Segera gunakan!", time: "3 jam lalu", isRead: false },
  { id: 6, type: "order", title: "Pesanan Tiba", message: "Pesanan #ORD-2024-004 telah sampai di tujuan. Jangan lupa berikan ulasan!", time: "3 jam lalu", isRead: true },
  { id: 7, type: "system", title: "Keamanan Akun", message: "Kami mendeteksi login dari perangkat baru. Jika bukan kamu, segera ubah password.", time: "1 hari lalu", isRead: true },
  { id: 8, type: "review", title: "Beri Ulasan Produk", message: "Bagaimana pengalaman kamu dengan Batik Parang Kusumo? Berikan ulasanmu sekarang!", time: "2 hari lalu", isRead: true },
  { id: 9, type: "promo", title: "Kode Voucher Untukmu 🎁", message: "Gunakan kode HEMAT50 untuk diskon Rp50.000 pada pembelian pertamamu!", time: "3 hari lalu", isRead: true },
  { id: 10, type: "chat", title: "Pesan dari Batik Nusantara", message: "Terima kasih sudah memesan, pesanan akan segera diproses ya kak!", time: "4 hari lalu", isRead: true },
];

const tabs = ["Semua", "Transaksi", "Promo", "Chat", "Sistem"];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(allNotifs);
  const [activeTab, setActiveTab] = useState("Semua");

  const filtered = notifs.filter(n => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Transaksi") return n.type === "order" || n.type === "review";
    if (activeTab === "Promo") return n.type === "promo";
    if (activeTab === "Chat") return n.type === "chat";
    if (activeTab === "Sistem") return n.type === "system";
    return true;
  });

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const markAllRead = () => setNotifs(ns => ns.map(n => ({...n, isRead: true})));
  const markRead = (id: string | number) => setNotifs(ns => ns.map(n => n.id === id ? {...n, isRead: true} : n));
  const deleteNotif = (id: string | number) => setNotifs(ns => ns.filter(n => n.id !== id));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#1F2937]">Notifikasi</h1>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm text-[#1CABB4] font-medium hover:underline"
            >
              <CheckCheck className="w-4 h-4" />
              Tandai semua dibaca
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#1CABB4] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#1CABB4] hover:text-[#1CABB4]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm">Tidak ada notifikasi di kategori ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notif => (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex gap-4 cursor-pointer hover:shadow-md transition-all relative ${
                  !notif.isRead ? "border-l-4 border-[#1CABB4]" : ""
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${bgColors[notif.type] || "bg-gray-100"}`}>
                  {icons[notif.type] || <Bell className="w-5 h-5 text-gray-500" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${!notif.isRead ? "text-[#1F2937]" : "text-gray-700"}`}>
                      {notif.title}
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                      className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{notif.time}</p>
                </div>

                {!notif.isRead && (
                  <div className="absolute top-4 right-10 w-2 h-2 bg-[#1CABB4] rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
