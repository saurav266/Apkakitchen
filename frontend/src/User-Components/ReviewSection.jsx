import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API = "http://localhost:3000";

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });
  const [totalStats, setTotalStats] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  /* 🔄 Fetch reviews */
  const fetchReviews = async () => {
    const res = await axios.get(`${API}/api/reviews/${productId}`);
    if (res.data.success) setReviews(res.data.reviews);
  };

  /* 📊 Fetch rating stats */
  const fetchStats = async () => {
    const res = await axios.get(`${API}/api/reviews/${productId}/stats`);
    if (res.data.success) {
      setDistribution(res.data.distribution);
      setTotalStats(res.data.total);
    }
  };

  /* 🔐 Check purchase */
  const checkCanReview = async () => {
    if (!user) return;
    const res = await axios.get(
      `${API}/api/reviews/can-review/${productId}`,
      { withCredentials: true }
    );
    setCanReview(res.data.canReview);
  };

  useEffect(() => {
    fetchReviews();
    fetchStats();
    checkCanReview();
  }, [productId]);

  /* ➕ Submit review */
  const submitReview = async () => {
    if (!comment.trim()) return alert("Please write a comment");

    try {
      setLoading(true);
      await axios.post(
        `${API}/api/reviews/${productId}`,
        { rating, comment },
        { withCredentials: true }
      );
      setComment("");
      fetchReviews();
      fetchStats();
    } catch (err) {
      alert("You already reviewed this product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-20">
      <h3 className="text-3xl font-bold mb-8">
        Customer <span className="text-orange-600">Reviews</span>
      </h3>

      {/* ⭐ Rating Distribution */}
      {totalStats > 0 && (
        <div className="bg-white/80 rounded-2xl shadow p-6 mb-12">
          {[5,4,3,2,1].map((star) => (
            <div key={star} className="flex items-center gap-4 mb-2">
              <span className="w-10">{star} ★</span>
              <div className="flex-1 bg-gray-200 h-2 rounded-full">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(distribution[star] / totalStats) * 100}%` }}
                />
              </div>
              <span className="w-8 text-sm">{distribution[star]}</span>
            </div>
          ))}
        </div>
      )}

      {/* ✍️ Review Form */}
      {user && canReview && (
        <motion.div className="bg-white/80 rounded-2xl shadow p-6 mb-14">
          <h4 className="font-semibold mb-4">Write a Review</h4>

          <div className="flex gap-1 mb-4">
            {[1,2,3,4,5].map((i) => (
              <button
                key={i}
                onClick={() => setRating(i)}
                className={`text-3xl ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full border rounded-xl p-3 mb-4"
          />

          <button
            onClick={submitReview}
            disabled={loading}
            className="px-6 py-2 rounded-full bg-orange-600 text-white"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </motion.div>
      )}

      {/* 🛒 Purchase to Review */}
      {totalStats !== null && totalStats > 0 && (
        <div className="mb-10 text-sm text-gray-600 italic">
          Purchase & receive this item to add a review.
        </div>
      )}

      {/* 📝 Reviews List */}
      <div className="space-y-5">
        {reviews.map((r) => (
          <motion.div key={r._id} className="bg-white rounded-2xl shadow p-5">
            <div className="flex justify-between mb-2">
              <h4 className="font-semibold">{r.name}</h4>
              <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
            </div>
            {r.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ✔ Verified Order
              </span>
            )}
            <p className="text-gray-600 text-sm mt-2">{r.comment}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
