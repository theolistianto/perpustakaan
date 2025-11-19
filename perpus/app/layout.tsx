import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/ui/sidebar";
import PageTransition from "@/components/ui/transition";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
