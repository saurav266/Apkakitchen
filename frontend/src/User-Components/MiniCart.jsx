import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MiniCart({ open, onClose }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // 🔹 Load cart from localStorage
  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(c);
  }, []);

  // 🔹 Sync cart when updated elsewhere
useEffect(() => {
  const c = JSON.parse(localStorage.getItem("cart")) || [];

  const fixed = c.map((i) => ({
    ...i,
    finalPrice: Number(i.finalPrice ?? i.price ?? 0),
    qty: Number(i.qty ?? 1),
  }));

  setCart(fixed);
  localStorage.setItem("cart", JSON.stringify(fixed));
}, []);


  // 🔹 Remove item
  const removeItem = (id) => {
    const c = cart.filter((i) => i._id !== id);
    setCart(c);
    localStorage.setItem("cart", JSON.stringify(c));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // 🔹 Update quantity
const updateQty = (id, delta) => {
  let c = [...cart];
  const item = c.find((i) => i._id === id);
  if (!item) return;

  item.qty = Number(item.qty ?? 1) + delta;
  c = c.filter((i) => i.qty > 0);

  setCart(c);
  localStorage.setItem("cart", JSON.stringify(c));
  window.dispatchEvent(new Event("cartUpdated"));
};


const total = cart.reduce(
  (sum, i) =>
    sum + Number(i.finalPrice ?? i.price ?? 0) * Number(i.qty ?? 1),
  0
);


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
                  key={item._id || item.id}   
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  {/* Image */}
                  <img
                    src={item.image || "/placeholder-food.png"}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />

                  {/* Name + Qty */}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>

                  {/* Price */}
                 <p className="text-sm font-semibold">
  ₹{(item.finalPrice ?? item.price ?? 0) * item.qty}
</p>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 text-xs hover:underline ml-2"
                  >
                    Remove
                  </button>
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
                onClick={() => navigate("/checkout")}
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