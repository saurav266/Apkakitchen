import { motion } from "framer-motion";
import { ChefHat, Heart, Flame, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aboutFood from "../assets/about/hero-page.png";

export default function About() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: "10k+", label: "Happy Customers" },
    { icon: ChefHat, value: "15+", label: "Expert Chefs" },
    { icon: Flame, value: "15+", label: "Signature Dishes" },
    { icon: Heart, value: "100%", label: "Made with Love" },
  ];

  const timeline = [
    { year: "2022", text: "Apna Kitchen founded with a dream of ghar-ka-khana." },
    { year: "2023", text: "Reached 2,000+ happy customers across the city." },
    { year: "2024", text: "Expanded menu with combos, thalis & biryanis." },
    { year: "2025", text: "Delivering 30-min express meals every day!" },
  ];

  const team = [
    { name: "Chef Rajesh", role: "Head Chef" },
    { name: "Chef Neha", role: "Indian Cuisine Expert" },
    { name: "Chef Aman", role: "Biryani Specialist" },
  ];

  return (
    <section className="pt-14 w-full bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">

      {/* 🍽️ IMAGE HERO */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <img
          src={aboutFood}
          alt="Delicious Indian food"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        {/* Glass title card */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex items-center justify-center px-6"
        >
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl px-10 py-8 text-center shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide">
              About <span className="text-orange-400">Apna Kitchen</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90 italic">
              Serving comfort food that feels just like home.
            </p>
          </div>
        </motion.div> */}
      </div>

      {/* 🌟 CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-24">

        {/* 📜 Story */}
        <div className="grid lg:grid-cols-2 gap-14 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Apna Kitchen began with one simple belief — food should not just
              fill your stomach, it should warm your heart.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We blend authentic Indian flavours with modern convenience,
              delivering freshly cooked meals to your doorstep.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/90 rounded-3xl p-8 shadow-xl border border-orange-100"
          >
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Why Choose Us?
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>🍛 Authentic home-style Indian recipes</li>
              <li>🔥 Freshly cooked, never frozen</li>
              <li>🚀 Fast & reliable delivery</li>
              <li>❤️ Cooked with love & hygiene</li>
            </ul>
          </motion.div>
        </div>

        {/* 📊 Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-orange-100"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shadow">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-2xl font-bold text-gray-800">{s.value}</h4>
                <p className="text-gray-600 text-sm">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 🕰️ Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our <span className="text-orange-600">Journey</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex gap-6 items-start"
              >
                <div className="text-orange-600 font-bold text-xl">
                  {t.year}
                </div>
                <div className="bg-white rounded-xl p-5 shadow border border-orange-100">
                  <p className="text-gray-700">{t.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 👨‍🍳 Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our <span className="text-orange-600">Chefs</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center text-2xl font-bold shadow">
                  {m.name[0]}
                </div>
                <h4 className="font-semibold text-lg">{m.name}</h4>
                <p className="text-sm text-gray-600">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 🚀 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-12 text-white shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Taste the Love? 😋
          </h2>
          <p className="mb-6 italic">
            Order now and enjoy authentic Indian flavours at home.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3 bg-white text-orange-600 rounded-full font-semibold shadow-lg hover:scale-105 transition"
          >
            Explore Menu
          </button>
        </motion.div>

      </div>
    </section>
  );
}
