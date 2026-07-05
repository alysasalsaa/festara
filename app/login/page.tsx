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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      if (loginError.message === "Invalid login credentials") {
        const { data: emailExists, error: checkError } = await supabase.rpc(
          "check_email_exists",
          { check_email: email }
        );

        if (!checkError && emailExists === false) {
          setError("Email belum terdaftar");
        } else {
          setError("Password salah");
        }
      } else {
        setError(loginError.message);
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setError("Gagal masuk dengan Google. Coba lagi.");
      setGoogleLoading(false);
    }
    // kalau sukses, browser redirect ke Google, jadi tidak perlu setGoogleLoading(false) di sini
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

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#EAF5E4]" />
            <span className="text-xs text-[#8ABDB5]">atau</span>
            <div className="flex-1 h-px bg-[#EAF5E4]" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#D4EAC8] hover:border-[#1CABB4] disabled:opacity-70 text-[#1A3A3C] font-semibold py-3.5 rounded-xl transition-colors"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-[#8ABDB5]/40 border-t-[#1CABB4] rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.95 10.7A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" fill="#FBBC05"/>
                <path d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? "Menghubungkan..." : "Masuk dengan Google"}
          </button>

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