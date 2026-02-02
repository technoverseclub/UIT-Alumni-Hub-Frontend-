import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= INPUT HANDLER ================= */
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

    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "Please select a role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(
        "https://uit-alumni-hub-backend.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim(),
            purpose: "LOGIN",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          api: data?.message || "Login failed",
        });
        return;
      }

      /* ✅ OTP SENT */
      if (data?.message === "OTP sent") {
        localStorage.setItem("email", formData.email.trim());
        localStorage.setItem("role", formData.role);
        localStorage.setItem("authType", "login");

        navigate("/otp");
        return;
      }

      setErrors({
        api: "Unexpected server response. Please try again.",
      });
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        api: "Server error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-5">
      <div className="w-full max-w-[360px] bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email ID</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-bold">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="" disabled>
                Select your role (Student / Alumni)
              </option>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs font-bold">{errors.role}</p>
            )}
          </div>

          {/* API ERROR */}
          {errors.api && (
            <p className="text-red-600 text-sm text-center mb-3 font-semibold">
              {errors.api}
            </p>
          )}

          {/* Submit */}
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

          <p className="text-center mt-4 text-sm font-medium">
            Don&apos;t have an account?
            <Link
              to="/signup"
              className="text-blue-600 font-bold ml-1 hover:underline"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
