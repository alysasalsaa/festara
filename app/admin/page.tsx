"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Store, Wallet, CalendarCheck2, Users, TrendingUp, Clock, ArrowRight, FileImage } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/data";

type Stats = {
  pendingApplications: number;
  waitingVerification: number;
  bookingsThisMonth: number;
  totalRevenue: number;
  activeVendors: number;
};

type ActivityItem = {
  id: string;
  type: "application" | "proof";
  label: string;
  sublabel: string;
  timestamp: string;
};

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [
        { count: pendingApplications },
        { count: waitingVerification },
        { count: bookingsThisMonth },
        { data: revenueRows },
        { count: activeVendors },
        { data: recentApps },
        { data: recentProofs },
      ] = await Promise.all([
        supabase.from("vendor_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "waiting_verification"),
        supabase.from("bookings").select("id", { count: "exact", head: true }).gte("created_at", startOfMonth),
        supabase.from("transactions").select("amount").in("status", ["paid", "disbursed"]),
        supabase.from("vendors").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("vendor_applications").select("id, business_name, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("transactions").select("id, order_id, status, proof_uploaded_at").not("proof_uploaded_at", "is", null).order("proof_uploaded_at", { ascending: false }).limit(5),
      ]);

      const totalRevenue = (revenueRows || []).reduce((sum, r) => sum + Number(r.amount || 0), 0);

      setStats({
        pendingApplications: pendingApplications || 0,
        waitingVerification: waitingVerification || 0,
        bookingsThisMonth: bookingsThisMonth || 0,
        totalRevenue,
        activeVendors: activeVendors || 0,
      });

      const appItems: ActivityItem[] = (recentApps || []).map((a) => ({
        id: `app-${a.id}`,
        type: "application",
        label: `Aplikasi vendor baru: ${a.business_name}`,
        sublabel: a.status === "pending" ? "Menunggu ditinjau" : a.status === "approved" ? "Disetujui" : "Ditolak",
        timestamp: a.created_at,
      }));

      const proofItems: ActivityItem[] = (recentProofs || []).map((t) => ({
        id: `trx-${t.id}`,
        type: "proof",
        label: `Bukti transfer diunggah — ${t.order_id}`,
        sublabel: t.status === "waiting_verification" ? "Menunggu verifikasi" : t.status === "paid" ? "Sudah diverifikasi" : t.status === "rejected" ? "Ditolak" : t.status,
        timestamp: t.proof_uploaded_at,
      }));

      const merged = [...appItems, ...proofItems]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8);

      setActivity(merged);
      setLoading(false);
    }

    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Aplikasi Vendor Pending",
      value: stats.pendingApplications,
      icon: Store,
      needsAttention: stats.pendingApplications > 0,
      href: "/admin/vendor-applications",
    },
    {
      label: "Bukti Transfer Menunggu",
      value: stats.waitingVerification,
      icon: Wallet,
      needsAttention: stats.waitingVerification > 0,
      href: "/admin/payments",
    },
    {
      label: "Booking Bulan Ini",
      value: stats.bookingsThisMonth,
      icon: CalendarCheck2,
      needsAttention: false,
      href: "/admin/bookings",
    },
    {
      label: "Pendapatan Terverifikasi",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      needsAttention: false,
      href: null,
      isText: true,
    },
    {
      label: "Vendor Aktif",
      value: stats.activeVendors,
      icon: Users,
      needsAttention: false,
      href: "/admin/vendors",
    },
  ];

  return (
    <div className="space-y-5">
      <h2 className="font-bold text-[#1A3A3C]">Ringkasan Admin</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          const content = (
            <div
              className={`bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm h-full transition-colors ${
                card.needsAttention ? "border-2 border-[#F59E0B]/40" : "border border-transparent"
              } ${card.href ? "hover:border-[#1CABB4]/40 cursor-pointer" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    card.needsAttention ? "bg-[#FFF7ED] text-[#F59E0B]" : "bg-[#E8F8F9] text-[#1CABB4]"
                  }`}
                >
                  <Icon size={16} />
                </div>
                {card.needsAttention && (
                  <span className="text-[9px] font-bold bg-[#F59E0B] text-white px-1.5 py-0.5 rounded-full">Perlu Aksi</span>
                )}
              </div>
              <p className={`font-extrabold text-[#1A3A3C] ${card.isText ? "text-base" : "text-2xl"}`}>{card.value}</p>
              <p className="text-[11px] text-[#8ABDB5] mt-0.5">{card.label}</p>
            </div>
          );

          return card.href ? (
            <Link key={card.label} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>

      <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#1A3A3C] text-sm">Aktivitas Terbaru</h3>
        </div>

        {activity.length === 0 ? (
          <p className="text-center text-sm text-[#8ABDB5] py-10">Belum ada aktivitas.</p>
        ) : (
          <div className="space-y-1">
            {activity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-[#EAF5E4] last:border-0">
                <div className="w-8 h-8 rounded-lg bg-[#F0FBF5] flex items-center justify-center flex-shrink-0">
                  {item.type === "application" ? (
                    <Store size={14} className="text-[#1CABB4]" />
                  ) : (
                    <FileImage size={14} className="text-[#1CABB4]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A3A3C] truncate">{item.label}</p>
                  <p className="text-[10px] text-[#8ABDB5]">{item.sublabel}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#8ABDB5] flex-shrink-0">
                  <Clock size={10} />
                  {new Date(item.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link href="/admin/vendor-applications" className="flex items-center justify-between bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E8F8F9] rounded-xl flex items-center justify-center">
            <Store size={18} className="text-[#1CABB4]" />
          </div>
          <div>
            <p className="font-bold text-[#1A3A3C] text-sm">Aplikasi Vendor</p>
            <p className="text-xs text-[#8ABDB5]">Kelola pendaftaran vendor baru</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-[#8ABDB5]" />
      </Link>
    </div>
  );
}