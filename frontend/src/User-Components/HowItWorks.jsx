const steps = [
  { step: "1", title: "Choose Dish", desc: "Browse our tasty menu." },
  { step: "2", title: "Place Order", desc: "Order in just a few clicks." },
  { step: "3", title: "We Cook", desc: "Freshly prepared by our chefs." },
  { step: "4", title: "Fast Delivery", desc: "Hot food at your door." },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">
          How It <span className="text-orange-600">Works</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className="p-6 border rounded-2xl hover:shadow-lg transition"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
                {s.step}
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
