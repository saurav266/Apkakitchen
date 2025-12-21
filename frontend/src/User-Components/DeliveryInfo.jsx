import { motion } from "framer-motion";
import { Clock, MapPin, Package, ShieldCheck } from "lucide-react";
import riderImg from "../assets/delivery/rider.png";

export default function DeliveryInfo() {
  const features = [
    {
      icon: Clock,
      title: "30-Min Express Delivery",
      desc: "Hot & fresh food at your doorstep in just 30 minutes.",
    },
    {
      icon: MapPin,
      title: "Wide Coverage",
      desc: "Serving multiple areas across your city every day.",
    },
    {
      icon: Package,
      title: "Hygienic Packaging",
      desc: "Sealed, spill-proof & safe packaging for every order.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Riders",
      desc: "Verified delivery partners for safe & fast service.",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* 🏷️ Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why We’re <span className="text-orange-600">Super Fast</span>
          </h2>
          <p className="mt-3 text-gray-600 italic text-lg">
            From our kitchen to your home — lightning fast delivery!
          </p>
        </div>

        {/* 📦 Top Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="
                  bg-white/90 backdrop-blur
                  rounded-2xl p-6 shadow-lg
                  border border-orange-100
                  hover:shadow-[0_20px_40px_rgba(255,120,60,0.35)]
                  transition
                "
              >
                <div className="w-12 h-12 rounded-xl mb-4 bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shadow">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 🚴 Rider Animation Section */}
        <div className="relative flex items-center justify-center h-[300px] overflow-hidden -mt-6">

          {/* 🌄 Parallax background */}
          <motion.div
            className="absolute inset-0 bg-[url('/road-bg.png')] bg-repeat-x opacity-20"
            animate={{ x: ["0%", "-60%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* ✨ Glow road */}
          <div className="absolute w-[500px] h-20 bg-orange-400/40 blur-3xl rounded-full bottom-12" />

          {/* 🛣️ Speed road lines */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[2px] w-44 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-70"
              style={{ top: `${60 + i * 5}%` }}
              animate={{ x: ["-120%", "120%"] }}
              transition={{
                duration: 2 + i * 0.25,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* 🏍️ Rider: single image seamless loop */}
<motion.div
  className="absolute z-10"
  initial={{ x: "70vw" }}   // start closer to the edge
  animate={{ x: "-120vw" }}  // move fully across
  transition={{
    duration: 12,            // keep speed the same
    repeat: Infinity,
    repeatType: "loop",
    ease: "linear",
  }}
>
  <img
    src={riderImg}
    alt="Delivery Rider"
    className="h-60 md:h-64 object-contain drop-shadow-2xl"
  />
</motion.div>

        </div>

      </div>
    </section>
  );
}
