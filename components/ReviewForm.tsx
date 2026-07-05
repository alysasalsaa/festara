"use client";
import { useEffect, useState } from "react";
import { Star, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";

type VendorOption = { id: string; name: string };

export default function ReviewForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { user } = useAuth();
  const [vendorList, setVendorList] = useState<VendorOption[]>([]);
  const [vendorId, setVendorId] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchVendors() {
      const { data } = await supabase.from("vendors").select("id, name").order("name");
      setVendorList(data || []);
    }
    fetchVendors();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!user) {
      setErrorMsg("Kamu perlu login dulu untuk menulis ulasan.");
      return;
    }
    if (!vendorId) {
      setErrorMsg("Pilih vendor yang ingin kamu ulas.");
      return;
    }
    if (rating === 0) {
      setErrorMsg("Beri rating bintang terlebih dahulu.");
      return;
    }
    if (comment.trim().length < 10) {
      setErrorMsg("Tulis ulasan minimal 10 karakter.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      buyer_id: user.id,
      vendor_id: vendorId,
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);

    if (error) {
      console.error("Gagal kirim ulasan:", error);
      setErrorMsg("Gagal mengirim ulasan. Coba lagi sebentar lagi.");
      return;
    }

    setSuccess(true);
    setVendorId("");
    setRating(0);
    setComment("");
    onSubmitted?.();
  }

  if (success) {
    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-bold text-[#1A3A3C] mb-1">Terima kasih atas ulasanmu!</p>
        <p className="text-sm text-[#4A7A6D] mb-4">Ulasanmu membantu pengguna lain menemukan vendor terbaik.</p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm text-[#1CABB4] font-semibold hover:underline"
        >
          Tulis ulasan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur rounded-2xl p-6 max-w-xl mx-auto">
      <h3 className="font-bold text-[#1A3A3C] mb-4 text-center">Tuliskan Reviewmu di Sini</h3>

      {!user && (
        <p className="text-xs text-[#8ABDB5] text-center mb-4">
          Kamu perlu <a href="/login" className="text-[#1CABB4] font-semibold hover:underline">login</a> dulu untuk menulis ulasan.
        </p>
      )}

      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#4A7A6D] mb-1.5">Vendor</label>
        <select
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
          className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] focus:outline-none focus:border-[#1CABB4]"
        >
          <option value="">Pilih vendor yang ingin diulas</option>
          {vendorList.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#4A7A6D] mb-1.5">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                size={26}
                fill={(hoverRating || rating) >= star ? "#F59E0B" : "none"}
                className={(hoverRating || rating) >= star ? "text-[#F59E0B]" : "text-[#D4EAC8]"}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#4A7A6D] mb-1.5">Ulasan</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Ceritakan pengalamanmu dengan vendor ini..."
          className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] focus:outline-none focus:border-[#1CABB4] resize-none"
        />
      </div>

      {errorMsg && (
        <p className="text-xs text-[#EF4444] mb-3 text-center">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !user}
        className="w-full flex items-center justify-center gap-2 bg-[#1CABB4] text-white font-bold py-3 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={16} />
        {submitting ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}