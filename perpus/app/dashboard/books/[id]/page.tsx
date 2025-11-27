"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Share2, FileText, X, Trash2 } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  categoryId: number;
  shelfId: number;
  stock: number;
  image?: string;
  category?: { name: string };
  shelf?: { name: string };
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");
    setUserEmail(email);
    setUserRole(role);

    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        if (res.ok) {
          const data = await res.json();
          setBook(data);
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleBorrow = async () => {
    if (!userEmail) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    try {
      const res = await fetch("/api/borrow/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail,
        },
        body: JSON.stringify({
          bookId: parseInt(bookId),
        }),
      });

      if (res.ok) {
        alert("Permintaan peminjaman berhasil dibuat!");
        setShowModal(false);
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  const handleDeleteBook = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus buku ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Buku berhasil dihapus!");
        router.push("/dashboard/books");
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-12">
        <p>Memuat...</p>
      </div>
    );

  if (!book)
    return (
      <div className="text-center py-12">
        <p>Buku tidak ditemukan</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Detail Buku
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:col-span-1">
            <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
              {book.image ? (
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <FileText className="w-24 h-24 text-gray-400" />
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  liked
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                {liked ? "Disukai" : "Suka"}
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: book.title,
                      text: `Periksa buku ini: ${book.title} oleh ${book.author}`,
                    });
                  } else {
                    alert("Bagikan: " + book.title);
                  }
                }}
                className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Share2 className="w-5 h-5" />
                Bagikan
              </button>

              <button
                onClick={() => setShowModal(true)}
                disabled={book.stock === 0}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  book.stock > 0
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Ajukan Peminjaman
              </button>

              {userRole === "admin" && (
                <button
                  onClick={handleDeleteBook}
                  disabled={deleting}
                  className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 transition disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  {deleting ? "Menghapus..." : "Hapus Buku"}
                </button>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
               <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Oleh <span className="font-semibold text-blue-600 dark:text-blue-400">{book.author}</span>
              </p>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Kategori</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {book.category?.name || "N/A"}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rak</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {book.shelf?.name || "N/A"}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-1000/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stok Tersedia</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {book.stock}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Ajukan Peminjaman
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Judul Buku</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {book.title}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pengarang</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {book.author}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kategori</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {book.category?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rak</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {book.shelf?.name}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleBorrow}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Pinjam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
