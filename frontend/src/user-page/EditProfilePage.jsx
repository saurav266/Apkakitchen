import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function EditProfilePage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isCurrent: false
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/users/profile",
        { withCredentials: true }
      );

      setForm({
        name: res.data.data.name,
        email: res.data.data.email
      });
      setAddresses(res.data.data.addresses || []);
      setLoading(false);
    } catch {
      setMessage("Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= PROFILE UPDATE ================= */

  const updateProfile = async () => {
    try {
      await axios.put(
        "http://localhost:3000/api/users/profile",
        form,
        { withCredentials: true }
      );
      setMessage("Profile updated successfully");
    } catch {
      setMessage("Profile update failed");
    }
  };

  /* ================= ADDRESS CRUD ================= */

  const addAddress = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/users/address",
        newAddress,
        { withCredentials: true }
      );

      setNewAddress({
        label: "Home",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        isCurrent: false
      });

      fetchProfile();
    } catch {
      setMessage("Failed to add address");
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm("Delete this address?")) return;

    await axios.delete(
      `http://localhost:3000/api/users/address/${id}`,
      { withCredentials: true }
    );
    fetchProfile();
  };

  const setCurrentAddress = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/users/address/${id}/set-current`,
        {},
        { withCredentials: true }
      );
      await fetchProfile();
    } catch (error) {
      console.error("Failed to set current address", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-24 text-gray-500">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 py-10"
    >
      {/* ================= HEADER ================= */}
      <div className="pt-5 relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-yellow-400 p-[2px] shadow-xl mb-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl px-6 py-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Edit Profile</h2>
          <p className="text-gray-600 mt-1">
            Keep your details up to date for faster checkout 🍽️
          </p>
        </div>
      </div>

      {/* ================= BASIC INFO ================= */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-6 mb-10">
        <h3 className="text-lg font-bold mb-5 border-b pb-2">
          Basic Information
        </h3>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
          />

          <input
            className="border rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={updateProfile}
          className="mt-6 px-8 py-3 rounded-full bg-yellow-300 text-red-900 font-semibold shadow-lg hover:bg-yellow-400 transition"
        >
          Save Profile
        </motion.button>
      </div>

      {/* ================= ADD ADDRESS ================= */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-6 mb-10">
        <h3 className="text-lg font-bold mb-5 border-b pb-2">
          Add New Address
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {["addressLine", "city", "state", "pincode"].map(field => (
            <input
              key={field}
              placeholder={field}
              value={newAddress[field]}
              onChange={e =>
                setNewAddress({ ...newAddress, [field]: e.target.value })
              }
              className="border rounded-xl p-3 focus:ring-2 focus:ring-yellow-400 outline-none"
            />
          ))}
        </div>

        <label className="flex items-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            checked={newAddress.isCurrent}
            onChange={e =>
              setNewAddress({ ...newAddress, isCurrent: e.target.checked })
            }
            className="accent-yellow-400"
          />
          Set as current delivery address
        </label>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addAddress}
          className="mt-6 px-8 py-3 rounded-full bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 transition"
        >
          Add Address
        </motion.button>
      </div>

      {/* ================= ADDRESS LIST ================= */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-5 border-b pb-2">
          Your Addresses
        </h3>

        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses added</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {addresses.map(addr => (
              <motion.div
                key={addr._id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`
                  rounded-2xl p-5 border
                  shadow-sm hover:shadow-md
                  transition
                  ${
                    addr.isCurrent
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-200 bg-white"
                  }
                `}
              >
                <p className="font-semibold text-gray-800 mb-1">
                  {addr.label} {addr.isCurrent && "⭐"}
                </p>
                <p className="text-gray-700">{addr.addressLine}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>

                <div className="flex gap-4 mt-4 text-sm">
                  {!addr.isCurrent && (
                    <button
                      onClick={() => setCurrentAddress(addr._id)}
                      className="text-yellow-600 font-medium hover:underline"
                    >
                      Set Current
                    </button>
                  )}

                  <button
                    onClick={() => deleteAddress(addr._id)}
                    className="text-red-600 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {message && (
        <p className="mt-6 text-center text-green-600 font-medium">
          {message}
        </p>
      )}
    </motion.div>
  );
}
