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

  let options = {
    page: products.length === 0 ? 1 : page,
    per_page: perPage,
    category: category,
    search: search,
    order: "asc",
    orderby: "menu_order",
    sku: barcode || "",
    featured: featured,
  };
  let endpoint = "products";

  const fetchProducts = () => {
    if (shop?.platform === "shopify") {
      // setLoading(true);

      // shopify_api(shop)
      //   .get({
      //     path: "products",
      //   })
      //   .then((res) => {
      //     console.log(res);
      //   });

      const url = `https://${shop?.domain}/admin/api/2022-04/products.json`;

      // Define the base part of the URL that you want to remove
      const baseToRemove = "https://";

      // Define the API path to add
      const apiPath = "admin/api/2022-04/products.json";

      // Remove the base part and add the API path
      const apiUrl = shop?.domain?.replaceAll(baseToRemove, "") + apiPath;

      fetch(apiUrl, {
        headers: {
          "X-Shopify-Access-Token": "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",
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {});
    } else {
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
