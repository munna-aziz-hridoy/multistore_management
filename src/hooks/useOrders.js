import { woo_api } from "@/config";
import { useState, useEffect } from "react";

const useOrders = (shop) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total_page, setTotal_page] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const fetchOrders = () => {
    // let options = {
    //   page: orders.length === 0 ? 1 : page,
    //   per_page: perPage,
    // };
    // let endpoint = "orders";
    // setLoading(true);
    // woo_api(shop)
    //   ?.get(endpoint, options)
    //   .then((res) => {
    //     setLoading(false);
    //     if (res.headers) {
    //       setTotal_page(parseInt(res?.headers["x-wp-totalpages"]));
    //     }
    //     setOrders(res?.data);
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     setOrders([]);
    //   })
    //   ?.finally(() => setLoading(false));
  };

  const refetch = () => {
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [page, shop, perPage]);

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
