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

  const [cancelOrder, setCancelOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    const res = await axios.get(
      `${API}/api/delivery/orders/assigned`,
      { withCredentials: true }
    );
    setOrders(res.data.orders || []);
  };

  /* ================= FETCH EARNINGS ================= */
  const fetchEarnings = async () => {
    const res = await axios.get(
      `${API}/api/delivery/earnings`,
      { withCredentials: true }
    );
    setEarnings(res.data.todayEarnings || 0);
  };

  useEffect(() => {
    fetchOrders();
    fetchEarnings();
  }, []);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.on("order-assigned", order => {
      setOrders(prev => {
        if (prev.find(o => o._id === order._id)) return prev;
        return [order, ...prev];
      });
    });
    return () => socket.off("order-assigned");
  }, []);

  /* ================= ONLINE / OFFLINE ================= */
  const toggleOnline = async () => {
    const newStatus = online ? "offline" : "available";
    await axios.patch(
      `${API}/api/delivery/status`,
      { status: newStatus },
      { withCredentials: true }
    );
    setOnline(!online);
  };

  /* ================= ACTIONS ================= */
  const acceptOrder = async (id) => {
    await axios.post(`${API}/api/delivery/orders/${id}/accept`, {}, { withCredentials: true });
    fetchOrders();
  };

  const rejectOrder = async (id) => {
    await axios.post(`${API}/api/delivery/orders/${id}/reject`, {}, { withCredentials: true });
    setOrders(prev => prev.filter(o => o._id !== id));
  };

  const markDelivered = async (id) => {
    await axios.post(`${API}/api/delivery/orders/${id}/delivered`, {}, { withCredentials: true });
    setOrders(prev => prev.filter(o => o._id !== id));
    fetchEarnings();
  };

  const cancelAcceptedOrder = async () => {
    const finalReason = cancelReason === "Other" ? customReason.trim() : cancelReason;
    if (!finalReason) return alert("Please provide reason");

    await axios.post(
      `${API}/api/delivery/orders/${cancelOrder._id}/cancel`,
      { reason: finalReason },
      { withCredentials: true }
    );

    setOrders(prev => prev.filter(o => o._id !== cancelOrder._id));
    setCancelOrder(null);
    setCancelReason("");
    setCustomReason("");
  };

  return (
    <section className={`min-h-screen pt-6 pb-24 px-4 ${dark ? "bg-slate-900 text-white" : "bg-orange-50"}`}>
      <div className="max-w-md mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Delivery <span className="text-orange-600">Dashboard</span>
          </h2>

          <button
            onClick={toggleOnline}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              online ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
            }`}
          >
            <Power className="w-4 h-4" />
            {online ? "Online" : "Offline"}
          </button>
        </div>

        {/* EARNINGS */}
        <motion.div className={`rounded-2xl p-5 flex justify-between ${dark ? "bg-slate-800" : "bg-white"}`}>
          <div>
            <p className="text-sm text-gray-400">Today’s Earnings</p>
            <p className="text-2xl font-bold text-orange-600">₹{earnings}</p>
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
            <p className="text-center text-gray-500">No active orders 🚴‍♂️</p>
          ) : (
            orders.map(order => (
              <OrderCard
                key={order._id}
                order={order}
                dark={dark}
                onAccept={acceptOrder}
                onReject={rejectOrder}
                onDeliver={markDelivered}
                onCancel={setCancelOrder}
                onView={() => setSelectedOrder(order)}
              />
            ))
          )}
        </div>

        {/* VIEW DETAILS MODAL */}
        {selectedOrder && (
          <div
            className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              onClick={e => e.stopPropagation()}
              className="bg-white text-black rounded-2xl p-6 w-[90%] max-w-md"
            >
              <h3 className="text-xl font-bold mb-3">Order Details</h3>
              <p><b>Name:</b> {selectedOrder.customerName}</p>
              <p><b>Phone:</b> {selectedOrder.customerPhone}</p>
              <p><b>Address:</b> {selectedOrder.deliveryAddress}</p>

              <h4 className="font-semibold mt-3 mb-2">Items</h4>
              {selectedOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{i.name} × {i.quantity}</span>
                  <span>₹{i.price * i.quantity}</span>
                </div>
              ))}

              <p className="font-bold mt-3">Total: ₹{selectedOrder.totalAmount}</p>

              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-4 w-full bg-black text-white py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* CANCEL MODAL */}
        {cancelOrder && (
          <div className="fixed inset-0 z-[1001] bg-black/50 flex items-center justify-center">
            <div className="bg-white text-black rounded-2xl p-6 w-[90%] max-w-md">
              <h3 className="text-xl font-bold mb-3">Cancel Delivery</h3>

              <select
                className="w-full border rounded-lg p-2"
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
              >
                <option value="">Select reason</option>
                <option value="Vehicle issue">Vehicle issue</option>
                <option value="Medical emergency">Medical emergency</option>
                <option value="Customer unreachable">Customer unreachable</option>
                <option value="Traffic issue">Traffic issue</option>
                <option value="Other">Other</option>
              </select>

              {cancelReason === "Other" && (
                <textarea
                  className="w-full border rounded-lg p-2 mt-2"
                  placeholder="Enter reason"
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                />
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setCancelOrder(null)}
                  className="flex-1 bg-gray-200 py-2 rounded-xl"
                >
                  Close
                </button>

                <button
                  onClick={cancelAcceptedOrder}
                  className="flex-1 bg-red-600 text-white py-2 rounded-xl"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

/* ================= ORDER CARD ================= */

function OrderCard({ order, onAccept, onReject, onDeliver, onCancel, onView, dark }) {
  const isAssigned = order.orderStatus === "assigned";
  const isAccepted = order.orderStatus === "out_for_delivery";

  const openMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`,
      "_blank"
    );
  };

  return (
    <motion.div className={`rounded-2xl p-5 mb-4 ${dark ? "bg-slate-800" : "bg-white"}`}>
      <p className="font-semibold text-lg">{order.customerName}</p>
      <p className="text-sm">📞 {order.customerPhone}</p>
      <p className="text-sm font-semibold text-orange-600 mt-1">₹{order.totalAmount}</p>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button onClick={() => onView()} className="w-full bg-gray-200 py-2 rounded-xl font-semibold">
          View Details
        </button>

        {isAssigned && (
          <>
            <button onClick={() => onAccept(order._id)} className="flex-1 bg-green-600 text-white py-2 rounded-xl">
              Accept
            </button>
            <button onClick={() => onReject(order._id)} className="flex-1 bg-red-500 text-white py-2 rounded-xl">
              Reject
            </button>
          </>
        )}

        {isAccepted && (
          <>
            <button onClick={openMaps} className="flex-1 bg-yellow-500 py-2 rounded-xl">
              📍 Track
            </button>
            <button onClick={() => onDeliver(order._id)} className="flex-1 bg-blue-600 text-white py-2 rounded-xl">
              Delivered
            </button>
            <button onClick={() => onCancel(order)} className="w-full bg-red-600 text-white py-2 rounded-xl">
              Cancel Delivery
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
