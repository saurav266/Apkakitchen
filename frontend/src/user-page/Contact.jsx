import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import Footer from "../User-Components/Footer.jsx";


export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      alert("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-20 overflow-hidden">
      {/* 🌈 Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 bg-red-300/30 rounded-full blur-3xl" />
      </div>

      {/* 🧩 Subtle Food Pattern SVG */}
      <svg
        className="absolute inset-0 -z-10 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="food-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            <text x="10" y="40" fontSize="28">🍛</text>
            <text x="60" y="90" fontSize="24">🥘</text>
            <text x="80" y="30" fontSize="22">🍲</text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#food-pattern)" />
      </svg>

      <div className="max-w-7xl mx-auto px-6">

        {/* 🏷️ Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Get in <span className="text-orange-600">Touch</span>
          </h1>
          <p className="mt-3 text-gray-600 italic text-lg">
            We’d love to hear from you — let’s talk food! 🍛
          </p>
          {/* Divider */}
          <div className="mt-5 flex justify-center">
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500" />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ✍️ Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8 md:p-10 border border-white/40"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "Your Name", name: "name", type: "text", placeholder: "Enter your name" },
                { label: "Email Address", name: "email", type: "email", placeholder: "Enter your email" },
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-sm text-gray-600">{f.label}</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name={f.name}
                    type={f.type}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm text-gray-600">Message</label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  rows="4"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  className="mt-1 w-full px-4 py-3 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Gradient Border Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="relative w-full p-[2px] rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              >
                <span className="flex items-center justify-center gap-2 w-full bg-white text-orange-600 px-6 py-3 rounded-full font-semibold shadow-lg">
                  <Send className="w-5 h-5" />
                  {loading ? "Sending..." : "Send Message"}
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* 📍 Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >

            <InfoCard icon={MapPin} title="Our Address">
              Purulia Road, Near AG Church,<br />
              Kanta Toli, Ranchi – 834001,<br />
              Jharkhand, India
            </InfoCard>

            <InfoCard icon={Phone} title="Call Us">
              <a href="tel:+918709935537" className="hover:text-orange-600 block">
                +91 87099 35537
              </a>
              <a href="tel:+917352310303" className="hover:text-orange-600 block">
                +91 73523 10303
              </a>
            </InfoCard>

            <InfoCard icon={Mail} title="Email Us">
              <a
                href="mailto:apkakitchen.ranchi@gmail.com"
                className="hover:text-orange-600"
              >
                apkakitchen.ranchi@gmail.com
              </a>
            </InfoCard>

            {/* WhatsApp Card */}
            <motion.a
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.03 }}
              href="https://wa.me/918709935537"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 bg-green-500 text-white p-5 rounded-2xl shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Chat on WhatsApp</h3>
                <p className="text-sm text-white/90">
                  Get instant support from our team
                </p>
              </div>
            </motion.a>

            {/* 🗺️ Map with Overlay */}
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100 h-60 group">
              <iframe
                title="Apna Kitchen Location"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Purulia%20Road%20Near%20AG%20Church%20Kanta%20Toli%20Ranchi%20834001%20Jharkhand&t=&z=16&ie=UTF8&iwloc=&output=embed"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-semibold opacity-0 group-hover:opacity-100 transition">
                Find Us Here 📍
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: "0 20px 40px rgba(234,88,12,0.25)",
      }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 flex items-start gap-4"
    >
      {/* Icon Ring */}
      <div className="w-12 h-12 p-[2px] rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
        <div className="w-full h-full bg-white text-orange-600 rounded-xl flex items-center justify-center shadow">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {children}
        </p>
      </div>
    </motion.div>
  );
}
