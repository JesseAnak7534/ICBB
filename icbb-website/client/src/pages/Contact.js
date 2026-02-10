import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiMessageSquare,
  FiUsers,
  FiHelpCircle
} from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Error sending message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail />,
      title: 'Email Us',
      details: ['info@icbb.org', 'services@icbb.org'],
      description: 'Send us an email anytime'
    },
    {
      icon: <FiPhone />,
      title: 'Call Us',
      details: ['+233 55 975 9592'],
      description: 'Mon-Fri, 9AM-5PM GMT'
    },
    {
      icon: <FiMapPin />,
      title: 'Location',
      details: ['Accra, Ghana'],
      description: 'West Africa'
    },
    {
      icon: <FiClock />,
      title: 'Business Hours',
      details: ['Monday - Friday', '9:00 AM - 5:00 PM'],
      description: 'Ghana Standard Time'
    }
  ];

  const quickHelp = [
    {
      icon: <FiMessageSquare />,
      title: 'General Inquiry',
      description: 'Questions about our services or research'
    },
    {
      icon: <FiUsers />,
      title: 'Partnership',
      description: 'Interested in collaborating with us'
    },
    {
      icon: <FiHelpCircle />,
      title: 'Technical Support',
      description: 'Help with ongoing projects or analysis'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="page-badge">Get in Touch</span>
            <h1>Contact Us</h1>
            <p>
              Have questions or ready to start a project? We'd love to hear from you. 
              Reach out and let's discuss how we can help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-info-section section">
        <div className="container">
          <div className="info-grid">
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                className="info-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="info-icon">{info.icon}</div>
                <h3>{info.title}</h3>
                <div className="info-details">
                  {info.details.map((detail, i) => (
                    <span key={i}>{detail}</span>
                  ))}
                </div>
                <p className="info-description">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Quick Help */}
      <section className="contact-form-section section">
        <div className="container">
          <div className="contact-grid">
            <div className="form-wrapper">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us how we can help..."
                    rows={6}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'} <FiSend />
                </button>
              </form>
            </div>
            
            <div className="quick-help">
              <h3>How Can We Help?</h3>
              <p>Choose the category that best describes your inquiry:</p>
              
              <div className="help-options">
                {quickHelp.map((option, index) => (
                  <div key={index} className="help-card">
                    <div className="help-icon">{option.icon}</div>
                    <div className="help-content">
                      <h4>{option.title}</h4>
                      <p>{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="response-time">
                <h4>Response Time</h4>
                <p>
                  We typically respond to inquiries within 24-48 hours during business days. 
                  For urgent matters, please call us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="map-section">
        <div className="map-placeholder">
          <FiMapPin size={48} />
          <h3>Accra, Ghana</h3>
          <p>Serving researchers across Africa and beyond</p>
        </div>
      </section>
    </div>
  );
};

export default Contact;
