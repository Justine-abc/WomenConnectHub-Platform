import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { USER_TYPES, COUNTRIES } from '../../utils/constants';
import { validateGoogleDriveUrl } from '../../utils/urlHelpers';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, loading, error } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    userType: USER_TYPES.ENTREPRENEUR,
    
    // Entrepreneur fields
    firstName: '',
    lastName: '',
    gender: 'female',
    country: '',
    city: '',
    profileImage: '',
    businessCertificate: '',
    
    // Investor fields
    companyName: '',
    contactInfo: '',
    website: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Common validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'register') {
      if (formData.userType === USER_TYPES.ENTREPRENEUR) {
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (formData.gender !== 'female') errors.gender = 'Only female entrepreneurs can register';
        if (!formData.country) errors.country = 'Country is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        
        if (formData.profileImage && !validateGoogleDriveUrl(formData.profileImage)) {
          errors.profileImage = 'Please enter a valid Google Drive link';
        }
      } else if (formData.userType === USER_TYPES.INVESTOR) {
        if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
        if (!formData.contactInfo.trim()) errors.contactInfo = 'Contact information is required';
        if (!formData.country) errors.country = 'Country is required';
        if (!formData.city.trim()) errors.city = 'City is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (mode === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      onClose();
    } catch (err) {
      console.error('Auth failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Join WomenConnect Hub'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Register as
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleInputChange}
                    className="input-field w-full"
                  >
                    <option value={USER_TYPES.ENTREPRENEUR}>Women Entrepreneur</option>
                    <option value={USER_TYPES.INVESTOR}>Investor/Sponsor</option>
                  </select>
                </div>

                {formData.userType === USER_TYPES.ENTREPRENEUR ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`input-field w-full ${validationErrors.firstName ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`input-field w-full ${validationErrors.lastName ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`input-field w-full ${validationErrors.gender ? 'border-red-500' : ''}`}
                      >
                        <option value="female">Female</option>
                      </select>
                      {validationErrors.gender && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.gender}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Image (Google Drive Link)
                      </label>
                      <input
                        type="url"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/file/d/..."
                        className={`input-field w-full ${validationErrors.profileImage ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.profileImage && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.profileImage}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Certificate (Google Drive Link)
                      </label>
                      <input
                        type="url"
                        name="businessCertificate"
                        value={formData.businessCertificate}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/file/d/..."
                        className="input-field w-full"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className={`input-field w-full ${validationErrors.companyName ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.companyName && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.companyName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Information *
                      </label>
                      <input
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleInputChange}
                        placeholder="Phone or Email"
                        className={`input-field w-full ${validationErrors.contactInfo ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.contactInfo && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.contactInfo}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Image (Google Drive Link)
                      </label>
                      <input
                        type="url"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleInputChange}
                        placeholder="https://drive.google.com/file/d/..."
                        className="input-field w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Website (Optional)
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourcompany.com"
                        className="input-field w-full"
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`input-field w-full ${validationErrors.country ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {validationErrors.country && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.country}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`input-field w-full ${validationErrors.city ? 'border-red-500' : ''}`}
                    />
                    {validationErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field w-full ${validationErrors.email ? 'border-red-500' : ''}`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input-field w-full ${validationErrors.password ? 'border-red-500' : ''}`}
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {mode === 'login' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;