import React from 'react';
import { motion } from 'framer-motion';
import './Privacy.css';

const Privacy = () => {
  const lastUpdated = 'January 1, 2024';

  return (
    <div className="privacy-page legal-page">
      <section className="legal-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Privacy Policy</h1>
            <p>Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      <section className="legal-content section">
        <div className="container">
          <div className="legal-container">
            <div className="legal-section">
              <h2>1. Introduction</h2>
              <p>
                The Institute of Computational Biology and Bioinformatics (ICBB) is committed 
                to protecting your privacy. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website or use our services.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Information We Collect</h2>
              <h3>2.1 Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Register for our services or training programs</li>
                <li>Submit a service request</li>
                <li>Contact us through our website</li>
                <li>Subscribe to our newsletter</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Name and title</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Institution or organization</li>
                <li>Payment information (processed securely through MTN MoMo)</li>
              </ul>

              <h3>2.2 Research Data</h3>
              <p>
                When you submit data for analysis, we collect and process the data files you provide. 
                This data is treated with strict confidentiality and is used solely for the purpose 
                of providing the requested analysis services.
              </p>

              <h3>2.3 Automatically Collected Information</h3>
              <p>
                We may automatically collect certain information when you visit our website, including:
              </p>
              <ul>
                <li>IP address and browser type</li>
                <li>Pages visited and time spent</li>
                <li>Referring website addresses</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Process your service requests and payments</li>
                <li>Communicate with you about your projects</li>
                <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Analyze website usage to improve user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your 
                personal information and research data. This includes:
              </p>
              <ul>
                <li>Secure data storage with encryption</li>
                <li>Access controls limiting who can view your data</li>
                <li>Regular security assessments</li>
                <li>Secure data transmission protocols (HTTPS)</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>5. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to fulfill the 
                purposes for which it was collected. Research data submitted for analysis is 
                retained for a period of 90 days after project completion, unless you request 
                earlier deletion or extended storage.
              </p>
            </div>

            <div className="legal-section">
              <h2>6. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information only in the following circumstances:
              </p>
              <ul>
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>With service providers who assist in our operations (under confidentiality agreements)</li>
                <li>To protect our rights, privacy, safety, or property</li>
              </ul>
            </div>

            <div className="legal-section">
              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@icbb.org">privacy@icbb.org</a>.
              </p>
            </div>

            <div className="legal-section">
              <h2>8. Cookies</h2>
              <p>
                Our website may use cookies and similar tracking technologies to enhance your 
                experience. You can control cookie settings through your browser preferences.
              </p>
            </div>

            <div className="legal-section">
              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of 
                any changes by posting the new Privacy Policy on this page and updating the 
                "Last updated" date.
              </p>
            </div>

            <div className="legal-section">
              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us at:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@icbb.org</p>
                <p><strong>Phone:</strong> +233 55 975 9592</p>
                <p><strong>Address:</strong> Accra, Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
