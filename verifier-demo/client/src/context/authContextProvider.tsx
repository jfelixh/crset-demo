import { JwtPayload, jwtDecode } from "jwt-decode";
import React, { FC, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AuthContext } from "./authContext";

export interface AppState {
  token: JwtPayload | null;
  isAuthenticated: boolean;
  email: string;
}

export interface AuthContextType {
  appState: AppState;
  onLogout: () => void;
}

interface CustomJwtPayload extends JwtPayload {
  credentialSubject: {
    email: string;
  };
}

export const AuthProvider: FC<React.PropsWithChildren<AuthContextType>> = ({
  children,
}) => {
  const [tokenFromCookie, removeToken] = useCookies(["token"]);
  const [appState, setAppState] = useState<AppState>({
    token: null,
    isAuthenticated: false,
    email: "",
  });

  useEffect(() => {
    console.log("Token from cookie: ", tokenFromCookie);
    if (tokenFromCookie && tokenFromCookie.token) {
      const decodedToken = jwtDecode(tokenFromCookie.token) as CustomJwtPayload;

      const newState = {
        token: decodedToken,
        isAuthenticated: true,
        email: decodedToken.credentialSubject.email,
      };
      setAppState(newState);
      sessionStorage.setItem("appState", JSON.stringify(appState));
    }
  }, [tokenFromCookie]);

  const onLogout = () => {
    setAppState({ token: null, isAuthenticated: false, email: "" });
    removeToken("token", "");
  };

  return (
    <AuthContext.Provider value={{ appState, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
