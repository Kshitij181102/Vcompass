import React from 'react';
import './Button.css';

const Button = ({ onClick, type = "button", children, variant = "primary", disabled }) => {
  return (
    <button
      className={`vc-btn vc-btn--${variant}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <span className="vc-btn__inner">{children}</span>
      <span className="vc-btn__shine" aria-hidden="true" />
    </button>
  );
};

export default Button;
