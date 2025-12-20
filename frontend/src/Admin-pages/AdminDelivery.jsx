import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Package, UserCheck } from "lucide-react";

// 🚴 Dummy delivery boys
const initialBoys = [
  {
    id: 1,
    name: "Rohit Kumar",
    phone: "9876543210",
    status: "available",
    currentOrder: null,
    location: "Main Road, Ranchi"
  },
  {
    id: 2,
    name: "Amit Singh",
    phone: "9123456780",
    status: "busy",
    currentOrder: "ORD1023",
    location: "Lalpur, Ranchi"
  },
  {
    id: 3,
    name: "Suresh Yadav",
    phone: "9000011111",
    status: "offline",
    currentOrder: null,
    location: "—"
  }
];

// 📦 Dummy orders waiting for assignment
const pendingOrders = [
  { id: "ORD1025", customer: "Ravi", area: "Doranda", amount: 349 },
  { id: "ORD1026", customer: "Pooja", area: "Harmu", amount: 199 }
];

export default function AdminDelivery() {
  const [boys, setBoys] = useState(initialBoys);
  const [orders, setOrders] = useState(pendingOrders);
  const [selectedOrder, setSelectedOrder] = useState("");

  const assignOrder = (boyId) => {
    if (!selectedOrder) return alert("Select an order first!");

    setBoys(boys.map(b =>
      b.id === boyId
        ? { ...b, status: "busy", currentOrder: selectedOrder }
        : b
    ));

    setOrders(orders.filter(o => o.id !== selectedOrder));
    setSelectedOrder("");
  };

  const statusColor = (status) => {
    if (status === "available") return "bg-green-100 text-green-700";
    if (status === "busy") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-200 text-gray-600";
  };

  return (
    <div className="p-6 md:p-10">
      {/* 🏷️ Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Delivery Management
        </h1>
        <p className="text-gray-600">
          Assign orders & track delivery partners
        </p>
      </div>

      {/* 📦 Pending Orders */}
      <div className="mb-6 bg-white p-5 rounded-2xl shadow border">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-600" />
          Pending Orders
        </h2>

        <div className="flex flex-wrap gap-3">
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => setSelectedOrder(o.id)}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedOrder === o.id
                  ? "bg-orange-600 text-white"
                  : "bg-orange-50"
              }`}
            >
              #{o.id} • {o.area} • ₹{o.amount}
            </button>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-500 text-sm">
              No pending orders 🎉
            </p>
          )}
        </div>
      </div>

      {/* 🚴 Delivery Boys List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boys.map((boy, i) => (
          <motion.div
            key={boy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow border hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {boy.name}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs ${statusColor(boy.status)}`}
              >
                {boy.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-2 mb-4">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" />
                {boy.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                {boy.location}
              </p>
              {boy.currentOrder && (
                <p className="flex items-center gap-2 font-medium text-gray-800">
                  <Package className="w-4 h-4 text-orange-500" />
                  Order: #{boy.currentOrder}
                </p>
              )}
            </div>

            {/* 🎯 Actions */}
            {boy.status === "available" ? (
              <button
                onClick={() => assignOrder(boy.id)}
                className="w-full py-2 rounded-xl bg-orange-600 text-white text-sm shadow hover:bg-orange-700"
              >
                Assign Selected Order
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2 rounded-xl bg-gray-200 text-gray-500 text-sm cursor-not-allowed"
              >
                Not Available
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* 🗺️ Live Map Placeholder */}
      <div className="mt-10 bg-white rounded-2xl p-6 shadow border h-72 flex items-center justify-center text-gray-500">
        🗺️ Live Map View (Delivery tracking will appear here)
      </div>
    </div>
  );
}
