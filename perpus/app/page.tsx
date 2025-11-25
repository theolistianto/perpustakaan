"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  BarChart3,
  ArrowRight,
  Library,
  Clock,
  AlertCircle,
} from "lucide-react";

interface DashboardStats {
  totalBooks: number;
  totalMembers: number;
  borrowedBooks: number;
  pendingRequests: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalMembers: 0,
    borrowedBooks: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      title: "Manajemen Buku",
      description: "Kelola koleksi buku perpustakaan",
      icon: BookOpen,
      href: "/dashboard/books",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Anggota",
      description: "Kelola data anggota perpustakaan",
      icon: Users,
      href: "/dashboard/peminjam",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Peminjaman",
      description: "Kelola transaksi peminjaman buku",
      icon: Library,
      href: "/dashboard/borrow",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Dashboard",
      description: "Lihat statistik dan laporan",
      icon: BarChart3,
      href: "/dashboard/dashboard",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Library className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              PERPUS
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Sistem Manajemen Perpustakaan Digital - Kelola koleksi buku, anggota, dan peminjaman dengan mudah
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Buku",
              value: stats.totalBooks,
              icon: BookOpen,
              color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
            },
            {
              label: "Anggota",
              value: stats.totalMembers,
              icon: Users,
              color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
            },
            {
              label: "Sedang Dipinjam",
              value: stats.borrowedBooks,
              icon: Clock,
              color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
            },
            {
              label: "Permintaan Pending",
              value: stats.pendingRequests,
              icon: AlertCircle,
              color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? "-" : stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Menu Utama
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Link key={idx} href={feature.href}>
                <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
                  <div
                    className={`bg-gradient-to-br ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Buka
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/books"
            className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Tambah Buku
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tambahkan koleksi baru
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </Link>

          <Link
            href="/dashboard/peminjam"
            className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Tambah Anggota
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Registrasi anggota baru
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </Link>

          <Link
            href="/dashboard/borrow"
            className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Proses Peminjaman
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kelola transaksi peminjaman
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400" />
          </Link>
        </div>
      </div>

      {/* Seed Database Section */}
      <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
          Pertama Kali Menggunakan?
        </h3>
        <p className="text-amber-800 dark:text-amber-300 mb-4">
          Klik tombol di bawah untuk mengisi database dengan data contoh:
        </p>
        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/seed", { method: "GET" });
              if (response.ok) {
                alert("Database berhasil diisi dengan data contoh!");
                window.location.reload();
              } else {
                alert("Gagal mengisi database");
              }
            } catch (error) {
              alert("Error: " + (error as Error).message);
            }
          }}
          className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
        >
          Isi Data Contoh
        </button>
      </div>
    </div>
  );
}
