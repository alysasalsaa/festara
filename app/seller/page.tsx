"use client";
import { useState, useEffect, useRef } from "react";
import {
  TrendingUp, Package, Users, DollarSign, ArrowUp,
  LayoutDashboard, ShoppingBag, MessageCircle, Calendar, Star,
  Image as ImageIcon, BarChart2, Settings, Bell, ChevronRight, Check, Clock,
  MapPin, Edit, Trash2, Plus, Eye, X, Loader2, AlertTriangle,
  CheckCircle2, Circle, ExternalLink
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import { formatPrice, categories } from "@/data";
import { supabase } from "@/lib/supabase";
import ChatThread from "@/components/ChatThread";
import {
  getMyVendor, updateMyVendor, VendorProfile,
  getVendorPackages, createPackage, deletePackage, togglePackageActive, VendorPackage,
  getPortfolioImages, uploadPortfolioImage, deletePortfolioImage, PortfolioImage,
  getVendorOrders, VendorOrder,
  getVendorAvailability, toggleAvailability,
  getVendorRevenue,
} from "@/lib/sellerVendor";

type Tab = "ringkasan" | "pesanan" | "inbox" | "kalender" | "paket" | "portofolio" | "statistik" | "pengaturan";

type Conversation = {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
};

const SIDEBAR_ITEMS: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "ringkasan",   icon: <LayoutDashboard size={17} />, label: "Ringkasan" },
  { id: "pesanan",     icon: <ShoppingBag size={17} />,     label: "Pesanan" },
  { id: "inbox",       icon: <MessageCircle size={17} />,   label: "Inbox" },
  { id: "kalender",    icon: <Calendar size={17} />,        label: "Kalender" },
  { id: "paket",       icon: <Package size={17} />,         label: "Paket Layanan" },
  { id: "portofolio",  icon: <ImageIcon size={17} />,       label: "Portofolio" },
  { id: "statistik",   icon: <BarChart2 size={17} />,       label: "Statistik" },
  { id: "pengaturan",  icon: <Settings size={17} />,        label: "Pengaturan" },
];

const STATUS_COLORS: Record<string, string> = {
  completed:  "text-[#15803D] bg-[#DCFCE7]",
  confirmed:  "text-[#1CABB4] bg-[#E8F8F9]",
  processing: "text-[#6366F1] bg-[#EEF2FF]",
  pending:    "text-[#F59E0B] bg-[#FFF7ED]",
  cancelled:  "text-[#EF4444] bg-[#FEF2F2]",
};

const STATUS_LABELS: Record<string, string> = {
  completed: "Selesai", confirmed: "Terkonfirmasi", processing: "Diproses", pending: "Menunggu", cancelled: "Batal",
};

const MONTHS_ID = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DAYS_ID = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

export default function SellerDashboard() {
  const [tab, setTab] = useState<Tab>("ringkasan");

  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);

  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [responseRate, setResponseRate] = useState<number | null>(null);
  const [avgResponseTime, setAvgResponseTime] = useState<string | null>(null);

  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioImage[]>([]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);

  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [availability, setAvailability] = useState<{ date: string; is_available: boolean }[]>([]);

  const [showAddPackage, setShowAddPackage] = useState(false);
  const [newPkg, setNewPkg] = useState({ name: "", description: "", price: "" });
  const [savingPkg, setSavingPkg] = useState(false);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settingsForm, setSettingsForm] = useState({ name: "", location: "", description: "" });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [togglingActive, setTogglingActive] = useState(false);

  useEffect(() => {
    async function load() {
      const v = await getMyVendor();
      setVendor(v);
      if (v) {
        setSettingsForm({ name: v.name, location: v.location || "", description: v.description || "" });
      }
      setVendorLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!vendor) return;

    async function loadOrdersAndRevenue() {
      const [ordersData, revenueData] = await Promise.all([
        getVendorOrders(vendor!.id),
        getVendorRevenue(vendor!.id),
      ]);
      setOrders(ordersData);
      setRevenue(revenueData);

      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("vendor_id", vendor!.id);

      if (reviews && reviews.length > 0) {
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        setAvgRating(avg);
        setReviewCount(reviews.length);
      } else {
        setAvgRating(null);
        setReviewCount(0);
      }
    }
    loadOrdersAndRevenue();
  }, [vendor]);

  useEffect(() => {
    if (!vendor) return;
    getVendorPackages(vendor.id).then(setPackages);
  }, [vendor]);

  useEffect(() => {
    if (!vendor) return;
    getPortfolioImages(vendor.id).then(setPortfolio);
  }, [vendor]);

  useEffect(() => {
    if (!vendor) return;
    getVendorAvailability(vendor.id, calMonth, calYear).then(setAvailability);
  }, [vendor, calMonth, calYear]);

  useEffect(() => {
    if (!vendor) return;

    async function fetchConversations() {
      const { data, error } = await supabase
        .from("messages")
        .select("sender_id, receiver_id, content, created_at, is_read")
        .or(`sender_id.eq.${vendor!.user_id},receiver_id.eq.${vendor!.user_id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal ambil percakapan:", error);
        return;
      }

      const map = new Map<string, Conversation>();
      for (const m of data || []) {
        const otherId = m.sender_id === vendor!.user_id ? m.receiver_id : m.sender_id;
        if (!map.has(otherId)) {
          map.set(otherId, {
            otherUserId: otherId,
            otherUserName: "Memuat...",
            otherUserAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherId}`,
            lastMessage: m.content,
            lastTime: new Date(m.created_at).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            unreadCount: 0,
          });
        }
        if (m.receiver_id === vendor!.user_id && !m.is_read) {
          map.get(otherId)!.unreadCount += 1;
        }
      }

      const otherIds = Array.from(map.keys());
      if (otherIds.length > 0) {
        const { data: usersData } = await supabase.from("users").select("id, full_name").in("id", otherIds);
        usersData?.forEach((u) => {
          const convo = map.get(u.id);
          if (convo) convo.otherUserName = u.full_name;
        });
      }

      setConversations(Array.from(map.values()));
    }

    fetchConversations();

    const channel = supabase
      .channel(`seller-inbox-${vendor.user_id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => fetchConversations())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [vendor]);

  useEffect(() => {
    if (!vendor) return;

    async function computeResponseRate() {
      const { data, error } = await supabase
        .from("messages")
        .select("sender_id, receiver_id, created_at")
        .or(`sender_id.eq.${vendor!.user_id},receiver_id.eq.${vendor!.user_id}`)
        .order("created_at", { ascending: true });

      if (error || !data || data.length === 0) {
        setResponseRate(null);
        setAvgResponseTime(null);
        return;
      }

      // Kelompokkan pesan per lawan bicara (buyer)
      const conversations = new Map<string, { sender_id: string; created_at: string }[]>();
      for (const m of data) {
        const otherId = m.sender_id === vendor!.user_id ? m.receiver_id : m.sender_id;
        if (!conversations.has(otherId)) conversations.set(otherId, []);
        conversations.get(otherId)!.push(m);
      }

      let totalInitiated = 0;
      let totalResponded = 0;
      const responseTimesMs: number[] = [];

      conversations.forEach((msgs) => {
        const firstBuyerMsg = msgs.find((m) => m.sender_id !== vendor!.user_id);
        if (!firstBuyerMsg) return; // vendor yang mulai duluan, bukan buyer -> tidak dihitung

        totalInitiated += 1;
        const firstBuyerTime = new Date(firstBuyerMsg.created_at).getTime();
        const vendorReply = msgs.find(
          (m) => m.sender_id === vendor!.user_id && new Date(m.created_at).getTime() > firstBuyerTime
        );

        if (vendorReply) {
          totalResponded += 1;
          responseTimesMs.push(new Date(vendorReply.created_at).getTime() - firstBuyerTime);
        }
      });

      setResponseRate(totalInitiated === 0 ? null : Math.round((totalResponded / totalInitiated) * 100));

      if (responseTimesMs.length > 0) {
        const avgMinutes = (responseTimesMs.reduce((a, b) => a + b, 0) / responseTimesMs.length) / 60000;
        if (avgMinutes < 60) setAvgResponseTime(`~${Math.round(avgMinutes)} menit`);
        else if (avgMinutes < 1440) setAvgResponseTime(`~${Math.round(avgMinutes / 60)} jam`);
        else setAvgResponseTime(`~${Math.round(avgMinutes / 1440)} hari`);
      } else {
        setAvgResponseTime(null);
      }
    }

    computeResponseRate();
  }, [vendor]);

  const handleAddPackage = async () => {
    if (!vendor || !newPkg.name || !newPkg.price) return;
    setSavingPkg(true);
    const ok = await createPackage(vendor.id, {
      name: newPkg.name,
      description: newPkg.description,
      price: Number(newPkg.price),
    });
    if (ok) {
      const updated = await getVendorPackages(vendor.id);
      setPackages(updated);
      setNewPkg({ name: "", description: "", price: "" });
      setShowAddPackage(false);
    }
    setSavingPkg(false);
  };

  const handleDeletePackage = async (id: string) => {
    const ok = await deletePackage(id);
    if (ok) setPackages(prev => prev.filter(p => p.id !== id));
  };

  const handleTogglePackage = async (id: string, current: boolean) => {
    const ok = await togglePackageActive(id, !current);
    if (ok) setPackages(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vendor) return;
    setUploadingPhoto(true);
    const ok = await uploadPortfolioImage(vendor.id, vendor.user_id, file);
    if (ok) {
      const updated = await getPortfolioImages(vendor.id);
      setPortfolio(updated);
    }
    setUploadingPhoto(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeletePhoto = async (img: PortfolioImage) => {
    if (!vendor) return;
    const ok = await deletePortfolioImage(img.id, img.image_url, vendor.user_id);
    if (ok) setPortfolio(prev => prev.filter(p => p.id !== img.id));
  };

  const handleToggleDate = async (date: string, currentlyAvailable: boolean | undefined) => {
    if (!vendor) return;
    const newValue = !(currentlyAvailable ?? false);
    const ok = await toggleAvailability(vendor.id, date, newValue);
    if (ok) {
      setAvailability(prev => {
        const exists = prev.find(a => a.date === date);
        if (exists) return prev.map(a => a.date === date ? { ...a, is_available: newValue } : a);
        return [...prev, { date, is_available: newValue }];
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!vendor) return;
    setSavingSettings(true);
    const ok = await updateMyVendor(vendor.id, {
      name: settingsForm.name,
      location: settingsForm.location,
      description: settingsForm.description,
    });
    if (ok) {
      setVendor({ ...vendor, ...settingsForm });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    }
    setSavingSettings(false);
  };

  const handleToggleVendorActive = async () => {
    if (!vendor) return;
    const currentlyActive = (vendor as any).is_active !== false;
    const actionText = currentlyActive ? "menonaktifkan" : "mengaktifkan kembali";
    const confirmed = window.confirm(
      currentlyActive
        ? "Yakin ingin menonaktifkan toko? Vendor kamu akan hilang dari pencarian sampai diaktifkan kembali. Data, riwayat pesanan, dan ulasan tetap tersimpan."
        : "Yakin ingin mengaktifkan kembali toko kamu? Vendor akan tampil lagi di pencarian."
    );
    if (!confirmed) return;

    setTogglingActive(true);
    const ok = await updateMyVendor(vendor.id, { is_active: !currentlyActive } as any);
    if (ok) {
      setVendor({ ...vendor, is_active: !currentlyActive } as any);
    }
    setTogglingActive(false);
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const categoryLabel = vendor ? (categories.find(c => c.id === vendor.category_id)?.name || "Vendor") : "";
  const isVendorActive = vendor ? (vendor as any).is_active !== false : true;

  const monthlyBookingData = MONTHS_ID.map((m, i) => ({
    month: m.slice(0, 3),
    booking: orders.filter(o => {
      const d = new Date(o.created_at);
      return d.getMonth() === i && d.getFullYear() === new Date().getFullYear();
    }).length,
  }));

  const statCards = [
    { label: "Pendapatan", value: formatPrice(revenue), icon: DollarSign, color: "#1CABB4", bg: "#E8F8F9" },
    { label: "Pesanan", value: String(orders.length), icon: ShoppingBag, color: "#6366F1", bg: "#EEF2FF" },
    { label: "Rating", value: avgRating ? avgRating.toFixed(1) : "Belum ada", icon: Star, color: "#22C55E", bg: "#DCFCE7" },
    { label: "Ulasan", value: String(reviewCount), icon: Eye, color: "#F59E0B", bg: "#FFF7ED" },
  ];

  // Checklist onboarding — bantu vendor baru tahu langkah selanjutnya, bukan sekadar angka nol
  const onboardingSteps: { key: string; label: string; done: boolean; tab: Tab }[] = [
    { key: "package", label: "Tambah minimal 1 paket layanan", done: packages.length > 0, tab: "paket" },
    { key: "portfolio", label: "Upload minimal 1 foto portofolio", done: portfolio.length > 0, tab: "portofolio" },
    { key: "description", label: "Lengkapi deskripsi toko", done: !!vendor?.description && vendor.description.trim().length > 0, tab: "pengaturan" },
    { key: "availability", label: "Atur ketersediaan kalender bulan ini", done: availability.length > 0, tab: "kalender" },
  ];
  const onboardingDoneCount = onboardingSteps.filter(s => s.done).length;
  const showOnboarding = onboardingDoneCount < onboardingSteps.length;

  // Item yang butuh aksi vendor sekarang — pesan belum dibalas & pesanan menunggu konfirmasi
  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;
  const needsAttentionTotal = totalUnread + pendingOrdersCount;

  if (vendorLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-bold text-[#1A3A3C] mb-2">Akun kamu belum terdaftar sebagai vendor</p>
        <p className="text-sm text-[#8ABDB5]">Silakan daftarkan vendor terlebih dahulu untuk mengakses dashboard ini.</p>
      </div>
    );
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-xl font-bold text-[#1A3A3C] flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          <div className="w-8 h-8 bg-[#1CABB4] rounded-xl flex items-center justify-center">
            <LayoutDashboard size={15} className="text-white" />
          </div>
          Dashboard Vendor
        </h1>
        <div className="flex items-center gap-2">
          {!isVendorActive && (
            <span className="text-[10px] font-bold bg-[#FEF2F2] text-[#EF4444] px-2.5 py-1.5 rounded-full">
              Toko Nonaktif
            </span>
          )}
          <a href={`/store/${vendor.id}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1CABB4] bg-[#E8F8F9] px-3 py-2 rounded-xl hover:bg-[#D0F0F2] transition-colors">
            <ExternalLink size={13} /> <span className="hidden sm:inline">Lihat Toko Saya</span>
          </a>
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm">
            <img src={vendor.logo_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${vendor.id}`} alt="" className="w-7 h-7 rounded-lg object-cover" />
            <span className="text-sm font-semibold text-[#1A3A3C] hidden md:block">{vendor.name}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-5">
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden sticky top-24">
            {SIDEBAR_ITEMS.map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors text-sm ${tab === item.id ? "bg-[#E8F8F9] text-[#1CABB4] font-semibold border-r-2 border-[#1CABB4]" : "text-[#4A7A6D] hover:bg-[#F0FBF5]"}`}>
                {item.icon}
                <span>{item.label}</span>
                {item.id === "inbox" && totalUnread > 0 && (
                  <span className="ml-auto w-5 h-5 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{totalUnread}</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0 space-y-5">

          {tab === "ringkasan" && (
            <>
              <h2 className="font-bold text-[#1A3A3C]">Ringkasan Bisnis</h2>

              {showOnboarding && (
                <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border-2 border-[#1CABB4]/20">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-[#1A3A3C]">Lengkapi Toko Kamu</h3>
                    <span className="text-xs font-semibold text-[#1CABB4]">{onboardingDoneCount}/{onboardingSteps.length}</span>
                  </div>
                  <p className="text-xs text-[#8ABDB5] mb-4">Selesaikan langkah ini biar toko kamu lebih siap ditemukan calon pelanggan.</p>
                  <div className="space-y-2">
                    {onboardingSteps.map((step) => (
                      <button key={step.key} onClick={() => setTab(step.tab)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left bg-[#F0FBF5] hover:bg-[#E8F8F9] transition-colors">
                        {step.done ? (
                          <CheckCircle2 size={16} className="text-[#1CABB4] flex-shrink-0" />
                        ) : (
                          <Circle size={16} className="text-[#D4EAC8] flex-shrink-0" />
                        )}
                        <span className={`text-sm flex-1 ${step.done ? "text-[#8ABDB5] line-through" : "text-[#1A3A3C] font-medium"}`}>
                          {step.label}
                        </span>
                        {!step.done && <ChevronRight size={14} className="text-[#8ABDB5]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {needsAttentionTotal > 0 && (
                <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border-2 border-[#F59E0B]/30">
                  <h3 className="font-bold text-sm text-[#1A3A3C] mb-3">Perlu Direspons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {totalUnread > 0 && (
                      <button onClick={() => setTab("inbox")}
                        className="flex items-center gap-3 bg-[#FFF7ED] rounded-xl px-3 py-3 hover:bg-[#FFEFDA] transition-colors text-left">
                        <MessageCircle size={16} className="text-[#F59E0B] flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-[#1A3A3C]">{totalUnread} pesan</p>
                          <p className="text-[10px] text-[#8ABDB5]">Belum dibalas</p>
                        </div>
                      </button>
                    )}
                    {pendingOrdersCount > 0 && (
                      <button onClick={() => setTab("pesanan")}
                        className="flex items-center gap-3 bg-[#FFF7ED] rounded-xl px-3 py-3 hover:bg-[#FFEFDA] transition-colors text-left">
                        <ShoppingBag size={16} className="text-[#F59E0B] flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-[#1A3A3C]">{pendingOrdersCount} pesanan</p>
                          <p className="text-[10px] text-[#8ABDB5]">Menunggu konfirmasi</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map(card => (
                  <div key={card.label} className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ background: card.bg }}>
                      <card.icon size={18} style={{ color: card.color }} />
                    </div>
                    <p className="text-lg font-extrabold text-[#1A3A3C]">{card.value}</p>
                    <p className="text-xs text-[#8ABDB5] mt-0.5">{card.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#1A3A3C] mb-4">Booking per Bulan ({new Date().getFullYear()})</h3>
                {orders.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-[#8ABDB5]">Belum ada data booking untuk ditampilkan.</p>
                    <p className="text-xs text-[#8ABDB5] mt-1">Grafik akan muncul otomatis begitu ada booking masuk.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={monthlyBookingData}>
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1CABB4" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#1CABB4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EAF5E4" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8ABDB5" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#8ABDB5" }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: 12 }} />
                      <Area type="monotone" dataKey="booking" stroke="#1CABB4" strokeWidth={2.5} fill="url(#grad)" dot={{ fill: "#1CABB4", r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-[#EAF5E4] flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#1A3A3C]">Pesanan Terkini</h3>
                  <button onClick={() => setTab("pesanan")} className="text-xs text-[#1CABB4] font-semibold flex items-center gap-1">
                    Lihat Semua <ChevronRight size={13} />
                  </button>
                </div>
                {orders.length === 0 ? (
                  <p className="text-center text-sm text-[#8ABDB5] py-10">Belum ada pesanan masuk</p>
                ) : (
                  <div className="divide-y divide-[#EAF5E4]">
                    {orders.slice(0, 4).map(order => (
                      <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#F0FBF5] transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1A3A3C] truncate">{order.package_name || "Paket"}</p>
                          <p className="text-xs text-[#4A7A6D]">{order.guest_name}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold text-[#1CABB4]">{formatPrice(order.total_price)}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-500"}`}>
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "pesanan" && (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#EAF5E4]">
                <h2 className="font-bold text-[#1A3A3C]">Semua Pesanan</h2>
              </div>
              {orders.length === 0 ? (
                <p className="text-center text-sm text-[#8ABDB5] py-16">Belum ada pesanan masuk</p>
              ) : (
                <div className="divide-y divide-[#EAF5E4]">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F0FBF5] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-500"}`}>
                            {STATUS_LABELS[order.status] || order.status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#1A3A3C]">{order.package_name || "Paket"}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#4A7A6D]">
                          <span className="flex items-center gap-1"><Users size={10} />{order.guest_name}</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{new Date(order.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                      </div>
                      <p className="font-extrabold text-[#1CABB4] flex-shrink-0">{formatPrice(order.total_price)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "inbox" && (
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm overflow-hidden">
              {!selectedConvo ? (
                <>
                  <div className="px-5 py-4 border-b border-[#EAF5E4]">
                    <h2 className="font-bold text-[#1A3A3C]">Inbox</h2>
                    <p className="text-xs text-[#8ABDB5] mt-0.5">{totalUnread} pesan belum dibaca</p>
                  </div>
                  {conversations.length === 0 ? (
                    <div className="py-16 text-center">
                      <MessageCircle size={32} className="text-[#D4EAC8] mx-auto mb-3" />
                      <p className="text-sm text-[#8ABDB5]">Belum ada pesan masuk</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#EAF5E4]">
                      {conversations.map((c) => (
                        <div key={c.otherUserId} onClick={() => setSelectedConvo(c)}
                          className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-[#F0FBF5] ${c.unreadCount > 0 ? "bg-[#F8FFFD]" : ""}`}>
                          <div className="relative flex-shrink-0">
                            <img src={c.otherUserAvatar} alt="" className="w-11 h-11 rounded-2xl bg-[#E8F8F9]" />
                            {c.unreadCount > 0 && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#1CABB4] rounded-full border-2 border-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className={`text-sm ${c.unreadCount > 0 ? "font-bold text-[#1A3A3C]" : "font-medium text-[#4A7A6D]"}`}>{c.otherUserName}</p>
                              <span className="text-[10px] text-[#8ABDB5]">{c.lastTime}</span>
                            </div>
                            <p className="text-xs text-[#4A7A6D] truncate">{c.lastMessage}</p>
                          </div>
                          <ChevronRight size={14} className="text-[#8ABDB5] flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col" style={{ height: 560 }}>
                  <div className="px-5 py-4 border-b border-[#EAF5E4] flex items-center gap-3">
                    <button onClick={() => setSelectedConvo(null)} className="text-[#8ABDB5] hover:text-[#1CABB4]">
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <img src={selectedConvo.otherUserAvatar} alt="" className="w-9 h-9 rounded-xl bg-[#E8F8F9]" />
                    <p className="font-bold text-sm text-[#1A3A3C]">{selectedConvo.otherUserName}</p>
                  </div>
                  <ChatThread currentUserId={vendor.user_id} otherUserId={selectedConvo.otherUserId} />
                </div>
              )}
            </div>
          )}

          {tab === "kalender" && (
            <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#1A3A3C]">{MONTHS_ID[calMonth]} {calYear}</h2>
                <div className="flex gap-2">
                  <button onClick={() => calMonth === 0 ? (setCalMonth(11), setCalYear(y => y - 1)) : setCalMonth(m => m - 1)}
                    className="w-8 h-8 rounded-xl bg-[#F0FBF5] text-[#4A7A6D] flex items-center justify-center hover:bg-[#E8F8F9] transition-colors text-lg">‹</button>
                  <button onClick={() => calMonth === 11 ? (setCalMonth(0), setCalYear(y => y + 1)) : setCalMonth(m => m + 1)}
                    className="w-8 h-8 rounded-xl bg-[#F0FBF5] text-[#4A7A6D] flex items-center justify-center hover:bg-[#E8F8F9] transition-colors text-lg">›</button>
                </div>
              </div>
              <p className="text-xs text-[#8ABDB5] mb-4">Klik tanggal untuk tandai tersedia / tidak tersedia</p>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_ID.map(d => <div key={d} className="text-center text-[10px] font-bold text-[#8ABDB5] py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const avail = availability.find(a => a.date === dateStr);
                  const isManuallyBlocked = avail?.is_available === false;
                  const hasBooking = orders.some(o => o.event_date === dateStr && o.status !== "cancelled");
                  const isUnavailable = hasBooking || isManuallyBlocked;

                  return (
                    <button key={day} onClick={() => !hasBooking && handleToggleDate(dateStr, !isManuallyBlocked)}
                      disabled={hasBooking}
                      className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold transition-colors border
                        ${isUnavailable
                          ? `bg-[#FEE2E2] text-[#EF4444] border-[#FCA5A5] ${hasBooking ? "cursor-not-allowed" : "hover:bg-[#FECACA]"}`
                          : "bg-white text-[#1A3A3C] border-[#D4EAC8] hover:border-[#1CABB4] hover:bg-[#F0FBF5]"}`}>
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#EAF5E4]">
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded bg-[#FEE2E2] border border-[#FCA5A5]" /><span className="text-[#4A7A6D]">Sudah dibooking / tidak tersedia</span></div>
                <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded bg-white border border-[#D4EAC8]" /><span className="text-[#4A7A6D]">Tersedia</span></div>
              </div>
            </div>
          )}

          {tab === "paket" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-[#1A3A3C]">Paket Layanan</h2>
                <button onClick={() => setShowAddPackage(true)}
                  className="flex items-center gap-2 bg-[#1CABB4] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#178E96] transition-colors">
                  <Plus size={14} /> Tambah Paket
                </button>
              </div>

              {showAddPackage && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-[#1CABB4] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#1A3A3C]">Paket Baru</h3>
                    <button onClick={() => setShowAddPackage(false)}><X size={16} className="text-[#8ABDB5]" /></button>
                  </div>
                  <input placeholder="Nama paket" value={newPkg.name} onChange={e => setNewPkg(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1CABB4]" />
                  <textarea placeholder="Deskripsi" value={newPkg.description} onChange={e => setNewPkg(p => ({ ...p, description: e.target.value }))} rows={2}
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1CABB4] resize-none" />
                  <input type="number" placeholder="Harga (contoh: 3500000)" value={newPkg.price} onChange={e => setNewPkg(p => ({ ...p, price: e.target.value }))}
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#1CABB4]" />
                  <button onClick={handleAddPackage} disabled={savingPkg}
                    className="w-full bg-[#1CABB4] text-white font-bold py-2.5 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-60">
                    {savingPkg ? "Menyimpan..." : "Simpan Paket"}
                  </button>
                </div>
              )}

              {packages.length === 0 ? (
                <p className="text-center text-sm text-[#8ABDB5] py-10 bg-white/80 rounded-2xl">Belum ada paket layanan</p>
              ) : (
                packages.map((pkg) => (
                  <div key={pkg.id} className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[#1A3A3C]">{pkg.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pkg.is_active ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                          {pkg.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="text-xs text-[#4A7A6D]">{pkg.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-extrabold text-[#1CABB4] text-lg">{formatPrice(pkg.price)}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleTogglePackage(pkg.id, pkg.is_active)}
                          className="text-[10px] bg-[#E8F8F9] text-[#1CABB4] font-semibold px-2.5 py-1.5 rounded-lg hover:bg-[#1CABB4] hover:text-white transition-colors">
                          {pkg.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button onClick={() => handleDeletePackage(pkg.id)}
                          className="w-7 h-7 flex items-center justify-center bg-[#FEF2F2] text-[#EF4444] rounded-lg hover:bg-[#EF4444] hover:text-white transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "portofolio" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#1A3A3C]">Portofolio ({portfolio.length} karya)</h2>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}
                  className="flex items-center gap-2 bg-[#1CABB4] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-60">
                  {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {uploadingPhoto ? "Mengupload..." : "Upload Foto"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadPhoto} className="hidden" />
              </div>
              {portfolio.length === 0 ? (
                <p className="text-center text-sm text-[#8ABDB5] py-16 bg-white/80 rounded-2xl">Belum ada foto portofolio</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {portfolio.map((img) => (
                    <div key={img.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer">
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button onClick={() => handleDeletePhoto(img)}
                          className="w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center hover:bg-white transition-colors">
                          <Trash2 size={15} className="text-[#EF4444]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "statistik" && (
            <div className="space-y-5">
              <h2 className="font-bold text-[#1A3A3C]">Statistik Performa</h2>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#1A3A3C] mb-4">Booking per Bulan</h3>
                {orders.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-[#8ABDB5]">Belum ada data booking untuk ditampilkan.</p>
                    <p className="text-xs text-[#8ABDB5] mt-1">Grafik akan muncul otomatis begitu ada booking masuk.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyBookingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EAF5E4" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8ABDB5" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#8ABDB5" }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: 12 }} />
                      <Bar dataKey="booking" fill="#1CABB4" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Pesanan", value: String(orders.length), icon: <ShoppingBag size={16} className="text-[#1CABB4]" />, bg: "#E8F8F9" },
                  { label: "Rating Rata-rata", value: avgRating ? avgRating.toFixed(1) : "Belum ada data", icon: <Star size={16} className="text-[#F59E0B]" />, bg: "#FFF7ED" },
                  { label: "Total Ulasan", value: String(reviewCount), icon: <Eye size={16} className="text-[#6366F1]" />, bg: "#EEF2FF" },
                  { label: "Area Layanan", value: vendor.location || "Belum diisi", icon: <MapPin size={16} className="text-[#22C55E]" />, bg: "#DCFCE7" },
                  { label: "Response Rate", value: responseRate != null ? `${responseRate}%` : "Belum ada data", icon: <MessageCircle size={16} className="text-[#1CABB4]" />, bg: "#E8F8F9" },
                  { label: "Rata-rata Waktu Respons", value: avgResponseTime || "Belum ada data", icon: <Clock size={16} className="text-[#F59E0B]" />, bg: "#FFF7ED" },
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
              <p className="text-xs text-[#8ABDB5] text-center">
                Metrik Profile Views belum tersedia — perlu sistem tracking tambahan.
              </p>
            </div>
          )}

          {tab === "pengaturan" && (
            <div className="space-y-4">
              <h2 className="font-bold text-[#1A3A3C]">Pengaturan Akun Vendor</h2>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#1A3A3C] mb-4">Informasi Vendor</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#8ABDB5] block mb-1">Nama Vendor</label>
                    <input value={settingsForm.name} onChange={e => setSettingsForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#8ABDB5] block mb-1">Kategori</label>
                    <input value={categoryLabel} disabled
                      className="w-full bg-[#F3F4F6] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#8ABDB5]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#8ABDB5] block mb-1">Lokasi</label>
                    <input value={settingsForm.location} onChange={e => setSettingsForm(p => ({ ...p, location: e.target.value }))}
                      className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#8ABDB5] block mb-1">Deskripsi</label>
                    <textarea value={settingsForm.description} onChange={e => setSettingsForm(p => ({ ...p, description: e.target.value }))} rows={3}
                      className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] resize-none" />
                  </div>
                </div>
                {settingsSaved && <p className="text-xs text-[#15803D] mt-3 text-center">Perubahan tersimpan!</p>}
                <button onClick={handleSaveSettings} disabled={savingSettings}
                  className="w-full mt-4 bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
                  {savingSettings ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>

              {/* Zona Berbahaya — Nonaktifkan/Aktifkan Toko */}
              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm border-2 border-[#FEF2F2]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-[#EF4444]" />
                  <h3 className="font-bold text-sm text-[#EF4444]">Zona Berbahaya</h3>
                </div>
                <p className="text-xs text-[#8ABDB5] mb-4">
                  {isVendorActive
                    ? "Menonaktifkan toko akan menyembunyikan vendor kamu dari pencarian. Data, riwayat pesanan, dan ulasan tetap tersimpan — kamu bisa aktifkan kembali kapan saja."
                    : "Toko kamu sedang nonaktif dan tidak tampil di pencarian. Aktifkan kembali agar calon pelanggan bisa menemukan vendor kamu lagi."}
                </p>
                <button
                  onClick={handleToggleVendorActive}
                  disabled={togglingActive}
                  className={`w-full font-bold py-3 rounded-xl transition-colors disabled:opacity-60 ${
                    isVendorActive
                      ? "border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]"
                      : "bg-[#1CABB4] text-white hover:bg-[#178E96]"
                  }`}
                >
                  {togglingActive
                    ? "Memproses..."
                    : isVendorActive
                      ? "Nonaktifkan Toko"
                      : "Aktifkan Kembali Toko"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}