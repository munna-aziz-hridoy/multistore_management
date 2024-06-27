"use client";

import { woo_api } from "@/config";
import { ShopContext } from "@/context";
// react import
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// icon import
import { BsX } from "react-icons/bs";
import { CgTrash } from "react-icons/cg";
import { IoIosCheckmark } from "react-icons/io";
import { RiBallPenLine } from "react-icons/ri";
import { Loader } from "..";
import { useProductVariations } from "@/hooks";

function Row({
  index,
  variation,
  id,
  editedVariant,
  setEditedVariant,
  refetch,
  pi,
  modal,
}) {
  // state

  const [currentVariant, setCurrentVariant] = useState(null);
  const [is_update, setIs_update] = useState(false);
  const [updating, setUpdating] = useState(false);

  //   context

  const { shop } = useContext(ShopContext);

  //   effect

  useEffect(() => {
    if (is_update) {
      setEditedVariant &&
        setEditedVariant((prev) => {
          const exists = prev?.find((item) => item?.id === variation?.id);

          if (exists) {
            const rest = prev?.filter((item) => item?.id !== variation?.id);
            return [...rest, { id: variation?.id, ...currentVariant }];
          } else {
            return [...prev, { id: variation?.id, ...currentVariant }];
          }
        });
    }
  }, [is_update, currentVariant]);

  useEffect(() => {
    if (editedVariant && editedVariant?.length === 0) {
      setIs_update(false);
      setCurrentVariant({
        regular_price: `${variation?.regular_price}`,
        sale_price: `${variation?.sale_price}`,
        stock_status: `${variation?.stock_status}`,
        manage_stock: variation?.manage_stock,
        stock_quantity: variation?.stock_quantity,
        on_sale: variation?.on_sale,
      });
    }
  }, [editedVariant]);

  useEffect(() => {
    setCurrentVariant({
      regular_price: `${variation?.regular_price}`,
      sale_price: `${variation?.sale_price}`,
      stock_status: `${variation?.stock_status}`,
      manage_stock: variation?.manage_stock,
      stock_quantity: variation?.stock_quantity,
      on_sale: variation?.on_sale,
    });
  }, [variation]);

  //   handler

  const handleUpdateVariant = () => {
    if (currentVariant.manage_stock && !currentVariant.stock_quantity)
      return toast.error("Please enter quantity");

    setUpdating(true);
    woo_api(shop)
      .put(`products/${id}/variations/${variation?.id}`, currentVariant)
      .then((response) => {
        setUpdating(false);

        if (response.status === 200) {
          toast.success("Variation updated successfully");
          setIs_update(false);
          setEditedVariant((prev) =>
            prev?.filter((item) => item?.id !== variation?.id)
          );
          refetch();
          setCurrentVariant({
            regular_price: `${response?.data?.regular_price}`,
            sale_price: `${response?.data?.sale_price}`,
            stock_status: `${response?.data?.stock_status}`,
            manage_stock: response?.data?.manage_stock,
            stock_quantity: response?.data?.stock_quantity,
            on_sale: response?.data?.on_sale,
          });
        } else {
          setIs_update(false);
          setCurrentVariant({
            regular_price: `${variation?.regular_price}`,
            sale_price: `${variation?.sale_price}`,
            stock_status: `${variation?.stock_status}`,
            manage_stock: variation?.manage_stock,
            stock_quantity: variation?.stock_quantity,
            on_sale: variation?.on_sale,
          });
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        setUpdating(false);
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete?");

    if (confirm) {
      setUpdating(true);
      woo_api(shop)
        .delete(`products/${id}/variations/${variation?.id}`)
        .then((response) => {
          setUpdating(false);
          if (response.status === 200) {
            toast.success("Variation deleted successfully");
            refetch();
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          setUpdating(false);
          toast.error(err?.response?.data?.message || "Something went wrong");
        });
    }
  };

  return (
    <tr className="bg-white">
      {updating ? (
        <td colSpan={10} className="text-center">
          <div className="flex justify-center items-center py-3">
            <Loader />
          </div>
        </td>
      ) : (
        <>
          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
          >
            {pi + 1}.{index + 1}
          </td>
          <td align="center" className="border-[1.5px] border-[#f2f2f2]">
            <img
              className="w-[60px] h-[60px]"
              src={variation?.image?.src}
              alt="image"
            />
          </td>
          <td align="center" className="border-[1.5px] border-[#f2f2f2]">
            {variation?.attributes?.map((att, i) => (
              <p
                key={i}
                className="text-sm font-semibold text-black/[0.54] capitalize"
              >
                {att?.name}: {att?.option}
              </p>
            ))}
          </td>
          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
          >
            <div className="w-full h-[40px] bg-[#f2f2f2] rounded px-2 flex items-center">
              <span className="inline-block w-2">$</span>
              <input
                value={currentVariant?.regular_price}
                onChange={(e) => {
                  setIs_update(true);
                  setCurrentVariant((prev) => ({
                    ...prev,
                    regular_price: e.target.value,
                  }));
                }}
                type="text"
                className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent"
              />
            </div>
          </td>
          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
          >
            <div className="w-full h-[40px] bg-[#f2f2f2] rounded px-2 flex items-center">
              <span className="inline-block w-2">$</span>
              <input
                value={currentVariant?.sale_price}
                onChange={(e) => {
                  setIs_update(true);
                  setCurrentVariant((prev) => ({
                    ...prev,
                    sale_price: e.target.value,
                  }));
                }}
                type="text"
                className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent"
              />
            </div>
          </td>
          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
          >
            <select
              value={currentVariant?.stock_status}
              onChange={(e) => {
                setIs_update(true);
                setCurrentVariant((prev) => ({
                  ...prev,
                  stock_status: e.target.value,
                }));
              }}
              disabled={currentVariant?.manage_stock}
              className={`${
                currentVariant?.stock_status === "instock"
                  ? "text-[#25af55] bg-[#25AF55]/10 outline-[#25AF55]/10"
                  : "text-[#f00] bg-[#f00]/10 outline-[#f00]/10"
              }   font-medium rounded text-sm px-4 py-2 outline  cursor-pointer`}
            >
              <option value={"instock"}>In Stock</option>
              <option value={"outofstock"}>Out of Stock</option>
            </select>
          </td>
          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={currentVariant?.manage_stock}
                onChange={(e) => {
                  setIs_update(true);
                  setCurrentVariant((prev) => ({
                    ...prev,
                    manage_stock: e.target.checked,
                  }));
                }}
                type="checkbox"
                value=""
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </td>
          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
          >
            <div className="w-full h-[40px] bg-[#f2f2f2] rounded px-2 flex items-center">
              <input
                value={currentVariant?.stock_quantity}
                onChange={(e) => {
                  setIs_update(true);
                  setCurrentVariant((prev) => ({
                    ...prev,
                    stock_quantity: e.target.value,
                  }));
                }}
                type="text"
                className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent"
              />
            </div>
          </td>
          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={currentVariant?.on_sale}
                onChange={(e) => {
                  setIs_update(true);
                  setCurrentVariant((prev) => ({
                    ...prev,
                    on_sale: e.target.checked,
                  }));
                }}
                type="checkbox"
                value=""
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </td>

          <td
            align="center"
            className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
          >
            <div className="flex items-center justify-center gap-4">
              <button className="text-black/[0.54]">
                <RiBallPenLine />
              </button>

              {is_update ? (
                <button
                  onClick={() => {
                    setIs_update(false);
                    setCurrentVariant({
                      regular_price: `${variation?.regular_price}`,
                      sale_price: `${variation?.sale_price}`,
                      stock_status: `${variation?.stock_status}`,
                      manage_stock: variation?.manage_stock,
                      stock_quantity: variation?.stock_quantity,
                      on_sale: variation?.on_sale,
                    });
                    setEditedVariant &&
                      setEditedVariant((prev) => {
                        return prev?.filter(
                          (item) => item?.id !== variation?.id
                        );
                      });
                  }}
                  className="bg-red-500 w-6 h-6 rounded-full text-white"
                >
                  <BsX />
                </button>
              ) : (
                <button onClick={handleDelete} className="text-red-500">
                  <CgTrash />
                </button>
              )}

              <button
                disabled={!is_update}
                onClick={handleUpdateVariant}
                className={` w-6 h-6 rounded-full text-white ${
                  is_update ? "bg-[#25AF55]" : "bg-gray-500"
                }`}
              >
                <IoIosCheckmark />
              </button>
            </div>
          </td>
        </>
      )}
    </tr>
  );
}

function VariationTable({ id, name, pi, modal, setVariations }) {
  // state
  const [editedVariant, setEditedVariant] = useState([]);
  const [updating, setUpdating] = useState(false);

  //   context

  const { shop } = useContext(ShopContext);

  const { variations, loading, refetch } = useProductVariations(shop, id);

  const handleBatchUpdate = () => {
    let is_manage_stock_error = false;

    editedVariant?.forEach((item) => {
      if (item?.manage_stock && item?.quantity <= 0) {
        is_manage_stock_error = true;
      }
    });

    if (is_manage_stock_error) return toast.error("Please add quantity");

    woo_api(shop)
      .post(`products/${id}/variations/batch`, {
        update: editedVariant,
      })
      .then((response) => {
        setUpdating(false);

        if (response.status === 200) {
          toast.success("Variations updated successfully");
          setEditedVariant([]);
          refetch();
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        setUpdating(false);
        toast.error(err?.response?.data?.message || "Something went wrong");
      });
  };

  return (
    <div className={`shadow-xl ${modal ? "bg-primary mt-10" : ""}`}>
      <div className="flex justify-between items-center py-2 px-3">
        <div>
          <h2 className="text-lg text-white font-semibold">Variations</h2>
          <p className="text-white/[0.84] text-sm">{name}</p>
        </div>

        <button
          onClick={handleBatchUpdate}
          className="flex justify-center items-center gap-2 w-[120px] h-[37px] rounded-md border-[1.5px] bg-white/[0.08]"
        >
          <p
            className={`text-[14px] font-semibold border-white ${
              editedVariant?.length === 0 ? "text-gray-400" : "text-white"
            }`}
          >
            Update
          </p>
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#f2f2f2]">
            <th
              style={{ width: 60 }}
              className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]"
            >
              SL
            </th>
            <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]">
              Image
            </th>
            <th
              style={{
                width: 50,
              }}
              className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]"
            >
              Attribute
            </th>
            <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]">
              Regular Price
            </th>
            <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]">
              Sale Price
            </th>
            <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]">
              Stock
            </th>
            <th
              style={{
                width: 150,
              }}
              className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]"
            >
              Manage Stock
            </th>
            <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]">
              Quantity
            </th>
            <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]">
              Sale
            </th>

            <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={10}>
                <div className="flex items-center justify-center py-4">
                  <Loader loading={loading} />
                </div>
              </td>
            </tr>
          ) : (
            variations?.map((variation, i) => (
              <Row
                key={i}
                variation={variation}
                index={i}
                id={id}
                setEditedVariant={setEditedVariant}
                editedVariant={editedVariant}
                refetch={refetch}
                pi={pi}
                modal={modal}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default VariationTable;
