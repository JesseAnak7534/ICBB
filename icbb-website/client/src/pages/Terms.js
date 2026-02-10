import React from 'react';
import { motion } from 'framer-motion';
import './Privacy.css';

const Terms = () => {
  const lastUpdated = 'January 1, 2024';

  return (
    <div className="terms-page legal-page">
      <section className="legal-hero">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Terms of Service</h1>
            <p>Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      <section className="legal-content section">
        <div className="container">
          <div className="legal-container">
            <div className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the services provided by the Institute of Computational 
                Biology and Bioinformatics (ICBB), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div className="legal-section">
              <h2>2. Services Description</h2>
              <p>ICBB provides:</p>
              <ul>
                <li>Statistical and bioinformatics data analysis services</li>
                <li>Training programs in computational biology</li>
                <li>Research consultation and support</li>
                <li>Data visualization and reporting services</li>
              </ul>
              <p>
                The specific scope, deliverables, and timelines for each service will be 
                agreed upon between ICBB and the client before work commences.
              </p>
            </div>

            <div className="legal-section">
              <h2>3. Service Requests and Payments</h2>
              <h3>3.1 Submitting Requests</h3>
              <p>
                Service requests must be submitted through our website or via email. 
                All requests are subject to review and acceptance by ICBB.
              </p>
              
              <h3>3.2 Pricing</h3>
              <p>
                Service prices vary based on complexity, data size, and specific requirements. 
                A quote will be provided after reviewing your project details. The initial 
                deposit is non-refundable once work has commenced.
              </p>
              
              <h3>3.3 Payment Methods</h3>
              <p>
                We accept payments via MTN Mobile Money (MoMo). Payment must be received 
                before analysis work begins unless otherwise agreed in writing.
              </p>
            </div>

            <div className="legal-section">
              <h2>4. Data Handling and Confidentiality</h2>
              <h3>4.1 Data Ownership</h3>
              <p>
                You retain all ownership rights to your data. By submitting data for analysis, 
                you grant ICBB a limited license to use the data solely for the purpose of 
                providing the requested services.
              </p>
              
              <h3>4.2 Confidentiality</h3>
              <p>
                ICBB treats all client data as confidential. We will not share, publish, or 
                disclose your data to third parties without your explicit written consent, 
                except as required by law.
              </p>
              
              <h3>4.3 Data Security</h3>
              <p>
                We employ reasonable security measures to protect your data during transmission 
                and storage. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div className="legal-section">
              <h2>5. Deliverables and Results</h2>
              <h3>5.1 Delivery</h3>
              <p>
                Analysis results will be delivered via secure email or through our client portal. 
                Estimated delivery times will be provided with your quote and may vary based on 
                project complexity.
              </p>
              
              <h3>5.2 Revisions</h3>
              <p>
                One round of minor revisions is included with each analysis. Additional 
                revisions or significant changes to the original scope may incur additional charges.
              </p>
              
              <h3>5.3 Use of Results</h3>
              <p>
                You are free to use the analysis results for your research, publications, 
                and other legitimate purposes. We appreciate acknowledgment of ICBB's 
                contribution in any resulting publications.
              </p>
            </div>

            <div className="legal-section">
              <h2>6. Intellectual Property</h2>
              <p>
                Any custom scripts, tools, or methodologies developed specifically for your 
                project remain the intellectual property of ICBB unless otherwise agreed in writing. 
                You receive a license to use the outputs derived from these tools for your project.
              </p>
            </div>

            <div className="legal-section">
              <h2>7. Training Programs</h2>
              <h3>7.1 Registration</h3>
              <p>
                Training registration is subject to availability. Payment must be completed 
                to confirm your spot in any training program.
              </p>
              
              <h3>7.2 Cancellation</h3>
              <p>
                Cancellations made more than 14 days before the program start date are eligible 
                for a full refund minus a 10% administrative fee. Cancellations within 14 days 
                may be offered a credit for future programs.
              </p>
              
              <h3>7.3 Certificates</h3>
              <p>
                Certificates of completion are issued to participants who attend at least 80% 
                of the program sessions and complete all required assessments.
              </p>
            </div>

            <div className="legal-section">
              <h2>8. Limitation of Liability</h2>
              <p>
                ICBB provides services on an "as is" basis. While we strive for accuracy and 
                quality in all our work, we make no warranties or representations regarding 
                the results of our analysis. ICBB shall not be liable for any indirect, 
                incidental, special, or consequential damages arising from the use of our services.
              </p>
              <p>
                Our maximum liability for any claim related to our services shall not exceed 
                the total amount paid for the specific service in question.
              </p>
            </div>

            <div className="legal-section">
              <h2>9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless ICBB, its officers, directors, employees, 
                and agents from any claims, damages, or expenses arising from your use of our 
                services or violation of these terms.
              </p>
            </div>

            <div className="legal-section">
              <h2>10. Termination</h2>
              <p>
                Either party may terminate the service agreement with written notice. Upon 
                termination, you will be responsible for payment for all work completed up 
                to the termination date. ICBB reserves the right to refuse service to anyone 
                for any reason at any time.
              </p>
            </div>

            <div className="legal-section">
              <h2>11. Modifications to Terms</h2>
              <p>
                ICBB reserves the right to modify these Terms of Service at any time. 
                Changes will be effective immediately upon posting to our website. Your 
                continued use of our services after changes constitutes acceptance of the 
                modified terms.
              </p>
            </div>

            <div className="legal-section">
              <h2>12. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance 
                with the laws of Ghana. Any disputes arising under these terms shall be 
                resolved in the courts of Ghana.
              </p>
            </div>

            <div className="legal-section">
              <h2>13. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> legal@icbb.org</p>
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

export default Terms;
