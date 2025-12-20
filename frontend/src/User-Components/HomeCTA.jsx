import { useNavigate } from "react-router-dom";

export default function HomeCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white text-center">
      <h2 className="text-4xl font-bold mb-4">
        Hungry? Let’s Fix That! 😋
      </h2>
      <p className="mb-8 italic">
        Order now & enjoy authentic Indian flavours at home.
      </p>
      <button
        onClick={() => navigate("/menu")}
        className="px-8 py-3 bg-white text-orange-600 rounded-full font-semibold shadow-lg"
      >
        Explore Menu
      </button>
    </section>
  );
}
