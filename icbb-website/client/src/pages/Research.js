import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiDatabase, 
  FiCpu, 
  FiActivity, 
  FiTrendingUp,
  FiLayers,
  FiUsers,
  FiArrowRight
} from 'react-icons/fi';
import './Research.css';

const Research = () => {
  const researchAreas = [
    {
      id: 'computational-biology',
      icon: <FiDatabase />,
      title: 'Computational Biology',
      description: 'We develop and apply computational methods to understand biological systems at multiple scales.',
      details: [
        'Mathematical modeling of biological systems',
        'Simulation of cellular processes',
        'Network biology and systems analysis',
        'Structural biology and molecular dynamics'
      ],
      applications: 'Drug discovery, disease modeling, protein structure prediction'
    },
    {
      id: 'bioinformatics',
      icon: <FiCpu />,
      title: 'Bioinformatics & Genomics',
      description: 'State-of-the-art analysis of genomic, transcriptomic, and proteomic data.',
      details: [
        'Genome assembly and annotation',
        'RNA-seq and differential expression analysis',
        'Variant calling and interpretation',
        'Metagenomics and microbiome analysis'
      ],
      applications: 'Personalized medicine, pathogen identification, evolutionary studies'
    },
    {
      id: 'data-science',
      icon: <FiActivity />,
      title: 'Biomedical Data Science',
      description: 'Transforming healthcare and clinical data into actionable insights.',
      details: [
        'Electronic health record analysis',
        'Clinical trial data analysis',
        'Medical imaging analysis',
        'Health outcomes research'
      ],
      applications: 'Clinical decision support, epidemiology, public health surveillance'
    },
    {
      id: 'ai-ml',
      icon: <FiTrendingUp />,
      title: 'AI & Machine Learning in Biology',
      description: 'Applying cutting-edge AI and ML algorithms to biological and medical problems.',
      details: [
        'Deep learning for biological sequence analysis',
        'Computer vision for microscopy images',
        'Natural language processing for biomedical literature',
        'Predictive modeling for disease outcomes'
      ],
      applications: 'Drug design, diagnostic tools, treatment response prediction'
    },
    {
      id: 'precision-medicine',
      icon: <FiLayers />,
      title: 'Precision & Translational Medicine',
      description: 'Bridging the gap between research discoveries and clinical applications.',
      details: [
        'Pharmacogenomics',
        'Biomarker discovery',
        'Patient stratification',
        'Therapeutic target identification'
      ],
      applications: 'Personalized treatment strategies, companion diagnostics'
    },
    {
      id: 'population-health',
      icon: <FiUsers />,
      title: 'Population Health & Public Health Data Science',
      description: 'Understanding health at the population level through data analysis.',
      details: [
        'Epidemiological modeling',
        'Health disparities research',
        'Disease surveillance systems',
        'Social determinants of health analysis'
      ],
      applications: 'Disease outbreak prediction, health policy, intervention planning'
    }
  ];

  return (
    <div className="research-page">
      {/* Hero Section */}
      <section className="research-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Research & Programs</span>
            <h1>Advancing Science Through Computation</h1>
            <p>
              Our research spans multiple domains of computational biology and bioinformatics, 
              addressing fundamental questions in biology and medicine through innovative 
              computational approaches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="research-areas section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Our Focus</span>
            <h2>Research Focus Areas</h2>
            <p>Explore our key research domains and ongoing programs</p>
          </div>
          
          <div className="research-list">
            {researchAreas.map((area, index) => (
              <motion.div 
                key={area.id}
                id={area.id}
                className="research-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="research-header">
                  <div className="research-icon">{area.icon}</div>
                  <div className="research-title-section">
                    <h3>{area.title}</h3>
                    <p className="research-desc">{area.description}</p>
                  </div>
                </div>
                <div className="research-body">
                  <div className="research-details">
                    <h4>Key Focus Areas</h4>
                    <ul>
                      {area.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="research-applications">
                    <h4>Applications</h4>
                    <p>{area.applications}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="methodology-section section">
        <div className="container">
          <div className="methodology-content">
            <div className="section-header text-center">
              <span className="section-badge light">Our Approach</span>
              <h2>Research Methodology</h2>
            </div>
            <div className="methodology-grid">
              <div className="method-item">
                <span className="method-number">01</span>
                <h4>Data Collection & Integration</h4>
                <p>We work with diverse biological and clinical datasets, ensuring quality and integration.</p>
              </div>
              <div className="method-item">
                <span className="method-number">02</span>
                <h4>Algorithm Development</h4>
                <p>Custom algorithms and pipelines tailored to specific biological questions.</p>
              </div>
              <div className="method-item">
                <span className="method-number">03</span>
                <h4>Validation & Testing</h4>
                <p>Rigorous validation using independent datasets and experimental verification.</p>
              </div>
              <div className="method-item">
                <span className="method-number">04</span>
                <h4>Translation & Application</h4>
                <p>Moving discoveries from bench to bedside through practical applications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Publications Preview */}
      <section className="publications-preview section">
        <div className="container">
          <div className="pub-grid">
            <div className="pub-content">
              <span className="section-badge">Output</span>
              <h2>Publications & Impact</h2>
              <p>
                Our research has been published in leading journals and presented at 
                international conferences. We are committed to open science and sharing 
                our findings with the global scientific community.
              </p>
              <div className="pub-stats">
                <div className="pub-stat">
                  <span className="pub-number">5+</span>
                  <span className="pub-label">Publications</span>
                </div>
                <div className="pub-stat">
                  <span className="pub-number">20+</span>
                  <span className="pub-label">Citations</span>
                </div>
                <div className="pub-stat">
                  <span className="pub-number">8+</span>
                  <span className="pub-label">Collaborators</span>
                </div>
              </div>
              <Link to="/news#publications" className="btn btn-primary">
                View Publications <FiArrowRight />
              </Link>
            </div>
            <div className="pub-visual">
              <div className="pub-card">
                <h5>Recent Publications</h5>
                <div className="pub-item">
                  <span className="pub-type">Journal Article</span>
                  <p>"Machine Learning Applications in African Genomics"</p>
                  <span className="pub-journal">Nature Genetics, 2024</span>
                </div>
                <div className="pub-item">
                  <span className="pub-type">Review</span>
                  <p>"Bioinformatics Capacity Building in Africa"</p>
                  <span className="pub-journal">PLoS Computational Biology, 2024</span>
                </div>
                <div className="pub-item">
                  <span className="pub-type">Research Article</span>
                  <p>"Population Genomics of West African Populations"</p>
                  <span className="pub-journal">Genome Research, 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="research-cta section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Interested in Collaborating?</h2>
            <p>
              We welcome collaborations with researchers, institutions, and organizations 
              worldwide. Let's work together to advance computational biology.
            </p>
            <div className="cta-buttons">
              <Link to="/partnerships" className="btn btn-primary btn-lg">
                Partner With Us
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

export default Research;
