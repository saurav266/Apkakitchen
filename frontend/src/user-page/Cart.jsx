import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MiniCart from "../User-Components/MiniCart.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [miniOpen, setMiniOpen] = useState(false);
  const { user, loading } = useAuth();

  const formatPrice = (n) => Number(n || 0).toFixed(2);

  /* ================= SYNC ================= */
  const syncCart = (updated) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
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
    syncCart(cart.filter((i) => i.cartItemId !== cartItemId));
  };

  /* ================= CHECKOUT ================= */
  const handleCheckout = () => {
    if (!cart.length || loading) return;
    navigate(user ? "/checkout" : "/login");
  };

  const total = cart.reduce(
    (sum, i) => sum + i.finalPrice * i.qty,
    0
  );

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
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
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              {cart.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 border-b py-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-20 h-40 sm:h-20 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{item.finalPrice} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="px-3 py-1 rounded bg-gray-200"
                      onClick={() => updateQty(item.cartItemId, -1)}
                    >
                      −
                    </button>
                    <span className="min-w-[20px] text-center">
                      {item.qty}
                    </span>
                    <button
                      className="px-3 py-1 rounded bg-gray-200"
                      onClick={() => updateQty(item.cartItemId, 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center justify-between sm:block">
                    <p className="font-semibold">
                      ₹{formatPrice(item.finalPrice * item.qty)}
                    </p>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-red-500 text-sm sm:mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-between mt-6 text-lg font-bold">
                <span>Total</span>
                <span>₹{formatPrice(total)}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
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

      <MiniCart open={miniOpen} onClose={() => setMiniOpen(false)} />
    </>
  );
}
