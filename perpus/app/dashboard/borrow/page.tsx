"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    setUserRole(role);
    setUserEmail(email);

    if (role === "admin") {
      fetchAllRequests();
    } else {
      fetchUserRequests();
    }
  }, []);

  const fetchAllRequests = async () => {
    try {
      const res = await fetch("/api/borrow/all-requests", {
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

  const handleApprove = async (requestId: number) => {
    try {
      const res = await fetch(`/api/borrow/request/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (res.ok) {
        alert("Permintaan disetujui!");
        userRole === "admin" ? fetchAllRequests() : fetchUserRequests();
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  const handleReject = async (requestId: number) => {
    if (!confirm("Tolak permintaan peminjaman ini?")) return;

    try {
      const res = await fetch(`/api/borrow/request/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (res.ok) {
        alert("Permintaan ditolak!");
        userRole === "admin" ? fetchAllRequests() : fetchUserRequests();
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

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
    if (status === "approved") return "Silahkan ambil di perpustakaan";
    if (status === "rejected") return "Ditolak";
    return status;
  };

  if (loading)
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Memuat...</p>
      </div>
    );

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-8 h-8 text-blue-600" />
              {userRole === "admin" ? "Kelola Peminjaman" : "Peminjaman Saya"}
            </h1>
            {userRole === "admin" && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total permintaan: <span className="font-semibold">{requests.length}</span> |{" "}
                <span className="text-yellow-600 font-semibold">Menunggu: {pendingRequests.length}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Tidak ada permintaan peminjaman
            </p>
          </div>
        ) : userRole === "admin" ? (
          // Admin View - Cards Layout
          <div className="space-y-6">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  Menunggu Persetujuan ({pendingRequests.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Permintaan #{req.id}
                          </p>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                            {req.book.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                            Menunggu
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Pengarang:</span> {req.book.author}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Peminjam:</span> {req.user.name}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Email:</span> {req.user.email}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Terima
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Requests */}
            {requests.filter((r) => r.status === "approved").length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Disetujui ({requests.filter((r) => r.status === "approved").length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requests
                    .filter((r) => r.status === "approved")
                    .map((req) => (
                      <div
                        key={req.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Permintaan #{req.id}
                            </p>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                              {req.book.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-800 dark:text-green-200">
                              Disetujui
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Pengarang:</span> {req.book.author}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Peminjam:</span> {req.user.name}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Email:</span> {req.user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Rejected Requests */}
            {requests.filter((r) => r.status === "rejected").length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  Ditolak ({requests.filter((r) => r.status === "rejected").length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {requests
                    .filter((r) => r.status === "rejected")
                    .map((req) => (
                      <div
                        key={req.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Permintaan #{req.id}
                            </p>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                              {req.book.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-full">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-semibold text-red-800 dark:text-red-200">
                              Ditolak
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Pengarang:</span> {req.book.author}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Peminjam:</span> {req.user.name}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Email:</span> {req.user.email}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Member View - Table
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
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
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
