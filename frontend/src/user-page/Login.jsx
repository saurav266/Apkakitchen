import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import chefImg from "../assets/login/chef-img.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";



export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔐 Submit with backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChanged"));

      if (data.user.role === "admin") {
  setTimeout(() => navigate("/admin/dashboard"), 50);
} else if (data.user.role === "delivery") {
  setTimeout(() => navigate("/delivery/orders"), 50);
} else {
  setTimeout(() => navigate("/"), 50);
}
      

    } catch (err) {
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  // 👉 trigger small pulse when typing
  useEffect(() => {
    if (typing) {
      const t = setTimeout(() => setTyping(false), 300);
      return () => clearTimeout(t);
    }
  }, [typing]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 px-4 overflow-hidden">
      <div className="relative w-full max-w-xl">

        {/* 👨‍🍳 CHEF FLOAT */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-44 top-1/2 -translate-y-1/2 hidden md:block z-20"
        >
          <motion.img
            src={chefImg}
            alt="Chef"
            className="h-[420px] w-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* 🔐 LOGIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: typing ? 1.02 : 1,
          }}
          transition={{ duration: 0.4 }}
          className="relative z-10 bg-white/90 backdrop-blur rounded-3xl shadow-2xl px-8 py-12 md:px-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Login to <span className="text-orange-600">Apna Kitchen</span>
          </h2>
          <p className="text-gray-500 mb-8">
            Enter your details to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <motion.input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setTyping(true);
                }}
                placeholder="you@example.com"
                whileFocus={{ scale: 1.02 }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Password with 👁 toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setTyping(true);
                  }}
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.02 }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-orange-500" />
                Remember me
              </label>
              <button
                type="button"
                className="text-orange-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-lg shadow-lg disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-orange-600 font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
