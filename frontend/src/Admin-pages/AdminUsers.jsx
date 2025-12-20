import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldOff,
  ShieldCheck,
  Trash2,
  Download,
  X,
  User,
  MapPin,
  Package
} from "lucide-react";

const PAGE_SIZE = 5;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [confirm, setConfirm] = useState(null); // {type, user}

  // 🔌 Dummy data
  useEffect(() => {
    setUsers([
      {
        _id: "1",
        name: "Rishu Kumari",
        email: "rishu@gmail.com",
        role: "user",
        verified: true,
        isActive: true,
        createdAt: "2025-01-10",
        addresses: [
          { label: "Home", city: "Ranchi", pincode: "834001" }
        ],
        orders: 5
      },
      {
        _id: "2",
        name: "Admin",
        email: "admin@apkakitchen.com",
        role: "admin",
        verified: true,
        isActive: true,
        createdAt: "2024-12-01",
        addresses: [],
        orders: 0
      },
      {
        _id: "3",
        name: "Delivery Boy",
        email: "delivery@apkakitchen.com",
        role: "delivery",
        verified: false,
        isActive: false,
        createdAt: "2025-01-18",
        addresses: [],
        orders: 12
      },
      // add more for pagination
      ...Array.from({ length: 8 }).map((_, i) => ({
        _id: `${i + 4}`,
        name: `User ${i + 4}`,
        email: `user${i + 4}@mail.com`,
        role: "user",
        verified: i % 2 === 0,
        isActive: true,
        createdAt: "2025-01-20",
        addresses: [],
        orders: Math.floor(Math.random() * 10)
      }))
    ]);
  }, []);

  // 🔎 Filters
  const filtered = users.filter((u) => {
    const s =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const r = role === "all" || u.role === role;
    return s && r;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // 📤 Export CSV
  const exportCSV = () => {
    const rows = [
      ["Name", "Email", "Role", "Verified", "Status", "Joined"],
      ...filtered.map((u) => [
        u.name,
        u.email,
        u.role,
        u.verified,
        u.isActive ? "Active" : "Blocked",
        u.createdAt
      ])
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  // 🔁 Assign role
  const changeRole = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, role: newRole } : u
      )
    );
  };

  // 🚫 Block / Delete
  const handleConfirm = () => {
    if (!confirm) return;
    const { type, user } = confirm;

    if (type === "block") {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isActive: !u.isActive } : u
        )
      );
    }
    if (type === "delete") {
      setUsers((prev) =>
        prev.filter((u) => u._id !== user._id)
      );
    }
    setConfirm(null);
  };

  return (
    <div className="p-6 md:p-10">
      {/* 🏷️ Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-600 text-sm">
            Manage all registered users
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white rounded-xl px-3 shadow border border-orange-100">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="px-2 py-2 text-sm outline-none"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 rounded-xl border border-orange-100 bg-white shadow text-sm"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="delivery">Delivery</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-sm shadow hover:bg-orange-700"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* 📊 Table */}
      <div className="bg-white rounded-3xl shadow border border-orange-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-orange-50">
            <tr>
              {[
                "Name",
                "Email",
                "Role",
                "Verified",
                "Status",
                "Joined",
                "Actions"
              ].map((h) => (
                <th key={h} className="text-left px-5 py-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((u, i) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-t hover:bg-orange-50/40"
              >
                <td
                  className="px-5 py-4 font-medium cursor-pointer text-orange-600"
                  onClick={() => setSelectedUser(u)}
                >
                  {u.name}
                </td>
                <td className="px-5 py-4">{u.email}</td>
                <td className="px-5 py-4">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      changeRole(u._id, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-center">
                  {u.verified ? "✅" : "❌"}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.isActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="px-5 py-4">{u.createdAt}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setConfirm({ type: "block", user: u })
                      }
                      className="text-orange-600"
                    >
                      {u.isActive ? (
                        <ShieldOff className="w-5 h-5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        setConfirm({ type: "delete", user: u })
                      }
                      className="text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-9 h-9 rounded-full ${
              page === i + 1
                ? "bg-orange-600 text-white"
                : "bg-white border"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* 🧾 Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed top-0 right-0 w-full md:w-[420px] h-full bg-white shadow-2xl z-50 p-6"
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <User /> {selectedUser.name}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedUser.email}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <MapPin /> Addresses
                </h4>
                {selectedUser.addresses.length ? (
                  selectedUser.addresses.map((a, i) => (
                    <p key={i} className="text-sm ml-6">
                      {a.label} - {a.city} ({a.pincode})
                    </p>
                  ))
                ) : (
                  <p className="text-sm ml-6 text-gray-500">
                    No addresses
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Package /> Orders
                </h4>
                <p className="text-sm ml-6">
                  Total Orders: {selectedUser.orders}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ⚠️ Confirm Modal */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center"
            >
              <h3 className="text-lg font-bold mb-3">
                Confirm {confirm.type}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {confirm.type}{" "}
                <b>{confirm.user.name}</b>?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setConfirm(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
