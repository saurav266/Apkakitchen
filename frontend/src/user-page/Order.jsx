import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ⭐ REVIEW STATES
  const [reviewData, setReviewData] = useState(null); // { orderId, productId }
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/users/my-orders`,
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
      return !["delivered", "cancelled"].includes(order.orderStatus);
    if (filter === "delivered")
      return order.orderStatus === "delivered";
    return true;
  });

  if (loading) return <Skeleton />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 py-10 space-y-8"
      >
        {/* HEADER */}
        <div className="pt-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-yellow-400 p-[2px] shadow-xl">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800">📦 My Orders</h1>

            <div className="flex gap-2">
              <FilterBtn label="All" active={filter === "all"} onClick={() => setFilter("all")} />
              <FilterBtn label="Active" active={filter === "active"} onClick={() => setFilter("active")} />
              <FilterBtn label="Delivered" active={filter === "delivered"} onClick={() => setFilter("delivered")} />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <p className="text-gray-500 text-center">No orders found.</p>
        )}

        {/* ORDERS */}
        {filteredOrders.map(order => (
          <motion.div
            key={order._id}
            layout
            whileHover={{ y: -4 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden border border-white/40"
          >
            {/* SUMMARY */}
            <div
              onClick={() =>
                setExpanded(expanded === order._id ? null : order._id)
              }
              className="p-6 cursor-pointer flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <StatusBadge status={order.orderStatus} />
                <span className="font-bold text-red-600">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>

            {/* DETAILS */}
            <AnimatePresence>
              {expanded === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 space-y-5"
                >
                  <OrderTimeline status={order.orderStatus} />

                  {/* ITEMS */}
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm text-gray-700"
                      >
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>

           {order.orderStatus === "delivered" && (
  <ActionBtn
    text="Add Review"
    variant="outline"
    onClick={() => {
      if (!item.productId) {
        alert("Product not available for review");
        return;
      }

      setReviewData({
        orderId: order._id,
        productId: item.productId   // ✅ FIXED
      });
    }}
  />
)}



                      </div>
                    ))}
                  </div>

                  {/* META */}
                  <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <p>💳 {order.paymentMethod} ({order.paymentStatus})</p>
                    <p>📍 {order.deliveryAddress}</p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-3 pt-2 flex-wrap">
                    <ActionBtn
                      text="View Details"
                      variant="outline"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    />

                    {!["delivered", "cancelled"].includes(order.orderStatus) && (
                      <ActionBtn
                        text="Track Order"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      />
                    )}

                    {order.orderStatus === "delivered" && (
                      <ActionBtn text="Reorder" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      {/* ⭐ REVIEW MODAL */}
      <AnimatePresence>
        {reviewData && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md"
            >
              <h3 className="text-xl font-bold mb-3">Rate Product</h3>

              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    className={`text-2xl ${
                      i <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full border rounded-xl p-3 mb-4"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setReviewData(null)}
                  className="flex-1 bg-gray-200 py-2 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
await axios.post(
  `${API}/api/reviews/${reviewData.productId}/review`,
  {
    rating: Number(rating),   // ✅ force number
    comment,
    orderId: reviewData.orderId
  },
  { withCredentials: true }
);


alert("Review submitted");
setReviewData(null);
setRating(5);
setComment("");

                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-xl"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ================= COMPONENTS ================= */

function ActionBtn({ text, onClick, variant = "solid" }) {
  const styles =
    variant === "outline"
      ? "border border-red-600 text-red-600 bg-white hover:bg-red-50"
      : "bg-red-600 text-white hover:bg-red-700";

  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-5 py-2 rounded-full text-sm font-semibold shadow transition ${styles}`}
    >
      {text}
    </motion.button>
  );
}

function StatusBadge({ status }) {
  const map = {
    placed: "bg-yellow-100 text-yellow-800",
    preparing: "bg-orange-100 text-orange-700",
    assigned: "bg-blue-100 text-blue-700",
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
  const steps = ["placed","preparing","assigned","out_for_delivery","delivered"];
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex justify-between">
      {steps.map((step, i) => (
        <div key={step} className="flex-1 text-center">
          <div className={`h-2 mx-1 rounded-full ${i <= currentIndex ? "bg-yellow-400" : "bg-gray-300"}`} />
          <p className="text-xs mt-1 capitalize">{step.replaceAll("_"," ")}</p>
        </div>
      ))}
    </div>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
        active ? "bg-yellow-300 text-red-900 shadow" : "bg-white text-gray-600 border"
      }`}
    >
      {label}
    </button>
  );
}

function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-5">
      {[1,2,3].map(i => (
        <div key={i} className="h-28 bg-orange-100 rounded-3xl animate-pulse" />
      ))}
    </div>
  );
}
