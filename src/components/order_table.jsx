"use client";

import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "@/context";
import { useCurrency, useOrders } from "@/hooks";
import CustomOrderTable from "./table/customOrderTable";
import { orderCols } from "@/assets/data";
import { Loader } from ".";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdArrowDropdown,
} from "react-icons/io";
import { MdMenuOpen, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { AiOutlineReload } from "react-icons/ai";
import { HiBars3 } from "react-icons/hi2";

const orderStatus = [
  "any",
  "pending",
  "processing",
  "on-hold",
  "completed",
  "cancelled",
  "refunded",
  "falied",
  "trash",
];

function OrderTable() {
  const { shop } = useContext(ShopContext);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [search, setSearch] = useState("");
  const [openFilterBox, setOpenFilterBox] = useState({
    status: false,
    column: false,
  });
  const [status, setStatus] = useState("any");
  const [updating, setUpdating] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const [editedOrders, setEditedOrders] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [selectedCols, setSelectedCols] = useState(orderCols);

  const {
    loading,
    orders,
    page,
    perPage,
    refetch,
    setPage,
    setPerPage,
    total_page,
  } = useOrders(shop, search, status);

  const { currency, loading: currencyLoading } = useCurrency(shop);

  useEffect(() => {
    refetch();
  }, [status]);

  const handleCheckboxChange = (item) => {
    if (selectedCols.includes(item)) {
      // Remove the item if it's already selected
      setSelectedCols(selectedCols.filter((col) => col !== item));
    } else {
      const newcols = [...selectedCols, item];
      setSelectedCols(newcols.sort((a, b) => a?.id - b?.id, 0));
    }
  };

  const handleReload = () => {
    setSearch("");
    refetch();
  };

  return (
    <div className="border-2 border-primary/20 rounded -mt-[2px] p-3">
      <div className="flex justify-between items-center mb-5">
        <div className="hidden sm:block" />
        <div className="flex  items-center justify-end gap-2">
          <AiOutlineReload
            className="text-primary cursor-pointer"
            onClick={handleReload}
          />
          {/* 
          <button
            // disabled={editedProducts?.length === 0 ? true : false}
            // onClick={handleBatchUpdate}
            className="flex justify-center items-center gap-2 w-28 sm:w-[160px] h-[40px] rounded-md border-[1.5px] border-primary bg-primary disabled:bg-gray-400 disabled:border-gray-400"
          >
            <p className="text-[12px] font-semibold text-white">Update</p>
          </button> */}
        </div>
      </div>

      <div className="xl:h-[80px] w-full bg-[#f7f7f7] rounded-t-lg py-2">
        <div className=" lg:hidden flex justify-between items-center w-full px-5 pb-2">
          <div />
          <button
            onClick={() => setOpenDropDown((prev) => !prev)}
            className="text-2xl text-gray-600"
          >
            <MdMenuOpen />
          </button>
        </div>
        <div
          className={`lg:flex flex-col xl:flex-row justify-between  items-start h-full px-5 gap-4 ${
            openDropDown ? "flex" : "hidden"
          }`}
        >
          <div className="w-full lg:max-w-[25%]">
            <div className="w-full mb-2 lg:mb-0 lg:max-w-[300px] h-[40px] border-[1.5px] border-black/[0.07] rounded-md bg-white flex items-center gap-1 px-4">
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
                placeholder="Search Orders"
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4 w-full lg:max-w-[25%]">
            <div className="relative w-full">
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
                  {/* <button
                    onClick={openColModal}
                    className="flex justify-center items-center gap-2 w-full h-[45px] rounded border-[1.5px] border-primary bg-primary/[0.08] text-primary py-1"
                  >
                    <HiPlusSm />
                    <p className="text-[12px] font-semibold text-primary">
                      Custom Column
                    </p>
                  </button> */}

                  {orderCols.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
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
                </div>
              )}
            </div>
            <div className="relative w-full">
              <div
                onClick={() =>
                  setOpenFilterBox((prev) => ({
                    ...prev,
                    status: !prev.status,
                  }))
                }
                className="min-w-[180px] h-[40px] rounded-md border-[1.5px] border-black/[0.07] bg-white flex justify-between items-center gap-1 px-4 text-black/[0.54] cursor-pointer"
              >
                <p className="flex items-center gap-1 text-sm capitalize">
                  {status}
                </p>
                <p>
                  <MdOutlineKeyboardArrowDown />
                </p>
              </div>
              {openFilterBox.status && (
                <div className="absolute p-2 bg-white w-full z-10 rounded-md flex flex-col gap-2 shadow-md border-[1.5px] border-black/[0.07] max-h-[300px] overflow-auto dropdown ">
                  {orderStatus?.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setStatus(item);
                        setOpenFilterBox((prev) => ({
                          ...prev,
                          status: false,
                        }));
                        refetch();
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <p className="text-black/[0.54] text-sm capitalize">
                        {item}
                      </p>
                    </div>
                  ))}
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
        <CustomOrderTable
          columns={selectedCols}
          orders={orders}
          editedOrders={editedOrders}
          setEditedOrders={setEditedOrders}
          statusList={orderStatus}
          currency={currency}
          updatedItems={updatedItems}
          setUpdatedItems={setUpdatedItems}
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
    </div>

    // <div className="my-8">
    //   {loading ? (
    //     <div className="flex justify-center items-center py-10">
    //       <Loader />
    //     </div>
    //   ) : (
    //     <CustomOrderTable columns={orderCols} orders={orders} />
    //   )}
    // </div>
  );
}

export default OrderTable;
