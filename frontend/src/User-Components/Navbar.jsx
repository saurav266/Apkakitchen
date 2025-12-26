import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo
} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  UserCircle
} from "lucide-react";
import TomatoDrip from "./TomatoDrip";
import logo from "../assets/logo/logo.webp";
import { useAuth } from "../context/AuthContext.jsx";

/* ================= STATIC DATA ================= */
const navItems = ["Home", "Menu", "About", "Contact"];

const Navbar = memo(function Navbar() {
  const [open, setOpen] = useState(false);       // mobile nav
  const [userOpen, setUserOpen] = useState(false); // mobile user dropdown
  const [cartCount, setCartCount] = useState(0);
  const [shake, setShake] = useState(false);

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const navItem = useMemo(
    () =>
      "text-white/90 font-medium tracking-wide hover:text-yellow-200 transition",
    []
  );

  /* ================= CART SYNC ================= */
  useEffect(() => {
    let timeout;

    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = cart.reduce((sum, i) => sum + (i.qty || 0), 0);

      setCartCount(prev => {
        if (prev !== total) {
          setShake(true);
          timeout = setTimeout(() => setShake(false), 400);
          return total;
        }
        return prev;
      });
    };

    updateCount();
    window.addEventListener("cartUpdated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("cartUpdated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  /* ================= NAVIGATION ================= */
  const goHome = useCallback(() => navigate("/"), [navigate]);
  const goCart = useCallback(() => navigate("/cart"), [navigate]);
  const goMenu = useCallback(() => navigate("/menu"), [navigate]);
  const goLogin = useCallback(() => navigate("/login"), [navigate]);
  const goProfile = useCallback(() => navigate("/profile"), [navigate]);
  const goOrders = useCallback(() => navigate("/order"), [navigate]);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [logout, navigate]);

  if (loading) return null;

  return (
    <header className="fixed top-0 left-0 w-full z-[200]">
      <div className="relative h-[120px]">
        <TomatoDrip />

        <div className="relative max-w-7xl mx-auto px-6 h-[90px] flex items-center justify-between">
          {/* LOGO */}
          <div onClick={goHome} className="cursor-pointer flex items-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.25)] border-2 border-yellow-300 backdrop-blur hover:scale-105 transition">
              <img
                src={logo}
                alt="Apna Kitchen Logo"
                loading="eager"
                decoding="async"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map(item => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={navItem}
              >
                {item}
              </NavLink>
            ))}
          </nav>

          {/* DESKTOP RIGHT */}
          <div className="hidden md:flex items-center gap-6">
            {/* CART */}
            <motion.button
              onClick={goCart}
              animate={
                shake
                  ? { rotate: [0, -15, 15, -10, 10, 0] }
                  : { rotate: 0 }
              }
              transition={{ duration: 0.45 }}
              className="relative"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-300 text-red-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* USER (DESKTOP – HOVER) */}
            {user ? (
              <div className="relative group">
                <User className="w-6 h-6 text-white cursor-pointer" />

                <div
                  className="
                    absolute right-0 mt-3
                    min-w-[180px]
                    rounded-2xl
                    bg-white/90 backdrop-blur-xl
                    shadow-[0_20px_40px_rgba(0,0,0,0.25)]
                    border border-white/40
                    z-[999]
                    opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible
                    transition-all
                  "
                >
                  <button
                    onClick={goProfile}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-100 rounded-t-2xl transition"
                  >
                    <UserCircle className="w-4 h-4 text-red-700" />
                    Profile
                  </button>

                  <button
                    onClick={goOrders}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-100 transition"
                  >
                    <Package className="w-4 h-4 text-red-700" />
                    My Orders
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-2xl transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={goLogin} className="flex items-center gap-2 text-white">
                <User className="w-6 h-6" />
                <span className="text-sm">Login</span>
              </button>
            )}

            {/* ORDER NOW */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goMenu}
              className="px-6 py-2 rounded-full bg-yellow-300 text-red-900 font-semibold shadow-lg"
            >
              Order Now
            </motion.button>
          </div>

          {/* MOBILE ICONS */}
          <div className="flex md:hidden items-center gap-4">
            {/* CART */}
            <button onClick={goCart} className="relative text-white">
              <ShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 text-red-900 text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* USER (MOBILE – CLICK) */}
            {user && (
              <button
                onClick={() => setUserOpen(o => !o)}
                className="text-white"
              >
                <User />
              </button>
            )}

            {/* MENU TOGGLE */}
            <button
              onClick={() => setOpen(o => !o)}
              className="text-white text-2xl"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE USER DROPDOWN */}
      <AnimatePresence>
        {userOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="
              md:hidden
              absolute right-6 top-[90px]
              min-w-[180px]
              rounded-2xl
              bg-white
              shadow-xl
              z-[9999]
            "
          >
            <button
              onClick={() => {
                goProfile();
                setUserOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-100"
            >
              <UserCircle className="w-4 h-4 text-red-700" />
              Profile
            </button>

            <button
              onClick={() => {
                goOrders();
                setUserOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-orange-100"
            >
              <Package className="w-4 h-4 text-red-700" />
              My Orders
            </button>

            <button
              onClick={() => {
                handleLogout();
                setUserOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE NAV MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-red-700 text-white px-6 py-6"
          >
            <div className="flex flex-col gap-6 text-center">
              {navItems.map(item => (
                <NavLink
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
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
});

export default Navbar;
