import { woo_api } from "@/config";
import { useEffect, useState } from "react";

// Create an in-memory cache for currency data.
const currencyCache = new Map();

const useCurrency = (shop) => {
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCurrency = () => {
    if (!shop) return;

    // Use the shop's id as the cache key.
    const cacheKey = shop.id;

    // Check if currency data is already cached.
    const cachedCurrency = currencyCache.get(cacheKey);
    if (cachedCurrency) {
      setCurrency(cachedCurrency);
      return;
    }

    // Only fetch data if the platform is not Shopify.
    if (shop.platform !== "shopify") {
      setLoading(true);
      woo_api(shop)
        .get("data/currencies/current")
        .then((response) => {
          setCurrency(response.data);
          // Cache the retrieved currency data.
          currencyCache.set(cacheKey, response.data);
        })
        .catch(() => {
          setCurrency(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchCurrency();
  }, [shop]);

  const refetch = () => {
    if (shop) {
      // Invalidate cache for this shop before refetching.
      currencyCache.delete(shop.id);
    }
    fetchCurrency();
  };

  return { currency, loading, refetch };
};

export default useCurrency;
