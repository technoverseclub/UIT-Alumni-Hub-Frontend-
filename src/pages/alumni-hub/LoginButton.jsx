import React from "react";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-7 right-5">
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="w-full bg-white text-black py-1.5 px-5 rounded-full font-bold hover:scale-110 hover:underline transition cursor-pointer"
      >
        LOG IN
      </button>
    </div>
  );
};

export default LoginButton;

