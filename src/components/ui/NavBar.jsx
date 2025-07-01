import React, { useState } from 'react';
import { Home, Users, LogOut, Menu, X } from 'lucide-react';
import logo from "../../Assets/logo.png"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        // Note: localStorage not available in artifacts
        // localStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-amber-200/20 shadow-lg shadow-amber-100/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3 group">
                        <div className="relative">
                           
                            
                                <img 
                                    src={logo} 
                                    alt="V-Compass Logo" 
                                    className="w-8 h-8 object-contain"
                                />
                            
                        </div>
                        <h1 className="text-xl font-bold text-amber-900 tracking-tight">
                            V-Compass
                        </h1>
                    </div>

                    {/* Desktop Navigation - Moved to right side */}
                    <div className="hidden md:flex items-center space-x-2">
                        <a
                            href="/main"
                            className="group flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-amber-800 hover:text-amber-900 hover:bg-amber-50 transition-all duration-200 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <Home className="w-4 h-4 mr-2 relative z-10" />
                            <span className="relative z-10">Home</span>
                        </a>
                        
                        <a
                            href="/mentor/connect"
                            className="group flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-amber-800 hover:text-amber-900 hover:bg-amber-50 transition-all duration-200 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                            <Users className="w-4 h-4 mr-2 relative z-10" />
                            <span className="relative z-10">Connect</span>
                        </a>

                        {/* Desktop Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="group flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-200 transform hover:scale-105 ml-2"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-amber-800 hover:text-amber-900 hover:bg-amber-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${
                isMenuOpen 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-xl border-t border-amber-200/20">
                    <a
                        href="/main"
                        onClick={closeMenu}
                        className="group flex items-center px-4 py-3 rounded-xl text-base font-semibold text-amber-800 hover:text-amber-900 hover:bg-white/60 transition-all duration-200"
                    >
                        <Home className="w-5 h-5 mr-3 text-amber-600" />
                        Home
                    </a>
                    
                    <a
                        href="/mentor/connect"
                        onClick={closeMenu}
                        className="group flex items-center px-4 py-3 rounded-xl text-base font-semibold text-amber-800 hover:text-amber-900 hover:bg-white/60 transition-all duration-200"
                    >
                        <Users className="w-5 h-5 mr-3 text-amber-600" />
                        Connect
                    </a>
                    
                    <div className="pt-2">
                        <button
                            onClick={() => { handleLogout(); closeMenu(); }}
                            className="w-full group flex items-center px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;