import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  {
    id: 1,
    name: "Margherita Pizza",
    desc: "Classic cheese with fresh basil",
    price: 299,
    img: pizzaImg,
    cat: "pizza",
    type: "veg",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    desc: "Loaded with veggies & cheese",
    price: 379,
    img: pizzaImg,
    cat: "pizza",
    type: "veg",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Special Veg Thali",
    desc: "Dal, sabzi, roti, rice & sweets",
    price: 249,
    img: vegThali,
    cat: "thali",
    type: "veg",
    rating: 4.6,
  },
  {
    id: 4,
    name: "Paneer Thali",
    desc: "Rich paneer curry with sides",
    price: 299,
    img: vegThali,
    cat: "thali",
    type: "veg",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Hyderabadi Dum Biryani",
    desc: "Slow cooked chicken & spices",
    price: 349,
    img: briyaniImg,
    cat: "biryani",
    type: "nonveg",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Veg Biryani",
    desc: "Aromatic rice with vegetables",
    price: 299,
    img: briyaniImg,
    cat: "biryani",
    type: "veg",
    rating: 4.4,
  },
];

export default function Menu() {
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("all"); // all | veg | nonveg
  const [cart, setCart] = useState([]);

  // load cart
  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(c);
  }, []);

  const addToCart = (item) => {
    let c = [...cart];
    const found = c.find((i) => i.id === item.id);
    if (found) {
      found.qty += 1;
    } else {
      c.push({ ...item, qty: 1 });
    }
    setCart(c);
    localStorage.setItem("cart", JSON.stringify(c));
  };

  const filtered = menuData.filter((item) => {
    const matchCat = activeCat === "all" || item.cat === activeCat;
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchType =
      foodType === "all" || item.type === foodType;
    return matchCat && matchSearch && matchType;
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our <span className="text-orange-600">Menu</span>
          </h1>
          <p className="mt-2 text-gray-600 italic">
            Find your craving, we’ll serve it hot.
          </p>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          {/* Search */}
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full md:w-72 px-4 py-2.5 rounded-full
              border border-orange-200 focus:outline-none
              focus:ring-2 focus:ring-orange-400
            "
          />

          {/* Veg / Nonveg Toggle */}
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
                      : "bg-white/70 text-gray-700 hover:bg-orange-100"
                  }
                `}
              >
                {t === "all"
                  ? "All"
                  : t === "veg"
                  ? "🟢 Veg"
                  : "🔴 Non-Veg"}
              </button>
            ))}
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`
                px-6 py-2.5 rounded-full font-medium transition
                ${
                  activeCat === cat.id
                    ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
                    : "bg-white/70 text-gray-700 hover:bg-orange-100"
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* FOOD GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat + search + foodType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6 }}
                className="
                  bg-white/85 backdrop-blur
                  rounded-2xl shadow-lg overflow-hidden
                  flex flex-col
                "
              >
                {/* IMAGE */}
                <div className="h-48 bg-orange-50 flex items-center justify-center overflow-hidden">
                  <motion.img
                    src={item.img}
                    alt={item.name}
                    className="h-40 object-contain"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.type === "veg"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.type === "veg" ? "VEG" : "NON-VEG"}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
                    {"★".repeat(Math.floor(item.rating))}
                    <span className="text-gray-500 ml-1">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {item.desc}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-orange-600">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="
                        px-4 py-2 rounded-full text-sm font-medium
                        bg-gradient-to-r from-orange-500 to-red-500
                        text-white shadow
                        hover:scale-105 transition
                      "
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-600 mt-16">
            No items match your search.
          </p>
        )}
      </div>
    </section>
  );
}
