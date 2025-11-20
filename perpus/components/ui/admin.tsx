"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type TableRow = {
  id: number;
  user: string;
  jenisBuku: string;
  temaBuku: string;
  rak: string;
  jumlah: number;
  borrowDate: string;
  dueDate?: string;
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>({
    stats: { totalBorrows: 0, totalMembers: 0, borrowsToday: 0 },
    chart: [],
    table: [],
  });

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rata-rata Peminjam</CardTitle>
          </CardHeader>
          <CardContent>
            {/* rata-rata = totalBorrows / totalMembers (rounded) */}
            {data.stats.totalMembers
              ? Math.round(data.stats.totalBorrows / data.stats.totalMembers)
              : 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengunjung Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>{data.stats.borrowsToday}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Anggota</CardTitle>
          </CardHeader>
          <CardContent>{data.stats.totalMembers}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chart Peminjam (per bulan)</CardTitle>
        </CardHeader>
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

      <Card>
        <CardHeader>
          <CardTitle>Daftar Peminjaman Aktif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">User</th>
                  <th className="p-2 border">Jenis Buku</th>
                  <th className="p-2 border">Tema Buku</th>
                  <th className="p-2 border">Rak</th>
                  <th className="p-2 border">Jumlah</th>
                  <th className="p-2 border">Pinjam</th>
                  <th className="p-2 border">Jatuh Tempo</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((r: TableRow) => (
                  <tr key={r.id} className="text-center">
                    <td className="border p-2">{r.id}</td>
                    <td className="border p-2">{r.user}</td>
                    <td className="border p-2">{r.jenisBuku}</td>
                    <td className="border p-2">{r.temaBuku}</td>
                    <td className="border p-2">{r.rak}</td>
                    <td className="border p-2">{r.jumlah}</td>
                    <td className="border p-2">
                      {new Date(r.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      {r.dueDate
                        ? new Date(r.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
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
