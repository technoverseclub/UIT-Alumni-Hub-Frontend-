import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/auth.store";

const StudentProfileGuard = ({ children }) => {
  const { user, hasHydrated } = useAuthStore();

  if (!hasHydrated) return null;

  if (user?.role === "STUDENT" && !user?.isProfileComplete) {
    return <Navigate to="/student/form" replace />;
  }

  return children;
};

export default StudentProfileGuard;