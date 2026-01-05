import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function MiniCart({ open, onClose }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const formatPrice = (n) => Number(n || 0).toFixed(2);

  /* ================= LOAD CART ================= */
  const loadCart = () => {
    const raw = JSON.parse(localStorage.getItem("cart")) || [];

    const normalized = raw.map((i) => ({
      ...i,
      qty: Number(i.qty ?? 1),
      finalPrice: Number(i.finalPrice ?? i.price ?? 0),
      image:
        i.image ||
        i.images?.find((img) => img.isPrimary)?.url ||
        i.images?.[0]?.url ||
        "/placeholder-food.png",
    }));

    setCart(normalized);
  };

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    const handler = () => loadCart();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  /* ================= REMOVE ITEM ================= */
  const removeItem = (id) => {
    const updated = cart.filter((i) => i._id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* ================= UPDATE QTY ================= */
  const updateQty = (id, delta) => {
    const updated = cart
      .map((i) =>
        i._id === id ? { ...i, qty: i.qty + delta } : i
      )
      .filter((i) => i.qty > 0);

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = cart.reduce(
    (sum, i) => sum + i.finalPrice * i.qty,
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ✅ OVERLAY — THIS IS CRITICAL */}
          <div
            className="fixed inset-0 z-[299]"
            onClick={onClose}
          />

          {/* CART */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="
              fixed top-20 right-6 z-[300]
              w-80 bg-white rounded-2xl shadow-xl p-5
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <button
                onClick={() => onClose()}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* EMPTY */}
            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm">Cart is empty</p>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <button onClick={() => updateQty(item._id, -1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item._id, 1)}>+</button>
                      </div>
                    </div>

                    <p className="text-sm font-semibold">
                      ₹{formatPrice(item.finalPrice * item.qty)}
                    </p>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* FOOTER */}
            {cart.length > 0 && (
              <>
                <div className="border-t my-4" />
                <div className="flex justify-between font-semibold mb-4">
                  <span>Total</span>
                  <span>₹{formatPrice(total)}</span>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate("/checkout");
                  }}
                  className="
                    w-full py-2.5 rounded-full
                    bg-gradient-to-r from-orange-600 to-red-600
                    text-white font-semibold
                  "
                >
                  Checkout
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
