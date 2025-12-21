import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User } from "lucide-react";
import TomatoDrip from "./TomatoDrip";
import logo from "../assets/logo/logo.png";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const navItem =
    "text-white/90 font-medium tracking-wide hover:text-yellow-200 transition";

  // 🔔 Sync cart count + shake
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
      setCartCount(total);

      // trigger shake
      setShake(true);
      setTimeout(() => setShake(false), 500);
    };

    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  // 👤 Login state from localStorage
  useEffect(() => {
    const checkLogin = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setIsLoggedIn(!!user);
    };
    checkLogin();
    window.addEventListener("authChanged", checkLogin);
    return () => window.removeEventListener("authChanged", checkLogin);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[200]">
      <div className="relative h-[120px]">
        <TomatoDrip />

        <div className="relative max-w-7xl mx-auto px-6 h-[90px] flex items-center justify-between">
          {/* LOGO */}
<div
  onClick={() => navigate("/")}
  className="cursor-pointer flex items-center"
>
  <div
    className="
      w-16 h-16 md:w-18 md:h-18
      rounded-full
      bg-white/90
      flex items-center justify-center
      shadow-[0_10px_25px_rgba(0,0,0,0.25)]
      border-2 border-yellow-300
      backdrop-blur
      hover:scale-105 transition
    "
  >
    <img
      src={logo}
      alt="Apna Kitchen Logo"
      className="h-12 md:h-14 w-auto object-contain"
    />
  </div>
</div>


          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-10">
            {["Home", "Menu", "About", "Contact"].map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={navItem}
              >
                {item}
              </NavLink>
            ))}
          </nav>

          {/* ICONS + CTA */}
          <div className="hidden md:flex items-center gap-6">

            {/* 🛒 CART ICON WITH SHAKE */}
            <motion.button
              onClick={() => navigate("/cart")}
              animate={
                shake
                  ? { rotate: [0, -15, 15, -10, 10, 0] }
                  : { rotate: 0 }
              }
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <ShoppingCart className="w-6 h-6 text-white hover:text-yellow-200 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow-300 text-red-900 text-xs font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* 👤 USER / LOGIN */}
            {isLoggedIn ? (
              <div className="relative group">
                <User className="w-6 h-6 text-white cursor-pointer hover:text-yellow-200" />
                <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg px-4 py-2 text-sm opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left hover:text-orange-600"
                  >
                    Profile
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left hover:text-orange-600 mt-1"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 text-white hover:text-yellow-200"
              >
                <User className="w-6 h-6" />
                <span className="text-sm">Login</span>
              </button>
            )}

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/menu")}
              className="px-6 py-2 rounded-full bg-yellow-300 text-red-900 font-semibold shadow-lg"
            >
              Order Now
            </motion.button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-red-700 text-white px-6 py-6 shadow-lg"
          >
            <div className="flex flex-col gap-6 text-center">
              {["Home", "Menu", "About", "Contact"].map((item) => (
                <NavLink
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium hover:text-yellow-200"
                >
                  {item}
                </NavLink>
              ))}

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/cart");
                }}
                className="flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                Cart ({cartCount})
              </button>

              {!isLoggedIn && (
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/login");
                  }}
                  className="font-semibold"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
