import { useLocation, useNavigate } from "react-router-dom";
import LoginButton from "../pages/LoginButton";
import Bg from "../components/Bg";
import Logo from "../components/Logo";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../features/auth/auth.store";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  return (
    <Bg>
      <div className="relative h-full">

        {/* Header (absolute, not affecting layout) */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-4">
          <Logo />

          {location.pathname === "/" && (
            <LoginButton
              onClick={() => {
                if (!hasHydrated) return;

                if (accessToken && user) {
                  if (user.role === "ALUMNI") {
                    navigate(
                      user.isProfileComplete ? "/alumni/dashboard" : "/alumni/form"
                    );
                    return;
                  }

                  if (user.role === "STUDENT") {
                    navigate("/student/dashboard");
                    return;
                  }

                  navigate("/");
                  return;
                }

                navigate("/login");
              }}
            />
          )}
        </div>

        {/* Page Content - true center */}
        <div className="h-full flex items-center justify-center px-4">
          <Outlet />
        </div>

      </div>
    </Bg>
  );
};

export default AppLayout;