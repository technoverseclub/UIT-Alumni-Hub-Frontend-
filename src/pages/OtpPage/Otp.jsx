import React from 'react'
import Logo from  './Logo';
import Bg from './Bg';
import OtpForm from './OtpForm';

const Otp = () => {
  return (
    <Bg>
      <div className="relative min-h-screen w-full ">
        <Logo />
        <OtpForm />
      </div>
    </Bg>
  );
}

export default Otp


