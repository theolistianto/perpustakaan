"use client";

import { Inter } from "next/font/google";
import Sidebar from "@/components/ui/sidebar";
import { useState } from "react";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarWidth = isOpen ? 250 : 60;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <main
              className="flex-1 p-6 overflow-auto transition-all duration-300"
              style={{ marginLeft: sidebarWidth }}
            >
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
