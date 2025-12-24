import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Package,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../context/Themecontext.jsx";

const API = "http://localhost:3000";
const steps = ["assigned", "picked", "onway", "delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API}/api/delivery/orders/${id}`, {
        withCredentials: true,
      });
      setOrder(res.data.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      await axios.patch(
        `${API}/api/delivery/orders/${id}/status`,
        { status },
        { withCredentials: true }
      );
      fetchOrder();
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          dark ? "bg-slate-900 text-orange-400" : "bg-orange-50 text-orange-600"
        }`}
      >
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          dark ? "bg-slate-900 text-white" : "bg-orange-50 text-gray-700"
        }`}
      >
        <p>No order found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 rounded-xl bg-orange-600 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const currentIndex = steps.indexOf(order.status);
  const nextStatus = steps[currentIndex + 1];

  return (
    <section
      className={`min-h-screen pb-24 px-4 pt-6 ${
        dark
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 text-gray-800"
      }`}
    >
      <div className="max-w-md mx-auto space-y-6">

        {/* 🔙 Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full shadow ${
              dark
                ? "bg-slate-800 text-orange-400"
                : "bg-white text-orange-600"
            }`}
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold">
            Order <span className="text-orange-600">Details</span>
          </h2>
        </div>

        {/* 📦 Order Card */}
        <div
          className={`rounded-3xl p-6 shadow-xl border ${
            dark
              ? "bg-slate-800 border-slate-700"
              : "bg-white/90 backdrop-blur border-orange-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-3 text-orange-500">
            <Package size={18} />
            <p className="text-sm font-semibold">
              Order #{order._id.slice(-6)}
            </p>
          </div>

          {/* 👤 Customer */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <p className="font-semibold">{order.customer.name}</p>
              <p className="text-sm text-gray-400">
                {order.customer.phone}
              </p>
            </div>
          </div>

          {/* 📍 Address */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mt-1">
              <MapPin size={18} />
            </div>
            <p className="text-sm text-gray-400">
              {order.address.addressLine}, {order.address.city},{" "}
              {order.address.state} - {order.address.pincode}
            </p>
          </div>

          {/* 🧾 Items */}
          <div className="border-t border-gray-200/20 pt-3 space-y-2 text-sm">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold mt-3 text-orange-600">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        {/* 🚚 Progress */}
        <div
          className={`rounded-3xl p-6 shadow-xl border ${
            dark
              ? "bg-slate-800 border-slate-700"
              : "bg-white/90 backdrop-blur border-orange-100"
          }`}
        >
          <h3 className="font-semibold mb-4">
            Delivery <span className="text-orange-600">Progress</span>
          </h3>

          <div className="flex justify-between mb-5">
            {steps.map((s, i) => {
              const done = i <= currentIndex;
              return (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      done
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                        : dark
                        ? "bg-slate-700 text-gray-400"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {done ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <p className="text-[10px] mt-1 capitalize">{s}</p>
                </div>
              );
            })}
          </div>

          {nextStatus ? (
            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={updating}
              onClick={() => updateStatus(nextStatus)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg disabled:opacity-60"
            >
              {updating ? "Updating..." : `Mark as ${nextStatus}`}
            </motion.button>
          ) : (
            <div className="text-center font-semibold text-green-500">
              🎉 Delivered Successfully
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
