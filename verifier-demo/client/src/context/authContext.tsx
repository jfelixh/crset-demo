import { createContext } from "react";
import { AuthContextType } from "./authContextProvider";

export const AuthContext = createContext<AuthContextType | null>(null);
