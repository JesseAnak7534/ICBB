import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiTarget, 
  FiEye, 
  FiHeart, 
  FiUsers, 
  FiAward, 
  FiGlobe,
  FiBookOpen,
  FiShield,
  FiArrowRight,
  FiExternalLink
} from 'react-icons/fi';
import './About.css';

const About = () => {
  const coreValues = [
    {
      icon: <FiAward />,
      title: 'Excellence',
      description: 'We are committed to the highest standards of scientific rigor and quality in all our research and services.'
    },
    {
      icon: <FiHeart />,
      title: 'Integrity',
      description: 'We uphold ethical standards in research, maintain transparency, and ensure data confidentiality.'
    },
    {
      icon: <FiUsers />,
      title: 'Collaboration',
      description: 'We foster partnerships across disciplines, institutions, and borders to advance scientific discovery.'
    },
    {
      icon: <FiBookOpen />,
      title: 'Innovation',
      description: 'We embrace cutting-edge technologies and methods to push the boundaries of computational biology.'
    },
    {
      icon: <FiGlobe />,
      title: 'Impact',
      description: 'We strive to make meaningful contributions to science and society, particularly in Africa.'
    },
    {
      icon: <FiShield />,
      title: 'Responsibility',
      description: 'We are committed to ethical research practices and responsible use of biological data.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'ICBB Founded', description: 'Established with a vision to advance computational biology in Africa' },
    { year: '2021', event: 'First Training Program', description: 'Launched inaugural bioinformatics workshop' },
    { year: '2022', event: 'Research Expansion', description: 'Expanded research programs and international collaborations' },
    { year: '2023', event: 'Service Launch', description: 'Launched professional data analysis services' },
    { year: '2024', event: 'Growing Impact', description: 'Trained 50+ students and researchers' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">About ICBB</span>
            <h1>Advancing Science Through Computation</h1>
            <p>
              The Institute of Computational Biology and Bioinformatics (ICBB) is 
              a pioneering research and training institution dedicated to leveraging 
              computational approaches for scientific discovery and innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="overview-section section">
        <div className="container">
          <div className="overview-grid">
            <motion.div 
              className="overview-content"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2>Who We Are</h2>
              <p>
                ICBB is a leading institute focused on computational biology, bioinformatics, 
                and biomedical data science. We bridge the gap between traditional biological 
                sciences and modern computational approaches, enabling researchers to extract 
                meaningful insights from complex biological data.
              </p>
              <p>
                Our work spans genomics, proteomics, transcriptomics, and systems biology, 
                applying advanced statistical methods, machine learning, and artificial 
                intelligence to address fundamental questions in biology and medicine.
              </p>
              <p>
                Based in Ghana, ICBB is committed to building computational biology capacity 
                in Africa while maintaining strong international collaborations with leading 
                research institutions worldwide.
              </p>
            </motion.div>
            <motion.div 
              className="overview-stats"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="stat-card">
                <span className="stat-value">15+</span>
                <span className="stat-label">Research Projects</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">5+</span>
                <span className="stat-label">Publications</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">50+</span>
                <span className="stat-label">Trained Researchers</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">8+</span>
                <span className="stat-label">Partners</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section section">
        <div className="container">
          <div className="founder-grid">
            <motion.div 
              className="founder-image"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <img 
                src="/founder.jpg" 
                alt="Jesse Azebiik Anak - Founder of ICBB"
                className="founder-photo"
              />
            </motion.div>
            <motion.div 
              className="founder-content"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">Leadership</span>
              <h2>Meet Our Founder</h2>
              <h3>Jesse Azebiik Anak</h3>
              <p className="founder-role">Founder & Director, ICBB</p>
              <p>
                Jesse Azebiik Anak is a computational biologist and bioinformatician 
                with a passion for advancing scientific research through data-driven approaches. 
                With extensive experience in genomic data analysis, statistical modeling, and 
                machine learning applications in biology, Jesse founded ICBB to address 
                the growing need for computational biology expertise in Africa.
              </p>
              <p>
                His vision is to create a world-class research institute that not only 
                conducts cutting-edge research but also trains the next generation of 
                African scientists in computational methods, ultimately contributing to 
                the advancement of science and healthcare on the continent.
              </p>
              <div className="founder-quote">
                <blockquote>
                  "The future of biological research lies at the intersection of biology, 
                  mathematics, and computer science. At ICBB, we're building that future."
                </blockquote>
              </div>
              <div className="founder-links">
                <a 
                  href="https://jesseanak.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline founder-portfolio-btn"
                >
                  <FiExternalLink /> Visit Portfolio
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section section">
        <div className="container">
          <div className="mv-grid">
            <motion.div 
              className="mv-card mission-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mv-icon">
                <FiTarget />
              </div>
              <h3>Our Mission</h3>
              <p>
                To advance scientific knowledge and innovation through cutting-edge 
                computational biology research, provide world-class training and 
                capacity building programs, and deliver exceptional data analysis 
                services that enable researchers and organizations to unlock the 
                power of biological data.
              </p>
              <ul className="mv-points">
                <li>Conduct innovative research in computational biology</li>
                <li>Train and mentor the next generation of scientists</li>
                <li>Provide professional data analysis services</li>
                <li>Foster international research collaborations</li>
              </ul>
            </motion.div>
            <motion.div 
              className="mv-card vision-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="mv-icon">
                <FiEye />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be Africa's leading institute in computational biology and 
                bioinformatics, recognized globally for excellence in research, 
                innovation, and training. We envision a future where African 
                scientists lead groundbreaking discoveries powered by computational 
                approaches.
              </p>
              <ul className="mv-points">
                <li>Lead computational biology research in Africa</li>
                <li>Build a strong pipeline of trained scientists</li>
                <li>Drive innovation in biological data science</li>
                <li>Impact global health through research</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="values-section section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Our Foundation</span>
            <h2>Core Values</h2>
            <p>The principles that guide everything we do at ICBB</p>
          </div>
          <div className="values-grid">
            {coreValues.map((value, index) => (
              <motion.div 
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline/Milestones */}
      <section className="timeline-section section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Our Journey</span>
            <h2>Milestones</h2>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="timeline-content">
                  <span className="timeline-year">{milestone.year}</span>
                  <h4>{milestone.event}</h4>
                  <p>{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why ICBB Matters */}
      <section className="impact-section section">
        <div className="container">
          <div className="impact-content">
            <div className="section-header text-center">
              <span className="section-badge light">Our Impact</span>
              <h2>Why ICBB Matters</h2>
            </div>
            <div className="impact-grid">
              <div className="impact-item">
                <h4>Bridging the Gap</h4>
                <p>
                  Africa faces a critical shortage of computational biology expertise. 
                  ICBB is working to close this gap by training researchers and providing 
                  essential services.
                </p>
              </div>
              <div className="impact-item">
                <h4>Enabling Research</h4>
                <p>
                  We empower researchers across the continent to leverage the latest 
                  computational methods, accelerating scientific discovery and innovation.
                </p>
              </div>
              <div className="impact-item">
                <h4>Global Collaboration</h4>
                <p>
                  Through partnerships with international institutions, we bring global 
                  expertise to Africa while contributing African perspectives to global science.
                </p>
              </div>
              <div className="impact-item">
                <h4>Healthcare Innovation</h4>
                <p>
                  Our work in precision medicine and population health science contributes 
                  to improving healthcare outcomes for African populations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Join Us in Advancing Science</h2>
            <p>
              Whether you're interested in collaborating on research, enrolling in our 
              training programs, or utilizing our data analysis services, we'd love to 
              hear from you.
            </p>
            <div className="cta-buttons">
              <Link to="/partnerships" className="btn btn-primary btn-lg">
                Partner With Us <FiArrowRight />
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
