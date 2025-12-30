import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useTheme } from "../context/Themecontext.jsx";

const API = "http://localhost:3000";
const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });


export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/delivery/orders/${id}`, {
      withCredentials: true
    }).then(res => setOrder(res.data.order));
  }, [id]);

  if (!order) {
    return <div className="p-6">Loading order...</div>;
  }

  return (
    <section
      className={`min-h-screen px-4 pt-6 pb-24 ${
        dark ? "bg-slate-900 text-white" : "bg-orange-50"
      }`}
    >
      <div className="max-w-md mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-bold">
            Order <span className="text-orange-600">Details</span>
          </h2>
        </div>

        {/* DELIVERED BADGE */}
        <div className="flex items-center justify-center gap-2
                        bg-green-100 text-green-700 py-3 rounded-xl font-semibold">
          <CheckCircle size={18} />
          Delivered Successfully
        </div>
        <div className="text-center text-sm text-gray-600">
  Delivered on <span className="font-semibold text-green-600">
    {formatDateTime(order.updatedAt)}
  </span>
</div>


        {/* ORDER INFO */}
        <div className="bg-white rounded-3xl p-6 shadow space-y-3">

          <p className="text-sm text-gray-400">
            Order #{order._id.slice(-6)}
          </p>

          <p className="font-semibold">
            {order.customerName}
          </p>

          <p className="text-sm text-gray-500">
            {order.customerPhone}
          </p>

          <p className="text-sm text-gray-500">
            {order.deliveryAddress}
          </p>

          <div className="border-t pt-3 space-y-2 text-sm">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-orange-600 pt-3">
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
