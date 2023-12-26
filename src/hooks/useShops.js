import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase.init";

const useShops = (userId) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShop = () => {
    if (userId) {
      setLoading(true);

      const prevCredStr = localStorage.getItem("woo_shop_list");

      if (prevCredStr) {
        const prevCred = JSON.parse(prevCredStr);

        if (prevCred?.userId === userId) {
          const storedShops = prevCred?.shops?.map((item) => {
            return {
              ...item,
            };
          });

          setShops(storedShops);
          setLoading(false);
          return;
        }
      } else {
        const q = query(
          collection(firestore, "sites"),
          where("user_id", "==", userId)
        );

        getDocs(q).then((data) => {
          setLoading(false);

          const sites = data.docs.map((item) => item.data());

          const shops = sites?.map((item) => {
            return {
              ...item,

              title: item?.shop_name,
              type: "item",
              url: `/shop/${item?.id}`,
            };
          });

          setShops(shops);

          localStorage.setItem(
            "woo_shop_list",
            JSON.stringify({ userId, shops })
          );
        });
      }
    }
  };

  useEffect(() => {
    fetchShop();
  }, [userId]);

  const refetch = () => {
    fetchShop();
  };

  return { shops, loading, refetch };
};

export default useShops;
