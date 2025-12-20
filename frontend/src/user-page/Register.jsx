import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import chefImg from "../assets/login/chef-img.png";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name, email };
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  // 👉 small pulse when typing
  useEffect(() => {
    if (typing) {
      const t = setTimeout(() => setTyping(false), 300);
      return () => clearTimeout(t);
    }
  }, [typing]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 px-4 overflow-hidden">
      <div className="relative w-full max-w-xl">

        {/* 👨‍🍳 CHEF — FLOAT ONLY */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="
            absolute -left-44 top-1/2 -translate-y-1/2
            hidden md:block z-20
          "
        >
          <motion.img
            src={chefImg}
            alt="Chef"
            className="h-[420px] w-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* 📝 REGISTER CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: typing ? 1.02 : 1,
          }}
          transition={{ duration: 0.4 }}
          className="
            relative z-10
            bg-white/90 backdrop-blur
            rounded-3xl shadow-2xl
            px-8 py-12 md:px-12
          "
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create your <span className="text-orange-600">Account</span>
          </h2>
          <p className="text-gray-500 mb-8">
            Join Apna Kitchen & enjoy delicious food
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <motion.input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setTyping(true);
                }}
                placeholder="Your name"
                whileFocus={{ scale: 1.02 }}
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-orange-400
                "
              />
            </div>

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
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-orange-400
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <motion.input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTyping(true);
                }}
                placeholder="••••••••"
                whileFocus={{ scale: 1.02 }}
                className="
                  w-full px-4 py-3 rounded-xl
                  border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-orange-400
                "
              />
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="
                w-full py-3 rounded-xl
                bg-gradient-to-r from-orange-600 to-red-600
                text-white font-semibold text-lg
                shadow-lg
              "
            >
              Create Account
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-orange-600 font-medium hover:underline"
            >
              Login
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
