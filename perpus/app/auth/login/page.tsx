"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
        localStorage.setItem("userUsername", data.username);
        localStorage.setItem("token", data.token);
        
        router.push("/");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Login gagal. Periksa username dan password Anda.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: "member",
      username: "visitor",
      password: "visitor123",
      description: "Akun Pengunjung - Akses terbatas ke katalog buku",
    },
    {
      role: "admin",
      username: "admin",
      password: "admin123",
      description: "Akun Admin - Akses penuh ke semua fitur",
    },
  ];

  const quickLogin = (username: string, password: string, selectedRole: string) => {
    setUsername(username);
    setPassword(password);
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
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
                Masuk ke Sistem Perpustakaan
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
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sedang login...
                  </>
                ) : (
                  <>Masuk</>
                )}
              </button>

              {/* Back to Signup */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                  Belum punya akun? Daftar di sini
                </Link>
              </div>
            </form>
          </div>

          {/* Demo Accounts Info */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-4">Akun Demo</h2>
              <p className="text-white/80 mb-6">
                Gunakan akun demo berikut untuk mencoba sistem. Klik tombol untuk mengisi otomatis.
              </p>

              <div className="space-y-4">
                {demoAccounts.map((account, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition cursor-pointer"
                    onClick={() => quickLogin(account.username, account.password, account.role)}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-white ${
                        account.role === "admin"
                          ? "bg-purple-400"
                          : "bg-blue-400"
                      }`}>
                        {account.role === "admin" ? "A" : "P"}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold">
                          {account.role === "admin" ? "Admin" : "Pengunjung"}
                        </p>
                        <p className="text-sm text-white/80">{account.description}</p>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded p-2 text-sm font-mono">
                      <p>Username: {account.username}</p>
                      <p>Password: {account.password}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-400/20 border border-blue-400/50 rounded-lg">
                <p className="text-sm text-white/90">
                  💡 <strong>Tips:</strong> Klik pada akun demo untuk mengisi email dan password secara otomatis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
