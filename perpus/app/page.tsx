import Image from "next/image";
import DashboardPage from "./dashboard/dashboard/page";
import LoginPage from "./auth/login/page";
import BooksPage from "./dashboard/books/page";

export default function Home() {
  return (
    <div>
      <BooksPage></BooksPage>
    </div>
  );
}
