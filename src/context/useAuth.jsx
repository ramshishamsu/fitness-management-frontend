/*
|--------------------------------------------------------------------------
| useAuth CUSTOM HOOK
|--------------------------------------------------------------------------
| Safe way to access AuthContext
*/

import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
