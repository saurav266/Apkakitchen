import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  IndianRupee,
  Users,
  Star,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  // 👉 dummy states (will connect APIs later)
  const [stats, setStats] = useState({
    todayOrders: 24,
    todayRevenue: 7850,
    activeUsers: 18,
    avgRating: 4.6,
    placed: 6,
    preparing: 10,
    delivered: 8
  });

  useEffect(() => {
    // 🔌 Later: fetch from backend APIs
  }, []);

  const cards = [
    {
      label: "Today’s Orders",
      value: stats.todayOrders,
      icon: Package,
      color: "from-orange-500 to-red-500"
    },
    {
      label: "Today’s Revenue",
      value: `₹${stats.todayRevenue}`,
      icon: IndianRupee,
      color: "from-green-500 to-emerald-500"
    },
    {
      label: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    },
    {
      label: "Avg Rating",
      value: stats.avgRating,
      icon: Star,
      color: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-6 md:p-10">
      {/* 🏷️ Heading */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here’s what’s happening today.
        </p>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="
                bg-white rounded-2xl p-6 shadow
                hover:shadow-lg transition
                border border-orange-100
              "
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} text-white mb-4`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-gray-600 text-sm">{card.label}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ⏳ Order Status */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Placed", value: stats.placed, color: "bg-orange-500" },
          { label: "Preparing", value: stats.preparing, color: "bg-yellow-500" },
          { label: "Delivered", value: stats.delivered, color: "bg-green-500" }
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i === 0 ? -20 : i === 2 ? 20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="bg-white rounded-2xl p-6 shadow border border-orange-100"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-700 font-medium">{s.label} Orders</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold mt-4 text-gray-800">
              {s.value}
            </p>
            <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`${s.color} h-full`}
                style={{ width: `${(s.value / 20) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📈 Charts Placeholder */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow border border-orange-100 h-64 flex items-center justify-center text-gray-500">
          📈 Orders per Day (Chart)
        </div>
        <div className="bg-white rounded-2xl p-6 shadow border border-orange-100 h-64 flex items-center justify-center text-gray-500">
          💰 Revenue per Week (Chart)
        </div>
      </div>
    </div>
  );
}
