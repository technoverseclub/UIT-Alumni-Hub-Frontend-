import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/auth.store";

const AlumniProfileGuard = ({ children }) => {
  const { user, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  // If alumni profile not completed → force form
  if (user?.role === "ALUMNI" && !user?.isProfileComplete) {
    return <Navigate to="/alumni/form" replace />;
  }

  return children;
};

export default AlumniProfileGuard;