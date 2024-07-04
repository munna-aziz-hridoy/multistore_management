import React, { useState, useEffect, Fragment, useContext } from "react";
import { BsX } from "react-icons/bs";
import { CgTrash } from "react-icons/cg";
import { IoIosCheckmark } from "react-icons/io";
import { RiBallPenLine } from "react-icons/ri";
import AddressForm from "../addressForm";
import { Loader, Modal } from "..";
import { woo_api } from "@/config";
import { ShopContext } from "@/context";
import toast from "react-hot-toast";

const redBox = ["cancelled", "falied", "trash", "refunded"];
const grayBox = ["any", "pending", "processing", "on-hold"];
const greenBox = ["completed"];

function Row({
  order,
  index,
  columns,
  statusList,
  currency,
  updatedItems,
  setUpdatedItems,
  setEditedOrders,
  page,
  perPage,
}) {
  const columnSet = new Set(columns.map((col) => col.Header));

  const [currentOrder, setCurrentOrder] = useState({
    billing: {
      first_name: "",
      last_name: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      email: "",
      phone: "",
      company: "",
    },
    shipping: {
      first_name: "",
      last_name: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      email: "",
      phone: "",
      company: "",
    },
    total: "",
    status: "",
    discount_total: "",
  });

  const [is_update, setIs_update] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [addressModalname, setAddressModalname] = useState("");
  const { shop } = useContext(ShopContext);

  useEffect(() => {
    if (order) {
      setCurrentOrder({
        billing: { ...currentOrder.billing, ...order?.billing },
        shipping: { ...currentOrder.shipping, ...order?.shipping },
        total: order?.total,
        status: order?.status,
        discount_total: order?.discount_total,
      });
    }
  }, [order]);

  useEffect(() => {
    if (is_update) {
      setEditedOrders &&
        setEditedOrders((prev) => {
          const exists = prev?.find((item) => item?.id === order?.id);

          if (exists) {
            const rest = prev?.filter((item) => item?.id !== order?.id);
            return [...rest, { id: order?.id, ...currentOrder }];
          } else {
            return [...prev, { id: order?.id, ...currentOrder }];
          }
        });
    }
  }, [is_update, currentOrder]);

  const closeModal = () => {
    setOpenModal(false);
  };

  const handleUpdateOrder = () => {
    setUpdating(true);
    woo_api(shop)
      .put(`orders/${order?.id}`, currentOrder)
      .then((response) => {
        setUpdating(false);
        if (response.status === 200) {
          setIs_update(false);
          toast.success("Order updated successfully");
          setCurrentOrder({
            billing: { ...currentOrder.billing, ...response?.data?.billing },
            shipping: { ...currentOrder.shipping, ...response?.data?.shipping },
            total: response?.data?.total,
            status: response?.data?.status,
            discount_total: response?.data?.discount_total,
          });
        } else {
          toast.error("Something went wrong");
          setIs_update(false);
          setCurrentOrder({
            billing: { ...currentOrder.billing, ...order?.billing },
            shipping: { ...currentOrder.shipping, ...order?.shipping },
            total: order?.total,
            status: order?.status,
            discount_total: order?.discount_total,
          });
        }
      })
      .catch((err) => {
        setUpdating(false);
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  const handleDeleteOrder = () => {
    const is_confirm = window.confirm(
      "Are you sure, you want to delete the order?"
    );

    if (is_confirm) {
      woo_api(shop)
        .delete(`orders/${order?.id}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Order deleted successfully");
            // setUpdatedItems((prev) => prev?.filter((item) => item !== order?.id));
          } else {
            toast.error("Something went wrong");
          }
        });
    }
  };

  return (
    <Fragment>
      {updating ? (
        <tr>
          <td colSpan={13}>
            <div className="px-4 py-2 flex justify-center items-center">
              <Loader />
            </div>
          </td>
        </tr>
      ) : (
        <tr
          className={`${
            updatedItems?.find((item) => item === product?.id)
              ? "bg-primary/[0.15]"
              : ""
          } `}
        >
          {columnSet.has("SL") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
            >
              <p>{page * perPage - perPage + (index + 1)}</p>
            </td>
          )}
          {columnSet.has("Order number") && (
            <td className="border-[1.5px] border-[#f2f2f2] ">
              <p className="text-black/[0.54] font-semibold">
                {order?.id} {order?.billing?.first_name}{" "}
                {order?.billing?.last_name}
              </p>
            </td>
          )}

          {columnSet.has("Total Items") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
            >
              {order?.line_items?.reduce((a, b) => a + b.quantity, 0)}
            </td>
          )}

          {columnSet.has("Total Amount") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
            >
              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center">
                <span
                  className="inline-block w-2"
                  dangerouslySetInnerHTML={{ __html: currency?.symbol }}
                />
                <input
                  type="text"
                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                  value={currentOrder?.total}
                  onChange={(e) => {
                    setCurrentOrder((prev) => ({
                      ...prev,
                      total: e.target.value,
                    }));
                  }}
                />
              </div>
            </td>
          )}
          {columnSet.has("Discount") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
            >
              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center">
                <span
                  className="inline-block w-2"
                  dangerouslySetInnerHTML={{ __html: currency?.symbol }}
                />
                <input
                  type="text"
                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                  value={currentOrder?.discount_total}
                  onChange={(e) => {
                    setCurrentOrder((prev) => ({
                      ...prev,
                      discount_total: e.target.value,
                    }));
                  }}
                />
              </div>
            </td>
          )}
          {columnSet.has("Date") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
            >
              {order?.date_created?.split("T")[0]}
            </td>
          )}
          {columnSet.has("Billing Name") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
            >
              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center">
                <input
                  type="text"
                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                  defaultValue={`${
                    currentOrder.billing.first_name
                      ? currentOrder.billing.first_name
                      : ""
                  } ${
                    currentOrder.billing.last_name
                      ? currentOrder.billing.last_name
                      : ""
                  }`}
                  onChange={(e) => {
                    setCurrentOrder((prev) => ({
                      ...prev,
                      billing: {
                        ...prev.billing,
                        first_name: e.target.value.split(" ")[0],
                        last_name: e.target.value.split(" ")[1],
                      },
                    }));
                  }}
                />
              </div>
            </td>
          )}
          {columnSet.has("Billing Address") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
            >
              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center">
                <input
                  type="text"
                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                  disabled
                  value={`${
                    currentOrder?.billing?.address_1
                      ? currentOrder?.billing?.address_1
                      : ""
                  } ${
                    currentOrder?.billing?.address_2
                      ? currentOrder?.billing?.address_2
                      : ""
                  } ${
                    currentOrder?.billing?.city
                      ? currentOrder?.billing?.city
                      : ""
                  } ${
                    currentOrder?.billing?.postcode
                      ? currentOrder?.billing?.postcode
                      : ""
                  } ${
                    currentOrder?.billing?.country
                      ? currentOrder?.billing?.country
                      : ""
                  }`}
                />
                <RiBallPenLine
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenModal(true);
                    setAddressModalname("billing");
                  }}
                />
              </div>
            </td>
          )}
          {columnSet.has("Shipping Name") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
            >
              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center">
                <input
                  type="text"
                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                  defaultValue={`${
                    currentOrder.shipping.first_name
                      ? currentOrder.shipping.first_name
                      : ""
                  } ${
                    currentOrder.shipping.last_name
                      ? currentOrder.shipping.last_name
                      : ""
                  }`}
                  onChange={(e) => {
                    setCurrentOrder((prev) => ({
                      ...prev,
                      shipping: {
                        ...prev.shipping,
                        first_name: e.target.value.split(" ")[0],
                        last_name: e.target.value.split(" ")[1],
                      },
                    }));
                  }}
                />
              </div>
            </td>
          )}
          {columnSet.has("Shipping Address") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
            >
              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center">
                <input
                  type="text"
                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                  disabled
                  value={`${
                    currentOrder?.shipping?.address_1
                      ? currentOrder?.shipping?.address_1
                      : ""
                  } ${
                    currentOrder?.shipping?.address_2
                      ? currentOrder?.shipping?.address_2
                      : ""
                  } ${
                    currentOrder?.shipping?.city
                      ? currentOrder?.shipping?.city
                      : ""
                  } ${
                    currentOrder?.shipping?.postcode
                      ? currentOrder?.shipping?.postcode
                      : ""
                  } ${
                    currentOrder?.shipping?.country
                      ? currentOrder?.shipping?.country
                      : ""
                  }`}
                />
                <RiBallPenLine
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenModal(true);
                    setAddressModalname("shipping");
                  }}
                />
              </div>
            </td>
          )}
          {columnSet.has("Payment Method") && (
            <td align="center" className="border-[1.5px] border-[#f2f2f2] ">
              <p className="text-black/[0.54] px-3 text-sm">
                {order?.payment_method_title}
              </p>
            </td>
          )}

          {columnSet.has("Status") && (
            <td
              align="center"
              className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
            >
              <select
                value={currentOrder?.status}
                onChange={(e) => {
                  setIs_update(true);
                  setCurrentOrder((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }));
                }}
                className={`${
                  // currentOrder?.status === "pending"
                  greenBox?.includes(currentOrder?.status)
                    ? "text-[#25af55] bg-[#25AF55]/20  outline-none"
                    : redBox?.includes(currentOrder?.status)
                    ? "text-[#f00]  bg-[#f00]/20  outline-none"
                    : "text-[#636363]  bg-[#636363]/20  outline-none"
                }   font-medium rounded text-sm px-4 py-2 text-[12px] outline  cursor-pointer my-1 capitalize`}
              >
                {statusList?.map((sts) => (
                  <option value={sts} className="capitalize">
                    {sts}
                  </option>
                ))}
              </select>
            </td>
          )}

          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
          >
            <div className="flex items-center justify-center gap-4">
              {/* <button onClick={() => {}} className="text-black/[0.54]">
              <RiBallPenLine />
            </button> */}

              {is_update ? (
                <button
                  onClick={() => {
                    setIs_update(false);
                    setCurrentOrder({
                      billing: { ...currentOrder.billing, ...order?.billing },
                      shipping: {
                        ...currentOrder.shipping,
                        ...order?.shipping,
                      },
                      total: order?.total,
                      status: order?.status,
                      discount_total: order?.discount_total,
                    });
                  }}
                  className="bg-red-500 w-6 h-6 rounded-full text-white flex justify-center items-center"
                >
                  <BsX fontSize={20} />
                </button>
              ) : (
                <button
                  onClick={handleDeleteOrder}
                  className="text-red-500 flex justify-center items-center"
                >
                  <CgTrash fontSize={20} />
                </button>
              )}

              <button
                disabled={!is_update}
                onClick={handleUpdateOrder}
                className={` w-6 h-6 bg-[#25AF55] rounded-full text-white flex justify-center items-center disabled:bg-gray-500`}
              >
                <IoIosCheckmark fontSize={20} />
              </button>
            </div>
          </td>
        </tr>
      )}
      {openModal && (
        <Modal closeModal={closeModal}>
          <AddressForm
            name={addressModalname}
            setCurrentOrder={setCurrentOrder}
            prevAddress={currentOrder[addressModalname]}
            closeModal={closeModal}
          />
        </Modal>
      )}
    </Fragment>
  );
}

function CustomOrderTable({
  columns,
  orders,
  editedOrders,
  setEditedOrders,
  statusList,
  currency,
  updatedItems,
  setUpdatedItems,
  page,
  perPage,
}) {
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
                <div className="flex justify-center items-center gap-2">
                  <p className="w-full"> {col.Header}</p>

                  <textarea
                    className="resizer"
                    style={{
                      resize: "horizontal",
                      height: "10px",
                      width: "20px",
                      border: "none",
                      borderLeft: "1px solid #f2f2f2",
                      padding: "5px",
                      caretColor: "transparent",
                      caret: "ActiveBorder",
                      // opacity: 0,
                    }}
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                  ></textarea>
                </div>
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
            <Row
              key={i}
              order={order}
              index={i}
              columns={columns}
              statusList={statusList}
              currency={currency}
              updatedItems={updatedItems}
              setUpdatedItems={setUpdatedItems}
              page={page}
              perPage={perPage}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomOrderTable;
