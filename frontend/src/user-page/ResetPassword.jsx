import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ role from email link (?role=user | delivery)
  const role = searchParams.get("role");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!role) {
      return alert("Invalid reset link (role missing)");
    }

    if (!password || password.length < 6) {
      return alert("Password must be at least 6 characters");
    }

    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/auth/reset-password/${token}?role=${role}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Reset failed");
      }

      alert("Password reset successful! Please login.");
      navigate("/login");

    } catch (err) {
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-3"
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-orange-600 text-white p-3 rounded-lg disabled:opacity-70"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </section>
  );
}
