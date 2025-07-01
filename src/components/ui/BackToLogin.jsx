import React from 'react';
import './backtolog.css';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const BackToLogin = () => {
  const navigate = useNavigate();

  const navigateHandler = () => {
    navigate('/login');
  };

  return (
    <div onClick={navigateHandler} className="back_toLogin_ui">
      <IoArrowBack size={20} className="back_icon" />
      <span className="back_text">Back to login</span>
    </div>
  );
};

export default BackToLogin;
