import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/profile", {
        withCredentials: true
      });
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  };

  useEffect(() => {
    fetchUser(); // 🔥 on refresh
  }, []);

  const login = async () => {
    await fetchUser();
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setAuthReady(true);
  };

  return (
    <AuthContext.Provider
      value={{ user, authReady, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
