import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PERPUSCIS - Sistem Manajemen Perpustakaan Digital",
  description:
    "Platform manajemen perpustakaan modern yang dirancang untuk memudahkan pengelolaan koleksi buku",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:%232563eb;stop-opacity:1' /><stop offset='100%' style='stop-color:%239333ea;stop-opacity:1' /></linearGradient></defs><rect x='20' y='20' width='60' height='60' fill='url(%23grad)' rx='8'/><text x='50' y='60' font-size='32' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='Arial'>📚</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
