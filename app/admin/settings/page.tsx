"use client";
import { useState, useEffect } from "react";
import { Landmark, Save, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("bank_name, bank_account_number, bank_account_name")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setBankName(data.bank_name);
        setBankAccountNumber(data.bank_account_number);
        setBankAccountName(data.bank_account_name);
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setErrorMsg("");

    const { error } = await supabase
      .from("platform_settings")
      .update({
        bank_name: bankName.trim(),
        bank_account_number: bankAccountNumber.trim(),
        bank_account_name: bankAccountName.trim(),
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq("id", 1);

    if (error) {
      setErrorMsg("Gagal menyimpan: " + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#1CABB4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-[#1A3A3C]">Pengaturan</h2>

      <div className="bg-white/80 backdrop-blur rounded-2xl p-5 shadow-sm max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-[#E8F8F9] rounded-lg flex items-center justify-center">
            <Landmark size={16} className="text-[#1CABB4]" />
          </div>
          <h3 className="font-bold text-[#1A3A3C] text-sm">Rekening Transfer Manual</h3>
        </div>
        <p className="text-xs text-[#8ABDB5] mb-4">
          Rekening ini ditampilkan ke buyer di halaman pembayaran. Ubah di sini kalau ganti bank/nomor rekening — tidak perlu ubah kode.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#4A7A6D] mb-1.5 block">Nama Bank</label>
            <input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Contoh: Bank Syariah Indonesia (BSI)"
              className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]"
            />
          </div>
          <div>
            <label className="text-xs text-[#4A7A6D] mb-1.5 block">Nomor Rekening</label>
            <input
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="Contoh: 7270591595"
              className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]"
            />
          </div>
          <div>
            <label className="text-xs text-[#4A7A6D] mb-1.5 block">Atas Nama</label>
            <input
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              placeholder="Contoh: Irwan"
              className="w-full border border-[#D4EAC8] rounded-xl px-3 py-2.5 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] bg-[#F0FBF5]"
            />
          </div>
        </div>

        {errorMsg && <p className="text-xs text-[#EF4444] mt-3">{errorMsg}</p>}

        <button
          onClick={handleSave}
          disabled={saving || !bankName.trim() || !bankAccountNumber.trim() || !bankAccountName.trim()}
          className="w-full mt-4 flex items-center justify-center gap-1.5 bg-[#1CABB4] text-white text-sm font-bold py-2.5 rounded-xl hover:bg-[#178E96] transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saving ? "Menyimpan..." : saved ? "Tersimpan" : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}