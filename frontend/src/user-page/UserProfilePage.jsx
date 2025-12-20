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

  /* ================= STATES ================= */

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

  /* ================= UI ================= */

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 py-8"
    >
      {/* ================= HEADER ================= */}
      <motion.div
        variants={sectionVariants}
        className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-semibold text-indigo-600"
          >
            {profile.name?.charAt(0)}
          </motion.div>

          <div>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <p className="text-gray-500">{profile.email}</p>

            <div className="flex gap-3 mt-2">
              <Badge label={profile.role} />
              <Badge
                label={profile.verified ? "Verified" : "Not Verified"}
                color={profile.verified ? "green" : "red"}
              />
            </div>
          </div>
        </div>

        {/* ✏️ EDIT PROFILE BUTTON */}
        <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate("/profile/edit")}
  className="
    pointer-events-auto
    flex items-center gap-2
    px-5 py-2.5
    rounded-xl
    bg-indigo-600
    text-white
    font-medium
    shadow
    hover:bg-indigo-700
    transition
  "
>
  ✏️ Edit Profile
</motion.button>

      </motion.div>

      {/* ================= BASIC INFO ================= */}
      <motion.div variants={sectionVariants}>
        <Section title="Basic Information">
          <Info label="Name" value={profile.name} />
          <Info label="Email" value={profile.email} />
          <Info label="Role" value={profile.role} />
          <Info label="Verified" value={profile.verified ? "Yes" : "No"} />
        </Section>
      </motion.div>

      {/* ================= ADDRESSES ================= */}
      <motion.div variants={sectionVariants}>
        <Section title="Addresses">
          {profile.addresses?.length === 0 ? (
            <EmptyState message="No address added yet" />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {profile.addresses.map(addr => (
                <motion.div
                  key={addr._id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`border rounded-xl p-4 ${
                    addr.isCurrent
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{addr.label}</span>
                    {addr.isCurrent && (
                      <span className="text-xs text-green-600 font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700">{addr.addressLine}</p>
                  <p className="text-sm text-gray-600">
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

/* ================= REUSABLE UI COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const Info = ({ label, value }) => (
  <div className="mb-2">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const Badge = ({ label, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[color] || colors.indigo
      }`}
    >
      {label}
    </span>
  );
};

const EmptyState = ({ message }) => (
  <div className="text-center py-10 text-gray-500">
    {message}
  </div>
);
