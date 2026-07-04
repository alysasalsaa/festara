"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    agree: false,
  });

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DBEBC9]/40 via-white to-[#1CABB4]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1CABB4] to-[#0e8a92] flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold text-[#1F2937]">
              Pasar<span className="text-[#1CABB4]">Nusantara</span>
            </span>
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Bergabung dan mulai belanja sekarang</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step > s ? "bg-green-500 text-white" : step === s ? "bg-[#1CABB4] text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs font-medium ${step >= s ? "text-[#1F2937]" : "text-gray-400"}`}>
                  {s === 1 ? "Data Diri" : "Keamanan"}
                </span>
                {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? "bg-[#1CABB4]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Data Diri</h2>

              {/* Google */}
              <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Daftar dengan Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">atau</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    placeholder="Nama lengkap kamu"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1CABB4]/30 focus:border-[#1CABB4] transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder="email@kamu.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1CABB4]/30 focus:border-[#1CABB4] transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Nomor HP</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                    placeholder="081234567890"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1CABB4]/30 focus:border-[#1CABB4] transition-all"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!form.name || !form.email || !form.phone}
                className="w-full bg-gradient-to-r from-[#1CABB4] to-[#0e8a92] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjut <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Buat Password</h2>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm(f => ({...f, password: e.target.value}))}
                    placeholder="Min. 8 karakter"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1CABB4]/30 focus:border-[#1CABB4] transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= strength ? strengthColor : "bg-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Kekuatan: <span className="font-medium">{strengthLabel}</span></p>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1.5">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={e => setForm(f => ({...f, confirm: e.target.value}))}
                    placeholder="Ulangi password kamu"
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1CABB4]/30 focus:border-[#1CABB4] transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={e => setForm(f => ({...f, agree: e.target.checked}))}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1CABB4] accent-[#1CABB4]"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Saya menyetujui{" "}
                  <Link href="#" className="text-[#1CABB4] font-medium hover:underline">Syarat & Ketentuan</Link>
                  {" "}dan{" "}
                  <Link href="#" className="text-[#1CABB4] font-medium hover:underline">Kebijakan Privasi</Link>
                  {" "}PasarNusantara
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  disabled={!form.agree || !form.password || form.password !== form.confirm}
                  className="flex-1 bg-gradient-to-r from-[#1CABB4] to-[#0e8a92] text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#1CABB4] font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
