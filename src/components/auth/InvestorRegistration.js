// WomenConnect Hub - Investor Registration Component
// Specialized registration for investors and sponsors

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { AFRICAN_COUNTRIES, BUSINESS_CATEGORIES } from '../../utils/constants';

const InvestorRegistration = ({ onSuccess, redirectPath = '/investor/dashboard' }) => {
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
    
    // Investor Information
    investorType: 'individual', // individual, organization, fund
    organizationName: '',
    country: '',
    city: '',
    
    // Investment Preferences
    investmentRange: '',
    preferredCategories: [],
    preferredCountries: [],
    investmentExperience: '',
    
    // Additional Information
    linkedinUrl: '',
    websiteUrl: '',
    investmentGoals: '',
    
    // Agreements
    acceptTerms: false,
    acceptInvestorTerms: false,
    subscribeNewsletter: true
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'preferredCategories' || name === 'preferredCountries') {
      // Handle multi-select
      setFormData(prev => {
        const currentArray = prev[name] || [];
        if (checked) {
          return {
            ...prev,
            [name]: [...currentArray, value]
          };
        } else {
          return {
            ...prev,
            [name]: currentArray.filter(item => item !== value)
          };
        }
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
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
      // Investor Information Validation
      if (formData.investorType === 'organization' && !formData.organizationName.trim()) {
        errors.organizationName = 'Organization name is required';
      }
      
      if (!formData.country) {
        errors.country = 'Please select your country';
      }
      
      if (!formData.investmentRange) {
        errors.investmentRange = 'Please select your investment range';
      }
    }
    
    if (step === 3) {
      // Final validation
      if (!formData.acceptTerms) {
        errors.acceptTerms = 'You must accept the terms and conditions';
      }
      
      if (!formData.acceptInvestorTerms) {
        errors.acceptInvestorTerms = 'You must accept the investor terms';
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
        userType: 'investor'
      };
      await register(registrationData);
      if (onSuccess) {
        onSuccess(redirectPath);
      }
    } catch (err) {
      console.error('Investor registration failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="investor-registration-loading">
        <LoadingSpinner message="Creating your investor account..." />
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
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Your phone number"
        />
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
        <h2>Investor Information</h2>
        <p>Help us understand your investment profile</p>
      </div>

      <div className="form-group">
        <fieldset className="investor-type-fieldset">
          <legend className="form-label">I am investing as *</legend>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="investorType"
                value="individual"
                checked={formData.investorType === 'individual'}
                onChange={handleInputChange}
                className="radio-input"
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Individual Investor</strong>
                <span>Personal investment</span>
              </div>
            </label>
            
            <label className="radio-label">
              <input
                type="radio"
                name="investorType"
                value="organization"
                checked={formData.investorType === 'organization'}
                onChange={handleInputChange}
                className="radio-input"
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Organization/Company</strong>
                <span>Corporate investment or CSR</span>
              </div>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="investorType"
                value="fund"
                checked={formData.investorType === 'fund'}
                onChange={handleInputChange}
                className="radio-input"
              />
              <span className="radio-custom"></span>
              <div className="radio-content">
                <strong>Investment Fund</strong>
                <span>Venture capital, angel fund, etc.</span>
              </div>
            </label>
          </div>
        </fieldset>
      </div>

      {formData.investorType === 'organization' && (
        <div className="form-group">
          <label htmlFor="organizationName" className="form-label">
            Organization Name *
          </label>
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            value={formData.organizationName}
            onChange={handleInputChange}
            className={`form-input ${validationErrors.organizationName ? 'error' : ''}`}
            placeholder="Company or organization name"
            required
          />
          {validationErrors.organizationName && (
            <span className="field-error">{validationErrors.organizationName}</span>
          )}
        </div>
      )}

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
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="AU">Australia</option>
            <option value="JP">Japan</option>
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
            City (Optional)
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Your city"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="investmentRange" className="form-label">
          Typical Investment Range *
        </label>
        <select
          id="investmentRange"
          name="investmentRange"
          value={formData.investmentRange}
          onChange={handleInputChange}
          className={`form-input ${validationErrors.investmentRange ? 'error' : ''}`}
          required
        >
          <option value="">Select range</option>
          <option value="under-500">Under $500</option>
          <option value="500-1k">$500 - $1,000</option>
          <option value="1k-5k">$1,000 - $5,000</option>
          <option value="5k-10k">$5,000 - $10,000</option>
          <option value="10k-25k">$10,000 - $25,000</option>
          <option value="25k-50k">$25,000 - $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="100k+">$100,000+</option>
        </select>
        {validationErrors.investmentRange && (
          <span className="field-error">{validationErrors.investmentRange}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="investmentExperience" className="form-label">
          Investment Experience
        </label>
        <select
          id="investmentExperience"
          name="investmentExperience"
          value={formData.investmentExperience}
          onChange={handleInputChange}
          className="form-input"
        >
          <option value="">Select experience level</option>
          <option value="first-time">First-time investor</option>
          <option value="some">Some experience (1-3 investments)</option>
          <option value="experienced">Experienced (4-10 investments)</option>
          <option value="veteran">Veteran investor (10+ investments)</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>Investment Preferences</h2>
        <p>Help us match you with relevant opportunities</p>
      </div>

      <div className="form-group">
        <label className="form-label">
          Preferred Business Categories (Select all that apply)
        </label>
        <div className="checkbox-grid">
          {BUSINESS_CATEGORIES.map(category => (
            <label key={category.value} className="checkbox-label">
              <input
                type="checkbox"
                name="preferredCategories"
                value={category.value}
                checked={formData.preferredCategories.includes(category.value)}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span>{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Preferred Countries/Regions (Select all that apply)
        </label>
        <div className="checkbox-grid">
          {AFRICAN_COUNTRIES.slice(0, 10).map(country => (
            <label key={country.code} className="checkbox-label">
              <input
                type="checkbox"
                name="preferredCountries"
                value={country.code}
                checked={formData.preferredCountries.includes(country.code)}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span>{country.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="linkedinUrl" className="form-label">
            LinkedIn Profile (Optional)
          </label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleInputChange}
            className="form-input"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="form-group">
          <label htmlFor="websiteUrl" className="form-label">
            Website/Company URL (Optional)
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
        <label htmlFor="investmentGoals" className="form-label">
          Investment Goals (Optional)
        </label>
        <textarea
          id="investmentGoals"
          name="investmentGoals"
          value={formData.investmentGoals}
          onChange={handleInputChange}
          className="form-textarea"
          placeholder="What are you hoping to achieve through your investments? (e.g., social impact, financial returns, supporting women entrepreneurs)"
          rows="3"
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
            name="acceptInvestorTerms"
            checked={formData.acceptInvestorTerms}
            onChange={handleInputChange}
            className="checkbox-input"
            required
          />
          <span className="checkbox-custom"></span>
          <span>
            I understand the <a href="/investor-terms" target="_blank">Investment Terms</a> and acknowledge the risks involved in startup investments *
          </span>
        </label>
        {validationErrors.acceptInvestorTerms && (
          <span className="field-error">{validationErrors.acceptInvestorTerms}</span>
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
            Subscribe to investment opportunities and success stories
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="investor-registration-container">
      <div className="registration-header">
        <h1>Join as an Investor</h1>
        <p>Discover and support amazing African women entrepreneurs</p>
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
                {step === 2 && 'Investor Info'}
                {step === 3 && 'Preferences'}
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
              Create Investor Account
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
        .investor-registration-container {
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
          min-height: 80px;
          font-family: inherit;
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

        /* Radio button styles */
        .investor-type-fieldset {
          border: none;
          padding: 0;
          margin: 0;
        }

        .investor-type-fieldset legend {
          margin-bottom: 1rem;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .radio-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .radio-label:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .radio-input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
        }

        .radio-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .radio-input:checked + .radio-custom {
          border-color: #2563eb;
          background: #2563eb;
        }

        .radio-input:checked + .radio-custom::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
        }

        .radio-label:has(.radio-input:checked) {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .radio-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .radio-content strong {
          font-weight: 600;
          color: #374151;
        }

        .radio-content span {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Checkbox Styles */
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-top: 0.5rem;
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

        .investor-registration-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .investor-registration-container {
            margin: 1rem;
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .checkbox-grid {
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
          .investor-registration-container {
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

          .radio-label {
            border-color: #4b5563;
            background: #374151;
          }

          .radio-label:hover {
            background: #4b5563;
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

export default InvestorRegistration;
