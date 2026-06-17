/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from "react";
import { STORAGE_KEYS } from "../constants";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Khởi tạo thẳng từ localStorage để tránh Cascading Renders
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem(STORAGE_KEYS.TOKEN)
  );
  
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (userData: any, token: string) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};