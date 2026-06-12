import React, { useState, useEffect } from 'react';
import { Home, Users, LogOut, User } from 'lucide-react';
import logo from "../../Assets/logo.png";
import apis from "../../utils/apis";
import './NavBar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(apis().logoutUser, { method: 'POST', credentials: 'include' });
    } catch {}
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const navLinks = [
    { href: '/main',           icon: Home,  label: 'Home'    },
    { href: '/mentor/connect', icon: Users, label: 'Connect' },
    { href: '/profile',        icon: User,  label: 'Profile' },
  ];

  return (
    <>
      <nav className={`vc-nav${scrolled ? ' vc-nav--scrolled' : ''}`}>
        <div className="vc-nav__wrap">
          {/* Brand */}
          <a href="/main" className="vc-nav__brand">
            <div className="vc-nav__logo-ring">
              <img src={logo} alt="V-Compass" />
            </div>
            <span className="vc-nav__brand-name">V-Compass</span>
          </a>

          {/* Desktop Links */}
          <div className="vc-nav__links">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                className={`vc-nav__link${window.location.pathname === href ? ' vc-nav__link--active' : ''}`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </a>
            ))}
            <button className="vc-nav__logout" onClick={handleLogout}>
              <LogOut size={15} strokeWidth={2} />
              Sign out
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`vc-nav__hamburger${isMenuOpen ? ' vc-nav__hamburger--open' : ''}`}
            onClick={() => setIsMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span className="vc-nav__bar" />
            <span className="vc-nav__bar" />
            <span className="vc-nav__bar" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`vc-nav__drawer${isMenuOpen ? ' vc-nav__drawer--open' : ''}`}>
        <div className="vc-nav__drawer-inner">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={href}
              href={href}
              className="vc-nav__drawer-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </a>
          ))}
          <button
            className="vc-nav__drawer-logout"
            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
          >
            <LogOut size={18} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
