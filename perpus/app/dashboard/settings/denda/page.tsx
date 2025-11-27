"use client";

import { useState, useEffect } from "react";
import { DollarSign, ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DendaPage() {
  const [dailyFine, setDailyFine] = useState<number>(1000);
  const [maxFine, setMaxFine] = useState<number>(50000);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/fine-settings");
        if (res.ok) {
          const data = await res.json();
          setDailyFine(data.finePerSevenDays);
          setMaxFine(data.maxFine);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    if (dailyFine < 100 || dailyFine > 100000) {
      setMessage({
        type: "error",
        text: "Denda harian harus antara Rp 100 - Rp 100.000",
      });
      return;
    }

    if (maxFine < dailyFine || maxFine > 1000000) {
      setMessage({
        type: "error",
        text: "Maksimal denda harus lebih besar dari denda harian dan tidak boleh lebih dari Rp 1.000.000",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Save to database via API
      const res = await fetch("/api/fine-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          finePerSevenDays: dailyFine,
          maxFine: maxFine,
        }),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Pengaturan denda berhasil disimpan ke database!",
        });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await res.json();
        setMessage({
          type: "error",
          text: error.error || "Gagal menyimpan pengaturan denda",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Gagal menyimpan pengaturan denda: " + (error as Error).message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/settings"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pengaturan Denda
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola sistem denda keterlambatan pengembalian buku
          </p>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              message.type === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          />
          <p
            className={`text-sm ${
              message.type === "success"
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Settings Form */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Memuat pengaturan...</p>
        </div>
      ) : (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-8">
        {/* 7-Day Fine Input */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Denda Per 7 Hari
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Jumlah denda yang dikenakan per 7 hari keterlambatan (dalam Rupiah)
              </p>
            </div>
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-600 dark:text-gray-400 font-medium">
                  Rp
                </span>
                <input
                  type="number"
                  value={dailyFine}
                  onChange={(e) => setDailyFine(Math.max(100, parseInt(e.target.value) || 0))}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="100"
                  max="100000"
                  step="100"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(dailyFine)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                per 7 hari keterlambatan
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Range: Rp 100 - Rp 100.000
          </p>
        </div>

        {/* Max Fine Input */}
        <div className="pb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Maksimal Denda
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Batas maksimal denda yang dapat dikenakan (dalam Rupiah)
              </p>
            </div>
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-600 dark:text-gray-400 font-medium">
                  Rp
                </span>
                <input
                  type="number"
                  value={maxFine}
                  onChange={(e) => setMaxFine(Math.max(dailyFine, parseInt(e.target.value) || 0))}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min={dailyFine}
                  max="1000000"
                  step="100"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(maxFine)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                batas maksimal
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
            Range: Rp {new Intl.NumberFormat("id-ID").format(dailyFine)} - Rp 1.000.000
          </p>
        </div>

        {/* Example Calculation */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
            Contoh Perhitungan Denda
          </h3>
          <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <p>
              • Jika peminjam terlambat <span className="font-semibold">7 hari</span>: Rp{" "}
              {new Intl.NumberFormat("id-ID").format(dailyFine)}
            </p>
            <p>
              • Jika peminjam terlambat <span className="font-semibold">14 hari</span>: Rp{" "}
              {new Intl.NumberFormat("id-ID").format(dailyFine * 2)}
            </p>
            <p>
              • Jika peminjam terlambat <span className="font-semibold">30 hari</span>: Rp{" "}
              {new Intl.NumberFormat("id-ID").format(
                Math.min(Math.ceil((dailyFine * 30) / 7), maxFine)
              )}{" "}
              {Math.ceil((dailyFine * 30) / 7) > maxFine && "(Maksimal denda diterbitkan)"}
            </p>
            <p>
              • Jika peminjam terlambat <span className="font-semibold">60 hari</span>: Rp{" "}
              {new Intl.NumberFormat("id-ID").format(maxFine)} (Maksimal denda diterbitkan)
            </p>
          </div>
        </div>
      </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
        <Link
          href="/dashboard/settings"
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition text-center"
        >
          Batal
        </Link>
      </div>
    </div>
  );
}
