import { AuthContext } from "@/context/authContext";
import { CustomJwtPayload } from "@/context/authContextProvider";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // TODO: fix unnecessary rerenders
  const { token, isAuthenticated, onLogout, isLoading } = context;
  const credentialSubject = token
    ? (token as CustomJwtPayload).credentialSubject
    : null;

  return {
    isAuthenticated,
    onLogout,
    token,
    isLoading,
    ...credentialSubject,
  };
};
