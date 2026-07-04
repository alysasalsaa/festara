"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#E8F8F9] via-[#F8FAFC] to-[#F5FAF0]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1CABB4] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(28,171,180,0.3)]">
            <span className="text-white font-extrabold text-2xl">PN</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1F2937]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Selamat Datang!</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Masuk ke akun PasarNusantara-mu</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] p-7">
          {/* Social login */}
          <div className="flex flex-col gap-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 border-2 border-[#E5E7EB] py-3 rounded-2xl text-sm font-semibold text-[#1F2937] hover:border-[#1CABB4] hover:bg-[#E8F8F9] transition-all">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Lanjut dengan Google
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#9CA3AF]">atau masuk dengan email</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-[#6B7280] block mb-1.5">Email</label>
              <input type="email" placeholder="kamu@email.com"
                className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl px-4 py-3 text-sm text-[#1F2937] outline-none focus:border-[#1CABB4] transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6B7280] block mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input type={show ? "text" : "password"} placeholder="Masukkan kata sandi"
                  className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl px-4 py-3 pr-12 text-sm text-[#1F2937] outline-none focus:border-[#1CABB4] transition-colors" />
                <button onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-[#1CABB4]" />
                Ingat saya
              </label>
              <a href="#" className="text-sm text-[#1CABB4] font-semibold hover:underline">Lupa kata sandi?</a>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-[#1CABB4] hover:bg-[#178E96] text-white font-bold py-4 rounded-2xl transition-colors">
            Masuk <ArrowRight size={16} />
          </button>

          <p className="text-center text-sm text-[#9CA3AF] mt-5">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#1CABB4] font-bold hover:underline">Daftar Sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
