import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="max-w-xl w-full bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 12 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-xl">
            <CheckCircle className="text-white w-12 h-12" />
          </div>
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800 mb-3">
          Order Successful! 🎉
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Ghar jaisa swaad is on the way 😋 <br />
          Your food is being freshly prepared with love ❤️
        </p>

        {/* Order Info */}
        <div className="bg-orange-50 rounded-2xl p-4 mb-8">
          <p className="text-sm text-gray-500">Order ID</p>
          <p className="text-lg font-semibold text-orange-600 tracking-wide">
            #APKA12345
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/my-orders"
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 text-center"
          >
            🍽️ Track Your Order
          </Link>

          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-white border border-orange-200 text-orange-600 shadow hover:bg-orange-50 transition text-center"
          >
            ⬅️ Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-sm text-gray-500">
          From our kitchen to your home 🧑‍🍳✨
        </p>
      </motion.div>
    </div>
  );
}
