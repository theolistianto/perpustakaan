import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen bg-blue-50 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
