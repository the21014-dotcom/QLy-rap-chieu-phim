import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import  Footer from "../components/common/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-dark text-white">
      <Header />
      <main className="grow">
        <Outlet /> {/* Nơi các trang con như Home, MovieDetails hiện ra */}
      </main>
      <Footer />
    </div>
  );
}