import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MiniCart({ open, cart, onClose }) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="
            fixed top-20 right-6 z-[300]
            w-80 bg-white rounded-2xl shadow-xl
            p-5
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <button onClick={onClose} className="text-gray-500">✕</button>
          </div>

          {/* Empty */}
          {cart.length === 0 ? (
            <p className="text-gray-500 text-sm">Cart is empty</p>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-12 h-12 rounded-xl
                      object-cover border
                    "
                  />

                  {/* Name + Qty */}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.qty}
                    </p>
                  </div>

                  {/* Price */}
                  <p className="text-sm font-semibold">
                    ₹{item.price * item.qty}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer */}
          {cart.length > 0 && (
            <>
              <div className="border-t my-4" />
              <div className="flex justify-between font-semibold mb-4">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="
                  w-full py-2.5 rounded-full
                  bg-gradient-to-r from-orange-600 to-red-600
                  text-white font-semibold
                "
              >
                Checkout
              </motion.button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
