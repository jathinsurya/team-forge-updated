import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export function AdminAuthGuard() {
  const { adminLoggedIn } = useAdmin();
  if (!adminLoggedIn) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
