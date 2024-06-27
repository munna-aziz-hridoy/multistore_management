"use client";

import React, { useContext, useState } from "react";
import { ShopContext } from "@/context";
import { useCategories } from "@/hooks";
import { Loader } from "..";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const CatItem = ({
  setSelectedCat,
  selectedCat,
  item,
  i,
  setOpenFilterBox,
}) => {
  const [openList, setOpenList] = useState(false);

  return (
    <div>
      <div className="flex items-center py-1">
        <input
          checked={selectedCat?.id === item?.id}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedCat(item);
            } else {
              setSelectedCat(null);
            }
            setOpenFilterBox((prev) => ({
              ...prev,
              categories: false,
            }));
          }}
          id={`cat-radio-${i}`}
          type="radio"
          value=""
          name={item?.name}
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
        />
        <label
          for={`cat-radio-${i}`}
          className="ms-2 font-medium text-gray-700 flex justify-between items-center w-full"
        >
          {item?.name}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenList((prev) => !prev);
            }}
            className="cursor-pointer"
          >
            <MdOutlineKeyboardArrowRight
              className={`text-gray-400 duration-200 ${
                openList && "rotate-90"
              }`}
            />
          </button>
        </label>
      </div>
      <div className="ml-4 border-l border-gray-200 px-1">
        {openList && (
          <CatDrop
            category_id={item?.id}
            setOpenFilterBox={setOpenFilterBox}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
          />
        )}
      </div>
    </div>
  );
};

function CatDrop({
  category_id = 0,
  setSelectedCat,
  selectedCat,
  setOpenFilterBox,
}) {
  const { shop } = useContext(ShopContext);
  const { categories, loading } = useCategories(shop, category_id);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        categories?.map((item, i) => (
          <CatItem
            key={i}
            item={item}
            i={i}
            setSelectedCat={setSelectedCat}
            selectedCat={selectedCat}
            setOpenFilterBox={setOpenFilterBox}
          />
        ))
      )}
    </div>
  );
}

export default CatDrop;
