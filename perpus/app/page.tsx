"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { BookOpen, Lock, User, AlertCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      router.push("/dashboard/books");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("token", data.token);
        
        router.push("/dashboard/books");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Login gagal!");
      }
    } catch (err) {
      setError("Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      
      <section className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Login Form */}
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
                  Masuk atau Daftar
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Tipe Login
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("member")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                        role === "member"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Pengunjung
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("admin")}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                        role === "admin"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

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
                      placeholder="Username Anda"
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
                      placeholder="Password Anda"
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

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
                >
                  {loading ? "Sedang login..." : "Masuk"}
                </button>

                {/* Back to Signup */}
                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                    Belum punya akun? Daftar di sini
                  </Link>
                </div>
              </form>
            </div>

            {/* Signup Info */}
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-4">Pendaftaran Baru</h2>
                <p className="text-white/80 mb-6">
                  Buat akun pengunjung untuk mulai meminjam buku dari perpustakaan kami.
                </p>
                <Link
                  href="/auth/signup"
                  className="w-full block text-center py-3 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white font-semibold rounded-lg transition"
                >
                  Daftar Sekarang
                </Link>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold">Akun Demo</h3>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold mb-2">👤 Pengunjung</p>
                    <p className="text-sm text-white/80">Username: visitor</p>
                    <p className="text-sm text-white/80">Password: visitor123</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="font-semibold mb-2">👨‍💼 Admin</p>
                    <p className="text-sm text-white/80">Username: admin</p>
                    <p className="text-sm text-white/80">Password: admin123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Tentang Kami</h2>
          <p className="text-lg text-gray-600 mb-4">
            Perpus System adalah platform manajemen perpustakaan modern yang dirancang untuk memudahkan pengelolaan koleksi buku.
          </p>
          <button
            onClick={() => router.push("/dashboard/books")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2"
          >
            Jelajahi Katalog <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12">Layanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Katalog Digital</h3>
              <p className="text-gray-600">Jelajahi ribuan koleksi buku digital</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <Users className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Manajemen Peminjaman</h3>
              <p className="text-gray-600">Kelola peminjaman dengan mudah</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <Search className="w-8 h-8 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Pencarian Cepat</h3>
              <p className="text-gray-600">Temukan buku dalam sekejap</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users2 className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-4xl font-bold text-pink-600">1.271</p>
              <p className="text-gray-600 mt-2">Anggota Perpustakaan</p>
            </div>
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-4xl font-bold text-pink-600">15.052+</p>
              <p className="text-gray-600 mt-2">Koleksi Buku</p>
            </div>
            <div className="text-center">
              <Eye className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-4xl font-bold text-pink-600">137+</p>
              <p className="text-gray-600 mt-2">Pengunjung</p>
            </div>
            <div className="text-center">
              <Gift className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-4xl font-bold text-pink-600">14.978+</p>
              <p className="text-gray-600 mt-2">Peminjaman</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Perpus<span className="text-pink-600">System</span></h2>
              <p className="text-gray-400 leading-relaxed">
                Perpustakaan DPR RI hadir sebagai pusat literasi dan sumber pengetahuan untuk masyarakat, menyediakan akses koleksi, informasi, dan layanan yang mendukung pengembangan wawasan serta peningkatan literasi bangsa.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">Kontak Kami</h3>
              <div className="space-y-4 text-gray-400">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <span>Jl. Jenderal Gatot Subroto, Senayan Jakarta 10270 - Indonesia</span>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <span>Telp: (021) 5756010, 5756011</span>
                </div>
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                  <span>Email: perpustakaandpr@dpr.go.id</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
            <p className="text-gray-400">© 2025 Perpus System. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
