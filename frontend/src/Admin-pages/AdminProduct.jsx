import React, { useState } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// 🧾 Initial menu demo data
const initialProducts = [
  {
    id: 1,
    name: "Mix Veg",
    category: "Indian Veg",
    type: "veg",
    price: 149,
    mrp: 209,
    image: "https://via.placeholder.com/80",
    desc: "Fresh seasonal vegetables cooked in rich Indian gravy."
  },
  {
    id: 2,
    name: "Dal Makhani",
    category: "Indian Veg",
    type: "veg",
    price: 149,
    mrp: 209,
    image: "https://via.placeholder.com/80",
    desc: "Slow cooked creamy black lentils with butter."
  },
  {
    id: 3,
    name: "Chicken Butter Masala",
    category: "Indian Non-Veg",
    type: "nonveg",
    price: 179,
    mrp: 251,
    image: "https://via.placeholder.com/80",
    desc: "Juicy chicken in buttery tomato gravy."
  },
];

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [activeCat, setActiveCat] = useState("All");
  const [type, setType] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const emptyForm = {
    name: "",
    category: "",
    type: "veg",
    price: "",
    mrp: "",
    image: "",
    desc: ""
  };

  const [form, setForm] = useState(emptyForm);

  const filtered = products.filter(p => {
    const catMatch = activeCat === "All" || p.category === activeCat;
    const typeMatch = type === "all" || p.type === type;
    return catMatch && typeMatch;
  });

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm(item);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category || !form.price) return;

    if (editItem) {
      setProducts(products.map(p => (p.id === editItem.id ? { ...editItem, ...form } : p)));
    } else {
      setProducts([...products, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6 md:p-10">
      {/* 🏷️ Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          <p className="text-gray-600">Add, edit & manage food items</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-orange-600 text-white shadow"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* 🎛️ Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={activeCat}
          onChange={(e) => setActiveCat(e.target.value)}
          className="px-4 py-2 rounded-xl border"
        >
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className="flex gap-2">
          {["all", "veg", "nonveg"].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-full ${
                type === t
                  ? t === "veg"
                    ? "bg-green-500 text-white"
                    : t === "nonveg"
                    ? "bg-red-500 text-white"
                    : "bg-orange-500 text-white"
                  : "bg-white border"
              }`}
            >
              {t === "all" ? "All" : t === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-gray-700">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Price</th>
              <th>MRP</th>
              <th>Description</th>
              <th className="text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id} className="border-t hover:bg-orange-50/50">
                <td className="p-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="font-medium">{item.name}</td>
                <td>{item.category}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.type === "veg"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.type}
                  </span>
                </td>
                <td>₹{item.price}</td>
                <td className="line-through text-gray-400">₹{item.mrp}</td>
                <td className="max-w-xs truncate text-gray-600">
                  {item.desc}
                </td>
                <td className="pr-6">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ➕ Add/Edit Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-2xl p-8 w-full max-w-lg"
            >
              <h2 className="text-xl font-bold mb-6">
                {editItem ? "Edit Product" : "Add Product"}
              </h2>

              <div className="space-y-4">
                <input
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border"
                />
                <input
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border"
                />
                <input
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border"
                />
                <textarea
                  placeholder="Description"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border"
                  />
                  <input
                    type="number"
                    placeholder="MRP"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border"
                  />
                </div>

                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border"
                >
                  <option value="veg">Veg</option>
                  <option value="nonveg">Non-Veg</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
