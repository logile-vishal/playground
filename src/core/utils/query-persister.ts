// Simple localStorage utility for React Query persistence

interface CacheConfig {
  key?: string;
  expiryKey?: string;
  maxAge?: number; // in milliseconds
}

const DEFAULT_CONFIG = {
  key: "app-user-cache",
  expiryKey: "app-user-cache-expiry",
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
};

export const queryPersister = (config: CacheConfig = {}) => {
  const CACHE_KEY = config.key ?? DEFAULT_CONFIG.key;
  const CACHE_EXPIRY_KEY = config.expiryKey ?? DEFAULT_CONFIG.expiryKey;
  const CACHE_MAX_AGE = config.maxAge ?? DEFAULT_CONFIG.maxAge;

  const saveToCache = (data: unknown) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(
        CACHE_EXPIRY_KEY,
        String(Date.now() + CACHE_MAX_AGE),
      );
    } catch (error) {
      console.error("Failed to save to cache:", error);
    }
  };

  const getFromCache = <T>(): T | null => {
    try {
      const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      if (expiry && Date.now() > Number(expiry)) {
        // Cache expired
        clearCache();
        return null;
      }

      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Failed to get from cache:", error);
      return null;
    }
  };

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
  };

  return {
    saveToCache,
    getFromCache,
    clearCache,
  };
};
