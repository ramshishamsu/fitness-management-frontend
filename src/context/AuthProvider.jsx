// src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔒 SAFE localStorage read
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const storedUser = window.localStorage.getItem("user");
        const storedToken = window.localStorage.getItem("token");

        if (storedUser && storedUser !== "undefined") {
          setUser(JSON.parse(storedUser));
        }

        if (storedToken && storedToken !== "undefined") {
          setToken(storedToken);
        }
      }
    } catch (error) {
      console.warn("localStorage blocked, continuing without auth");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔒 SAFE login
  const login = (data) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("user", JSON.stringify(data.user));
        window.localStorage.setItem("token", data.token);
      }
    } catch (error) {
      console.warn("localStorage blocked during login");
    }

    setUser(data.user);
    setToken(data.token);
  };

  // 🔒 SAFE logout
  const logout = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("token");
      }
    } catch (error) {
      console.warn("localStorage blocked during logout");
    }

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

