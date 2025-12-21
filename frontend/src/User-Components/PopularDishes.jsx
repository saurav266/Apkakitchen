import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import pizzaImg from "../assets/hero-section/pizza.png";
import vegThali from "../assets/hero-section/veg-thali.png";
import briyaniImg from "../assets/hero-section/biryani.png";
import burgerImg from "../assets/hero-section/burger.png";
import puriChole from "../assets/hero-section/puri-chole.png";

const dishes = [
  { id: 1, name: "Cheesy Pizza", price: 299, img: pizzaImg },
  { id: 2, name: "Veg Thali", price: 249, img: vegThali },
  { id: 3, name: "Chicken Biryani", price: 349, img: briyaniImg },
  { id: 4, name: "Puri Chole", price: 199, img: puriChole },
  { id: 5, name: "Burger", price: 129, img: burgerImg },
];

export default function PopularDishes() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = dishes.length;
  const intervalRef = useRef(null);

  // 🔁 Auto slide with pause on hover
  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % total);
      }, 3500);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, total]);

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  // 👉 Position logic with far left & far right
  const getPos = (i) => {
    const diff = (i - index + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === total - 1) return "left";
    if (diff === 2) return "farRight";
    if (diff === total - 2) return "farLeft";
    return "hidden";
  };

  // 🎞️ Animation variants
  const variants = {
    center: {
      x: 0,
      scale: 1.18,
      opacity: 1,
      zIndex: 5,
      rotate: 0,
    },
    left: {
      x: -260,
      scale: 0.92,
      opacity: 0.6,
      zIndex: 4,
      rotate: -8,
    },
    right: {
      x: 260,
      scale: 0.92,
      opacity: 0.6,
      zIndex: 4,
      rotate: 8,
    },
    farLeft: {
      x: -480,
      scale: 0.8,
      opacity: 0.35,
      zIndex: 2,
      rotate: -12,
    },
    farRight: {
      x: 480,
      scale: 0.8,
      opacity: 0.35,
      zIndex: 2,
      rotate: 12,
    },
    hidden: {
      opacity: 0,
      scale: 0.6,
      zIndex: 1,
    },
  };

  // 🛒 Add to cart
  const handleAddToCart = (dish) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const found = cart.find((i) => i.id === dish.id);
    if (found) found.qty += 1;
    else cart.push({ ...dish, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

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
          {/* ✨ Glow under center */}
          <div className="absolute w-72 h-16 bg-orange-400/40 blur-3xl rounded-full -bottom-4" />

          {/* ⬅️ Arrow */}
          <button
            onClick={prev}
            className="absolute left-0 md:left-10 z-20 w-12 h-12 rounded-full bg-white/70 backdrop-blur shadow flex items-center justify-center hover:scale-110 transition"
          >
            <ChevronLeft className="w-6 h-6 text-orange-600" />
          </button>

          {/* ➡️ Arrow */}
          <button
            onClick={next}
            className="absolute right-0 md:right-10 z-20 w-12 h-12 rounded-full bg-white/70 backdrop-blur shadow flex items-center justify-center hover:scale-110 transition"
          >
            <ChevronRight className="w-6 h-6 text-orange-600" />
          </button>

          {/* 🍔 Cards */}
          {dishes.map((dish, i) => {
            const pos = getPos(i);

            return (
              <motion.div
                key={dish.id}
                variants={variants}
                animate={pos}
                initial="hidden"
                transition={{ duration: 0.6, ease: "easeInOut" }}
                drag={pos === "center" ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -100) next();
                  if (info.offset.x > 100) prev();
                }}
                className="
                  absolute w-[260px] md:w-[300px] h-[370px]
                  rounded-3xl p-6
                  flex flex-col items-center justify-between
                  bg-white/35 backdrop-blur-xl
                  border border-white/40
                  shadow-[0_25px_60px_rgba(255,120,60,0.45)]
                "
              >
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="h-40 object-contain drop-shadow-2xl"
                />

                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {dish.name}
                  </h3>
                  <p className="text-orange-600 font-bold text-lg">
                    ₹{dish.price}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(dish)}
                  className="
                    w-full py-2 rounded-full
                    bg-gradient-to-r from-orange-600 to-red-600
                    text-white font-semibold
                    shadow-lg hover:scale-105 transition
                  "
                >
                  Add to Cart
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* 🔘 Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {dishes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index ? "bg-orange-600 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
