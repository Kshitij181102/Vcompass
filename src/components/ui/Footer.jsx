import React from "react";
import logo from '../../Assets/logo.png';

const Footer = () => {
  return (
    <footer className="flex justify-between items-center p-4 md:p-6 bg-[rgba(161,127,89,0.5)] text-[#3E2723] font-sans backdrop-blur-lg">
      {/* Logo */}
      <div className="font-bold text-xl md:text-2xl ml-[60px]"> {/* Shift logo to the right by 60px */}
        <img src={logo} alt="V-Compass Logo" className="h-16" /> {/* Adjust height to match navbar */}
      </div>

      {/* Content */}
      <div className="text-center text-sm md:text-base max-w-xs leading-relaxed font-bold">
        © 2024 V-Compass. Connecting you with the guidance you need.
      </div>

      {/* Icons */}
      <div className="flex gap-6 items-start end-8 space-x-2 right-3">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <img src="/face.png" alt="Facebook" className="h-8 cursor-pointer" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="/twitter.png" alt="Twitter" className="h-8 cursor-pointer" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <img src="/insta.png" alt="Instagram" className="h-8 cursor-pointer" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
