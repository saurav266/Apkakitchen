import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  IndianRupee,
  Bell,
  Power,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useTheme } from "../context/Themecontext.jsx";

export default function DeliveryDashboard() {
  const { dark } = useTheme();

  const [online, setOnline] = useState(true);
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "Rohit Sharma",
      address: "Main Road, Ranchi",
      distance: "3.2 km",
      time: 18 * 60,
    },
  ]);
  const [earnings, setEarnings] = useState(420);

  // 🔔 sound + vibration on new order
  useEffect(() => {
    if (orders.length > 0) {
      const audio = new Audio("/sounds/notify.mp3");
      audio.play().catch(() => {});
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [orders]);

  const acceptOrder = (id) => {
    alert("Order accepted!");
  };

  const rejectOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <section
      className={`min-h-screen pt-6 pb-24 px-4 transition-colors ${
        dark
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 text-gray-800"
      }`}
    >
      <div className="max-w-md mx-auto space-y-6">

        {/* 🟢 Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Delivery{" "}
            <span className="text-orange-600">Dashboard</span>
          </h2>

          <button
            onClick={() => setOnline(!online)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow transition ${
              online
                ? "bg-green-100 text-green-700"
                : dark
                ? "bg-slate-700 text-gray-300"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <Power className="w-4 h-4" />
            {online ? "Online" : "Offline"}
          </button>
        </div>

        {/* 💰 Earnings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg p-5 flex items-center justify-between ${
            dark
              ? "bg-slate-800 border border-slate-700"
              : "bg-white/90 backdrop-blur"
          }`}
        >
          <div>
            <p className="text-sm text-gray-400">Today’s Earnings</p>
            <p className="text-2xl font-bold text-orange-600">
              ₹{earnings}
            </p>
          </div>
          <IndianRupee className="w-10 h-10 text-orange-400" />
        </motion.div>

        {/* 🗺️ Map */}
        <div
          className={`rounded-2xl shadow-lg overflow-hidden ${
            dark ? "bg-slate-800 border border-slate-700" : "bg-white/90"
          }`}
        >
          <div
            className={`flex items-center gap-2 px-4 py-3 border-b ${
              dark ? "border-slate-700" : ""
            }`}
          >
            <MapPin className="text-orange-600 w-5 h-5" />
            <h3 className="font-semibold">Live Route</h3>
          </div>
          <div
            className={`h-48 flex items-center justify-center text-sm ${
              dark ? "bg-slate-700 text-gray-400" : "bg-gray-200 text-gray-500"
            }`}
          >
            Google Map will appear here
          </div>
        </div>

        {/* 📦 Orders */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            New Orders
          </h3>

          {orders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              No active orders 🚴‍♂️
            </p>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={acceptOrder}
                onReject={rejectOrder}
                dark={dark}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= ORDER CARD ================= */

function OrderCard({ order, onAccept, onReject, dark }) {
  const [timeLeft, setTimeLeft] = useState(order.time);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl shadow-lg p-5 mb-4 border transition ${
        dark
          ? "bg-slate-800 border-slate-700"
          : "bg-white/90 backdrop-blur border-orange-100"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold">{order.customer}</p>
          <p className="text-sm text-gray-400">{order.address}</p>
          <p className="text-xs text-gray-500">
            {order.distance} away
          </p>
        </div>

        <div className="flex items-center gap-1 text-orange-600 font-semibold">
          <Clock className="w-4 h-4" />
          {mins}:{secs.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onAccept(order.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-xl font-semibold"
        >
          <CheckCircle className="w-5 h-5" /> Accept
        </button>
        <button
          onClick={() => onReject(order.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-xl font-semibold"
        >
          <XCircle className="w-5 h-5" /> Reject
        </button>
      </div>
    </motion.div>
  );
}
