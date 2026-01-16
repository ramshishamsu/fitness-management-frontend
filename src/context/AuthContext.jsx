import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 SAFE load auth from localStorage on refresh
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const rawAuth = window.localStorage.getItem("auth");

        if (rawAuth && rawAuth !== "undefined") {
          const auth = JSON.parse(rawAuth);
          if (auth?.user) {
            setUser(auth.user);
          }
        }
      }
    } catch (error) {
      console.warn("localStorage blocked while loading auth");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 SAFE login
  const login = (data) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("auth", JSON.stringify(data));
      }
    } catch (error) {
      console.warn("localStorage blocked during login");
    }

    setUser(data.user);
  };

  // 🔓 SAFE logout
  const logout = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("auth");
      }
    } catch (error) {
      console.warn("localStorage blocked during logout");
    }

    setUser(null);
  };

  // 🔄 SAFE refresh user
  const refreshUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      const updatedUser = response.data.user;

      setUser(updatedUser);

      // Update localStorage safely
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const rawAuth = window.localStorage.getItem("auth") || "{}";
          const auth = JSON.parse(rawAuth);
          auth.user = updatedUser;
          window.localStorage.setItem("auth", JSON.stringify(auth));
        }
      } catch (err) {
        console.warn("localStorage blocked while refreshing user");
      }
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
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
