import { woo_api } from "@/config";
import { useEffect, useState } from "react";

const useCurrency = (shop) => {
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCurrency = () => {
    if (shop) {
      if (shop?.platform === "shopify") {
      } else {
        woo_api(shop)
          .get("data/currencies/current")
          .then((response) => {
            setCurrency(response.data);
            setLoading(false);
          });
      }
    }
  };

  useEffect(() => {
    fetchCurrency();
  }, [shop]);

  const refetch = () => {
    fetchCurrency();
  };

  return { currency, loading, refetch };
};

export default useCurrency;
