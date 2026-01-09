import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupStep2 = () => {
  const navigate = useNavigate();

  /* ================= STEP-1 DATA ================= */
  const step1Data = JSON.parse(
    sessionStorage.getItem("signupStep1")
  );

  /* ================= SAFETY CHECK ================= */
  useEffect(() => {
    if (!step1Data?.email) {
      navigate("/signup");
    }
  }, [step1Data, navigate]);

  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= API ================= */
  const API_URL =
    "https://uit-alumni-hub-backend.onrender.com/auth/signup/request-otp";

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      api: "",
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const payload = {
        name: step1Data.name,
        email: step1Data.email,
        role: step1Data.role,
        phone: formData.phone,
        password: formData.password,
      };

      console.log("Signup Payload:", payload);

      await axios.post(API_URL, payload);

      /* ✅ REQUIRED FIX — SAVE DATA FOR OTP PAGE */
      sessionStorage.setItem("email", step1Data.email);
      sessionStorage.setItem("role", step1Data.role);
      sessionStorage.setItem("authType", "signup");

      /* ✅ NAVIGATE TO OTP */
      navigate("/otp");

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
          Complete Signup
        </h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                handleChange({
                  target: { name: "phone", value },
                });
              }}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-600"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-600"
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-600"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs font-bold mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.api && (
            <p className="text-red-600 text-sm text-center mb-3 font-semibold">
              {errors.api}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-full font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-950"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SignupStep2;
