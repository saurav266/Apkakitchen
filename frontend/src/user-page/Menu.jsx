import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MiniCart from "../User-Components/MiniCart.jsx";

// images
import pizzaImg from "../assets/hero-section/pizza.png";
import vegThali from "../assets/hero-section/veg-thali.png";
import briyaniImg from "../assets/hero-section/biryani.png";

const categories = [
  { id: "all", name: "All" },
  { id: "pizza", name: "Pizza" },
  { id: "thali", name: "Veg Thali" },
  { id: "biryani", name: "Biryani" },
];

const menuData = [
  { id: 1, name: "Margherita Pizza", desc: "Classic cheese & basil", price: 299, img: pizzaImg, cat: "pizza", type: "veg", rating: 4.5 },
  { id: 2, name: "Farmhouse Pizza", desc: "Veg loaded delight", price: 379, img: pizzaImg, cat: "pizza", type: "veg", rating: 4.7 },
  { id: 3, name: "Veg Thali", desc: "Dal, sabzi, roti, rice", price: 249, img: vegThali, cat: "thali", type: "veg", rating: 4.6 },
  { id: 4, name: "Paneer Thali", desc: "Rich paneer curry", price: 299, img: vegThali, cat: "thali", type: "veg", rating: 4.8 },
  { id: 5, name: "Chicken Dum Biryani", desc: "Slow cooked & aromatic", price: 349, img: briyaniImg, cat: "biryani", type: "nonveg", rating: 4.9 },
  { id: 6, name: "Veg Biryani", desc: "Aromatic veg rice", price: 299, img: briyaniImg, cat: "biryani", type: "veg", rating: 4.4 },
];

export default function Menu() {
  const [activeCat, setActiveCat] = useState("all");
  const [foodType, setFoodType] = useState("all"); // all | veg | nonveg
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [miniOpen, setMiniOpen] = useState(false);
  const catRef = useRef(null);

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(c);
  }, []);

  const updateCart = (item, delta) => {
    let c = [...cart];
    const found = c.find((i) => i.id === item.id);
    if (found) {
      found.qty += delta;
      if (found.qty <= 0) c = c.filter((i) => i.id !== item.id);
    } else if (delta > 0) {
      c.push({ ...item, qty: 1 });
    }
    setCart(c);
    localStorage.setItem("cart", JSON.stringify(c));
    window.dispatchEvent(new Event("cartUpdated"));
    setMiniOpen(true);
  };

  const getQty = (id) => cart.find((i) => i.id === id)?.qty || 0;

  const filtered = menuData.filter((i) => {
    const matchCat = activeCat === "all" || i.cat === activeCat;
    const matchType = foodType === "all" || i.type === foodType;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            Our <span className="text-orange-600">Menu</span>
          </h1>
          <p className="mt-2 italic text-gray-600">
            Swipe, choose, and enjoy hot food.
          </p>
        </div>

        {/* Search + Veg Toggle */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2.5 rounded-full
                border border-orange-200 focus:outline-none
                focus:ring-2 focus:ring-orange-400
              "
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* Veg / Nonveg Filter */}
          <div className="flex gap-3">
            {["all", "veg", "nonveg"].map((t) => (
              <button
                key={t}
                onClick={() => setFoodType(t)}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium transition
                  ${
                    foodType === t
                      ? t === "veg"
                        ? "bg-green-500 text-white"
                        : t === "nonveg"
                        ? "bg-red-500 text-white"
                        : "bg-orange-500 text-white"
                      : "bg-white/80 text-gray-700 hover:bg-orange-100"
                  }
                `}
              >
                {t === "all" ? "All" : t === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
              </button>
            ))}
          </div>
        </div>

        {/* Swipe Categories */}
        <div
          ref={catRef}
          className="flex gap-3 overflow-x-auto pb-3 mb-10 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`
                shrink-0 px-6 py-2.5 rounded-full font-medium transition
                ${
                  activeCat === cat.id
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                    : "bg-white/80 text-gray-700"
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat + foodType + search}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((item) => {
              const qty = getQty(item.id);
              const isVeg = item.type === "veg";
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6 }}
                  className={`
                    bg-white/90 rounded-2xl shadow-lg overflow-hidden flex flex-col
                    border-2
                    ${isVeg ? "border-green-200" : "border-red-200"}
                  `}
                >
                  {/* Image */}
                  <div className="h-48 bg-orange-50 flex items-center justify-center overflow-hidden relative">
                    {/* Veg/Nonveg Icon */}
                    <span
                      className={`
                        absolute top-3 right-3 flex items-center gap-1
                        text-xs font-semibold px-2 py-1 rounded-full
                        ${isVeg ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                      `}
                    >
                      <span className="w-2 h-2 rounded-full bg-white" />
                      {isVeg ? "VEG" : "NON-VEG"}
                    </span>

                    <motion.img
                      src={item.img}
                      alt={item.name}
                      className="h-40 object-contain"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.desc}</p>

                    {/* Rating */}
                    <div className="text-yellow-500 text-sm mb-3">
                      {"★".repeat(Math.floor(item.rating))}{" "}
                      <span className="text-gray-500">
                        {item.rating.toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{item.price}
                      </span>

                      {/* Qty Controls */}
                      {qty === 0 ? (
                        <button
                          onClick={() => updateCart(item, 1)}
                          className="
                            px-4 py-2 rounded-full text-sm font-medium
                            bg-gradient-to-r from-orange-500 to-red-500
                            text-white shadow
                          "
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateCart(item, -1)}
                            className="w-8 h-8 rounded-full bg-gray-200 text-lg"
                          >
                            −
                          </button>
                          <span className="font-semibold">{qty}</span>
                          <button
                            onClick={() => updateCart(item, 1)}
                            className="w-8 h-8 rounded-full bg-orange-500 text-white text-lg"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-gray-600 mt-16">
            No items match your filters.
          </p>
        )}
      </div>

      {/* Mini Cart */}
      <MiniCart
        open={miniOpen}
        cart={cart}
        onClose={() => setMiniOpen(false)}
      />
    </section>
  );
}
