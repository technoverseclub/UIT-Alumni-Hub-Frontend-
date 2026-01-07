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

  const role = localStorage.getItem("role");
  const authType = localStorage.getItem("authType");
  const email = localStorage.getItem("email");

  /* ⏱️ RESTARTABLE TIMER */
useEffect(() => {
  // Stop timer if we hit 0 or if the OTP is already successful
  if (time <= 0 || success) return;

  // Set up the interval to tick every 1 second
  const interval = setInterval(() => {
    setTime((prev) => prev - 1);
  }, 1000);

  // Clean up the interval on every re-render or when component unmounts
  return () => clearInterval(interval);
}, [time, success]); // <--- Added 'time' as a dependency



  /* 🚀 AUTO REDIRECT AFTER SUCCESS */
  useEffect(() => {
    if (!success) return;

    const redirectTimer = setTimeout(() => {
      if (role === "student") navigate("/studentdashboard");
      if (role === "alumni" && authType === "signup")
        navigate("/alumniform");
      if (role === "alumni" && authType === "login")
        navigate("/alumnidashboard");
    }, 1500);

    return () => clearTimeout(redirectTimer);
  }, [success, role, authType, navigate]);

  /* INPUT HANDLERS */
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

  /* ✅ VERIFY OTP */
  const handleVerify = async () => {
    if (otp.some((d) => d === "") || loading) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email,
        otp: otp.join(""),
        role,
        authType,
      });

      localStorage.setItem("token", res.data.token);
      setSuccess(true);
    } catch {
      setError(true);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* 🔁 RESEND OTP */
 const handleResend = async () => {
  if (resending || time > 0) return;

  setResending(true);
  try {
    await axios.post("/api/auth/resend-otp", { email });

    setOtp(Array(OTP_LENGTH).fill(""));
    setError(false);
    setSuccess(false);
    
    // This state change will now trigger the useEffect above
    setTime(59); 

    inputsRef.current[0]?.focus();
  } catch (error) {
    console.error("Resend OTP failed", error);
  } finally {
    setResending(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center px-3">
      <div className="w-full max-w-[380px] bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-center font-semibold mb-6">
          Enter 6-digit code sent to your email
        </h2>

        <div className={`grid grid-cols-6 gap-3 mb-4 place-items-center ${error ? "animate-shake" : ""}`}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={success}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`aspect-square w-[42px] text-center text-xl font-semibold border-2 rounded-xl
                ${success ? "border-green-500 bg-green-50" : error ? "border-red-500" : "border-blue-700"}`}
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
            className="w-full bg-blue-950 hover:bg-blue-950 cursor-pointer text-white py-3 rounded-full font-semibold"
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
