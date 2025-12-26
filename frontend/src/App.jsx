import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import { Toaster } from "react-hot-toast";

// User Pages
import Home from "./user-page/Home.jsx";
import Menu from "./user-page/Menu.jsx";
import Cart from "./user-page/Cart.jsx";
import Login from "./user-page/Login.jsx";
import Register from "./user-page/Register.jsx";
import UserProfile from "./user-page/UserProfilePage.jsx";
import EditProfilePage from "./user-page/EditProfilePage.jsx";
import OrderPage from "./user-page/Order.jsx";
import About from "./user-page/About.jsx";
import Contact from "./user-page/Contact.jsx";
import CheckOut from "./user-page/CheckOut.jsx";
import OrderSuccess from "./user-page/OrderSuccess.jsx";
import FoodViewPage from "./user-page/FoodViewPage.jsx";

// Admin Pages
import AdminDashboard from "./Admin-pages/AdminDashboard.jsx";
import AdminOrders from "./Admin-pages/AdminOrders.jsx";
import AdminDelivery from "./Admin-pages/AdminDelivery.jsx";
import AdminUsers from "./Admin-pages/AdminUsers.jsx";
import AdminProduct from "./Admin-pages/AdminProduct.jsx";
import AdminDeliveryBoyDetails from "./Admin-pages/AdminDeliveryBoyDetails.jsx";
import AdminOrderDetails from "./Admin-pages/AdminOrderDetails.jsx";

// delivery
import DeliveryLayout from "./layouts/DeliveryLayout.jsx";
import DeliveryDashboard from "./Delivery-page/DeliveryDashboard.jsx";
import DeliveryOrders from "./Delivery-page/DeliveryOrders.jsx";
import Profile from "./Delivery-page/Profile.jsx";
import Earnings from "./Delivery-page/Earnings.jsx";
import OrderDetails from "./Delivery-page/OrderDetails.jsx";

function App() {
  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Routes>

      {/* ================= USER ROUTES ================= */}
      <Route element={<UserLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/food/:id" element={<FoodViewPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />

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

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CheckOut />
            </ProtectedRoute>
          }
        />

        <Route path="/order" element={
        <ProtectedRoute allowedRoles={["user"]}>
          <OrderPage />
        </ProtectedRoute>
      } />  

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
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="delivery" element={<AdminDelivery />} />
        <Route path="delivery/:id" element={<AdminDeliveryBoyDetails />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProduct />} />
      </Route>

      {/* ================= DELIVERY ROUTES ================= */}
      <Route
        path="/delivery"
        element={
          <ProtectedRoute allowedRoles={["delivery"]}>

        <DeliveryLayout />
          </ProtectedRoute>
      }
      >
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="orders" element={<DeliveryOrders />} />
        <Route path="/delivery/orders/:id" element={<OrderDetails />} />
        <Route path="profile" element={<Profile/>}/>
        <Route path="earnings" element={<Earnings/>}/>
      </Route>

    </Routes>

        </>
  );
}

export default App;