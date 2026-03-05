import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestSignupOtp } from "../auth.api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await requestSignupOtp({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.toUpperCase(),
      });

      if (res.data?.message === "OTP sent") {
        navigate("/verify", {
          state: {
            email: formData.email.trim(),
            name: formData.name.trim(),
            role: formData.role.toUpperCase(),
            authType: "signup",
          },
        });
      }
    } catch (error) {
      setErrors({
        api:
          error.response?.data?.message ||
          "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-95 bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-600"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.name}
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
            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-600"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
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
            className="w-full px-4 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>
              Select your role
            </option>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">
              {errors.role}
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
          className={`w-full py-3 rounded-full font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-950 hover:bg-blue-900"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="mt-4 text-center text-sm">
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
  );
};

export default Signup;