import React from "react";
import Logo from "../../components/Logo";
import Bg from "../../components/Bg";
import SignupForm2 from "./SignupForm2";

const Signup2 = () => {
  return (
    <Bg>
      <div className="relative min-h-screen w-full">
        <Logo />
        <SignupForm2 />
      </div>
    </Bg>
  );
};

export default Signup2;


