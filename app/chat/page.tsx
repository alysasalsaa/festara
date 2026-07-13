"use client";
import { useState, useEffect, Suspense } from "react";
import { Search, MoreVertical, Phone, Star, BadgeCheck, MapPin, Calendar, CreditCard, Check, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { formatPrice, categories } from "@/data";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/lib/supabase";
import { getVendorById, SupabaseVendor } from "@/lib/vendors";
import ChatThread from "@/components/ChatThread";

const STEPS = ["Pilih Paket", "Detail Acara", "Pembayaran", "Konfirmasi"];

type VendorPkg = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_popular: boolean;
};

function ChatBookingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");

  const [vendor, setVendor] = useState<SupabaseVendor | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);

  const [packages, setPackages] = useState<VendorPkg[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  const [activeStep, setActiveStep] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [eventDate, setEventDate] = useState(searchParams.get("date") || "2026-11-12");
  const [eventLocation, setEventLocation] = useState("");
  const [guestName, setGuestName] = useState("");
  const [notes, setNotes] = useState("");
  const [paid, setPaid] = useState(false);
  const [payError, setPayError] = useState("");

  const [bookingId, setBookingId] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [creatingTransaction, setCreatingTransaction] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
      setGuestName(name);
    }
  }, [user]);

  useEffect(() => {
    async function fetchVendor() {
      if (!vendorId) {
        setVendorLoading(false);
        return;
      }
      const v = await getVendorById(vendorId);
      setVendor(v);
      setVendorLoading(false);
    }
    fetchVendor();
  }, [vendorId]);

  useEffect(() => {
    async function fetchPackages() {
      if (!vendorId) {
        setPackagesLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("packages")
        .select("id, name, description, price, is_popular")
        .eq("vendor_id", vendorId)
        .eq("is_active", true)
        .order("price");

      if (!error && data) {
        setPackages(data);
        if (data.length > 0) setSelectedPkg(0);
      }
      setPackagesLoading(false);
    }
    fetchPackages();
  }, [vendorId]);

  const pkg = selectedPkg !== null ? packages[selectedPkg] : null;

  useEffect(() => {
    async function createBookingAndTransaction() {
      if (activeStep < 2 || !pkg || bookingId || !user || !vendor) return;

      setCreatingTransaction(true);
      setPayError("");

      try {
        const { data: booking, error: bookingError } = await supabase
  .from("bookings")
  .insert({
    buyer_id: user.id,
    vendor_id: vendor.id,
    package_id: pkg.id,
    event_date: eventDate,
    event_location: eventLocation,
    guest_name: guestName,
    notes,
    status: "pending",
    total_price: pkg.price,
    dp_amount: pkg.price,
  })
  .select("id")
  .single();

        if (bookingError || !booking) {
          throw new Error("Gagal menyimpan booking: " + bookingError?.message);
        }

        setBookingId(booking.id);

        const newOrderId = `FST-${booking.id.slice(0, 8)}-${Date.now()}`;
        setOrderId(newOrderId);

        const res = await fetch("/api/midtrans/create-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: newOrderId, amount: pkg.price }),
        });
        const result = await res.json();

        if (!result.success) {
          throw new Error(result.error || "Gagal membuat transaksi pembayaran");
        }

        const qrAction = result.data.actions?.find((a: any) => a.name === "generate-qr-code");
        if (qrAction) {
          setQrUrl(qrAction.url);
        }

        await supabase.from("transactions").insert({
          booking_id: booking.id,
          order_id: newOrderId,
          amount: pkg.price,
          payment_method: "qris",
          status: "pending",
        });
      } catch (err: any) {
        console.error("Booking/transaction error:", err);
        setPayError(err.message || "Terjadi kesalahan saat membuat pesanan.");
      } finally {
        setCreatingTransaction(false);
      }
    }

    createBookingAndTransaction();
  }, [activeStep, pkg, bookingId, user, vendor, eventDate, eventLocation, guestName, notes]);

  if (loading || vendorLoading || packagesLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  if (!vendorId || !vendor) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-lg font-bold text-[#1A3A3C] mb-2">Vendor tidak ditemukan</p>
        <p className="text-sm text-[#8ABDB5] mb-6">Silakan mulai chat dari halaman detail vendor.</p>
        <Link href="/search" className="text-[#1CABB4] font-semibold hover:underline">Cari Vendor</Link>
      </div>
    );
  }

  const categoryLabel = categories.find(c => c.id === vendor.category_id)?.name || "Vendor";
  const logoImage = vendor.logo_url || "https://api.dicebear.com/7.x/shapes/svg?seed=" + vendor.id;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="text-xs text-[#8ABDB5] mb-5 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#1CABB4]">Beranda</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-[#1CABB4]">Cari Vendor</Link>
        <span>/</span>
        <span className="text-[#1A3A3C] font-medium">Chat & Booking</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── PANEL 1: CHAT (REALTIME) ── */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden" style={{ height: 600 }}>
          <div className="p-4 border-b border-[#EAF5E4] flex items-center gap-3">
            <img src={logoImage} alt={vendor.name} className="w-10 h-10 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-[#1A3A3C] truncate">{vendor.name}</p>
                <BadgeCheck size={13} className="text-[#1CABB4] flex-shrink-0" />
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#8ABDB5]">
                <MapPin size={9} />{vendor.location || "-"}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]"><Phone size={15} className="text-[#4A7A6D]" /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5]"><MoreVertical size={15} className="text-[#4A7A6D]" /></button>
            </div>
          </div>

          <ChatThread currentUserId={user.id} otherUserId={vendor.user_id} />

          <div className="px-4 py-2 border-t border-[#EAF5E4]">
            <button onClick={() => setActiveStep(1)}
              className="w-full text-xs font-semibold text-[#1CABB4] bg-[#E8F8F9] py-2 rounded-xl hover:bg-[#D0F0F2] transition-colors flex items-center justify-center gap-1.5">
              <Calendar size={13} /> Lanjut ke Booking <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* ── PANEL 2: BOOKING ── */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden" style={{ height: 600 }}>
          <div className="px-4 pt-4 pb-3 border-b border-[#EAF5E4]">
            <p className="text-xs font-bold text-[#1A3A3C] mb-3">Booking</p>
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                      ${i < activeStep ? "bg-[#1CABB4] text-white" : i === activeStep ? "bg-[#1CABB4] text-white ring-4 ring-[#E8F8F9]" : "bg-[#EAF5E4] text-[#8ABDB5]"}`}>
                      {i < activeStep ? <Check size={10} /> : i + 1}
                    </div>
                    <span className={`text-[9px] mt-1 whitespace-nowrap ${i <= activeStep ? "text-[#1CABB4] font-semibold" : "text-[#8ABDB5]"}`}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < activeStep ? "bg-[#1CABB4]" : "bg-[#EAF5E4]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeStep === 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#1A3A3C] mb-2">Pilih Paket</p>
                {packages.length === 0 ? (
                  <p className="text-center text-sm text-[#8ABDB5] py-10">Vendor ini belum menambahkan paket layanan.</p>
                ) : (
                  packages.map((p, i) => (
                    <div key={p.id} onClick={() => setSelectedPkg(i)}
                      className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${selectedPkg === i ? "border-[#1CABB4] bg-[#E8F8F9]/40" : "border-[#D4EAC8] hover:border-[#DBEBC9]"}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-[#1A3A3C]">{p.name}</p>
                            {p.is_popular && <span className="text-[9px] bg-[#1CABB4] text-white px-1.5 py-0.5 rounded-full font-bold">Terpopuler</span>}
                          </div>
                          <p className="text-xs text-[#8ABDB5] mt-0.5">{p.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-[#1CABB4]">{formatPrice(p.price)}</p>
                          <div className={`w-4 h-4 rounded-full border-2 mt-1 ml-auto flex items-center justify-center ${selectedPkg === i ? "bg-[#1CABB4] border-[#1CABB4]" : "border-[#D4EAC8]"}`}>
                            {selectedPkg === i && <Check size={9} className="text-white" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeStep === 1 && pkg && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#1A3A3C]">Detail Acara</p>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Nama Pengantin / Penanggung Jawab</p>
                  <input value={guestName} onChange={e => setGuestName(e.target.value)}
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]" />
                </div>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Paket Dipilih</p>
                  <div className="border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] bg-[#F0FBF5] font-semibold">
                    {pkg.name} — <span className="text-[#1CABB4]">{formatPrice(pkg.price)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Tanggal Acara</p>
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]" />
                </div>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Lokasi Acara</p>
                  <input value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                    placeholder="Contoh: Kaliurang, Yogyakarta"
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]" />
                </div>
                <div>
                  <p className="text-xs text-[#4A7A6D] mb-1.5">Catatan <span className="text-[#8ABDB5]">(opsional)</span></p>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    placeholder="Contoh: tema rustic, outdoor, golden hour..."
                    className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] resize-none placeholder:text-[#8ABDB5] bg-[#F0FBF5]" />
                </div>
              </div>
            )}

            {activeStep >= 2 && pkg && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#1A3A3C]">Ringkasan Booking</p>
                <div className="flex items-center gap-3 bg-[#F0FBF5] rounded-xl p-3">
                  <img src={logoImage} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-bold text-[#1A3A3C]">{vendor.name}</p>
                    <p className="text-xs text-[#8ABDB5]">{categoryLabel} · {vendor.location}</p>
                  </div>
                </div>
                {[
                  { label: "Paket", value: pkg.name },
                  { label: "Atas Nama", value: guestName },
                  { label: "Tanggal Acara", value: new Date(eventDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) },
                  { label: "Lokasi", value: eventLocation },
                  { label: "Total Pembayaran", value: formatPrice(pkg.price), bold: true },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-[#EAF5E4]">
                    <span className="text-xs text-[#8ABDB5]">{item.label}</span>
                    <span className={`text-xs text-right max-w-[60%] ${item.bold ? "font-extrabold text-[#1CABB4]" : "font-semibold text-[#1A3A3C]"}`}>{item.value}</span>
                  </div>
                ))}
                {activeStep === 2 && (
                  <div className="mt-2">
                    <p className="text-xs font-bold text-[#1A3A3C] mb-2">Metode Pembayaran</p>
                    <div className="border-2 border-[#1CABB4] bg-[#E8F8F9]/40 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1CABB4] rounded-lg flex items-center justify-center">
                        <CreditCard size={15} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1A3A3C]">QRIS</p>
                        <p className="text-[10px] text-[#8ABDB5]">Scan & bayar dari semua aplikasi</p>
                      </div>
                      <Check size={14} className="text-[#1CABB4] ml-auto" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#EAF5E4]">
            {activeStep < 2 ? (
              <button onClick={() => setActiveStep(s => Math.min(s + 1, 2))}
                disabled={activeStep === 0 && selectedPkg === null}
                className="w-full bg-[#1CABB4] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-50">
                {activeStep === 0 ? "Pilih Paket Ini" : "Konfirmasi Detail"}
              </button>
            ) : (
              <button onClick={() => setActiveStep(3)}
                className="w-full bg-[#1CABB4] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors">
                Lanjut ke Pembayaran
              </button>
            )}
            {activeStep > 0 && (
              <button onClick={() => setActiveStep(s => s - 1)} className="w-full text-xs text-[#8ABDB5] mt-2 py-1 hover:text-[#4A7A6D] transition-colors">
                ← Kembali
              </button>
            )}
          </div>
        </div>

        {/* ── PANEL 3: PEMBAYARAN (QRIS asli dari Midtrans Sandbox) ── */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden" style={{ height: 600 }}>
          <div className="px-4 pt-4 pb-3 border-b border-[#EAF5E4]">
            <p className="text-xs font-bold text-[#1A3A3C]">Pembayaran</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-between p-5">
            {!pkg ? (
              <p className="text-sm text-[#8ABDB5] text-center py-10">Pilih paket terlebih dahulu di panel Booking.</p>
            ) : !paid ? (
              <>
                <div className="w-full">
                  <div className="border-2 border-[#1CABB4] bg-[#E8F8F9]/40 rounded-xl p-3 flex items-center gap-3 mb-5">
                    <span className="text-xl">🏦</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#1A3A3C]">QRIS</p>
                      <p className="text-[10px] text-[#8ABDB5]">Semua aplikasi dompet digital</p>
                    </div>
                    <Check size={14} className="text-[#1CABB4]" />
                  </div>

                  <div className="bg-[#F0FBF5] rounded-2xl p-4 flex flex-col items-center border border-[#D4EAC8] mb-4">
                    <p className="text-xs text-[#8ABDB5] mb-3">Scan QR Code untuk membayar</p>
                    <div className="w-36 h-36 bg-white border-2 border-[#1CABB4] rounded-xl flex items-center justify-center overflow-hidden">
                      {creatingTransaction ? (
                        <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
                      ) : qrUrl ? (
                        <img src={qrUrl} alt="QRIS Code" className="w-full h-full object-contain" />
                      ) : (
                        <p className="text-xs text-[#8ABDB5] text-center px-2">QR belum tersedia</p>
                      )}
                    </div>
                    <p className="text-sm font-extrabold text-[#1CABB4] mt-3">{formatPrice(pkg.price)}</p>
                    <p className="text-[10px] text-[#8ABDB5] mt-0.5">{pkg.name} · {vendor.name}</p>
                    {orderId && <p className="text-[9px] text-[#8ABDB5] mt-1">Order ID: {orderId}</p>}
                  </div>
                </div>

                {payError && (
                  <p className="text-xs text-[#EF4444] text-center mt-2">{payError}</p>
                )}

                <div className="w-full mt-4">
                  <p className="text-[10px] text-center text-[#8ABDB5]">
                    Ini environment Sandbox — gunakan Midtrans Simulator untuk simulasi pembayaran, bukan aplikasi e-wallet asli.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-20 h-20 bg-[#E8F8F9] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(28,171,180,0.2)]">
                  <Check size={36} className="text-[#1CABB4]" strokeWidth={3} />
                </div>
                <div>
                  <p className="font-extrabold text-lg text-[#1A3A3C]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Pembayaran Berhasil!</p>
                  <p className="text-sm text-[#8ABDB5] mt-1">Booking kamu telah tersimpan</p>
                </div>
                <Link href="/dashboard" className="w-full bg-[#1CABB4] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors text-center">
                  Lihat Pesanan Saya →
                </Link>
                <Link href="/search" className="text-xs text-[#8ABDB5] hover:text-[#1CABB4] transition-colors">
                  Cari vendor lain
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ChatBookingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ChatBookingContent />
    </Suspense>
  );
}