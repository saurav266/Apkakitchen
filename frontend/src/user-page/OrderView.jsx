import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Truck,
  Package
} from "lucide-react";
import { socket } from "../socket";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const STATUS_FLOW = [
  "placed",
  "preparing",
  "assigned",
  "out_for_delivery",
  "delivered"
];

export default function OrderView() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = async () => {
    const { data } = await axios.get(
      `${API}/api/users/order/${id}`,
      { withCredentials: true }
    );
    setOrder(data.order);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /* ================= SOCKET UPDATE ================= */
  useEffect(() => {
    socket.on("order-status-updated", (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(updatedOrder);
      }
    });

    return () => socket.off("order-status-updated");
  }, [id]);

  if (loading) return <p className="p-6">Loading order...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  const statusIndex = STATUS_FLOW.indexOf(order.orderStatus);

  const openMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        order.deliveryAddress
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 max-w-3xl mx-auto">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 shadow mb-6"
      >
        <h1 className="text-2xl font-bold">
          Order #{order._id.slice(-6)}
        </h1>
        <p className="text-sm text-gray-500">
          Placed on {new Date(order.createdAt).toLocaleString()}
        </p>
      </motion.div>

      {/* STATUS TRACKER */}
      <div className="bg-white rounded-2xl p-5 shadow mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Order Status
        </h3>

        <div className="space-y-4">
          {STATUS_FLOW.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i <= statusIndex
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i <= statusIndex ? <CheckCircle size={16} /> : i + 1}
              </div>

              <p
                className={`capitalize font-medium ${
                  i <= statusIndex
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {s.replaceAll("_", " ")}
              </p>
            </div>
          ))}

          {order.orderStatus === "cancelled" && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-600">
              ❌ Cancelled by {order.cancelledBy} — {order.cancelReason}
            </div>
          )}
        </div>
      </div>

      {/* DELIVERY INFO */}
      <div className="bg-white rounded-2xl p-5 shadow mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-600" />
          Delivery Details
        </h3>

        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          {order.deliveryAddress}
        </p>

        {order.deliveryBoy && (
          <>
            <p className="mt-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              {order.deliveryBoy.name} — {order.deliveryBoy.phone}
            </p>

            <button
              onClick={openMaps}
              className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-xl"
            >
              Track on Map
            </button>
          </>
        )}
      </div>

      {/* ITEMS */}
      <div className="bg-white rounded-2xl p-5 shadow">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-600" />
          Order Items
        </h3>

        {order.items.map((i, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>
              {i.name} × {i.quantity}
            </span>
            <span>₹{i.price * i.quantity}</span>
          </div>
        ))}

        <p className="text-right font-bold mt-3">
          Total: ₹{order.totalAmount}
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Payment: {order.paymentMethod}
        </p>
      </div>
    </div>
  );
}
