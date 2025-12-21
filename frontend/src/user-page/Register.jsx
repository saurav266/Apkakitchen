import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import chefImg from "../assets/login/chef-img.png";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [otpToken, setOtpToken] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* ================= SEND OTP ================= */
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword)
      return setError("All fields are required");

    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    if (password !== confirmPassword)
      return setError("Passwords do not match");

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
      const res = await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        { otp, otpToken },
        { withCredentials: true }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("authChanged"));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const resendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/resend-otp",
        { otpToken },
        { withCredentials: true }
      );
      setOtpToken(res.data.otpToken);
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
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-44 top-1/2 -translate-y-1/2 hidden md:block z-20"
        >
          <img src={chefImg} alt="Chef" className="h-[420px] drop-shadow-2xl" />
        </motion.div>

        {/* 📝 CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, scale: typing ? 1.02 : 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl px-8 py-12 md:px-12"
        >
          <h2 className="text-3xl font-bold text-center mb-2">
            {step === 1 ? (
              <>
                Create your <span className="text-orange-600">Account</span>
              </>
            ) : (
              <>
                Verify <span className="text-orange-600">OTP</span>
              </>
            )}
          </h2>

          <p className="text-gray-500 text-center mb-6">
            {step === 1
              ? "Join Apna Kitchen & enjoy delicious food"
              : "Enter the OTP sent to your email"}
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <>
              <form onSubmit={sendOtp} className="space-y-5">
                {/* Name */}
                <input
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setTyping(true);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500"
                />

                {/* Email */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setTyping(true);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500"
                />

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setTyping(true);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setTyping(true);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPass(!showConfirmPass)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-lg shadow-lg"
                >
                  {loading ? "Sending OTP..." : "Create Account"}
                </motion.button>
              </form>

              {/* 🔵 Google Login */}
              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="font-medium text-gray-700">
                    Continue with Google
                  </span>
                </button>
              </div>
            </>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <form onSubmit={verifyOtp} className="space-y-5">
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-center tracking-widest rounded-xl border border-gray-300 focus:outline-none focus:border-orange-500"
              />

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-lg shadow-lg"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </motion.button>

              <div className="text-center">
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
