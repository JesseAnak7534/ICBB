import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { 
      label: 'Research',
      dropdown: [
        { path: '/research', label: 'All Programs' },
        { path: '/research#computational-biology', label: 'Computational Biology' },
        { path: '/research#bioinformatics', label: 'Bioinformatics & Genomics' },
        { path: '/research#data-science', label: 'Biomedical Data Science' },
        { path: '/research#ai-ml', label: 'AI & Machine Learning' },
      ]
    },
    { path: '/training', label: 'Training' },
    { 
      label: 'Services',
      dropdown: [
        { path: '/services', label: 'All Services' },
        { path: '/services/request', label: 'Request Service' },
      ]
    },
    { path: '/partnerships', label: 'Partnerships' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact' },
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="ICBB Logo" className="logo-image" />
          <span className="logo-name">ICBB</span>
        </Link>

        <nav className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link, index) => (
              <li 
                key={index} 
                className={`nav-item ${link.dropdown ? 'has-dropdown' : ''}`}
                onMouseEnter={() => link.dropdown && setActiveDropdown(index)}
                onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
              >
                {link.dropdown ? (
                  <>
                    <button 
                      className="nav-link dropdown-trigger"
                      onClick={() => toggleDropdown(index)}
                      aria-expanded={activeDropdown === index}
                    >
                      {link.label}
                      <FiChevronDown className={`dropdown-icon ${activeDropdown === index ? 'open' : ''}`} />
                    </button>
                    <ul className={`dropdown-menu ${activeDropdown === index ? 'open' : ''}`}>
                      {link.dropdown.map((item, subIndex) => (
                        <li key={subIndex}>
                          <Link to={item.path} className="dropdown-link">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link 
                    to={link.path} 
                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link to="/services/request" className="btn btn-primary nav-cta">
            Request Service
          </Link>
        </nav>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
