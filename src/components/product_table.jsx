"use client";

// react import
import React, { useContext, useEffect, useState } from "react";

// next import
import { useParams } from "next/navigation";
import { ShopContext } from "@/context";
import { useCategories, useCurrency, useOrders, useProducts } from "@/hooks";

// component import
import {
  CatDrop,
  CustomColumnAdd,
  CustomTable,
  Loader,
  Modal,
  ProductChange,
} from "@/components";

// icon import
import { CiSearch } from "react-icons/ci";
import { HiBars3 } from "react-icons/hi2";
import { MdOutlineKeyboardArrowDown, MdOutlineCategory } from "react-icons/md";
import { HiPlusSm } from "react-icons/hi";
import {
  IoMdArrowDropdown,
  IoIosArrowForward,
  IoIosArrowBack,
} from "react-icons/io";
import { AiOutlineReload } from "react-icons/ai";

// data import
import { columns } from "@/assets/data";
import toast from "react-hot-toast";
import { woo_api } from "@/config";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase.init";

function ProductTable() {
  const [openFilterBox, setOpenFilterBox] = useState({
    feature: false,
    column: false,
    categories: false,
    stock: false,
  });

  const [selectedCols, setSelectedCols] = useState([]);
  const [custom_cols, setCustom_cols] = useState([]);
  const [selected_custom_cols, setSelected_custom_cols] = useState([]);
  const [colChanging, setColChanging] = useState(false);
  const [clickedChecked, setClickedChecked] = useState(false);

  //   filter state

  const [featured, setFeatured] = useState(null);
  const [search, setSearch] = useState("");
  const [stock_status, setStock_status] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [showDrop, setShowDrop] = useState(false);

  // bulk update state

  const [editedProducts, setEditedProducts] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [updating, setUpdating] = useState(false);

  // product add state

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openColAddModal, setOpenColAddModal] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const params = useParams();

  const { shop, setShop, shops } = useContext(ShopContext);
  const { categories, loading: catLoading } = useCategories(shop);

  useEffect(() => {
    if (!shop) {
      const current_shop = shops.find(
        (shop) => shop?.id === parseInt(params?.id)
      );
      setShop(current_shop);
    } else {
      const savedCols = shop?.cols;

      if (savedCols && savedCols?.length) {
        const cols = columns.filter((col) => shop?.cols?.includes(col.Header));
        setSelectedCols(cols);
      }

      if (shop?.custom_cols) {
        setCustom_cols(
          shop?.custom_cols?.map((item, i) => ({ ...item, id: i + 1 }))
        );
        setSelected_custom_cols(
          shop?.custom_cols?.map((item, i) => ({ ...item, id: i + 1 }))
        );
      }
    }
  }, [shop, params, shops]);

  const {
    products,
    page,
    refetch,
    setPage,
    total_page,
    loading,
    perPage,
    setPerPage,
  } = useProducts(
    shop,
    search,
    "",
    `${selectedCat?.id || ""}`,
    featured,
    stock_status
  );

  const { currency, loading: currencyLoading } = useCurrency(shop);

  const { orders } = useOrders(shop);

  useEffect(() => {
    if (shop) {
      setColChanging(true);

      const cols = selectedCols?.map((col) => col.Header);
      const docRef = doc(firestore, "sites", shop?.doc_id);
      updateDoc(docRef, { ...shop, cols }).then(() => {
        setColChanging(false);
        if (clickedChecked) {
          toast.success("Columns updated successfully");
        }
      });

      const prevDataStr = localStorage.getItem("woo_shop_list");

      if (prevDataStr) {
        const prevData = JSON.parse(prevDataStr);
        const index = prevData.shops.findIndex((item) => item.id === shop?.id);
        if (index !== -1) {
          prevData.shops[index] = { ...shop, cols };
          localStorage.setItem("woo_shop_list", JSON.stringify(prevData));
        }
      }
    }
  }, [selectedCols]);

  const handleCheckboxChange = (item) => {
    setClickedChecked(true);

    if (selectedCols.includes(item)) {
      // Remove the item if it's already selected
      setSelectedCols(selectedCols.filter((col) => col !== item));
    } else {
      const newcols = [...selectedCols, item];
      setSelectedCols(newcols.sort((a, b) => a?.id - b?.id, 0));
    }
  };

  const handleCustomFieldChecboxChange = (item) => {
    if (selected_custom_cols?.map((item) => item?.id).includes(item?.id)) {
      // Remove the item if it's already selected
      setSelected_custom_cols(
        selected_custom_cols.filter((col) => col.id !== item.id)
      );
    } else {
      const newcols = [...selected_custom_cols, item];
      setSelected_custom_cols(newcols.sort((a, b) => a?.id - b?.id, 0));
    }
  };

  const handleBatchUpdate = () => {
    if (editedProducts?.length === 0)
      return toast.error("Please select at least one product to update");

    let error = false;

    editedProducts.forEach((product) => {
      const reg_price = product.regular_price;
      const sale_price = product.sale_price;

      if (
        reg_price &&
        sale_price &&
        parseFloat(reg_price) < parseFloat(sale_price)
      ) {
        error = true;
        return;
      }
    });

    if (error) {
      toast.error("Regular price cannot be less than sale price");
      return;
    }

    setUpdating(true);
    woo_api(shop)
      .post("products/batch", { update: editedProducts })
      .then((response) => {
        setUpdating(false);
        if (response.status === 200) {
          toast.success("Products updated successfully");
          setEditedProducts([]);
          refetch();
          const updatedProducts = response?.data?.update?.map(
            (product) => product?.id
          );
          setUpdatedItems((prev) => [...prev, ...updatedProducts]);
        } else {
          toast.error("Failed to update products");
        }
      })
      .catch((err) => {
        setUpdating(false);
        toast.error("Failed to update products");
      });
  };

  const handleReload = () => {
    setSearch("");
    setSelectedCat(null);
    setFeatured(null);
    setStock_status("");

    setTimeout(() => {
      refetch();
    }, [150]);
  };

  const openModal = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = "hidden";
    setOpenAddModal(true);
  };

  const closeModal = () => {
    document.body.style.overflow = "";
    window.scrollTo(0, scrollPosition);
    setOpenAddModal(false);
  };

  const openColModal = () => {
    setScrollPosition(window.pageYOffset);
    document.body.style.overflow = "hidden";
    setOpenColAddModal(true);
  };

  const closeColModal = () => {
    document.body.style.overflow = "";
    window.scrollTo(0, scrollPosition);
    setOpenColAddModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div />
        <div className="flex items-center justify-end gap-2">
          <AiOutlineReload
            className="text-primary cursor-pointer"
            onClick={handleReload}
          />
          <button
            onClick={openModal}
            className="flex justify-center items-center gap-2 w-[160px] h-[40px] rounded-md border-[1.5px] border-primary bg-primary/[0.08] text-primary"
          >
            <HiPlusSm />
            <p className="text-[12px] font-semibold text-primary">
              Add Product
            </p>
          </button>
          <button
            disabled={editedProducts?.length === 0 ? true : false}
            onClick={handleBatchUpdate}
            className="flex justify-center items-center gap-2 w-[160px] h-[40px] rounded-md border-[1.5px] border-primary bg-primary disabled:bg-gray-400 disabled:border-gray-400"
          >
            <p className="text-[12px] font-semibold text-white">Update</p>
          </button>
        </div>
      </div>

      <div className="h-[80px] w-full bg-[#f7f7f7] rounded-t-lg">
        <div className="flex justify-between items-center h-full px-5">
          <div className="min-w-[300px] h-[40px] border-[1.5px] border-black/[0.07] rounded-md bg-white flex items-center gap-1 px-4">
            <p onClick={() => refetch()} className="w-[30px]">
              <CiSearch />
            </p>
            <input
              value={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  refetch();
                }
              }}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="h-full w-[calc(100%-30px)] text-sm"
              placeholder="Search Products"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                onClick={() =>
                  setOpenFilterBox((prev) => ({
                    ...prev,
                    categories: !prev.categories,
                  }))
                }
                className="min-w-[180px] h-[40px] rounded-md border-[1.5px] border-black/[0.07] bg-white flex justify-between items-center gap-1 px-4 text-black/[0.54] cursor-pointer"
              >
                <p className="flex items-center gap-1 text-sm">
                  <MdOutlineCategory />
                  {selectedCat?.name || "Categories"}
                </p>
                <p>
                  <MdOutlineKeyboardArrowDown />
                </p>
              </div>
              {openFilterBox.categories && (
                <div className="absolute p-2 bg-white w-full z-10 rounded-md flex flex-col gap-2 shadow-md border-[1.5px] border-black/[0.07]  max-h-[300px] overflow-y-auto dropdown overflow-x-hidden">
                  <CatDrop
                    categories={categories}
                    selectedCat={selectedCat}
                    setSelectedCat={setSelectedCat}
                    setOpenFilterBox={setOpenFilterBox}
                  />
                </div>
              )}
            </div>
            <div className="relative">
              <div
                onClick={() =>
                  setOpenFilterBox((prev) => ({
                    ...prev,
                    column: !prev.column,
                  }))
                }
                className="min-w-[180px] h-[40px] rounded-md border-[1.5px] border-black/[0.07] bg-white flex justify-between items-center gap-1 px-4 text-black/[0.54] cursor-pointer"
              >
                <p className="flex items-center gap-1 text-sm">
                  <HiBars3 className="rotate-90" />
                  Column
                </p>
                <p>
                  <MdOutlineKeyboardArrowDown />
                </p>
              </div>
              {openFilterBox.column && (
                <div className="absolute p-2 bg-white w-full z-10 rounded-md flex flex-col gap-2 shadow-md border-[1.5px] border-black/[0.07] max-h-[300px] overflow-auto dropdown">
                  <button
                    onClick={openColModal}
                    className="flex justify-center items-center gap-2 w-full h-[45px] rounded border-[1.5px] border-primary bg-primary/[0.08] text-primary py-1"
                  >
                    <HiPlusSm />
                    <p className="text-[12px] font-semibold text-primary">
                      Custom Column
                    </p>
                  </button>

                  {columns.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        disabled={colChanging}
                        checked={selectedCols?.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                        className="w-[20px] h-[20px] cursor-pointer"
                        name={item}
                        id={item}
                        value={item}
                        type="checkbox"
                      />
                      <p className="text-black/[0.54] text-sm">{item.Header}</p>
                    </div>
                  ))}

                  <p className="text-center text-black/[0.54] text-xs font-semibold after:w-1/5 after:ml-1 before:mr-1 before:w-1/5 after:h-[1px] before:h-[1px] after:bg-black/[0.54] before:bg-black/[0.54] after:inline-block before:inline-block ">
                    Custom Field
                  </p>

                  {custom_cols?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        disabled={colChanging}
                        checked={selected_custom_cols
                          ?.map((item) => item.id)
                          .includes(item?.id)}
                        onChange={() => handleCustomFieldChecboxChange(item)}
                        className="w-[20px] h-[20px] cursor-pointer"
                        type="checkbox"
                      />
                      <p className="text-black/[0.54] text-sm">
                        {item?.col_name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <div
                onClick={() =>
                  setOpenFilterBox((prev) => ({
                    ...prev,
                    feature: !prev.feature,
                  }))
                }
                className="min-w-[180px] h-[40px] rounded-md border-[1.5px] border-black/[0.07] bg-white flex justify-between items-center gap-1 px-4 text-black/[0.54] cursor-pointer"
              >
                <p className="flex items-center gap-1 text-sm">
                  {featured ? "Featured Product" : "All Products"}
                </p>
                <p>
                  <MdOutlineKeyboardArrowDown />
                </p>
              </div>
              {openFilterBox.feature && (
                <div className="absolute p-2 bg-white w-full z-10 rounded-md flex flex-col gap-2 shadow-md border-[1.5px] border-black/[0.07] max-h-[300px] overflow-auto dropdown ">
                  <div
                    onClick={() => {
                      setFeatured(null);
                      setOpenFilterBox((prev) => ({ ...prev, feature: false }));
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <p className="text-black/[0.54] text-sm">All Products</p>
                  </div>
                  <div
                    onClick={() => {
                      setFeatured(true);
                      setOpenFilterBox((prev) => ({ ...prev, feature: false }));
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <p className="text-black/[0.54] text-sm">
                      Featured Products
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <div
                onClick={() =>
                  setOpenFilterBox((prev) => ({
                    ...prev,
                    stock: !prev.stock,
                  }))
                }
                className="min-w-[180px] h-[40px] rounded-md border-[1.5px] border-black/[0.07] bg-white flex justify-between items-center gap-1 px-4 text-black/[0.54] cursor-pointer"
              >
                <p className="flex items-center gap-1 text-sm capitalize">
                  {stock_status || "Stock Status"}
                </p>
                <p>
                  <MdOutlineKeyboardArrowDown />
                </p>
              </div>
              {openFilterBox.stock && (
                <div className="absolute p-2 bg-white w-full z-10 rounded-md flex flex-col gap-2 shadow-md border-[1.5px] border-black/[0.07] max-h-[300px] overflow-auto dropdown ">
                  <div
                    onClick={() => {
                      setStock_status("instock");
                      setOpenFilterBox((prev) => ({ ...prev, stock: false }));
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <p className="text-black/[0.54] text-sm">In stock</p>
                  </div>
                  <div
                    onClick={() => {
                      setStock_status("outofstock");
                      setOpenFilterBox((prev) => ({ ...prev, stock: false }));
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <p className="text-black/[0.54] text-sm">Out of stock</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading || updating || currencyLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader />
        </div>
      ) : (
        <CustomTable
          products={products}
          columns={selectedCols}
          custom_cols={selected_custom_cols}
          setEditedProducts={setEditedProducts}
          updatedItems={updatedItems}
          setUpdatedItems={setUpdatedItems}
          refetch={refetch}
          currency={currency}
          page={page}
          perPage={perPage}
        />
      )}
      <div className="flex justify-between items-center mb-3 mt-5">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-black/[0.54] text-xs">
            Row per page
          </p>{" "}
          <p
            onClick={() => setShowDrop((prev) => !prev)}
            className="relative px-4 border border-gray-200 rounded-md flex items-center gap-1 cursor-pointer text-black/[0.84] text-xs"
          >
            {perPage} <IoMdArrowDropdown />
            {showDrop && (
              <ul
                onClick={(e) => e.stopPropagation()}
                className="absolute bg-white w-32 shadow p-2 bottom-7 cursor-default"
              >
                {[20, 30, 40, 50, 100].map((item) => (
                  <li
                    onClick={() => {
                      setPerPage(item);
                      setShowDrop(false);
                    }}
                    key={item}
                    className="text-sm text-black/[0.54] my-1 hover:bg-primary/10 px-2 rounded cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <p className="flex gap-2 text-black/[0.54] text-xs font-semibold">
            <span>Page: {page}</span> <span> of </span>{" "}
            <span>{total_page}</span>
          </p>
          <p className="flex items-center gap-[6px] text-black/[0.54]">
            <IoIosArrowBack
              className="cursor-pointer text-base"
              onClick={() =>
                setPage((prev) => {
                  if (prev === 1) {
                    return prev;
                  } else {
                    return prev - 1;
                  }
                })
              }
            />
            <IoIosArrowForward
              className="cursor-pointer text-base"
              onClick={() =>
                setPage((prev) => {
                  if (prev === total_page) {
                    return prev;
                  } else {
                    return prev + 1;
                  }
                })
              }
            />
          </p>
        </div>
      </div>
      {openAddModal && (
        <Modal closeModal={closeModal}>
          <ProductChange closeModal={closeModal} refetch={refetch} />
        </Modal>
      )}
      {openColAddModal && (
        <Modal closeModal={closeColModal} w="500px" h="200px">
          <CustomColumnAdd closeModal={closeColModal} />
        </Modal>
      )}
    </div>
  );
}

export default ProductTable;
