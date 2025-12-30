import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const API = "http://localhost:3000";
/* 🔥 CONTROL POPULAR ITEMS BY NAME ONLY */
const POPULAR_DISH_NAMES = [
  "Egg Biryani",
  "Veg Noodles",
  "Chicken Biryani",
  "Chhola Poori Combo",
  "Chicken 65",
];

export default function PopularDishes() {
  const [dishes, setDishes] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  /* 🔌 Fetch from backend */
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await axios.post(
          `${API}/api/products/popular`,
          { names: POPULAR_DISH_NAMES }
        );
        if (data.success) setDishes(data.products);
      } catch (err) {
        console.error("Failed to load popular dishes", err);
      }
    };
    fetchPopular();
  }, []);

  const total = dishes.length;

  /* 🔁 Auto slide */
  useEffect(() => {
    if (!paused && total > 0) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % total);
      }, 2000);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, total]);

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  const getPos = (i) => {
    const diff = (i - index + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    if (diff === 2) return "farRight";
    if (diff === total - 2) return "farLeft";
    return "hidden";
  };

  const variants = {
    center: { x: 0, scale: 1.18, opacity: 1, zIndex: 5 },
    left: { x: -260, scale: 0.92, opacity: 0.6, zIndex: 4, rotate: -8 },
    right: { x: 260, scale: 0.92, opacity: 0.6, zIndex: 4, rotate: 8 },
    farLeft: { x: -480, scale: 0.8, opacity: 0.35, zIndex: 2 },
    farRight: { x: 480, scale: 0.8, opacity: 0.35, zIndex: 2 },
    hidden: { opacity: 0, scale: 0.6, zIndex: 1 },
  };

  const handleAddToCart = (dish) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = cart.find((i) => i._id === dish._id);
    if (found) found.qty += 1;
    else cart.push({ ...dish, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!dishes.length) return null;

  return (
    <section className="py-28 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold mb-16">
          Customer <span className="text-orange-600">Favorites</span>
        </h2>

        <div
          className="relative h-[440px] flex items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute w-72 h-16 bg-orange-400/40 blur-3xl rounded-full -bottom-4" />

          <button onClick={prev} className="absolute left-0 md:left-10 z-20 w-12 h-12 rounded-full bg-white/70 backdrop-blur shadow">
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>

          <button onClick={next} className="absolute right-0 md:right-10 z-20 w-12 h-12 rounded-full bg-white/70 backdrop-blur shadow">
            <ChevronRight className="w-6 h-6 text-orange-600" />
          </button>

          {dishes.map((dish, i) => (
            <motion.div
              key={dish._id}
              variants={variants}
              animate={getPos(i)}
              transition={{ duration: 0.6 }}
              className="absolute w-[260px] md:w-[300px] h-[370px] rounded-3xl p-6 flex flex-col items-center justify-between bg-white/35 backdrop-blur-xl border border-white/40 shadow-[0_25px_60px_rgba(255,120,60,0.45)]"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="h-40 object-contain drop-shadow-2xl scale-135"
              />

              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {dish.name}
                </h3>
                <p className="text-orange-600 font-bold text-lg">
                  ₹{dish.finalPrice}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(dish)}
                className="w-full py-2 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg hover:scale-105 transition"
              >
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {dishes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-orange-600 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
