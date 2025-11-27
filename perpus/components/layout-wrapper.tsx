"use client";

import { useState } from "react";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        {/* Navbar hanya muncul saat sidebar ditutup */}
        <div className={`${sidebarOpen ? "hidden" : "block"}`}>
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        {children}
      </div>
    </div>
  );
}
