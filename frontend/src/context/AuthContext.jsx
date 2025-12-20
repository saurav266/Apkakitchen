import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Check session from cookie
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/users/profile",
        { withCredentials: true }
      );

      // 🔥 FIX IS HERE
      setUser(res.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

const logout = async () => {
  await axios.post(
    "http://localhost:3000/api/auth/logout",
    {},
    { withCredentials: true }
  );

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
