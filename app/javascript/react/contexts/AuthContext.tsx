// contexts/AuthContext.tsx
import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string | null;
  login: (userData: { name: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(sessionStorage.getItem("isLoggedIn") === "true");
  const [userName, setUserName] = useState<string | null>(sessionStorage.getItem("userName"));

  const login = (userData: { name: string }) => {
    console.log("Login function called with", userData);
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userName", userData.name);
    setIsLoggedIn(true);
    setUserName(userData.name);
  };

  const logout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
