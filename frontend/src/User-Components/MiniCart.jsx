import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function MiniCart({ open, onClose }) {
  const [cart, setCart] = useState([]);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const formatPrice = (n) => Number(n || 0).toFixed(2);

  const loadCart = () => {
    const raw = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(raw);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [cart]);

  const total = cart.reduce(
    (s, i) => s + (i.finalPrice ?? i.price) * i.qty,
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[299]" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-[300] w-80 bg-white rounded-2xl shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold">Your Cart</h3>
              <button onClick={onClose}>✕</button>
            </div>

            <div
              ref={listRef}
              className="flex flex-col gap-3 max-h-64 overflow-y-auto"
            >
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.image}
                    className="w-10 h-10 rounded-lg object-cover"
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p>{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.qty} × ₹{item.finalPrice}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    ₹{formatPrice(item.qty * item.finalPrice)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t my-3" />
            <div className="flex justify-between font-semibold mb-3">
              <span>Total</span>
              <span>₹{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
              className="w-full py-2 rounded-full bg-orange-600 text-white"
            >
              View Cart
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}