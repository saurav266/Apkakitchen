import { useState } from "react";
import AdminNavbar from "../Admin-Components/AdminNavbar.jsx";
import AdminSidebar from "../Admin-Components/AdminSidebar.jsx";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <AdminNavbar />

      <div className="flex">
        {/* 🧭 Sidebar */}
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* 📄 Main Content */}
        <div
          className={`
            flex-1 pt-20 bg-orange-50 min-h-screen transition-all duration-300
            ${collapsed ? "ml-20" : "ml-64"}
          `}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
