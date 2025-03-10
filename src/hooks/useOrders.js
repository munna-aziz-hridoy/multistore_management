import { woo_api } from "@/config";
import { useState, useEffect } from "react";

const ordersCache = new Map();

const useOrders = (shop, search = "", status = "") => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total_page, setTotal_page] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const cacheKey = shop
    ? `${shop.id}_${search}_${status}_${page}_${perPage}`
    : null;

  const fetchOrders = () => {
    if (!shop || !cacheKey) return;

    const cachedData = ordersCache.get(cacheKey);
    if (cachedData) {
      setOrders(cachedData.orders);
      setTotal_page(cachedData.total_page);
      return;
    }

    let options = {
      page: orders.length === 0 ? 1 : page,
      per_page: perPage,
    };

    let endpoint = `orders?search=${search}&status=${status}`;
    setLoading(true);
    woo_api(shop)
      ?.get(endpoint, options)
      .then((res) => {
        if (res.headers) {
          const totalPages = parseInt(res.headers["x-wp-totalpages"]);
          setTotal_page(totalPages);

          ordersCache.set(cacheKey, {
            orders: res.data,
            total_page: totalPages,
          });
        }
        setOrders(res.data);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  const refetch = () => {
    if (cacheKey) {
      ordersCache.delete(cacheKey);
    }
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [page, shop, perPage, search, status]);

  return {
    orders,
    loading,
    refetch,
    total_page,
    page,
    setPage,
    perPage,
    setPerPage,
  };
};

export default useOrders;
