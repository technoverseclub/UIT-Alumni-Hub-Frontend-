import React from "react";
import { useNavigate } from "react-router-dom";
import Bg from "../../components/Bg";
import Logo from "../../components/Logo";
import LoginButton from "./LoginButton";

const AlumniHub = () => {
  const navigate = useNavigate();

  return (
    <Bg>
      <div className="relative min-h-screen w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <Logo />
          <LoginButton onClick={() => navigate("/login")} />
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-white font-serif font-semibold 
                           text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              Alumni Hub
            </h1>

            <p className="mt-6 text-white text-lg sm:text-xl md:text-2xl font-medium">
              Your Network&nbsp;&nbsp;Your Legacy
              <br />
              Your Community
            </p>
          </div>
        </div>
      </div>
    </Bg>
  );
};

export default AlumniHub;
