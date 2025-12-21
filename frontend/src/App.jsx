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
import Contact from "./user-page/Contact.jsx";
import About from "./user-page/About.jsx";

// Admin Pages
import AdminDashboard from "./Admin-pages/AdminDashboard.jsx";
import AdminOrders from "./Admin-pages/AdminOrders.jsx";
import AdminUsers from "./Admin-pages/AdminUsers.jsx";
import AdminProducts from "./Admin-pages/AdminProduct.jsx";
import AdminDelivery from "./Admin-pages/AdminDelivery.jsx";

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
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
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
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="delivery" element={<AdminDelivery />} />
      </Route>

    </Routes>
  );
}

export default App;
