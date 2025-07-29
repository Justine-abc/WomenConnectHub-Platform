import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Advanced API hook with caching, retry, and pagination support
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - API state and methods
 */
const useApi = (apiFunction, options = {}) => {
  const {
    initialData = null,
    immediate = true,
    dependencies = [],
    retryCount = 3,
    retryDelay = 1000,
    cache = false,
    cacheKey = null,
    pagination = false,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const mountedRef = useRef(true);
  const cacheRef = useRef(new Map());
  const retryCountRef = useRef(0);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const getCacheKey = useCallback((args) => {
    if (cacheKey) return cacheKey;
    return JSON.stringify({ apiFunction: apiFunction.name, args });
  }, [cacheKey, apiFunction]);

  const setDataSafely = useCallback((newData) => {
    if (mountedRef.current) {
      setData(newData);
    }
  }, []);

  const setLoadingSafely = useCallback((loadingState) => {
    if (mountedRef.current) {
      setLoading(loadingState);
    }
  }, []);

  const setErrorSafely = useCallback((errorState) => {
    if (mountedRef.current) {
      setError(errorState);
    }
  }, []);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchData = useCallback(async (...args) => {
    const key = getCacheKey(args);
    
    // Check cache first
    if (cache && cacheRef.current.has(key)) {
      const cachedData = cacheRef.current.get(key);
      setDataSafely(cachedData);
      return cachedData;
    }

    try {
      setLoadingSafely(true);
      setErrorSafely(null);
      setRetrying(false);
      retryCountRef.current = 0;

      const result = await apiFunction(...args);

      if (result.error) {
        throw new Error(result.error);
      }

      let responseData = result.data;

      // Handle pagination
      if (pagination && responseData) {
        if (page === 1) {
          setDataSafely(responseData.items || responseData);
        } else {
          setDataSafely(prev => [...(prev || []), ...(responseData.items || responseData)]);
        }
        
        setHasMore(responseData.hasMore || false);
        setTotalCount(responseData.totalCount || 0);
      } else {
        setDataSafely(responseData);
      }

      // Cache the result
      if (cache) {
        cacheRef.current.set(key, responseData);
      }

      return responseData;
    } catch (err) {
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setRetrying(true);
        
        await delay(retryDelay * retryCountRef.current);
        
        if (mountedRef.current) {
          return fetchData(...args);
        }
      } else {
        setErrorSafely(err.message || 'An error occurred');
        setDataSafely(initialData);
      }
    } finally {
      setLoadingSafely(false);
      setRetrying(false);
    }
  }, [
    apiFunction,
    cache,
    getCacheKey,
    retryCount,
    retryDelay,
    initialData,
    pagination,
    page,
    setDataSafely,
    setLoadingSafely,
    setErrorSafely,
  ]);

  const refetch = useCallback((...args) => {
    return fetchData(...args);
  }, [fetchData]);

  const loadMore = useCallback(() => {
    if (pagination && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [pagination, hasMore, loading]);

  const reset = useCallback(() => {
    setDataSafely(initialData);
    setErrorSafely(null);
    setLoadingSafely(false);
    setRetrying(false);
    setPage(1);
    setHasMore(true);
    setTotalCount(0);
    retryCountRef.current = 0;
  }, [initialData, setDataSafely, setErrorSafely, setLoadingSafely]);

  const clearCache = useCallback((key) => {
    if (key) {
      cacheRef.current.delete(key);
    } else {
      cacheRef.current.clear();
    }
  }, []);

  // Fetch data when dependencies change
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, ...dependencies]);

  // Fetch more data when page changes (for pagination)
  useEffect(() => {
    if (pagination && page > 1) {
      fetchData();
    }
  }, [page, pagination, fetchData]);

  return {
    // Data state
    data,
    loading,
    error,
    retrying,
    
    // Pagination state
    page,
    hasMore,
    totalCount,
    
    // Methods
    refetch,
    loadMore,
    reset,
    clearCache,
    
    // Derived state
    isEmpty: !loading && !data,
    hasData: Boolean(data),
    isRetrying: retrying,
  };
};

// Helper hook for mutations (POST, PUT, DELETE)
export const useMutation = (mutationFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    onSettled,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mutationFunction(...args);

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result.data);
      
      if (onSuccess) {
        onSuccess(result.data);
      }

      return result.data;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
      
      if (onSettled) {
        onSettled();
      }
    }
  }, [mutationFunction, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    loading,
    error,
    data,
    reset,
    isLoading: loading,
    isError: Boolean(error),
    isSuccess: Boolean(data) && !error,
  };
};

export default useApi;