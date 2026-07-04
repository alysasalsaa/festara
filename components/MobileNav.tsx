"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calendar, Heart, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Beranda" },
  { href: "/search", icon: Search, label: "Cari Vendor" },
  { href: "/chat", icon: Calendar, label: "Booking" },
  { href: "/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/dashboard", icon: User, label: "Akun" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#D4EAC8] shadow-[0_-4px_12px_rgba(28,171,180,0.10)]">
      <div className="flex items-center justify-around py-2">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 px-3 py-1 relative">
              <div className={`relative p-1.5 rounded-xl transition-colors ${active ? "bg-[#E8F8F9]" : ""}`}>
                <item.icon size={20} className={active ? "text-[#1CABB4]" : "text-[#8ABDB5]"} />
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-[#1CABB4]" : "text-[#8ABDB5]"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}