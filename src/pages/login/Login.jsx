import React from 'react'
import Logo from "../../components/Logo";
import Bg from "../../components/Bg";
import LoginForm from './LoginForm'

const Login = () => {
  return (
    <Bg>
      <div className="relative min-h-screen w-full ">
        <Logo />
        <LoginForm />
      </div>
    </Bg>
  )
}

export default Login
