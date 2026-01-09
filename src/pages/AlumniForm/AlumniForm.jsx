import React from 'react'
import Logo from './Logo'
import Bg from './Bg'
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
