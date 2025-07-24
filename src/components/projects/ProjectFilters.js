// WomenConnect Hub - Project Filters Component
// Advanced filtering for project discovery

import React, { useState, useCallback, useEffect } from 'react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/helpers';

const ProjectFilters = ({ 
  onFiltersChange, 
  initialFilters = {},
  projectStats = {},
  onReset,
  isLoading = false 
}) => {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    fundingRange: { min: '', max: '' },
    status: '',
    sortBy: 'newest',
    searchTerm: '',
    tags: [],
    featured: false,
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempTagInput, setTempTagInput] = useState('');

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
    { value: 'active', label: 'Active', count: projectStats.active || 0 },
    { value: 'funded', label: 'Funded', count: projectStats.funded || 0 },
    { value: 'featured', label: 'Featured', count: projectStats.featured || 0 }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'funding-high', label: 'Highest Funding Goal' },
    { value: 'funding-low', label: 'Lowest Funding Goal' },
    { value: 'progress-high', label: 'Most Funded (%)' },
    { value: 'progress-low', label: 'Least Funded (%)' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const popularLocations = [
    'Nigeria',
    'Kenya',
    'Ghana',
    'South Africa',
    'Uganda',
    'Tanzania',
    'Rwanda',
    'Senegal',
    'Cameroon',
    'Ethiopia'
  ];

  const fundingRanges = [
    { label: 'Under $1,000', min: 0, max: 1000 },
    { label: '$1,000 - $5,000', min: 1000, max: 5000 },
    { label: '$5,000 - $10,000', min: 5000, max: 10000 },
    { label: '$10,000 - $25,000', min: 10000, max: 25000 },
    { label: '$25,000 - $50,000', min: 25000, max: 50000 },
    { label: 'Over $50,000', min: 50000, max: null }
  ];

  // Notify parent of filter changes
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNestedFilterChange = useCallback((parent, field, value) => {
    setFilters(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  }, []);

  const handleFundingRangeSelect = useCallback((range) => {
    setFilters(prev => ({
      ...prev,
      fundingRange: {
        min: range.min?.toString() || '',
        max: range.max?.toString() || ''
      }
    }));
  }, []);

  const handleTagAdd = useCallback((e) => {
    if (e.key === 'Enter' && tempTagInput.trim()) {
      e.preventDefault();
      const newTag = tempTagInput.trim().toLowerCase();
      if (!filters.tags.includes(newTag)) {
        setFilters(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTempTagInput('');
    }
  }, [tempTagInput, filters.tags]);

  const handleTagRemove = useCallback((tagToRemove) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleReset = useCallback(() => {
    const resetFilters = {
      category: '',
      location: '',
      fundingRange: { min: '', max: '' },
      status: '',
      sortBy: 'newest',
      searchTerm: '',
      tags: [],
      featured: false
    };
    setFilters(resetFilters);
    setTempTagInput('');
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const hasActiveFilters = () => {
    return filters.category || 
           filters.location || 
           filters.fundingRange.min || 
           filters.fundingRange.max ||
           filters.status ||
           filters.searchTerm ||
           filters.tags.length > 0 ||
           filters.featured ||
           filters.sortBy !== 'newest';
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.location) count++;
    if (filters.fundingRange.min || filters.fundingRange.max) count++;
    if (filters.status) count++;
    if (filters.searchTerm) count++;
    if (filters.tags.length > 0) count += filters.tags.length;
    if (filters.featured) count++;
    if (filters.sortBy !== 'newest') count++;
    return count;
  };

  return (
    <div className="project-filters">
      <div className="filters-header">
        <div className="header-left">
          <h3>Filter Projects</h3>
          {hasActiveFilters() && (
            <span className="active-filters-count">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
            </span>
          )}
        </div>
        
        <div className="header-actions">
          <button
            type="button"
            className="advanced-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '⬆️ Simple' : '⬇️ Advanced'}
          </button>
          
          {hasActiveFilters() && (
            <Button
              variant="outline"
              size="small"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset All
            </Button>
          )}
        </div>
      </div>

      <div className="filters-content">
        {/* Basic Filters */}
        <div className="basic-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="search">Search Projects</label>
              <input
                id="search"
                type="text"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                placeholder="Search by title, description, or business name..."
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">All Locations</option>
                {popularLocations.map(location => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort">Sort By</label>
              <select
                id="sort"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="advanced-filters">
            <div className="filter-section">
              <h4>Project Status</h4>
              <div className="status-options">
                <label className="status-option">
                  <input
                    type="radio"
                    name="status"
                    value=""
                    checked={filters.status === ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  />
                  <span className="status-label">
                    All Projects
                    <span className="status-count">
                      ({(projectStats.total || 0).toLocaleString()})
                    </span>
                  </span>
                </label>
                
                {statusOptions.map(option => (
                  <label key={option.value} className="status-option">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={filters.status === option.value}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    />
                    <span className="status-label">
                      {option.label}
                      <span className="status-count">({option.count.toLocaleString()})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Funding Goal Range</h4>
              
              <div className="funding-ranges">
                {fundingRanges.map((range, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`funding-range-btn ${
                      filters.fundingRange.min === range.min?.toString() &&
                      filters.fundingRange.max === range.max?.toString()
                        ? 'active' : ''
                    }`}
                    onClick={() => handleFundingRangeSelect(range)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <div className="custom-range">
                <h5>Custom Range</h5>
                <div className="range-inputs">
                  <div className="range-input">
                    <label htmlFor="min-funding">Min Amount</label>
                    <input
                      id="min-funding"
                      type="number"
                      value={filters.fundingRange.min}
                      onChange={(e) => handleNestedFilterChange('fundingRange', 'min', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <span className="range-separator">to</span>
                  <div className="range-input">
                    <label htmlFor="max-funding">Max Amount</label>
                    <input
                      id="max-funding"
                      type="number"
                      value={filters.fundingRange.max}
                      onChange={(e) => handleNestedFilterChange('fundingRange', 'max', e.target.value)}
                      placeholder="No limit"
                      min="0"
                    />
                  </div>
                </div>
                
                {(filters.fundingRange.min || filters.fundingRange.max) && (
                  <div className="range-preview">
                    {filters.fundingRange.min && filters.fundingRange.max ? (
                      <>
                        {formatCurrency(parseFloat(filters.fundingRange.min))} - {formatCurrency(parseFloat(filters.fundingRange.max))}
                      </>
                    ) : filters.fundingRange.min ? (
                      <>From {formatCurrency(parseFloat(filters.fundingRange.min))}</>
                    ) : (
                      <>Up to {formatCurrency(parseFloat(filters.fundingRange.max))}</>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-section">
              <h4>Tags</h4>
              <div className="tags-input">
                <input
                  type="text"
                  value={tempTagInput}
                  onChange={(e) => setTempTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                  placeholder="Type a tag and press Enter..."
                />
                
                {filters.tags.length > 0 && (
                  <div className="active-tags">
                    {filters.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="tag-remove"
                          aria-label={`Remove ${tag} tag`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="filter-section">
              <h4>Special Filters</h4>
              <label className="checkbox-filter">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.checked)}
                />
                <span className="checkbox-label">
                  ⭐ Featured Projects Only
                  <span className="checkbox-description">
                    Show only projects highlighted by our team
                  </span>
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .project-filters {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .header-left h3 {
          color: #1f2937;
          margin: 0 0 0.25rem 0;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .active-filters-count {
          color: #2563eb;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .advanced-toggle {
          background: none;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .advanced-toggle:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .filters-content {
          padding: 1.5rem;
        }

        /* Basic Filters */
        .basic-filters {
          margin-bottom: 1.5rem;
        }

        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .filter-row:last-child {
          margin-bottom: 0;
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .filter-group label {
          display: block;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .filter-group input,
        .filter-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s ease;
        }

        .filter-group input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-input {
          padding-left: 2.5rem;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: left 0.75rem center;
          background-size: 1rem 1rem;
        }

        /* Advanced Filters */
        .advanced-filters {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .filter-section {
          margin-bottom: 2rem;
        }

        .filter-section:last-child {
          margin-bottom: 0;
        }

        .filter-section h4 {
          color: #1f2937;
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .filter-section h5 {
          color: #374151;
          margin: 1rem 0 0.5rem 0;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Status Options */
        .status-options {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .status-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .status-label {
          color: #374151;
          font-size: 0.875rem;
        }

        .status-count {
          color: #6b7280;
          font-weight: normal;
        }

        /* Funding Ranges */
        .funding-ranges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .funding-range-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .funding-range-btn:hover {
          background: #e5e7eb;
        }

        .funding-range-btn.active {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }

        .custom-range {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .range-inputs {
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .range-input {
          flex: 1;
        }

        .range-input label {
          display: block;
          color: #374151;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .range-input input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .range-separator {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .range-preview {
          background: #eff6ff;
          border: 1px solid #2563eb;
          color: #1d4ed8;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          text-align: center;
        }

        /* Tags Input */
        .tags-input input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }

        .active-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #e5e7eb;
          color: #374151;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.875rem;
        }

        .tag-remove {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tag-remove:hover {
          color: #ef4444;
        }

        /* Checkbox Filter */
        .checkbox-filter {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
        }

        .checkbox-label {
          flex: 1;
          color: #374151;
          font-size: 0.875rem;
        }

        .checkbox-description {
          display: block;
          color: #6b7280;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .filters-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .header-actions {
            justify-content: space-between;
          }

          .filter-row {
            flex-direction: column;
          }

          .filter-group {
            min-width: auto;
          }

          .status-options {
            flex-direction: column;
          }

          .funding-ranges {
            flex-direction: column;
          }

          .funding-range-btn {
            text-align: left;
          }

          .range-inputs {
            flex-direction: column;
            align-items: stretch;
          }

          .range-separator {
            text-align: center;
            margin: 0.5rem 0;
          }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .project-filters {
            background: #1f2937;
            color: #f3f4f6;
          }

          .filters-header {
            background: #374151;
            border-color: #4b5563;
          }

          .header-left h3,
          .filter-section h4,
          .filter-section h5 {
            color: #f3f4f6;
          }

          .advanced-filters {
            border-color: #4b5563;
          }

          .filter-group input,
          .filter-group select,
          .tags-input input,
          .range-input input {
            background: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
          }

          .funding-range-btn {
            background: #374151;
            border-color: #4b5563;
            color: #e5e7eb;
          }

          .funding-range-btn:hover {
            background: #4b5563;
          }

          .funding-range-btn.active {
            background: #3b82f6;
            border-color: #3b82f6;
          }

          .custom-range {
            background: #374151;
            border-color: #4b5563;
          }

          .tag {
            background: #4b5563;
            color: #e5e7eb;
          }

          .advanced-toggle {
            background: #374151;
            border-color: #4b5563;
            color: #e5e7eb;
          }

          .advanced-toggle:hover {
            background: #4b5563;
          }
        }

        /* Print styles */
        @media print {
          .filters-header,
          .advanced-toggle {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectFilters;
