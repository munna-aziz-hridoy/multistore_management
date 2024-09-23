import { woo_api } from "@/config";
import { useEffect, useState } from "react";

const useAttributes = (shop, isVariations) => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttributes = () => {
    if (shop && isVariations) {
      if (shop?.platform === "shopify") {
      } else {
        woo_api(shop)
          .get("products/attributes")
          .then((response) => {
            setAttributes(response.data);
            setLoading(false);
          });
      }
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, [shop, isVariations]);

  const refetch = () => {
    fetchAttributes();
  };

  return { attributes, loading, refetch };
};

export default useAttributes;
