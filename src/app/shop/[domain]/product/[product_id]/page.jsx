"use client";

import React, { useContext, useEffect } from "react";
import { ProductChange } from "@/components";
import { useParams } from "next/navigation";
import { ShopContext } from "@/context";

function ProductDetails() {
  const params = useParams();

  const { shop, shops, setShop } = useContext(ShopContext);

  useEffect(() => {
    if (!shop) {
      const current_shop = shops.find(
        (shop) =>
          shop?.domain?.replaceAll("https://", "")?.replaceAll(".", "_") ===
          params?.domain
      );
      setShop(current_shop);
    }
  }, [shop, params, shops]);

  return (
    <div>
      <ProductChange
        update
        id={params?.product_id}
        custom_cols={shop?.custom_cols}
      />
    </div>
  );
}

export default ProductDetails;
