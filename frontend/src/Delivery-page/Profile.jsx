import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  Bike,
  Star,
  Edit,
  LogOut,
  Moon,
  Sun,
  Lock
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/Themecontext.jsx";

const API = "http://localhost:3000";

export default function DeliveryProfile() {
  const navigate = useNavigate();
  const { dark, setDark } = useTheme();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicleNumber: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: ""
  });

  /* ================= INPUT CLASS (DARK SAFE) ================= */
  const inputClass = `
    w-full rounded-lg px-3 py-2 text-sm outline-none transition
    border
    ${dark
      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500"
      : "bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-orange-500"}
  `;

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    axios
      .get(`${API}/api/delivery/profile`, { withCredentials: true })
      .then(res => {
        const p = res.data.profile;

        setProfile(p);
        setForm({
          name: p.name || "",
          phone: p.phone || "",
          email: p.email || "",
          vehicleNumber: p.vehicleNumber || ""
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    await axios.put(
      `${API}/api/delivery/profile`,
      form,
      { withCredentials: true }
    );

    setProfile({ ...profile, ...form });
    setShowEdit(false);
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async () => {
    if (passwordForm.newPass !== passwordForm.confirm) {
      alert("Passwords do not match");
      return;
    }

    await axios.put(
      `${API}/api/delivery/change-password`,
      passwordForm,
      { withCredentials: true }
    );

    alert("Password updated");
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    setShowPassword(false);
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <section
      className={`min-h-screen pt-6 pb-24 px-4 ${
        dark
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-amber-50 to-red-50"
      }`}
    >
      <div className="max-w-md mx-auto space-y-6">

        {/* 🌙 DARK MODE */}
        <div className="flex justify-end">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-orange-100 text-orange-700 font-medium"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? "Light" : "Dark"}
          </button>
        </div>

        {/* 👤 PROFILE CARD */}
        <div className={`rounded-3xl shadow-xl p-6 text-center ${
          dark ? "bg-slate-800" : "bg-white/90"
        }`}>
          <div className="w-24 h-24 mx-auto mb-3 rounded-full
                          bg-orange-500 flex items-center justify-center
                          text-white text-3xl font-bold">
            {profile.name.charAt(0)}
          </div>

          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-sm text-gray-400">Delivery Partner</p>

          <div className="flex justify-center gap-1 mt-2 text-orange-600 font-semibold">
            <Star className="w-4 h-4 fill-orange-500" />
            {profile.rating || 4.5}
          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="mt-4 inline-flex items-center gap-2
                       px-4 py-2 rounded-full
                       bg-orange-100 text-orange-700"
          >
            <Edit size={16} /> Edit Profile
          </button>
        </div>

        {/* 📄 INFO */}
        <div className={`rounded-3xl p-6 shadow space-y-4 ${
          dark ? "bg-slate-800" : "bg-white/90"
        }`}>
          <InfoRow icon={Phone} label="Phone" value={profile.phone} />
          <InfoRow icon={Mail} label="Email" value={profile.email} />
          <InfoRow icon={Bike} label="Vehicle" value={profile.vehicleNumber} />
        </div>

        {/* 🔐 PASSWORD */}
        <button
          onClick={() => setShowPassword(true)}
          className="w-full flex items-center justify-center gap-2
                     py-3 rounded-xl bg-amber-500 text-white font-semibold"
        >
          <Lock size={18} /> Change Password
        </button>

        {/* 🚪 LOGOUT */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2
                     py-3 rounded-xl bg-red-500 text-white font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* ================= MODALS ================= */}
      <AnimatePresence>

        {/* EDIT PROFILE */}
        {showEdit && (
          <Modal
            title="Edit Profile"
            dark={dark}
            onClose={() => setShowEdit(false)}
          >
            <input
              className={inputClass}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
            />

            <input
              className={inputClass}
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone"
            />

            <input
              className={inputClass}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />

            <input
              className={inputClass}
              value={form.vehicleNumber}
              onChange={e =>
                setForm({ ...form, vehicleNumber: e.target.value })
              }
              placeholder="Vehicle Number"
            />

            <button
              onClick={saveProfile}
              className="w-full bg-orange-600 hover:bg-orange-700
                         text-white py-2 rounded-lg font-semibold transition"
            >
              Save Changes
            </button>
          </Modal>
        )}

        {/* CHANGE PASSWORD */}
        {showPassword && (
          <Modal
            title="Change Password"
            dark={dark}
            onClose={() => setShowPassword(false)}
          >
            <input
              type="password"
              className={inputClass}
              placeholder="Current Password"
              onChange={e =>
                setPasswordForm({ ...passwordForm, current: e.target.value })
              }
            />

            <input
              type="password"
              className={inputClass}
              placeholder="New Password"
              onChange={e =>
                setPasswordForm({ ...passwordForm, newPass: e.target.value })
              }
            />

            <input
              type="password"
              className={inputClass}
              placeholder="Confirm Password"
              onChange={e =>
                setPasswordForm({ ...passwordForm, confirm: e.target.value })
              }
            />

            <button
              onClick={changePassword}
              className="w-full bg-amber-600 hover:bg-amber-700
                         text-white py-2 rounded-lg font-semibold transition"
            >
              Update Password
            </button>
          </Modal>
        )}

      </AnimatePresence>
    </section>
  );
}

/* ================= HELPERS ================= */

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-orange-100
                      text-orange-600 flex items-center justify-center">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose, dark }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className={`rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl
          ${dark ? "bg-slate-800 text-white" : "bg-white text-gray-800"}
        `}
      >
        <h3 className="text-xl font-semibold text-orange-500">
          {title}
        </h3>

        {children}

        <button
          onClick={onClose}
          className={`w-full py-2 rounded-lg border transition
            ${
              dark
                ? "border-slate-600 text-gray-300 hover:bg-slate-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
