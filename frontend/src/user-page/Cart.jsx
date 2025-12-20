import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const user = JSON.parse(localStorage.getItem("user"));
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
    const handleCheckout = () => {
        if (cart.length === 0) return;

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
        } else {
            navigate("/checkout");
        }
    };


  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(c);
  }, []);

  const updateQty = (id, delta) => {
  let c = [...cart];
  const item = c.find((i) => i.id === id);
  if (!item) return;

  item.qty += delta;

  // ✅ remove if qty <= 0
  c = c.filter((i) => i.qty > 0);

  setCart(c);
  localStorage.setItem("cart", JSON.stringify(c));

  // 🔔 notify navbar
  window.dispatchEvent(new Event("cartUpdated"));
};


  const removeItem = (id) => {
  const c = cart.filter((i) => i.id !== id);

  setCart(c);
  localStorage.setItem("cart", JSON.stringify(c));

  // 🔔 notify navbar
  window.dispatchEvent(new Event("cartUpdated"));
};


  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Your <span className="text-orange-600">Cart</span>
        </h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty.</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-6 px-6 py-3 rounded-full bg-orange-500 text-white"
            >
              Go to Menu
            </button>
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow-lg p-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4 last:border-b-0"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} each
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Qty */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-orange-500 text-white"
                    >
                      +
                    </button>
                  </div>

                  <span className="w-20 text-right font-semibold">
                    ₹{item.price * item.qty}
                  </span>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* TOTAL */}
            <div className="flex justify-between items-center mt-6 text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-600">₹{total}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => navigate("/menu")}
                className="px-6 py-3 rounded-full bg-gray-200"
              >
                Add More
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleCheckout}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg"
                >
                Proceed to Checkout
                </motion.button>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
