import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../../Assets/logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={logo} alt="V-Compass Logo" className="logo" />
                    <h1>V-Compass</h1>
                </div>

                <div className="hamburger" onClick={toggleMenu}>
                    <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
                    <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
                    <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
                </div>

                <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to="/main" onClick={closeMenu}>Home</Link>
                    </li>
                    <li>
                        <Link to="/mentor/connect" onClick={closeMenu}>Connect</Link>
                    </li>
                    <li>
                        <button onClick={() => { handleLogout(); closeMenu(); }} className="logout-button">
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
