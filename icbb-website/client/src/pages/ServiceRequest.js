import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiUpload,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiInfo,
  FiDollarSign,
  FiX
} from 'react-icons/fi';
import './ServiceRequest.css';

const ServiceRequest = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    phone: '',
    institution: '',
    serviceType: '',
    description: '',
    deadline: '',
    additionalNotes: '',
    files: []
  });
  const [paymentData, setPaymentData] = useState({
    momoNumber: '',
    confirmed: false,
    transactionId: '',
    paymentInstructions: null
  });
  
  const fileInputRef = useRef(null);

  const serviceTypes = [
    { value: 'data-cleaning', label: 'Data Cleaning Only', basePrice: 500 },
    { value: 'data-analysis', label: 'Data Analysis Only', basePrice: 700 },
    { value: 'data-cleaning-analysis', label: 'Data Cleaning + Full Analysis', basePrice: 1000 },
    { value: 'statistical-consulting', label: 'Statistical Consulting', basePrice: 600 },
    { value: 'bioinformatics-analysis', label: 'Bioinformatics Analysis', basePrice: 1200 },
    { value: 'paper-review', label: 'Research Paper Review', basePrice: 500 }
  ];

  const steps = [
    { number: 1, title: 'Personal Info', icon: <FiUser /> },
    { number: 2, title: 'Project Details', icon: <FiFileText /> },
    { number: 3, title: 'Upload Files', icon: <FiUpload /> },
    { number: 4, title: 'Review & Pay', icon: <FiDollarSign /> },
    { number: 5, title: 'Confirmation', icon: <FiCheck /> }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validExtensions = ['.xls', '.xlsx', '.csv', '.sav', '.dta', '.r', '.rdata', '.txt', '.zip', '.pdf', '.doc', '.docx', '.opju'];
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    const validFiles = newFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(ext)) {
        toast.error(`Invalid file type: ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name} (max 50MB)`);
        return false;
      }
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const getSelectedService = () => {
    return serviceTypes.find(s => s.value === formData.serviceType);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.clientName || !formData.clientEmail || !formData.phone) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
          toast.error('Please enter a valid email address');
          return false;
        }
        return true;
      case 2:
        if (!formData.serviceType || !formData.description) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;
      case 3:
        return true; // Files are optional
      case 4:
        if (!paymentData.momoNumber) {
          toast.error('Please enter your MoMo number');
          return false;
        }
        if (!/^0[235]\d{8}$/.test(paymentData.momoNumber)) {
          toast.error('Please enter a valid Ghana phone number');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitRequest = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('clientName', formData.clientName);
      submitData.append('clientEmail', formData.clientEmail);
      submitData.append('phone', formData.phone);
      submitData.append('institution', formData.institution);
      submitData.append('serviceType', formData.serviceType);
      submitData.append('description', formData.description);
      submitData.append('deadline', formData.deadline);
      submitData.append('additionalNotes', formData.additionalNotes);
      
      formData.files.forEach(file => {
        submitData.append('files', file);
      });
      
      // Submit service request
      const response = await fetch('/api/services/request', {
        method: 'POST',
        body: submitData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRequestId(data.data.requestId);
        
        // Initiate payment - get payment instructions
        const paymentResponse = await fetch('/api/payments/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId: data.data.requestId,
            momoNumber: paymentData.momoNumber,
            amount: getSelectedService()?.basePrice || 500
          })
        });
        
        const paymentResult = await paymentResponse.json();
        
        if (paymentResult.success) {
          // Store payment instructions to display
          setPaymentData(prev => ({
            ...prev,
            paymentInstructions: paymentResult.data
          }));
          toast.success('Request submitted! Please complete payment using the instructions below.');
          setCurrentStep(5);
        } else {
          toast.warning('Request submitted but payment setup failed. We will contact you.');
          setCurrentStep(5);
        }
      } else {
        toast.error(data.message || 'Failed to submit request');
      }
    } catch (error) {
      toast.error('Error submitting request. Please try again.');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Personal Information</h2>
            <p className="step-description">
              Please provide your contact details so we can reach you.
            </p>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0XX XXX XXXX"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Institution/Organization</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Your institution (optional)"
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <h2>Project Details</h2>
            <p className="step-description">
              Tell us about your project and the analysis you need.
            </p>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map(service => (
                    <option key={service.value} value={service.value}>
                      {service.label} (From GH₵ {service.basePrice})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Project Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Describe your project, data, research questions, and what analysis you need..."
                  rows={6}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Any other information we should know..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <h2>Upload Your Data</h2>
            <p className="step-description">
              Upload your data files for analysis. Supported formats: Excel, CSV, SPSS, Stata, R, Text, ZIP, PDF, Word.
            </p>
            
            <div 
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiUpload className="upload-icon" />
              <h3>Click to upload files</h3>
              <p>or drag and drop your files here</p>
              <span className="upload-hint">Max file size: 50MB each</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".xls,.xlsx,.csv,.sav,.dta,.r,.rdata,.txt,.zip,.pdf,.doc,.docx,.opju"
                style={{ display: 'none' }}
              />
            </div>
            
            {formData.files.length > 0 && (
              <div className="file-list">
                <h4>Selected Files ({formData.files.length})</h4>
                {formData.files.map((file, index) => (
                  <div key={index} className="file-item">
                    <FiFileText />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button 
                      type="button"
                      className="file-remove"
                      onClick={() => removeFile(index)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="info-box">
              <FiInfo />
              <p>
                Files are optional at this stage. You can upload them later or send via email.
                Your data will be kept strictly confidential.
              </p>
            </div>
          </div>
        );
      
      case 4:
        const selectedService = getSelectedService();
        return (
          <div className="step-content">
            <h2>Review & Payment</h2>
            <p className="step-description">
              Review your request and complete payment via MTN Mobile Money.
            </p>
            
            <div className="review-summary">
              <h3>Request Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Name:</span>
                  <span className="summary-value">{formData.clientName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Email:</span>
                  <span className="summary-value">{formData.clientEmail}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Service:</span>
                  <span className="summary-value">{selectedService?.label}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Description:</span>
                  <span className="summary-value">{formData.description.substring(0, 50)}...</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Files:</span>
                  <span className="summary-value">
                    {formData.files.length} file(s) attached
                  </span>
                </div>
                <div className="summary-item highlight">
                  <span className="summary-label">Initial Payment:</span>
                  <span className="summary-value price">
                    GH₵ {selectedService?.basePrice || 500}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="payment-section">
              <h3>MTN Mobile Money Payment</h3>
              <div className="momo-info">
                <img 
                  src="/momo-logo.png" 
                  alt="MTN MoMo" 
                  className="momo-logo"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <p>
                  A payment prompt will be sent to your MTN MoMo number.
                  Please approve the payment to complete your request.
                </p>
              </div>
              <div className="form-group">
                <label className="form-label">Your MoMo Number *</label>
                <input
                  type="tel"
                  value={paymentData.momoNumber}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, momoNumber: e.target.value }))}
                  className="form-input"
                  placeholder="024 XXX XXXX"
                />
              </div>
              <div className="payment-note">
                <FiInfo />
                <p>
                  This is a deposit. Final pricing will be determined after we review your project 
                  requirements. Any balance will be invoiced separately.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="step-content confirmation">
            <div className="success-icon">
              <FiCheck />
            </div>
            <h2>Request Submitted Successfully!</h2>
            <p className="confirmation-message">
              Thank you for your request. Please complete payment using the instructions below.
            </p>
            {requestId && (
              <div className="request-id">
                <span>Reference Number:</span>
                <strong>{requestId}</strong>
              </div>
            )}
            
            {/* Payment Instructions */}
            {paymentData.paymentInstructions && (
              <div className="payment-instructions-box">
                <h3>💳 Complete Your Payment via MTN MoMo</h3>
                <div className="payment-details">
                  <div className="payment-amount">
                    <span>Amount to Pay:</span>
                    <strong>GH₵ {paymentData.paymentInstructions.amount}</strong>
                  </div>
                  <div className="recipient-info">
                    <h4>Send Payment To:</h4>
                    <p><strong>Name:</strong> {paymentData.paymentInstructions.payTo.name}</p>
                    <p><strong>Number:</strong> {paymentData.paymentInstructions.payTo.number}</p>
                    <p><strong>Network:</strong> {paymentData.paymentInstructions.payTo.network}</p>
                  </div>
                  <div className="payment-steps">
                    <h4>How to Pay:</h4>
                    <ol>
                      {paymentData.paymentInstructions.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </div>
                
                {/* Payment Confirmation Form */}
                <div className="confirm-payment-section">
                  <h4>After Payment, Enter Your Transaction ID:</h4>
                  <div className="confirm-payment-form">
                    <input
                      type="text"
                      placeholder="Enter MoMo Transaction ID (e.g., MP240210.1234.A12345)"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, transactionId: e.target.value }))}
                      className="form-input"
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={async () => {
                        if (!paymentData.transactionId) {
                          toast.error('Please enter your transaction ID');
                          return;
                        }
                        try {
                          const response = await fetch('/api/payments/confirm', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              requestId: requestId,
                              transactionId: paymentData.transactionId
                            })
                          });
                          const result = await response.json();
                          if (result.success) {
                            toast.success('Payment confirmation submitted! We will verify and begin your project.');
                            setPaymentData(prev => ({ ...prev, confirmed: true }));
                          } else {
                            toast.error(result.message || 'Failed to confirm payment');
                          }
                        } catch (error) {
                          toast.error('Error confirming payment. Please contact support.');
                        }
                      }}
                      disabled={paymentData.confirmed}
                    >
                      {paymentData.confirmed ? '✓ Submitted' : 'Confirm Payment'}
                    </button>
                  </div>
                  <p className="help-text">
                    You'll receive the transaction ID via SMS after completing the MoMo transfer.
                  </p>
                </div>
              </div>
            )}
            
            <div className="next-steps">
              <h3>What happens next?</h3>
              <ol>
                <li>Complete payment using the instructions above</li>
                <li>Enter your transaction ID to confirm payment</li>
                <li>We will verify payment and begin your analysis within 24 hours</li>
                <li>Results will be delivered to your email</li>
              </ol>
            </div>
            <p className="support-note">
              Questions? Contact us at <a href="mailto:info@icbb.org">info@icbb.org</a> or call <a href="tel:+233559759592">+233 55 975 9592</a>
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="service-request-page">
      <div className="container">
        <div className="request-header">
          <h1>Request a Service</h1>
          <p>Fill out the form below to request data analysis services</p>
        </div>
        
        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step) => (
            <div 
              key={step.number}
              className={`progress-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
            >
              <div className="step-icon">
                {currentStep > step.number ? <FiCheck /> : step.icon}
              </div>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>
        
        {/* Form Content */}
        <div className="request-form-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="form-navigation">
              {currentStep > 1 && (
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={prevStep}
                >
                  <FiChevronLeft /> Previous
                </button>
              )}
              {currentStep < 4 ? (
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  Next <FiChevronRight />
                </button>
              ) : (
                <button 
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={submitRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit & Pay'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;
