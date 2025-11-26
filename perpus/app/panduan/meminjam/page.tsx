"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Search, MousePointer, Check, Eye } from "lucide-react";

export default function PanduanMeminjamPage() {
  const router = useRouter();

  const steps = [
    {
      number: 1,
      title: "Masuk ke Aplikasi",
      description: "Klik tombol Login di halaman utama, pilih peran (Pengunjung atau Admin), dan masukkan kredensial demo.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      number: 2,
      title: "Buka Katalog Buku",
      description: "Setelah login, klik menu 'Katalog Buku' di sidebar untuk melihat daftar semua buku yang tersedia.",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      number: 3,
      title: "Cari Buku yang Diinginkan",
      description: "Gunakan kotak pencarian untuk menemukan buku berdasarkan judul atau pengarang.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      number: 4,
      title: "Klik Detail Buku",
      description: "Klik pada buku yang ingin Anda pinjam untuk melihat detail lengkap termasuk judul, pengarang, kategori, dan lokasi rak.",
      icon: <MousePointer className="w-6 h-6" />,
    },
    {
      number: 5,
      title: "Ajukan Peminjaman",
      description: "Di halaman detail buku, klik tombol 'Ajukan Peminjaman'. Sebuah modal akan muncul untuk konfirmasi.",
      icon: <Check className="w-6 h-6" />,
    },
    {
      number: 6,
      title: "Konfirmasi Permintaan",
      description: "Klik tombol 'Pinjam' di modal untuk mengkonfirmasi. Permintaan Anda akan masuk dengan status 'Menunggu' persetujuan admin.",
      icon: <Check className="w-6 h-6" />,
    },
    {
      number: 7,
      title: "Pantau Status Peminjaman",
      description: "Buka menu 'Peminjaman Saya' untuk melihat status permintaan Anda:\n- 'Menunggu' = Menunggu persetujuan admin\n- 'Silahkan ambil buku' = Disetujui, siap diambil\n- 'Mohon maaf anda di tolak' = Permintaan ditolak",
      icon: <Eye className="w-6 h-6" />,
    },
    {
      number: 8,
      title: "Ambil Buku di Perpustakaan",
      description: "Setelah status berubah menjadi 'Silahkan ambil buku', datangi perpustakaan dan ambil buku dari lokasi rak yang telah ditentukan.",
      icon: <BookOpen className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panduan Cara Meminjam Buku
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ikuti langkah-langkah di bawah ini untuk meminjam buku dari perpustakaan digital kami
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-blue-600"
            >
              <div className="flex gap-4">
                {/* Number Circle */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {step.description}
                  </p>
                </div>

                {/* Icon */}
                <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">
                  {step.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">
            💡 Tips Penting
          </h2>
          <ul className="space-y-2 text-yellow-800 dark:text-yellow-300">
            <li>✓ Pastikan Anda sudah login sebelum mengajukan peminjaman</li>
            <li>✓ Periksa status permintaan Anda secara berkala di menu "Peminjaman Saya"</li>
            <li>✓ Jika permintaan ditolak, Anda bisa mengajukan kembali buku lain</li>
            <li>✓ Perhatikan lokasi rak untuk menemukan buku dengan mudah</li>
            <li>✓ Hubungi admin jika ada pertanyaan atau kendala dalam proses peminjaman</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
