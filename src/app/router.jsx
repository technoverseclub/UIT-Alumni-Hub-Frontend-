import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

import RoleProtectedRoute from "./RoleProtectedRoute";
import PublicRoute from "./PublicRoute";
import AlumniProfileGuard from "./AlumniProfileGuard";
import StudentProfileGuard from "./StudentProfileGuard";

import StudentDashboardLayout from "../student/pages/studentDashboard/layout/StudentDashboardLayout";
import StudentProfile from "../student/pages/studentDashboard/profile/StudentProfile";
import StudentMessages from "../student/pages/studentDashboard/messages/StudentMessages";
import StudentSettings from "../student/pages/studentDashboard/settings/StudentSettings";
import AlumniDashboardLayout from "../alumni/pages/alumniDashboard/layout/AlumniDashboardLayout";
import AlumniProfile from "../alumni/pages/alumniDashboard/profile/AlumniProfile";
import AlumniMessages from "../alumni/pages/alumniDashboard/messages/AlumniMessages";
import AlumniSettings from "../alumni/pages/alumniDashboard/settings/AlumniSettings";
import AlumniForm from "../alumni/pages/alumniForm/AlumniForm";
import StudentForm from "../student/pages/studentForm/StudentForm";

import AlumniHub from "../alumni-hub/pages/AlumniHub";
import AlumniHubProfile from "../alumni-hub/pages/AlumniHubProfile";

import Landing from "../landingPage/Landing";
import Login from "../auth/pages/Login";
import Signup from "../auth/pages/Signup";
import VerifyOtp from "../auth/pages/VerifyOtp";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>

          {/* Public Routes */}
          <Route path="/" element={<Landing />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route path="/verify" element={<VerifyOtp />} />

          {/* Alumni Hub — public */}
          <Route path="/alumni-hub" element={<AlumniHub />} />
          <Route path="/alumni-hub/:userId" element={<AlumniHubProfile />} />

          {/* Alumni Form */}
          <Route
            path="/alumni/form"
            element={
              <RoleProtectedRoute allowedRoles={["ALUMNI"]}>
                <AlumniForm />
              </RoleProtectedRoute>
            }
          />


<Route
  path="/student/form"
  element={
    <RoleProtectedRoute allowedRoles={["STUDENT"]}>
      <StudentForm />
    </RoleProtectedRoute>
  }
/>

          {/* Student Dashboard */}
          <Route
  path="/student/dashboard"
  element={
    <RoleProtectedRoute allowedRoles={["STUDENT"]}>
      <StudentProfileGuard>
        <StudentDashboardLayout />
      </StudentProfileGuard>
    </RoleProtectedRoute>
  }
>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="messages" element={<StudentMessages />} />
            <Route path="settings" element={<StudentSettings />} />
          </Route>

          {/* Alumni Dashboard */}
          <Route
            path="/alumni/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={["ALUMNI"]}>
                <AlumniProfileGuard>
                  <AlumniDashboardLayout />
                </AlumniProfileGuard>
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<AlumniProfile />} />
            <Route path="messages" element={<AlumniMessages />} />
            <Route path="settings" element={<AlumniSettings />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;