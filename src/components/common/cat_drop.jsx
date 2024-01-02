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

  const { shop } = useContext(ShopContext);
  const { categories, loading } = useCategories(shop, item?.id);

  return (
    <div>
      <div class="flex items-center py-1">
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
          class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer"
        />
        <label
          for={`cat-radio-${i}`}
          class="ms-2 font-medium text-gray-700 flex justify-between items-center w-full"
        >
          {item?.name}
          {loading ? (
            <Loader small />
          ) : (
            categories?.length > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenList((prev) => !prev);
                }}
                className="cursor-pointer"
              >
                <MdOutlineKeyboardArrowRight className="text-gray-400" />
              </span>
            )
          )}
        </label>
      </div>
      <div className="ml-4 border-l border-gray-200 px-1">
        {openList && (
          <CatDrop
            categories={categories}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
          />
        )}
      </div>
    </div>
  );
};

function CatDrop({
  categories,
  setSelectedCat,
  selectedCat,
  setOpenFilterBox,
}) {
  return (
    <div>
      {categories?.map((item, i) => (
        <CatItem
          key={i}
          item={item}
          i={i}
          setSelectedCat={setSelectedCat}
          selectedCat={selectedCat}
          setOpenFilterBox={setOpenFilterBox}
        />
      ))}
    </div>
  );
}

export default CatDrop;
