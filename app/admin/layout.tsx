"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Store, Wallet, CalendarCheck2, Settings, LogOut, type LucideIcon } from "lucide-react";
import { isCurrentUserAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  comingSoon?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard, exact: true },
  { href: "/admin/vendor-applications", label: "Aplikasi Vendor", icon: Store },
  { href: "/admin/payments", label: "Verifikasi Pembayaran", icon: Wallet },
  { href: "/admin/bookings", label: "Semua Booking", icon: CalendarCheck2 },
  { href: "/admin/vendors", label: "Kelola Vendor", icon: Store },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function check() {
      const admin = await isCurrentUserAdmin();
      if (!admin) {
        router.push("/");
        return;
      }
      setIsAdmin(true);
      setChecking(false);
    }
    check();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-[#16302e] rounded-xl flex items-center justify-center">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#1A3A3C]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Admin Festara
        </h1>
      </div>

      {/* Nav mobile — horizontal scroll, cuma menu yang sudah aktif */}
      <div className="md:hidden -mx-4 mb-4 relative">
        <div className="px-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 w-max pr-6">
            {NAV_ITEMS.filter((item) => !item.comingSoon).map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${isActive ? "bg-[#1CABB4] text-white" : "bg-white text-[#4A7A6D]"}`}>
                  <Icon size={14} /> {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F5F8F6] to-transparent" />
      </div>

      <div className="flex gap-5">
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-6">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
              const Icon = item.icon;

              if (item.comingSoon) {
                return (
                  <div key={item.href}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-sm text-[#B9CFC8] cursor-not-allowed">
                    <span className="flex items-center gap-3"><Icon size={17} /> {item.label}</span>
                    <span className="text-[9px] font-semibold bg-[#F0FBF5] text-[#8ABDB5] px-1.5 py-0.5 rounded-full">Segera</span>
                  </div>
                );
              }

              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 text-sm transition-colors border-l-4 ${isActive ? "bg-[#E8F8F9] text-[#1CABB4] font-semibold border-[#1CABB4]" : "text-[#4A7A6D] hover:bg-[#F0FBF5] border-transparent"}`}>
                  <Icon size={17} /> {item.label}
                </Link>
              );
            })}
            <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors text-left border-t border-[#EAF5E4]">
              <LogOut size={17} /> Keluar
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}