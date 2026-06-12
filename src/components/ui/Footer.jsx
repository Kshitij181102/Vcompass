import React from "react";
import { Facebook, Twitter, Instagram, Heart, Compass } from 'lucide-react';
import logo from '../../Assets/logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="vc-footer">
      {/* Decorative mesh */}
      <div className="vc-footer__mesh" aria-hidden="true">
        <div className="vc-footer__orb vc-footer__orb--1" />
        <div className="vc-footer__orb vc-footer__orb--2" />
      </div>

      <div className="vc-footer__wrap">
        {/* Main Grid */}
        <div className="vc-footer__grid">
          {/* Brand */}
          <div className="vc-footer__brand-col">
            <a href="/main" className="vc-footer__brand">
              <div className="vc-footer__logo-ring">
                <img src={logo} alt="V-Compass" />
              </div>
              <div>
                <p className="vc-footer__brand-name">V-Compass</p>
                <p className="vc-footer__brand-tagline">Guiding Your Journey</p>
              </div>
            </a>
            <p className="vc-footer__brand-desc">
              Connecting ambitious learners with world-class mentors to navigate career growth and personal development.
            </p>

            {/* Social */}
            <div className="vc-footer__socials">
              {[
                { href: 'https://facebook.com',  Icon: Facebook,  label: 'Facebook'  },
                { href: 'https://twitter.com',   Icon: Twitter,   label: 'Twitter'   },
                { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vc-footer__social-btn"
                  aria-label={label}
                >
                  <Icon size={17} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="vc-footer__col">
            <h3 className="vc-footer__col-title">Quick Links</h3>
            <nav className="vc-footer__links">
              {[
                { href: '/main',           label: 'Home'              },
                { href: '/mentor/connect', label: 'Connect with Mentors' },
                { href: '/about',          label: 'About Us'          },
                { href: '/contact',        label: 'Contact'           },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="vc-footer__link">
                  <span className="vc-footer__link-dot" />
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="vc-footer__col">
            <h3 className="vc-footer__col-title">Get in Touch</h3>
            <p className="vc-footer__contact-label">Email us at</p>
            <a href="mailto:info@v-compass.com" className="vc-footer__email">
              info@v-compass.com
            </a>

            <div className="vc-footer__badge">
              <Compass size={14} strokeWidth={2} />
              <span>Trusted by 18,000+ learners</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="vc-footer__bottom">
          <p className="vc-footer__copy">
            © {new Date().getFullYear()} V-Compass. Made with{' '}
            <Heart size={13} className="vc-footer__heart" aria-hidden="true" />
            {' '}for your growth.
          </p>
          <div className="vc-footer__legal">
            <a href="/privacy" className="vc-footer__legal-link">Privacy Policy</a>
            <span className="vc-footer__legal-sep" />
            <a href="/terms"   className="vc-footer__legal-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
