import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "";

export default function ReviewPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!productId) return;

    axios
      .get(`${API}/api/products/${productId}`)
      .then(res => setProduct(res.data.product))
      .catch(() => setProduct(null));
  }, [productId]);

  /* ================= SUBMIT REVIEW ================= */
  const submit = async () => {
    if (!rating) {
      alert("Rating is required");
      return;
    }

    setLoading(true);

    try {
      // 🟢 TRY CREATE FIRST
      await axios.post(
        `${API}/api/reviews/${productId}`,
        { rating, comment },
        { withCredentials: true }
      );

      alert("Review submitted");
      navigate(-1);

    } catch (err) {
      // 🔁 IF ALREADY EXISTS → UPDATE
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes("already reviewed")
      ) {
        try {
          await axios.put(
            `${API}/api/reviews/${productId}`,
            { rating, comment },
            { withCredentials: true }
          );

          alert("Review updated");
          navigate(-1);
        } catch {
          alert("Failed to update review");
        }
      } else {
        alert(err.response?.data?.message || "Failed to save review");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  if (!productId) {
    return <p className="p-6 text-red-600">Invalid product</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-1">
        Write Review
      </h2>

      {product && (
        <p className="text-sm text-gray-500 mb-4">
          {product.name}
        </p>
      )}

      {/* ⭐ RATING */}
      <label className="block text-sm font-medium mb-1">
        Rating
      </label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      >
        {[5,4,3,2,1].map(n => (
          <option key={n} value={n}>
            {n} Star{n > 1 && "s"}
          </option>
        ))}
      </select>

      {/* 💬 COMMENT */}
      <label className="block text-sm font-medium mb-1">
        Comment
      </label>
      <textarea
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 mb-6"
        placeholder="Share your experience..."
      />

      {/* 🚀 SUBMIT */}
      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-70"
      >
        {loading ? "Saving..." : "Submit Review"}
      </button>
    </div>
  );
}
