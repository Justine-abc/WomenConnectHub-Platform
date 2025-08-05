import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { COUNTRIES, USER_TYPES } from '../../utils/constants';
import { validateGoogleDriveUrl } from '../../utils/urlHelpers';

const ProfileForm = ({ onSave, onCancel }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    city: '',
    profileImage: '',
    
    // Entrepreneur specific
    businessName: '',
    businessDescription: '',
    businessCategory: '',
    businessCertificate: '',
    website: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: ''
    },
    
    // Investor specific
    companyName: '',
    investmentCapacity: '',
    preferredSectors: [],
    riskTolerance: '',
    contactInfo: '',
    
    // Admin specific
    department: '',
    role: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (user) {
      // Populate form with existing user data
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        country: user.profile?.country || '',
        city: user.profile?.city || '',
        profileImage: user.profile?.profileImage || '',
        businessName: user.profile?.businessName || '',
        businessDescription: user.profile?.businessDescription || '',
        businessCategory: user.profile?.businessCategory || '',
        businessCertificate: user.profile?.businessCertificate || '',
        website: user.profile?.website || '',
        socialMedia: {
          linkedin: user.profile?.socialMedia?.linkedin || '',
          twitter: user.profile?.socialMedia?.twitter || '',
          instagram: user.profile?.socialMedia?.instagram || '',
          facebook: user.profile?.socialMedia?.facebook || ''
        },
        companyName: user.profile?.companyName || '',
        investmentCapacity: user.profile?.investmentCapacity || '',
        preferredSectors: user.profile?.preferredSectors || [],
        riskTolerance: user.profile?.riskTolerance || '',
        contactInfo: user.profile?.contactInfo || '',
        department: user.profile?.department || '',
        role: user.profile?.role || ''
      });
      
      if (user.profile?.profileImage) {
        setImagePreview(user.profile.profileImage);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (like socialMedia)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      // Handle checkbox arrays (like preferredSectors)
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...(prev[name] || []), value]
          : (prev[name] || []).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Update image preview when profile image URL changes
    if (name === 'profileImage') {
      setImagePreview(value);
    }
    
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Common validation
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
    
    if (!formData.country) {
      errors.country = 'Country is required';
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    // Validate Google Drive URLs
    if (formData.profileImage && !validateGoogleDriveUrl(formData.profileImage)) {
      errors.profileImage = 'Please enter a valid Google Drive link';
    }
    
    if (formData.businessCertificate && !validateGoogleDriveUrl(formData.businessCertificate)) {
      errors.businessCertificate = 'Please enter a valid Google Drive link';
    }
    
    // User type specific validation
    if (user?.type === USER_TYPES.ENTREPRENEUR) {
      if (!formData.businessName.trim()) {
        errors.businessName = 'Business name is required';
      }
      
      if (!formData.businessCategory) {
        errors.businessCategory = 'Business category is required';
      }
      
      if (formData.businessDescription && formData.businessDescription.length < 20) {
        errors.businessDescription = 'Business description must be at least 20 characters';
      }
    }
    
    if (user?.type === USER_TYPES.INVESTOR) {
      if (!formData.companyName.trim()) {
        errors.companyName = 'Company name is required';
      }
      
      if (!formData.contactInfo.trim()) {
        errors.contactInfo = 'Contact information is required';
      }
      
      if (!formData.investmentCapacity) {
        errors.investmentCapacity = 'Investment capacity is required';
      }
    }
    
    if (user?.type === USER_TYPES.ADMIN) {
      if (!formData.department.trim()) {
        errors.department = 'Department is required';
      }
      
      if (!formData.role.trim()) {
        errors.role = 'Role is required';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await updateProfile(formData);
      if (onSave) {
        onSave(formData);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      setValidationErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const businessCategories = [
    'Technology & Innovation',
    'Fashion & Textiles',
    'Beauty & Cosmetics',
    'Food & Beverage',
    'Agriculture & Farming',
    'Arts & Crafts',
    'Healthcare & Wellness',
    'Education & Training',
    'Finance & Banking',
    'Retail & E-commerce',
    'Manufacturing',
    'Services',
    'Other'
  ];

  const investmentSectors = [
    'Technology',
    'Healthcare',
    'Education',
    'Agriculture',
    'Fashion',
    'Beauty',
    'Food & Beverage',
    'Manufacturing',
    'Services',
    'Arts & Crafts'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        <p className="text-gray-600 mt-1">Update your profile information</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {validationErrors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {validationErrors.submit}
          </div>
        )}

        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image (Google Drive Link)
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleInputChange}
                placeholder="https://drive.google.com/file/d/..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                  validationErrors.profileImage ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.profileImage && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.profileImage}</p>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="w-20 h-20 object-cover rounded-full border border-gray-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  validationErrors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Country</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {validationErrors.country && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                  validationErrors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.city && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
              )}
            </div>
          </div>
        </div>

        {/* Entrepreneur Specific Fields */}
        {user?.type === USER_TYPES.ENTREPRENEUR && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.businessName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.businessName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.businessName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Category *
                </label>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.businessCategory ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {businessCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {validationErrors.businessCategory && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.businessCategory}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe your business, mission, and goals..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.businessDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.businessDescription && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.businessDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourbusiness.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Certificate (Google Drive Link)
                </label>
                <input
                  type="url"
                  name="businessCertificate"
                  value={formData.businessCertificate}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/file/d/..."
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.businessCertificate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.businessCertificate && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.businessCertificate}</p>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Social Media (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    name="socialMedia.linkedin"
                    value={formData.socialMedia.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    name="socialMedia.twitter"
                    value={formData.socialMedia.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/yourusername"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/yourusername"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investor Specific Fields */}
        {user?.type === USER_TYPES.INVESTOR && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Capacity *
                </label>
                <select
                  name="investmentCapacity"
                  value={formData.investmentCapacity}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.investmentCapacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Range</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000-25000">$10,000 - $25,000</option>
                  <option value="25000-50000">$25,000 - $50,000</option>
                  <option value="50000+">$50,000+</option>
                </select>
                {validationErrors.investmentCapacity && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.investmentCapacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Tolerance
                </label>
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select Risk Level</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information *
                </label>
                <input
                  type="text"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  placeholder="Phone number or preferred contact method"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.contactInfo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.contactInfo && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.contactInfo}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Investment Sectors
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {investmentSectors.map(sector => (
                    <label key={sector} className="flex items-center">
                      <input
                        type="checkbox"
                        name="preferredSectors"
                        value={sector}
                        checked={formData.preferredSectors.includes(sector)}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm">{sector}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Specific Fields */}
        {user?.type === USER_TYPES.ADMIN && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Administrative Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  <option value="operations">Operations</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="technology">Technology</option>
                  <option value="legal">Legal & Compliance</option>
                  <option value="customer-support">Customer Support</option>
                </select>
                {validationErrors.department && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Platform Administrator, Finance Manager"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                    validationErrors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.role && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Changes
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;