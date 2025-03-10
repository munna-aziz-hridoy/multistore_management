import { woo_api } from "@/config";
import { useState, useEffect } from "react";

const useProductVariations = (shop, id) => {
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(false);

  let api = woo_api(shop);
  let options = {
    order: "asc",
    orderby: "menu_order",
  };
  let endpoint = `products/${id}/variations`;

  const fetchProducts = () => {
    setLoading(true);
    api
      ?.get(endpoint, options)
      .then((res) => {
        setLoading(false);

        setVariations(res?.data);
      })
      .catch((err) => {
        setLoading(false);
        setVariations([]);
      })
      ?.finally(() => setLoading(false));
  };

  const refetch = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [shop]);

  return {
    variations,
    loading,
    refetch,
  };
};

export default useProductVariations;
