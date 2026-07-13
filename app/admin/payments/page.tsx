"use client";
import { useState, useEffect } from "react";
import { Check, X, Clock, Loader2, Wallet, Calendar, MapPin, User, Store, ArrowRightCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { formatPrice } from "@/data";

const FILTERS = [
  { value: "waiting_verification", label: "Menunggu Verifikasi" },
  { value: "paid", label: "Lunas" },
  { value: "disbursed", label: "Diteruskan ke Vendor" },
  { value: "rejected", label: "Ditolak" },
  { value: "", label: "Semua" },
];

type TransactionRow = {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  payment_proof_url: string | null;
  proof_uploaded_at: string | null;
  rejection_reason: string | null;
  verified_at: string | null;
  disbursed_at: string | null;
  created_at: string;
  bookings: {
    id: string;
    buyer_id: string;
    guest_name: string;
    event_date: string;
    event_location: string;
    users: { full_name: string; email: string } | null;
    vendors: { user_id: string; name: string } | null;
    packages: { name: string } | null;
  } | null;
};

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  pending: { label: "Menunggu Bukti", className: "bg-[#F0FBF5] text-[#8ABDB5]" },
  waiting_verification: { label: "Menunggu Verifikasi", className: "bg-[#FFF7ED] text-[#F59E0B]" },
  paid: { label: "Lunas", className: "bg-[#DCFCE7] text-[#15803D]" },
  disbursed: { label: "Diteruskan ke Vendor", className: "bg-[#E0F2FE] text-[#0369A1]" },
  rejected: { label: "Ditolak", className: "bg-[#FEF2F2] text-[#EF4444]" },
  failed: { label: "Gagal", className: "bg-[#F3F4F6] text-[#6B7280]" },
  expired: { label: "Kedaluwarsa", className: "bg-[#F3F4F6] text-[#6B7280]" },
};

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("waiting_verification");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  async function fetchData() {
    setLoading(true);
    let query = supabase
      .from("transactions")
      .select(
        `id, order_id, amount, status, payment_proof_url, proof_uploaded_at, rejection_reason, verified_at, disbursed_at, created_at,
        bookings (
          id, buyer_id, guest_name, event_date, event_location,
          users ( full_name, email ),
          vendors ( user_id, name ),
          packages ( name )
        )`
      )
      .order("created_at", { ascending: false });

    if (filter) query = query.eq("status", filter);

    const { data, error } = await query;
    if (!error && data) setTransactions(data as unknown as TransactionRow[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function openProof(path: string) {
    const { data, error } = await supabase.storage.from("payment-proofs").createSignedUrl(path, 3600);
    if (data?.signedUrl) setPreviewImage(data.signedUrl);
    else setErrorMsg("Gagal memuat gambar bukti transfer: " + error?.message);
  }

  async function handleApprove(trx: TransactionRow) {
    if (!user) return;
    setProcessingId(trx.id);
    setErrorMsg("");

    const { error } = await supabase
      .from("transactions")
      .update({ status: "paid", verified_by: user.id, verified_at: new Date().toISOString() })
      .eq("id", trx.id);

    if (error) {
      setErrorMsg("Gagal approve: " + error.message);
      setProcessingId(null);
      return;
    }

    if (trx.bookings?.buyer_id) {
      await supabase.from("notifications").insert({
        user_id: trx.bookings.buyer_id,
        type: "payment_verified",
        title: "Pembayaran Terverifikasi",
        message: `Pembayaran untuk booking ${trx.order_id} sudah dikonfirmasi. Vendor akan segera memproses pesananmu.`,
      });
    }

    await fetchData();
    setProcessingId(null);
  }

  async function handleReject(trx: TransactionRow) {
    if (!user || !rejectReason.trim()) return;
    setProcessingId(trx.id);
    setErrorMsg("");

    const { error } = await supabase
      .from("transactions")
      .update({
        status: "rejected",
        rejection_reason: rejectReason.trim(),
        verified_by: user.id,
        verified_at: new Date().toISOString(),
      })
      .eq("id", trx.id);

    if (error) {
      setErrorMsg("Gagal menolak: " + error.message);
      setProcessingId(null);
      return;
    }

    if (trx.bookings?.buyer_id) {
      await supabase.from("notifications").insert({
        user_id: trx.bookings.buyer_id,
        type: "payment_rejected",
        title: "Bukti Transfer Ditolak",
        message: `Bukti transfer untuk booking ${trx.order_id} ditolak: ${rejectReason.trim()}. Silakan unggah ulang bukti yang benar.`,
      });
    }

    setRejectingId(null);
    setRejectReason("");
    await fetchData();
    setProcessingId(null);
  }

  async function handleDisburse(trx: TransactionRow) {
    if (!user) return;
    setProcessingId(trx.id);
    setErrorMsg("");

    const { error } = await supabase
      .from("transactions")
      .update({ status: "disbursed", disbursed_by: user.id, disbursed_at: new Date().toISOString() })
      .eq("id", trx.id);

    if (error) {
      setErrorMsg("Gagal menandai diteruskan: " + error.message);
      setProcessingId(null);
      return;
    }

    const vendorUserId = trx.bookings?.vendors?.user_id;
    if (vendorUserId) {
      await supabase.from("notifications").insert({
        user_id: vendorUserId,
        type: "payment_disbursed",
        title: "Dana Sudah Diteruskan",
        message: `Dana untuk booking ${trx.order_id} sudah ditransfer admin ke rekening kamu.`,
      });
    }

    await fetchData();
    setProcessingId(null);
  }

  return (
    <div className="space-y-4">
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Bukti Transfer" className="max-w-full max-h-full rounded-2xl" />
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-bold text-[#1A3A3C]">Verifikasi Pembayaran</h2>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
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
      ) : transactions.length === 0 ? (
        <p className="text-center text-sm text-[#8ABDB5] py-16 bg-white/80 rounded-2xl">Tidak ada transaksi untuk filter ini</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((trx) => {
            const statusInfo = STATUS_LABEL[trx.status] || { label: trx.status, className: "bg-[#F3F4F6] text-[#6B7280]" };
            const isWaitingVerification = trx.status === "waiting_verification";
            const isPaid = trx.status === "paid";
            const isRejecting = rejectingId === trx.id;

            return (
              <div key={trx.id} className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-bold text-[#1A3A3C]">{trx.order_id}</h3>
                    <p className="text-xs text-[#8ABDB5]">
                      {trx.bookings?.users?.full_name || "Pengguna"} ({trx.bookings?.users?.email})
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-3 text-xs text-[#4A7A6D] mb-3">
                  <div className="flex items-center gap-1.5">
                    <Store size={12} /> {trx.bookings?.vendors?.name || "-"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={12} /> {trx.bookings?.packages?.name || "-"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />{" "}
                    {trx.bookings?.event_date
                      ? new Date(trx.bookings.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "-"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} /> {trx.bookings?.event_location || "-"}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-xs bg-[#E8F8F9] text-[#1CABB4] font-extrabold px-2.5 py-1 rounded-full">
                    {formatPrice(trx.amount)}
                  </span>
                  <span className="text-[10px] text-[#8ABDB5] flex items-center gap-1">
                    <Clock size={11} />
                    Dibuat {new Date(trx.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                {trx.status === "rejected" && trx.rejection_reason && (
                  <div className="bg-[#FEF2F2] rounded-xl px-3 py-2 mb-3">
                    <p className="text-[10px] text-[#B91C1C]">Alasan penolakan: {trx.rejection_reason}</p>
                  </div>
                )}

                {trx.payment_proof_url ? (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-[#1A3A3C] mb-2 flex items-center gap-1.5">
                      <Wallet size={13} />
                      Bukti Transfer
                    </p>
                    <button
                      onClick={() => openProof(trx.payment_proof_url!)}
                      className="text-xs text-[#1CABB4] font-semibold border border-[#D4EAC8] rounded-xl px-3 py-2 hover:bg-[#F0FBF5] transition-colors"
                    >
                      Lihat Bukti Transfer →
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-[#8ABDB5] mb-4">Buyer belum mengunggah bukti transfer.</p>
                )}

                {isWaitingVerification && !isRejecting && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(trx)}
                      disabled={processingId === trx.id}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#1CABB4] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-60"
                    >
                      {processingId === trx.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      Setujui
                    </button>
                    <button
                      onClick={() => setRejectingId(trx.id)}
                      disabled={processingId === trx.id}
                      className="flex-1 flex items-center justify-center gap-1.5 border border-[#EF4444] text-[#EF4444] text-sm font-bold py-2.5 rounded-xl hover:bg-[#FEF2F2] transition-colors disabled:opacity-60"
                    >
                      <X size={14} />
                      Tolak
                    </button>
                  </div>
                )}

                {isWaitingVerification && isRejecting && (
                  <div className="space-y-2">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Alasan penolakan (contoh: nominal tidak sesuai, bukti tidak jelas, dll)"
                      rows={2}
                      className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2 text-sm text-[#1A3A3C] outline-none focus:border-[#EF4444] resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(trx)}
                        disabled={!rejectReason.trim() || processingId === trx.id}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#EF4444] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#DC2626] transition-colors disabled:opacity-50"
                      >
                        {processingId === trx.id ? <Loader2 size={14} className="animate-spin" /> : "Konfirmasi Tolak"}
                      </button>
                      <button
                        onClick={() => { setRejectingId(null); setRejectReason(""); }}
                        className="flex-1 border border-[#D4EAC8] text-[#4A7A6D] text-sm font-bold py-2.5 rounded-xl hover:bg-[#F0FBF5] transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {isPaid && (
                  <button
                    onClick={() => handleDisburse(trx)}
                    disabled={processingId === trx.id}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#0369A1] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#075985] transition-colors disabled:opacity-60"
                  >
                    {processingId === trx.id ? <Loader2 size={14} className="animate-spin" /> : <ArrowRightCircle size={14} />}
                    Tandai Sudah Diteruskan ke Vendor
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}