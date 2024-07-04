import { woo_api } from "@/config";
import { useState, useEffect } from "react";

const useAttributesTerms = (shop, id = null) => {
  const [attributesTerms, setAttributesTerms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttributesTerms = () => {
    if (shop && id) {
      if (shop?.platform !== "shopify") {
        setLoading(true);
        woo_api(shop)
          .get(`products/attributes/${id}/terms`)
          .then((res) => {
            setLoading(false);

            if (res.status === 200) {
              setAttributesTerms(res?.data);
            }
          });
      }
    }
  };

  const refetch = () => {
    fetchAttributesTerms();
  };

  useEffect(() => {
    fetchAttributesTerms();
  }, [shop, id]);

  return { attributesTerms, loading, refetch };
};

export default useAttributesTerms;
