import React, { createContext, useEffect, useState, FC } from 'react';
import * as rcookie from 'react-cookie';
import { useCookies } from 'react-cookie';
import * as jwt_decode from 'jwt-decode';


export interface AppState {
  token: Object | null;
  isAuthenticated: boolean;
  email: string;
}

export interface AuthContextType {
  appState: AppState;
  onLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<React.PropsWithChildren<AuthContextType>> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>({
    token: null,
    isAuthenticated: false,
    email: "",
  });

  const [tokenFromCookie, setToken, removeToken] = useCookies(["token"]);
  const token = tokenFromCookie.token;
  console.log("got token: ", token);

  useEffect(() => {  
    if (token) {
      const decodedToken = jwt_decode.jwtDecode(token)
      console.log("decoded token: ", decodedToken);

      setAppState({token: decodedToken,
        isAuthenticated: true,
        email: decodedToken.credentialSubject.email,
      });
      console.log("app state: ", appState);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('appState', JSON.stringify(appState));
  }, [appState]);

  const onLogout = () => {
    setAppState({ token: null, isAuthenticated: false, email: "" });
    removeToken("token");
  };
  
  return (
    <AuthContext.Provider
      value={{ appState, onLogout}}
    >
      {children}
    </AuthContext.Provider>
  );
};