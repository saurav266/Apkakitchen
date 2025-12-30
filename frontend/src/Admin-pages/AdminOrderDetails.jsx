import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [status, setStatus] = useState("");
  const [deliveryBoy, setDeliveryBoy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    fetchDeliveryBoys();
  }, []);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/admin/order/${id}`,
        { withCredentials: true }
      );
      setOrder(data.order);
      setStatus(data.order.orderStatus);
      setDeliveryBoy(data.order.deliveryBoy?._id || "");
    } catch {
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryBoys = async () => {
    const { data } = await axios.get(
      `${API}/api/admin/delivery-boys`,
      { withCredentials: true }
    );
    setDeliveryBoys(data.deliveryBoys);
  };

  const refundInProgress =
    order?.refundStatus && order.refundStatus !== "none";

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async () => {
    if (refundInProgress) return;

    await axios.put(
      `${API}/api/admin/order/${id}/status`,
      { status },
      { withCredentials: true }
    );

    alert("Order status updated");
    fetchOrder();
  };

  /* ================= ASSIGN DELIVERY ================= */
  const assignDeliveryBoy = async () => {
    if (!deliveryBoy || refundInProgress) return;

    await axios.put(
      `${API}/api/admin/order/${id}/assign`,
      { deliveryBoy },
      { withCredentials: true }
    );

    alert("Delivery boy assigned");
    fetchOrder();
  };

  /* ================= EDIT ITEM QTY ================= */
  const updateQty = (index, qty) => {
    const updated = [...order.items];
    updated[index].qty = qty;
    setOrder({ ...order, items: updated });
  };

  const saveEditedOrder = async () => {
    await axios.put(
      `${API}/api/admin/order/${id}/edit`,
      { items: order.items },
      { withCredentials: true }
    );
    alert("Order updated");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 mb-6"
      >
        <ArrowLeft /> Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Order #{order._id.slice(-6)}
      </h1>

      {/* REFUND INFO */}
      {order.refundStatus !== "none" && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6">
          <p className="font-semibold text-yellow-700">
            Refund Status:{" "}
            <span className="capitalize">{order.refundStatus}</span>
          </p>

          {order.refundAmount && (
            <p className="text-sm mt-1">
              Refund Amount: ₹{order.refundAmount}
            </p>
          )}

          {order.refundId && (
            <p className="text-xs text-gray-600 mt-1">
              Refund ID: {order.refundId}
            </p>
          )}
        </div>
      )}

      {/* CUSTOMER */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-2">Customer</h3>
        <p>Name: {order.customerName}</p>
        <p>Phone: {order.customerPhone}</p>
        <p>Payment: {order.paymentMethod}</p>
      </div>

      {/* CANCEL DETAILS */}
      {order.orderStatus === "cancelled" && (
        <div className="bg-red-50 border border-red-200 p-5 rounded-xl shadow mb-6">
          <h3 className="font-semibold mb-2 text-red-600">
            Cancellation Details
          </h3>
          <p>
            <b>Cancelled By:</b>{" "}
            <span className="capitalize">
              {order.cancelledBy || "Unknown"}
            </span>
          </p>
          <p className="mt-1">
            <b>Reason:</b> {order.cancelReason || "No reason provided"}
          </p>
        </div>
      )}

      {/* ITEMS */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-4">Items</h3>

        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{item.name}</span>

            <input
              type="number"
              value={item.qty}
              min="1"
              onChange={(e) => updateQty(i, +e.target.value)}
              disabled={refundInProgress}
              className="w-16 border rounded px-2 py-1"
            />

            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <button
          onClick={saveEditedOrder}
          disabled={refundInProgress}
          className={`mt-4 flex items-center gap-2 px-4 py-2 rounded text-white ${
            refundInProgress
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500"
          }`}
        >
          <Save /> Save Order Changes
        </button>
      </div>

      {/* STATUS UPDATE */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-2">Update Status</h3>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={refundInProgress}
          className={`border rounded px-3 py-2 ${
            refundInProgress ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          <option value="placed">Placed</option>
          <option value="preparing">Preparing</option>
          <option value="assigned">Assigned</option>
          <option value="out_for_delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          onClick={updateStatus}
          disabled={refundInProgress}
          className={`ml-3 px-4 py-2 rounded text-white ${
            refundInProgress
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500"
          }`}
        >
          Update
        </button>

        {refundInProgress && (
          <p className="text-sm text-gray-500 mt-2">
            Status update locked because refund is in progress.
          </p>
        )}
      </div>

      {/* ASSIGN DELIVERY */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Assign Delivery Boy</h3>

        <select
          value={deliveryBoy}
          onChange={(e) => setDeliveryBoy(e.target.value)}
          disabled={refundInProgress}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Delivery Boy</option>
          {deliveryBoys.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.phone})
            </option>
          ))}
        </select>

        <button
          onClick={assignDeliveryBoy}
          disabled={!deliveryBoy || refundInProgress}
          className={`ml-3 px-4 py-2 rounded text-white ${
            !deliveryBoy || refundInProgress
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500"
          }`}
        >
          Assign
        </button>

        {refundInProgress && (
          <p className="text-sm text-gray-500 mt-2">
            Delivery assignment disabled due to refund.
          </p>
        )}
      </div>
    </div>
  );
}
