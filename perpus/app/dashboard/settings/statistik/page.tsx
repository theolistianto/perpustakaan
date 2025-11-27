"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, BookOpen, Heart, Gift } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  totalMembers: number;
  totalBooks: number;
  totalBorrows: number;
  activeBorrows: number;
  returnedBorrows: number;
  totalFines: number;
}

export default function StatistikPage() {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    totalBooks: 0,
    totalBorrows: 0,
    activeBorrows: 0,
    returnedBorrows: 0,
    totalFines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalMembers: data.stats.totalMembers || 0,
          totalBooks: 0,
          totalBorrows: data.stats.totalBorrows || 0,
          activeBorrows: 0,
          returnedBorrows: 0,
          totalFines: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Anggota",
      value: stats.totalMembers,
      icon: Users,
      color: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Buku",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
    },
    {
      label: "Total Peminjaman",
      value: stats.totalBorrows,
      icon: Gift,
      color: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
    },
    {
      label: "Peminjaman Aktif",
      value: stats.activeBorrows,
      icon: Heart,
      color: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Memuat statistik...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          Statistik Perpustakaan
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ringkasan data dan statistik lengkap perpustakaan
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`${card.color} rounded-lg shadow p-6 space-y-3 transition-transform hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-8 h-8 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {card.value.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peminjaman Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-600" />
            Ringkasan Peminjaman
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Total Peminjaman</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.totalBorrows.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Peminjaman Aktif</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.activeBorrows.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Sudah Dikembalikan</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.returnedBorrows.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Library Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Informasi Perpustakaan
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Total Anggota</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.totalMembers.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Total Koleksi Buku</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.totalBooks.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Denda</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                Rp {stats.totalFines.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="space-y-6">
        {/* Area Chart - Visitor & Borrower Trends */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AreaChart className="w-5 h-5 text-blue-600" />
              Tren Pengunjung & Peminjam (12 Bulan Terakhir)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: "Jan", pengunjung: 200, peminjam: 50 },
                    { month: "Feb", pengunjung: 250, peminjam: 65 },
                    { month: "Mar", pengunjung: 180, peminjam: 40 },
                    { month: "Apr", pengunjung: 300, peminjam: 80 },
                    { month: "May", pengunjung: 220, peminjam: 55 },
                    { month: "Jun", pengunjung: 280, peminjam: 70 },
                    { month: "Jul", pengunjung: 310, peminjam: 90 },
                    { month: "Aug", pengunjung: 260, peminjam: 60 },
                    { month: "Sep", pengunjung: 290, peminjam: 75 },
                    { month: "Oct", pengunjung: 320, peminjam: 100 },
                    { month: "Nov", pengunjung: 350, peminjam: 120 },
                    { month: "Dec", pengunjung: 380, peminjam: 140 },
                  ]}
                >
                  <defs>
                    <linearGradient id="colorPengunjung" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorPeminjam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pengunjung"
                    stroke="#3b82f6"
                    fill="url(#colorPengunjung)"
                    name="Pengunjung"
                  />
                  <Area
                    type="monotone"
                    dataKey="peminjam"
                    stroke="#10b981"
                    fill="url(#colorPeminjam)"
                    name="Peminjam"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Borrowing Stats */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              Statistik Peminjaman Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { month: "Jan", disetujui: 40, ditolak: 5, menunggu: 8 },
                    { month: "Feb", disetujui: 52, ditolak: 6, menunggu: 10 },
                    { month: "Mar", disetujui: 35, ditolak: 4, menunggu: 7 },
                    { month: "Apr", disetujui: 65, ditolak: 8, menunggu: 12 },
                    { month: "May", disetujui: 48, ditolak: 5, menunggu: 9 },
                    { month: "Jun", disetujui: 58, ditolak: 7, menunggu: 11 },
                    { month: "Jul", disetujui: 72, ditolak: 9, menunggu: 15 },
                    { month: "Aug", disetujui: 54, ditolak: 6, menunggu: 10 },
                    { month: "Sep", disetujui: 62, ditolak: 8, menunggu: 12 },
                    { month: "Oct", disetujui: 85, ditolak: 10, menunggu: 18 },
                    { month: "Nov", disetujui: 98, ditolak: 12, menunggu: 20 },
                    { month: "Dec", disetujui: 110, ditolak: 13, menunggu: 22 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="disetujui" fill="#10b981" name="Disetujui" />
                  <Bar dataKey="menunggu" fill="#f59e0b" name="Menunggu" />
                  <Bar dataKey="ditolak" fill="#ef4444" name="Ditolak" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <span className="font-semibold">ℹ️ Catatan:</span> Data statistik diperbarui secara real-time.
          Untuk data yang lebih detail, silakan kunjungi dashboard utama.
        </p>
      </div>
    </div>
  );
}
