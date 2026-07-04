"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Email atau password salah"
        : error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(28,171,180,0.15)] p-8">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src="/logo/festara-icon-color.png" alt="Festara" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-[#16302e]"
              style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.03em" }}>
              festara
            </span>
          </div>

          <h1 className="text-xl font-bold text-[#1A3A3C] text-center mb-1"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-[#8ABDB5] text-center mb-8">
            Masuk ke akun Festara kamu
          </p>

          {error && (
            <div className="bg-[#FEF2F2] border border-[#EF4444]/20 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] focus:shadow-[0_0_0_3px_rgba(28,171,180,0.15)]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4A7A6D] block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8ABDB5]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full bg-[#F0FBF5] border border-[#D4EAC8] rounded-xl pl-10 pr-10 py-3 text-sm text-[#1A3A3C] outline-none focus:border-[#1CABB4] focus:shadow-[0_0_0_3px_rgba(28,171,180,0.15)]"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ABDB5] hover:text-[#1CABB4]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-[#1CABB4] hover:underline">
                Lupa password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#1CABB4] hover:bg-[#178E96] disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Masuk...</>
                : "Masuk"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#8ABDB5]">
              Belum punya akun?{" "}
              <Link href="/register" className="text-[#1CABB4] font-semibold hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/seller" className="text-xs text-[#4A7A6D] hover:text-[#1CABB4]">
              Daftarkan sebagai Vendor →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}