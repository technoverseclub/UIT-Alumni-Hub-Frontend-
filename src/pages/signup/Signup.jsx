import React from 'react';
import Logo from "../../components/Logo";
import Bg from "../../components/Bg";
import SingupForm from './SignupForm';

const Signup = () => {
  return (
    <Bg>
      <div className="relative min-h-screen w-full ">
        <Logo />
        <SingupForm />
      </div>
    </Bg>
  );
};

export default Signup;





