import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function Contact() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-20">
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
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ✍️ Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 md:p-10 border border-orange-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Send us a message
            </h2>

            <form className="space-y-5">
              <div>
                <label className="text-sm text-gray-600">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Message</label>
                <textarea
                  rows="4"
                  placeholder="Write your message..."
                  className="mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <button
                type="button"
                className="
                  w-full flex items-center justify-center gap-2
                  px-6 py-3 rounded-full
                  bg-gradient-to-r from-orange-600 to-red-600
                  text-white font-semibold shadow-lg
                  hover:scale-[1.03] transition
                "
              >
                <Send className="w-5 h-5" /> Send Message
              </button>
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
            {[
              {
                icon: MapPin,
                title: "Our Location",
                desc: "Ranchi, Jharkhand, India",
              },
              {
                icon: Phone,
                title: "Call Us",
                desc: "+91 98765 43210",
              },
              {
                icon: Mail,
                title: "Email Us",
                desc: "support@apnakitchen.com",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="
                    bg-white/90 backdrop-blur
                    rounded-2xl p-6 shadow-lg
                    border border-orange-100
                    flex items-center gap-4
                  "
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shadow">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* 🗺️ Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100 h-60">
              <iframe
                title="map"
                className="w-full h-full border-0"
                loading="lazy"
                src="https://maps.google.com/maps?q=Ranchi,%20Jharkhand,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
