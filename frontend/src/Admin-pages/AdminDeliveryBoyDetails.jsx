import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

/* ======================================================
   MAIN COMPONENT
====================================================== */

export default function AdminDeliveryBoyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [boy, setBoy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/admin/delivery-boy/${id}`,
        { withCredentials: true }
      );
      setBoy(data.deliveryBoy);
    } catch {
      alert("Failed to load delivery boy details");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const deleteDeliveryBoy = async () => {
    try {
      setDeleting(true);
      await axios.delete(
        `http://localhost:3000/api/admin/delivery-boy/${boy._id}`,
        { withCredentials: true }
      );

      alert("Delivery boy deleted successfully ✅");
      navigate("/admin/delivery");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!boy) return <div className="p-10">No data found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            <Edit size={16} /> Edit
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        🚴 Delivery Boy Details
      </h1>

      {/* BASIC INFO */}
      <div className="grid md:grid-cols-3 gap-6">
        <InfoCard title="Name" value={boy.name} />
        <InfoCard title="Email" value={boy.email} />
        <InfoCard title="Phone" value={boy.phone} />
        <InfoCard title="Vehicle" value={boy.vehicleNumber} />
        <InfoCard title="Status" value={boy.status} />
        <InfoCard title="Aadhaar" value={`XXXX-XXXX-${boy.aadhaarLast4}`} />
      </div>

      {/* ADDRESSES */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <AddressCard title="📍 Current Address" address={boy.currentAddress} />
        <AddressCard title="🏠 Permanent Address" address={boy.permanentAddress} />
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <StatCard title="Total Orders" value={boy.totalOrders || 0} />
        <StatCard title="Total Earnings" value={`₹${boy.totalEarnings || 0}`} />
        <StatCard title="Joined On" value={boy.createdAt?.slice(0, 10)} />
      </div>

      {/* ORDERS */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">📦 Orders</h2>

        {boy.orders?.length ? (
          <div className="space-y-3">
            {boy.orders.map(order => (
              <div key={order._id} className="border p-4 rounded-lg">
                <p><b>Order ID:</b> #{order._id.slice(-6)}</p>
                <p><b>Amount:</b> ₹{order.totalAmount}</p>
                <p><b>Status:</b> {order.orderStatus}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No orders yet</p>
        )}
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <EditDeliveryBoyModal
          boy={boy}
          onClose={() => setShowEdit(false)}
          onUpdated={fetchDetails}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <ConfirmDeleteModal
          name={boy.name}
          deleting={deleting}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={deleteDeliveryBoy}
        />
      )}
    </div>
  );
}

/* ======================================================
   EDIT MODAL
====================================================== */

function EditDeliveryBoyModal({ boy, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: boy.name,
    phone: boy.phone,
    vehicleNumber: boy.vehicleNumber,
    status: boy.status,
    currentAddress: boy.currentAddress || {},
    permanentAddress: boy.permanentAddress || {}
  });

  const submit = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/delivery-boy/${boy._id}`,
        form,
        { withCredentials: true }
      );
      alert("Updated successfully ✅");
      onUpdated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleAddress = (type, field, value) => {
    setForm({
      ...form,
      [type]: {
        ...form[type],
        [field]: value
      }
    });
  };

  return (
    <ModalWrapper>
      <h2 className="text-xl font-bold mb-4">Edit Delivery Boy</h2>

      {["name", "phone", "vehicleNumber"].map(f => (
        <input
          key={f}
          value={form[f]}
          onChange={e => setForm({ ...form, [f]: e.target.value })}
          className="w-full border p-2 rounded mb-3"
          placeholder={f}
        />
      ))}

      <select
        value={form.status}
        onChange={e => setForm({ ...form, status: e.target.value })}
        className="w-full border p-2 rounded mb-4"
      >
        <option value="available">Available</option>
        <option value="busy">Busy</option>
        <option value="offline">Offline</option>
      </select>

      {["currentAddress", "permanentAddress"].map(type => (
        <div key={type} className="mb-4">
          <h3 className="font-semibold mb-2">
            {type === "currentAddress" ? "Current Address" : "Permanent Address"}
          </h3>
          {["addressLine", "city", "state", "pincode"].map(f => (
            <input
              key={f}
              value={form[type][f] || ""}
              onChange={e => handleAddress(type, f, e.target.value)}
              className="w-full border p-2 rounded mb-2"
              placeholder={f}
            />
          ))}
        </div>
      ))}

      <div className="flex gap-3">
        <button onClick={submit} className="flex-1 bg-orange-600 text-white py-2 rounded">
          Save
        </button>
        <button onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">
          Cancel
        </button>
      </div>
    </ModalWrapper>
  );
}

/* ======================================================
   REUSABLE COMPONENTS
====================================================== */

function InfoCard({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-orange-50 border rounded-xl p-4 text-center">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-orange-600">{value}</p>
    </div>
  );
}

function AddressCard({ title, address }) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <h3 className="font-semibold mb-2">{title}</h3>
      {address ? (
        <p className="text-sm">
          {address.addressLine}<br />
          {address.city}, {address.state}<br />
          Pincode: {address.pincode}
        </p>
      ) : (
        <p className="text-gray-500 text-sm">No address</p>
      )}
    </div>
  );
}

function ConfirmDeleteModal({ name, deleting, onCancel, onConfirm }) {
  return (
    <ModalWrapper>
      <h2 className="text-xl font-bold text-red-600 mb-3">Delete Delivery Boy</h2>
      <p className="mb-6">
        Are you sure you want to delete <b>{name}</b>?<br />
        This action cannot be undone.
      </p>
      <div className="flex gap-4">
        <button onClick={onCancel} className="flex-1 bg-gray-200 py-2 rounded">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 bg-red-600 text-white py-2 rounded"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </ModalWrapper>
  );
}

function ModalWrapper({ children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}