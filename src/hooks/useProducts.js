import { woo_api } from "@/config";
import { useState, useEffect } from "react";

const productsCache = new Map();

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

  const cacheKey = shop
    ? `${shop.id}_${search}_${barcode}_${category}_${featured}_${stock_status}_${page}_${perPage}`
    : null;

  const fetchProducts = () => {
    if (!shop || !cacheKey) return;

    const cachedData = productsCache.get(cacheKey);
    if (cachedData) {
      setProducts(cachedData.products);
      setTotal_page(cachedData.total_page);
      return;
    }

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
        if (res.headers) {
          const totalPages = parseInt(res.headers["x-wp-totalpages"]);
          setTotal_page(totalPages);

          productsCache.set(cacheKey, {
            products: res.data,
            total_page: totalPages,
          });
        }
        setProducts(res.data);
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  const refetch = () => {
    if (cacheKey) {
      productsCache.delete(cacheKey);
    }
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [page, featured, category, shop, perPage, stock_status, search, barcode]);

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
