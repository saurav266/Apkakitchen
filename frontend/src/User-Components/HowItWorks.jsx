import { motion } from "framer-motion";
import { Utensils, ShoppingBag, ChefHat, Bike } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Choose Dish",
    desc: "Browse our hand-picked menu full of delicious Indian flavours.",
    icon: Utensils,
  },
  {
    step: "2",
    title: "Place Order",
    desc: "Order in just a few clicks. Simple, fast & secure checkout.",
    icon: ShoppingBag,
  },
  {
    step: "3",
    title: "We Cook",
    desc: "Our chefs freshly prepare your meal with love & hygiene.",
    icon: ChefHat,
  },
  {
    step: "4",
    title: "Fast Delivery",
    desc: "Hot & tasty food delivered right to your doorstep.",
    icon: Bike,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-orange-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center relative">

        {/* 🏷️ Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gray-800">
          How It <span className="text-orange-600">Works</span>
        </h2>

        {/* 🌟 Steps */}
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="
                  relative p-8 rounded-3xl
                  bg-white/70 backdrop-blur-xl
                  border border-orange-100
                  shadow-[0_15px_40px_rgba(255,140,60,0.25)]
                  hover:shadow-[0_25px_60px_rgba(255,140,60,0.45)]
                  transition-all duration-300
                  hover:-translate-y-3
                "
              >
                {/* ✨ Glow */}
                <div className="absolute inset-0 rounded-3xl bg-orange-400/10 blur-2xl -z-10" />

                {/* 🔢 Step badge */}
                <div
                  className="
                    absolute -top-5 left-1/2 -translate-x-1/2
                    w-12 h-12 rounded-full
                    bg-gradient-to-br from-orange-500 to-red-500
                    text-white flex items-center justify-center
                    font-bold shadow-lg
                  "
                >
                  {s.step}
                </div>

                {/* 🍽️ Icon */}
                <div
                  className="
                    w-16 h-16 mx-auto mb-5 mt-6
                    rounded-2xl flex items-center justify-center
                    bg-gradient-to-br from-orange-100 to-orange-50
                    text-orange-600 shadow
                  "
                >
                  <Icon className="w-8 h-8" />
                </div>

                {/* 📝 Text */}
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
