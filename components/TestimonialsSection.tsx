"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { categories } from "@/data";

type Testimonial = {
  rating: number;
  comment: string;
  buyerName: string;
  avatarUrl: string | null;
  categoryLabel: string;
  location: string;
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          rating,
          comment,
          buyer:users ( full_name, avatar_url ),
          vendor:vendors ( category_id, location )
        `)
        .not("comment", "is", null)
        .order("rating", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Gagal ambil testimoni:", error);
        setLoading(false);
        return;
      }

      const mapped: Testimonial[] = (data || []).map((r: any) => {
        const categoryLabel =
          categories.find((c) => c.id === r.vendor?.category_id)?.name || "Vendor";
        return {
          rating: r.rating,
          comment: r.comment,
          buyerName: r.buyer?.full_name || "Pengguna Festara",
          avatarUrl: r.buyer?.avatar_url || null,
          categoryLabel,
          location: r.vendor?.location || "",
        };
      });

      setTestimonials(mapped);
      setLoading(false);
    }

    fetchReviews();
  }, []);

  if (loading) return null;

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#8ABDB5]">Belum ada ulasan dari pelanggan</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-[0_2px_12px_rgba(28,171,180,0.08)]"
        >
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: t.rating }).map((_, j) => (
              <Star key={j} size={14} fill="#F59E0B" className="text-[#F59E0B]" />
            ))}
          </div>
          <p className="text-sm text-[#4A7A6D] leading-relaxed mb-4">"{t.comment}"</p>
          <div className="flex items-center gap-3">
            <img
              src={t.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.buyerName}`}
              alt=""
              className="w-10 h-10 rounded-full bg-[#E8F8F9] object-cover"
            />
            <div>
              <p className="font-bold text-sm text-[#1A3A3C]">{t.buyerName}</p>
              <p className="text-xs text-[#8ABDB5]">
                {t.categoryLabel} · {t.location}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}