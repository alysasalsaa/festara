"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShieldCheck, Store, Grid3x3, LogOut } from "lucide-react";
import { isCurrentUserAdmin } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

      <div className="flex gap-5">
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden sticky top-24">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3.5 text-sm text-[#4A7A6D] hover:bg-[#F0FBF5] transition-colors">
              <LayoutDashboard size={17} /> Ringkasan
            </Link>
            <Link href="/admin/vendor-applications" className="flex items-center gap-3 px-4 py-3.5 text-sm text-[#4A7A6D] hover:bg-[#F0FBF5] transition-colors">
              <Store size={17} /> Aplikasi Vendor
            </Link>
            <button onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-colors text-left">
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