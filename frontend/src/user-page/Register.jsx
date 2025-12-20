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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
          {step === 1 ? "Create Account" : "Verify OTP"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-xl"
            />

            <button
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>
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
