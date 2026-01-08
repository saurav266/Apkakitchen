import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketInitialized = useRef(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/profile", {
        withCredentials: true
      });
      setUser(res.data.user || res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (loading || !user?.id || socketInitialized.current) return;

    socket.connect();
    socket.emit("join", { userId: user.id, role: user.role });
    socketInitialized.current = true;
  }, [user, loading]);

  const login = async () => {
    setLoading(true);
    await fetchUser();   // ✅ ONLY THIS
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    socket.disconnect();
    socketInitialized.current = false;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);