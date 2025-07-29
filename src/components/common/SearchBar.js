import React, { useState } from 'react';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search projects, entrepreneurs...", 
  className = "",
  showFilters = false 
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    fundingRange: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        query: query.trim(),
        ...(showFilters ? filters : {})
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({ category: '', location: '', fundingRange: '' });
    if (onSearch) {
      onSearch({ query: '', category: '', location: '', fundingRange: '' });
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Action Buttons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {showFilters && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-2 rounded-md transition-colors ${
                  isExpanded || Object.values(filters).some(v => v)
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Toggle filters"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </button>
            )}
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="fashion">Fashion & Clothing</option>
                  <option value="crafts">Arts & Crafts</option>
                  <option value="technology">Technology</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="food">Food & Beverage</option>
                  <option value="beauty">Health & Beauty</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  <option value="kenya">Kenya</option>
                  <option value="nigeria">Nigeria</option>
                  <option value="south-africa">South Africa</option>
                  <option value="ghana">Ghana</option>
                  <option value="uganda">Uganda</option>
                  <option value="tanzania">Tanzania</option>
                  <option value="rwanda">Rwanda</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Goal
                </label>
                <select
                  value={filters.fundingRange}
                  onChange={(e) => handleFilterChange('fundingRange', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Amount</option>
                  <option value="0-1000">$0 - $1,000</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000-25000">$10,000 - $25,000</option>
                  <option value="25000+">$25,000+</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Clear All Filters
              </button>
              
              <div className="text-sm text-gray-500">
                {Object.values(filters).filter(v => v).length} filter(s) applied
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Search Suggestions */}
      {query && (
        <div className="mt-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 max-h-48 overflow-y-auto">
            <div className="text-xs text-gray-500 px-2 py-1">Recent searches:</div>
            <button className="w-full text-left px-2 py-1 hover:bg-gray-50 rounded text-sm text-gray-700">
              {query}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
