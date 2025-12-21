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
import OrderPage from "./user-page/Order.jsx";

// Admin Pages
import AdminDashboard from "./Admin-pages/AdminDashboard.jsx";
import AdminOrders from "./Admin-pages/AdminOrders.jsx";
import AdminDelivery from "./Admin-pages/AdminDelivery.jsx";
import AdminUsers from "./Admin-pages/AdminUsers.jsx";
import AdminDeliveryBoyDetails from "./Admin-pages/AdminDeliveryBoyDetails.jsx";


// delivery
import DeliveryLayout from "./layouts/DeliveryLayout.jsx";
import DeliveryDashboard from "./Delivery-page/DeliveryDashboard.jsx";
import DeliveryOrders from "./Delivery-page/DeliveryOrders.jsx";


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
      <Route path="/order" element={
        <ProtectedRoute allowedRoles={["user"]}>
          <OrderPage />
        </ProtectedRoute>
      } />

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
        <Route path="delivery" element={<AdminDelivery />} />
        <Route path="delivery/:id" element={<AdminDeliveryBoyDetails />} />
        <Route path="users" element={<AdminUsers />} />
        
      </Route>

      {/* ================= DELIVERY ROUTES ================= */}
      <Route
        path="/delivery"
        element={<DeliveryLayout />}
      >
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="orders" element={<DeliveryOrders />} />
        {/* <Route path="profile" element={<DeliveryProfile />} /> */}
      </Route>

    </Routes>


  );
}

export default App;