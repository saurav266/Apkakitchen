import { useState } from "react";
import { Search, Eye } from "lucide-react";

const dummyOrders = [
  {
    id: "ORD001",
    customer: "Ravi Kumar",
    phone: "9876543210",
    amount: 549,
    status: "placed",
    payment: "COD",
    date: "2025-12-18",
  },
  {
    id: "ORD002",
    customer: "Anita Sharma",
    phone: "9123456780",
    amount: 349,
    status: "preparing",
    payment: "Online",
    date: "2025-12-18",
  },
  {
    id: "ORD003",
    customer: "Mohit Verma",
    phone: "9000011111",
    amount: 799,
    status: "out_for_delivery",
    payment: "Online",
    date: "2025-12-18",
  },
  {
    id: "ORD004",
    customer: "Priya Singh",
    phone: "9888877777",
    amount: 299,
    status: "delivered",
    payment: "COD",
    date: "2025-12-17",
  },
  {
    id: "ORD005",
    customer: "Aman Yadav",
    phone: "9555566666",
    amount: 199,
    status: "cancelled",
    payment: "Online",
    date: "2025-12-17",
  },
];

const statusStyles = {
  placed: "bg-blue-100 text-blue-700",
  preparing: "bg-yellow-100 text-yellow-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filteredOrders = dummyOrders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "all" || o.status === status;

    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      {/* 🧾 Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

        <div className="flex gap-3 flex-col sm:flex-row">
          {/* 🔍 Search */}
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

          {/* 🎯 Filter */}
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

      {/* 📊 Table */}
      <div className="bg-white rounded-2xl shadow border border-orange-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-orange-50 text-gray-700">
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
                <td
                  colSpan="8"
                  className="text-center py-8 text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t hover:bg-orange-50/40 transition"
                >
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3">{o.phone}</td>
                  <td className="px-4 py-3 font-semibold text-orange-600">
                    ₹{o.amount}
                  </td>
                  <td className="px-4 py-3">{o.payment}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[o.status]}`}
                    >
                      {o.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">{o.date}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition">
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
