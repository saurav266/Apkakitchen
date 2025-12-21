import { motion } from "framer-motion";

export default function DeliveryOrders() {
  const orders = [
    { id: 101, address: "MG Road" },
    { id: 102, address: "Sector 18" }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <motion.div
            key={order.id}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-4 rounded shadow"
          >
            Order #{order.id} – {order.address}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
