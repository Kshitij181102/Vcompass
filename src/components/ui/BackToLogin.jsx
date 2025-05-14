import React from 'react'
import "./backtolog.css"
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
const BackToLogin = () => {
  const navigate=useNavigate();
  const navigateHandler=()=>{
    navigate('/login')
  }
  return (
    <div onClick={navigateHandler} className="back_toLogin_ui border-2">
      <IoArrowBack  color="#713f12" size={24} />
      <span className="text-black">Back to login</span>
    </div>
  )
}

export default BackToLogin