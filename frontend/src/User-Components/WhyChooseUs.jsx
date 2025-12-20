import chefImg from "../assets/hero-section/chef.png";
import { motion } from "framer-motion";
import { Leaf, Flame, Truck, Wallet } from "lucide-react";

const features = [
  { title: "Fresh Ingredients", desc: "Only farm-fresh veggies & spices.", icon: Leaf },
  { title: "Authentic Taste", desc: "Real Indian flavours in every bite.", icon: Flame },
  { title: "Fast Delivery", desc: "Hot food at your door in minutes.", icon: Truck },
  { title: "Affordable Prices", desc: "Great food that fits your budget.", icon: Wallet },
];

// 🌿 Premium smooth easing
const easePremium = [0.25, 1, 0.3, 1];

const cardLeft = {
  hidden: { opacity: 0, x: -120, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.1,
      ease: easePremium,
    },
  },
};

const cardRight = {
  hidden: { opacity: 0, x: 120, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 1.1,
      ease: easePremium,
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section className="relative bg-gradient-to-b from-white via-orange-50/40 to-white overflow-hidden pt-28 pb-16">
      <div className="flex flex-col items-center text-center relative">

        <div className="relative grid grid-cols-1 lg:grid-cols-3 items-start gap-10">

          {/* LEFT CARDS */}
          <div className="flex flex-col gap-10 mt-24 lg:-translate-x-6">
            {features.slice(0, 2).map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  className="
                    bg-white rounded-3xl p-8
                    shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                    hover:shadow-[0_32px_70px_rgba(255,120,40,0.35)]
                    transition-all duration-500
                    flex flex-col items-center text-center
                  "
                >
                  <div
                    className="
                      w-20 h-20 mb-5 rounded-2xl
                      bg-gradient-to-br from-orange-500 via-orange-600 to-red-500
                      shadow-[0_10px_25px_rgba(255,94,0,0.5)]
                      flex items-center justify-center
                    "
                  >
                    <Icon className="w-9 h-9 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* 👨‍🍳 CHEF + TITLE CENTER (unchanged) */}
          <div className="flex flex-col items-center text-center relative -mt-12">
            <img
              src={chefImg}
              alt="Chef"
              className="
                relative z-10
                h-[200px] md:h-[350px] lg:h-[400px]
                w-auto object-contain
                drop-shadow-2xl
                -mt-16
                mb-[-48px]
              "
            />

            <div className="relative z-20 flex flex-col items-center -mt-2">
              <div
                className="
                  absolute inset-0
                  bg-white/80 backdrop-blur-md
                  rounded-full
                  shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                  border border-orange-100
                "
              />

              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="
                    bg-white/90 backdrop-blur-md
                    rounded-full
                    shadow-[0_12px_30px_rgba(0,0,0,0.15)]
                    border border-orange-100
                    px-12 py-6
                  "
                >
                  <h2 className="text-4xl md:text-5xl font-semibold text-gray-800">
                    Why Choose <span className="text-orange-600">Us</span>
                  </h2>

                  <div className="mt-2 mx-auto h-[3px] w-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />

                  <p className="mt-3 text-gray-600 italic text-lg text-center">
                    Made with love, served with warmth ❤️
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARDS */}
          <div className="flex flex-col gap-10 mt-24 lg:translate-x-6">
            {features.slice(2, 4).map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  variants={cardRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  className="
                    bg-white rounded-3xl p-8
                    shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                    hover:shadow-[0_32px_70px_rgba(255,120,40,0.35)]
                    transition-all duration-500
                    flex flex-col items-center text-center
                  "
                >
                  <div
                    className="
                      w-20 h-20 mb-5 rounded-2xl
                      bg-gradient-to-br from-orange-500 via-orange-600 to-red-500
                      shadow-[0_10px_25px_rgba(255,94,0,0.5)]
                      flex items-center justify-center
                    "
                  >
                    <Icon className="w-9 h-9 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
