import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import DeliveryLayout from "./layouts/DeliveryLayout.jsx";
import { Toaster } from "react-hot-toast";

/* ================= LAZY LOAD PAGES ================= */

// User Pages
const Home = lazy(() => import("./user-page/Home.jsx"));
const Menu = lazy(() => import("./user-page/Menu.jsx"));
const Cart = lazy(() => import("./user-page/Cart.jsx"));
const Login = lazy(() => import("./user-page/Login.jsx"));
const Register = lazy(() => import("./user-page/Register.jsx"));
const UserProfile = lazy(() => import("./user-page/UserProfilePage.jsx"));
const EditProfilePage = lazy(() => import("./user-page/EditProfilePage.jsx"));
const OrderPage = lazy(() => import("./user-page/Order.jsx"));
const About = lazy(() => import("./user-page/About.jsx"));
const Contact = lazy(() => import("./user-page/Contact.jsx"));
const CheckOut = lazy(() => import("./user-page/CheckOut.jsx"));
const OrderSuccess = lazy(() => import("./user-page/OrderSuccess.jsx"));
const FoodViewPage = lazy(() => import("./user-page/FoodViewPage.jsx"));
const OrderView = lazy(() => import("./user-page/OrderView.jsx"));

// Admin Pages
const AdminDashboard = lazy(() => import("./Admin-pages/AdminDashboard.jsx"));
const AdminOrders = lazy(() => import("./Admin-pages/AdminOrders.jsx"));
const AdminDelivery = lazy(() => import("./Admin-pages/AdminDelivery.jsx"));
const AdminUsers = lazy(() => import("./Admin-pages/AdminUsers.jsx"));
const AdminProduct = lazy(() => import("./Admin-pages/AdminProduct.jsx"));
const AdminDeliveryBoyDetails = lazy(() =>
  import("./Admin-pages/AdminDeliveryBoyDetails.jsx")
);
const AdminOrderDetails = lazy(() =>
  import("./Admin-pages/AdminOrderDetails.jsx")
);

// Delivery Pages
const DeliveryDashboard = lazy(() =>
  import("./Delivery-page/DeliveryDashboard.jsx")
);
const DeliveryOrders = lazy(() =>
  import("./Delivery-page/DeliveryOrders.jsx")
);
const OrderDetails = lazy(() =>
  import("./Delivery-page/OrderDetails.jsx")
);
const Profile = lazy(() => import("./Delivery-page/Profile.jsx"));
const Earnings = lazy(() => import("./Delivery-page/Earnings.jsx"));

/* ================= LOADER ================= */
const Loader = () => (
  <div className="flex h-screen items-center justify-center text-lg font-semibold">
    Loading...
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Suspense fallback={<Loader />}>
        <Routes>

          {/* ================= USER ROUTES ================= */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
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

            <Route
              path="/order"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <OrderView />
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
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="earnings" element={<Earnings />} />
          </Route>

        </Routes>
      </Suspense>
    </>
  );
}

export default App;
