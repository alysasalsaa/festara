"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Bell, User, Store, Menu, X, Calendar, ChevronDown } from "lucide-react";
import { categories } from "@/data";
import CategoryIcon from "@/components/CategoryIcon";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/search", label: "Cari Vendor" },
  { href: "/category", label: "Kategori" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/help", label: "Bantuan" },
];

const FestaraLogo = () => (
  <svg width="26" height="32" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 1L27 12H1L14 1Z" fill="#178E96"/>
    <path d="M1 12L14 33L27 12H1Z" fill="#1CABB4"/>
    <path d="M14 1L1 12L7 12L14 5L14 1Z" fill="#1CABB4"/>
    <path d="M14 1L27 12L21 12L14 5Z" fill="#178E96" opacity="0.6"/>
    <path d="M6 15H22" stroke="#DBEBC9" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("festara_bookings") || "[]");
    setUnreadCount(bookings.length);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_12px_rgba(28,171,180,0.10)]">
      {/* Top announcement bar */}
      <div className="bg-[#1CABB4] text-white text-xs py-1.5 text-center px-4">
        Temukan vendor terbaik untuk acara spesialmu — Booking langsung, pembayaran aman!
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center gap-2 md:gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2 mr-1 md:mr-2">
          <FestaraLogo />
          <span className="font-bold text-[#16302e] text-base md:text-lg"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em" }}>
            festara
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-0 flex-1">
          {NAV_LINKS.map(link =>
            link.label === "Kategori" ? (
              <div key={link.href} className="relative">
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  onBlur={() => setTimeout(() => setCatOpen(false), 150)}
                  className={`flex items-center gap-1 px-2 py-2 rounded-xl text-xs font-medium transition-colors
                    ${pathname === link.href ? "text-[#1CABB4] bg-[#E8F8F9]" : "text-[#4A7A6D] hover:text-[#1CABB4] hover:bg-[#E8F8F9]"}`}>
                  {link.label}
                  <ChevronDown size={12} className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
                </button>
                {catOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-[0_8px_32px_rgba(28,171,180,0.15)] border border-[#D4EAC8] z-50 overflow-hidden w-52">
                    {categories.map(cat => (
                      <Link key={cat.id} href={`/search?cat=${cat.id}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F0FBF5] transition-colors text-sm text-[#1A3A3C] hover:text-[#1CABB4]">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: cat.color + "18" }}>
                          <CategoryIcon id={cat.id} color={cat.color} size={16} />
                        </div>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href}
                className={`px-2 py-2 rounded-xl text-xs font-medium transition-colors
                  ${pathname === link.href ? "text-[#1CABB4] bg-[#E8F8F9]" : "text-[#4A7A6D] hover:text-[#1CABB4] hover:bg-[#E8F8F9]"}`}>
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Search bar — desktop only */}
        <div className="hidden lg:flex flex-1 max-w-xs">
          <div className="flex w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-2xl overflow-hidden focus-within:border-[#1CABB4] focus-within:shadow-[0_0_0_3px_rgba(28,171,180,0.12)] transition-all">
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (window.location.href = `/search?q=${searchVal}`)}
              className="flex-1 px-3 py-2 bg-transparent text-sm outline-none text-[#1A3A3C] placeholder:text-[#8ABDB5]"
              placeholder="Cari vendor..." />
            <Link href={`/search?q=${searchVal}`}
              className="bg-[#1CABB4] hover:bg-[#178E96] px-3 flex items-center justify-center transition-colors">
              <Search size={15} className="text-white" />
            </Link>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Notifikasi */}
          <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors">
            <Bell size={20} className="text-[#4A7A6D]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {/* Wishlist — semua device */}
          <Link href="/wishlist" className="p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors">
            <Heart size={20} className="text-[#4A7A6D]" />
          </Link>

          {/* Booking — semua device */}
          <Link href="/chat" className="p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors">
            <Calendar size={20} className="text-[#4A7A6D]" />
          </Link>

          {/* Auth section desktop */}
          {user ? (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#E8F8F9] transition-colors">
                <div className="w-7 h-7 bg-[#1CABB4] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-[#1A3A3C] hidden lg:block max-w-[100px] truncate">
                  {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
              </Link>
              <button onClick={handleLogout}
                className="text-xs font-semibold text-[#4A7A6D] hover:text-[#EF4444] px-3 py-2 rounded-xl hover:bg-[#FEF2F2] transition-colors">
                Keluar
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/login"
                className="text-xs font-semibold text-[#4A7A6D] hover:text-[#1CABB4] px-3 py-2 rounded-xl hover:bg-[#E8F8F9] transition-colors">
                Masuk
              </Link>
              <Link href="/register"
                className="flex items-center gap-1.5 bg-[#1CABB4] hover:bg-[#178E96] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                Daftar
              </Link>
            </div>
          )}

          {/* Akun icon mobile */}
          <Link href={user ? "/dashboard" : "/login"}
            className="md:hidden p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors relative">
            {user ? (
              <div className="w-7 h-7 bg-[#1CABB4] rounded-full flex items-center justify-center text-white text-xs font-bold">
                {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
              </div>
            ) : (
              <User size={20} className="text-[#4A7A6D]" />
            )}
          </Link>

          <Link href="/seller"
            className="hidden md:flex items-center gap-1.5 border border-[#D4EAC8] text-[#4A7A6D] hover:border-[#1CABB4] hover:text-[#1CABB4] text-xs font-semibold px-2 py-2 rounded-xl transition-colors">
            <Store size={13} /> Vendor
          </Link>

          {/* Hamburger mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors md:hidden">
            {menuOpen ? <X size={20} className="text-[#1A3A3C]" /> : <Menu size={20} className="text-[#1A3A3C]" />}
          </button>
        </div>
      </div>

      {/* Category bar — desktop only */}
      <div className="hidden md:block border-t border-[#EAF5E4]">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 py-1.5 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <Link key={cat.id} href={`/search?cat=${cat.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#4A7A6D] hover:text-[#1CABB4] hover:bg-[#E8F8F9] rounded-xl transition-all whitespace-nowrap">
              <CategoryIcon id={cat.id} color={cat.color} size={14} />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#D4EAC8] bg-white px-4 py-4 space-y-3">
          {/* Mobile search */}
          <div className="flex bg-[#F0FBF5] border border-[#D4EAC8] rounded-2xl overflow-hidden">
            <input
              className="flex-1 px-4 py-2.5 bg-transparent text-sm outline-none placeholder:text-[#8ABDB5] text-[#1A3A3C]"
              placeholder="Cari vendor..." />
            <button className="bg-[#1CABB4] px-4 flex items-center justify-center">
              <Search size={16} className="text-white" />
            </button>
          </div>

          {/* Mobile nav links */}
          <div className="flex flex-col gap-0.5">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors
                  ${pathname === link.href ? "text-[#1CABB4] bg-[#E8F8F9]" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile categories */}
          <div className="pt-2 border-t border-[#EAF5E4]">
            <p className="text-xs font-bold text-[#8ABDB5] uppercase tracking-wide mb-2 px-1">Kategori</p>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <Link key={cat.id} href={`/search?cat=${cat.id}`} onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: cat.color + "18" }}>
                    <CategoryIcon id={cat.id} color={cat.color} size={18} />
                  </div>
                  <span className="text-[9px] text-[#4A7A6D] text-center leading-tight">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile auth */}
          {user ? (
            <div className="flex gap-2 pt-2 border-t border-[#EAF5E4]">
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#E8F8F9] text-[#1CABB4] font-semibold py-2.5 rounded-xl text-sm">
                <div className="w-6 h-6 bg-[#1CABB4] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                </div>
                <span className="truncate max-w-[100px]">
                  {user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
              </Link>
              <button onClick={handleLogout}
                className="px-4 py-2.5 border border-[#EF4444]/30 text-[#EF4444] font-semibold rounded-xl text-sm hover:bg-[#FEF2F2] transition-colors">
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-[#EAF5E4]">
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 border border-[#1CABB4] text-[#1CABB4] font-semibold rounded-xl text-sm hover:bg-[#E8F8F9] transition-colors">
                Masuk
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-[#1CABB4] text-white font-semibold rounded-xl text-sm hover:bg-[#178E96] transition-colors">
                Daftar
              </Link>
            </div>
          )}

          <Link href="/seller" onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 border border-[#D4EAC8] text-[#4A7A6D] hover:border-[#1CABB4] hover:text-[#1CABB4] font-semibold py-2.5 rounded-xl text-sm transition-colors">
            <Store size={15} /> Daftarkan Vendor
          </Link>
        </div>
      )}
    </header>
  );
}