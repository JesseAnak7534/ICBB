import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, 
  FiDatabase, 
  FiCpu, 
  FiActivity,
  FiUsers,
  FiAward,
  FiGlobe,
  FiTrendingUp,
  FiBookOpen,
  FiCheckCircle
} from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const focusAreas = [
    {
      icon: <FiDatabase />,
      title: 'Computational Biology',
      description: 'Advanced computational methods to solve complex biological problems and analyze molecular data.'
    },
    {
      icon: <FiCpu />,
      title: 'Bioinformatics & Genomics',
      description: 'State-of-the-art genomic analysis, sequence alignment, and biological database management.'
    },
    {
      icon: <FiActivity />,
      title: 'Biomedical Data Science',
      description: 'Transforming healthcare data into actionable insights for improved patient outcomes.'
    },
    {
      icon: <FiTrendingUp />,
      title: 'AI & Machine Learning',
      description: 'Applying artificial intelligence and ML algorithms to biological and medical research.'
    }
  ];

  const services = [
    {
      icon: <FiDatabase />,
      title: 'Data Cleaning & Analysis',
      description: 'Professional data preparation and comprehensive statistical analysis services.'
    },
    {
      icon: <FiCpu />,
      title: 'Bioinformatics Analysis',
      description: 'Expert genomic and bioinformatics analysis for your research projects.'
    },
    {
      icon: <FiBookOpen />,
      title: 'Research Support',
      description: 'Methods review, statistical consulting, and manuscript preparation assistance.'
    }
  ];

  const stats = [
    { number: '15+', label: 'Research Projects' },
    { number: '5+', label: 'Publications' },
    { number: '50+', label: 'Students Trained' },
    { number: '8+', label: 'Partners' }
  ];

  const whyChooseUs = [
    'Expert team with international research experience',
    'Cutting-edge computational infrastructure',
    'Confidential and secure data handling',
    'Fast turnaround times',
    'Affordable pricing for African researchers',
    'Continuous support and consultation'
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <motion.div 
            className="hero-content"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.span className="hero-badge" variants={fadeInUp}>
              🧬 Research • Training • Innovation
            </motion.span>
            <motion.h1 className="hero-title" variants={fadeInUp}>
              Institute of <span className="text-gradient">Computational Biology</span> and <span className="text-gradient">Bioinformatics</span>
            </motion.h1>
            <motion.p className="hero-subtitle" variants={fadeInUp}>
              Advancing Science Through Computation, Data, and Innovation
            </motion.p>
            <motion.p className="hero-description" variants={fadeInUp}>
              ICBB is a leading research institute dedicated to computational biology, 
              bioinformatics, and biomedical data science. We provide world-class research, 
              training, and professional data analysis services.
            </motion.p>
            <motion.div className="hero-buttons" variants={fadeInUp}>
              <Link to="/research" className="btn btn-white btn-lg">
                Explore Research
                <FiArrowRight />
              </Link>
              <Link to="/services/request" className="btn btn-outline btn-lg hero-btn-outline">
                Request Data Analysis
                <FiArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="about-preview section">
        <div className="container">
          <div className="about-grid">
            <motion.div 
              className="about-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">About ICBB</span>
              <h2 className="section-title">Pioneering Computational Research in Africa</h2>
              <p className="about-text">
                The Institute of Computational Biology and Bioinformatics (ICBB) is 
                a premier research and training institution focused on advancing scientific 
                discovery through computational approaches. Founded by Jesse Azebiik Anak, 
                ICBB bridges the gap between traditional biology and modern data science.
              </p>
              <div className="mission-vision">
                <div className="mission-box">
                  <h4>Our Mission</h4>
                  <p>To advance scientific knowledge through cutting-edge computational biology research, 
                  provide world-class training, and deliver exceptional data analysis services.</p>
                </div>
                <div className="vision-box">
                  <h4>Our Vision</h4>
                  <p>To be Africa's leading institute in computational biology and bioinformatics, 
                  driving innovation and building capacity for the next generation of scientists.</p>
                </div>
              </div>
              <Link to="/about" className="btn btn-primary">
                Learn More About Us
                <FiArrowRight />
              </Link>
            </motion.div>
            <motion.div 
              className="about-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="visual-card">
                <div className="visual-icon"><FiGlobe /></div>
                <h4>Global Impact</h4>
                <p>Collaborating with researchers and institutions worldwide</p>
              </div>
              <div className="visual-card">
                <div className="visual-icon"><FiUsers /></div>
                <h4>Capacity Building</h4>
                <p>Training the next generation of African scientists</p>
              </div>
              <div className="visual-card">
                <div className="visual-icon"><FiAward /></div>
                <h4>Excellence</h4>
                <p>Committed to the highest standards in research</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Focus Areas Section */}
      <section className="focus-section section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Our Focus</span>
            <h2 className="section-title">Research & Focus Areas</h2>
            <p className="section-description">
              We specialize in cutting-edge research across multiple domains of 
              computational biology and bioinformatics.
            </p>
          </div>
          <div className="focus-grid">
            {focusAreas.map((area, index) => (
              <motion.div 
                key={index} 
                className="focus-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="focus-icon">{area.icon}</div>
                <h3 className="focus-title">{area.title}</h3>
                <p className="focus-description">{area.description}</p>
                <Link to="/research" className="focus-link">
                  Learn more <FiArrowRight />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-preview section">
        <div className="container">
          <div className="services-grid">
            <motion.div 
              className="services-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">Services</span>
              <h2 className="section-title">Data Analysis & Research Support</h2>
              <p className="services-text">
                ICBB offers professional data analysis and research support services 
                to researchers, students, and organizations. Our team of experts 
                provides comprehensive solutions for all your data needs.
              </p>
              <div className="services-features">
                {services.map((service, index) => (
                  <div key={index} className="service-feature">
                    <div className="service-icon">{service.icon}</div>
                    <div className="service-info">
                      <h4>{service.title}</h4>
                      <p>{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="services-buttons">
                <Link to="/services" className="btn btn-primary">
                  View All Services
                  <FiArrowRight />
                </Link>
                <Link to="/services/request" className="btn btn-secondary">
                  Request Service Now
                  <FiArrowRight />
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="services-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="why-choose-card">
                <h3>Why Choose ICBB?</h3>
                <ul className="why-list">
                  {whyChooseUs.map((item, index) => (
                    <li key={index}>
                      <FiCheckCircle />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section className="training-preview section">
        <div className="container">
          <div className="training-card">
            <div className="training-content">
              <span className="section-badge light">Training & Capacity Building</span>
              <h2>Build Your Skills in Computational Biology</h2>
              <p>
                Join our comprehensive training programs designed for researchers, 
                students, and professionals. From beginner workshops to advanced 
                bootcamps, we offer courses tailored to your needs.
              </p>
              <div className="training-highlights">
                <div className="highlight">
                  <strong>Workshops</strong>
                  <span>Hands-on practical sessions</span>
                </div>
                <div className="highlight">
                  <strong>Short Courses</strong>
                  <span>Intensive skill-building programs</span>
                </div>
                <div className="highlight">
                  <strong>Bootcamps</strong>
                  <span>Immersive training experiences</span>
                </div>
              </div>
              <Link to="/training" className="btn btn-white">
                Explore Training Programs
                <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Get Started?</h2>
            <p>
              Whether you need data analysis services, want to partner with us, 
              or are looking to enhance your skills, we're here to help.
            </p>
            <div className="cta-buttons">
              <Link to="/services/request" className="btn btn-primary btn-lg">
                Request Data Analysis
              </Link>
              <Link to="/partnerships" className="btn btn-outline btn-lg">
                Partner With Us
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
