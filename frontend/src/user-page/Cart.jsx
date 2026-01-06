import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MiniCart from "../User-Components/MiniCart.jsx";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [miniOpen, setMiniOpen] = useState(false);

  const formatPrice = (n) => Number(n || 0).toFixed(2);

  /* ================= SYNC ================= */
  const syncCart = (updated) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));

    // 🔥 auto open minicart
    setMiniOpen(true);
    setTimeout(() => setMiniOpen(false), 2000);
  };

  /* ================= INIT ================= */
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("cart")) || [];

    const normalized = raw.map((item) => ({
      ...item,
      qty: Number(item.qty ?? 1),
      finalPrice: Number(item.finalPrice ?? item.price ?? 0),
      image:
        item.image ||
        item.images?.find((i) => i.isPrimary)?.url ||
        item.images?.[0]?.url ||
        "/placeholder-food.png",
    }));

    setCart(normalized);
  }, []);

  /* ================= UPDATE ================= */
  const updateQty = (cartItemId, delta) => {
    const updated = cart
      .map((i) =>
        i.cartItemId === cartItemId
          ? { ...i, qty: i.qty + delta }
          : i
      )
      .filter((i) => i.qty > 0);

    syncCart(updated);
  };

  const removeItem = (cartItemId) => {
    const updated = cart.filter(
      (i) => i.cartItemId !== cartItemId
    );
    syncCart(updated);
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (!cart.length) return;
    const user = JSON.parse(localStorage.getItem("user"));
    navigate(user ? "/checkout" : "/login");
  };

  const total = cart.reduce(
    (sum, i) => sum + i.finalPrice * i.qty,
    0
  );

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6">
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {cart.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  className="flex items-center gap-4 border-b py-4"
                >
                  <img
                    src={item.image}
                    className="w-20 h-20 rounded-xl object-cover"
                    alt={item.name}
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{item.finalPrice} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.cartItemId, -1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.cartItemId, 1)}>+</button>
                  </div>

                  <p className="font-semibold">
                    ₹{formatPrice(item.finalPrice * item.qty)}
                  </p>

                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}

              <div className="flex justify-between mt-6 font-bold">
                <span>Total</span>
                <span>₹{formatPrice(total)}</span>
              </div>

              <div className="flex justify-end mt-6 gap-4">
                <button
                  onClick={() => navigate("/menu")}
                  className="px-6 py-3 rounded-full bg-gray-200"
                >
                  Add More
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ✅ MINI CART */}
      <MiniCart open={miniOpen} onClose={() => setMiniOpen(false)} />
    </>
  );
}
