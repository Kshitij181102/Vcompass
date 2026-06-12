import React from "react";
import "./input.css";

const Input = ({ placeholder, required, onChange, value, type, name, autoComplete }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      required={required}
      name={name}
      autoComplete={autoComplete}
      className="vc-input"
    />
  );
};

export default Input;
