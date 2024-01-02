"use client";

// react import
import React, { useContext, useEffect, useState } from "react";

// icon import
import { IoMdArrowDropright } from "react-icons/io";
import { CgTrash } from "react-icons/cg";
import { RiBallPenLine } from "react-icons/ri";
import { IoIosCheckmark } from "react-icons/io";
import { BsX } from "react-icons/bs";

// context import
import { ShopContext } from "@/context";
import { woo_api } from "@/config";
import toast from "react-hot-toast";
import { Loader, ProductChangeModal, VariationTable } from "..";
import { useCurrency } from "@/hooks";

const Row = ({
  product,
  index,
  columns,
  setEditedProducts,
  updatedItems,
  setUpdatedItems,
  refetch,
  currency,
}) => {
  // context

  const { shop } = useContext(ShopContext);

  const [currentProduct, setCurrentProduct] = useState({
    price: `${product?.price}`,
    regular_price: `${product?.regular_price}`,
    sale_price: `${product?.sale_price}`,
    stock_status: product?.stock_status,
    featured: product?.featured,
    manage_stock: product?.manage_stock,
    stock_quantity: product?.stock_quantity,
    name: product?.name,
    sku: product?.sku,
  });

  const [is_update, setIs_update] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [openVariations, setOpenVariations] = useState(false);

  useEffect(() => {
    if (is_update) {
      setEditedProducts &&
        setEditedProducts((prev) => {
          const exists = prev?.find((item) => item?.id === product?.id);

          if (exists) {
            const rest = prev?.filter((item) => item?.id !== product?.id);
            return [...rest, { id: product?.id, ...currentProduct }];
          } else {
            return [...prev, { id: product?.id, ...currentProduct }];
          }
        });
    }
  }, [is_update, currentProduct]);

  function isExists(key) {
    const exists = columns?.find((item) => item?.Header === key);

    return exists ? true : false;
  }

  const handleUpdateProduct = (e) => {
    e.preventDefault();

    setUpdating(true);
    woo_api(shop)
      .put(`products/${product?.id}`, currentProduct)
      .then((response) => {
        setUpdating(false);
        if (response.status === 200) {
          setIs_update(false);
          toast.success("Product updated successfully");
          setCurrentProduct({
            price: `${response?.data?.price}`,
            regular_price: `${response?.data?.regular_price}`,
            sale_price: `${response?.data?.sale_price}`,
            stock_status: response?.data?.stock_status,
            featured: response?.data?.featured,
            manage_stock: response?.data?.manage_stock,
            stock_quantity: response?.data?.stock_quantity,
            name: response?.data?.name,
            sku: response?.data?.sku,
          });
          setUpdatedItems((prev) => [...prev, response?.data?.id]);
        } else {
          toast.error("Something went wrong");
          setIs_update(false);
          setCurrentProduct({
            price: `${product?.price}`,
            regular_price: `${product?.regular_price}`,
            sale_price: `${product?.sale_price}`,
            stock_status: product?.stock_status,
            featured: product?.featured,
            manage_stock: product?.manage_stock,
            stock_quantity: product?.stock_quantity,
            name: product?.name,
            sku: product?.sku,
          });
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
        .delete(`products/${product?.id}`)
        .then((response) => {
          setUpdating(false);
          if (response.status === 200) {
            toast.success("Product deleted successfully");
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

  const variationWarning = () => {
    if (product?.variations?.length > 0) {
      toast.error(
        "This is a variation product, you need to chanage the value from variation to change the field"
      );
    }
  };

  const openModal = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = "hidden";
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = "";
    window.scrollTo(0, scrollPosition);
    setIsModalOpen(false);
  };

  return (
    <>
      <tr
        className={`${
          updatedItems?.find((item) => item === product?.id)
            ? "bg-primary/[0.15]"
            : ""
        } ${openVariations && "shadow-xl"}`}
      >
        {updating ? (
          <td colSpan={columns?.length} className="text-center">
            <div className="flex justify-center items-center py-3">
              <Loader />
            </div>
          </td>
        ) : (
          <>
            {isExists("SL") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] text-black/[0.54]"
              >
                <div className="flex justify-start items-center gap-1 cursor-pointer px-2">
                  <p>{index + 1}</p>
                  {product?.variations?.length > 0 && (
                    <IoMdArrowDropright
                      className={`${
                        openVariations ? "rotate-90" : "rotate-0"
                      } duration-300`}
                      onClick={() => setOpenVariations((prev) => !prev)}
                      fontSize={20}
                    />
                  )}
                </div>
              </td>
            )}
            {isExists("Image") && (
              <td align="center" className="border-[1.5px] border-[#f2f2f2]">
                <img
                  className="w-[60px] h-[60px]"
                  src={product?.images[0]?.src}
                  alt="image"
                />
              </td>
            )}
            {isExists("Name & JAN Code") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <div className="flex flex-col gap-[2px] justify-start items-start">
                  <p className="text-[14px] text-left font-semibold text-black/[0.84]">
                    {currentProduct?.name}
                  </p>
                  <p className="text-[10px] font-normal text-black/[0.54]">
                    SKU: {currentProduct?.sku || "N/A"}
                  </p>
                </div>
              </td>
            )}
            {isExists("Price") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <div
                  onClick={variationWarning}
                  className="w-full h-[40px] bg-[#f7f7f7] rounded px-2 flex items-center"
                >
                  <span
                    className="inline-block w-2"
                    dangerouslySetInnerHTML={{ __html: currency?.symbol }}
                  />
                  <input
                    type="text"
                    className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54]"
                    value={currentProduct?.price}
                    onChange={(e) => {
                      setIs_update(true);
                      setCurrentProduct((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }));
                    }}
                    disabled={product?.variations?.length > 0 ? true : false}
                  />
                </div>
              </td>
            )}
            {isExists("Regular Price") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <div
                  onClick={variationWarning}
                  className="w-full h-[40px] bg-[#f7f7f7] rounded px-2 flex items-center"
                >
                  <span
                    className="inline-block w-2"
                    dangerouslySetInnerHTML={{ __html: currency?.symbol }}
                  />
                  <input
                    type="text"
                    className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54]"
                    value={currentProduct?.regular_price}
                    onChange={(e) => {
                      setIs_update(true);
                      setCurrentProduct((prev) => ({
                        ...prev,
                        regular_price: e.target.value,
                      }));
                    }}
                    disabled={product?.variations?.length > 0 ? true : false}
                  />
                </div>
              </td>
            )}
            {isExists("Stock") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <div onClick={variationWarning}>
                  <select
                    value={currentProduct?.stock_status}
                    defaultValue={currentProduct?.stock_status}
                    onChange={(e) => {
                      setIs_update(true);
                      setCurrentProduct((prev) => ({
                        ...prev,
                        stock_status: e.target.value,
                      }));
                    }}
                    disabled={
                      currentProduct?.manage_stock ||
                      product?.variations?.length > 0
                    }
                    className={`${
                      currentProduct?.stock_status === "instock"
                        ? "text-[#25af55] disabled:text-[#25af55]/70 bg-[#25AF55]/20 disabled:bg-[#25AF55]/5 outline-[#25AF55]/20 disabled:outline-[#25AF55]/5"
                        : "text-[#f00] disabled:text-[#f00]/70 bg-[#f00]/20 disabled:bg-[#f00]/5 outline-[#f00]/20 disabled:outline-[#f00]/5"
                    }   font-medium rounded text-sm px-4 py-2 outline  cursor-pointer `}
                  >
                    <option value={"instock"}>In Stock</option>
                    <option value={"outofstock"}>Out of Stock</option>
                  </select>
                </div>
              </td>
            )}
            {isExists("Manage Stock") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={currentProduct?.manage_stock}
                    onChange={(e) => {
                      setIs_update(true);
                      setCurrentProduct((prev) => ({
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
            )}

            {isExists("Quantity") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <div className="w-full h-[40px] bg-[#f7f7f7] rounded px-2 flex items-center">
                  <input
                    value={currentProduct?.stock_quantity}
                    onChange={(e) => {
                      setIs_update(true);
                      setCurrentProduct((prev) => ({
                        ...prev,
                        stock_quantity: e.target.value,
                      }));
                    }}
                    type="text"
                    className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent "
                  />
                </div>
              </td>
            )}

            {isExists("Featured") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={currentProduct?.featured}
                    defaultChecked={currentProduct?.featured}
                    onChange={(e) => {
                      setIs_update(true);
                      setCurrentProduct((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }));
                    }}
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </td>
            )}
            {isExists("Sale Price") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <div
                  onClick={variationWarning}
                  className="w-full h-[40px] bg-[#f7f7f7] rounded px-2 flex items-center"
                >
                  <span
                    className="inline-block w-2"
                    dangerouslySetInnerHTML={{ __html: currency?.symbol }}
                  />
                  <input
                    type="text"
                    className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54]"
                    value={currentProduct?.sale_price}
                    defaultValue={currentProduct.sale_price || ""}
                    onChange={(e) => {
                      setIs_update(true);
                      setCurrentProduct((prev) => ({
                        ...prev,
                        sale_price: e.target.value,
                      }));
                    }}
                    disabled={product?.variations?.length > 0 ? true : false}
                  />
                </div>
              </td>
            )}
            {isExists("Total Sale") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <p className="text-[14px] text-black/[0.84] ">
                  {product?.total_sales}
                </p>
              </td>
            )}
            {isExists("Category") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <p className="text-[12px] text-black/[0.84] text-left">
                  {product?.categories?.length > 0
                    ? product?.categories?.map((category, i) => (
                        <span>
                          {category?.name}
                          {product?.categories?.length - 1 !== i && ","}{" "}
                        </span>
                      ))
                    : "N/A"}
                </p>
              </td>
            )}
            {isExists("Action") && (
              <td
                align="center"
                className="border-[1.5px] border-[#f2f2f2] px-3 py-1"
              >
                <div className="flex items-center justify-center gap-4">
                  <button onClick={openModal} className="text-black/[0.54]">
                    <RiBallPenLine />
                  </button>

                  {is_update ? (
                    <button
                      onClick={() => {
                        setIs_update(false);
                        setCurrentProduct({
                          price: `${product?.price}`,
                          regular_price: `${product?.regular_price}`,
                          sale_price: `${product?.sale_price}`,
                          stock_status: product?.stock_status,
                          featured: product?.featured,
                          manage_stock: product?.manage_stock,
                          stock_quantity: product?.stock_quantity,
                          name: product?.name,
                          sku: product?.sku,
                        });
                        setEditedProducts((prev) =>
                          prev?.filter((item) => item?.id !== product?.id)
                        );
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
                    onClick={handleUpdateProduct}
                    className={` w-6 h-6 rounded-full text-white ${
                      is_update ? "bg-[#25AF55]" : "bg-gray-500"
                    }`}
                  >
                    <IoIosCheckmark />
                  </button>
                </div>
              </td>
            )}
          </>
        )}
      </tr>
      {product?.variations?.length > 0 && openVariations && (
        <tr className={`bg-primary ${openVariations && "shadow-xl"}`}>
          <td colSpan={columns?.length}>
            <VariationTable id={product?.id} name={product?.name} pi={index} />
          </td>
        </tr>
      )}
      {isModalOpen && (
        <ProductChangeModal
          closeModal={closeModal}
          id={product?.id}
          update
          setUpdated={setCurrentProduct}
        />
      )}
    </>
  );
};

function CustomTable({
  products,
  columns,
  setEditedProducts,
  updatedItems,
  setUpdatedItems,
  refetch,
  currency,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F7F7F7]">
            {columns?.map((col) => (
              <th
                className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[14px] p-[10px]"
                style={{
                  width: col.width,
                }}
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products?.map((product, i) => (
            <Row
              key={i}
              product={product}
              index={i}
              columns={columns}
              setEditedProducts={setEditedProducts}
              updatedItems={updatedItems}
              setUpdatedItems={setUpdatedItems}
              refetch={refetch}
              currency={currency}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomTable;
