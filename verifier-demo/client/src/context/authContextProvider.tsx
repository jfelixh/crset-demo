import { jwtDecode, JwtPayload } from "jwt-decode";
import { FC, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { PassportCredential } from "@/models/auth";
import { AuthContext } from "./authContext";

export interface CustomJwtPayload extends JwtPayload {
  credentialSubject: CredentialSubject;
}

export type CredentialSubject = PassportCredential & { email: string };

export interface AuthContextType {
  token: CustomJwtPayload | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [cookies, removeToken] = useCookies(["token"]);
  const [appState, setAppState] = useState({
    token: null as CustomJwtPayload | null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        const newState = {
          token: decodedToken,
          isAuthenticated: true,
          isLoading: false,
        };
        setAppState(newState);
        sessionStorage.setItem("appState", JSON.stringify(newState));
      } catch (error) {
        console.error("Invalid token:", error);
        removeToken("token", "");
        setAppState((prevState) => ({ ...prevState, isLoading: false }));
      }
    } else {
      setAppState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, [cookies.token]);

  const onLogout = () => {
    setAppState({ token: null, isAuthenticated: false, isLoading: false });
    removeToken("token", "");
    sessionStorage.removeItem("appState");
  };

  return (
    <AuthContext.Provider
      value={{
        token: appState.token,
        isAuthenticated: appState.isAuthenticated,
        isLoading: appState.isLoading,
        onLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
