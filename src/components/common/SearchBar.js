// WomenConnect Hub - SearchBar Component
// Project search functionality with African market focus

import React, { useState, useRef, useEffect } from 'react';
import { PROJECT_CATEGORIES, CATEGORY_LABELS, COUNTRIES } from '../../utils/constants.js';

const SearchBar = ({
  onSearch,
  onFilterChange,
  placeholder = "Search for projects, skills, or locations...",
  initialQuery = '',
  showFilters = true,
  className = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Sample suggestions based on African entrepreneurship
  const suggestions = [
    'Fashion and traditional wear',
    'Handmade crafts and jewelry',
    'Food processing and local cuisine',
    'Beauty and natural products',
    'Agriculture and farming',
    'Textiles and fabrics',
    'Technology solutions',
    'Education and training services',
    'Health and wellness products'
  ];

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  useEffect(() => {
    // Handle clicks outside to close suggestions
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        query: query.trim(),
        category: selectedCategory,
        country: selectedCountry
      });
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch({
        query: suggestion,
        category: selectedCategory,
        country: selectedCountry
      });
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (onFilterChange) {
      onFilterChange({
        category,
        country: selectedCountry
      });
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    if (onFilterChange) {
      onFilterChange({
        category: selectedCategory,
        country
      });
    }
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedCountry('');
    setShowSuggestions(false);
    if (onSearch) {
      onSearch({ query: '', category: '', country: '' });
    }
  };

  return (
    <div className={`search-container ${className}`}>
      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="search-form" role="search">
        <div className="search-input-container">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="search-input"
            aria-label="Search projects"
            aria-describedby="search-help"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
          />
          
          <button
            type="submit"
            className="search-button"
            aria-label="Search"
          >
            <span className="search-icon" aria-hidden="true">🔍</span>
          </button>

          {query && (
            <button
              type="button"
              className="clear-button"
              onClick={clearFilters}
              aria-label="Clear search"
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul
            ref={suggestionsRef}
            className="suggestions-list"
            role="listbox"
            aria-label="Search suggestions"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                role="option"
                onClick={() => handleSuggestionClick(suggestion)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSuggestionClick(suggestion);
                  }
                }}
                tabIndex={0}
              >
                <span className="suggestion-icon" aria-hidden="true">💡</span>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="filters-section">
          <button
            type="button"
            className="filters-toggle"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            aria-expanded={isAdvancedOpen}
            aria-controls="advanced-filters"
          >
            <span>🎛️</span> Filters
            <span className={`arrow ${isAdvancedOpen ? 'up' : 'down'}`} aria-hidden="true">
              {isAdvancedOpen ? '▲' : '▼'}
            </span>
          </button>

          {isAdvancedOpen && (
            <div id="advanced-filters" className="advanced-filters">
              {/* Category Filter */}
              <div className="filter-group">
                <label htmlFor="category-filter" className="filter-label">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div className="filter-group">
                <label htmlFor="country-filter" className="filter-label">
                  Country
                </label>
                <select
                  id="country-filter"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="filter-select"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <div className="filter-group">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-filters-btn"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <p id="search-help" className="search-help">
        Search by project name, skills, location, or category. 
        Try terms like "fashion Nigeria" or "crafts Kenya".
      </p>

      <style jsx>{`
        .search-form {
          position: relative;
          width: 100%;
        }

        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-md) 50px var(--spacing-md) 45px;
          font-size: var(--font-size-base);
          border: 2px solid #d1d5db;
          border-radius: 25px;
          background: #ffffff;
          transition: all 0.2s ease;
          min-height: var(--min-touch-target);
        }

        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-button {
          position: absolute;
          left: var(--spacing-md);
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: 50%;
          transition: background 0.2s ease;
        }

        .search-button:hover,
        .search-button:focus {
          background: rgba(37, 99, 235, 0.1);
        }

        .search-icon {
          font-size: var(--font-size-lg);
        }

        .clear-button {
          position: absolute;
          right: var(--spacing-md);
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: 50%;
          transition: background 0.2s ease;
          color: #6b7280;
        }

        .clear-button:hover,
        .clear-button:focus {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }

        .suggestions-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border: 2px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 var(--border-radius) var(--border-radius);
          list-style: none;
          margin: 0;
          padding: 0;
          z-index: 50;
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          cursor: pointer;
          transition: background 0.2s ease;
          border-bottom: 1px solid #f3f4f6;
        }

        .suggestion-item:hover,
        .suggestion-item:focus {
          background: #f3f4f6;
          outline: none;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-icon {
          font-size: var(--font-size-sm);
          color: #6b7280;
        }

        .filters-section {
          margin-top: var(--spacing-md);
        }

        .filters-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: none;
          border: 1px solid #d1d5db;
          border-radius: var(--border-radius);
          padding: var(--spacing-sm) var(--spacing-md);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: var(--font-size-sm);
        }

        .filters-toggle:hover,
        .filters-toggle:focus {
          border-color: #2563eb;
          background: #f3f4f6;
        }

        .arrow {
          margin-left: auto;
          transition: transform 0.2s ease;
        }

        .advanced-filters {
          margin-top: var(--spacing-md);
          padding: var(--spacing-lg);
          background: #f9fafb;
          border-radius: var(--border-radius);
          display: grid;
          gap: var(--spacing-md);
          grid-template-columns: 1fr;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .filter-label {
          font-weight: 500;
          font-size: var(--font-size-sm);
          color: #374151;
        }

        .filter-select {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid #d1d5db;
          border-radius: var(--border-radius);
          background: #ffffff;
          font-size: var(--font-size-sm);
          min-height: var(--min-touch-target);
        }

        .filter-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        .clear-filters-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          background: #ef4444;
          color: #ffffff;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          font-size: var(--font-size-sm);
          transition: background 0.2s ease;
          min-height: var(--min-touch-target);
        }

        .clear-filters-btn:hover,
        .clear-filters-btn:focus {
          background: #dc2626;
        }

        .search-help {
          font-size: var(--font-size-xs);
          color: #6b7280;
          margin: var(--spacing-sm) 0 0 0;
          text-align: center;
        }

        /* Tablet and up */
        @media (min-width: 768px) {
          .advanced-filters {
            grid-template-columns: 1fr 1fr auto;
            align-items: end;
          }

          .search-help {
            text-align: left;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .search-input,
          .filter-select {
            border-width: 2px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .search-input,
          .search-button,
          .clear-button,
          .suggestion-item,
          .filters-toggle,
          .arrow {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
