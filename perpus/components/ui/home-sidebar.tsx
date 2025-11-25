"use client";

import { Home, BookOpen, Users, Mail, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomeSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: BookOpen, label: "Katalog", path: "/dashboard/books" },
    { icon: Users, label: "Tentang", path: "#tentang" },
    { icon: Mail, label: "Hubungi", path: "#hubungi" },
  ];

  const handleNavigate = (path: string) => {
    if (path.startsWith("#")) {
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(path);
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 z-40 ${isOpen ? "w-64" : "w-0"}`}>
      <div className={`p-4 flex flex-col h-full overflow-hidden ${isOpen ? "opacity-100" : "opacity-0"}`}>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600">Perpus</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Perpustakaan Digital</p>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Login Button */}
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Login
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-12 top-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-lg"
      >
        {isOpen ? "◀" : "▶"}
      </button>
    </div>
  );
}
