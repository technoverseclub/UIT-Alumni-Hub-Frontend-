import React from 'react'
import Logo from "../../components/Logo";
import Bg from "../../components/Bg";
import AlumniDashboardForm from './alumniDashboardForm'

const AlumniDashboard = () => {
  return (
    <Bg>
      <div>
        <Logo />
        <AlumniDashboardForm />
      </div>
    </Bg>
  )
}

export default AlumniDashboard

