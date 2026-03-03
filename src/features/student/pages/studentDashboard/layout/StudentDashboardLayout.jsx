import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../auth/auth.store";

const StudentDashboardLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full max-w-7xl flex gap-10 px-10">

      {/* Sidebar */}
      <aside className="w-65 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl flex flex-col">

        <h2 className="text-xl font-bold text-blue-900 mb-10">
          Student Panel
        </h2>

        <nav className="flex flex-col gap-4 flex-1">

          <NavLink
            to="profile"
            className={({ isActive }) =>
              `py-2 px-4 rounded-lg transition ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "hover:bg-blue-100"
              }`
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="messages"
            className={({ isActive }) =>
              `py-2 px-4 rounded-lg transition ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "hover:bg-blue-100"
              }`
            }
          >
            Messages
          </NavLink>

          <NavLink
            to="settings"
            className={({ isActive }) =>
              `py-2 px-4 rounded-lg transition ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "hover:bg-blue-100"
              }`
            }
          >
            Settings
          </NavLink>

        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-10 min-h-[70vh]">
        <Outlet />
      </main>

    </div>
  );
};

export default StudentDashboardLayout;