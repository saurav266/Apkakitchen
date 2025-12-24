import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  IndianRupee,
  CreditCard,
  Package
} from "lucide-react";
import { useTheme } from "../context/Themecontext.jsx";

const API = "http://localhost:3000";

export default function DeliveryOrders() {
  const { dark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    codAmount: 0,
    onlineAmount: 0,
    totalDelivered: 0
  });
  const [filter, setFilter] = useState("today");


  const [recent, setRecent] = useState([]);

  /* ================= FETCH DELIVERED ORDERS ================= */
  const fetchDeliveredOrders = async (selectedFilter) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `${API}/api/delivery/delivered-payment-summary?filter=${selectedFilter}`,
      { withCredentials: true }
    );

    const data = res.data;

    setStats({
      codAmount: data.cashOnDelivery,
      onlineAmount: data.onlinePayment,
      totalDelivered: data.totalDeliveredOrders
    });

    setRecent(data.recentOrders || []);
    setLoading(false);
  } catch {
    setLoading(false);
  }
};
useEffect(() => {
  fetchDeliveredOrders(filter);
}, [filter]);


  if (loading) {
    return <p className="p-6 text-center">Loading deliveries...</p>;
  }

  return (
    <section
      className={`min-h-screen pt-6 pb-24 px-4 ${
        dark
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-amber-50 to-red-50"
      }`}
    >
      <div className="max-w-md mx-auto space-y-6">

        {/* HEADER */}
        <motion.div
          className={`rounded-3xl p-6 shadow-xl ${
            dark ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="flex gap-2 mt-4">
  {["today", "week", "month"].map(f => (
    <button
      key={f}
      onClick={() => setFilter(f)}
      className={`px-4 py-1 rounded-full text-sm font-medium transition
        ${
          filter === f
            ? "bg-orange-600 text-white"
            : dark
              ? "bg-slate-700 text-gray-300"
              : "bg-orange-100 text-orange-600"
        }
      `}
    >
      {f.toUpperCase()}
    </button>
  ))}
</div>

          <h2 className="text-2xl font-bold">
            My <span className="text-orange-600">Deliveries</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Delivered payment summary
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-center">
            <Stat
              label="Cash on Delivery"
              value={`₹${stats.codAmount}`}
              icon={IndianRupee}
              dark={dark}
            />
            <Stat
              label="Online Payment"
              value={`₹${stats.onlineAmount}`}
              icon={CreditCard}
              dark={dark}
            />
          </div>
        </motion.div>

        {/* TOTAL DELIVERIES */}
        <motion.div
          className={`rounded-3xl p-6 shadow-xl flex items-center gap-4 ${
            dark ? "bg-slate-800" : "bg-white"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Package />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Delivered Orders</p>
            <p className="text-xl font-bold text-orange-600">
              {stats.totalDelivered}
            </p>
          </div>
        </motion.div>

        {/* RECENT DELIVERIES */}
        <motion.div
          className={`rounded-3xl p-6 shadow-xl ${
            dark ? "bg-slate-800" : "bg-white"
          }`}
        >
          <h3 className="font-semibold mb-4">Recent Deliveries</h3>

          {recent.length === 0 ? (
            <p className="text-sm text-gray-400">
              No deliveries yet
            </p>
          ) : (
            <div className="space-y-3">
              {recent.slice(0, 10).map((o) => (
                <div
                  key={o._id}
                  className="flex justify-between border-b pb-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {o.paymentMethod}
                    </p>
                  </div>
                  <p className="font-semibold text-orange-600">
                    ₹{o.totalAmount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}

/* ================= STAT CARD ================= */
function Stat({ label, value, icon: Icon, dark }) {
  return (
    <div
      className={`rounded-2xl p-4 shadow ${
        dark ? "bg-slate-700" : "bg-orange-50"
      }`}
    >
      <div className="flex justify-center text-orange-600 mb-1">
        <Icon size={18} />
      </div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
