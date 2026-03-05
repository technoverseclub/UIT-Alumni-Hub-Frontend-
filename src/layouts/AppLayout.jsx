import { useLocation, useNavigate } from "react-router-dom";
import LoginButton from "../LandingPage/LoginButton";
import Bg from "../components/Bg";
import Logo from "../components/Logo";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../auth/auth.store";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const isStudentDashboard = location.pathname.startsWith("/student/dashboard");
  const isAlumniHub = location.pathname.startsWith("/alumni-hub");

  return (
    <Bg>
      <div className="relative h-full">

        {/* Header — fixed, never scrolls */}
        <div className="absolute top-2 left-0 right-0 flex justify-between items-center px-6 py-4">
          <Logo />

          {isStudentDashboard && (
            <button
              onClick={() => navigate("/alumni-hub")}
              title="Alumni Hub"
              className="hover:opacity-80 transition"
            >
              <img
                src="/Logo.svg"
                alt="Alumni Hub"
                className="h-14 w-auto object-contain rounded-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYN5De8NiA9cEiaCEiMCNFWkp7uGf1zWADNg&s";
                }}
              />
            </button>
          )}

          {isAlumniHub && (
            <button
              onClick={() => navigate(-1)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition"
            >
              ← Back
            </button>
          )}

          {location.pathname === "/" && (
            <LoginButton
              onClick={() => {
                if (!hasHydrated) return;
                if (accessToken && user) {
                  if (user.role === "ALUMNI") {
                    navigate(user.isProfileComplete ? "/alumni/dashboard" : "/alumni/form");
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

        {/* Scrollable content area */}
        <div className="h-full flex items-center justify-center overflow-y-auto alumni-hub-scroll px-4">
  <Outlet />
</div>

      </div>
    </Bg>
  );
};

export default AppLayout;