"use client";
import { useState } from "react";
import { Store, MapPin, Phone, FileText, ChevronDown, Instagram, Clock, IdCard, Images, X, Loader2 } from "lucide-react";
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
    years_experience: "",
    instagram_url: "",
  });
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleKtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setKtpFile(file);
  };

  const handlePortfolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPortfolioFiles(prev => [...prev, ...files]);
  };

  const removePortfolioFile = (index: number) => {
    setPortfolioFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!ktpFile) {
      setError("Foto KTP wajib diupload.");
      return;
    }
    if (portfolioFiles.length < 3) {
      setError("Upload minimal 3 foto portofolio.");
      return;
    }
    if (!user) {
      setError("Kamu perlu login terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      // Upload KTP
      setUploadStep("Mengupload KTP...");
      const ktpExt = ktpFile.name.split(".").pop();
      const ktpPath = `${user.id}/ktp-${Date.now()}.${ktpExt}`;
      const { error: ktpUploadError } = await supabase.storage
        .from("vendor-application-files")
        .upload(ktpPath, ktpFile);

      if (ktpUploadError) throw new Error("Gagal upload KTP: " + ktpUploadError.message);

      // Upload portfolio (bisa lebih dari 1 file)
      setUploadStep("Mengupload portofolio...");
      const portfolioPaths: string[] = [];
      for (let i = 0; i < portfolioFiles.length; i++) {
        const file = portfolioFiles[i];
        const ext = file.name.split(".").pop();
        const path = `${user.id}/portfolio-${Date.now()}-${i}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("vendor-application-files")
          .upload(path, file);
        if (uploadError) throw new Error(`Gagal upload portofolio ${i + 1}: ${uploadError.message}`);
        portfolioPaths.push(path);
      }

      // Simpan aplikasi
      setUploadStep("Menyimpan pendaftaran...");
      const { error: insertError } = await supabase.from("vendor_applications").insert({
        user_id: user.id,
        business_name: form.business_name,
        category_id: form.category_id,
        location: form.location,
        phone: form.phone,
        description: form.description,
        years_experience: Number(form.years_experience),
        instagram_url: form.instagram_url,
        ktp_url: ktpPath,
        portfolio_urls: portfolioPaths,
      });

      if (insertError) {
        throw new Error(
          insertError.code === "23505"
            ? "Kamu sudah pernah mengajukan pendaftaran vendor."
            : insertError.message
        );
      }

      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
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
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Pengalaman (tahun beroperasi)</label>
        <div className="relative">
          <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
          <input name="years_experience" type="number" min="0" value={form.years_experience} onChange={handleChange} required
            placeholder="Contoh: 3"
            className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4]" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Instagram Usaha</label>
        <div className="relative">
          <Instagram size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
          <input name="instagram_url" value={form.instagram_url} onChange={handleChange} required
            placeholder="https://instagram.com/namausaha"
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

      <div>
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Foto KTP Pemilik Usaha</label>
        <div className="relative">
          <label className="flex items-center gap-2.5 bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm cursor-pointer hover:border-[#1CABB4] transition-colors">
            <IdCard size={15} className="text-[#8ABDB5] flex-shrink-0" />
            <span className={ktpFile ? "text-[#1A3A3C]" : "text-[#8ABDB5]"}>
              {ktpFile ? ktpFile.name : "Pilih file KTP (JPG/PNG)"}
            </span>
            <input type="file" accept="image/*" onChange={handleKtpChange} className="hidden" />
          </label>
        </div>
        <p className="text-[10px] text-[#8ABDB5] mt-1">Data KTP disimpan aman dan hanya bisa diakses tim verifikasi Festara.</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">
          Contoh Portofolio <span className="text-[#8ABDB5] font-normal">(minimal 3 foto)</span>
        </label>
        <label className="flex items-center gap-2.5 bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm cursor-pointer hover:border-[#1CABB4] transition-colors mb-2">
          <Images size={15} className="text-[#8ABDB5] flex-shrink-0" />
          <span className="text-[#8ABDB5]">Tambah foto portofolio</span>
          <input type="file" accept="image/*" multiple onChange={handlePortfolioChange} className="hidden" />
        </label>
        {portfolioFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {portfolioFiles.map((file, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#D4EAC8]">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePortfolioFile(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                  <X size={11} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-[10px] mt-1 ${portfolioFiles.length >= 3 ? 'text-[#15803D]' : 'text-[#8ABDB5]'}">
          {portfolioFiles.length}/3 foto minimal terpenuhi
        </p>
      </div>

      {error && (
        <p className="text-xs text-[#EF4444] bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-[#1CABB4] hover:bg-[#178E96] disabled:opacity-70 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {loading
          ? <><Loader2 size={15} className="animate-spin" />{uploadStep || "Mendaftar..."}</>
          : "Daftar Sebagai Vendor"}
      </button>
    </form>
  );
}