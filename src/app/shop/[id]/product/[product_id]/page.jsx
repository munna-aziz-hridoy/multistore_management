"use client";

import React from "react";
import { ProductChange } from "@/components";
import { useParams } from "next/navigation";

function ProductDetails() {
  const params = useParams();

  return (
    <div>
      <ProductChange update id={params?.product_id} />
    </div>
  );
}

export default ProductDetails;
