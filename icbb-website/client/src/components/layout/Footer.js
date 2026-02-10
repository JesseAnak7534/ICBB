import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiTwitter, 
  FiLinkedin, 
  FiGithub,
  FiFacebook 
} from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/about', label: 'About ICBB' },
    { path: '/research', label: 'Research Programs' },
    { path: '/training', label: 'Training & Courses' },
    { path: '/services', label: 'Data Analysis Services' },
    { path: '/partnerships', label: 'Partnerships' },
    { path: '/news', label: 'News & Events' },
  ];

  const serviceLinks = [
    { path: '/services#data-cleaning', label: 'Data Cleaning' },
    { path: '/services#data-analysis', label: 'Data Analysis' },
    { path: '/services#statistical-consulting', label: 'Statistical Consulting' },
    { path: '/services#bioinformatics', label: 'Bioinformatics Analysis' },
    { path: '/services#paper-review', label: 'Research Paper Review' },
    { path: '/services/request', label: 'Request Service' },
  ];

  const legalLinks = [
    { path: '/privacy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms of Service' },
    { path: '/about#ethics', label: 'Research Ethics' },
  ];

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-section footer-about">
              <div className="footer-logo">
                <img src="/logo.png" alt="ICBB Logo" className="logo-image" />
                <span className="logo-name">ICBB</span>
              </div>
              <p className="footer-description">
                Advancing science through computation, data, and innovation. 
                ICBB is dedicated to cutting-edge research, capacity building, 
                and providing world-class data analysis services.
              </p>
              <div className="footer-social">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FiTwitter />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <FiGithub />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FiFacebook />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4 className="footer-title">Our Services</h4>
              <ul className="footer-links">
                {serviceLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4 className="footer-title">Contact Us</h4>
              <ul className="footer-contact">
                <li>
                  <FiMail />
                  <a href="mailto:info@icbb.org">info@icbb.org</a>
                </li>
                <li>
                  <FiPhone />
                  <a href="tel:+233559759592">+233 55 975 9592</a>
                </li>
                <li>
                  <FiMapPin />
                  <span>Ghana, West Africa</span>
                </li>
              </ul>
              <div className="footer-newsletter">
                <h5>Stay Updated</h5>
                <p>Subscribe to our newsletter for the latest news and updates.</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    aria-label="Email address"
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} ICBB - Institute of Computational Biology and Bioinformatics. 
              All rights reserved.
            </p>
            <ul className="footer-legal">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
