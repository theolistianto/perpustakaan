"use client";

import { useRouter } from "next/navigation";
import { DollarSign, ChevronRight, Plus, BarChart3 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const settingsMenu = [
    {
      title: "Pengaturan Denda",
      description: "Kelola denda keterlambatan pengembalian buku",
      icon: DollarSign,
      path: "/dashboard/settings/denda",
      color: "text-blue-600",
    },
    {
      title: "Tambah Buku",
      description: "Tambahkan buku baru ke koleksi perpustakaan",
      icon: Plus,
      path: "/dashboard/books/tambah",
      color: "text-green-600",
    },
    {
      title: "Statistik Perpustakaan",
      description: "Lihat data statistik lengkap perpustakaan",
      icon: BarChart3,
      path: "/dashboard/settings/statistik",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Pengaturan
      </h1>

      <div className="space-y-4">
        {settingsMenu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="w-full bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg hover:scale-105 transition-all duration-300 p-6 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Icon className={`w-8 h-8 ${item.color}`} />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
