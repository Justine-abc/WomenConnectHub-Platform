// WomenConnect Hub - Project Edit Component
// Edit existing projects with Google Drive media support

import React, { useState, useEffect, useCallback } from 'react';
import Button from '../common/Button';
import FormGroup from '../common/FormGroup';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import { validateProjectData, validateGoogleDriveLink } from '../../utils/validators';
import { formatCurrency } from '../../utils/helpers';

const ProjectEdit = ({ 
  project, 
  onSave, 
  onCancel, 
  onDelete,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    businessName: '',
    category: '',
    location: '',
    fundingGoal: '',
    fundingPurpose: '',
    images: [''],
    videos: [''],
    businessPlan: '',
    milestones: [{ title: '', description: '', targetDate: '', completed: false }],
    tags: [''],
    sellerBio: '',
    sellerContact: {
      email: '',
      phone: '',
      whatsapp: ''
    },
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  const [mediaErrors, setMediaErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

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

  const statusOptions = [
    { value: 'active', label: 'Active', description: 'Project is visible and accepting investments' },
    { value: 'paused', label: 'Paused', description: 'Project is visible but not accepting new investments' },
    { value: 'completed', label: 'Completed', description: 'Project has reached its funding goal' },
    { value: 'draft', label: 'Draft', description: 'Project is not visible to the public' }
  ];

  // Initialize form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        fullDescription: project.fullDescription || '',
        businessName: project.businessName || '',
        category: project.category || '',
        location: project.location || '',
        fundingGoal: project.fundingGoal?.toString() || '',
        fundingPurpose: project.fundingPurpose || '',
        images: project.images?.length ? project.images : [''],
        videos: project.videos?.length ? project.videos : [''],
        businessPlan: project.businessPlan || '',
        milestones: project.milestones?.length ? project.milestones : [{ title: '', description: '', targetDate: '', completed: false }],
        tags: project.tags?.length ? project.tags : [''],
        sellerBio: project.sellerBio || '',
        sellerContact: {
          email: project.sellerContact?.email || '',
          phone: project.sellerContact?.phone || '',
          whatsapp: project.sellerContact?.whatsapp || ''
        },
        status: project.status || 'active'
      });
      setHasUnsavedChanges(false);
    }
  }, [project]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
    
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
    setHasUnsavedChanges(true);
  }, []);

  const handleArrayInputChange = useCallback((field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
    setHasUnsavedChanges(true);
  }, []);

  const handleObjectArrayInputChange = useCallback((field, index, subField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [subField]: value } : item
      )
    }));
    setHasUnsavedChanges(true);
  }, []);

  const addArrayItem = useCallback((field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removeArrayItem = useCallback((field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  }, []);

  const addMilestone = useCallback(() => {
    addArrayItem('milestones', { title: '', description: '', targetDate: '', completed: false });
  }, [addArrayItem]);

  const validateMediaLinks = useCallback(async (images, videos) => {
    const mediaErrors = {};
    
    images.forEach((link, index) => {
      if (link.trim()) {
        try {
          validateGoogleDriveLink(link, 'image');
        } catch (error) {
          mediaErrors[`image_${index}`] = error.message;
        }
      }
    });
    
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

  const validateForm = useCallback(() => {
    const formErrors = {};
    
    if (!formData.title.trim()) formErrors.title = 'Project title is required';
    if (!formData.description.trim()) formErrors.description = 'Description is required';
    if (!formData.businessName.trim()) formErrors.businessName = 'Business name is required';
    if (!formData.category) formErrors.category = 'Category is required';
    if (!formData.location.trim()) formErrors.location = 'Location is required';
    if (!formData.fundingGoal || parseFloat(formData.fundingGoal) <= 0) {
      formErrors.fundingGoal = 'Valid funding goal is required';
    }
    if (!formData.sellerContact.email.trim()) {
      formErrors['sellerContact.email'] = 'Email is required';
    }
    
    // Media validation
    if (Object.keys(mediaErrors).length > 0) {
      formErrors.media = 'Please fix media link errors';
    }
    
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [formData, mediaErrors]);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Validate media links
    const hasValidImages = formData.images.some(img => img.trim());
    const hasValidVideos = formData.videos.some(vid => vid.trim());
    
    if (hasValidImages || hasValidVideos) {
      const isValidMedia = await validateMediaLinks(formData.images, formData.videos);
      if (!isValidMedia) return;
    }
    
    try {
      const cleanedData = {
        ...project,
        ...formData,
        fundingGoal: parseFloat(formData.fundingGoal),
        images: formData.images.filter(img => img.trim()),
        videos: formData.videos.filter(vid => vid.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        milestones: formData.milestones.filter(m => m.title.trim()),
        updatedAt: new Date().toISOString()
      };
      
      validateProjectData(cleanedData);
      
      if (onSave) {
        await onSave(cleanedData);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  }, [formData, validateForm, validateMediaLinks, onSave, project]);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesModal(true);
    } else {
      onCancel();
    }
  }, [hasUnsavedChanges, onCancel]);

  const handleConfirmCancel = useCallback(() => {
    setShowUnsavedChangesModal(false);
    onCancel();
  }, [onCancel]);

  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (onDelete) {
      await onDelete(project);
    }
    setShowDeleteModal(false);
  }, [onDelete, project]);

  const toggleMilestoneCompleted = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, completed: !milestone.completed } : milestone
      )
    }));
    setHasUnsavedChanges(true);
  }, []);

  if (!project) {
    return (
      <div className="project-edit-loading">
        <LoadingSpinner />
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="project-edit">
      <div className="edit-header">
        <div className="header-content">
          <h2>Edit Project</h2>
          <p>Update your project information and settings</p>
        </div>
        
        <div className="header-actions">
          <Button
            variant="danger"
            size="small"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Project
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="unsaved-changes-notice">
          <span>⚠️ You have unsaved changes</span>
        </div>
      )}

      <form onSubmit={handleSave} className="edit-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <FormGroup label="Project Status" required>
            <div className="status-options">
              {statusOptions.map((option) => (
                <label key={option.value} className="status-option">
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={formData.status === option.value}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  />
                  <div className="status-content">
                    <div className="status-label">{option.label}</div>
                    <div className="status-description">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </FormGroup>
          
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

          <div className="form-row">
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
          </div>

          <FormGroup
            label="Short Description"
            error={errors.description}
            required
          >
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your project"
              rows={3}
              maxLength={300}
            />
            <small className="char-count">{formData.description.length}/300</small>
          </FormGroup>

          <FormGroup label="Detailed Description">
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

        {/* Funding Information */}
        <div className="form-section">
          <h3>Funding Information</h3>
          
          <div className="form-row">
            <FormGroup
              label="Funding Goal"
              error={errors.fundingGoal}
              required
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
          </div>

          <FormGroup label="Funding Purpose">
            <textarea
              value={formData.fundingPurpose}
              onChange={(e) => handleInputChange('fundingPurpose', e.target.value)}
              placeholder="Describe how you plan to use the funding..."
              rows={4}
              maxLength={500}
            />
            <small className="char-count">{formData.fundingPurpose.length}/500</small>
          </FormGroup>

          <FormGroup label="Business Plan">
            <input
              type="url"
              value={formData.businessPlan}
              onChange={(e) => handleInputChange('businessPlan', e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
            />
          </FormGroup>
        </div>

        {/* Media Section */}
        <div className="form-section">
          <h3>Project Media</h3>
          
          <div className="media-subsection">
            <h4>Project Images</h4>
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
              Add Image
            </Button>
          </div>

          <div className="media-subsection">
            <h4>Project Videos</h4>
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
              Add Video
            </Button>
          </div>
        </div>

        {/* Milestones */}
        <div className="form-section">
          <h3>Project Milestones</h3>
          
          {formData.milestones.map((milestone, index) => (
            <div key={index} className="milestone-input">
              <div className="milestone-header">
                <h5>Milestone {index + 1}</h5>
                <div className="milestone-actions">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={milestone.completed}
                      onChange={() => toggleMilestoneCompleted(index)}
                    />
                    Completed
                  </label>
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

        {/* Contact & Tags */}
        <div className="form-section">
          <h3>Contact Information</h3>
          
          <FormGroup label="About Yourself">
            <textarea
              value={formData.sellerBio}
              onChange={(e) => handleInputChange('sellerBio', e.target.value)}
              placeholder="Share your background and experience..."
              rows={4}
              maxLength={500}
            />
            <small className="char-count">{formData.sellerBio.length}/500</small>
          </FormGroup>
          
          <div className="form-row">
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

            <FormGroup label="Phone Number">
              <input
                type="tel"
                value={formData.sellerContact.phone}
                onChange={(e) => handleNestedInputChange('sellerContact', 'phone', e.target.value)}
                placeholder="+234..."
              />
            </FormGroup>
          </div>

          <FormGroup label="WhatsApp Number">
            <input
              type="tel"
              value={formData.sellerContact.whatsapp}
              onChange={(e) => handleNestedInputChange('sellerContact', 'whatsapp', e.target.value)}
              placeholder="+234..."
            />
          </FormGroup>
        </div>

        {/* Tags */}
        <div className="form-section">
          <h3>Project Tags</h3>
          
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

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !hasUnsavedChanges}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Save Changes'}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Project"
        size="medium"
      >
        <div className="delete-modal">
          <p>Are you sure you want to delete "{project.title}"? This action cannot be undone.</p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Unsaved Changes Modal */}
      <Modal
        isOpen={showUnsavedChangesModal}
        onClose={() => setShowUnsavedChangesModal(false)}
        title="Unsaved Changes"
        size="medium"
      >
        <div className="unsaved-changes-modal">
          <p>You have unsaved changes. Are you sure you want to leave without saving?</p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setShowUnsavedChangesModal(false)}
            >
              Continue Editing
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
            >
              Discard Changes
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .project-edit {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .edit-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-content h2 {
          color: #1f2937;
          margin: 0 0 0.5rem 0;
          font-size: 1.875rem;
          font-weight: 700;
        }

        .header-content p {
          color: #6b7280;
          margin: 0;
          font-size: 1rem;
        }

        .unsaved-changes-notice {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          color: #92400e;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        /* Form Sections */
        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h3 {
          color: #1f2937;
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .form-section h4 {
          color: #374151;
          margin: 1rem 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .form-section h5 {
          color: #4b5563;
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* Status Options */
        .status-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .status-option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .status-option:hover {
          border-color: #d1d5db;
        }

        .status-option input[type="radio"]:checked + .status-content {
          color: #2563eb;
        }

        .status-option:has(input[type="radio"]:checked) {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .status-content {
          flex: 1;
        }

        .status-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .status-description {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Media and Other Inputs */
        .media-subsection {
          margin-bottom: 1.5rem;
        }

        .media-input,
        .tag-input {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .media-input input,
        .tag-input input {
          flex: 1;
        }

        /* Milestones */
        .milestone-input {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }

        .milestone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .milestone-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
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

        /* Utility Classes */
        .char-count {
          color: #9ca3af;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .funding-preview {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 6px;
          color: #0369a1;
          font-weight: 600;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
        }

        /* Loading State */
        .project-edit-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          gap: 1rem;
        }

        .project-edit-loading p {
          color: #6b7280;
          margin: 0;
        }

        /* Modal Content */
        .delete-modal,
        .unsaved-changes-modal {
          text-align: center;
        }

        .modal-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .project-edit {
            padding: 1rem;
            margin: 1rem;
          }

          .edit-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .status-options {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .media-input,
          .tag-input {
            flex-direction: column;
          }

          .remove-btn {
            align-self: flex-end;
          }

          .milestone-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .milestone-actions {
            justify-content: space-between;
          }

          .modal-actions {
            flex-direction: column;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .project-edit {
            background: #1f2937;
            color: #f3f4f6;
          }

          .header-content h2,
          .form-section h3,
          .form-section h4,
          .form-section h5 {
            color: #f3f4f6;
          }

          .status-option {
            border-color: #4b5563;
          }

          .status-option:hover {
            border-color: #6b7280;
          }

          .status-option:has(input[type="radio"]:checked) {
            border-color: #3b82f6;
            background: #1e3a8a;
          }

          .milestone-input {
            background: #374151;
            border-color: #4b5563;
          }

          .unsaved-changes-notice {
            background: #78350f;
            border-color: #f59e0b;
            color: #fbbf24;
          }

          .error-message {
            background: #7f1d1d;
            border-color: #b91c1c;
            color: #fca5a5;
          }
        }

        /* Print styles */
        @media print {
          .header-actions,
          .form-actions,
          .remove-btn,
          .unsaved-changes-notice {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectEdit;
