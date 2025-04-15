import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faWhatsapp} from '@fortawesome/free-brands-svg-icons'

const Navbar = () => {
  return (
    <div  className='w-full h-12 bg-[#202020] flex fixed z-50'>
      <div className='flex'>
        <FontAwesomeIcon className='w-7 h-7 ms-4 mt-2' icon={faWhatsapp} style={{color: "#229b40",}} />
        <p className='text-white ms-4 mt-2.5'>Whatsapp</p>
      </div>

    </div>
  )
}

export default Navbar