import { Outlet } from "react-router-dom";
import Sidebar from "../component/sidebar";
import "../component/sidebar.css"; // değişkenler burada

export default function AuthedLayout() {
  return (
    <>
      {/* Solda sabit sidebar */}
      <Sidebar />
      {/* İçerik alanı: sidebar genişliğini margin-left ile telafi ediyoruz */}
      <main className="app-main">
        <div className="app-container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
