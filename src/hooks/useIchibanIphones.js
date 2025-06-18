import { useState, useEffect, useCallback } from "react";

const useIchibanIphones = () => {
  const [iphones, setIphones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    changedProducts: 0,
  });

  const url = "/api/ichiban/prices";
  const CACHE_KEY = "ichiban_iphones_data";
  const CACHE_TIMESTAMP_KEY = "ichiban_iphones_timestamp";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cachedData && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < CACHE_DURATION) {
          const parsedData = JSON.parse(cachedData);
          setIphones(parsedData.products || []);
          setStats({
            totalProducts: parsedData.totalProducts || 0,
            changedProducts: parsedData.changedProducts || 0,
          });
          setLastUpdated(new Date(timestamp));
          return true; // Cache loaded successfully
        }
      }
    } catch (error) {
      console.warn("Failed to load cached data:", error);
    }
    return false; // No valid cache found
  };

  const cacheData = (data) => {
    try {
      const timestamp = Date.now();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, timestamp.toString());
      setLastUpdated(new Date(timestamp));
    } catch (error) {
      console.warn("Failed to cache data:", error);
    }
  };

  const fetchIphones = useCallback(
    async (forceRefresh = false) => {
      // If not forcing refresh and we have cached data, don't fetch
      if (!forceRefresh && loadCachedData()) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
          setIphones(data.products || []);
          setStats({
            totalProducts: data.totalProducts || 0,
            changedProducts: data.changedProducts || 0,
          });

          // Cache the successful response
          cacheData(data);
        } else {
          throw new Error(data.error || "Failed to fetch iPhone data");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching iPhone data:", err);
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  const refetch = useCallback(() => {
    return fetchIphones(true);
  }, [fetchIphones]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    setLastUpdated(null);
  }, []);

  // Get products with price changes
  const getChangedProducts = useCallback(() => {
    return iphones.filter((phone) => phone.changed === true);
  }, [iphones]);

  // Get products by model/name
  const getProductsByModel = useCallback(
    (modelName) => {
      return iphones.filter((phone) =>
        phone.name.toLowerCase().includes(modelName.toLowerCase())
      );
    },
    [iphones]
  );

  // Check if cache is expired
  const isCacheExpired = useCallback(() => {
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!cachedTimestamp) return true;

    const timestamp = parseInt(cachedTimestamp);
    const now = Date.now();
    return now - timestamp >= CACHE_DURATION;
  }, []);

  return {
    // Data
    iphones,
    stats,
    lastUpdated,

    // States
    loading,
    error,

    // Actions
    fetchIphones,
    refetch,
    clearCache,

    // Utilities
    getChangedProducts,
    getProductsByModel,
    isCacheExpired,

    // Setters (for manual updates if needed)
    setIphones,
    setError,
  };
};

export default useIchibanIphones;
