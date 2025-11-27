"use client";

import { FileText, AlertCircle } from "lucide-react";

export default function ContohDendaPage() {
  const contohData = [
    {
      id: 1,
      judul: "Buku Test Denda",
      pengarang: "Penulis Test",
      peminjam: "Test User",
      email: "test@perpus.id",
      terlambat: "30 hari",
      denda: "Rp 5.000",
      status: "Terlambat",
    },
    {
      id: 2,
      judul: "Buku Test Denda",
      pengarang: "Penulis Test",
      peminjam: "Test User",
      email: "test@perpus.id",
      terlambat: "14 hari",
      denda: "Rp 2.000",
      status: "Terlambat",
    },
    {
      id: 3,
      judul: "Buku Test Denda",
      pengarang: "Penulis Test",
      peminjam: "Test User",
      email: "test@perpus.id",
      terlambat: "7 hari",
      denda: "Rp 1.000",
      status: "Terlambat",
    },
    {
      id: 4,
      judul: "Buku Test Denda",
      pengarang: "Penulis Test",
      peminjam: "Test User",
      email: "test@perpus.id",
      terlambat: "0 hari",
      denda: "Tidak ada",
      status: "Sudah dikembalikan",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Contoh Table Denda Peminjam
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Berikut adalah contoh bagaimana table peminjam menampilkan perhitungan denda otomatis
          </p>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded-lg mb-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-200">Cara Perhitungan Denda:</p>
                <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                  • Denda = (Hari Terlambat ÷ 7) × Rp 1.000 per 7 hari
                  <br />
                  • Maksimal denda: Rp 50.000 (tidak bisa lebih)
                  <br />
                  • Jika sudah dikembalikan: Denda = Rp 0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    ID
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Judul Buku
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Pengarang
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Peminjam
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Terlambat
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Denda
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {contohData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      #{row.id}
                    </td>
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      {row.judul}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {row.pengarang}
                    </td>
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      {row.peminjam}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                      {row.email}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {row.terlambat}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-semibold ${row.denda === "Tidak ada" ? "text-green-600" : "text-red-600"}`}>
                        {row.denda}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        row.status === "Sudah dikembalikan"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {contohData.map((row) => (
            <div key={row.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">ID: #{row.id}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{row.judul}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{row.pengarang}</p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Peminjam:</span> {row.peminjam}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                  <span className="font-semibold">Email:</span> {row.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Terlambat:</span> {row.terlambat}
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Denda:</span>{" "}
                  <span className={`font-semibold ${row.denda === "Tidak ada" ? "text-green-600" : "text-red-600"}`}>
                    {row.denda}
                  </span>
                </p>
                <p className="text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    row.status === "Sudah dikembalikan"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  }`}>
                    {row.status}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Penjelasan Perhitungan:</h2>

          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contoh 1: 30 hari terlambat → Rp 5.000</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                30 hari ÷ 7 = 4,3 periode → 5 periode × Rp 1.000 = <span className="font-semibold">Rp 5.000</span>
              </p>
            </div>

            <div className="border-l-4 border-red-400 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contoh 2: 14 hari terlambat → Rp 2.000</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                14 hari ÷ 7 = 2 periode × Rp 1.000 = <span className="font-semibold">Rp 2.000</span>
              </p>
            </div>

            <div className="border-l-4 border-red-300 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contoh 3: 7 hari terlambat → Rp 1.000</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                7 hari ÷ 7 = 1 periode × Rp 1.000 = <span className="font-semibold">Rp 1.000</span>
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contoh 4: Sudah dikembalikan → Rp 0</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ketika buku sudah dikembalikan, denda otomatis menjadi <span className="font-semibold">Rp 0 (Tidak ada denda)</span>
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">Catatan:</span> Pengaturan denda dapat diubah melalui admin menu Settings → Pengaturan Denda. 
              Nilai default: Rp 1.000 per 7 hari, maksimal Rp 50.000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
