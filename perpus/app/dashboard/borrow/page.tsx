"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, XCircle, Search } from "lucide-react";

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
        setFilteredRequests(data);
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
        setFilteredRequests(data);
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

  useEffect(() => {
    let filtered = requests;

    if (userRole === "admin") {
      if (searchTerm) {
        filtered = filtered.filter(
          (r) =>
            r.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.book.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((r) => r.status === statusFilter);
      }
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests, userRole]);

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

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          {userRole === "admin" ? "Kelola Peminjaman" : "Peminjaman Saya"}
        </h1>
      </div>

      {/* Search and Filter - Admin Only */}
      {userRole === "admin" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama peminjam atau judul buku..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
          </div>
          {(searchTerm || statusFilter !== "all") && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Menampilkan {filteredRequests.length} dari {requests.length} permintaan
            </p>
          )}
        </div>
      )}

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {requests.length === 0
              ? "Tidak ada permintaan peminjaman"
              : "Tidak ada hasil yang sesuai dengan pencarian"}
          </p>
        </div>
      ) : (
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
                    Status
                  </th>
                  {userRole === "admin" && (
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                      Aksi
                    </th>
                  )}
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
                      <td className="py-4 px-6">
                        {req.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                            >
                              Terima
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                            >
                              Tolak
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
