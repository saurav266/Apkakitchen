import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 IMPORTANT
  const socketInitialized = useRef(false);

   /* ================= FETCH LOGGED-IN USER ================= */
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/profile", {
        withCredentials: true
      });

      // backend may send user or data
      setUser(res.data.user || res.data.data);
    } catch (err) {
      // 401 = not logged in (NOT server error)
      if (err?.response?.status !== 401) {
        console.error("Auth fetch error:", err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL AUTH CHECK ================= */
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔌 socket init AFTER auth resolved
  useEffect(() => {
    if (loading) return;
    if (!user?.id) return;
    if (socketInitialized.current) return;

    socket.connect();
    socket.emit("join", {
      userId: user.id,
      role: user.role
    });

    socketInitialized.current = true;
  }, [user, loading]);

  /* ================= LOGIN ================= */
  /**
   * IMPORTANT:
   * We DO NOT call fetchUser() immediately after login.
   * Browser attaches cookies on NEXT request.
   * Reload guarantees cookie availability.
   */
  const login = async () => {
    setLoading(true);
    window.location.reload(); // 🔥 FIXES FIRST-LOGIN ERROR
  };
  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }

    socket.disconnect();
    socketInitialized.current = false;
    setUser(null);
    setLoading(false);
  };

  /* ================= PROVIDER ================= */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);