import { useState, useCallback } from "react";
import type { User, PlanType } from "@/types/habit";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  upgradePlan: (
    plan: PlanType,
  ) => Promise<{ success: boolean; error?: string }>;
}

// Mock user for demonstration
const mockUser: User = {
  id: "1",
  email: "demo@habittracker.app",
  name: "Demo User",
  plan: "free",
  createdAt: "2026-01-01T00:00:00Z",
};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (!email || !password) {
        setIsLoading(false);
        return { success: false, error: "Email and password are required" };
      }

      if (password.length < 6) {
        setIsLoading(false);
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      }

      setUser({
        ...mockUser,
        email,
      });
      setIsLoading(false);
      return { success: true };
    },
    [],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (!email || !password || !name) {
        setIsLoading(false);
        return { success: false, error: "All fields are required" };
      }

      if (password.length < 6) {
        setIsLoading(false);
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      }

      if (!email.includes("@")) {
        setIsLoading(false);
        return { success: false, error: "Please enter a valid email" };
      }

      setUser({
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        plan: "free",
        createdAt: new Date().toISOString(),
      });
      setIsLoading(false);
      return { success: true };
    },
    [],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(null);
    setIsLoading(false);
  }, []);

  const upgradePlan = useCallback(
    async (plan: PlanType): Promise<{ success: boolean; error?: string }> => {
      if (!user) {
        return { success: false, error: "Must be logged in to upgrade" };
      }

      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser((prev) => (prev ? { ...prev, plan } : null));
      setIsLoading(false);
      return { success: true };
    },
    [user],
  );

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    upgradePlan,
  };
}
