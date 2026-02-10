import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiGlobe,
  FiUsers,
  FiBookOpen,
  FiArrowRight,
  FiCheck,
  FiMail
} from 'react-icons/fi';
import './Partnerships.css';

const Partnerships = () => {
  const partnerTypes = [
    {
      icon: <FiGlobe />,
      title: 'Academic Institutions',
      description: 'Collaborate on research projects, share resources, and co-develop training programs.',
      benefits: [
        'Joint research projects',
        'Student exchange opportunities',
        'Shared computational resources',
        'Co-authored publications'
      ]
    },
    {
      icon: <FiUsers />,
      title: 'Research Organizations',
      description: 'Partner on large-scale studies, data sharing initiatives, and methodology development.',
      benefits: [
        'Multi-center studies',
        'Standardized protocols',
        'Data sharing agreements',
        'Methodological innovation'
      ]
    },
    {
      icon: <FiBookOpen />,
      title: 'Healthcare & Industry',
      description: 'Apply computational approaches to real-world health challenges and product development.',
      benefits: [
        'Clinical data analysis',
        'Biomarker discovery',
        'Drug development support',
        'Health technology assessment'
      ]
    }
  ];

  const currentPartners = [
    { name: 'University Partners', count: '5+', category: 'Academic' },
    { name: 'Research Institutes', count: '3+', category: 'Research' },
    { name: 'Health Organizations', count: '4+', category: 'Healthcare' },
    { name: 'International Collaborators', count: '10+', category: 'Global' }
  ];

  const collaborationAreas = [
    'Genomics & Bioinformatics',
    'Public Health Analytics',
    'Clinical Research Support',
    'Machine Learning Applications',
    'Epidemiological Studies',
    'Drug Discovery',
    'Population Health Research',
    'Training & Capacity Building'
  ];

  return (
    <div className="partnerships-page">
      {/* Hero Section */}
      <section className="partnerships-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Collaborations</span>
            <h1>Partner With Us</h1>
            <p>
              Join our network of research institutions, universities, and organizations 
              working together to advance computational biology and bioinformatics in Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="partner-types section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Partnership Opportunities</span>
            <h2>How We Collaborate</h2>
            <p>Explore different ways to partner with ICBB</p>
          </div>
          
          <div className="types-grid">
            {partnerTypes.map((type, index) => (
              <motion.div 
                key={index}
                className="type-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="type-icon">{type.icon}</div>
                <h3>{type.title}</h3>
                <p className="type-desc">{type.description}</p>
                <div className="type-benefits">
                  <h4>Benefits:</h4>
                  <ul>
                    {type.benefits.map((benefit, i) => (
                      <li key={i}><FiCheck /> {benefit}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Network */}
      <section className="current-network section">
        <div className="container">
          <div className="network-content">
            <div className="network-text">
              <span className="section-badge">Our Network</span>
              <h2>Growing Together</h2>
              <p>
                We're proud to collaborate with institutions and organizations across 
                Africa and globally. Our partnerships enable us to expand our impact 
                and deliver better outcomes for research communities.
              </p>
              <div className="partner-stats">
                {currentPartners.map((partner, index) => (
                  <div key={index} className="partner-stat">
                    <span className="stat-count">{partner.count}</span>
                    <span className="stat-label">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="network-visual">
              <div className="network-circle">
                <span>ICBB</span>
                <div className="network-nodes">
                  <div className="node node-1">Academic</div>
                  <div className="node node-2">Research</div>
                  <div className="node node-3">Healthcare</div>
                  <div className="node node-4">Global</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Areas */}
      <section className="collab-areas section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Focus Areas</span>
            <h2>Areas of Collaboration</h2>
            <p>We welcome partnerships in these key areas</p>
          </div>
          
          <div className="areas-grid">
            {collaborationAreas.map((area, index) => (
              <motion.div 
                key={index}
                className="area-tag"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                {area}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="become-partner section">
        <div className="container">
          <div className="partner-cta">
            <div className="cta-content">
              <h2>Become a Partner</h2>
              <p>
                Interested in collaborating with ICBB? We're always looking for 
                like-minded institutions and organizations to work with. Let's 
                discuss how we can create impact together.
              </p>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">
                  Get in Touch <FiArrowRight />
                </Link>
                <a href="mailto:partnerships@icbb.org" className="btn btn-outline btn-lg">
                  <FiMail /> Email Us
                </a>
              </div>
            </div>
            <div className="cta-features">
              <div className="feature">
                <FiCheck />
                <span>Flexible partnership models</span>
              </div>
              <div className="feature">
                <FiCheck />
                <span>Shared goals and outcomes</span>
              </div>
              <div className="feature">
                <FiCheck />
                <span>Transparent collaboration</span>
              </div>
              <div className="feature">
                <FiCheck />
                <span>Long-term relationships</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;
