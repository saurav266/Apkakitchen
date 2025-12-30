import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import Footer from "../User-Components/Footer.jsx";

const API = "http://localhost:3000/api/contact"; 
// 👉 in production change to https://apkakitchen.com/api/contact

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

  /* 🔗 BACKEND CONNECTED SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(API, form);

      if (data.success) {
        alert("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("❌ Failed to send message");
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "❌ Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-20 overflow-hidden">
        {/* background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-32 w-96 h-96 bg-red-300/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* heading */}
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
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* FORM */}
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
                <div>
                  <label className="text-sm text-gray-600">Your Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Message</label>
                  <textarea
                    rows="4"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    className="mt-1 w-full px-4 py-3 rounded-xl border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>

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

            {/* INFO SECTION (unchanged) */}
            <div className="space-y-6">
              <InfoCard icon={MapPin} title="Our Address">
                Purulia Road, Near AG Church,<br />
                Kanta Toli, Ranchi – 834001
              </InfoCard>

              <InfoCard icon={Phone} title="Call Us">
                +91 87099 35537<br />
                +91 73523 10303
              </InfoCard>

              <InfoCard icon={Mail} title="Email Us">
                apkakitchen.ranchi@gmail.com
              </InfoCard>

              <motion.a
                href="https://wa.me/918709935537"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-4 bg-green-500 text-white p-5 rounded-2xl shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Chat on WhatsApp</span>
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* INFO CARD */
function InfoCard({ icon: Icon, title, children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 flex gap-4"
    >
      <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600">{children}</p>
      </div>
    </motion.div>
  );
}
