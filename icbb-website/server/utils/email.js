const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // In production, use actual SMTP credentials
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // For development, use ethereal email or console logging
  return null;
};

// Send email function
exports.sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    // In development, just log the email
    console.log('📧 Email would be sent:');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log('   (Email sending disabled in development mode)');
    return { success: true, development: true };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'ICBB <noreply@icbb.org>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Email templates
exports.templates = {
  // Service request confirmation
  serviceRequestConfirmation: (data) => ({
    subject: `Service Request Received - ${data.requestId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0066cc, #00a86b); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .btn { display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ICBB</h1>
            <p style="color: white; margin: 5px 0 0;">Institute of Computational Biology & Bioinformatics</p>
          </div>
          <div class="content">
            <h2>Thank You for Your Request!</h2>
            <p>Dear ${data.clientName},</p>
            <p>We have received your service request and it is being processed.</p>
            <div class="info-box">
              <p><strong>Request ID:</strong> ${data.requestId}</p>
              <p><strong>Service:</strong> ${data.serviceName}</p>
              <p><strong>Amount:</strong> GHS ${data.amount}</p>
              <p><strong>Status:</strong> ${data.status}</p>
            </div>
            <p>Please complete your payment to proceed with the analysis.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ICBB. All rights reserved.</p>
            <p>Ghana, West Africa | info@icbb.org</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Payment confirmation
  paymentConfirmation: (data) => ({
    subject: `Payment Confirmed - ${data.requestId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0066cc, #00a86b); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .success-box { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ICBB</h1>
          </div>
          <div class="content">
            <h2>Payment Confirmed! ✓</h2>
            <p>Dear ${data.clientName},</p>
            <div class="success-box">
              <p><strong>Your payment has been confirmed!</strong></p>
              <p>Request ID: ${data.requestId}</p>
              <p>Amount: GHS ${data.amount}</p>
              <p>Transaction ID: ${data.transactionId}</p>
            </div>
            <p>Our team will begin working on your request immediately. You will receive an email notification when your results are ready.</p>
            <p>Thank you for choosing ICBB!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ICBB. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};
