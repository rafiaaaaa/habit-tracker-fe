import { useGetMe } from "@/api/getMe";
import { createContext, useContext } from "react";

export interface Subscription {
  plan: "free" | "pro";
  endDate: string;
}

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  timezone: string;
  subscription: Subscription;
}

export interface AuthContextType {
  user: User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user } = useGetMe();

  const logout = () => {};

  const value = {
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useHabit must be used within HabitProvider");
  }

  return context;
};
