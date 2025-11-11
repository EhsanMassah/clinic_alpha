import React from 'react'
import clinicAlphaLogo from '../../images/clinicalpha-logo.png'

export default function Logo() {
  return (
    <img
      src={clinicAlphaLogo}
      alt="Clinic Alpha"
      className="h-20 w-auto md:h-24"
      loading="eager"
      decoding="async"
    />
  )
}
