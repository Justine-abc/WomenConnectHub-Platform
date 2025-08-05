import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { PROJECT_CATEGORIES, FUNDING_GOALS } from '../../utils/constants';
import { validateGoogleDriveUrl, validateYouTubeUrl } from '../../utils/urlHelpers';

const ProjectForm = ({ project = null, onSubmit, onCancel, isModal = false }) => {
  const { user } = useAuth();
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    email: project?.email || user?.email || '',
    category: project?.category || '',
    imageUrl: project?.imageUrl || '',
    videoUrl: project?.videoUrl || '',
    location: project?.location || user?.city || '',
    country: project?.country || user?.country || '',
    fundingGoal: project?.fundingGoal || '',
    timeline: project?.timeline || '',
    businessPlan: project?.businessPlan || '',
    targetMarket: project?.targetMarket || '',
    competitiveAdvantage: project?.competitiveAdvantage || '',
    teamSize: project?.teamSize || 1,
    previousExperience: project?.previousExperience || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.fundingGoal) {
      newErrors.fundingGoal = 'Funding goal is required';
    } else {
      const goal = parseInt(formData.fundingGoal);
      if (goal < FUNDING_GOALS.MIN) {
        newErrors.fundingGoal = `Minimum funding goal is $${FUNDING_GOALS.MIN}`;
      } else if (goal > FUNDING_GOALS.MAX) {
        newErrors.fundingGoal = `Maximum funding goal is $${FUNDING_GOALS.MAX}`;
      }
    }

    // Optional URL validations
    if (formData.imageUrl && !validateGoogleDriveUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid Google Drive link';
    }

    if (formData.videoUrl && !validateYouTubeUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid YouTube link';
    }

    if (formData.businessPlan && !validateGoogleDriveUrl(formData.businessPlan)) {
      newErrors.businessPlan = 'Please enter a valid Google Drive link for business plan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const projectData = {
        ...formData,
        fundingGoal: parseInt(formData.fundingGoal),
        teamSize: parseInt(formData.teamSize),
        entrepreneur: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}` || user.name,
          email: user.email,
          location: `${user.city || formData.city}, ${user.country || formData.country}`
        },
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSubmit(projectData);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save project' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {errors.submit}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📝</span>
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your project title"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Describe your project in detail..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length} characters (minimum 50)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {PROJECT_CATEGORIES.map(category => (
                <option key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* Location & Funding */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📍</span>
          Location & Funding
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City/Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Nairobi"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select country</option>
              <option value="Kenya">Kenya</option>
              <option value="Nigeria">Nigeria</option>
              <option value="South Africa">South Africa</option>
              <option value="Ghana">Ghana</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Other">Other</option>
            </select>
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funding Goal (USD) *
            </label>
            <input
              type="number"
              name="fundingGoal"
              value={formData.fundingGoal}
              onChange={handleInputChange}
              min={FUNDING_GOALS.MIN}
              max={FUNDING_GOALS.MAX}
              placeholder="e.g., 5000"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.fundingGoal ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fundingGoal && <p className="text-red-500 text-sm mt-1">{errors.fundingGoal}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Range: ${FUNDING_GOALS.MIN.toLocaleString()} - ${FUNDING_GOALS.MAX.toLocaleString()}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Timeline
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">Select timeline</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2+ years">2+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media & Documents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📸</span>
          Media & Documents
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Image (Google Drive Link)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://drive.google.com/file/d/..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.imageUrl ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Upload your image to Google Drive and share the link
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Video (YouTube Link)
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.videoUrl ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Optional: Add a YouTube video to showcase your project
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Plan (Google Drive Link)
            </label>
            <input
              type="url"
              name="businessPlan"
              value={formData.businessPlan}
              onChange={handleInputChange}
              placeholder="https://drive.google.com/file/d/..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.businessPlan ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.businessPlan && <p className="text-red-500 text-sm mt-1">{errors.businessPlan}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Optional: Upload your detailed business plan
            </p>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>💼</span>
          Additional Details
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Market
            </label>
            <textarea
              name="targetMarket"
              value={formData.targetMarket}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe your target market and customer base..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competitive Advantage
            </label>
            <textarea
              name="competitiveAdvantage"
              value={formData.competitiveAdvantage}
              onChange={handleInputChange}
              rows={3}
              placeholder="What makes your project unique? What's your competitive advantage?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Size
              </label>
              <select
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value={1}>Just me</option>
                <option value={2}>2 people</option>
                <option value={3}>3-5 people</option>
                <option value={4}>6-10 people</option>
                <option value={5}>More than 10</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Experience
              </label>
              <select
                name="previousExperience"
                value={formData.previousExperience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Select experience level</option>
                <option value="first-time">First-time entrepreneur</option>
                <option value="some-experience">Some business experience</option>
                <option value="experienced">Experienced entrepreneur</option>
                <option value="serial">Serial entrepreneur</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <span>{isEditing ? '💾' : '🚀'}</span>
              {isEditing ? 'Update Project' : 'Create Project'}
            </>
          )}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Project' : 'Create New Project'}
              </h2>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              )}
            </div>
            <FormContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </h1>
        <p className="text-gray-600">
          {isEditing 
            ? 'Update your project details to attract more investors' 
            : 'Share your innovative project with our community of investors and supporters'
          }
        </p>
      </div>
      <FormContent />
    </div>
  );
};

export default ProjectForm;