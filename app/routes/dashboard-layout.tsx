import { useAuth } from "@/context/useAuth";
import { Outlet, Navigate } from "react-router";

export default function DashboardLayout() {
  const { user, userIsLoading } = useAuth();

  if (!userIsLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
