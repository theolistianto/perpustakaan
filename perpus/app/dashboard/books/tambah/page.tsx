"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";

export default function TambahBukuPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    categoryId: "1",
    shelfId: "1",
    stock: "0",
    image: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          categoryId: parseInt(formData.categoryId),
          shelfId: parseInt(formData.shelfId),
          stock: parseInt(formData.stock),
          image: formData.image,
        }),
      });

      if (response.ok) {
        alert("Buku berhasil ditambahkan!");
        router.push("/dashboard/books");
      } else {
        const error = await response.json();
        alert("Gagal menambahkan buku: " + (error.message || "Unknown error"));
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/books"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tambah Buku Baru
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Upload Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Gambar Buku
                </h2>

                {/* Image Preview */}
                <div className="mb-4">
                  <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Belum ada gambar</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <label className="block w-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="w-full bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-lg py-3 px-4 flex items-center justify-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition font-medium">
                    <Upload className="w-5 h-5" />
                    Pilih Gambar
                  </div>
                </label>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Format: JPG, PNG, GIF (Max 5MB)
                </p>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, image: "" });
                    }}
                    className="w-full mt-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg py-2 px-4 hover:bg-red-200 dark:hover:bg-red-900/50 transition font-medium text-sm"
                  >
                    Hapus Gambar
                  </button>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Judul Buku <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Masukkan judul buku"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Pengarang <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="Masukkan nama pengarang"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Kategori <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                  >
                    <option value="1">Fiksi</option>
                    <option value="2">Non-Fiksi</option>
                    <option value="3">Teknologi</option>
                  </select>
                </div>

                {/* Shelf */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Rak <span className="text-red-600">*</span>
                  </label>
                  <select
                    required
                    value={formData.shelfId}
                    onChange={(e) =>
                      setFormData({ ...formData, shelfId: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                  >
                    <option value="1">Rak A</option>
                    <option value="2">Rak B</option>
                    <option value="3">Rak C</option>
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Stok <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="Masukkan jumlah stok"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/dashboard/books"
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-semibold"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition font-semibold"
                  >
                    {loading ? "Menyimpan..." : "Simpan Buku"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
