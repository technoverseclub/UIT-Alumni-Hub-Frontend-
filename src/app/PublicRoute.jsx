import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/auth.store";

const PublicRoute = ({ children }) => {
  const { accessToken, hasHydrated } = useAuthStore();

  // Don't block public pages while hydration runs (prevents blank /login).
  if (!hasHydrated) return children;

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;