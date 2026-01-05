import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
} from "lucide-react";
import Reviews from "../User-Components/ReviewSection.jsx";

const API = "";
const AUTO_SLIDE_INTERVAL = 4000; // 4 sec

export default function FoodViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const startX = useRef(0);
  const sliderRef = useRef(null);

  /* ================= FETCH PRODUCT + RELATED ================= */
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`${API}/api/products/${id}`);
        const product = res.data.product || res.data.food || res.data;

        setFood(product);

        // set primary image first
        const primaryIndex = product.images?.findIndex(i => i.isPrimary);
        setActiveImage(primaryIndex >= 0 ? primaryIndex : 0);

        const allRes = await axios.get(`${API}/api/products`);
        const all = allRes.data.products || [];

        setRelated(
          all.filter(
            (p) =>
              p._id !== product._id &&
              p.category === product.category
          ).slice(0, 8)
        );
      } catch (err) {
        console.error("Failed to fetch food", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  /* ================= DEFAULT VARIANT SELECTION ================= */
useEffect(() => {
  if (food?.variants?.length > 0) {
    const def =
      food.variants.find((v) => v.isDefault) || food.variants[0];

    // normalize variant (VERY IMPORTANT)
    setSelectedVariant(def);

  } else {
    setSelectedVariant(null);
  }
}, [food]);

  
  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (!food?.images || food.images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveImage((prev) =>
        (prev + 1) % food.images.length
      );
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [food]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!food)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Item not found
      </div>
    );

  /* ================= DERIVED ================= */
  const hasVariants = food.variants?.length > 0;
  const hasImages = food.images?.length > 0;
  const isCombo = food.category === "party-combo";
  const isVeg = food.foodType === "veg";

  const displayPrice = hasVariants
  ? Number(selectedVariant?.finalPrice ?? selectedVariant?.price)
  : Number(food.finalPrice ?? food.price);






  /* ================= SWIPE HANDLERS ================= */
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      setActiveImage((i) =>
        (i + 1) % food.images.length
      );
    } else {
      setActiveImage((i) =>
        i === 0 ? food.images.length - 1 : i - 1
      );
    }
  };

  

  /* ================= CART ================= */
  const getEffectivePrice = () => {
  if (hasVariants) {
    return Number(
      selectedVariant?.finalPrice ??
      selectedVariant?.price ??
      0
    );
  }

  return Number(
    food.finalPrice ??
    food.price ??
    0
  );
};

const addToCart = () => {
  if (hasVariants && !selectedVariant) {
    alert("Please select a variant");
    return;
  }

  const price = getEffectivePrice();

  if (!price || isNaN(price)) {
    console.error("PRICE ERROR", { food, selectedVariant });
    alert("Price error. Please refresh.");
    return;
  }


  const cartItemId = hasVariants
    ? `${food._id}_${selectedVariant._id}`
    : food._id;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const index = cart.findIndex(
    (item) => item.cartItemId === cartItemId
  );

  if (index > -1) {
    cart[index].qty += qty;
  } else {
    cart.push({
      cartItemId,
      productId: food._id,
      variantId: selectedVariant?._id || null,
      name: hasVariants
        ? `${food.name} (${selectedVariant.name})`
        : food.name,
      image:
        food.images?.find((i) => i.isPrimary)?.url ||
        food.images?.[0]?.url ||
        food.image,
      qty,
      price, // ✅ single source of truth
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  const avgRating = food.rating || 4.5;
  const reviewsCount = food.totalReviews || 0;

  return (
    <section className="min-h-screen pt-28 pb-16 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 px-4">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* ================= TOP ================= */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* IMAGE SLIDER */}
          <div
            ref={sliderRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative flex flex-col items-center"
          >
            <div className="absolute w-72 h-72 bg-orange-400/40 blur-3xl rounded-full" />

            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={
                  hasImages
                    ? food.images[activeImage]?.url
                    : food.image
                }
                alt={food.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-80 h-80 object-contain rounded-2xl cursor-zoom-in hover:scale-110 transition-transform"
              />
            </AnimatePresence>

            {/* THUMBNAILS */}
            {hasImages && food.images.length > 1 && (
              <div className="mt-6 flex gap-3 z-10">
                {food.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 ${
                      idx === activeImage
                        ? "border-orange-500 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold text-gray-800">
                {food.name}
              </h2>
              <span
                className={`w-3 h-3 rounded-full ${
                  isVeg ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({reviewsCount} reviews)
              </span>
            </div>

            <p className="text-gray-600 mb-6">
              {food.description}
            </p>

            {/* VARIANTS */}
            {hasVariants && (
              <div className="mb-6">
                <p className="font-semibold mb-2">Select Option</p>
                <div className="flex flex-wrap gap-3">
                  {food.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setSelectedVariant(v)
                      }

                      className={`px-4 py-2 rounded-xl border ${
                        selectedVariant?.name === v.name
                          ? "bg-orange-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      {v.name} – ₹{v.finalPrice || v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PARTY COMBO ITEMS */}
            {isCombo && food.comboItems?.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">
                  Included in this combo
                </h4>
                <ul className="list-disc list-inside text-gray-600">
                  {food.comboItems.map((c, i) => (
                    <li key={i}>
                      {c.itemName}
                      {c.quantity && ` (${c.quantity})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-3xl font-bold text-orange-600 mb-6">
              ₹{hasVariants ? getEffectivePrice() : food.finalPrice ?? food.price}
            </p>

            {/* QTY */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-orange-100 text-orange-600"
              >
                <Minus />
              </button>
              <span className="text-xl font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-full bg-orange-600 text-white"
              >
                <Plus />
              </button>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                disabled={hasVariants && !selectedVariant}
                onClick={addToCart}
                className={`flex-1 py-3 rounded-xl font-semibold ${
                  hasVariants && !selectedVariant
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white border border-orange-500 text-orange-600"
                }`}
              >
                <ShoppingCart className="inline mr-2" />
                Add to Cart
              </button>

              <button
                onClick={buyNow}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold"
              >
                <Zap className="inline mr-2" />
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>

        {/* ================= RELATED ================= */}
        <div>
          <h3 className="text-2xl font-bold mb-6">
            You may also <span className="text-orange-600">like</span>
          </h3>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {related.map((f) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                key={f._id}
                onClick={() => navigate(`/food/${f._id}`)}
                className="min-w-[200px] bg-white rounded-2xl shadow-lg p-4 cursor-pointer"
              >
                <img
                  src={
                    f.images?.find((i) => i.isPrimary)?.url ||
                    f.images?.[0]?.url ||
                    f.image
                  }
                  alt={f.name}
                  className="h-32 w-full object-contain mb-3"
                />
                <p className="font-semibold">{f.name}</p>
                <p className="text-orange-600 font-bold">
                  ₹{f.finalPrice || f.price}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="max-w-6xl mx-auto mt-16">
        <Reviews productId={food._id} />
      </div>
    </section>
  );
}
