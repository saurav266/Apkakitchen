import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import chefImg from "../assets/login/chef-img.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // 🔥 cookie
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Store user info (includes role)
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔔 Notify Navbar
      window.dispatchEvent(new Event("authChanged"));

      // 🔥 ROLE-BASED REDIRECT
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "delivery") {
        navigate("/delivery/orders");
      } else {
        navigate("/"); // normal user
      }

    } catch (err) {
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  // typing animation
  useEffect(() => {
    if (typing) {
      const t = setTimeout(() => setTyping(false), 300);
      return () => clearTimeout(t);
    }
  }, [typing]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 px-4 overflow-hidden">
      <div className="relative w-full max-w-xl">

        {/* 👨‍🍳 CHEF */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute -left-44 top-1/2 -translate-y-1/2 hidden md:block z-20"
        >
          <img src={chefImg} alt="Chef" className="h-[420px]" />
        </motion.div>

        {/* LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, scale: typing ? 1.02 : 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl px-8 py-12 md:px-12"
        >
          <h2 className="text-3xl font-bold mb-2">
            Login to <span className="text-orange-600">Apna Kitchen</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <input
              type="email"
              required
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
                setTyping(true);
              }}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              required
              value={password}
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
                setTyping(true);
              }}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400"
            />

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-orange-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}