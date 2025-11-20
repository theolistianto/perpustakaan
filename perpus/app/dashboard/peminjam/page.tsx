"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DivideSquareIcon } from "lucide-react";

export default function PeminjamanPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Modal tambah pinjam
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    bookId: "",
    borrowDate: "",
    dueDate: "",
  });

  const fetchData = () => {
    const params = new URLSearchParams();
    if (month) params.append("month", month);
    if (year) params.append("year", year);

    fetch(`/api/borrow/list?${params.toString()}`)
      .then((res) => res.json())
      .then(setBorrowings);
  };

  useEffect(fetchData, []);

  const handleReturn = async (id: number) => {
    await fetch("/api/borrow/return", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const handleSubmitBorrow = async () => {
    if (!form.userId || isNaN(Number(form.userId))) {
      alert("ID Anggota tidak valid!");
      return;
    }
    if (!form.bookId || isNaN(Number(form.bookId))) {
      alert("ID Buku tidak valid!");
      return;
    }
    if (!form.borrowDate || !form.dueDate) {
      alert("Tanggal tidak boleh kosong!");
      return;
    }

    await fetch("/api/borrow/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setShowAdd(false);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">📚 Data Peminjaman Buku</h1>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Peminjaman</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 items-end">
          <Link href="/dashboard/peminjam/tamabah">
            <Button className="bg-blue-600 text-white">+ Tambah Pinjam</Button>
          </Link>

          <div>
            <label>Bulan</label>
            <select
              className="border p-2 rounded"
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">Semua</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
            </select>
          </div>

          <div>
            <label>Tahun</label>
            <select
              className="border p-2 rounded"
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Semua</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <Button onClick={fetchData}>Cari</Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Data Semua Peminjaman</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border">
            <thead>
              <tr className="bg-black text-left">
                <th className="p-2 border">No</th>
                <th className="p-2 border">No Pinjam</th>
                <th className="p-2 border">ID Anggota</th>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Pinjam</th>
                <th className="p-2 border">Balik</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Denda</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {borrowings.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-3 text-center text-gray-500">
                    Tidak ada data peminjaman
                  </td>
                </tr>
              )}

              {borrowings.map((b: any, i) => (
                <tr key={b.id}>
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">PJ{b.id}</td>
                  <td className="p-2 border">{b.user.id}</td>
                  <td className="p-2 border">{b.user.name}</td>
                  <td className="p-2 border">{b.borrowDate.slice(0, 10)}</td>
                  <td className="p-2 border">{b.dueDate.slice(0, 10)}</td>
                  <td className="p-2 border">{b.status}</td>
                  <td className="p-2 border text-red-600">
                    {b.fine ? `Rp${b.fine.toLocaleString()}` : "-"}
                  </td>
                  <td className="p-2 flex gap-2">
                    <Button
                      size="sm"
                      className="bg-yellow-600 text-white"
                      onClick={() => handleReturn(b.id)}
                    >
                      Kembalikan
                    </Button>
                    <Button size="sm" className="bg-blue-600 text-white">
                      👁️
                    </Button>
                    <Button size="sm" className="bg-red-600 text-white">
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* MODAL TAMBAH PINJAM */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-xl w-[400px] space-y-3">
            <h2 className="text-lg font-bold">Tambah Peminjaman</h2>

            <input
              className="border p-2 w-full rounded"
              placeholder="ID Anggota"
              type="number"
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            />

            <input
              className="border p-2 w-full rounded"
              placeholder="ID Buku"
              type="number"
              onChange={(e) => setForm({ ...form, bookId: e.target.value })}
            />

            <input
              type="date"
              className="border p-2 w-full rounded"
              onChange={(e) => setForm({ ...form, borrowDate: e.target.value })}
            />

            <input
              type="date"
              className="border p-2 w-full rounded"
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>
                Batal
              </Button>
              <Button
                className="bg-blue-600 text-white"
                onClick={handleSubmitBorrow}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
