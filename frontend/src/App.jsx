import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

// User Pages
import Home from "./user-page/Home.jsx";
import Menu from "./user-page/Menu.jsx";
import Cart from "./user-page/Cart.jsx";
import Login from "./user-page/Login.jsx";
import Register from "./user-page/Register.jsx";
import UserProfile from "./user-page/UserProfilePage.jsx";
import EditProfilePage from "./user-page/EditProfilePage.jsx";

// Admin Pages
import AdminDashboard from "./Admin-pages/AdminDashboard.jsx";
import AdminOrders from "./Admin-pages/AdminOrders.jsx";

function App() {
  return (
    <Routes>

      {/* ================= USER ROUTES ================= */}
      <Route element={<UserLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 USER PROTECTED */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

    </Routes>
  );
}

export default App;
