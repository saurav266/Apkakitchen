import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ================= ANIMATION CONFIG ================= */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" }
  }
};

/* ================= MAIN COMPONENT ================= */

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/profile", {
        withCredentials: true
      })
      .then(res => {
        setProfile(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Unauthorized");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-10"
    >
      {/* ================= HEADER ================= */}
      <motion.div
        variants={sectionVariants}
        className="
          relative overflow-hidden
          rounded-3xl
          bg-gradient-to-br from-red-600 via-red-500 to-yellow-400
          p-[2px]
          shadow-xl
        "
      >
        <div className="pt-20 bg-white/90 backdrop-blur-xl rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="
                w-24 h-24 rounded-full
                bg-gradient-to-br from-red-500 to-yellow-400
                p-1 shadow-lg
              "
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-red-600">
                {profile.name?.charAt(0)}
              </div>
            </motion.div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-gray-600">{profile.email}</p>

              <div className="flex gap-3 mt-3">
                <Badge label={profile.role} />
                <Badge
                  label={profile.verified ? "Verified" : "Not Verified"}
                  color={profile.verified ? "green" : "red"}
                />
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile/edit")}
            className="
              flex items-center gap-2
              px-6 py-3
              rounded-full
              bg-yellow-300 text-red-900
              font-semibold
              shadow-lg
              hover:bg-yellow-400
              transition
            "
          >
            ✏️ Edit Profile
          </motion.button>
        </div>
      </motion.div>

      {/* ================= BASIC INFO ================= */}
      <motion.div variants={sectionVariants}>
        <Section title="Basic Information">
          <div className="grid sm:grid-cols-2 gap-4">
            <Info label="Name" value={profile.name} />
            <Info label="Email" value={profile.email} />
            <Info label="Role" value={profile.role} />
            <Info label="Verified" value={profile.verified ? "Yes" : "No"} />
          </div>
        </Section>
      </motion.div>

      {/* ================= ADDRESSES ================= */}
      <motion.div variants={sectionVariants}>
        <Section title="Saved Addresses">
          {profile.addresses?.length === 0 ? (
            <EmptyState message="No address added yet" />
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {profile.addresses.map(addr => (
                <motion.div
                  key={addr._id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    rounded-2xl p-5 border
                    shadow-sm hover:shadow-md
                    transition
                    ${
                      addr.isCurrent
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-200 bg-white"
                    }
                  `}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">
                      {addr.label}
                    </span>
                    {addr.isCurrent && (
                      <span className="text-xs bg-yellow-300 text-red-900 px-3 py-1 rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700">{addr.addressLine}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {addr.city}, {addr.state} – {addr.pincode}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </Section>
      </motion.div>
    </motion.div>
  );
}

/* ================= REUSABLE UI ================= */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-3xl shadow-lg p-6 mt-8">
    <h3 className="text-lg font-bold text-gray-800 mb-5 border-b pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

const Badge = ({ label, color = "yellow" }) => {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700"
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-xs font-semibold ${
        colors[color] || colors.yellow
      }`}
    >
      {label}
    </span>
  );
};

const EmptyState = ({ message }) => (
  <div className="text-center py-12 text-gray-500">
    {message}
  </div>
);
