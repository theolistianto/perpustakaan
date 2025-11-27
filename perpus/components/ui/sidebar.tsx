"use client";
import { BookOpen, LogOut, Settings, Home, HelpCircle, Menu, X, BarChart3, Users } from "lucide-react";
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
        <div className="mb-4">
          <h2 className="text-xl font-bold text-blue-600">Perpustakaan</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {userRole === "admin" ? "👨‍💼 Admin" : "👤 Pengunjung"}
          </p>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push(item.path);
                setIsOpen(false);
              }}
            >
              <item.icon className="mr-2" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full justify-start"
          >
            {theme === "dark" ? (
              <Sun className="mr-2 w-4 h-4" />
            ) : (
              <Moon className="mr-2 w-4 h-4" />
            )}
            <span className="text-sm">Theme</span>
          </Button>

          <Button
            onClick={handleLogout}
            className="w-full justify-start bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30"
          >
            <LogOut className="mr-2 w-4 h-4" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
