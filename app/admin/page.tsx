"use client";
import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";

export default function AdminHomePage() {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-[#1A3A3C]">Ringkasan Admin</h2>
      <Link href="/admin/vendor-applications"
        className="block bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E8F8F9] rounded-xl flex items-center justify-center">
              <Store size={18} className="text-[#1CABB4]" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#1A3A3C]">Aplikasi Vendor</p>
              <p className="text-xs text-[#8ABDB5]">Kelola pendaftaran vendor baru</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-[#8ABDB5]" />
        </div>
      </Link>
    </div>
  );
}