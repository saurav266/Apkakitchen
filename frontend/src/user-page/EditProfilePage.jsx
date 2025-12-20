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

  const updateAddress = async (id, data) => {
    try {
      await axios.put(
        `http://localhost:3000/api/users/address/${id}`,
        data,
        { withCredentials: true }
      );
      fetchProfile();
    } catch {
      setMessage("Failed to update address");
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

    await fetchProfile(); // 🔥 REQUIRED
  } catch (error) {
    console.error("Failed to set current address", error);
  }
};


  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto p-6"
    >
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

      {/* ================= BASIC INFO ================= */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-2"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
          />

          <input
            className="border rounded-lg p-2"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
          />
        </div>

        <button
          onClick={updateProfile}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Save Profile
        </button>
      </div>

      {/* ================= ADD ADDRESS ================= */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Add Address</h3>

        <div className="grid md:grid-cols-2 gap-3">
          {["addressLine", "city", "state", "pincode"].map(field => (
            <input
              key={field}
              placeholder={field}
              value={newAddress[field]}
              onChange={e =>
                setNewAddress({ ...newAddress, [field]: e.target.value })
              }
              className="border rounded-lg p-2"
            />
          ))}
        </div>

        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={newAddress.isCurrent}
            onChange={e =>
              setNewAddress({ ...newAddress, isCurrent: e.target.checked })
            }
          />
          Set as current address
        </label>

        <button
          onClick={addAddress}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Add Address
        </button>
      </div>

      {/* ================= ADDRESS LIST ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Your Addresses</h3>

        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses added</p>
        ) : (
          addresses.map(addr => (
            <div key={addr._id} className="border rounded-xl p-4 mb-4">
              <p className="font-semibold">
                {addr.label} {addr.isCurrent && "⭐"}
              </p>
              <p>{addr.addressLine}</p>
              <p className="text-sm text-gray-600">
                {addr.city}, {addr.state} - {addr.pincode}
              </p>

              <div className="flex gap-4 mt-3">
                {!addr.isCurrent && (
                  <button
                    onClick={() => setCurrentAddress(addr._id)}
                    className="text-indigo-600 text-sm"
                  >
                    Set Current
                  </button>
                )}

                <button
                  onClick={() => deleteAddress(addr._id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {message && (
        <p className="mt-4 text-center text-green-600">{message}</p>
      )}
    </motion.div>
  );
}
