const reviews = [
  {
    name: "Rohit Sharma",
    text: "Best biryani in town! Hot & tasty every time.",
  },
  {
    name: "Anjali Verma",
    text: "Veg thali feels just like home food ❤️",
  },
  {
    name: "Aman Khan",
    text: "Fast delivery & amazing taste. Loved it!",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-orange-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">
          What Our <span className="text-orange-600">Customers Say</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <p className="italic text-gray-700 mb-4">“{r.text}”</p>
              <h4 className="font-semibold">{r.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
