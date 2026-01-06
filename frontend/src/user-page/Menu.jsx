import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MiniCart from "../User-Components/MiniCart.jsx";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";

const API = "http://localhost:3000";

const categories = [
  { id: "all", name: "All" },
  { id: "thali", name: "Thali" },
  { id: "biryani", name: "Biryani" },
  { id: "chinese", name: "Chinese" },
  { id: "indian", name: "Indian" },
  { id: "desserts", name: "Desserts" },
  { id: "party-combo", name: "Party Combo" },
];

export default function Menu() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeCat, setActiveCat] = useState("all");
  const [foodType, setFoodType] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [miniOpen, setMiniOpen] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const catRef = useRef(null);

  /* ================= FETCH FROM BACKEND ================= */
  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      if (res.data.success) {
        setMenuData(res.data.products);
      }
    } catch (err) {
      console.error("Failed to fetch menu", err);
    }
  };
  const getImage = (item) =>
    item.images?.find((img) => img.isPrimary)?.url ||
    item.images?.[0]?.url ||
    "/placeholder-food.png";


  const getDisplayVariant = (product) => {
    if (!product.hasVariants || !product.variants?.length) {
      return {
        price: product.finalPrice ?? product.price ?? 0,
        label: product.name,
      };
    }

    // find default variant
    const variant =
      product.variants.find((v) => v.isDefault) || product.variants[0];

    return {
      price: variant.finalPrice ?? variant.price,
      label: `${product.name} (${variant.name})`,
      variantId: variant._id,
    };
  };




  //helpers
  const syncCart = (updated) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));

    setMiniOpen(true);
    setTimeout(() => setMiniOpen(false), 2000);
  };

  useEffect(() => {
    fetchMenu();
    const c = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(c);
  }, []);

  useEffect(() => {
  console.log("miniOpen:", miniOpen);
}, [miniOpen]);

  /* ================= CART ================= */
  const updateCart = (item, delta) => {
    const display = getDisplayVariant(item);

    const cartItemId = display.variantId
      ? `${item._id}_${display.variantId}`
      : item._id;

    let updated = [...cart];
    const index = updated.findIndex(
      (i) => i.cartItemId === cartItemId
    );

    const wasExisting = index > -1;
    let newQty = 0;

    if (index > -1) {
      updated[index].qty += delta;
      newQty = updated[index].qty;
      if (updated[index].qty <= 0) {
        updated.splice(index, 1);
        newQty = 0;
      }
    } else if (delta > 0) {
      updated.push({
        cartItemId,
        productId: item._id,
        variantId: display.variantId || null,
        name: display.label,
        image: getImage(item),
        finalPrice: display.price,
        qty: 1,
      });
      newQty = 1;
    }

    syncCart(updated);

    // Backend sync if logged in
    if (user) {
      if (wasExisting) {
        if (newQty <= 0) {
          // remove
          axios.delete(`${API}/api/cart/remove/${cartItemId}`, { withCredentials: true }).catch(err => console.error("Failed to remove from cart", err));
        } else {
          // update
          axios.patch(`${API}/api/cart/update`, { cartItemId, qty: newQty }, { withCredentials: true }).catch(err => console.error("Failed to update cart", err));
        }
      } else if (delta > 0) {
        // add
        const newItem = updated.find(i => i.cartItemId === cartItemId);
        axios.post(`${API}/api/cart/add`, {
          productId: newItem.productId,
          variantId: newItem.variantId,
          name: newItem.name,
          image: newItem.image,
          price: newItem.finalPrice,
          qty: newItem.qty
        }, { withCredentials: true }).catch(err => console.error("Failed to add to cart", err));
      }
    }
  };

  const getQty = (product) => {
  const display = getDisplayVariant(product);
  const cartItemId = display.variantId
    ? `${product._id}_${display.variantId}`
    : product._id;

  return cart.find((i) => i.cartItemId === cartItemId)?.qty || 0;
};




  /* ================= FILTER ================= */
  const filtered = menuData.filter((i) => {
  const matchCat =
    activeCat === "all" || i.category === activeCat;

  // 🔥 FIX: If category is "thali", ignore foodType filter
  const matchType =
    activeCat === "thali"
      ? true
      : foodType === "all" ||
        i.foodType === (foodType === "nonveg" ? "non-veg" : foodType);

  const matchSearch = i.name
    .toLowerCase()
    .includes(search.toLowerCase());

  return matchCat && matchType && matchSearch && i.isAvailable;
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
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

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

        {/* Categories */}
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
              const display = getDisplayVariant(item);   // ✅ HERE
              const qty = getQty(item);                  // ✅ HERE
              const isVeg = item.foodType === "veg";

              return (
                <motion.div
                  key={item._id}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/food/${item._id}`)}
                  className={`
                    bg-white/90 rounded-2xl shadow-lg overflow-hidden flex flex-col
                    border-2 cursor-pointer 
                    ${isVeg ? "border-green-200" : "border-red-200"}
                  `}
                >
                  {/* IMAGE */}
                  <div className="h-48 bg-orange-50 relative overflow-hidden">
                    <span
                      className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full z-10
                      ${isVeg ? "bg-green-500" : "bg-red-500"} text-white`}
                    >
                      {isVeg ? "VEG" : "NON-VEG"}
                    </span>

                    <motion.img
                      src={getImage(item)}
                      alt={item.name}
                      className="h-48 w-full object-cover"
                      whileHover={{ scale: 1.15 }}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold">
                      {display.label}
                    </h3>

                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        ₹{display.price}
                      </span>

                      {qty === 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCart(item, 1);
                          }}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCart(item, -1);
                            }}
                            className="w-8 h-8 rounded-full bg-gray-200"
                          >
                            −
                          </button>
                          <span className="font-semibold">{qty}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCart(item, 1);
                            }}
                            className="w-8 h-8 rounded-full bg-orange-500 text-white"
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
