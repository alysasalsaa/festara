"use client";
import { useState, useEffect } from "react";
import { Bell, Package, MessageCircle, ShieldCheck, Trash2, CheckCheck, Store } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";

type Notif = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};

const icons: Record<string, React.ReactNode> = {
  order:  <Package className="w-5 h-5 text-[#1CABB4]" />,
  chat:   <MessageCircle className="w-5 h-5 text-green-500" />,
  system: <ShieldCheck className="w-5 h-5 text-blue-500" />,
  vendor_application: <Store className="w-5 h-5 text-[#F59E0B]" />,
};

const bgColors: Record<string, string> = {
  order:  "bg-[#E8F8F9]",
  chat:   "bg-green-100",
  system: "bg-blue-100",
  vendor_application: "bg-[#FFF7ED]",
};

const tabs = ["Semua", "Transaksi", "Chat", "Sistem"];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");

  useEffect(() => {
    if (!user) return;

    async function fetchNotifs() {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, type, title, message, is_read, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal ambil notifikasi:", error);
        setLoading(false);
        return;
      }

      setNotifs((data || []).map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        time: new Date(n.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
        isRead: n.is_read,
      })));
      setLoading(false);
    }

    fetchNotifs();

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const n = payload.new as any;
          setNotifs(prev => [{
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            time: new Date(n.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
            isRead: n.is_read,
          }, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const filtered = notifs.filter(n => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Transaksi") return n.type === "order" || n.type === "vendor_application";
    if (activeTab === "Chat") return n.type === "chat";
    if (activeTab === "Sistem") return n.type === "system";
    return true;
  });

  const unreadCount = notifs.filter(n => !n.isRead).length;

  const markAllRead = async () => {
    if (!user) return;
    setNotifs(p => p.map(n => ({ ...n, isRead: true })));
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
  };

  const deleteNotif = async (id: string) => {
    setNotifs(p => p.filter(n => n.id !== id));
    await supabase.from("notifications").delete().eq("id", id);
  };

  const markRead = async (id: string) => {
    setNotifs(p => p.map(n => n.id === id ? { ...n, isRead: true } : n));
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors
              ${activeTab === t
                ? "bg-[#1CABB4] text-white"
                : "bg-white text-[#4A7A6D] hover:bg-[#E8F8F9] border border-[#D4EAC8]"}`}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-[#E8F8F9] rounded-2xl flex items-center justify-center mb-4">
            <Bell size={28} className="text-[#1CABB4]" />
          </div>
          <h3 className="font-bold text-[#1A3A3C] mb-2">Belum ada notifikasi</h3>
          <p className="text-sm text-[#8ABDB5]">
            Notifikasi akan muncul di sini
          </p>
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