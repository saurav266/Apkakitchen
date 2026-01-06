import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const AuthContext = createContext(null);

const API = "http://localhost:3000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ADD THIS LINE (YOU MISSED IT)
  const socketInitialized = useRef(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${API}/api/auth/profile`,
        { withCredentials: true }
      );
      setUser(res.data.user);
      if (res.data.user) {
        // fetch and sync cart
        try {
          const cartRes = await axios.get(`${API}/api/cart`, { withCredentials: true });
          const frontendCart = cartRes.data.cart.map(item => ({
            cartItemId: item.cartItemId,
            productId: item.product,
            variantId: item.variant,
            name: item.name,
            image: item.image,
            finalPrice: item.price,
            qty: item.qty
          }));
          localStorage.setItem("cart", JSON.stringify(frontendCart));
          window.dispatchEvent(new Event("cartUpdated"));
        } catch (err) {
          console.error("Failed to fetch cart", err);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔌 SOCKET CONNECT (SAFE)
  useEffect(() => {
  if (loading) return;              // ⛔ wait for profile API
  if (!user?.id || !user?.role) return;
  if (socketInitialized.current) return;

  socket.connect();

  socket.emit("join", {
    userId: user.id,
    role: user.role,
  });

  socketInitialized.current = true;

  console.log("✅ Socket initialized:", user.role, user.id);
}, [user, loading]);


  const login = async (userData) => {
    setUser(userData);
    // sync cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length > 0) {
      try {
        await axios.post(`${API}/api/cart/sync`, { items: cart }, { withCredentials: true });
      } catch (err) {
        console.error("Failed to sync cart", err);
      }
    }
  };

  const logout = async () => {
    await axios.post(
      `${API}/api/auth/logout`,
      {},
      { withCredentials: true }
    );

    socket.disconnect();
    socketInitialized.current = false;
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


