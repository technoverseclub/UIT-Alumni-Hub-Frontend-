import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignupForm = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= API CONFIG ================= */
  const API_URL = "http://localhost:5000/api/auth/signup"; // change later

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear field error on change
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      api: "",
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data?.success) {
        navigate("/otp", {
          state: {
            email: formData.email,
            role: formData.role,
            type: "signup",
          },
        });
      }
    } catch (error) {
      setErrors({
        api:
          error.response?.data?.message ||
          "Server error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-8">
      <div className="w-full max-w-[360px] bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} noValidate>

         

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-600"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Email ID
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-600"
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-blue-600"
            >
              <option value="" disabled>
                Select your role (Student / Alumni)
              </option>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.role}
              </p>
            )}
          </div>

          {/* API Error */}
          {errors.api && (
            <p className="text-red-600 text-sm text-center mb-3 font-semibold">
              {errors.api}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-full font-semibold cursor-pointer text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-950"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {/* Login */}
          <p className="mt-4 text-center text-sm font-medium">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-600 font-bold ml-1 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
