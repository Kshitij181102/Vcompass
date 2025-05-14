import React from "react";
import "./input.css";
const Input = ({ placeholder, required,  onChange ,value,type}) => {
  return (
    <input
    type={type}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      required={required}
      className="ui_input"
    />
  );
};

export default Input;
