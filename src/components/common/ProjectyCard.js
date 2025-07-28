import React from 'react';
import { createGoogleDriveViewUrl } from '../../utils/urlHelpers';

const ProjectCard = ({ project, onClick }) => {
  const imageUrl = createGoogleDriveViewUrl(project.imageUrl);

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(project)}
    >
      <div className="aspect-w-16 aspect-h-9">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={project.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">
            📍 {project.location}
          </span>
          <span className="text-lg font-bold text-green-600">
            ${project.fundingGoal?.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm">👩‍💼</span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {project.entrepreneur?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;