"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

type DashboardData = {
  stats: {
    totalBorrows: number;
    totalUsers: number;
    borrowsToday: number;
  };
  chart: { month: string; count: number }[];
  table: {
    id: number;
    user: string;
    jenisBuku: string;
    temaBuku: string;
    rak: string;
    jumlah: number;
  }[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    stats: { totalBorrows: 0, totalUsers: 0, borrowsToday: 0 },
    chart: [],
    table: [],
  });

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-600">Dashboard Admin</h1>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Peminjam</CardTitle></CardHeader>
          <CardContent>{data.stats.totalBorrows}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Anggota</CardTitle></CardHeader>
          <CardContent>{data.stats.totalUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pengunjung Hari Ini</CardTitle></CardHeader>
          <CardContent>{data.stats.borrowsToday}</CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle>Peminjaman Per Bulan</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Table Peminjaman Aktif */}
      <Card>
        <CardHeader><CardTitle>Daftar Peminjaman Aktif</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">User</th>
                  <th className="px-4 py-2 border">Jenis Buku</th>
                  <th className="px-4 py-2 border">Tema Buku</th>
                  <th className="px-4 py-2 border">Rak</th>
                  <th className="px-4 py-2 border">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((row) => (
                  <tr key={row.id} className="text-center">
                    <td className="border px-4 py-2">{row.id}</td>
                    <td className="border px-4 py-2">{row.user}</td>
                    <td className="border px-4 py-2">{row.jenisBuku}</td>
                    <td className="border px-4 py-2">{row.temaBuku}</td>
                    <td className="border px-4 py-2">{row.rak}</td>
                    <td className="border px-4 py-2">{row.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
