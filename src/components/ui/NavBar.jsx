// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../../Assets/logo.png';

const Navbar = () => {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    return (
        <nav className="navbar flex justify-between items-center p-2 bg-[rgba(161,127,89,0.5)]"> {/* Reduced padding to decrease height */}
            <div className="navbar-logo flex flex-row items-center gap-2">
                <img src={logo} alt="" className='h-8 w-8 mr-1'/> {/* Adjusted logo height */}
                <h1 className="text-[#3E2723] font-extrabold text-lg">V-Compass</h1> {/* Adjusted font size */}
            </div>
            <ul className="navbar-links flex gap-8 text-[#3E2723]"> {/* Adjusted gap between links */}
                <li>
                    <Link to="/main" className=" text-[#3E2723] font-extrbold" >Home</Link>
                </li>
                <li>
                    <Link to="/mentor/connect" className=" text-[#3E2723] font-extrbold">Mentor Connect</Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="logout-button text-[#3E2723] font-extrabold">Logout</button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
