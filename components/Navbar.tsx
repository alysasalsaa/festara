"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Bell, User, Store, Menu, X, Calendar, ChevronDown } from "lucide-react";
import { categories } from "@/data";
import CategoryIcon from "@/components/CategoryIcon";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/search", label: "Cari Vendor" },
  { href: "/category", label: "Kategori" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/help", label: "Bantuan" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_12px_rgba(28,171,180,0.10)]">
      {/* Top bar */}
      <div className="bg-[#1CABB4] text-white text-xs py-1.5 text-center hidden md:block">
        Temukan vendor terbaik untuk acara spesialmu — Booking langsung, pembayaran aman!
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-1 flex items-center gap-3">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2 mr-4">
  <img src="/logo/festara-icon-color.png" alt="Festara" className="h-8 w-auto object-contain" />
  <span className="font-bold text-[#16302e] text-lg hidden sm:block"
    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.03em" }}>
    festara
  </span>
</Link>

        {/* Nav links desktop */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map(link =>
            link.label === "Kategori" ? (
              <div key={link.href} className="relative">
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  onBlur={() => setTimeout(() => setCatOpen(false), 150)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors
                    ${pathname === link.href
                      ? "text-[#1CABB4] bg-[#E8F8F9]"
                      : "text-[#4A7A6D] hover:text-[#1CABB4] hover:bg-[#E8F8F9]"}`}>
                  {link.label}
                  <ChevronDown size={13} className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
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
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors
                  ${pathname === link.href
                    ? "text-[#1CABB4] bg-[#E8F8F9]"
                    : "text-[#4A7A6D] hover:text-[#1CABB4] hover:bg-[#E8F8F9]"}`}>
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Search bar desktop */}
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
        <div className="flex items-center gap-1 ml-auto lg:ml-0">
          <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors">
            <Bell size={20} className="text-[#4A7A6D]" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#EF4444] rounded-full text-white text-[9px] font-bold flex items-center justify-center">3</span>
          </Link>
          <Link href="/wishlist" className="p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors hidden md:flex">
            <Heart size={20} className="text-[#4A7A6D]" />
          </Link>
          <Link href="/chat" className="p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors hidden md:flex">
            <Calendar size={20} className="text-[#4A7A6D]" />
          </Link>
          <Link href="/dashboard" className="p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors hidden md:flex">
            <User size={20} className="text-[#4A7A6D]" />
          </Link>
          <Link href="/login"
            className="hidden md:flex text-sm font-semibold text-[#4A7A6D] hover:text-[#1CABB4] px-3 py-2 rounded-xl hover:bg-[#E8F8F9] transition-colors">
            Masuk
          </Link>
          <Link href="/register"
            className="hidden md:flex items-center gap-1.5 bg-[#1CABB4] hover:bg-[#178E96] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            Daftar
          </Link>
          <Link href="/seller"
            className="hidden md:flex items-center gap-1.5 border border-[#D4EAC8] text-[#4A7A6D] hover:border-[#1CABB4] hover:text-[#1CABB4] text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
            <Store size={13} /> Vendor
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-[#E8F8F9] transition-colors md:hidden">
            {menuOpen ? <X size={20} className="text-[#1A3A3C]" /> : <Menu size={20} className="text-[#1A3A3C]" />}
          </button>
        </div>
      </div>

      {/* Category bar desktop */}
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

      {/* Mobile menu */}
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
                  ${pathname === link.href
                    ? "text-[#1CABB4] bg-[#E8F8F9]"
                    : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile categories */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#EAF5E4]">
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

          {/* Mobile auth */}
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
          <Link href="/seller" onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 border border-[#D4EAC8] text-[#4A7A6D] hover:border-[#1CABB4] hover:text-[#1CABB4] font-semibold py-2.5 rounded-xl text-sm transition-colors">
            <Store size={15} /> Daftarkan Vendor
          </Link>
        </div>
      )}
    </header>
  );
}