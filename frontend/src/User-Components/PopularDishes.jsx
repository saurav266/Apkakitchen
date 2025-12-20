import { motion } from "framer-motion";
import pizzaImg from "../assets/hero-section/pizza.png";
import vegThali from "../assets/hero-section/veg-thali.png";
import briyaniImg from "../assets/hero-section/biryani.png";

const dishes = [
  { name: "Cheesy Pizza", price: "₹299", img: pizzaImg },
  { name: "Veg Thali", price: "₹249", img: vegThali },
  { name: "Chicken Biryani", price: "₹349", img: briyaniImg },
];

export default function PopularDishes() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">
          Customer <span className="text-orange-600">Favorites</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {dishes.map((d, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <img
                src={d.img}
                alt={d.name}
                className="h-44 mx-auto object-contain mb-4"
              />
              <h3 className="text-xl font-semibold">{d.name}</h3>
              <p className="text-orange-600 font-bold">{d.price}</p>
              <button className="mt-4 px-5 py-2 rounded-full bg-orange-600 text-white">
                Order Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
