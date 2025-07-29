import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

const AuthModal = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('entrepreneur');
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    
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
    companyWebsite: '',
    
    // Admin fields
    secretKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const ADMIN_SECRET_KEY = "12345@#@@@@@@@@!!!!wwwgggh.";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!isLogin) {
      if (userType === 'entrepreneur') {
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (formData.gender !== 'female') newErrors.gender = 'Only female entrepreneurs can register';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.profileImage) newErrors.profileImage = 'Profile image (Google Drive link) is required';
        if (!formData.businessCertificate) newErrors.businessCertificate = 'Business certificate is required';
      } else if (userType === 'investor') {
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.companyName) newErrors.companyName = 'Company name is required';
        if (!formData.contactInfo) newErrors.contactInfo = 'Contact information is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.profileImage) newErrors.profileImage = 'Profile image (Google Drive link) is required';
      } else if (userType === 'admin') {
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (formData.secretKey !== ADMIN_SECRET_KEY) {
          newErrors.secretKey = 'You are not allowed to register as admin - Invalid secret key';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const registrationData = {
          ...formData,
          userType,
          name: `${formData.firstName} ${formData.lastName}`.trim()
        };
        await register(registrationData);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: error.message || 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      gender: 'female',
      country: '',
      city: '',
      profileImage: '',
      businessCertificate: '',
      companyName: '',
      contactInfo: '',
      companyWebsite: '',
      secretKey: ''
    });
    setErrors({});
  };

  const handleUserTypeChange = (newUserType) => {
    setUserType(newUserType);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* User Type Selection (only for registration) */}
        {!isLogin && (
          <div className="bg-gray-100 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Register as:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleUserTypeChange('entrepreneur')}
                className={`p-3 text-center rounded-lg border-2 transition-colors ${
                  userType === 'entrepreneur' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-xl mb-1">👩‍💼</div>
                <div className="text-xs font-medium">Entrepreneur</div>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('investor')}
                className={`p-3 text-center rounded-lg border-2 transition-colors ${
                  userType === 'investor' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-xl mb-1">💰</div>
                <div className="text-xs font-medium">Investor</div>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('admin')}
                className={`p-3 text-center rounded-lg border-2 transition-colors ${
                  userType === 'admin' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-xl mb-1">⚙️</div>
                <div className="text-xs font-medium">Admin</div>
              </button>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* First Name and Last Name (for registration) */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>
            )}

            {/* Gender (for entrepreneurs - must be female, for investors - both) */}
            {!isLogin && userType !== 'admin' && (
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender * {userType === 'entrepreneur' && '(Must be Female)'}
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.gender ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="female">Female</option>
                  {userType === 'investor' && <option value="male">Male</option>}
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password (for registration) */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Profile Image (for entrepreneurs and investors) */}
            {!isLogin && userType !== 'admin' && (
              <div>
                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                  Profile Image (Google Drive Link) *
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="url"
                  required
                  value={formData.profileImage}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.profileImage ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="https://drive.google.com/file/d/..."
                />
                {errors.profileImage && <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>}
              </div>
            )}

            {/* Country and City */}
            {!isLogin && userType !== 'admin' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.country ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Country"
                  />
                  {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
                
              </div>
            )}

            {/* Entrepreneur-specific fields */}
            {!isLogin && userType === 'entrepreneur' && (
              <div>
                <label htmlFor="businessCertificate" className="block text-sm font-medium text-gray-700">
                  Business Certificate (Upload/Link) *
                </label>
                <input
                  id="businessCertificate"
                  name="businessCertificate"
                  type="text"
                  required
                  value={formData.businessCertificate}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.businessCertificate ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Business certificate link or file"
                />
                {errors.businessCertificate && <p className="mt-1 text-sm text-red-600">{errors.businessCertificate}</p>}
              </div>
            )}

            {/* Investor-specific fields */}
            {!isLogin && userType === 'investor' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.companyName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Your company name"
                  />
                  {errors.companyName && <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>}
                </div>

                <div>
                  <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">
                    Contact Information (Phone or Email) *
                  </label>
                  <input
                    id="contactInfo"
                    name="contactInfo"
                    type="text"
                    required
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactInfo ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Phone number or email"
                  />
                  {errors.contactInfo && <p className="mt-1 text-sm text-red-600">{errors.contactInfo}</p>}
                </div>

                <div>
                  <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700">
                    Company Website (Optional)
                  </label>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.yourcompany.com"
                  />
                </div>
              </>
            )}

            {/* Admin secret key */}
            {!isLogin && userType === 'admin' && (
              <div>
                <label htmlFor="secretKey" className="block text-sm font-medium text-gray-700">
                  Admin Secret Key *
                </label>
                <input
                  id="secretKey"
                  name="secretKey"
                  type="password"
                  required
                  value={formData.secretKey}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.secretKey ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter admin secret key"
                />
                {errors.secretKey && <p className="mt-1 text-sm text-red-600">{errors.secretKey}</p>}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                isLogin ? 'Sign In' : `Create ${userType.charAt(0).toUpperCase() + userType.slice(1)} Account`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;