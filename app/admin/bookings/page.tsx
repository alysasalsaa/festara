"use client";
import { useState, useEffect } from "react";
import { Calendar, MapPin, User, Store, Loader2, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/data";

const STATUS_FILTERS = [
  { value: "", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "processing", label: "Diproses" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "Menunggu", className: "bg-[#F0FBF5] text-[#8ABDB5]" },
  confirmed: { label: "Dikonfirmasi", className: "bg-[#E0F2FE] text-[#0369A1]" },
  processing: { label: "Diproses", className: "bg-[#FFF7ED] text-[#F59E0B]" },
  completed: { label: "Selesai", className: "bg-[#DCFCE7] text-[#15803D]" },
  cancelled: { label: "Dibatalkan", className: "bg-[#FEF2F2] text-[#EF4444]" },
};

const PAYMENT_STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "Belum Bayar", className: "bg-[#F3F4F6] text-[#6B7280]" },
  waiting_verification: { label: "Menunggu Verifikasi", className: "bg-[#FFF7ED] text-[#F59E0B]" },
  paid: { label: "Lunas", className: "bg-[#DCFCE7] text-[#15803D]" },
  disbursed: { label: "Diteruskan ke Vendor", className: "bg-[#E0F2FE] text-[#0369A1]" },
  rejected: { label: "Bukti Ditolak", className: "bg-[#FEF2F2] text-[#EF4444]" },
};

type BookingRow = {
  id: string;
  guest_name: string;
  event_date: string;
  event_location: string;
  status: string;
  total_price: number;
  created_at: string;
  users: { full_name: string; email: string } | null;
  vendors: { name: string } | null;
  packages: { name: string } | null;
  transactions: { status: string }[] | null;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchData() {
    setLoading(true);
    let query = supabase
      .from("bookings")
      .select(
        `id, guest_name, event_date, event_location, status, total_price, created_at,
        users ( full_name, email ),
        vendors ( name ),
        packages ( name ),
        transactions ( status )`
      )
      .order("created_at", { ascending: false });

    if (filter) query = query.eq("status", filter);

    const { data, error } = await query;
    if (!error && data) setBookings(data as unknown as BookingRow[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function handleStatusChange(bookingId: string, newStatus: string) {
    setProcessingId(bookingId);
    setErrorMsg("");

    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId);

    if (error) {
      setErrorMsg("Gagal mengubah status: " + error.message);
    } else {
      await fetchData();
    }
    setProcessingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-bold text-[#1A3A3C]">Semua Booking</h2>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
                filter === f.value ? "bg-[#1CABB4] text-white" : "bg-white text-[#4A7A6D] border border-[#D4EAC8]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-4 py-3">
          <p className="text-sm text-[#EF4444]">{errorMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-sm text-[#8ABDB5] py-16 bg-white/80 rounded-2xl">Tidak ada booking untuk filter ini</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const statusInfo = STATUS_LABEL[b.status] || { label: b.status, className: "bg-[#F3F4F6] text-[#6B7280]" };
            const paymentStatus = b.transactions?.[0]?.status;
            const paymentInfo = paymentStatus ? PAYMENT_STATUS_LABEL[paymentStatus] : null;

            return (
              <div key={b.id} className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div>
                    <h3 className="font-bold text-[#1A3A3C]">{b.guest_name}</h3>
                    <p className="text-xs text-[#8ABDB5]">
                      {b.users?.full_name || "Pengguna"} ({b.users?.email})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {paymentInfo && (
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${paymentInfo.className}`}>
                        {paymentInfo.label}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-3 text-xs text-[#4A7A6D] mb-3">
                  <div className="flex items-center gap-1.5">
                    <Store size={12} /> {b.vendors?.name || "-"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package size={12} /> {b.packages?.name || "-"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />{" "}
                    {new Date(b.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} /> {b.event_location || "-"}
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-[#E8F8F9] text-[#1CABB4] font-extrabold px-2.5 py-1 rounded-full">
                      {formatPrice(b.total_price)}
                    </span>
                    <span className="text-[10px] text-[#8ABDB5]">
                      Dibuat {new Date(b.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {processingId === b.id && <Loader2 size={14} className="animate-spin text-[#1CABB4]" />}
                    <select
                      value={b.status}
                      disabled={processingId === b.id}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="text-xs border border-[#D4EAC8] rounded-xl px-2.5 py-1.5 text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-white disabled:opacity-60"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="confirmed">Dikonfirmasi</option>
                      <option value="processing">Diproses</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}