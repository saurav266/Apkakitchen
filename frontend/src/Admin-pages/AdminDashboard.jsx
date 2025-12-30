import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Package,
  IndianRupee,
  Users,
  Clock,
  XCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  PieChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { socket } from "../socket";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const FILTERS = ["day", "week", "month", "year"];

const AdminDashboard = memo(function AdminDashboard() {
  /* ================= STATE ================= */
  const [filter, setFilter] = useState("day");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentSplit, setPaymentSplit] = useState({
  cod: 0,
  online: 0
});


  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    totalUsers: 0
  });

  const [statusCounts, setStatusCounts] = useState({
    placed: 0,
    preparing: 0,
    delivered: 0
  });

  const [ordersData, setOrdersData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  const [cancelAlert, setCancelAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API}/api/admin/dashboard`,
          {
            params: { filter, from: fromDate, to: toDate },
            withCredentials: true
          }
        );

        if (data.success) {
  setStats(data.stats);
  setStatusCounts(data.statusCounts);
  setOrdersData(data.charts.orders);
  setRevenueData(data.charts.revenue);
  setPaymentSplit(data.paymentSplit); // ✅ ADD
}

      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [filter, fromDate, toDate]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.emit("join-admin");

    socket.on("order-cancelled", data => {
      setCancelAlert(data);
      setTimeout(() => setCancelAlert(null), 6000);
    });

    return () => socket.off("order-cancelled");
  }, []);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-orange-50 p-6 md:p-10">

      {/* 🔔 CANCEL ALERT */}
      {cancelAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-[9999] bg-red-50 border border-red-200 rounded-2xl shadow-xl p-4 w-80"
        >
          <div className="flex items-start gap-3">
            <XCircle className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <h4 className="font-semibold text-red-700">
                Order Cancelled
              </h4>
              <p className="text-sm text-gray-700">
                #{cancelAlert.orderId.slice(-6)}
              </p>
              <p className="text-sm text-gray-700">
                By: {cancelAlert.cancelledBy}
              </p>
              <p className="text-sm text-gray-700">
                Reason: {cancelAlert.reason}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 🏷️ HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Business overview & analytics
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white rounded-full p-1 shadow">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filter === f
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-orange-100"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow">
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <span>to</span>
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <p className="text-center text-gray-500 py-10">
          Loading dashboard…
        </p>
      )}

      {!loading && (
        <>
          {/* 📊 STATS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
  {
    label: "Today Orders",
    value: stats.todayOrders,
    icon: Package
  },
  {
    label: "Today Revenue",
    value: `₹${stats.todayRevenue}`,
    icon: IndianRupee,
    extra: (
      <div className="text-sm text-gray-600 mt-2 space-y-1">
        <p>💵 Cash (COD): ₹{paymentSplit.cod}</p>
        <p>💳 Online: ₹{paymentSplit.online}</p>
      </div>
    )
  },
  {
    label: "Total Users",
    value: stats.totalUsers,
    icon: Users
  }
].map((card, i) => {
  const Icon = card.icon;
  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow"
    >
      <Icon className="text-orange-600 mb-2" />
      <p className="text-gray-600">{card.label}</p>
      <p className="text-3xl font-bold">{card.value}</p>
      {card.extra}
    </motion.div>
  );
})}

          </div>

          {/* ⏳ STATUS */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Placed", value: statusCounts.placed },
              { label: "Preparing", value: statusCounts.preparing },
              { label: "Delivered", value: statusCounts.delivered }
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <div className="flex justify-between">
                  <h3>{s.label} Orders</h3>
                  <Clock className="text-gray-400" />
                </div>
                <p className="text-3xl font-bold mt-4">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* 📈 CHARTS */}
          {/* 📈 CHARTS */}
<div className="grid md:grid-cols-2 gap-8 mt-10">

  {/* ORDERS CHART */}
  <div className="bg-white p-6 rounded-xl shadow h-[320px]">
    <h3 className="font-semibold mb-4 text-gray-700">
      Orders Trend
    </h3>

    {ordersData.length === 0 ? (
      <p className="text-center text-gray-400">
        No order data
      </p>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ordersData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>

  {/* REVENUE CHART */}
  <div className="bg-white p-6 rounded-xl shadow h-[320px]">
    <h3 className="font-semibold mb-4 text-gray-700">
      Revenue Trend
    </h3>

    {revenueData.length === 0 ? (
      <p className="text-center text-gray-400">
        No revenue data
      </p>
    ) : (
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
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>

</div>

        </>
      )}
    </div>
  );
});

export default AdminDashboard;
