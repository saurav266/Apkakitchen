import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Bike,
  UtensilsCrossed,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Orders", path: "/admin/orders", icon: ClipboardList },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Delivery", path: "/admin/delivery", icon: Bike },
  { name: "Menu", path: "/admin/menu", icon: UtensilsCrossed },
  { name: "Settings", path: "/admin/settings", icon: Settings }
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
  return (
    <aside
      className={`
        fixed top-16 left-0
        h-[calc(100vh-4rem)]
        bg-white border-r border-orange-100
        shadow-sm z-40
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* 🔘 Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-6
          w-7 h-7 rounded-full
          bg-white border shadow
          flex items-center justify-center
          text-gray-600 hover:text-orange-600
        "
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* 🧭 Menu */}
      <nav className="mt-6 flex flex-col gap-2 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-3 py-3 rounded-xl
                text-sm font-medium transition
                ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                }
                `
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
