// WomenConnect Hub - Contact Seller Component
// Direct contact component for reaching out to project owners

import React, { useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { validateAndConvertGoogleDriveLink } from '../../utils/linkUtils';
import { formatCurrency } from '../../utils/helpers';

const ContactSeller = ({ 
  project, 
  isOpen = false, 
  onClose, 
  currentUser = null 
}) => {
  const [contactMethod, setContactMethod] = useState('message');
  const [message, setMessage] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [senderInfo, setSenderInfo] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    company: currentUser?.company || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  if (!project) return null;

  const {
    sellerName,
    sellerEmail,
    sellerPhone,
    sellerWhatsApp,
    businessName,
    title,
    category,
    location,
    fundingGoal,
    fundingRaised = 0,
    images = []
  } = project;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would send the contact information
      console.log('Contact submission:', {
        project: project.id,
        contactMethod,
        message,
        investmentAmount,
        senderInfo
      });

      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        onClose();
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setContactMethod('message');
    setMessage('');
    setInvestmentAmount('');
    if (!currentUser) {
      setSenderInfo({
        name: '',
        email: '',
        phone: '',
        company: ''
      });
    }
  };

  const handleDirectContact = (method) => {
    let contactUrl = '';
    
    switch (method) {
      case 'email':
        const subject = encodeURIComponent(`Interest in ${title}`);
        const body = encodeURIComponent(
          `Hello ${sellerName},\n\nI'm interested in your project "${title}" on WomenConnect Hub.\n\nBest regards,\n${senderInfo.name || 'Your name'}`
        );
        contactUrl = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;
        break;
        
      case 'phone':
        contactUrl = `tel:${sellerPhone}`;
        break;
        
      case 'whatsapp':
        const whatsappMessage = encodeURIComponent(
          `Hello ${sellerName}, I'm interested in your project "${title}" on WomenConnect Hub.`
        );
        contactUrl = `https://wa.me/${sellerWhatsApp.replace(/[^\d]/g, '')}?text=${whatsappMessage}`;
        break;
        
      default:
        return;
    }
    
    window.open(contactUrl, '_blank');
  };

  const renderContactOptions = () => (
    <div className="contact-options">
      <h4>Choose Contact Method</h4>
      
      <div className="contact-methods">
        {sellerEmail && (
          <button
            type="button"
            className="contact-method-btn"
            onClick={() => handleDirectContact('email')}
          >
            <span className="contact-icon">📧</span>
            <div>
              <strong>Email</strong>
              <p>{sellerEmail}</p>
            </div>
          </button>
        )}
        
        {sellerPhone && (
          <button
            type="button"
            className="contact-method-btn"
            onClick={() => handleDirectContact('phone')}
          >
            <span className="contact-icon">📞</span>
            <div>
              <strong>Phone</strong>
              <p>{sellerPhone}</p>
            </div>
          </button>
        )}
        
        {sellerWhatsApp && (
          <button
            type="button"
            className="contact-method-btn whatsapp"
            onClick={() => handleDirectContact('whatsapp')}
          >
            <span className="contact-icon">💬</span>
            <div>
              <strong>WhatsApp</strong>
              <p>{sellerWhatsApp}</p>
            </div>
          </button>
        )}
      </div>
      
      <div className="divider">
        <span>OR</span>
      </div>
      
      <p className="form-description">
        Send a message through our platform:
      </p>
    </div>
  );

  const renderContactForm = () => (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label>Contact Type</label>
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              value="inquiry"
              checked={contactMethod === 'inquiry'}
              onChange={(e) => setContactMethod(e.target.value)}
            />
            General Inquiry
          </label>
          <label className="radio-option">
            <input
              type="radio"
              value="investment"
              checked={contactMethod === 'investment'}
              onChange={(e) => setContactMethod(e.target.value)}
            />
            Investment Interest
          </label>
          <label className="radio-option">
            <input
              type="radio"
              value="partnership"
              checked={contactMethod === 'partnership'}
              onChange={(e) => setContactMethod(e.target.value)}
            />
            Partnership Opportunity
          </label>
        </div>
      </div>

      {contactMethod === 'investment' && (
        <div className="form-group">
          <label htmlFor="investment-amount">
            Investment Amount (Optional)
          </label>
          <input
            type="text"
            id="investment-amount"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            placeholder="e.g., $5,000"
            className="form-input"
          />
          <small className="help-text">
            Specify your potential investment amount
          </small>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message" className="required">
          Your Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hello ${sellerName}, I'm interested in your project "${title}". I would like to know more about...`}
          className="form-textarea"
          rows="4"
          required
        />
        <div className="character-count">
          {message.length}/500
        </div>
      </div>

      {!currentUser && (
        <>
          <h5>Your Contact Information</h5>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sender-name" className="required">
                Full Name
              </label>
              <input
                type="text"
                id="sender-name"
                value={senderInfo.name}
                onChange={(e) => setSenderInfo({...senderInfo, name: e.target.value})}
                placeholder="Your full name"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sender-email" className="required">
                Email Address
              </label>
              <input
                type="email"
                id="sender-email"
                value={senderInfo.email}
                onChange={(e) => setSenderInfo({...senderInfo, email: e.target.value})}
                placeholder="your.email@example.com"
                className="form-input"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sender-phone">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="sender-phone"
                value={senderInfo.phone}
                onChange={(e) => setSenderInfo({...senderInfo, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sender-company">
                Company/Organization (Optional)
              </label>
              <input
                type="text"
                id="sender-company"
                value={senderInfo.company}
                onChange={(e) => setSenderInfo({...senderInfo, company: e.target.value})}
                placeholder="Your company name"
                className="form-input"
              />
            </div>
          </div>
        </>
      )}

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!message.trim() || message.length > 500}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );

  const renderProjectSummary = () => (
    <div className="project-summary">
      <div className="project-info">
        {images[0] && (
          <img
            src={validateAndConvertGoogleDriveLink(images[0])}
            alt={title}
            className="project-thumbnail"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        )}
        <div className="project-thumbnail-placeholder" style={{ display: images[0] ? 'none' : 'flex' }}>
          🏢
        </div>
        
        <div className="project-details">
          <h3>{title}</h3>
          <p className="business-name">{businessName}</p>
          <p className="project-meta">
            <span>{category}</span> • <span>{location}</span>
          </p>
          <div className="funding-info">
            <strong>{formatCurrency(fundingRaised)}</strong> raised of {formatCurrency(fundingGoal)}
          </div>
        </div>
      </div>
    </div>
  );

  const renderThankYouMessage = () => (
    <div className="thank-you-message">
      <div className="success-icon">✅</div>
      <h3>Message Sent Successfully!</h3>
      <p>
        Your message has been sent to <strong>{sellerName}</strong>. 
        They will receive your contact information and can reach out to you directly.
      </p>
      <p className="note">
        You can also contact them directly using the methods provided above.
      </p>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={showThankYou ? "Message Sent!" : `Contact ${sellerName}`}
      size="large"
      className="contact-seller-modal"
    >
      {showThankYou ? (
        renderThankYouMessage()
      ) : (
        <div className="contact-seller-content">
          {renderProjectSummary()}
          {renderContactOptions()}
          {renderContactForm()}
        </div>
      )}

      <style jsx>{`
        .contact-seller-content {
          max-width: 100%;
        }

        .project-summary {
          background: #f9fafb;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .project-info {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .project-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .project-thumbnail-placeholder {
          width: 80px;
          height: 80px;
          background: #e5e7eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
        }

        .project-details h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.125rem;
          color: #1f2937;
        }

        .business-name {
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.25rem 0;
        }

        .project-meta {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 0.5rem 0;
        }

        .funding-info {
          font-size: 0.875rem;
          color: #059669;
        }

        .contact-options {
          margin-bottom: 1.5rem;
        }

        .contact-options h4 {
          margin: 0 0 1rem 0;
          color: #1f2937;
        }

        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .contact-method-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #ffffff;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .contact-method-btn:hover {
          border-color: #2563eb;
          background: #f0f9ff;
        }

        .contact-method-btn.whatsapp:hover {
          border-color: #25d366;
          background: #f0fdf4;
        }

        .contact-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .contact-method-btn div {
          flex: 1;
        }

        .contact-method-btn strong {
          display: block;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .contact-method-btn p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }

        .divider:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }

        .divider span {
          background: #ffffff;
          padding: 0 1rem;
          color: #9ca3af;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .form-description {
          color: #6b7280;
          margin: 0 0 1rem 0;
          font-size: 0.875rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-group label.required:after {
          content: '*';
          color: #dc2626;
          margin-left: 0.25rem;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: normal;
          cursor: pointer;
        }

        .radio-option input[type="radio"] {
          margin: 0;
        }

        .form-input,
        .form-textarea {
          padding: 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .character-count {
          font-size: 0.75rem;
          color: #9ca3af;
          text-align: right;
        }

        .help-text {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .thank-you-message {
          text-align: center;
          padding: 2rem 1rem;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .thank-you-message h3 {
          margin: 0 0 1rem 0;
          color: #059669;
        }

        .thank-you-message p {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .thank-you-message .note {
          font-size: 0.875rem;
          font-style: italic;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .contact-methods {
            gap: 0.5rem;
          }

          .contact-method-btn {
            padding: 0.75rem;
          }

          .contact-icon {
            font-size: 1.25rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .project-info {
            flex-direction: column;
            text-align: center;
          }

          .project-thumbnail,
          .project-thumbnail-placeholder {
            align-self: center;
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .project-summary {
            background: #374151;
          }

          .project-details h3,
          .business-name,
          .contact-options h4,
          .form-group label {
            color: #f3f4f6;
          }

          .project-meta {
            color: #d1d5db;
          }

          .contact-method-btn {
            background: #374151;
            border-color: #4b5563;
          }

          .contact-method-btn:hover {
            background: #4b5563;
          }

          .contact-method-btn strong {
            color: #f3f4f6;
          }

          .contact-method-btn p {
            color: #d1d5db;
          }

          .form-input,
          .form-textarea {
            background: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
          }

          .divider span {
            background: #1f2937;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .contact-method-btn {
            border-width: 3px;
          }

          .form-input,
          .form-textarea {
            border-width: 3px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default ContactSeller;