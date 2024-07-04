"use client";

import React, { Fragment, useContext } from "react";
import { ShopContext } from "@/context";
import { useAttributesTerms } from "@/hooks";
import { Loader } from "..";

function AttributeSelect({ attribute, currentVariation, setCurrentVariation }) {
  const { shop } = useContext(ShopContext);
  const { attributesTerms, loading } = useAttributesTerms(shop, attribute?.id);

  const updateAttribute = (value) => {
    setCurrentVariation((prev) => {
      let updated_attributes = prev?.attributes ? [...prev.attributes] : [];

      const exists = updated_attributes.find(
        (vari) => vari?.id === attribute?.id
      );

      if (exists) {
        updated_attributes = updated_attributes.map((item) => {
          if (item?.id === attribute?.id) {
            return { ...item, option: value };
          } else {
            return item;
          }
        });
      } else {
        updated_attributes = [
          ...updated_attributes,
          {
            id: attribute?.id,
            option: value,
            name: attribute?.name,
          },
        ];
      }

      return {
        ...prev,
        attributes: updated_attributes,
      };
    });
  };

  return (
    <Fragment>
      {loading ? (
        <div className="flex justify-center items-center py-2">
          <Loader />
        </div>
      ) : (
        <Fragment>
          {attribute?.type === "select" ? (
            <div className="w-full h-[45px]">
              <span className="text-sm text-black/[0.64] px-2 capitalize font-semibold mb-2 inline-block">
                {attribute?.name}
              </span>
              <select
                value={
                  currentVariation?.attributes?.find(
                    (vari) => vari?.id === attribute?.id
                  )?.option || ""
                }
                onChange={(e) => updateAttribute(e.target.value)}
                className="text-gray-700 bg-gray-200 outline-none font-medium rounded text-sm px-4 py-2 outline cursor-pointer w-full h-full capitalize"
              >
                <option value="" disabled>
                  Select a value
                </option>
                {attributesTerms?.map((term) => (
                  <option key={term.id} value={term.name}>
                    {term.name}
                  </option>
                ))}
              </select>
            </div>
          ) : attribute?.type === "button" ? (
            <div className="w-full h-[45px] relative p-1">
              <span className="inline-block absolute -top-4 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                {attribute?.name}
              </span>
              <div className="w-full h-full flex items-end justify-start pl-3 gap-2">
                {attributesTerms?.map((term) => (
                  <button
                    key={term.id}
                    className={`px-4 py-1 rounded border border-black h-8 ${
                      currentVariation?.attributes?.find(
                        (vari) => vari?.id === attribute?.id
                      )?.option === term.name
                        ? "bg-black/75 text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => updateAttribute(term.name)}
                  >
                    {term.name}
                  </button>
                ))}
              </div>
            </div>
          ) : attribute?.type === "color" ? (
            <div className="w-full h-[45px] relative p-1">
              <span className="inline-block absolute -top-4 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                {attribute?.name}
              </span>
              <div className="w-full h-full flex items-end justify-start pl-3 gap-2">
                {attributesTerms?.map((term) => (
                  <div
                    key={term.id}
                    className={`px-4 py-1 rounded-full border w-8 h-8 `}
                    onClick={() => updateAttribute(term.name)}
                    style={{
                      backgroundColor: term.name.toLowerCase(),
                      borderColor: term.name.toLowerCase(),
                      cursor: "pointer",
                      outline:
                        currentVariation?.attributes?.find(
                          (vari) => vari?.id === attribute?.id
                        )?.option === term.name
                          ? "2px solid black"
                          : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
              <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                {attribute?.name}
              </span>
              <input
                className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                placeholder={attribute?.name}
                name={attribute?.name}
                value={
                  currentVariation?.attributes?.find(
                    (vari) => vari?.id === attribute?.id
                  )?.option || ""
                }
                onChange={(e) => updateAttribute(e.target.value)}
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default AttributeSelect;
