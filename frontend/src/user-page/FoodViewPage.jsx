import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
} from "lucide-react";

const API = "http://localhost:3000";

export default function FoodViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT + RELATED ================= */
  useEffect(() => {
    const fetchFood = async () => {
      try {
        // 👉 fetch current food
        const res = await axios.get(`${API}/api/products/${id}`);
        const product = res.data.product || res.data.food || res.data;

        setFood(product);

        // 👉 fetch all to compute related
        const allRes = await axios.get(`${API}/api/products`);
        const all = allRes.data.products || [];

        const rel = all.filter(
          (p) =>
            p._id !== product._id &&
            p.category === product.category
        );

        setRelated(rel.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch food", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!food)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Item not found
      </div>
    );

  /* ================= CART ================= */
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = cart.find((i) => i._id === food._id);

    if (found) found.qty += qty;
    else cart.push({ ...food, qty });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  const avgRating = food.rating || 4.5;
  const reviewsCount = food.totalReviews || 0;
  const isVeg = food.foodType === "veg";

  return (
    <section className="min-h-screen pt-28 pb-16 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 px-4">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* ================= TOP ================= */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center relative"
          >
            <div className="absolute w-72 h-72 bg-orange-400/40 blur-3xl rounded-full" />
            <img
              src={food.image}
              alt={food.name}
              className="relative z-10 w-80 h-80 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold text-gray-800">
                {food.name}
              </h2>
              <span
                className={`w-3 h-3 rounded-full ${
                  isVeg ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-700">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({reviewsCount} reviews)
              </span>
            </div>

            <p className="text-gray-600 mb-6">
              {food.description}
            </p>

            <p className="text-3xl font-bold text-orange-600 mb-6">
              ₹{food.finalPrice || food.price}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center"
              >
                <Minus />
              </button>
              <span className="text-xl font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center"
              >
                <Plus />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={addToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-orange-500 text-orange-600 font-semibold shadow"
              >
                <ShoppingCart /> Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={buyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg"
              >
                <Zap /> Buy Now
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ================= RELATED ================= */}
        <div>
          <h3 className="text-2xl font-bold mb-6">
            You may also{" "}
            <span className="text-orange-600">like</span>
          </h3>

          {related.length === 0 ? (
            <p className="text-gray-500">No related items found.</p>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {related.map((f) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={f._id}
                  onClick={() => navigate(`/food/${f._id}`)}
                  className="min-w-[200px] bg-white rounded-2xl shadow-lg p-4 cursor-pointer"
                >
                  <img
                    src={f.image}
                    alt={f.name}
                    className="h-32 w-full object-contain mb-3"
                  />
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-orange-600 font-bold">
                    ₹{f.finalPrice || f.price}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
