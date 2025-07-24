// WomenConnect Hub - Seller Registration Component
// Specialized registration for entrepreneurs

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { AFRICAN_COUNTRIES, BUSINESS_CATEGORIES } from '../../utils/constants';

const SellerRegistration = ({ onSuccess, redirectPath = '/seller/dashboard' }) => {
  const { register, loading, error } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Business Information
    businessName: '',
    businessCategory: '',
    businessDescription: '',
    country: '',
    city: '',
    yearsInBusiness: '',
    
    // Additional Details
    fundingGoal: '',
    websiteUrl: '',
    socialMediaUrl: '',
    
    // Agreements
    acceptTerms: false,
    acceptBusinessTerms: false,
    subscribeNewsletter: true
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      // Personal Information Validation
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
      }
      
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!formData.phone.trim()) {
        errors.phone = 'Phone number is required';
      }
      
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (step === 2) {
      // Business Information Validation
      if (!formData.businessName.trim()) {
        errors.businessName = 'Business name is required';
      }
      
      if (!formData.businessCategory) {
        errors.businessCategory = 'Please select a business category';
      }
      
      if (!formData.businessDescription.trim()) {
        errors.businessDescription = 'Business description is required';
      } else if (formData.businessDescription.trim().length < 50) {
        errors.businessDescription = 'Please provide at least 50 characters';
      }
      
      if (!formData.country) {
        errors.country = 'Please select your country';
      }
      
      if (!formData.city.trim()) {
        errors.city = 'City is required';
      }
    }
    
    if (step === 3) {
      // Final validation
      if (!formData.acceptTerms) {
        errors.acceptTerms = 'You must accept the terms and conditions';
      }
      
      if (!formData.acceptBusinessTerms) {
        errors.acceptBusinessTerms = 'You must accept the business terms';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    try {
      const registrationData = {
        ...formData,
        userType: 'seller'
      };
      await register(registrationData);
      if (onSuccess) {
        onSuccess(redirectPath);
      }
    } catch (err) {
      console.error('Seller registration failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="seller-registration-loading">
        <LoadingSpinner message="Creating your entrepreneur account..." />
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Personal Information</h2>
        <p>Tell us about yourself</p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.firstName ? 'error' : ''}`}
            placeholder="Your first name"
            required
          />
          {validationErrors.firstName && (
            <span className="field-error">{validationErrors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.lastName ? 'error' : ''}`}
            placeholder="Your last name"
            required
          />
          {validationErrors.lastName && (
            <span className="field-error">{validationErrors.lastName}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`form-input ${validationErrors.email ? 'error' : ''}`}
          placeholder="Enter your email"
          required
        />
        {validationErrors.email && (
          <span className="field-error">{validationErrors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`form-input ${validationErrors.phone ? 'error' : ''}`}
          placeholder="Your phone number"
          required
        />
        {validationErrors.phone && (
          <span className="field-error">{validationErrors.phone}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.password ? 'error' : ''}`}
            placeholder="Create password"
            required
          />
          {validationErrors.password && (
            <span className="field-error">{validationErrors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
            placeholder="Confirm password"
            required
          />
          {validationErrors.confirmPassword && (
            <span className="field-error">{validationErrors.confirmPassword}</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Business Information</h2>
        <p>Tell us about your business</p>
      </div>

      <div className="form-group">
        <label htmlFor="businessName" className="form-label">
          Business Name *
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          className={`form-input ${validationErrors.businessName ? 'error' : ''}`}
          placeholder="Your business name"
          required
        />
        {validationErrors.businessName && (
          <span className="field-error">{validationErrors.businessName}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="businessCategory" className="form-label">
            Business Category *
          </label>
          <select
            id="businessCategory"
            name="businessCategory"
            value={formData.businessCategory}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.businessCategory ? 'error' : ''}`}
            required
          >
            <option value="">Select category</option>
            {BUSINESS_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {validationErrors.businessCategory && (
            <span className="field-error">{validationErrors.businessCategory}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="yearsInBusiness" className="form-label">
            Years in Business
          </label>
          <select
            id="yearsInBusiness"
            name="yearsInBusiness"
            value={formData.yearsInBusiness}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Select</option>
            <option value="startup">Just starting</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="businessDescription" className="form-label">
          Business Description * (minimum 50 characters)
        </label>
        <textarea
          id="businessDescription"
          name="businessDescription"
          value={formData.businessDescription}
          onChange={handleInputChange}
          className={`form-textarea ${validationErrors.businessDescription ? 'error' : ''}`}
          placeholder="Describe your business, products/services, and what makes it unique..."
          rows="4"
          required
        />
        <div className="character-count">
          {formData.businessDescription.length}/50 minimum
        </div>
        {validationErrors.businessDescription && (
          <span className="field-error">{validationErrors.businessDescription}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="country" className="form-label">
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.country ? 'error' : ''}`}
            required
          >
            <option value="">Select country</option>
            {AFRICAN_COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {validationErrors.country && (
            <span className="field-error">{validationErrors.country}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="city" className="form-label">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.city ? 'error' : ''}`}
            placeholder="Your city"
            required
          />
          {validationErrors.city && (
            <span className="field-error">{validationErrors.city}</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Additional Details</h2>
        <p>Optional information to enhance your profile</p>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fundingGoal" className="form-label">
            Funding Goal (Optional)
          </label>
          <select
            id="fundingGoal"
            name="fundingGoal"
            value={formData.fundingGoal}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="">Select range</option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-5k">$1,000 - $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k+">$50,000+</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="websiteUrl" className="form-label">
            Website URL (Optional)
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleInputChange}
            className="form-input"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="socialMediaUrl" className="form-label">
          Social Media Profile (Optional)
        </label>
        <input
          type="url"
          id="socialMediaUrl"
          name="socialMediaUrl"
          value={formData.socialMediaUrl}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Instagram, Facebook, LinkedIn, etc."
        />
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="checkbox-input"
            required
          />
          <span className="checkbox-custom"></span>
          <span>
            I accept the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a> *
          </span>
        </label>
        {validationErrors.acceptTerms && (
          <span className="field-error">{validationErrors.acceptTerms}</span>
        )}
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="acceptBusinessTerms"
            checked={formData.acceptBusinessTerms}
            onChange={handleInputChange}
            className="checkbox-input"
            required
          />
          <span className="checkbox-custom"></span>
          <span>
            I agree to the <a href="/business-terms" target="_blank">Business Terms</a> and understand that my projects will be reviewed for approval *
          </span>
        </label>
        {validationErrors.acceptBusinessTerms && (
          <span className="field-error">{validationErrors.acceptBusinessTerms}</span>
        )}
      </div>

      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleInputChange}
            className="checkbox-input"
          />
          <span className="checkbox-custom"></span>
          <span>
            Subscribe to entrepreneur tips and platform updates
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="seller-registration-container">
      <div className="registration-header">
        <h1>Join as an Entrepreneur</h1>
        <p>Share your business with global investors</p>
      </div>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {currentStep > step ? '✓' : step}
              </div>
              <div className="step-label">
                {step === 1 && 'Personal'}
                {step === 2 && 'Business'}
                {step === 3 && 'Complete'}
              </div>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="registration-form" noValidate>
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="form-actions">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              disabled={loading}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
            >
              Create Entrepreneur Account
            </Button>
          )}
        </div>
      </form>

      <div className="login-prompt">
        <span>Already have an account? </span>
        <a href="/auth/login" className="login-link">
          Sign in here
        </a>
      </div>

      <style jsx>{`
        .seller-registration-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .registration-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .registration-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .registration-header p {
          color: #6b7280;
          margin: 0;
          font-size: 1.125rem;
        }

        /* Progress Indicator */
        .progress-indicator {
          margin-bottom: 2rem;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e7eb;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-circle {
          background: #2563eb;
          color: white;
        }

        .progress-step.completed .step-circle {
          background: #059669;
          color: white;
        }

        .step-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .progress-step.active .step-label {
          color: #2563eb;
        }

        .progress-bar {
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #2563eb;
          transition: width 0.3s ease;
        }

        /* Form Styles */
        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-header {
          text-align: center;
          margin-bottom: 1rem;
        }

        .step-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.5rem 0;
        }

        .step-header p {
          color: #6b7280;
          margin: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-input,
        .form-textarea {
          padding: 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          background: #ffffff;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-input.error,
        .form-textarea.error {
          border-color: #dc2626;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .character-count {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .field-error {
          color: #dc2626;
          font-size: 0.875rem;
        }

        .error-message {
          padding: 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Checkbox Styles */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.5;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: #2563eb;
          border-color: #2563eb;
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '✓';
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        .checkbox-label a {
          color: #2563eb;
          text-decoration: none;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .login-prompt {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 1.5rem;
        }

        .login-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .login-link:hover {
          text-decoration: underline;
        }

        .seller-registration-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .seller-registration-container {
            margin: 1rem;
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .progress-steps {
            gap: 0.5rem;
          }

          .step-circle {
            width: 35px;
            height: 35px;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-input,
          .form-textarea {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .seller-registration-container {
            background: #1f2937;
            color: #f3f4f6;
          }

          .registration-header h1,
          .step-header h2 {
            color: #f3f4f6;
          }

          .form-label {
            color: #e5e7eb;
          }

          .form-input,
          .form-textarea {
            background: #374151;
            border-color: #6b7280;
            color: #f3f4f6;
          }

          .error-message {
            background: #7f1d1d;
            border-color: #dc2626;
            color: #fecaca;
          }
        }
      `}</style>
    </div>
  );
};

export default SellerRegistration;
