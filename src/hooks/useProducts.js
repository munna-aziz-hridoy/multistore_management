import { woo_api } from "@/config";
import { useState, useEffect } from "react";

const useProducts = (
  shop,
  search = "",
  barcode = "",
  category = "",
  featured = null,
  stock_status = ""
) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total_page, setTotal_page] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const fetchProducts = () => {
    if (shop?.platform === "shopify") {
      const shopName = shop?.domain?.replaceAll("https://", "");
      const api_key = shop?.ck;
      const api_secret = shop?.cs;
      const accessToken = "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";

      const url = `https://${shopName}/admin/api/2022-04/products.json`;

      setLoading(true);

      fetch(url, {
        headers: {
          Authorization: `Basic ${api_key}:${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          setProducts(data);
          setTotal_page(1);
        });
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

      if (stock_status) {
        options.stock_status = stock_status;
      }

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
  }, [page, featured, category, shop, perPage, stock_status]);

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
