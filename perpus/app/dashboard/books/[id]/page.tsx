"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Share2, FileText } from "lucide-react";

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

interface BorrowRequest {
  id: number;
  status: string;
  borrowDate: string;
  book?: Book;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [loadingBorrow, setLoadingBorrow] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    setUserRole(role);
    setUserEmail(email);

    fetchBook();
    if (role === "member") {
      fetchBorrowRequests();
    }
  }, []);

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

  const fetchBorrowRequests = async () => {
    try {
      const res = await fetch(`/api/borrow/user-requests?bookId=${bookId}`, {
        headers: { "x-user-email": userEmail || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setBorrowRequests(data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleRequestBorrow = async () => {
    if (!userEmail) return alert("Silakan login terlebih dahulu");
    setLoadingBorrow(true);

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
        setShowBorrowForm(false);
        fetchBorrowRequests();
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setLoadingBorrow(false);
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (!confirm("Hapus permintaan peminjaman ini?")) return;

    try {
      const res = await fetch(`/api/borrow/request/${requestId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Permintaan dihapus");
        fetchBorrowRequests();
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
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

  const getStatusColor = (status: string) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200";
    if (status === "approved") return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200";
    if (status === "rejected") return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const getStatusText = (status: string) => {
    if (status === "pending") return "Menunggu";
    if (status === "approved") return "Silahkan ambil di perpustakaan";
    if (status === "rejected") return "Ditolak";
    return status;
  };

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

              {book.stock > 0 && userRole === "member" && (
                <button
                  onClick={() => setShowBorrowForm(true)}
                  className="w-full py-3 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                >
                  Ajukan Peminjaman
                </button>
              )}

              {book.stock === 0 && (
                <div className="w-full py-3 rounded-lg font-semibold bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-center">
                  Stok Habis
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Oleh <span className="font-semibold text-blue-600 dark:text-blue-400">{book.author}</span>
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
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
              </div>

              {borrowRequests.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Permintaan Peminjaman Saya
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Judul Buku</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {borrowRequests.map((req) => (
                          <tr key={req.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{req.id}</td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{req.book?.title}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(req.status)}`}>
                                {getStatusText(req.status)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {req.status === "pending" && (
                                <button
                                  onClick={() => handleDeleteRequest(req.id)}
                                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium text-sm"
                                >
                                  Batal
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {showBorrowForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ajukan Peminjaman
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Anda akan meminjam: <strong>{book.title}</strong>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowBorrowForm(false)}
                  disabled={loadingBorrow}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-semibold disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleRequestBorrow}
                  disabled={loadingBorrow}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  {loadingBorrow ? "Memproses..." : "Ajukan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
