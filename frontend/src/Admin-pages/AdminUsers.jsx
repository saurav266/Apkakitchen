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

const PAGE_SIZE = 6;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:3000/api/admin/all-users",
        { credentials: "include" }
      );
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= FILTER + PAGINATION ================= */

  const filtered = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= EXPORT CSV ================= */

  const exportCSV = () => {
    const csv = [
      ["Name", "Email", "Orders", "Spent", "Status"],
      ...filtered.map(u => [
        u.name,
        u.email,
        u.ordersCount || 0,
        u.totalSpent || 0,
        u.isActive ? "Active" : "Blocked"
      ])
    ]
      .map(r => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
  };

  /* ================= BLOCK / DELETE ================= */

  const handleConfirm = async () => {
    if (!confirm) return;

    try {
      if (confirm.type === "block") {
        await fetch(
          `http://localhost:3000/api/admin/users/${confirm.user._id}/toggle`,
          { method: "PATCH", credentials: "include" }
        );
      }

      if (confirm.type === "delete") {
        await fetch(
          `http://localhost:3000/api/admin/users/${confirm.user._id}`,
          { method: "DELETE", credentials: "include" }
        );
      }

      setConfirm(null);
      fetchUsers();
    } catch {
      alert("Action failed");
    }
  };

  if (loading) {
    return <div className="p-10 text-gray-500">Loading users...</div>;
  }

  return (
    <div className="p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-600 text-sm">
            All registered users overview
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center border rounded px-3">
            <Search size={16} />
            <input
              placeholder="Search user..."
              className="px-2 py-2 outline-none text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-orange-50">
            <tr>
              {["Name", "Email", "Orders", "Spent", "Status", "Actions"].map(h => (
                <th key={h} className="px-5 py-4 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.map(u => (
              <tr key={u._id} className="border-t hover:bg-orange-50">
                <td
                  className="px-5 py-4 text-orange-600 cursor-pointer font-medium"
                  onClick={() => setSelectedUser(u)}
                >
                  {u.name}
                </td>
                <td className="px-5 py-4">{u.email}</td>
                <td className="px-5 py-4">{u.ordersCount || 0}</td>
                <td className="px-5 py-4">₹{u.totalSpent || 0}</td>
                <td className="px-5 py-4">
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
                <td className="px-5 py-4 flex gap-3">
                  <button
                    onClick={() =>
                      setConfirm({ type: "block", user: u })
                    }
                  >
                    {u.isActive ? <ShieldOff /> : <ShieldCheck />}
                  </button>

                  <button
                    onClick={() =>
                      setConfirm({ type: "delete", user: u })
                    }
                  >
                    <Trash2 className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-8 h-8 rounded ${
              page === i + 1
                ? "bg-orange-600 text-white"
                : "border"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* USER DETAILS DRAWER */}
      <AnimatePresence>
        {selectedUser && (
          <UserDetailsDrawer
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            confirm={confirm}
            onCancel={() => setConfirm(null)}
            onConfirm={handleConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ======================================================
   USER DETAILS DRAWER
====================================================== */

function UserDetailsDrawer({ user, onClose }) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-2xl z-50 p-6 overflow-y-auto"
    >
      <button onClick={onClose} className="absolute top-4 right-4">
        <X />
      </button>

      <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
        <User /> {user.name}
      </h2>
      <p className="text-sm text-gray-600">{user.email}</p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard title="Orders" value={user.ordersCount || 0} />
        <StatCard title="Spent" value={`₹${user.totalSpent || 0}`} />
      </div>

      <div className="mt-8">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <MapPin size={16} /> Addresses
        </h3>
        {user.addresses?.length ? (
          user.addresses.map((a, i) => (
            <div key={i} className="border rounded p-3 mb-2 text-sm">
              <p className="font-medium">{a.label}</p>
              <p className="text-gray-600">
                {a.addressLine}, {a.city}, {a.state} - {a.pincode}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No addresses</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Package size={16} /> Orders
        </h3>
        {user.orders?.length ? (
          user.orders.slice(0, 5).map(o => (
            <div key={o._id} className="border rounded p-3 mb-2 text-sm">
              <p><b>Order:</b> #{o._id.slice(-6)}</p>
              <p><b>Amount:</b> ₹{o.totalAmount}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No orders</p>
        )}
      </div>
    </motion.div>
  );
}

/* ======================================================
   SUPPORT COMPONENTS
====================================================== */

function StatCard({ title, value }) {
  return (
    <div className="bg-orange-50 border rounded-xl p-4 text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-xl font-bold text-orange-600">{value}</p>
    </div>
  );
}

function ConfirmModal({ confirm, onCancel, onConfirm }) {
  return (
    <motion.div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center">
        <p className="mb-6">
          Confirm <b>{confirm.type}</b> for{" "}
          <b>{confirm.user.name}</b>?
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
