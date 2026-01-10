import React from 'react'
import Logo from "../../components/Logo";
import Bg from "../../components/Bg";
import AlumniFormDetails from './AlumniFormDetails'

const AlumniForm = () => {
  return (
    <Bg>
      <div className="relative min-h-screen w-full ">
        <Logo />
        <AlumniFormDetails />
      </div>
    </Bg>
  )
}

export default AlumniForm
