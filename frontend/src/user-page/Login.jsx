import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import chefImg from "../assets/login/chef-img.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ THIS WAS MISSING

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // 🔐 LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ VERY IMPORTANT
      await login(); // 🔥 fetches /profile & updates AuthContext

      // 🔁 Redirect by role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (data.user.role === "delivery") {
        navigate("/delivery/orders", { replace: true });
      } else {
        navigate("/", { replace: true });
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

  const handleForgotPassword = async () => {
  if (!forgotEmail) {
    return alert("Please enter your email");
  }

  try {
    setForgotLoading(true);

    const res = await fetch(
      "/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      }
    );

    const data = await res.json();

    alert(data.message || "If account exists, reset link sent");
    setShowForgot(false);
    setForgotEmail("");

  } catch (err) {
    alert("Server not reachable");
  } finally {
    setForgotLoading(false);
  }
};

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
  onClick={() => setShowForgot(true)}
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
      {showForgot && (
  <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl p-6 w-[90%] max-w-md"
    >
      <h3 className="text-xl font-bold mb-2">
        Reset Password
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter your registered email. We’ll send a reset link.
      </p>

      <input
        type="email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full border rounded-xl px-4 py-3 mb-4"
      />

      <div className="flex gap-2">
        <button
          onClick={() => setShowForgot(false)}
          className="flex-1 bg-gray-200 py-2 rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={handleForgotPassword}
          disabled={forgotLoading}
          className="flex-1 bg-orange-600 text-white py-2 rounded-xl"
        >
          {forgotLoading ? "Sending..." : "Send Link"}
        </button>
      </div>
    </motion.div>
  </div>
)}

    </section>
  );
}
