// NOTE: Bg and Logo are handled globally by AppLayout.
// Do NOT import Bg or Logo here.
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestLoginOtp } from "../auth.api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
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
      const res = await requestLoginOtp({
        email: email.trim(),
        purpose: "LOGIN",
      });

      if (res.data?.message === "OTP sent") {
        navigate("/verify", { state: { email: email.trim() } });
        return;
      }

      setErrors({ api: "Unexpected server response." });
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

  return (
    <div className="max-w-sm bg-white rounded-2xl p-6 shadow-xl w-11/12">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Email ID
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />

            {errors.email && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                {errors.email}
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
  );
};

export default Login;