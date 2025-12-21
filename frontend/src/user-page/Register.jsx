import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = register, 2 = otp
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ⏳ RESEND TIMER
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* ================= SEND OTP ================= */

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        { name, email, password },
        { withCredentials: true }
      );

      setOtpToken(res.data.otpToken);
      setStep(2);
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        { otp, otpToken },
        { withCredentials: true }
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */

  const resendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:3000/api/auth/resend-otp",
        { otpToken },
        { withCredentials: true }
      );

      setOtpToken(res.data.otpToken); // 🔥 update token
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TIMER ================= */

  useEffect(() => {
    if (step !== 2) return;

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, step]);

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
            Join Apka Kitchen & enjoy delicious food
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
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <input
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <button
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* 🔁 RESEND OTP */}
            <div className="text-center mt-3">
              {canResend ? (
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-orange-600 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend OTP in {timer}s
                </p>
              )}
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
}
