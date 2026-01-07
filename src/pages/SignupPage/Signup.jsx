import React from 'react';
import Logo from './logo'
import Bg from './Bg';
import SingupForm from './SingupForm';

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





