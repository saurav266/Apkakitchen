import React from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Calendar,
  TrendingUp,
  Package,
} from "lucide-react";
import { useTheme } from "../context/Themecontext.jsx";

export default function DeliveryEarnings() {
  const { dark } = useTheme();

  // Demo data (API later)
  const stats = {
    today: 620,
    week: 4120,
    month: 16850,
    orders: 128,
  };

  const history = [
    { date: "Today", orders: 8, amount: 620 },
    { date: "Yesterday", orders: 6, amount: 480 },
    { date: "12 Dec", orders: 7, amount: 560 },
    { date: "11 Dec", orders: 5, amount: 420 },
    { date: "10 Dec", orders: 9, amount: 710 },
  ];

  return (
    <section
      className={`min-h-screen pt-6 pb-24 px-4 transition ${
        dark
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-amber-50 to-red-50"
      }`}
    >
      <div className="max-w-md mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl shadow-2xl p-6 ${
            dark ? "bg-slate-800" : "bg-white/90 backdrop-blur"
          }`}
        >
          <h2 className="text-2xl font-bold">
            My <span className="text-orange-600">Earnings</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Track your delivery income
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <Stat
              dark={dark}
              icon={IndianRupee}
              label="Today"
              value={`₹${stats.today}`}
            />
            <Stat
              dark={dark}
              icon={TrendingUp}
              label="Week"
              value={`₹${stats.week}`}
            />
            <Stat
              dark={dark}
              icon={Calendar}
              label="Month"
              value={`₹${stats.month}`}
            />
          </div>
        </motion.div>

        {/* Orders Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl shadow-xl p-6 flex items-center gap-4 ${
            dark ? "bg-slate-800" : "bg-white/90"
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Package />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Orders</p>
            <p className="text-xl font-bold">{stats.orders}</p>
          </div>
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl shadow-xl p-6 ${
            dark ? "bg-slate-800" : "bg-white/90"
          }`}
        >
          <h3 className="font-semibold mb-4">Recent Earnings</h3>

          <div className="space-y-3">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b border-gray-200/20 pb-2"
              >
                <div>
                  <p className="font-medium">{h.date}</p>
                  <p className="text-xs text-gray-400">
                    {h.orders} orders
                  </p>
                </div>
                <p className="font-semibold text-orange-600">
                  ₹{h.amount}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Withdraw / Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl shadow-xl p-6 text-center ${
            dark ? "bg-slate-800" : "bg-white/90"
          }`}
        >
          <p className="text-sm text-gray-400 mb-2">
            Payout every Monday
          </p>
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg">
            Request Withdrawal
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ====== Small Stat Card ====== */
function Stat({ icon: Icon, label, value, dark }) {
  return (
    <div
      className={`rounded-2xl p-4 shadow ${
        dark ? "bg-slate-700" : "bg-orange-50"
      }`}
    >
      <div className="flex justify-center mb-1 text-orange-600">
        <Icon size={18} />
      </div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
