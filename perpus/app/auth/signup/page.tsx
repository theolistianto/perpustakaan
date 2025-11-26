"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, BookOpen, AlertCircle, CheckCircle, Star, Users, BookMarked } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Password tidak cocok!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        setSuccess(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Pendaftaran gagal. Coba lagi!");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Signup Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Perpus System
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Daftar Akun Pengunjung
              </p>
            </div>

            {success ? (
              <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-4 rounded-lg flex items-start gap-2 text-center">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Pendaftaran Berhasil! ✨</p>
                  <p className="text-sm">Anda akan dialihkan ke halaman login dalam 2 detik...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Buat username unik Anda"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Username ini akan digunakan untuk login</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Anda"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sedang mendaftar...
                    </>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </button>

                {/* Back to Login */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                    Sudah punya akun? Masuk di sini
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-6">Keuntungan Menjadi Anggota</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookMarked className="w-5 h-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="font-semibold">Akses Katalog</p>
                    <p className="text-sm text-white/80">Jelajahi koleksi buku perpustakaan</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="font-semibold">Peminjaman Mudah</p>
                    <p className="text-sm text-white/80">Ajukan peminjaman dengan cepat</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-pink-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-pink-300" />
                  </div>
                  <div>
                    <p className="font-semibold">Tracking Otomatis</p>
                    <p className="text-sm text-white/80">Pantau status peminjaman Anda</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-400/20 border border-blue-400/50 rounded-lg">
                <p className="text-sm text-white/90">
                  <strong>💡 Tips:</strong> Simpan username dan password Anda dengan baik untuk login di kemudian hari.
                </p>
              </div>

              <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-lg">
                <p className="text-sm text-white/80">
                  Dengan mendaftar, Anda menyetujui <a href="#" className="text-blue-300 hover:underline">Ketentuan Layanan</a> dan <a href="#" className="text-blue-300 hover:underline">Kebijakan Privasi</a> kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
