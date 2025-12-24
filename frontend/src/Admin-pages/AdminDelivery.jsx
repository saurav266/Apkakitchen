import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function AdminDeliveryManagement() {
  const navigate = useNavigate(); // ✅ FIXED (INSIDE COMPONENT)

  const [boys, setBoys] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/admin/delivery-boys",
        { withCredentials: true }
      );
      setBoys(data.deliveryBoys || []);
    } catch (err) {
      console.error("Failed to load delivery boys", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD DELIVERY BOY ================= */

  const addDeliveryBoy = async (form) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/admin/Add-delivery-boy",
        form,
        { withCredentials: true }
      );

      setOtpToken(data.otpToken);
      setShowAddModal(false);
      setShowOtpModal(true);

    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  if (loading) {
    return <div className="p-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🚴 Delivery Management</h1>
          <p className="text-gray-600">Manage delivery partners</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} /> Add Delivery Boy
        </button>
      </div>

      {/* DELIVERY BOYS GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {boys.map((boy) => (
          <div
            key={boy._id}
            className="bg-white p-6 rounded-2xl shadow border"
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{boy.name}</h3>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {boy.status}
              </span>
            </div>

            <p className="flex gap-2 text-sm">
              <Phone size={14} /> {boy.phone}
            </p>

            <p className="flex gap-2 text-sm">
              <MapPin size={14} /> {boy.vehicleNumber}
            </p>

            {/* ✅ VIEW DETAILS BUTTON */}
            <button
              onClick={() => navigate(`/admin/delivery/${boy._id}`)}
              className="mt-4 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* ADD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <AddDeliveryBoyModal
            onClose={() => setShowAddModal(false)}
            onAdd={addDeliveryBoy}
          />
        )}
      </AnimatePresence>

      {/* OTP MODAL */}
      <AnimatePresence>
        {showOtpModal && (
          <VerifyOtpModal
            otpToken={otpToken}
            onClose={() => setShowOtpModal(false)}
            onVerified={fetchDeliveryBoys}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ======================================================
   ADD DELIVERY BOY MODAL
====================================================== */

function AddDeliveryBoyModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    aadhaarNumber: "",
    aadhaarLast4: "",
    vehicleNumber: ""
  });

  const submit = () => {
    if (Object.values(form).some(v => !v)) {
      alert("All fields are required");
      return;
    }
    onAdd(form);
  };

  return (
    <ModalWrapper>
      <h2 className="text-xl font-bold mb-4">Add Delivery Boy</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          className="w-full border p-2 rounded mb-3"
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ))}

      <div className="flex gap-3">
        <button
          onClick={submit}
          className="flex-1 bg-black text-white py-2 rounded"
        >
          Send OTP
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </ModalWrapper>
  );
}

/* ======================================================
   VERIFY OTP MODAL
====================================================== */

function VerifyOtpModal({ otpToken, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:3000/api/admin/verify-otp",
        { otp, otpToken },
        { withCredentials: true }
      );

      alert("Delivery boy verified & created ✅");
      onVerified();
      onClose();

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper>
      <h2 className="text-xl font-bold mb-3">Verify OTP</h2>

      <input
        placeholder="Enter 6-digit OTP"
        className="w-full border p-3 rounded mb-4 text-center tracking-widest"
        onChange={(e) => setOtp(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={verifyOtp}
          disabled={loading}
          className="flex-1 bg-black text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </ModalWrapper>
  );
}

/* ======================================================
   MODAL WRAPPER
====================================================== */

function ModalWrapper({ children }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="bg-white rounded-xl p-6 w-full max-w-md">
        {children}
      </motion.div>
    </motion.div>
  );
}