import { useNavigate } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/Themecontext.jsx";

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const { dark } = useTheme();

  const statusColor = {
    assigned: "bg-blue-500/20 text-blue-400",
    picked: "bg-yellow-500/20 text-yellow-400",
    onway: "bg-orange-500/20 text-orange-400",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/delivery/order/${order._id}`)}
      className={`
        rounded-2xl p-4 cursor-pointer transition border shadow-lg
        ${dark
          ? "bg-slate-800 border-slate-700 hover:border-orange-500"
          : "bg-white border-gray-200 hover:border-orange-400"}
      `}
    >
      {/* 🔝 Top */}
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-sm">
          Order #{order._id.slice(-6)}
        </p>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide
            ${statusColor[order.status] || "bg-gray-200 text-gray-600"}
          `}
        >
          {order.status}
        </span>
      </div>

      {/* 👤 Customer */}
      <p
        className={`text-sm font-medium mb-1 ${
          dark ? "text-slate-200" : "text-gray-800"
        }`}
      >
        {order.customer.name}
      </p>

      {/* 📍 Address */}
      <p
        className={`text-xs flex items-center gap-1 mb-2 ${
          dark ? "text-slate-400" : "text-gray-500"
        }`}
      >
        <MapPin size={14} className="text-orange-500" />
        {order.address.city}
      </p>

      {/* 📞 Phone */}
      <p
        className={`text-xs flex items-center gap-1 ${
          dark ? "text-slate-400" : "text-gray-500"
        }`}
      >
        <Phone size={13} className="text-orange-500" />
        {order.customer.phone}
      </p>

      {/* 💰 Bottom */}
      <div
        className={`flex justify-between items-center mt-4 pt-3 border-t ${
          dark ? "border-slate-700" : "border-gray-200"
        }`}
      >
        <span className="font-semibold text-orange-500">
          ₹{order.total}
        </span>

        {order.payment === "cod" ? (
          <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
            COD
          </span>
        ) : (
          <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
            PAID
          </span>
        )}
      </div>
    </motion.div>
  );
}
