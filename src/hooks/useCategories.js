import { woo_api } from "@/config";
import { useState, useEffect } from "react";

const useCategories = (shop, parent = 0) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = () => {
    if (shop) {
      if (shop?.platform !== "shopify") {
        setLoading(true);
        woo_api(shop)
          .get("products/categories", { per_page: 100, parent })
          .then((res) => {
            setLoading(false);

            if (res.status === 200) {
              setCategories(res?.data);
            }
          });
      }
    }
  };

  const refetch = () => {
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, [shop, parent]);

  return { categories, loading, refetch };
};

export default useCategories;
