"use client";

import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Floating Hamburger Button - Mobile Only */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
