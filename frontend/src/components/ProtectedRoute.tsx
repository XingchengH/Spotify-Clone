import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";


export default function ProtectedRoute() {
  const token = useSelector((state: RootState) => state.user.token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const user = useSelector((state: RootState) => state.user.user);
  return user?.isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}