import { motion } from "framer-motion";
import { ChefHat, Heart, Flame, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import chefImg from "../assets/hero-section/chef.png";

export default function About() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: "10k+", label: "Happy Customers" },
    { icon: ChefHat, value: "15+", label: "Expert Chefs" },
    { icon: Flame, value: "50+", label: "Signature Dishes" },
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
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* 🏷️ Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            About <span className="text-orange-600">Apka Kitchen</span>
          </h1>
          <p className="mt-4 text-gray-600 italic text-lg max-w-2xl mx-auto">
            Serving comfort food that feels just like home.
          </p>
        </motion.div>

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
              Apka Kitchen began with one simple belief — food should not just
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
            className="flex justify-center"
          >
            <img
              src={chefImg}
              alt="Chef"
              className="h-80 md:h-96 object-contain drop-shadow-2xl"
            />
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
