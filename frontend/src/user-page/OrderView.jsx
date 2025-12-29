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
import LiveDeliveryMap from "../User-Components/LiveDeliveryMap.jsx";

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
  const [liveLocation, setLiveLocation] = useState(null);

  // refund

  const RefundBadge = ({ status }) => {
  if (!status || status === "none") return null;

  const map = {
    initiated: {
      text: "Refund Initiated",
      class: "bg-yellow-100 text-yellow-800"
    },
    completed: {
      text: "Refund Completed",
      class: "bg-green-100 text-green-800"
    },
    failed: {
      text: "Refund Failed",
      class: "bg-red-100 text-red-800"
    }
  };

  const cfg = map[status];
  if (!cfg) return null;

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${cfg.class}`}
    >
      {cfg.text}
    </span>
  );
};
const handleCancelOrder = async () => {
  const reason = prompt("Why are you cancelling this order?");
  if (!reason) return;

  try {
    await axios.patch(
      `${API}/api/users/order/${order._id}/cancel`,
      { reason },
      { withCredentials: true }
    );

    alert("Order cancelled successfully");
    fetchOrder();
  } catch (err) {
    alert(err.response?.data?.message || "Cancel failed");
  }
};

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

  /* ================= SOCKET EVENTS ================= */
useEffect(() => {
  socket.emit("join", {
    role: "user",
    orderId: id
  });

  socket.on("delivery:location:update", (data) => {
    console.log("📍 LOCATION RECEIVED", data);

    if (data.orderId === id) {
      setLiveLocation({
        lat: data.lat,
        lng: data.lng
      });
    }
  });

  return () => {
    socket.off("delivery:location:update");
  };
}, [id]);




  if (loading) return <p className="p-6">Loading order...</p>;
  if (!order) return <p className="p-6">Order not found</p>;

  const statusIndex = STATUS_FLOW.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-orange-50 p-6 max-w-3xl mx-auto">

      {/* HEADER */}
      <motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-2xl p-5 shadow mb-6 flex justify-between items-start"
>
  <div>
    <h1 className="text-2xl font-bold">
      Order #{order._id.slice(-6)}
    </h1>
    <p className="text-sm text-gray-500">
      {new Date(order.createdAt).toLocaleString()}
    </p>
  </div>

  <RefundBadge status={order.refundStatus} />
</motion.div>


      {/* STATUS */}
      <div className="bg-white rounded-2xl p-5 shadow mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Order Status
        </h3>

        {STATUS_FLOW.map((s, i) => (
          <div key={s} className="flex items-center gap-3 mb-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i <= statusIndex
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i <= statusIndex ? <CheckCircle size={16} /> : i + 1}
            </div>
            <p className="capitalize">{s.replaceAll("_", " ")}</p>
          </div>
        ))}
      </div>
      {order.orderStatus !== "delivered" &&
  order.orderStatus !== "cancelled" &&
  order.refundStatus === "none" && (
    <button
      onClick={() => handleCancelOrder()}
      className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold mb-6"
    >
      Cancel Order
    </button>
)}


      {/* LIVE MAP */}
      {order.orderStatus === "out_for_delivery" && (
        <div className="bg-white rounded-2xl p-5 shadow mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            Live Delivery Tracking
          </h3>

          <LiveDeliveryMap location={liveLocation} />
        </div>
      )}

      {/* DELIVERY DETAILS */}
      <div className="bg-white rounded-2xl p-5 shadow mb-6">
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {order.deliveryAddress}
        </p>

        {order.deliveryBoy && (
          <p className="mt-2 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {order.deliveryBoy.name} — {order.deliveryBoy.phone}
          </p>
        )}
      </div>
      {order.orderStatus === "placed" &&
 order.refundStatus === "none" && (
  <button
    onClick={handleCancelOrder}
    className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold mb-6"
  >
    Cancel Order
  </button>
)}

{order.refundStatus && order.refundStatus !== "none" && (
  <div className="bg-white rounded-2xl p-5 shadow mb-6">
    <h3 className="font-semibold mb-2 text-orange-600">
      Refund Details
    </h3>

    <p className="text-sm">
      Status: <b className="capitalize">{order.refundStatus}</b>
    </p>

    {order.refundAmount && (
      <p className="text-sm">
        Amount: ₹{order.refundAmount}
      </p>
    )}

    {order.refundId && (
      <p className="text-xs text-gray-500 mt-1">
        Refund ID: {order.refundId}
      </p>
    )}
  </div>
)}

{order.paymentMethod === "Online" &&
 order.paymentStatus === "paid" &&
 order.deliveryOtp &&
 !order.deliveryOtpVerified &&
 order.refundStatus === "none" &&
 order.orderStatus !== "cancelled" &&
 order.orderStatus !== "delivered" && (
  <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
    <p className="font-semibold text-green-700">
      Delivery OTP
    </p>

    <p className="text-3xl font-bold tracking-widest mt-1">
      {order.deliveryOtp}
    </p>

    <p className="text-sm text-gray-500 mt-1">
      Share this OTP with delivery partner to receive your order
    </p>
  </div>
)}



      {/* ITEMS */}
      <div className="bg-white rounded-2xl p-5 shadow">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-600" />
          Items
        </h3>

        {order.items.map((i, idx) => (
          <div key={idx} className="flex justify-between border-b py-2">
            <span>{i.name} × {i.quantity}</span>
            <span>₹{i.price * i.quantity}</span>
          </div>
        ))}

        <p className="text-right font-bold mt-3">
          Total ₹{order.totalAmount}
        </p>
      </div>
    </div>
  );
}
