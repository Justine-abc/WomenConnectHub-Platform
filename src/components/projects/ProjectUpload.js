// WomenConnect Hub - Project Upload Component
// Multi-step form for uploading projects with Google Drive media support

import React, { useState, useCallback } from 'react';
import Button from '../common/Button';
import FormGroup from '../common/FormGroup';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateProjectData, validateGoogleDriveLink } from '../../utils/validators';
import { formatCurrency } from '../../utils/helpers';

const ProjectUpload = ({ onSubmit, onCancel, isLoading = false }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    description: '',
    fullDescription: '',
    businessName: '',
    category: '',
    location: '',
    
    // Funding Information
    fundingGoal: '',
    fundingPurpose: '',
    
    // Media
    images: [''],
    videos: [''],
    
    // Business Details
    businessPlan: '',
    milestones: [{ title: '', description: '', targetDate: '', completed: false }],
    
    // Contact & Additional
    tags: [''],
    sellerBio: '',
    sellerContact: {
      email: '',
      phone: '',
      whatsapp: ''
    }
  });
  
  const [errors, setErrors] = useState({});
  const [mediaErrors, setMediaErrors] = useState({});

  const categories = [
    'Technology',
    'Agriculture',
    'Fashion & Textiles',
    'Food & Beverage',
    'Crafts & Artisan',
    'Education',
    'Healthcare',
    'Retail',
    'Services',
    'Manufacturing',
    'Other'
  ];

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific errors
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const handleNestedInputChange = useCallback((parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  }, []);

  const handleArrayInputChange = useCallback((field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  }, []);

  const handleObjectArrayInputChange = useCallback((field, index, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [subField]: value } : item
      )
    }));
  }, []);

  const addArrayItem = useCallback((field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  }, []);

  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  const addMilestone = useCallback(() => {
    addArrayItem('milestones', { title: '', description: '', targetDate: '', completed: false });
  }, [addArrayItem]);

  const validateMediaLinks = useCallback(async (images, videos) => {
    const mediaErrors = {};
    
    // Validate image links
    images.forEach((link, index) => {
      if (link.trim()) {
        try {
          validateGoogleDriveLink(link, 'image');
        } catch (error) {
          mediaErrors[`image_${index}`] = error.message;
        }
      }
    });
    
    // Validate video links
    videos.forEach((link, index) => {
      if (link.trim()) {
        try {
          validateGoogleDriveLink(link, 'video');
        } catch (error) {
          mediaErrors[`video_${index}`] = error.message;
        }
      }
    });
    
    setMediaErrors(mediaErrors);
    return Object.keys(mediaErrors).length === 0;
  }, []);

  const validateStep = useCallback((stepNumber) => {
    const stepErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) stepErrors.title = 'Project title is required';
        if (!formData.description.trim()) stepErrors.description = 'Description is required';
        if (!formData.businessName.trim()) stepErrors.businessName = 'Business name is required';
        if (!formData.category) stepErrors.category = 'Category is required';
        if (!formData.location.trim()) stepErrors.location = 'Location is required';
        break;
        
      case 2:
        if (!formData.fundingGoal || parseFloat(formData.fundingGoal) <= 0) {
          stepErrors.fundingGoal = 'Valid funding goal is required';
        }
        if (!formData.fundingPurpose.trim()) {
          stepErrors.fundingPurpose = 'Funding purpose is required';
        }
        break;
        
      case 3:
        // Media validation happens in real-time
        if (Object.keys(mediaErrors).length > 0) {
          stepErrors.media = 'Please fix media link errors';
        }
        break;
        
      case 4:
        if (!formData.sellerContact.email.trim()) {
          stepErrors['sellerContact.email'] = 'Email is required';
        }
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [formData, mediaErrors]);

  const handleNext = useCallback(async () => {
    if (step === 3) {
      const hasValidImages = formData.images.some(img => img.trim());
      const hasValidVideos = formData.videos.some(vid => vid.trim());
      
      if (hasValidImages || hasValidVideos) {
        const isValidMedia = await validateMediaLinks(formData.images, formData.videos);
        if (!isValidMedia) return;
      }
    }
    
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  }, [step, validateStep, validateMediaLinks, formData]);

  const handlePrevious = useCallback(() => {
    setStep(prev => prev - 1);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) return;
    
    // Final validation
    try {
      const cleanedData = {
        ...formData,
        fundingGoal: parseFloat(formData.fundingGoal),
        images: formData.images.filter(img => img.trim()),
        videos: formData.videos.filter(vid => vid.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        milestones: formData.milestones.filter(m => m.title.trim())
      };
      
      validateProjectData(cleanedData);
      
      if (onSubmit) {
        await onSubmit(cleanedData);
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  }, [formData, validateStep, onSubmit]);

  const renderStep1 = () => (
    <div className="form-step">
      <h3>Basic Project Information</h3>
      
      <FormGroup
        label="Project Title"
        error={errors.title}
        required
      >
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter your project title"
          maxLength={100}
        />
        <small className="char-count">{formData.title.length}/100</small>
      </FormGroup>

      <FormGroup
        label="Business Name"
        error={errors.businessName}
        required
      >
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Your business or company name"
        />
      </FormGroup>

      <FormGroup
        label="Category"
        error={errors.category}
        required
      >
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </FormGroup>

      <FormGroup
        label="Location"
        error={errors.location}
        required
      >
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="City, Country"
        />
      </FormGroup>

      <FormGroup
        label="Short Description"
        error={errors.description}
        required
      >
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of your project (2-3 sentences)"
          rows={3}
          maxLength={300}
        />
        <small className="char-count">{formData.description.length}/300</small>
      </FormGroup>

      <FormGroup
        label="Detailed Description"
        helper="Provide a comprehensive description of your project, business model, and goals"
      >
        <textarea
          value={formData.fullDescription}
          onChange={(e) => handleInputChange('fullDescription', e.target.value)}
          placeholder="Detailed description of your project..."
          rows={6}
          maxLength={2000}
        />
        <small className="char-count">{formData.fullDescription.length}/2000</small>
      </FormGroup>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-step">
      <h3>Funding Information</h3>
      
      <FormGroup
        label="Funding Goal"
        error={errors.fundingGoal}
        required
        helper="Amount needed in your local currency"
      >
        <input
          type="number"
          value={formData.fundingGoal}
          onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
          placeholder="0"
          min="1"
          step="0.01"
        />
        {formData.fundingGoal && (
          <div className="funding-preview">
            Goal: {formatCurrency(parseFloat(formData.fundingGoal) || 0)}
          </div>
        )}
      </FormGroup>

      <FormGroup
        label="Funding Purpose"
        error={errors.fundingPurpose}
        required
        helper="Explain how you will use the funding"
      >
        <textarea
          value={formData.fundingPurpose}
          onChange={(e) => handleInputChange('fundingPurpose', e.target.value)}
          placeholder="Describe how you plan to use the funding..."
          rows={4}
          maxLength={500}
        />
        <small className="char-count">{formData.fundingPurpose.length}/500</small>
      </FormGroup>

      <FormGroup
        label="Business Plan"
        helper="Upload your business plan as a Google Drive link (optional)"
      >
        <input
          type="url"
          value={formData.businessPlan}
          onChange={(e) => handleInputChange('businessPlan', e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
        />
      </FormGroup>

      <div className="milestones-section">
        <h4>Project Milestones</h4>
        <p className="helper-text">Add key milestones for your project</p>
        
        {formData.milestones.map((milestone, index) => (
          <div key={index} className="milestone-input">
            <div className="milestone-header">
              <h5>Milestone {index + 1}</h5>
              {formData.milestones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('milestones', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
            
            <FormGroup label="Title">
              <input
                type="text"
                value={milestone.title}
                onChange={(e) => handleObjectArrayInputChange('milestones', index, 'title', e.target.value)}
                placeholder="Milestone title"
              />
            </FormGroup>
            
            <FormGroup label="Description">
              <textarea
                value={milestone.description}
                onChange={(e) => handleObjectArrayInputChange('milestones', index, 'description', e.target.value)}
                placeholder="Describe this milestone"
                rows={2}
              />
            </FormGroup>
            
            <FormGroup label="Target Date">
              <input
                type="date"
                value={milestone.targetDate}
                onChange={(e) => handleObjectArrayInputChange('milestones', index, 'targetDate', e.target.value)}
              />
            </FormGroup>
          </div>
        ))}
        
        <Button
          type="button"
          variant="secondary"
          onClick={addMilestone}
          size="small"
        >
          Add Milestone
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="form-step">
      <h3>Project Media</h3>
      <p className="step-description">
        Add images and videos using Google Drive links. Make sure your files are publicly viewable.
      </p>
      
      <div className="media-section">
        <h4>Project Images</h4>
        <p className="helper-text">
          Upload images to Google Drive and share the public links here
        </p>
        
        {formData.images.map((image, index) => (
          <FormGroup
            key={index}
            label={`Image ${index + 1}`}
            error={mediaErrors[`image_${index}`]}
          >
            <div className="media-input">
              <input
                type="url"
                value={image}
                onChange={(e) => handleArrayInputChange('images', index, e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                onBlur={() => image.trim() && validateMediaLinks(formData.images, formData.videos)}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('images', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          </FormGroup>
        ))}
        
        <Button
          type="button"
          variant="secondary"
          onClick={() => addArrayItem('images', '')}
          size="small"
        >
          Add Another Image
        </Button>
      </div>

      <div className="media-section">
        <h4>Project Videos</h4>
        <p className="helper-text">
          Upload videos to Google Drive and share the public links here
        </p>
        
        {formData.videos.map((video, index) => (
          <FormGroup
            key={index}
            label={`Video ${index + 1}`}
            error={mediaErrors[`video_${index}`]}
          >
            <div className="media-input">
              <input
                type="url"
                value={video}
                onChange={(e) => handleArrayInputChange('videos', index, e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                onBlur={() => video.trim() && validateMediaLinks(formData.images, formData.videos)}
              />
              {formData.videos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('videos', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          </FormGroup>
        ))}
        
        <Button
          type="button"
          variant="secondary"
          onClick={() => addArrayItem('videos', '')}
          size="small"
        >
          Add Another Video
        </Button>
      </div>

      <div className="media-tips">
        <h4>Media Tips</h4>
        <ul>
          <li>Upload files to Google Drive and make them publicly viewable</li>
          <li>Copy the shareable link (not the preview link)</li>
          <li>Use high-quality images that showcase your product/service</li>
          <li>Keep videos under 10 minutes for better viewing experience</li>
        </ul>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="form-step">
      <h3>Contact Information & Final Details</h3>
      
      <FormGroup
        label="About Yourself"
        helper="Tell potential investors about your background and experience"
      >
        <textarea
          value={formData.sellerBio}
          onChange={(e) => handleInputChange('sellerBio', e.target.value)}
          placeholder="Share your background, experience, and what drives you..."
          rows={4}
          maxLength={500}
        />
        <small className="char-count">{formData.sellerBio.length}/500</small>
      </FormGroup>

      <div className="contact-section">
        <h4>Contact Information</h4>
        
        <FormGroup
          label="Email Address"
          error={errors['sellerContact.email']}
          required
        >
          <input
            type="email"
            value={formData.sellerContact.email}
            onChange={(e) => handleNestedInputChange('sellerContact', 'email', e.target.value)}
            placeholder="your@email.com"
          />
        </FormGroup>

        <FormGroup
          label="Phone Number"
          helper="Include country code (e.g., +234...)"
        >
          <input
            type="tel"
            value={formData.sellerContact.phone}
            onChange={(e) => handleNestedInputChange('sellerContact', 'phone', e.target.value)}
            placeholder="+234..."
          />
        </FormGroup>

        <FormGroup
          label="WhatsApp Number"
          helper="WhatsApp number for easy communication"
        >
          <input
            type="tel"
            value={formData.sellerContact.whatsapp}
            onChange={(e) => handleNestedInputChange('sellerContact', 'whatsapp', e.target.value)}
            placeholder="+234..."
          />
        </FormGroup>
      </div>

      <div className="tags-section">
        <h4>Project Tags</h4>
        <p className="helper-text">Add relevant tags to help people find your project</p>
        
        {formData.tags.map((tag, index) => (
          <FormGroup key={index} label={`Tag ${index + 1}`}>
            <div className="tag-input">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                placeholder="Enter a tag"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          </FormGroup>
        ))}
        
        <Button
          type="button"
          variant="secondary"
          onClick={() => addArrayItem('tags', '')}
          size="small"
        >
          Add Tag
        </Button>
      </div>

      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className="steps">
        {[1, 2, 3, 4].map((stepNum) => (
          <div
            key={stepNum}
            className={`step ${step >= stepNum ? 'active' : ''} ${step > stepNum ? 'completed' : ''}`}
          >
            <div className="step-number">
              {step > stepNum ? '✓' : stepNum}
            </div>
            <div className="step-label">
              {stepNum === 1 && 'Basic Info'}
              {stepNum === 2 && 'Funding'}
              {stepNum === 3 && 'Media'}
              {stepNum === 4 && 'Contact'}
            </div>
          </div>
        ))}
      </div>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="project-upload">
      <div className="upload-header">
        <h2>Submit Your Project</h2>
        <p>Share your business idea with potential investors and partners</p>
      </div>

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="upload-form">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <div className="form-actions">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrevious}
              disabled={isLoading}
            >
              Previous
            </Button>
          )}
          
          <div className="action-buttons">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            {step < 4 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                disabled={isLoading}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Submit Project'}
              </Button>
            )}
          </div>
        </div>
      </form>

      <style jsx>{`
        .project-upload {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .upload-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .upload-header h2 {
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          font-size: 1.875rem;
          font-weight: 700;
        }

        .upload-header p {
          color: #6b7280;
          margin: 0;
          font-size: 1.125rem;
        }

        /* Step Indicator */
        .step-indicator {
          margin-bottom: 2rem;
        }

        .steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e5e7eb;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: #2563eb;
          color: white;
        }

        .step.completed .step-number {
          background: #10b981;
          color: white;
        }

        .step-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .step.active .step-label {
          color: #2563eb;
        }

        .progress-bar {
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background: #2563eb;
          transition: width 0.3s ease;
        }

        /* Form Steps */
        .form-step {
          margin-bottom: 2rem;
        }

        .form-step h3 {
          color: #1f2937;
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .form-step h4 {
          color: #374151;
          margin: 1.5rem 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .form-step h5 {
          color: #4b5563;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .step-description {
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .helper-text {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0 0 1rem 0;
        }

        .char-count {
          color: #9ca3af;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        /* Funding Preview */
        .funding-preview {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 6px;
          color: #0369a1;
          font-weight: 600;
        }

        /* Milestones */
        .milestones-section {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 1.5rem;
        }

        .milestone-input {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }

        .milestone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        /* Media Sections */
        .media-section {
          margin-bottom: 2rem;
        }

        .media-input {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .media-input input {
          flex: 1;
        }

        .media-tips {
          background: #f0f9ff;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
        }

        .media-tips h4 {
          color: #0369a1;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .media-tips ul {
          margin: 0;
          padding-left: 1.25rem;
          color: #0369a1;
        }

        .media-tips li {
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }

        /* Contact and Tags */
        .contact-section,
        .tags-section {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 1.5rem;
        }

        .tag-input {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .tag-input input {
          flex: 1;
        }

        /* Buttons */
        .remove-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.2s ease;
          flex-shrink: 0;
        }

        .remove-btn:hover {
          background: #dc2626;
        }

        /* Form Actions */
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
        }

        /* Error Message */
        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .project-upload {
            padding: 1rem;
            margin: 1rem;
          }

          .steps {
            flex-direction: column;
            gap: 1rem;
          }

          .step {
            flex-direction: row;
            justify-content: flex-start;
          }

          .step-number {
            width: 32px;
            height: 32px;
            font-size: 0.875rem;
          }

          .upload-header h2 {
            font-size: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .action-buttons {
            width: 100%;
            justify-content: space-between;
          }

          .media-input,
          .tag-input {
            flex-direction: column;
          }

          .remove-btn {
            align-self: flex-end;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .project-upload {
            background: #1f2937;
            color: #f3f4f6;
          }

          .upload-header h2,
          .form-step h3,
          .form-step h4,
          .form-step h5 {
            color: #f3f4f6;
          }

          .step-number {
            background: #4b5563;
            color: #9ca3af;
          }

          .step.active .step-number {
            background: #3b82f6;
          }

          .step.completed .step-number {
            background: #10b981;
          }

          .milestones-section,
          .contact-section,
          .tags-section {
            background: #374151;
          }

          .milestone-input {
            background: #4b5563;
            border-color: #6b7280;
          }

          .media-tips {
            background: #1e3a8a;
            border-color: #3b82f6;
          }

          .media-tips h4,
          .media-tips li {
            color: #93c5fd;
          }

          .error-message {
            background: #7f1d1d;
            border-color: #b91c1c;
            color: #fca5a5;
          }
        }

        /* Print styles */
        @media print {
          .form-actions,
          .remove-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectUpload;
