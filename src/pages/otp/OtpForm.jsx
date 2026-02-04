import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OtpVerify = () => {
  const OTP_LENGTH = 6;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [time, setTime] = useState(59);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();

  /* ================= READ REQUIRED DATA ================= */
  const email = localStorage.getItem("email");
  const authType = localStorage.getItem("authType"); // signup | login
  const name = localStorage.getItem("name"); // signup only

  /* ================= SAFETY GUARD ================= */
  useEffect(() => {
    if (!email || !authType) {
      navigate("/login");
    }
  }, [email, authType, navigate]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (time <= 0 || success) return;

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time, success]);

  /* ================= REDIRECT AFTER SUCCESS ================= */
  useEffect(() => {
    if (!success) return;

    const role = localStorage.getItem("role"); // backend-trusted

    if (authType === "signup") {
      if (role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (role === "ALUMNI") {
        navigate("/alumni/form");
      }
    } else {
      if (role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (role === "ALUMNI") {
        navigate("/alumni/dashboard");
      }
    }
  }, [success, authType, navigate]);

  /* ================= INPUT HANDLERS ================= */
  const handleChange = (e, index) => {
    if (success) return;

    const value = e.target.value.replace(/\D/g, "");
    setOtp((prev) => {
      const copy = [...prev];
      copy[index] = value ? value[0] : "";
      return copy;
    });

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (error) setError(false);
  };

  const handleKeyDown = (e, index) => {
    if (success) return;

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else {
        setOtp((prev) => {
          const copy = [...prev];
          copy[index] = "";
          return copy;
        });
      }
    }
  };

  const handlePaste = (e) => {
    if (success) return;
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    setOtp((prev) => {
      const copy = [...prev];
      pasted.forEach((d, i) => (copy[i] = d));
      return copy;
    });
  };

  /* ================= VERIFY OTP ================= */
  const handleVerify = async () => {
  if (otp.some((d) => d === "") || loading) return;

  setLoading(true);
  try {
    const role = localStorage.getItem("role");

    const payload =
      authType === "signup"
        ? {
            email,
            otp: otp.join(""),
            name,
            role, // ✅ REQUIRED FOR ALUMNI
          }
        : {
            email,
            otp: otp.join(""),
          };

    const url =
      authType === "signup"
        ? "https://uit-alumni-hub-backend.onrender.com/auth/signup/verify"
        : "https://uit-alumni-hub-backend.onrender.com/auth/login/verify";

    const res = await axios.post(url, payload);

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    if (res.data?.role) {
      localStorage.setItem("role", res.data.role);
    }

    setSuccess(true);
  } catch (err) {
    console.error("OTP VERIFY ERROR:", err?.response?.data || err);
    setError(true);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  } finally {
    setLoading(false);
  }
};

  /* ================= RESEND OTP ================= */
  const handleResend = async () => {
    if (resending || time > 0) return;

    setResending(true);
    try {
      await axios.post(
        "https://uit-alumni-hub-backend.onrender.com/auth/resend-otp",
        { email }
      );

      setOtp(Array(OTP_LENGTH).fill(""));
      setError(false);
      setSuccess(false);
      setTime(59);
      inputsRef.current[0]?.focus();
    } catch (err) {
      console.error("Resend OTP failed", err);
    } finally {
      setResending(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-[380px] bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-center font-semibold mb-6">
          Enter 6-digit code sent to your email
        </h2>

        <div
          className={`grid grid-cols-6 gap-3 mb-4 place-items-center ${
            error ? "animate-shake" : ""
          }`}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              inputMode="numeric"
              disabled={success}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`aspect-square w-[42px] text-center text-xl font-semibold border-2 rounded-xl
                ${
                  success
                    ? "border-green-500 bg-green-50"
                    : error
                    ? "border-red-500"
                    : "border-blue-700"
                }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-red-600 text-sm mb-3">
            ❌ Invalid OTP. Try again
          </p>
        )}

        {!success && (
          <button
            onClick={handleVerify}
            disabled={loading || otp.some((d) => d === "")}
            className="w-full bg-blue-950 text-white py-3 rounded-full font-semibold"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        )}

        <p className="mt-6 text-center">
          Didn’t receive code?{" "}
          <span className="font-semibold text-blue-800">
            00:{time < 10 ? `0${time}` : time}
          </span>
        </p>

        <button
          disabled={time > 0 || resending}
          onClick={handleResend}
          className={`block mx-auto mt-3 text-blue-700 font-semibold ${
            time > 0 || resending
              ? "opacity-50 cursor-not-allowed"
              : "hover:underline"
          }`}
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpVerify;
