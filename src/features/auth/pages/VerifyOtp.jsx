import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyLoginOtp, verifySignupOtp, getMe, resendOtp } from "../auth.api";
import { useAuthStore } from "../auth.store";

const VerifyOtp = () => {
  const OTP_LENGTH = 6;
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const email = location.state?.email;
  const authType = location.state?.authType || "login"; // Default to login
  const name = location.state?.name;
  const role = location.state?.role;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [time, setTime] = useState(59);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);

  // Safety guard
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Auto-focus first input when component mounts
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Timer
  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const handleChange = (e, index) => {
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
    if (e.key === "Backspace") {
      e.preventDefault();

      setOtp((prev) => {
        const copy = [...prev];
        copy[index] = "";
        return copy;
      });

      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length > 0) {
      const newOtp = Array(OTP_LENGTH).fill("");
      for (let i = 0; i < Math.min(pastedData.length, OTP_LENGTH); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus on the last filled box or the first empty one
      const lastFilledIndex = Math.min(pastedData.length - 1, OTP_LENGTH - 1);
      inputsRef.current[lastFilledIndex]?.focus();

      if (error) setError(false);
    }
  };

const handleVerify = async () => {
  if (otp.some((d) => d === "") || loading) return;

  setLoading(true);

  try {
    let res;

    if (authType === "signup") {
      res = await verifySignupOtp({
        email,
        otp: otp.join(""),
        name,
        role,
      });
    } else {
      res = await verifyLoginOtp({
        email,
        otp: otp.join(""),
      });
    }

    const token = res.data?.token;
if (!token) throw new Error("Token missing");

const me = await getMe(token);

setAuth(me.data, token);

    // ROLE BASED REDIRECT
    if (me.data.role === "ALUMNI") {
      if (!me.data.isProfileComplete) {
        navigate("/alumni/form");
      } else {
        navigate("/alumni/dashboard");
      }
    }

    if (me.data.role === "STUDENT") {
      navigate("/student/dashboard");
    }

  } catch{
    setError(true);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  } finally {
    setLoading(false);
  }
};

  const handleResend = async () => {
    if (resending || time > 0) return;

    setResending(true);

    try {
      const resendData = authType === "signup"
        ? { email, role, name }
        : { email };

      console.log("Resending OTP with data:", resendData);
      await resendOtp(resendData);

      setOtp(Array(OTP_LENGTH).fill(""));
      setError(false);
      setTime(59); // Directly restart timer
      inputsRef.current[0]?.focus();
    } catch (error) {
      console.error("Resend OTP error:", error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-95 bg-white rounded-3xl shadow-lg p-6">
      <h2 className="text-center font-semibold mb-6 text-lg">
        Enter 6-digit code sent to your email
      </h2>

      <div className="grid grid-cols-6 gap-3 mb-4 place-items-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            inputMode="numeric"
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`aspect-square w-10.5 text-center text-xl font-semibold border-2 rounded-xl cursor-text focus:outline-none focus:ring-2 ${
              error ? "border-red-500 focus:ring-red-300" : "border-blue-700 focus:ring-blue-300"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-red-600 text-sm mb-3">
          ❌ Invalid OTP. Try again
        </p>
      )}

      <button
        onClick={handleVerify}
        disabled={loading || otp.some((d) => d === "")}
        className="w-full bg-blue-950 text-white py-3 rounded-full font-semibold"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {/* Timer */}
      <p className="mt-6 text-center text-sm">
        Didn’t receive code?{" "}
        <span className="font-semibold text-blue-800">
          00:{time < 10 ? `0${time}` : time}
        </span>
      </p>

      {/* Resend */}
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
  );
};

export default VerifyOtp;