import { NavLink } from "react-router-dom";
import { Home, Wallet, User, Bike } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const [activeCount, setActiveCount] = useState(1); // demo: active orders

  // 👉 later you can fetch from API
  useEffect(() => {
    // fetch("/api/delivery/active-count")...
    setActiveCount(2);
  }, []);

  const base =
    "flex flex-col items-center gap-1 text-xs font-medium transition";

  return (
    <nav
      className="
        fixed bottom-0 left-0 w-full z-50
        bg-white/90 backdrop-blur-xl
        border-t border-orange-100
        shadow-[0_-8px_30px_rgba(255,120,60,0.25)]
        flex justify-around items-end
        pt-3 pb-2
      "
    >
      {/* 🏠 Home */}
      <NavLink
        to="/delivery/dashboard"
        className={({ isActive }) =>
          `${base} ${
            isActive
              ? "text-orange-600"
              : "text-gray-400 hover:text-orange-500"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Home
              className={`w-6 h-6 ${
                isActive &&
                "text-orange-600 drop-shadow-[0_0_8px_rgba(255,120,60,0.8)]"
              }`}
            />
            <span>Home</span>
          </>
        )}
      </NavLink>

      {/* 💰 Earnings */}
      <NavLink
        to="/delivery/earnings"
        className={({ isActive }) =>
          `${base} ${
            isActive
              ? "text-orange-600"
              : "text-gray-400 hover:text-orange-500"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Wallet
              className={`w-6 h-6 ${
                isActive &&
                "text-orange-600 drop-shadow-[0_0_8px_rgba(255,120,60,0.8)]"
              }`}
            />
            <span>Earnings</span>
          </>
        )}
      </NavLink>

      {/* 🚀 Floating Orders Button */}
      <div className="-mt-8">
        <NavLink to="/delivery/orders">
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="
              relative w-16 h-16 rounded-full
              bg-gradient-to-r from-orange-600 to-red-600
              flex items-center justify-center
              shadow-[0_12px_30px_rgba(255,90,30,0.6)]
              border-4 border-white
            "
          >
            <Bike className="w-7 h-7 text-white" />

            {/* 🔴 Active Orders Badge */}
            {activeCount > 0 && (
              <span
                className="
                  absolute -top-1 -right-1
                  w-6 h-6 rounded-full
                  bg-yellow-400 text-red-900
                  text-xs font-bold
                  flex items-center justify-center
                  shadow
                "
              >
                {activeCount}
              </span>
            )}
          </motion.div>
        </NavLink>
      </div>

      {/* 👤 Profile */}
      <NavLink
        to="/delivery/profile"
        className={({ isActive }) =>
          `${base} ${
            isActive
              ? "text-orange-600"
              : "text-gray-400 hover:text-orange-500"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <User
              className={`w-6 h-6 ${
                isActive &&
                "text-orange-600 drop-shadow-[0_0_8px_rgba(255,120,60,0.8)]"
              }`}
            />
            <span>Profile</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}
