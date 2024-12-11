import { AuthContext } from "@/context/authContext";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // TODO: fix unnecessary rerenders
  const { token, isAuthenticated, onLogout } = context;

  return {
    isAuthenticated,
    onLogout,
    token,
  };
};
