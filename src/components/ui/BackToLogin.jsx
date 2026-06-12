import React from 'react';
import './backtolog.css';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackToLogin = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/login')} className="vc-back-btn" type="button">
      <ArrowLeft size={16} strokeWidth={2.5} />
      <span>Back to sign in</span>
    </button>
  );
};

export default BackToLogin;
