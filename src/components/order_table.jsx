"use client";

import { ShopContext } from "@/context";
import { useOrders } from "@/hooks";
import React, { useContext } from "react";
import CustomOrderTable from "./table/customOrderTable";
import { orderCols } from "@/assets/data";
import { Loader } from ".";

function OrderTable() {
  const { shop } = useContext(ShopContext);

  const {
    loading,
    orders,
    page,
    perPage,
    refetch,
    setPage,
    setPerPage,
    total_page,
  } = useOrders(shop);

  return (
    <div className="my-8">
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader />
        </div>
      ) : (
        <CustomOrderTable columns={orderCols} orders={orders} />
      )}
    </div>
  );
}

export default OrderTable;
