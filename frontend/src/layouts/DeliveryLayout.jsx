import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function DeliveryLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="w-64 bg-black text-white p-6"
      >
        <h2 className="text-2xl font-bold mb-10">🚴 Delivery</h2>

        <nav className="space-y-4">
          <NavLink to="dashboard">Dashboard</NavLink>
          <NavLink to="orders">Orders</NavLink>
          <NavLink to="profile">Profile</NavLink>
        </nav>
      </motion.aside>

      {/* Page Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}
