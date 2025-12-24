// pages/DeliveredOrders.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Package } from "lucide-react";
import { useTheme } from "../context/Themecontext.jsx";

const API = "http://localhost:3000";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  });

export default function DeliveredOrders() {
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("today");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (selectedFilter) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/api/delivery/orders/delivered?filter=${selectedFilter}`,
        { withCredentials: true }
      );
      setOrders(res.data.orders || []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(filter);
  }, [filter]);

  return (
    <section
      className={`min-h-screen p-4 ${
        dark ? "bg-slate-900 text-white" : "bg-orange-50"
      }`}
    >
      <div className="max-w-md mx-auto space-y-4">

        {/* HEADER */}
        <h2 className="text-xl font-bold">
          Delivered <span className="text-orange-600">Orders</span>
        </h2>

        {/* FILTER BUTTONS */}
        <div className="flex gap-2">
          {["today", "week", "month"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition
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

        {/* CONTENT */}
        {loading ? (
          <p className="text-center text-sm text-gray-400">
            Loading delivered orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-400">
            No delivered orders
          </p>
        ) : (
          orders.map(order => (
            <div
              key={order._id}
              className={`rounded-xl p-4 shadow ${
                dark ? "bg-slate-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
  <p className="font-bold text-orange-600">
    ₹{order.totalAmount}
  </p>

  <p className="text-xs text-gray-400">
    {formatDate(order.updatedAt)}
  </p>

  <p className="text-xs text-gray-400">
    {formatTime(order.updatedAt)}
  </p>

  <span className="inline-block text-xs px-2 py-0.5
                   bg-green-100 text-green-700 rounded-full font-semibold">
    DELIVERED
  </span>
</div>

              </div>

              <button
                onClick={() =>
                  navigate(`/delivery/orders/${order._id}`)
                }
                className="mt-3 w-full py-2 rounded-xl bg-orange-600 text-white font-semibold"
              >
                View Order Details
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
