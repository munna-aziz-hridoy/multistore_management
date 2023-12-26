import { shopify_api, woo_api } from "@/config";
import { useState, useEffect } from "react";

const useProduct = (shop, id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = woo_api(shop);

  let endpoint = `products/${id}`;

  if (shop?.platform === "shopify") {
    api = shopify_api(shop);
    options = {};
    endpoint = "products";
  }

  const fetchProducts = () => {
    setLoading(true);
    api
      ?.get(endpoint)
      .then((res) => {
        setLoading(false);

        setProduct(res?.data);
      })
      .catch((err) => {
        setLoading(false);
      })
      ?.finally(() => setLoading(false));
  };

  const refetch = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [shop, id]);

  return {
    product,
    loading,
    refetch,
  };
};

export default useProduct;
