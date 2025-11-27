"use client";
import { BookOpen, LogOut, Settings, Home, HelpCircle, X, BarChart3, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userUsername, setUserUsername] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const username = localStorage.getItem("userUsername");
    setUserRole(role);
    setUserUsername(username);
  }, []);

  const adminMenuItems = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: BarChart3, label: "Dashboard", path: "/dashboard/dashboard" },
    { icon: BookOpen, label: "Buku", path: "/dashboard/books" },
    { icon: Users, label: "Peminjam", path: "/dashboard/peminjam" },
    { icon: BookOpen, label: "Peminjaman", path: "/dashboard/borrow" },
    { icon: HelpCircle, label: "Cara Meminjam", path: "/panduan/meminjam" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const memberMenuItems = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: BookOpen, label: "Katalog Buku", path: "/dashboard/books" },
    { icon: BookOpen, label: "Peminjaman Saya", path: "/dashboard/borrow" },
    { icon: HelpCircle, label: "Cara Meminjam", path: "/panduan/meminjam" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : memberMenuItems;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/auth/signup");
    window.location.reload();
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 bg-gray-900 text-white shadow-lg flex flex-col h-screen z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold">
              Perpus<span className="text-blue-400">System</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        {userRole && (
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-semibold">
                {userUsername?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-sm">{userUsername || "User"}</p>
                <p className="text-xs text-gray-400">
                  {userRole === "admin" ? "Admin" : "Pengunjung"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        {userRole && (
          <div className="p-6 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
