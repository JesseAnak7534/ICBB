import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiArrowRight,
  FiBarChart2,
  FiDatabase,
  FiCpu,
  FiFileText,
  FiBook,
  FiTrendingUp,
  FiCheck,
  FiClock,
  FiShield
} from 'react-icons/fi';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 'statistical-analysis',
      title: 'Statistical Data Analysis',
      icon: <FiBarChart2 />,
      description: 'Expert statistical analysis of your research data using appropriate methods and software.',
      details: 'We provide comprehensive statistical analysis services including descriptive statistics, inferential statistics, hypothesis testing, regression analysis, ANOVA, multivariate analysis, and more.',
      features: [
        'Descriptive & inferential statistics',
        'T-tests, ANOVA, regression analysis',
        'Survival analysis',
        'Power calculations',
        'Statistical report writing'
      ],
      software: ['SPSS', 'Stata', 'R', 'SAS'],
      turnaround: '5-10 business days',
      price: 'From GH₵ 500'
    },
    {
      id: 'bioinformatics',
      title: 'Bioinformatics Analysis',
      icon: <FiDatabase />,
      description: 'Advanced bioinformatics services for genomics, proteomics, and multi-omics data.',
      details: 'Our bioinformatics team offers comprehensive analysis of biological data, from sequence alignment to complex multi-omics integration.',
      features: [
        'NGS data analysis (RNA-seq, DNA-seq)',
        'Variant calling & annotation',
        'Phylogenetic analysis',
        'Pathway & GO enrichment',
        'Multi-omics integration'
      ],
      software: ['Python', 'R', 'Bioconductor', 'BLAST'],
      turnaround: '7-14 business days',
      price: 'From GH₵ 1,000'
    },
    {
      id: 'machine-learning',
      title: 'Machine Learning & AI',
      icon: <FiCpu />,
      description: 'Custom ML models and AI solutions for predictive analytics and pattern recognition.',
      details: 'We develop and deploy machine learning models tailored to your specific research questions and data types.',
      features: [
        'Predictive modeling',
        'Classification & clustering',
        'Deep learning applications',
        'Model validation & testing',
        'Deployment support'
      ],
      software: ['Python', 'TensorFlow', 'scikit-learn', 'PyTorch'],
      turnaround: '14-21 business days',
      price: 'From GH₵ 2,000'
    },
    {
      id: 'data-visualization',
      title: 'Data Visualization',
      icon: <FiTrendingUp />,
      description: 'Publication-ready figures and interactive dashboards for your research data.',
      details: 'Transform your data into compelling visual stories with our professional data visualization services.',
      features: [
        'Publication-quality figures',
        'Interactive dashboards',
        'Scientific illustrations',
        'Infographics',
        'Poster design'
      ],
      software: ['R/ggplot2', 'Python', 'Tableau', 'Power BI'],
      turnaround: '3-7 business days',
      price: 'From GH₵ 300'
    },
    {
      id: 'manuscript-support',
      title: 'Manuscript & Statistical Support',
      icon: <FiFileText />,
      description: 'Statistical sections, methods writing, and peer review support for your manuscripts.',
      details: 'Get expert support in writing statistical methods, interpreting results, and responding to reviewer comments.',
      features: [
        'Statistical methods writing',
        'Results interpretation',
        'Reviewer response support',
        'Study design consultation',
        'Sample size calculation'
      ],
      software: ['LaTeX', 'Word', 'Reference managers'],
      turnaround: '5-10 business days',
      price: 'From GH₵ 400'
    },
    {
      id: 'training-consultation',
      title: 'Training & Consultation',
      icon: <FiBook />,
      description: 'One-on-one training and consultation on statistical methods and bioinformatics.',
      details: 'Personalized training sessions to help you understand and apply computational methods to your research.',
      features: [
        'One-on-one coaching',
        'Group training sessions',
        'Software tutorials',
        'Research consultation',
        'Ongoing support'
      ],
      software: ['R', 'Python', 'SPSS', 'Stata'],
      turnaround: 'Flexible scheduling',
      price: 'From GH₵ 200/hour'
    }
  ];

  const whyChooseUs = [
    {
      icon: <FiShield />,
      title: 'Expert Team',
      description: 'Our analysts hold advanced degrees and have extensive research experience.'
    },
    {
      icon: <FiClock />,
      title: 'Quick Turnaround',
      description: 'We understand deadlines matter. Get results when you need them.'
    },
    {
      icon: <FiCheck />,
      title: 'Quality Assurance',
      description: 'Every analysis goes through rigorous quality checks.'
    },
    {
      icon: <FiFileText />,
      title: 'Clear Reporting',
      description: 'Detailed reports with methods, results, and interpretations.'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Submit Request',
      description: 'Fill out our service request form with your project details and upload your data.'
    },
    {
      step: 2,
      title: 'Get Quote',
      description: 'We review your requirements and provide a detailed quote within 24 hours.'
    },
    {
      step: 3,
      title: 'Make Payment',
      description: 'Confirm your order with secure MTN MoMo payment.'
    },
    {
      step: 4,
      title: 'Receive Results',
      description: 'Get your analysis results with comprehensive documentation.'
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Our Services</span>
            <h1>Professional Data Analysis Services</h1>
            <p>
              From basic statistics to advanced bioinformatics, we provide comprehensive 
              data analysis services to support your research. Let our experts handle 
              the analysis while you focus on discovery.
            </p>
            <Link to="/service-request" className="btn btn-white btn-lg">
              Request a Service <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-list section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">What We Offer</span>
            <h2>Comprehensive Analysis Services</h2>
            <p>Choose from our range of specialized data analysis services</p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p className="service-desc">{service.description}</p>
                <p className="service-details">{service.details}</p>
                <div className="service-features">
                  <h4>What's Included:</h4>
                  <ul>
                    {service.features.map((feature, i) => (
                      <li key={i}><FiCheck /> {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="service-meta">
                  <div className="meta-item">
                    <span className="meta-label">Software:</span>
                    <span className="meta-value">{service.software.join(', ')}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Turnaround:</span>
                    <span className="meta-value">{service.turnaround}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Price:</span>
                    <span className="meta-value price">{service.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Why ICBB</span>
            <h2>Why Choose Our Services</h2>
            <p>We combine expertise with dedication to deliver exceptional results</p>
          </div>
          
          <div className="why-grid">
            {whyChooseUs.map((item, index) => (
              <motion.div 
                key={index}
                className="why-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-badge">Process</span>
            <h2>How It Works</h2>
            <p>Simple, straightforward process from request to delivery</p>
          </div>
          
          <div className="process-grid">
            {process.map((step, index) => (
              <motion.div 
                key={index}
                className="process-step"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="step-number">{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="supported-formats section">
        <div className="container">
          <div className="formats-content">
            <div className="formats-text">
              <span className="section-badge">Data Formats</span>
              <h2>We Work With Your Data</h2>
              <p>
                We accept data in various formats including Excel, CSV, SPSS, Stata, R, 
                and more. Simply upload your files and we'll handle the rest.
              </p>
              <div className="format-list">
                <span className="format-tag">Excel (.xls, .xlsx)</span>
                <span className="format-tag">CSV</span>
                <span className="format-tag">SPSS (.sav)</span>
                <span className="format-tag">Stata (.dta)</span>
                <span className="format-tag">R (.r, .rdata)</span>
                <span className="format-tag">Text files</span>
                <span className="format-tag">ZIP archives</span>
              </div>
            </div>
            <div className="formats-image">
              <div className="data-illustration">
                <FiDatabase size={80} />
                <span>Your Data, Our Expertise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="services-cta section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Get Started?</h2>
            <p>
              Submit your service request today and let our experts help you 
              unlock insights from your data.
            </p>
            <div className="cta-buttons">
              <Link to="/service-request" className="btn btn-white btn-lg">
                Request a Service <FiArrowRight />
              </Link>
              <Link to="/contact" className="btn btn-outline-white btn-lg">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
