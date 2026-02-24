import { useGetMe } from "@/api/getMe";
import { useLogout } from "@/api/logout";
import queryClient from "@/lib/query-client";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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
  userIsLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { data: user, isPending: userIsLoading } = useGetMe();

  const { mutate: logoutMutation, isPending: logoutIsPending } = useLogout({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Logged out successfully!");
        queryClient.clear();
        navigate("/login");
      },
    },
  });

  const logout = () => {
    logoutMutation(undefined);
  };

  const value = {
    user,
    userIsLoading,
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
