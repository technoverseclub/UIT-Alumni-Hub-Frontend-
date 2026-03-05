import { Navigate } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  // 🛑 Wait until hydration completes
  if (!hasHydrated) {
    return null; // ya loader dikhao
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;