import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login/Login.jsx";
import Signup from "../pages/signup/Signup.jsx";
import Signup2 from "../pages/signup-step2/Signup2.jsx";
import Otp from "../pages/otp/Otp.jsx";

import AlumniHub from "../pages/alumni-hub/AlumniHub.jsx";
import AlumniForm from "../pages/alumni-form/AlumniForm.jsx";
import AlumniDashboard from "../pages/alumni-dashboard/AlumniDashboard.jsx";
import StudentDashboard from "../pages/student-dashboard/StudentDashboard.jsx";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AlumniHub />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup2" element={<Signup2 />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/alumnidashboard" element={<AlumniDashboard />} />
        <Route path="/alumniform" element={<AlumniForm />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
