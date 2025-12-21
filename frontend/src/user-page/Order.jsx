import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        "/api/orders/my-orders",
        { withCredentials: true }
      );
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "active")
      return order.orderStatus !== "delivered";
    if (filter === "delivered")
      return order.orderStatus === "delivered";
    return true;
  });

  if (loading) return <Skeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6 space-y-6"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📦 My Orders</h1>

        <div className="flex gap-2">
          <FilterBtn label="All" active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterBtn label="Active" active={filter === "active"} onClick={() => setFilter("active")} />
          <FilterBtn label="Delivered" active={filter === "delivered"} onClick={() => setFilter("delivered")} />
        </div>
      </div>

      {/* ORDERS */}
      {filteredOrders.length === 0 && (
        <p className="text-gray-500">No orders found.</p>
      )}

      {filteredOrders.map(order => (
        <motion.div
          key={order._id}
          layout
          className="bg-white rounded-2xl shadow overflow-hidden"
        >
          {/* SUMMARY */}
          <div
            onClick={() =>
              setExpanded(expanded === order._id ? null : order._id)
            }
            className="p-6 cursor-pointer flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                Order #{order._id.slice(-6)}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <StatusBadge status={order.orderStatus} />
              <span className="font-bold">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* DETAILS */}
          <AnimatePresence>
            {expanded === order._id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 pb-6 space-y-4"
              >
                {/* TIMELINE */}
                <OrderTimeline status={order.orderStatus} />

                {/* ITEMS */}
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* META */}
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <p>Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                  <p>📍 {order.deliveryAddress}</p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-2">
                  {order.orderStatus === "delivered" && (
                    <ActionBtn text="Reorder" />
                  )}
                  {order.orderStatus !== "delivered" && (
                    <ActionBtn text="Track Order" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ================= COMPONENTS ================= */

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm font-semibold ${
        active ? "bg-black text-white" : "bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    placed: "bg-yellow-100 text-yellow-700",
    preparing: "bg-blue-100 text-blue-700",
    out_for_delivery: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
      {status.replaceAll("_", " ").toUpperCase()}
    </span>
  );
}

function OrderTimeline({ status }) {
  const steps = ["placed", "preparing", "out_for_delivery", "delivered"];

  return (
    <div className="flex justify-between items-center">
      {steps.map(step => (
        <div key={step} className="flex-1 text-center">
          <div
            className={`h-2 mx-1 rounded-full ${
              steps.indexOf(step) <= steps.indexOf(status)
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          />
          <p className="text-xs mt-1">
            {step.replaceAll("_", " ")}
          </p>
        </div>
      ))}
    </div>
  );
}

function ActionBtn({ text }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="bg-black text-white px-4 py-2 rounded-lg text-sm"
    >
      {text}
    </motion.button>
  );
}

/* ================= LOADING SKELETON ================= */

function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}
