import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User } from "lucide-react";
import TomatoDrip from "./TomatoDrip";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navItem =
    "text-white/90 font-medium tracking-wide hover:text-yellow-200 transition";

  return (
    <header className="fixed top-0 left-0 w-full z-[200]">

      {/* SAUCE NAVBAR CONTAINER */}
      <div className="relative h-[120px]">

        {/* DRIP BACKGROUND */}
        <TomatoDrip />

        {/* NAV CONTENT (ON SAUCE) */}
        <div className="relative max-w-7xl mx-auto px-6 h-[90px] flex items-center justify-between">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer leading-none"
          >
            <div className="text-2xl font-bold text-white tracking-wide">
              Apka<span className="text-yellow-200">Kitchen(logo)</span>
            </div>
            <div className="text-[11px] tracking-widest text-white/70 uppercase">
              Indian Taste
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
            <button onClick={() => navigate("/cart")}>
              <ShoppingCart className="w-6 h-6 text-white hover:text-yellow-200" />
            </button>

            <button onClick={() => navigate("/profile")}>
              <User className="w-6 h-6 text-white hover:text-yellow-200" />
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/menu")}
              className="
                px-6 py-2 rounded-full
                bg-yellow-300 text-red-900
                font-semibold shadow-lg
              "
            >
              Order Now
            </motion.button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
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
            className="md:hidden bg-red-700 text-white px-6 py-6"
          >
            <div className="flex flex-col gap-6 text-center">
              {["Home", "Menu", "About", "Contact"].map((item) => (
                <NavLink
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium"
                >
                  {item}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
