import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load auth from localStorage on refresh
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth?.user) {
      setUser(auth.user);
    }

    setLoading(false);
  }, []);

  // ✅ THIS WAS MISSING
  const login = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  // 🔄 Refresh user data from server
  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      const updatedUser = response.data.user;
      
      // Update localStorage
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      auth.user = updatedUser;
      localStorage.setItem("auth", JSON.stringify(auth));
      
      // Update state
      setUser(updatedUser);
      
      console.log("User data refreshed:", updatedUser);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        refreshUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
