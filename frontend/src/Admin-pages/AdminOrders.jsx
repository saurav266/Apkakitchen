import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { socket } from "../socket";
const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const statusStyles = {
  placed: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
   const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);
 useEffect(() => {
  // 🔔 New order placed
  socket.on("new-order", (order) => {
    console.log("🔔 New order received:", order);
    setOrders((prev) => [order, ...prev]);
  });

  // ✅ Order accepted by delivery boy
  socket.on("order-accepted", ({ orderId }) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, orderStatus: "out_for_delivery" }
          : o
      )
    );
  });

  // ❌ Order rejected by delivery boy
  socket.on("order-rejected", ({ orderId }) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, orderStatus: "preparing", deliveryBoy: null }
          : o
      )
    );
  });

  // 📦 Order delivered
  socket.on("order-delivered", ({ orderId }) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, orderStatus: "delivered" }
          : o
      )
    );
  });

  return () => {
    socket.off("new-order");
    socket.off("order-accepted");
    socket.off("order-rejected");
    socket.off("order-delivered");
  };
}, []);



  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/all-orders`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (err) {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o._id.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "all" || o.orderStatus === status;

    return matchSearch && matchStatus;
  });

  if (loading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or order id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-sm"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-sm"
          >
            <option value="all">All Status</option>
            <option value="placed">Placed</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow border border-orange-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-orange-50/40">
                <td className="px-4 py-3 font-medium">
                  #{o._id.slice(-6)}
                </td>

                <td className="px-4 py-3">{o.customerName}</td>

                <td className="px-4 py-3">{o.customerPhone}</td>

                <td className="px-4 py-3 font-semibold text-orange-600">
                  ₹{o.totalAmount}
                </td>

                <td className="px-4 py-3">{o.paymentMethod}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[o.orderStatus]}`}
                  >
                    {o.orderStatus.replaceAll("_", " ")}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => navigate(`/admin/orders/${o._id}`)}
                    className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
