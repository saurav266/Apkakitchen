import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CartPage() {
  const formatPrice = (n) =>
  Number(n || 0).toFixed(2);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch products from backend
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };
  fetchProducts();

  const c = JSON.parse(localStorage.getItem("cart")) || [];

  const normalized = c.map((item) => ({
    ...item,
    image:
      item.image ||
      item.images?.find((img) => img.isPrimary)?.url ||
      item.images?.[0]?.url ||
      "/placeholder-food.png",
    finalPrice: Number(item.finalPrice ?? item.price ?? 0),
    qty: Number(item.qty ?? 1),
  }));

  setCart(normalized);
  localStorage.setItem("cart", JSON.stringify(normalized));
}, []);


  // 🔹 Add product to cart
const addToCart = (product) => {
  let c = [...cart];
  const existing = c.find((i) => i._id === product._id);

  const price =
    product.finalPrice ??
    product.sale_price ??
    product.price ??
    0;

  const image =
    product.images?.find(img => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "/placeholder-food.png";

  if (existing) {
    existing.qty += 1;
  } else {
    c.push({
      _id: product._id,
      name: product.name,
      images: product.images,      // keep original
      image,                        // ✅ normalized image
      finalPrice: Number(price),
      qty: 1,
    });
  }

  setCart(c);
  localStorage.setItem("cart", JSON.stringify(c));
  window.dispatchEvent(new Event("cartUpdated"));
};

  // 🔹 Update quantity
  const updateQty = (id, delta) => {
    let c = [...cart];
    const item = c.find((i) => i._id === id);
    if (!item) return;

    item.qty += delta;
    c = c.filter((i) => i.qty > 0);

    setCart(c);
    localStorage.setItem("cart", JSON.stringify(c));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // 🔹 Remove item
  const removeItem = (id) => {
    const c = cart.filter((i) => i._id !== id);
    setCart(c);
    localStorage.setItem("cart", JSON.stringify(c));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // 🔹 Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

 const total = cart.reduce(
  (sum, i) => sum + Number(i.finalPrice ?? i.price ?? 0) * Number(i.qty ?? 1),
  0
);


  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Your <span className="text-orange-600">Cart</span>
        </h1>

        {/* 🛒 Cart Section */}
        {cart.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Your cart is empty.</p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-6 px-6 py-3 rounded-full bg-orange-500 text-white"
            >
              Go to Menu
            </button>
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow-lg p-6">
            {cart.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 border-b py-4 last:border-b-0"
              >
                {/* 🍽️ Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition"
                  />

                </div>

                {/* 📝 Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                 <p className="text-sm text-gray-500">
  ₹{item.finalPrice ?? item.price} each
</p>

                </div>

                {/* 🔢 Qty + Price + Remove */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item._id, -1)}
                      className="w-8 h-8 rounded-full bg-gray-200"
                    >
                      −
                    </button>
                    <span className="font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item._id, 1)}
                      className="w-8 h-8 rounded-full bg-orange-500 text-white"
                    >
                      +
                    </button>
                  </div>

                  <span className="w-20 text-right font-semibold text-gray-800">
  ₹{(item.finalPrice ?? item.price ?? 0) * item.qty}
</span>


                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}

            {/* TOTAL */}
            <div className="flex justify-between items-center mt-6 text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-600">₹{formatPrice(total)}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => navigate("/menu")}
                className="px-6 py-3 rounded-full bg-gray-200"
              >
                Add More
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleCheckout}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold shadow-lg"
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}