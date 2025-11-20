import Image from "next/image";
import LoginPage from "./auth/login/page";
import BooksPage from "./dashboard/books/page";
import DashboardPage from "./dashboard/peminjam/page";
import AdminBorrowRequests from "./dashboard/peminjam/page";

export default function Home() {
  return (
    <div>
      <AdminBorrowRequests></AdminBorrowRequests>
    </div>
  );
}
