import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
const API_URL = "http://localhost:3000";
const CATEGORY_OPTIONS = [
  "thali",
  "biryani",
  "chinese",
  "indian",
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [activeCat, setActiveCat] = useState("All");
  const [type, setType] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products`, {
        withCredentials: true,
      });
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const emptyForm = {
    name: "",
    category: "veg",
    foodType: "veg",
    price: "",
    mrp: "",
    image: "",
    desc: "",
    preparationTime: 15,
    isAvailable: true,
  };

  const [form, setForm] = useState(emptyForm);

  const filtered = products.filter((p) => {
    const catMatch = activeCat === "All" || p.category === activeCat;
    const typeMatch =
      type === "all" ||
      p.foodType === (type === "nonveg" ? "non-veg" : type);
    return catMatch && typeMatch;
  });

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      foodType: item.foodType,
      price: item.finalPrice || item.price,
      mrp: item.price,
      image: item.image,
      desc: item.description || "",
      preparationTime: item.preparationTime || 15,
      isAvailable: item.isAvailable,
    });
    setOpen(true);
  };

  const handleSave = async () => {
  if (!form.name || !form.category || !form.price || !form.image) {
    toast.error("Please fill all required fields");
    return;
  }

  const discountPercentage =
    form.mrp && Number(form.mrp) > Number(form.price)
      ? Math.round(
          ((Number(form.mrp) - Number(form.price)) / Number(form.mrp)) * 100
        )
      : 0;

  const payload = {
    name: form.name,
    category: form.category,
    description: form.desc,
    price: Number(form.price),
    discountPercentage,
    image: form.image,
    foodType: form.foodType,
    preparationTime: Number(form.preparationTime),
    isAvailable: form.isAvailable,
  };

  console.log("Saving payload:", payload);

  try {
    if (editItem) {
      await axios.put(`${API_URL}/api/products/${editItem._id}`, payload, {
        withCredentials: true,
      });
      toast.success("Product updated 🎉");
    } else {
      await axios.post(`${API_URL}/api/products/add`, payload, {
        withCredentials: true,
      });
      toast.success("Product added 🍽️");
    }

    fetchProducts();
    setOpen(false);
  } catch (err) {
    const msg = err.response?.data?.message || "Save failed";
    toast.error(msg);
    console.error("Save error:", err.response || err);
  }
};


  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        withCredentials: true,
      });
      fetchProducts();
      toast.success("Deleted 🗑️");
    }
  };

  /* ================= BULK UPLOAD ================= */

  const handleBulkUpload = async () => {
    try {
      const list = JSON.parse(bulkText);

      if (!Array.isArray(list)) {
        toast.error("JSON must be an array");
        return;
      }

      await axios.post(
        `${API_URL}/api/products/bulk`,
        { products: list },
        { withCredentials: true }
      );

      toast.success("Bulk upload successful 🚀");
      setBulkText("");
      setBulkOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error("Invalid JSON or upload failed");
    }
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Menu Management
          </h1>
          <p className="text-gray-600">Add, edit & manage food items</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setBulkOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full border shadow"
          >
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-orange-600 text-white shadow"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* ================= TABLE (unchanged) ================= */}
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
      {filtered.map((item) => (
        <tr key={item._id} className="border-t hover:bg-orange-50/50">
          {/* Image */}
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

          {/* Name */}
          <td className="font-medium">{item.name}</td>

          {/* Category */}
          <td>{item.category}</td>

          {/* Type */}
          <td>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                item.foodType === "veg"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.foodType}
            </span>
          </td>

          {/* Price */}
          <td>₹{item.finalPrice || item.price}</td>

          {/* MRP */}
          <td className="line-through text-gray-400">₹{item.price}</td>

          {/* Description */}
          <td className="max-w-xs truncate text-gray-600">
            {item.description}
          </td>

          {/* Actions */}
          <td className="pr-6">
            <div className="flex justify-end gap-3">
              <button onClick={() => openEdit(item)}>
                <Pencil className="w-4 h-4 text-blue-600" />
              </button>
              <button onClick={() => handleDelete(item._id)}>
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </td>
        </tr>
      ))}

      {/* Empty state */}
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

      {/* ================= ADD / EDIT MODAL ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                {/* Image Preview */}
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl border"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}

                <input
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <input
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <textarea
                  placeholder="Description"
                  value={form.desc}
                  onChange={(e) =>
                    setForm({ ...form, desc: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl border"
                />

                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Selling Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border"
                  />
                  <input
                    type="number"
                    placeholder="MRP"
                    value={form.mrp}
                    onChange={(e) =>
                      setForm({ ...form, mrp: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border"
                  />
                </div>

                <select
                  value={form.foodType}
                  onChange={(e) =>
                    setForm({ ...form, foodType: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="vegan">Vegan</option>
                </select>

                <input
                  type="number"
                  placeholder="Preparation Time (mins)"
                  value={form.preparationTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preparationTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded-xl border"
                />

                {/* Availability Toggle */}
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        isAvailable: e.target.checked,
                      })
                    }
                    className="accent-orange-500"
                  />
                  Available for ordering
                </label>
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

      {/* ================= BULK MODAL ================= */}
      <AnimatePresence>
        {bulkOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 w-full max-w-lg"
            >
              <h2 className="text-xl font-bold mb-4">
                Bulk Upload Products
              </h2>

              <textarea
                rows={10}
                placeholder='Paste JSON array here...'
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border font-mono text-sm"
              />

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setBulkOpen(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkUpload}
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white"
                >
                  Upload
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
