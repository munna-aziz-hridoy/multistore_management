import React from "react";
import { BsX } from "react-icons/bs";
import { CgTrash } from "react-icons/cg";
import { IoIosCheckmark } from "react-icons/io";
import { RiBallPenLine } from "react-icons/ri";

function Row({ order, index, columns }) {
  return (
    <tr>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {index + 1}
      </td>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {order?.order_key}
      </td>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {order?.line_items?.reduce((a, b) => a + b.quantity, 0)}
      </td>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {order?.total}
      </td>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {order?.date_created?.split("T")[0]}
      </td>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {order?.billing?.first_name + " " + order?.billing?.last_name}
      </td>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {order?.shipping?.first_name + " " + order?.shipping?.last_name}
      </td>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {order?.payment_method_title}
      </td>
      <td
        align="center"
        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
      >
        {order?.status}
      </td>
      <td align="center" className="border-[1.5px] border-[#f2f2f2] px-3 py-1">
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => {}} className="text-black/[0.54]">
            <RiBallPenLine />
          </button>

          {true ? (
            <button
              //   onClick={() => {
              //     setIs_update(false);
              //     setCurrentProduct({
              //       price: `${product?.price}`,
              //       regular_price: `${product?.regular_price}`,
              //       sale_price: `${product?.sale_price}`,
              //       stock_status: product?.stock_status,
              //       featured: product?.featured,
              //       manage_stock: product?.manage_stock,
              //       stock_quantity: product?.stock_quantity,
              //       name: product?.name,
              //       sku: product?.sku,
              //       meta_data: product?.meta_data,
              //     });
              //     setEditedProducts((prev) =>
              //       prev?.filter((item) => item?.id !== product?.id)
              //     );
              //   }}
              className="bg-red-500 w-6 h-6 rounded-full text-white"
            >
              <BsX />
            </button>
          ) : (
            <button onClick={() => {}} className="text-red-500">
              <CgTrash />
            </button>
          )}

          <button
            // disabled={!is_update}
            // onClick={handleUpdateProduct}
            className={` w-6 h-6 rounded-full text-white ${
              true ? "bg-[#25AF55]" : "bg-gray-500"
            }`}
          >
            <IoIosCheckmark />
          </button>
        </div>
      </td>
    </tr>
  );
}

function CustomOrderTable({ columns, orders }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F7F7F7]">
            {columns?.map((col, i) => (
              <th
                key={i}
                className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]"
                style={{
                  width: col.width,
                }}
              >
                {col.Header}
              </th>
            ))}

            <th
              className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]"
              style={{
                width: 150,
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order, i) => (
            <Row key={i} order={order} index={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomOrderTable;
