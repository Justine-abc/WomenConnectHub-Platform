import React from 'react';
import { createGoogleDriveViewUrl } from '../../utils/urlHelpers';

const ProjectCard = ({ project, onClick, className = "" }) => {
  // Handle case where project might be undefined
  if (!project) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        <div className="text-gray-500 text-center">No project data available</div>
      </div>
    );
  }

  const imageUrl = createGoogleDriveViewUrl(project.imageUrl);
  
  const handleClick = () => {
    if (onClick) {
      onClick(project);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = () => {
    if (!project.raisedAmount || !project.fundingGoal) return 0;
    return Math.min((project.raisedAmount / project.fundingGoal) * 100, 100);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${className}`}
      onClick={handleClick}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={project.title || 'Project image'}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center" style={{ display: imageUrl ? 'none' : 'flex' }}>
          <div className="text-center">
            <span className="text-4xl mb-2 block">🚀</span>
            <span className="text-gray-500 text-sm">Project Image</span>
          </div>
        </div>
        
        {/* Category Badge */}
        {project.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {project.category}
            </span>
          </div>
        )}

        {/* Status Badge */}
        {project.status && (
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'funded' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status === 'active' ? '🟢 Active' :
               project.status === 'funded' ? '✅ Funded' : '⏸️ Paused'}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Project Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
          {project.title || 'Untitled Project'}
        </h3>
        
        {/* Project Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {project.description || 'No description available'}
        </p>
        
        {/* Funding Progress */}
        {project.fundingGoal && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {formatCurrency(project.raisedAmount || 0)} raised
              </span>
              <span className="text-sm text-gray-500">
                of {formatCurrency(project.fundingGoal)}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>{getProgressPercentage().toFixed(1)}% funded</span>
              <span>{project.daysLeft || 30} days left</span>
            </div>
          </div>
        )}
        
        {/* Location */}
        {project.location && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-400">📍</span>
            <span className="text-sm text-gray-600">{project.location}</span>
          </div>
        )}
        
        {/* Entrepreneur Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {project.entrepreneur?.name?.charAt(0) || '👩‍💼'}
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                {project.entrepreneur?.name || 'Anonymous'}
              </span>
              <span className="text-xs text-gray-500">
                {project.entrepreneur?.location || project.location || 'Location not specified'}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle bookmark/favorite
                console.log('Bookmarked project:', project.id);
              }}
              title="Bookmark project"
              aria-label="Bookmark project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            <button 
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Handle share
                console.log('Shared project:', project.id);
              }}
              title="Share project"
              aria-label="Share project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Invest Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              // Handle invest action
              console.log('Invest clicked for project:', project.id);
            }}
          >
            💰 Invest Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;