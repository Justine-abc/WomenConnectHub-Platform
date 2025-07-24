// WomenConnect Hub - Project Grid Component
// Grid layout for displaying projects

import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';

const ProjectGrid = ({ 
  projects = [], 
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  layout = 'grid', // 'grid' or 'list'
  onProjectSelect,
  onProjectContact,
  onProjectInvest,
  emptyStateMessage = 'No projects found',
  emptyStateAction = null,
  className = ''
}) => {
  const [viewLayout, setViewLayout] = useState(layout);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !onLoadMore) return;
    
    setLoadingMore(true);
    try {
      await onLoadMore();
    } catch (err) {
      console.error('Failed to load more projects:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLayoutChange = (newLayout) => {
    setViewLayout(newLayout);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="project-grid-loading">
        <LoadingSpinner message="Loading projects..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-grid-error">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Projects</h3>
          <p>{error}</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="project-grid-empty">
        <div className="empty-content">
          <div className="empty-icon">📋</div>
          <h3>No Projects Yet</h3>
          <p>{emptyStateMessage}</p>
          {emptyStateAction && (
            <div className="empty-action">
              {emptyStateAction}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`project-grid-container ${className}`}>
      {/* Layout Controls */}
      <div className="grid-controls">
        <div className="results-info">
          <span className="results-count">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="layout-controls">
          <button
            className={`layout-btn ${viewLayout === 'grid' ? 'active' : ''}`}
            onClick={() => handleLayoutChange('grid')}
            aria-label="Grid view"
            title="Grid view"
          >
            <span className="layout-icon">⊞</span>
          </button>
          <button
            className={`layout-btn ${viewLayout === 'list' ? 'active' : ''}`}
            onClick={() => handleLayoutChange('list')}
            aria-label="List view"
            title="List view"
          >
            <span className="layout-icon">☰</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={`projects-grid ${viewLayout}-layout`}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            layout={viewLayout}
            onViewDetails={onProjectSelect}
            onContact={onProjectContact}
            onInvest={onProjectInvest}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="load-more-section">
          <Button
            variant="secondary"
            size="large"
            onClick={handleLoadMore}
            loading={loadingMore}
            disabled={loadingMore}
            fullWidth={viewLayout === 'list'}
          >
            {loadingMore ? 'Loading...' : 'Load More Projects'}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="loading-more">
          <LoadingSpinner message="Loading more projects..." size="small" />
        </div>
      )}

      <style jsx>{`
        .project-grid-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Grid Controls */
        .grid-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .results-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .results-count {
          font-weight: 600;
          color: #374151;
        }

        .layout-controls {
          display: flex;
          gap: 0.5rem;
        }

        .layout-btn {
          padding: 0.5rem;
          border: 2px solid #e5e7eb;
          background: #ffffff;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 40px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .layout-btn:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .layout-btn.active {
          border-color: #2563eb;
          background: #eff6ff;
          color: #2563eb;
        }

        .layout-btn:focus {
          outline: 2px solid #2563eb;
          outline-offset: 2px;
        }

        .layout-icon {
          font-size: 1.125rem;
          font-weight: bold;
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          gap: 1.5rem;
        }

        .projects-grid.grid-layout {
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }

        .projects-grid.list-layout {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        /* Load More Section */
        .load-more-section {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .loading-more {
          display: flex;
          justify-content: center;
          padding: 1rem;
        }

        /* Loading State */
        .project-grid-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }

        /* Error State */
        .project-grid-error {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }

        .error-content {
          text-align: center;
          padding: 2rem;
          max-width: 400px;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .error-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #dc2626;
          margin: 0 0 1rem 0;
        }

        .error-content p {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
          line-height: 1.5;
        }

        /* Empty State */
        .project-grid-empty {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          background: #ffffff;
          border-radius: 8px;
          border: 2px dashed #d1d5db;
        }

        .empty-content {
          text-align: center;
          padding: 2rem;
          max-width: 400px;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .empty-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 1rem 0;
        }

        .empty-content p {
          color: #6b7280;
          margin: 0 0 1.5rem 0;
          line-height: 1.5;
        }

        .empty-action {
          display: flex;
          justify-content: center;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .grid-controls {
            padding: 0.75rem;
          }

          .projects-grid.grid-layout {
            grid-template-columns: 1fr;
          }

          .layout-controls {
            order: -1;
          }

          .grid-controls {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .results-info {
            justify-content: center;
          }

          .layout-controls {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .projects-grid {
            gap: 1rem;
          }

          .grid-controls {
            margin: 0 -0.5rem;
          }
        }

        /* Tablet adjustments */
        @media (max-width: 1024px) and (min-width: 769px) {
          .projects-grid.grid-layout {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        /* Large screen adjustments */
        @media (min-width: 1400px) {
          .projects-grid.grid-layout {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .grid-controls {
            background: #1f2937;
            border: 1px solid #374151;
          }

          .results-count {
            color: #e5e7eb;
          }

          .layout-btn {
            background: #374151;
            border-color: #4b5563;
            color: #d1d5db;
          }

          .layout-btn:hover {
            background: #4b5563;
            border-color: #6b7280;
          }

          .layout-btn.active {
            background: #1e3a8a;
            border-color: #3b82f6;
            color: #93c5fd;
          }

          .project-grid-error {
            background: #1f2937;
            border-color: #dc2626;
          }

          .error-content h3 {
            color: #f87171;
          }

          .project-grid-empty {
            background: #1f2937;
            border-color: #4b5563;
          }

          .empty-content h3 {
            color: #e5e7eb;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .layout-btn {
            border-width: 3px;
          }

          .project-grid-empty {
            border-width: 3px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .layout-btn {
            transition: none;
          }
        }

        /* Print styles */
        @media print {
          .grid-controls,
          .load-more-section {
            display: none;
          }

          .projects-grid {
            display: block;
          }

          .projects-grid > * {
            break-inside: avoid;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectGrid;
