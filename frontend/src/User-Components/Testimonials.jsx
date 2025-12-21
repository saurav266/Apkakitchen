import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Rohit Sharma",
    text: "Best biryani in town! Hot & tasty every time. Feels like a festival in every bite.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Anjali Verma",
    text: "Veg thali feels just like home food ❤️ Fresh, comforting and full of flavours.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Aman Kumar",
    text: "Fast delivery & amazing taste. Loved it! Will order again for sure.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?img=56",
  },
  {
    name: "Neha Gupta",
    text: "Affordable prices and premium taste. The paneer dishes are my favorite!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=45",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  // 🔁 Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const review = reviews[index];

  return (
    <section className="relative py-28 bg-gradient-to-b from-orange-50 via-amber-50 to-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">

        {/* 🏷️ Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gray-800">
          What Our <span className="text-orange-600">Customers Say</span>
        </h2>

        {/* ✨ Glow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[200px] w-72 h-24 bg-orange-400/40 blur-3xl rounded-full" />

        {/* 💬 Testimonial Card */}
        <div className="relative flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="
                relative max-w-xl w-full
                bg-white/85 backdrop-blur-xl
                rounded-3xl p-10
                shadow-[0_25px_60px_rgba(255,140,60,0.35)]
                border border-orange-100
              "
            >
              {/* 👤 Avatar */}
              <div className="flex justify-center -mt-20 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-orange-400 blur-lg opacity-40" />
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                </div>
              </div>

              {/* Quote icon */}
              <Quote className="w-8 h-8 text-orange-400 mb-4 mx-auto" />

              {/* Text */}
              <p className="text-lg md:text-xl italic text-gray-700 leading-relaxed mb-6">
                “{review.text}”
              </p>

              {/* ⭐ Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Name */}
              <h4 className="text-lg font-semibold text-gray-800">
                {review.name}
              </h4>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 🔘 Dots */}
        <div className="flex justify-center gap-3 mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index
                  ? "bg-orange-600 scale-125"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
