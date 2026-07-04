"use client";
import { useState } from "react";
import { Store, MapPin, Phone, FileText, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { categories } from "@/data";

export default function VendorRegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    business_name: "",
    category_id: "",
    location: "",
    phone: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.from("vendor_applications").insert({
      user_id: user?.id,
      ...form,
    });

    if (error) {
      setError(error.code === "23505"
        ? "Kamu sudah pernah mengajukan pendaftaran vendor."
        : error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Nama Bisnis / Vendor</label>
        <div className="relative">
          <Store size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
          <input name="business_name" value={form.business_name} onChange={handleChange} required
            placeholder="Contoh: Lavinia Wedding Fotografer"
            className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Kategori</label>
        <div className="relative">
          <select name="category_id" value={form.category_id} onChange={handleChange} required
            className="w-full appearance-none bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-4 pr-8 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] cursor-pointer">
            <option value="">Pilih kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ABDB5] pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Lokasi</label>
        <div className="relative">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
          <input name="location" value={form.location} onChange={handleChange} required
            placeholder="Contoh: Yogyakarta"
            className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Nomor WhatsApp</label>
        <div className="relative">
          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
          <input name="phone" value={form.phone} onChange={handleChange} required
            placeholder="08xxxxxxxxxx"
            className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Deskripsi Bisnis</label>
        <div className="relative">
          <FileText size={15} className="absolute left-3 top-3 text-[#8ABDB5]" />
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            placeholder="Ceritakan tentang bisnis kamu..."
            className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] resize-none placeholder:text-[#8ABDB5]" />
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#EF4444] bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-[#1CABB4] hover:bg-[#178E96] disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {loading
          ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Mendaftar...</>
          : "Daftar Sebagai Vendor"}
      </button>
    </form>
  );
}