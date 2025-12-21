import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomeCTA() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-28 bg-gradient-to-r from-orange-600 via-red-600 to-red-700 text-white text-center">

      {/* ✨ Glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none" />

      {/* 🌶️ Floating spice dots */}
      <div className="absolute top-10 left-20 w-3 h-3 bg-yellow-300 rounded-full blur-sm animate-pulse" />
      <div className="absolute bottom-16 right-24 w-4 h-4 bg-orange-300 rounded-full blur-sm animate-pulse delay-200" />
      <div className="absolute top-24 right-40 w-2 h-2 bg-red-300 rounded-full blur-sm animate-pulse delay-500" />

      <div className="relative max-w-4xl mx-auto px-6">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
        >
          Hungry? Let’s Fix That! 😋
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-10 text-lg md:text-xl italic text-white/90"
        >
          From our kitchen to your home — hot, fresh & full of love. 🍛❤️
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/menu")}
          className="
            relative px-10 py-4 rounded-full
            bg-white text-orange-600
            font-semibold text-lg
            shadow-[0_15px_40px_rgba(255,255,255,0.35)]
            overflow-hidden
          "
        >
          <span className="relative z-10">Explore Menu</span>

          {/* Button shine */}
          <span
            className="
              absolute inset-0
              bg-gradient-to-r from-transparent via-white/70 to-transparent
              translate-x-[-100%] hover:translate-x-[100%]
              transition-transform duration-700
            "
          />
        </motion.button>
      </div>
    </section>
  );
}
