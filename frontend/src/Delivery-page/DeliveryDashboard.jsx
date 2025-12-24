import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { socket } from "../socket";
import { useTheme } from "../context/Themecontext.jsx";
import { Bell, Power, IndianRupee } from "lucide-react";

const API = "http://localhost:3000";

export default function DeliveryDashboard() {
  const { dark } = useTheme();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [online, setOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${API}/api/delivery/orders/assigned`,
        { withCredentials: true }
      );
      setOrders(res.data.orders || []);
    } catch {
      console.error("Failed to fetch orders");
    }
  };

  /* ================= FETCH EARNINGS ================= */
  const fetchEarnings = async () => {
    try {
      const res = await axios.get(
        `${API}/api/delivery/earnings`,
        { withCredentials: true }
      );
      setEarnings(res.data.todayEarnings || 0);
    } catch {
      console.error("Failed to fetch earnings");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchEarnings();
  }, []);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.on("order-assigned", (order) => {
      setOrders(prev => {
        const exists = prev.find(o => o._id === order._id);
        if (exists) return prev;
        return [order, ...prev];
      });
    });

    return () => socket.off("order-assigned");
  }, []);

  /* ================= ONLINE / OFFLINE ================= */
  const toggleOnline = async () => {
    try {
      const newStatus = online ? "offline" : "available";
      await axios.patch(
        `${API}/api/delivery/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOnline(!online);
    } catch {
      alert("Failed to update status");
    }
  };

  /* ================= ACCEPT ================= */
  const acceptOrder = async (orderId) => {
    await axios.post(
      `${API}/api/delivery/orders/${orderId}/accept`,
      {},
      { withCredentials: true }
    );
    fetchOrders();
  };

  /* ================= REJECT ================= */
  const rejectOrder = async (orderId) => {
    await axios.post(
      `${API}/api/delivery/orders/${orderId}/reject`,
      {},
      { withCredentials: true }
    );
    setOrders(prev => prev.filter(o => o._id !== orderId));
  };

  /* ================= DELIVERED ================= */
  const markDelivered = async (orderId) => {
    await axios.post(
      `${API}/api/delivery/orders/${orderId}/delivered`,
      {},
      { withCredentials: true }
    );

    setOrders(prev => prev.filter(o => o._id !== orderId));
    fetchEarnings(); // ✅ backend-driven
  };

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
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Delivery <span className="text-orange-600">Dashboard</span>
          </h2>

          <button
            onClick={toggleOnline}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              online
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <Power className="w-4 h-4" />
            {online ? "Online" : "Offline"}
          </button>
        </div>

        {/* EARNINGS */}
        <motion.div
          className={`rounded-2xl p-5 flex justify-between ${
            dark ? "bg-slate-800" : "bg-white"
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

        {/* ORDERS */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-600" />
            Active Orders
          </h3>

          {orders.length === 0 ? (
            <p className="text-sm text-center text-gray-500">
              No active orders 🚴‍♂️
            </p>
          ) : (
            orders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                onAccept={acceptOrder}
                onReject={rejectOrder}
                onDeliver={markDelivered}
                onView={() => setSelectedOrder(order)}
                dark={dark}
              />
            ))
          )}
        </div>

        {/* VIEW DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center">
            <div className="bg-white text-black rounded-2xl p-6 w-[90%] max-w-md">
              <h3 className="text-xl font-bold mb-3">Order Details</h3>

              <p><b>Name:</b> {selectedOrder.customerName}</p>
              <p><b>Phone:</b> {selectedOrder.customerPhone}</p>
              <p className="mb-3">
                <b>Address:</b> {selectedOrder.deliveryAddress}
              </p>

              <h4 className="font-semibold mb-2">Items</h4>
              {selectedOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm mb-1">
                  <span>{i.name} × {i.quantity}</span>
                  <span>₹{i.price * i.quantity}</span>
                </div>
              ))}

              <p className="font-bold mt-3">
                Total: ₹{selectedOrder.totalAmount}
              </p>

              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-4 w-full bg-black text-white py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

/* ================= ORDER CARD ================= */

function OrderCard({ order, onAccept, onReject, onDeliver, onView, dark }) {
  const isAssigned = order.orderStatus === "assigned";
const isAccepted = order.orderStatus === "out_for_delivery";


  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      order.deliveryAddress
    )}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      className={`rounded-2xl p-5 mb-4 ${
        dark ? "bg-slate-800 text-white" : "bg-white text-black"
      }`}
    >
      <p className="font-semibold text-lg">
        {order.customerName}
      </p>

      <p className="text-sm">📞 {order.customerPhone}</p>

      <p className="text-sm font-semibold text-orange-600 mt-1">
        ₹{order.totalAmount}
      </p>

      <div className="flex gap-2 mt-4 flex-wrap">
  <button
    onClick={onView}
    className="w-full bg-gray-200 text-black py-2 rounded-xl font-semibold"
  >
    View Details
  </button>

  {/* ✅ ASSIGNED → ACCEPT / REJECT */}
  {isAssigned && (
    <>
      <button
        onClick={() => onAccept(order._id)}
        className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold"
      >
        Accept
      </button>

      <button
        onClick={() => onReject(order._id)}
        className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold"
      >
        Reject
      </button>
    </>
  )}

  {/* ✅ ACCEPTED → TRACK / DELIVERED */}
  {isAccepted && (
    <>
      <button
        onClick={openMaps}
        className="flex-1 bg-yellow-500 text-black py-2 rounded-xl font-semibold"
      >
        📍 Track
      </button>

      <button
        onClick={() => onDeliver(order._id)}
        className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold"
      >
        Delivered
      </button>
    </>
  )}
</div>
    </motion.div>
  );
}
