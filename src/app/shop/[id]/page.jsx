"use client";

// react import
import React, { useContext, useEffect, useState } from "react";

import { OrderTable, ProductTable } from "@/components";
import { ShopContext } from "@/context";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

function ShopPage() {
  const [activeTab, setActiveTab] = useState("products");

  const { shop, shops, setShop } = useContext(ShopContext);

  const router = useRouter();
  const path = usePathname();
  const query = useSearchParams();
  const params = useParams();

  useEffect(() => {
    if (!shop) {
      const current_shop = shops.find(
        (shop) => shop?.id === parseInt(params?.id)
      );
      setShop(current_shop);
    }
  }, [shop, params, shops]);

  useEffect(() => {
    const tab = query.get("list");
    if (tab) {
      setActiveTab(tab);
    }
  }, [query]);

  function handleSetActive(tab) {
    setActiveTab(tab);
    router.push(`${path}?list=${tab}`);
  }

  return (
    <div>
      <div className="flex gap-2 items-center">
        <h2 className="text-xl font-bold text-black/[0.84] capitalize flex items-center gap-2">
          {shop?.shop_name}{" "}
        </h2>
      </div>

      <div className="flex gap-2 items-center mt-3">
        <button
          onClick={() => handleSetActive("products")}
          className={`px-4 py-1  border border-primary rounded ${
            activeTab === "products"
              ? "bg-primary text-white"
              : "bg-white text-primary"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => handleSetActive("orders")}
          className={`px-4 py-1  border border-primary rounded ${
            activeTab === "orders"
              ? "bg-primary text-white"
              : "bg-white text-primary"
          }`}
        >
          Orders
        </button>
      </div>
      {activeTab === "products" && <ProductTable />}
      {activeTab === "orders" && <OrderTable />}
    </div>
  );
}

export default ShopPage;
