"use client";
import { X, LogIn, UserPlus } from "lucide-react";

export default function LoginPromptModal({ onClose }: { onClose: () => void }) {

  const handleMasuk = () => {
    onClose();
    window.location.href = "/login";
  };

  const handleDaftar = () => {
    onClose();
    window.location.href = "/register";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] p-8 max-w-sm w-full relative">
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0FBF5] transition-colors">
          <X size={18} className="text-[#8ABDB5]" />
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#E8F8F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img src="/logo/festara-icon-color.png" alt="Festara" className="h-10 w-auto" />
          </div>
          <h2 className="text-lg font-bold text-[#1A3A3C] mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Login Dulu, Yuk!
          </h2>
          <p className="text-sm text-[#4A7A6D]">
            Kamu perlu login atau daftar dulu sebelum melakukan booking vendor
          </p>
        </div>
        <div className="space-y-3">
          <button onClick={handleMasuk}
            className="w-full flex items-center justify-center gap-2 bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-3.5 rounded-xl transition-colors">
            <LogIn size={16} /> Masuk ke Akun
          </button>
          <button onClick={handleDaftar}
            className="w-full flex items-center justify-center gap-2 border border-[#D4EAC8] text-[#4A7A6D] hover:border-[#1CABB4] hover:text-[#1CABB4] font-semibold py-3.5 rounded-xl transition-colors">
            <UserPlus size={16} /> Daftar Gratis
          </button>
        </div>
        <p className="text-xs text-[#8ABDB5] text-center mt-4">
          Dengan mendaftar, kamu menyetujui{" "}
          <button onClick={() => { onClose(); window.location.href = "/terms"; }}
            className="text-[#1CABB4] hover:underline">
            Syarat & Ketentuan
          </button>{" "}
          Festara
        </p>
      </div>
    </div>
  );
}