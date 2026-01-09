import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/LoginPage/Login";
import Signup from "../pages/SignupPage/Signup";
import Signup2 from "../pages/SignupPage2/Signup2";
import Otp from "../pages/OtpPage/Otp";
import AlumniHub from "../pages/AlumniHub/AlumniHub";
import StudentDashboard from "../pages/StudentDashboard/StudentDashboard";
import AlumniDashboard from "../pages/AlumniDashboard/AlumniDashboard";
import AlumniForm from "../pages/AlumniForm/AlumniForm";

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
