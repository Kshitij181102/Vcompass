import React from "react";
import { Facebook, Twitter, Instagram, Heart } from 'lucide-react';
import logo from '../../Assets/logo.png';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 border-t border-amber-200/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-amber-200/20 to-orange-300/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-300/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Logo and Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                
                
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={logo} 
                      alt="V-Compass Logo" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-900 tracking-tight">V-Compass</h2>
                <p className="text-sm text-amber-700/80">Guiding Your Journey</p>
              </div>
            </div>
            
            <p className="text-amber-700/90 text-sm max-w-xs text-center md:text-left leading-relaxed">
              Connecting you with the guidance and mentorship you need to navigate your career and personal growth.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold text-amber-900">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <a href="/main" className="text-amber-700 hover:text-amber-800 transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform">
                Home
              </a>
              <a href="/mentor/connect" className="text-amber-700 hover:text-amber-800 transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform">
                Connect with Mentors
              </a>
              <a href="/about" className="text-amber-700 hover:text-amber-800 transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform">
                About Us
              </a>
              <a href="/contact" className="text-amber-700 hover:text-amber-800 transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform">
                Contact
              </a>
            </div>
          </div>

          {/* Social Media and Contact */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="text-lg font-semibold text-amber-900">Connect With Us</h3>
            
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-amber-200/50 hover:border-amber-300/70 hover:scale-110"
              >
                <Facebook className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors" />
              </a>
              
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-amber-200/50 hover:border-amber-300/70 hover:scale-110"
              >
                <Twitter className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors" />
              </a>
              
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-amber-200/50 hover:border-amber-300/70 hover:scale-110"
              >
                <Instagram className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors" />
              </a>
            </div>

            <div className="text-center md:text-left">
              <p className="text-amber-700/80 text-sm">Email us at:</p>
              <a href="mailto:info@v-compass.com" className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors">
                info@v-compass.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-amber-200/40 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-amber-700/80 text-sm">
              <span>© 2024 V-Compass. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for your growth</span>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="/privacy" className="text-amber-700/80 hover:text-amber-800 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-amber-700/80 hover:text-amber-800 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;