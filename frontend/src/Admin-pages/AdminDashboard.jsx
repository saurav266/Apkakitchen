import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  IndianRupee,
  Users,
  Clock
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function AdminDashboard() {
  const [filter, setFilter] = useState("day");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [stats, setStats] = useState({
    todayOrders: 24,
    todayRevenue: 7850,
    totalUsers: 352,
    placed: 6,
    preparing: 10,
    delivered: 8
  });

  // 📊 dummy chart data (replace with API)
  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    // 🔌 Later: fetch based on filter/fromDate/toDate
    const dummy = [
      { name: "Mon", orders: 12, revenue: 3200 },
      { name: "Tue", orders: 18, revenue: 4800 },
      { name: "Wed", orders: 10, revenue: 2600 },
      { name: "Thu", orders: 22, revenue: 6100 },
      { name: "Fri", orders: 28, revenue: 7500 },
      { name: "Sat", orders: 35, revenue: 9200 },
      { name: "Sun", orders: 30, revenue: 8400 }
    ];
    setOrdersData(dummy);
    setRevenueData(dummy);
  }, [filter, fromDate, toDate]);

  const filters = ["day", "week", "month", "year"];

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
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-6 md:p-10">
      {/* 🏷️ Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Business overview & analytics
          </p>
        </div>

        {/* 🗂 Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick filters */}
          <div className="flex bg-white/80 rounded-full p-1 shadow border border-orange-100">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition
                  ${
                    filter === f
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow"
                      : "text-gray-600 hover:bg-orange-100"
                  }
                `}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 📅 Custom date range */}
          <div className="flex items-center gap-2 bg-white/80 p-2 rounded-xl shadow border border-orange-100">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow border border-orange-100"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${card.color} text-white mb-4`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-gray-600 text-sm">{card.label}</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ⏳ Order Status */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Placed", value: stats.placed, color: "bg-orange-500" },
          { label: "Preparing", value: stats.preparing, color: "bg-yellow-500" },
          { label: "Delivered", value: stats.delivered, color: "bg-green-500" }
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white/90 rounded-3xl p-6 shadow border border-orange-100"
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
                className={`${s.color} h-full rounded-full`}
                style={{ width: `${Math.min((s.value / 20) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 📈 Charts */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Orders Chart */}
        <div className="bg-white/90 rounded-3xl p-6 shadow border border-orange-100 h-80">
          <h3 className="font-semibold text-gray-800 mb-4">
            Orders ({filter})
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white/90 rounded-3xl p-6 shadow border border-orange-100 h-80">
          <h3 className="font-semibold text-gray-800 mb-4">
            Revenue ({filter})
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
