"use client";

import { useEffect, useState } from "react";
import { FileText, Search, X, Trash2, Check } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
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

export default function PeminjamPage() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
    fetchAllRequests();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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

  const handleApprove = async (requestId: number) => {
    try {
      const res = await fetch(`/api/borrow/request/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (res.ok) {
        alert("Permintaan disetujui!");
        fetchAllRequests();
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  const handleDelete = async (requestId: number) => {
    if (!confirm("Hapus permintaan peminjaman ini?")) return;

    try {
      const res = await fetch(`/api/borrow/request/${requestId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Permintaan dihapus!");
        fetchAllRequests();
      }
    } catch (error) {
      alert("Error: " + (error as Error).message);
    }
  };

  useEffect(() => {
    let filtered = requests;

    if (selectedUser) {
      filtered = filtered.filter((r) => r.user.id === selectedUser.id);
    }

    setFilteredRequests(filtered);
  }, [selectedUser, requests]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, users]);

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
          Kelola Peminjam
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari peminjam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* User Search Results */}
            {searchResults.length > 0 && !selectedUser && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                    >
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected User Info */}
        {selectedUser && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedUser.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedUser.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setSearchTerm("");
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

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
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Peminjam
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
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
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      {req.user.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                      {req.user.email}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {req.status === "pending" && (
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Terima
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
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
  );
}
