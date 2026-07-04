"use client";
import { useState } from "react";
import {
  TrendingUp, Package, Users, DollarSign, ArrowUp, MoreHorizontal,
  LayoutDashboard, ShoppingBag, MessageCircle, Calendar, Star,
  Image, BarChart2, Settings, Bell, ChevronRight, Check, Clock,
  MapPin, Edit, Trash2, Plus, Eye
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import { sellerStats, formatPrice } from "@/data";

type Tab = "ringkasan" | "pesanan" | "inbox" | "kalender" | "paket" | "portofolio" | "statistik" | "pengaturan";

const PIE_COLORS = ["#1CABB4", "#6366F1", "#DBEBC9", "#F59E0B"];

const INQUIRY_DATA = [
  { name: "Pencarian", value: 45 },
  { name: "Profil Vendor", value: 30 },
  { name: "Referral", value: 15 },
  { name: "Lainnya", value: 10 },
];

const MONTHLY_DATA = [
  { month: "Jan", pendapatan: 8000000, booking: 12 },
  { month: "Feb", pendapatan: 12000000, booking: 18 },
  { month: "Mar", pendapatan: 9500000, booking: 14 },
  { month: "Apr", pendapatan: 15000000, booking: 22 },
  { month: "Mei", pendapatan: 18000000, booking: 26 },
  { month: "Jun", pendapatan: 22000000, booking: 32 },
];

const PACKAGES = [
  { name: "Paket Basic", price: 3500000, desc: "100 foto editing, 1 hari", bookings: 24, active: true },
  { name: "Paket Silver", price: 5500000, desc: "200 foto + album, 1 hari", bookings: 38, active: true },
  { name: "Paket Premium", price: 9000000, desc: "300 foto + video, 2 hari", bookings: 15, active: true },
];

const PORTFOLIO_IMGS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1583939411023-14783179e581?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=300&fit=crop",
];

const INBOX = [
  { name: "Dewi Santika", msg: "Halo, apakah tanggal 12 Nov masih tersedia?", time: "10 mnt", unread: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dewi" },
  { name: "Budi Prasetyo", msg: "Terima kasih sudah konfirmasi, kami tunggu ya!", time: "1 jam", unread: true, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=budi" },
  { name: "Anita Lestari", msg: "Bisa minta portofolio outdoor terbaru?", time: "3 jam", unread: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anita" },
  { name: "Rizky Firmansyah", msg: "Paket Silver sudah termasuk makeup artist?", time: "Kemarin", unread: false, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rizky" },
];

const CALENDAR_EVENTS = [
  { date: 3, label: "Booked", name: "Dewi & Budi", type: "booked" },
  { date: 7, label: "Booked", name: "Anita & Rizky", type: "booked" },
  { date: 14, label: "Booked", name: "Sari & Doni", type: "booked" },
  { date: 20, label: "Konsultasi", name: "Mega", type: "consult" },
  { date: 21, label: "Booked", name: "Putri & Andi", type: "booked" },
  { date: 28, label: "Booked", name: "Rina & Bagas", type: "booked" },
];

const SIDEBAR_ITEMS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "ringkasan",   icon: <LayoutDashboard size={17} />, label: "Ringkasan" },
  { id: "pesanan",     icon: <ShoppingBag size={17} />,     label: "Pesanan" },
  { id: "inbox",       icon: <MessageCircle size={17} />,   label: "Inbox" },
  { id: "kalender",    icon: <Calendar size={17} />,        label: "Kalender" },
  { id: "paket",       icon: <Package size={17} />,         label: "Paket Layanan" },
  { id: "portofolio",  icon: <Image size={17} />,           label: "Portofolio" },
  { id: "statistik",   icon: <BarChart2 size={17} />,       label: "Statistik" },
  { id: "pengaturan",  icon: <Settings size={17} />,        label: "Pengaturan" },
];

const STATUS_COLORS: Record<string, string> = {
  delivered:  "text-[#15803D] bg-[#DCFCE7]",
  shipped:    "text-[#1CABB4] bg-[#E8F8F9]",
  processing: "text-[#6366F1] bg-[#EEF2FF]",
  pending:    "text-[#F59E0B] bg-[#FFF7ED]",
  cancelled:  "text-[#EF4444] bg-[#FEF2F2]",
};

const STATUS_LABELS: Record<string, string> = {
  delivered: "Selesai", shipped: "Terjadwal", processing: "Konfirmasi", pending: "Menunggu", cancelled: "Batal",
};

export default function SellerDashboard() {
  const [tab, setTab] = useState<Tab>("ringkasan");
  const [period, setPeriod] = useState<"7d" | "30d" | "3m">("30d");

  const statCards = [
    { label: "Pendapatan", value: "Rp 28.750.000", icon: DollarSign, color: "#1CABB4", bg: "#E8F8F9", change: "+22%" },
    { label: "Pesanan",    value: "32",              icon: ShoppingBag, color: "#6366F1", bg: "#EEF2FF", change: "+18%" },
    { label: "Inquiry",    value: "148",             icon: Eye,         color: "#F59E0B", bg: "#FFF7ED", change: "+25%" },
    { label: "Rating",     value: "4,9",             icon: Star,        color: "#22C55E", bg: "#DCFCE7", change: "+0.2" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-[#1A3A3C] flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          <div className="w-8 h-8 bg-[#1CABB4] rounded-xl flex items-center justify-center">
            <LayoutDashboard size={15} className="text-white" />
          </div>
          Dashboard Vendor
        </h1>
        <div className="flex items-center gap-2">
          <button className="relative p-2 bg-white rounded-xl shadow-sm hover:bg-[#E8F8F9] transition-colors">
            <Bell size={18} className="text-[#4A7A6D]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
          </button>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
            <img src="https://api.dicebear.com/7.x/shapes/svg?seed=lavinia&backgroundColor=1CABB4" alt="" className="w-7 h-7 rounded-lg" />
            <span className="text-sm font-semibold text-[#1A3A3C] hidden md:block">Lavinia Fotografer</span>
          </div>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Sidebar */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden sticky top-24">
            {SIDEBAR_ITEMS.map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors text-sm ${tab === item.id ? "bg-[#E8F8F9] text-[#1CABB4] font-semibold border-r-2 border-[#1CABB4]" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                {item.icon}
                <span>{item.label}</span>
                {item.id === "inbox" && (
                  <span className="ml-auto w-5 h-5 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── RINGKASAN ── */}
          {tab === "ringkasan" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Ringkasan Bisnis</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8ABDB5]">Periode:</span>
                  <select className="text-xs bg-white border border-[#D4EAC8] rounded-xl px-3 py-2 text-[#1A3A3C] outline-none focus:border-[#1CABB4]">
                    <option>Bulan Ini</option>
                    <option>3 Bulan</option>
                    <option>Tahun Ini</option>
                  </select>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map(card => (
                  <div key={card.label} className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                        <card.icon size={18} style={{ color: card.color }} />
                      </div>
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-[#22C55E]">
                        <ArrowUp size={10} /> {card.change}
                      </span>
                    </div>
                    <p className="text-xl font-extrabold text-[#1A3A3C]">{card.value}</p>
                    <p className="text-xs text-[#8ABDB5] mt-0.5">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-2 bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-[#1A3A3C]">Grafik Pendapatan</h3>
                    <span className="text-xs text-[#22C55E] bg-[#DCFCE7] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp size={10} /> +18% bulan ini
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={MONTHLY_DATA}>
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1CABB4" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#1CABB4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EAF5E4" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8ABDB5" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#8ABDB5" }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000000}jt`} />
                      <Tooltip formatter={v => [formatPrice(Number(v)), "Pendapatan"]} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} />
                      <Area type="monotone" dataKey="pendapatan" stroke="#1CABB4" strokeWidth={2.5} fill="url(#grad)" dot={{ fill: "#1CABB4", r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-sm text-[#1A3A3C] mb-4">Sumber Inquiry</h3>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={INQUIRY_DATA} cx="50%" cy="50%" outerRadius={55} innerRadius={30} dataKey="value" strokeWidth={0}>
                        {INQUIRY_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={v => [`${v}%`]} contentStyle={{ borderRadius: "12px", border: "none", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {INQUIRY_DATA.map((item, i) => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                          <span className="text-[#4A7A6D]">{item.name}</span>
                        </div>
                        <span className="font-bold text-[#1A3A3C]">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#EAF5E4] flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#1A3A3C]">Pesanan Terkini</h3>
                  <button onClick={() => setTab("pesanan")} className="text-xs text-[#1CABB4] font-semibold flex items-center gap-1">
                    Lihat Semua <ChevronRight size={13} />
                  </button>
                </div>
                <div className="divide-y divide-[#EAF5E4]">
                  {sellerStats.recentOrders.slice(0, 4).map(order => (
                    <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F0FBF5] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-[#8ABDB5]">{order.id}</p>
                        <p className="text-sm font-semibold text-[#1A3A3C] truncate">{order.product}</p>
                        <p className="text-xs text-[#4A7A6D]">{order.buyer}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-[#1CABB4]">{formatPrice(order.amount)}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── PESANAN ── */}
          {tab === "pesanan" && (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#EAF5E4] flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Semua Pesanan</h2>
                <div className="flex gap-2">
                  {["Semua", "Menunggu", "Terjadwal", "Selesai"].map(s => (
                    <button key={s} className="text-xs px-3 py-1.5 rounded-xl bg-[#F0FBF5] text-[#4A7A6D] hover:bg-[#E8F8F9] hover:text-[#1CABB4] transition-colors font-medium">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-[#EAF5E4]">
                {sellerStats.recentOrders.map(order => (
                  <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F0FBF5] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-mono text-[#8ABDB5]">{order.id}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-[#1A3A3C]">{order.product}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#4A7A6D]">
                        <span className="flex items-center gap-1"><Users size={10} />{order.buyer}</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{order.date}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-[#1CABB4]">{formatPrice(order.amount)}</p>
                      <div className="flex gap-1.5 mt-2">
                        <button className="text-[10px] bg-[#E8F8F9] text-[#1CABB4] font-semibold px-2 py-1 rounded-lg hover:bg-[#1CABB4] hover:text-white transition-colors">Detail</button>
                        {order.status === "pending" && (
                          <button className="text-[10px] bg-[#DCFCE7] text-[#15803D] font-semibold px-2 py-1 rounded-lg">Konfirmasi</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── INBOX ── */}
          {tab === "inbox" && (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#EAF5E4]">
                <h2 className="font-bold text-[#1A3A3C]">Inbox</h2>
                <p className="text-xs text-[#8ABDB5] mt-0.5">2 pesan belum dibaca</p>
              </div>
              <div className="divide-y divide-[#EAF5E4]">
                {INBOX.map((msg, i) => (
                  <div key={i} className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-[#F0FBF5] ${msg.unread ? "bg-[#F8FFFD]" : ""}`}>
                    <div className="relative flex-shrink-0">
                      <img src={msg.avatar} alt="" className="w-11 h-11 rounded-2xl bg-[#E8F8F9]" />
                      {msg.unread && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#1CABB4] rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm ${msg.unread ? "font-bold text-[#1A3A3C]" : "font-medium text-[#4A7A6D]"}`}>{msg.name}</p>
                        <span className="text-[10px] text-[#8ABDB5]">{msg.time}</span>
                      </div>
                      <p className="text-xs text-[#4A7A6D] truncate">{msg.msg}</p>
                    </div>
                    <ChevronRight size={14} className="text-[#8ABDB5] flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── KALENDER ── */}
          {tab === "kalender" && (
            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2 bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[#1A3A3C]">Juli 2026</h2>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-xl bg-[#F0FBF5] text-[#4A7A6D] flex items-center justify-center hover:bg-[#E8F8F9] transition-colors text-lg">‹</button>
                    <button className="w-8 h-8 rounded-xl bg-[#F0FBF5] text-[#4A7A6D] flex items-center justify-center hover:bg-[#E8F8F9] transition-colors text-lg">›</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-[#8ABDB5] py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 2 }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const event = CALENDAR_EVENTS.find(e => e.date === day);
                    return (
                      <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs transition-colors cursor-pointer relative
                        ${event?.type === "booked" ? "bg-[#1CABB4] text-white" :
                          event?.type === "consult" ? "bg-[#DBEBC9] text-[#1A3A3C]" :
                          "hover:bg-[#F0FBF5] text-[#1A3A3C]"}`}>
                        <span className="font-semibold">{day}</span>
                        {event && <span className="text-[8px] leading-none opacity-80">{event.type === "booked" ? "•" : "○"}</span>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#EAF5E4]">
                  <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded bg-[#1CABB4]" /><span className="text-[#4A7A6D]">Booking</span></div>
                  <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded bg-[#DBEBC9]" /><span className="text-[#4A7A6D]">Konsultasi</span></div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#1A3A3C] mb-4">Jadwal Bulan Ini</h3>
                <div className="space-y-3">
                  {CALENDAR_EVENTS.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F0FBF5]">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm
                        ${ev.type === "booked" ? "bg-[#1CABB4] text-white" : "bg-[#DBEBC9] text-[#1A3A3C]"}`}>
                        {ev.date}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1A3A3C]">{ev.name}</p>
                        <p className="text-[10px] text-[#8ABDB5]">{ev.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PAKET LAYANAN ── */}
          {tab === "paket" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Paket Layanan</h2>
                <button className="flex items-center gap-2 bg-[#1CABB4] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#178E96] transition-colors">
                  <Plus size={14} /> Tambah Paket
                </button>
              </div>
              {PACKAGES.map((pkg, i) => (
                <div key={i} className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#1A3A3C]">{pkg.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pkg.active ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                        {pkg.active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A7A6D] mb-2">{pkg.desc}</p>
                    <div className="flex items-center gap-4 text-xs text-[#8ABDB5]">
                      <span className="flex items-center gap-1"><ShoppingBag size={11} />{pkg.bookings} booking</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-[#1CABB4] text-lg">{formatPrice(pkg.price)}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="w-8 h-8 flex items-center justify-center bg-[#E8F8F9] text-[#1CABB4] rounded-xl hover:bg-[#1CABB4] hover:text-white transition-colors">
                        <Edit size={13} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-[#FEF2F2] text-[#EF4444] rounded-xl hover:bg-[#EF4444] hover:text-white transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PORTOFOLIO ── */}
          {tab === "portofolio" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#1A3A3C]">Portofolio ({PORTFOLIO_IMGS.length} karya)</h2>
                <button className="flex items-center gap-2 bg-[#1CABB4] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#178E96] transition-colors">
                  <Plus size={14} /> Upload Foto
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PORTFOLIO_IMGS.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer">
                    <img src={img} alt={`Portfolio ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button className="w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center hover:bg-white transition-colors">
                        <Eye size={15} className="text-[#1A3A3C]" />
                      </button>
                      <button className="w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center hover:bg-white transition-colors">
                        <Trash2 size={15} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="aspect-[4/3] rounded-2xl border-2 border-dashed border-[#D4EAC8] flex flex-col items-center justify-center cursor-pointer hover:border-[#1CABB4] hover:bg-[#F0FBF5] transition-colors group">
                  <Plus size={24} className="text-[#D4EAC8] group-hover:text-[#1CABB4] transition-colors mb-1" />
                  <p className="text-xs text-[#8ABDB5] group-hover:text-[#1CABB4] transition-colors">Upload Foto</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STATISTIK ── */}
          {tab === "statistik" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Statistik Performa</h2>
                <div className="flex gap-2">
                  {(["7d","30d","3m"] as const).map(p => (
                    <button key={p} onClick={() => setPeriod(p)}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${period === p ? "bg-[#1CABB4] text-white" : "bg-white text-[#4A7A6D] border border-[#D4EAC8]"}`}>
                      {p === "7d" ? "7 Hari" : p === "30d" ? "30 Hari" : "3 Bulan"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#1A3A3C] mb-4">Booking per Bulan</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EAF5E4" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8ABDB5" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#8ABDB5" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: 12 }} />
                    <Bar dataKey="booking" fill="#1CABB4" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Response Rate", value: "98%", icon: <Check size={16} className="text-[#22C55E]" />, bg: "#DCFCE7" },
                  { label: "Avg Response", value: "< 1 jam", icon: <Clock size={16} className="text-[#1CABB4]" />, bg: "#E8F8F9" },
                  { label: "Profile Views", value: "1.248", icon: <Eye size={16} className="text-[#6366F1]" />, bg: "#EEF2FF" },
                  { label: "Area Layanan", value: "DIY & Jateng", icon: <MapPin size={16} className="text-[#F59E0B]" />, bg: "#FFF7ED" },
                ].map(item => (
                  <div key={item.label} className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: item.bg }}>
                      {item.icon}
                    </div>
                    <p className="font-extrabold text-lg text-[#1A3A3C]">{item.value}</p>
                    <p className="text-xs text-[#8ABDB5]">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PENGATURAN ── */}
          {tab === "pengaturan" && (
            <div className="space-y-4">
              <h2 className="font-bold text-[#1A3A3C]">Pengaturan Akun Vendor</h2>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#1A3A3C] mb-4">Informasi Vendor</h3>
                <div className="space-y-3">
                  {[
                    { label: "Nama Vendor", value: "Lavinia Wedding Fotografer" },
                    { label: "Kategori", value: "Photographer" },
                    { label: "Lokasi", value: "Yogyakarta" },
                    { label: "WhatsApp", value: "0812-3456-7890" },
                    { label: "Email", value: "lavinia@email.com" },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-xs font-medium text-[#8ABDB5] block mb-1">{f.label}</label>
                      <input defaultValue={f.value} className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
                    </div>
                  ))}
                </div>
                <button className="w-full mt-5 bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-3 rounded-xl transition-colors">
                  Simpan Perubahan
                </button>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#1A3A3C] mb-4">Notifikasi</h3>
                {[
                  { label: "Pesanan baru", desc: "Notifikasi saat ada booking masuk" },
                  { label: "Pesan baru", desc: "Notifikasi saat ada pesan dari calon klien" },
                  { label: "Ulasan baru", desc: "Notifikasi saat ada ulasan baru" },
                  { label: "Pengingat jadwal", desc: "Pengingat H-3 sebelum acara" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-[#EAF5E4] last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[#1A3A3C]">{item.label}</p>
                      <p className="text-xs text-[#8ABDB5]">{item.desc}</p>
                    </div>
                    <div className="w-11 h-6 bg-[#1CABB4] rounded-full relative cursor-pointer flex-shrink-0">
                      <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}