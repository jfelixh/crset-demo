import { PassportCredential } from "@/models/auth";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { FC, ReactNode, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AuthContext } from "./authContext";

export interface AppState {
  token: CustomJwtPayload | null;
  isAuthenticated: boolean;
}
export interface CustomJwtPayload extends JwtPayload {
  credentialSubject: CredentialSubject;
}

export type CredentialSubject = PassportCredential & { email: string };

export interface AuthContextType {
  appState: AppState;
  onLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [tokenFromCookie, removeToken] = useCookies(["token"]);
  const [appState, setAppState] = useState<AppState>({
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    console.log("Token from cookie: ", tokenFromCookie);
    if (tokenFromCookie && tokenFromCookie.token) {
      const decodedToken = jwtDecode(tokenFromCookie.token) as CustomJwtPayload;

      const newState = {
        token: decodedToken,
        isAuthenticated: true,
      };
      setAppState(newState);
      sessionStorage.setItem("appState", JSON.stringify(appState));
    }
  }, [tokenFromCookie]);

  const onLogout = () => {
    setAppState({ token: null, isAuthenticated: false });
    removeToken("token", "");
  };

  return (
    <AuthContext.Provider value={{ appState, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
