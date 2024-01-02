import { shopify_api, woo_api } from "@/config";
import { useState, useEffect } from "react";

const useProducts = (
  shop,
  search = "",
  barcode = "",
  category = "",
  featured = null
) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total_page, setTotal_page] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const fetchProducts = () => {
    if (shop?.platform === "shopify") {
    } else {
      let options = {
        page: products.length === 0 ? 1 : page,
        per_page: perPage,
        category: category || "",
        search: search,
        order: "asc",
        orderby: "menu_order",
        sku: barcode || "",
        featured: featured,
      };
      let endpoint = "products";

      setLoading(true);
      woo_api(shop)
        ?.get(endpoint, options)
        .then((res) => {
          setLoading(false);

          if (res.headers) {
            setTotal_page(parseInt(res?.headers["x-wp-totalpages"]));
          }
          setProducts(res?.data);
        })
        .catch((err) => {
          setLoading(false);
          setProducts([]);
        })
        ?.finally(() => setLoading(false));
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [page, featured, category, shop, perPage]);

  return {
    products,
    loading,
    refetch,
    total_page,
    page,
    setPage,
    perPage,
    setPerPage,
  };
};

export default useProducts;
