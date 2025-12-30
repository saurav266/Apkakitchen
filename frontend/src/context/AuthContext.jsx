import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ADD THIS LINE (YOU MISSED IT)
  const socketInitialized = useRef(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/auth/profile",
        { withCredentials: true }
      );
      setUser(res.data.user);
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


  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:3000/api/auth/logout",
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


