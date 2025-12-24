import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, CreditCard, Banknote } from "lucide-react";
import axios from "axios";

const API =import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Contact & address fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [payment, setPayment] = useState("cod");

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedSavedId, setSelectedSavedId] = useState("");

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    if (c.length === 0) navigate("/cart");
    setCart(c);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) setName(user.name);

    fetchSavedAddresses();
  }, [navigate]);

  /* ================= FETCH SAVED ADDRESSES ================= */

  const fetchSavedAddresses = async () => {
    try {
      const res = await axios.get(`${API}/api/users/profile`, {
        withCredentials: true,
      });
      const list = res.data.data.addresses || [];
      setSavedAddresses(list);

      const current = list.find((a) => a.isCurrent);
      if (current) {
        setSelectedSavedId(current._id);
        fillFromSaved(current);
      }
    } catch {
      console.error("Failed to fetch saved addresses");
    }
  };

  const fillFromSaved = (addr) => {
    setName(addr.name || "");
    setPhone(addr.phone || "");
    setAddressLine(addr.addressLine || "");
    setCity(addr.city || "");
    setState(addr.state || "");
    setPincode(addr.pincode || "");
  };

  /* ================= CURRENT LOCATION ================= */

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const addr = res.data.address || {};
        setAddressLine(
          addr.road || addr.neighbourhood || addr.suburb || ""
        );
        setCity(addr.city || addr.town || "");
        setState(addr.state || "");
        setPincode(addr.postcode || "");
      } catch {
        alert("Failed to auto-fill location");
      }
    });
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal > 0 ? 40 : 0;
  const total = subtotal + delivery;

  /* ================= PLACE ORDER ================= */

  const placeOrder = async () => {
  if (!name || !phone || !addressLine || !city || !state || !pincode) {
    alert("Please fill complete address");
    return;
  }

  setLoading(true);
  try {
    await axios.post(
      `${API}/api/order/create`,
      {
        customerName: name,          // ✅ MATCHES SCHEMA
        customerPhone: phone,        // ✅ MATCHES SCHEMA
        items: cart.map(i => ({
          productId: i._id,
          name: i.name,
          quantity: i.qty,
          price: i.price
        })),
        totalAmount: total,
        paymentMethod: payment === "cod" ? "COD" : "Online",
        deliveryAddress: `${addressLine}, ${city}, ${state} - ${pincode}`
      },
      { withCredentials: true }
    );

    localStorage.removeItem("cart");
    navigate("/orders/success");
  } catch (err) {
    alert(err.response?.data?.message || "Order failed");
  } finally {
    setLoading(false);
  }
};



  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

        {/* 📝 LEFT: ADDRESS + PAYMENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6">
            Delivery <span className="text-orange-600">Details</span>
          </h2>

          {/* 🔽 Saved addresses */}
          {savedAddresses.length > 0 && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600">
                Select Saved Address
              </label>
              <select
                value={selectedSavedId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedSavedId(id);
                  const addr = savedAddresses.find((a) => a._id === id);
                  if (addr) fillFromSaved(addr);
                }}
                className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Choose address --</option>
                {savedAddresses.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.label} - {a.addressLine}, {a.city}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 📍 Use current location */}
          <button
            type="button"
            onClick={useCurrentLocation}
            className="mb-6 text-sm text-orange-600 hover:underline flex items-center gap-1"
          >
            <MapPin size={16} /> Use my current location
          </button>

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500"
              placeholder="Your name"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Phone size={16} /> Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500"
              placeholder="10-digit number"
            />
          </div>

          {/* Address Line */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600">
              Address (House no, Street, Area)
            </label>
            <textarea
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              rows={2}
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                City
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                State
              </label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Pincode */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600">
              Pincode
            </label>
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* 💳 Payment */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Payment Method</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPayment("cod")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                  payment === "cod"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <Banknote className="text-orange-500" />
                Cash on Delivery
              </button>

              <button
                onClick={() => setPayment("online")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                  payment === "online"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <CreditCard className="text-orange-500" />
                Pay Online
              </button>
            </div>
          </div>

          {/* Place Order */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={placeOrder}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-lg shadow-lg disabled:opacity-70"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </motion.button>
        </motion.div>

        {/* 🛒 RIGHT: SUMMARY */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6">
            Order <span className="text-orange-600">Summary</span>
          </h3>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
            {cart.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || "/food-placeholder.png"}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shadow"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.qty}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>₹{delivery}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-orange-600">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
