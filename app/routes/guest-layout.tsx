import { useAuth } from "@/context/useAuth";
import { Navigate, Outlet } from "react-router";

export default function GuestLayout() {
  const { user, userIsLoading } = useAuth();

  if (!userIsLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
