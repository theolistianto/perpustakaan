"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, XCircle, Search, BookOpen, X, Trash2 } from "lucide-react";

interface Book {
  id: number;
  title: string;
  author: string;
  image?: string;
}

interface BorrowRequest {
  id: number;
  status: string;
  borrowDate: string;
  book: {
    id: number;
    title: string;
    author: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function BorrowPage() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [books, setBooks] = useState<Book[]>([]);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [creatingRequest, setCreatingRequest] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    setUserRole(role);
    setUserEmail(email);

    if (role === "admin") {
      fetchAllRequests();
      fetchBooks();
    } else {
      fetchUserRequests();
    }
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchAllRequests = async () => {
    try {
      // Fetch from an endpoint that returns ALL requests, not just pending
      const res = await fetch("/api/borrow/all-requests?status=all", {
        headers: { "x-user-email": userEmail || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        // Fallback: fetch from user-requests if admin endpoint doesn't support all
        const fallbackRes = await fetch("/api/borrow/all-requests", {
          headers: { "x-user-email": userEmail || "" },
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          setRequests(data);
        }
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRequests = async () => {
    try {
      const res = await fetch(`/api/borrow/user-requests`, {
        headers: { "x-user-email": userEmail || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (requestId: number) => {
    if (!confirm("Hapus permintaan peminjaman ini?")) return;

    try {
      const res = await fetch(`/api/borrow/request/${requestId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from local state immediately to keep table visible
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== requestId)
        );
        alert("Permintaan dihapus!");
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  const handleBorrowBook = async () => {
    if (!selectedBook || !userEmail) return;

    setCreatingRequest(true);
    try {
      const res = await fetch("/api/borrow/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": userEmail,
        },
        body: JSON.stringify({
          bookId: selectedBook.id,
        }),
      });

      if (res.ok) {
        alert("Permintaan peminjaman berhasil dibuat!");
        setSelectedBook(null);
        setSearchTerm("");
        fetchAllRequests();
      } else {
        const error = await res.json();
        alert("Error: " + error.message);
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    } finally {
      setCreatingRequest(false);
    }
  };

  useEffect(() => {
    let filtered = requests;

    if (selectedBook) {
      filtered = filtered.filter((r) => r.book.id === selectedBook.id);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [statusFilter, selectedBook, requests]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, books]);

  const getStatusIcon = (status: string) => {
    if (status === "pending") return <Clock className="w-5 h-5 text-yellow-600" />;
    if (status === "approved") return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === "rejected") return <XCircle className="w-5 h-5 text-red-600" />;
    return null;
  };

  const getStatusColor = (status: string) => {
    if (status === "pending")
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200";
    if (status === "approved")
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200";
    if (status === "rejected")
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const getStatusText = (status: string) => {
    if (status === "pending") return "Menunggu";
    if (status === "approved") return "Silahkan ambil buku";
    if (status === "rejected") return "Mohon maaf anda di tolak";
    return status;
  };

  if (loading)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          {userRole === "admin" ? "Kelola Peminjaman" : "Peminjaman Saya"}
        </h1>
      </div>

      {/* Search and Filter - Both Admin and Member */}
      {(userRole === "admin" || userRole !== "admin") && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {userRole === "admin" ? (
              <>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari buku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {searchResults.length > 0 && !selectedBook && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                      <div className="max-h-64 overflow-y-auto">
                        {searchResults.map((book) => (
                          <button
                            key={book.id}
                            onClick={() => {
                              setSelectedBook(book);
                              setSearchResults([]);
                            }}
                            className="w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition flex items-start gap-3"
                          >
                            <div className="bg-gray-100 dark:bg-gray-700 rounded p-2 flex-shrink-0">
                              {book.image ? (
                                <img
                                  src={book.image}
                                  alt={book.title}
                                  className="w-12 h-16 object-cover rounded"
                                />
                              ) : (
                                <BookOpen className="w-12 h-16 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white truncate">
                                {book.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {book.author}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </>
            ) : (
              <div className="flex-1">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
            )}
          </div>

          {userRole === "admin" && selectedBook && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded p-2">
                    {selectedBook.image ? (
                      <img
                        src={selectedBook.image}
                        alt={selectedBook.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <BookOpen className="w-12 h-16 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedBook.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedBook.author}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedBook(null);
                    setSearchTerm("");
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <button
                onClick={handleBorrowBook}
                disabled={creatingRequest}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition"
              >
                {creatingRequest ? "Membuat Permintaan..." : "Ajukan Peminjaman"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Requests Table / Card View */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {requests.length === 0
              ? "Tidak ada permintaan peminjaman"
              : "Tidak ada hasil yang sesuai dengan pencarian"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
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
                    Status
                  </th>
                  {userRole === "admin" && (
                    <>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        Peminjam
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        Email
                      </th>
                    </>
                  )}
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                  >
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      #{req.id}
                    </td>
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      {req.book.title}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {req.book.author}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(req.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            req.status
                          )}`}
                        >
                          {getStatusText(req.status)}
                        </span>
                      </div>
                    </td>
                    {userRole === "admin" && (
                      <>
                        <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                          {req.user.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                          {req.user.email}
                        </td>
                      </>
                    )}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center gap-2"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredRequests.map((req) => (
              <div key={req.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">ID: #{req.id}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">{req.book.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{req.book.author}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusIcon(req.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(req.status)}`}>
                      {getStatusText(req.status)}
                    </span>
                  </div>
                </div>
                
                {userRole === "admin" && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Peminjam:</span> {req.user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                      <span className="font-semibold">Email:</span> {req.user.email}
                    </p>
                  </div>
                )}
                
                <button
                  onClick={() => handleDelete(req.id)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
