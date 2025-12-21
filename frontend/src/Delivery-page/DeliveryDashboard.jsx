import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DeliveryDashboard() {
  const [online, setOnline] = useState(true);
  const [activeOrder, setActiveOrder] = useState(0);

  const orders = [
    {
      id: "ORD-1201",
      customer: "Amit Sharma",
      address: "MG Road, Delhi",
      distance: "3.4 km",
      amount: "₹80",
      status: "Picked"
    },
    {
      id: "ORD-1202",
      customer: "Neha Verma",
      address: "Sector 18, Noida",
      distance: "4.1 km",
      amount: "₹95",
      status: "Assigned"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* ================= TOP BAR ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">🚴 Delivery Control Center</h1>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setOnline(!online)}
          className={`px-6 py-2 rounded-full text-white font-semibold shadow ${
            online ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {online ? "Shift Active 🟢" : "Shift Offline 🔴"}
        </motion.button>
      </div>

      {/* ================= KPI METRICS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI title="Assigned" value="5" />
        <KPI title="Completed Today" value="12" />
        <KPI title="Today's Earnings" value="₹720" />
        <KPI title="Rating" value="⭐ 4.8" />
      </div>

      {/* ================= ACTIVE ORDERS QUEUE ================= */}
      <motion.div
        layout
        className="bg-white rounded-2xl shadow p-6"
      >
        <h2 className="text-xl font-bold mb-4">📦 Active Orders Queue</h2>

        <div className="flex gap-3 mb-6">
          {orders.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveOrder(index)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                activeOrder === index
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              Order {index + 1}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={orders[activeOrder].id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <OrderDetails order={orders[activeOrder]} />
            <OrderProgress status={orders[activeOrder].status} />
            <OrderActions />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ================= PERFORMANCE ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard title="Weekly Earnings" value="₹4,850" />
        <InfoCard title="Monthly Earnings" value="₹18,900" />
        <InfoCard title="Completion Rate" value="96%" />
      </div>

      {/* ================= ACTIVITY FEED ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow p-6"
      >
        <h2 className="text-xl font-bold mb-4">📊 Recent Activity</h2>

        <ul className="space-y-3">
          <Activity text="Delivered order ORD-1198" />
          <Activity text="Earned ₹90 incentive" />
          <Activity text="Shift started at 9:00 AM" />
        </ul>
      </motion.div>
    </motion.div>
  );
}

/* ================= SUB COMPONENTS ================= */

function KPI({ title, value }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-gradient-to-br from-black to-gray-800 text-white p-6 rounded-2xl shadow"
    >
      <p className="opacity-80">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </motion.div>
  );
}

function OrderDetails({ order }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <p className="font-semibold">Order ID</p>
        <p>{order.id}</p>
      </div>
      <div>
        <p className="font-semibold">Customer</p>
        <p>{order.customer}</p>
      </div>
      <div>
        <p className="font-semibold">Address</p>
        <p>{order.address}</p>
      </div>
      <div>
        <p className="font-semibold">Distance</p>
        <p>{order.distance}</p>
      </div>
    </div>
  );
}

function OrderProgress({ status }) {
  const steps = ["Assigned", "Picked", "On The Way", "Delivered"];

  return (
    <div className="flex justify-between mt-6">
      {steps.map(step => (
        <div key={step} className="flex-1 text-center">
          <div
            className={`h-2 rounded-full mx-1 ${
              steps.indexOf(step) <= steps.indexOf(status)
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          />
          <p className="text-xs mt-1">{step}</p>
        </div>
      ))}
    </div>
  );
}

function OrderActions() {
  return (
    <div className="flex gap-3 mt-6">
      <Action text="Picked Up" color="bg-yellow-500" />
      <Action text="On The Way" color="bg-blue-500" />
      <Action text="Delivered" color="bg-green-600" />
    </div>
  );
}

function Action({ text, color }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className={`${color} text-white px-4 py-2 rounded-lg font-semibold shadow`}
    >
      {text}
    </motion.button>
  );
}

function InfoCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-white p-6 rounded-2xl shadow"
    >
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </motion.div>
  );
}

function Activity({ text }) {
  return (
    <motion.li
      whileHover={{ x: 6 }}
      className="text-gray-700"
    >
      • {text}
    </motion.li>
  );
}
