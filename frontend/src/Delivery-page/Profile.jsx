import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Bike,
  Star,
  IndianRupee,
  Package,
  Edit,
  LogOut,
  Moon,
  Sun,
  Clock,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/Themecontext.jsx";
export default function DeliveryProfile() {
  const navigate = useNavigate();

  const { dark, setDark } = useTheme();

  const [profile, setProfile] = useState({
    name: "Amit Kumar",
    phone: "+91 98765 43210",
    email: "amit.delivery@apnakitchen.com",
    vehicle: "Bike - JH01 AB 1234",
    rating: 4.7,
    orders: 128,
    earnings: 8650,
  });

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const [form, setForm] = useState(profile);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [schedule, setSchedule] = useState({
    start: "09:00",
    end: "21:00",
  });

  const saveProfile = () => {
    setProfile(form);
    setShowEdit(false);
  };

  const changePassword = () => {
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert("Passwords do not match");
      return;
    }
    alert("Password changed (API later)");
    setShowPassword(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  return (
    <section
      className={`min-h-screen pt-6 pb-24 px-4 transition ${
        dark
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-amber-50 to-red-50"
      }`}
    >
      <div className="max-w-md mx-auto space-y-6">

        {/* 🌙 Dark Toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        {/* 👤 Header */}
        <div
          className={`rounded-3xl shadow-2xl p-6 text-center ${
            dark ? "bg-slate-800" : "bg-white/90 backdrop-blur"
          }`}
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profile.name.charAt(0)}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
          </div>

          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-gray-400">Delivery Partner</p>

          <div className="flex justify-center gap-2 mt-2 text-orange-600 font-semibold">
            <Star className="w-4 h-4 fill-orange-500" />
            {profile.rating}
          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium"
          >
            <Edit size={16} /> Edit Profile
          </button>
        </div>

        {/* 📊 Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard dark={dark} icon={Package} label="Orders" value={profile.orders} />
          <StatCard dark={dark} icon={IndianRupee} label="Earnings" value={`₹${profile.earnings}`} />
        </div>

        {/* 📄 Info */}
        <div
          className={`rounded-3xl shadow-xl p-6 space-y-4 ${
            dark ? "bg-slate-800" : "bg-white/90"
          }`}
        >
          <InfoRow icon={Phone} label="Phone" value={profile.phone} />
          <InfoRow icon={Mail} label="Email" value={profile.email} />
          <InfoRow icon={Bike} label="Vehicle" value={profile.vehicle} />
        </div>

        {/* 🕒 Schedule */}
        <button
          onClick={() => setShowSchedule(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow"
        >
          <Clock size={18} /> Availability Schedule
        </button>

        {/* 🔐 Change Password */}
        <button
          onClick={() => setShowPassword(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white font-semibold shadow"
        >
          <Lock size={18} /> Change Password
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold shadow-lg"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* ================= MODALS ================= */}
      <AnimatePresence>
        {showSchedule && (
          <Modal title="Availability Schedule" onClose={() => setShowSchedule(false)}>
            <div className="space-y-4">
              <input
                type="time"
                value={schedule.start}
                onChange={(e) => setSchedule({ ...schedule, start: e.target.value })}
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="time"
                value={schedule.end}
                onChange={(e) => setSchedule({ ...schedule, end: e.target.value })}
                className="w-full border p-2 rounded-lg"
              />
              <button
                onClick={() => setShowSchedule(false)}
                className="w-full bg-orange-600 text-white py-2 rounded-lg"
              >
                Save Schedule
              </button>
            </div>
          </Modal>
        )}

        {showPassword && (
          <Modal title="Change Password" onClose={() => setShowPassword(false)}>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                className="w-full border p-2 rounded-lg"
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="New password"
                className="w-full border p-2 rounded-lg"
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPass: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full border p-2 rounded-lg"
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
              />
              <button
                onClick={changePassword}
                className="w-full bg-amber-600 text-white py-2 rounded-lg"
              >
                Update Password
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ===== Helpers ===== */

function StatCard({ icon: Icon, label, value, dark }) {
  return (
    <div className={`rounded-2xl shadow-lg p-4 flex items-center gap-3 ${dark ? "bg-slate-800" : "bg-white/90"}`}>
      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
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
        className="bg-white rounded-2xl p-6 w-full max-w-sm"
      >
        <h3 className="text-xl font-semibold mb-4 text-orange-600">
          {title}
        </h3>
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full border py-2 rounded-lg"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
