import { useState, useEffect } from 'react';

/**
 * Simple API hook for basic data fetching
 * @param {Function} apiFunction - The API function to call
 * @param {*} initialData - Initial data state
 * @param {boolean} immediate - Whether to fetch immediately on mount
 * @returns {Object} - { data, loading, error, refetch }
 */
const useSimpleApi = (apiFunction, initialData = null, immediate = true) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...args);
      
      if (result.error) {
        setError(result.error);
        setData(initialData);
      } else {
        setData(result.data);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      setData(initialData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && apiFunction) {
      fetchData();
    }
  }, [immediate]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useSimpleApi;