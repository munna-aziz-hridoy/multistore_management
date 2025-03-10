import { woo_api } from "@/config";
import { useState, useEffect } from "react";

const categoriesCache = new Map();

const useCategories = (shop, parent = 0) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const cacheKey = shop ? `${shop.id}_${parent}` : null;

  const fetchCategories = () => {
    if (shop && cacheKey) {
      // Check if we have cached data
      const cachedData = categoriesCache.get(cacheKey);
      if (cachedData) {
        setCategories(cachedData);
        return;
      }

      if (shop?.platform !== "shopify") {
        setLoading(true);
        woo_api(shop)
          .get("products/categories", { per_page: 100, parent })
          .then((res) => {
            setLoading(false);
            if (res.status === 200) {
              setCategories(res.data);
              // Save the fetched data to cache
              categoriesCache.set(cacheKey, res.data);
            }
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }
  };

  const refetch = () => {
    // Invalidate cache for the current key before refetching
    if (cacheKey) {
      categoriesCache.delete(cacheKey);
    }
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, [shop, parent]);

  return { categories, loading, refetch };
};

export default useCategories;
