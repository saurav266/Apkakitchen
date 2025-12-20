import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header
      className="
        w-full h-16
        bg-white/90 backdrop-blur
        border-b border-orange-100
        shadow-sm
        flex items-center justify-between
        px-6 md:px-10
        fixed top-0 left-0 z-50
      "
    >
      {/* 🛡️ Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800 leading-none">
            Apna Kitchen
          </h1>
          <p className="text-xs text-gray-500 -mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* 👤 Admin Info + Logout */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-700">
            Admin
          </p>
          <p className="text-xs text-gray-500">
            admin@apnakitchen.com
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-full
            bg-gradient-to-r from-orange-500 to-red-500
            text-white text-sm font-semibold
            shadow hover:opacity-90 transition
          "
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
