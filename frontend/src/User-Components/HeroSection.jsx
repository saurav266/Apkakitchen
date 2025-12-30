import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// images
import vegnoddles from "../assets/hero-section/veg-noodles.png";
import vegThali from "../assets/hero-section/veg-thali.png";
import briyaniImg from "../assets/hero-section/biryani.png";
import chicken65 from "../assets/hero-section/chicken65.png";
import puriChole from "../assets/hero-section/puri-chole.png";

const foods = [
  {
    title: "Veg Noodles",
    quote: `Stirred with passion,\nwhere garden-fresh crunch meets smoky allure.`,
    image: vegnoddles,
    font: "font-modern",
    bg: "from-lime-50 via-green-100 to-emerald-200",
  },
  {
    title: "Indian Veg Thali",
    quote: `Many flavours, one plate,\na quiet balance of tradition and care.`,
    image: vegThali,
    font: "font-classy",
    bg: "from-green-50 via-emerald-100 to-teal-200",
  },
  {
    title: "Chicken Biryani",
    quote: `Sealed with patience,\naroma rising before the first bite.`,
    image: briyaniImg,
    font: "font-arabic",
    bg: "from-amber-50 via-orange-200 to-red-200",
  },
  {
    title: "Chicken 65",
    quote: `Fried to perfection,\nwhere tender heat embraces crunchy delight.`,
    image: chicken65,
    font: "font-modern",
    bg: "from-rose-100 via-red-200 to-rose-300",
  },
  {
    title: "Puri & Chole",
    quote: `Puffed with warmth,\nwhere golden clouds meet hearty spice.`,
    image: puriChole,
    font: "font-modern",
    bg: "from-yellow-100 via-amber-200 to-orange-300",
  },
];

export default function HeroApnaKitchen() {
  const [index, setIndex] = useState(0);
  const current = foods[index];
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((p) => (p + 1) % foods.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden flex items-center">

      {/* Background */}
      <AnimatePresence>
        <motion.div
          key={current.bg}
          className={`absolute inset-0 bg-gradient-to-br ${current.bg}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        />
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 items-center pt-20 md:pt-0">

        {/* LEFT */}
        <div className="space-y-8 max-w-xl md:translate-y-[-4%]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={current.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className={`text-5xl md:text-7xl font-bold leading-tight ${current.font}`}
            >
              {current.title}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={current.quote}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 0.95, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
              className="
                fleur-de-leah-regular
                text-3xl md:text-4xl
                italic whitespace-pre-line
                leading-relaxed tracking-wide
              "
            >
              “{current.quote}”
            </motion.p>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/menu")}
            className="
              mt-6 px-10 py-4 rounded-full
              bg-gradient-to-r from-orange-600 to-red-600
              text-white font-semibold shadow-xl
            "
          >
            Order Now →
          </motion.button>
        </div>

        {/* RIGHT — Responsive image (NO animation, NO stretch) */}
        <div className="relative flex justify-center items-center md:translate-y-[6%]">

          {/* soft backdrop */}

          <AnimatePresence mode="wait">
            <motion.img
              key={current.image}
              src={current.image}
              alt={current.title}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6 }}
              className="
                relative z-10
                w-full
                max-w-[280px]
                sm:max-w-[360px]
                md:max-w-[520px]
                h-auto
                object-contain
                drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]
              "
            />
          </AnimatePresence>
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {foods.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-orange-600 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
