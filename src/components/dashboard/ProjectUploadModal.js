import React, { useState } from 'react';
import ProjectForm from '../projects/ProjectForm';
import { projectsAPI } from '../../services/api';

const ProjectUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleProjectSubmit = async (projectData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use your API service to create the project
      const response = await projectsAPI.create(projectData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Success callback
      if (onSuccess) {
        onSuccess(response.data || response);
      }
      
      // Close modal
      onClose();
      
    } catch (error) {
      setSubmitError(error.message || 'Failed to create project');
      throw error; // Re-throw so ProjectForm can handle it
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSubmitError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Upload New Project</h2>
              <p className="text-blue-100 mt-1">
                Share your innovative project with potential investors
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="text-blue-100 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {submitError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-6 mb-0">
              <div className="flex">
                <div className="text-red-400">⚠️</div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            <ProjectForm
              onSubmit={handleProjectSubmit}
              onCancel={handleCancel}
              isModal={true}
            />
          </div>
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Creating project...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectUploadModal;