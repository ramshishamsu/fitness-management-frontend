import { createContext, useEffect, useState } from "react";

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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
