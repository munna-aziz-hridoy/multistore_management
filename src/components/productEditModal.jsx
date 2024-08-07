"use client";

// react import
import React, { useContext, useState, useEffect, Fragment } from "react";

// context
import { ShopContext } from "@/context";

// hooks
import { useCategories, useProduct, useAttributes, useCurrency } from "@/hooks";

// component import
import { AttributeSelect, Loader, RichEditor, VariationTable } from ".";

// icon import
import { IoMdArrowDropright } from "react-icons/io";
import { BsX } from "react-icons/bs";
import { CgTrash } from "react-icons/cg";
import { woo_api } from "@/config";
import toast from "react-hot-toast";

// package import

const CategorySelectItems = ({ category, selected, setSelected }) => {
  const { shop } = useContext(ShopContext);
  const { categories, loading } = useCategories(shop, category?.id);
  const [openCat, setOpenCat] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpenCat((prev) => !prev)}
        className="w-full px-3 py-1 bg-primary/10 my-1 rounded-md cursor-pointer text-black/[0.54] hover:text-white hover:bg-primary duration-150 flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
          <input
            checked={selected?.find((item) => item.id === category?.id)}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setSelected((prev) => {
                if (e.target.checked) {
                  return [...prev, category];
                } else {
                  return prev.filter((item) => item.id !== category?.id);
                }
              });
            }}
            type="checkbox"
            className="w-4 h-4 cursor-pointer bg-transparent"
          />
          <p>{category?.name}</p>
        </div>
        {loading ? (
          <Loader small />
        ) : categories?.length > 0 ? (
          <IoMdArrowDropright
            className={`duration-300 ${openCat ? "rotate-90" : "rotate-0"}`}
            fontSize={20}
          />
        ) : (
          ""
        )}
      </div>
      {openCat && (
        <div className="ml-5 border-l border-b rounded-md border-gray-200">
          <CategorySelect
            categories={categories}
            loading={loading}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      )}
    </>
  );
};

const CategorySelect = ({ categories, loading, selected, setSelected }) => {
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Loader />
        </div>
      ) : (
        <div className="p-1 rounded-md">
          {categories?.map((category, i) => (
            <CategorySelectItems
              selected={selected}
              setSelected={setSelected}
              key={i}
              category={category}
            />
          ))}
        </div>
      )}
    </>
  );
};

function ProductChange({
  closeModal,
  id,
  update = false,
  setUpdated = null,
  refetch = null,
  custom_cols = [],
}) {
  const [openCat, setOpenCat] = useState(false);

  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    sku: "",
    price: "",
    regular_price: "",
    sale_price: "",
    stock_status: "instock",
    manage_stock: false,
    featured: true,
    stock_quantiy: "",
    status: "publish",
    weight: "",
    meta_data: [],
  });

  const [selectedCats, setSelectedCats] = useState([]);
  const [description, setDescription] = useState("");
  const [short_description, setShort_description] = useState("");
  const [customFields, setCustomFields] = useState([]);
  const [updating, setUpdating] = useState(false);

  const { shop } = useContext(ShopContext);
  const { categories, loading: catLoading } = useCategories(shop, 0);
  const { product, loading } = useProduct(shop, id);
  const [is_variations, setIs_variations] = useState(false);
  const { attributes, loading: attrLoading } = useAttributes(
    shop,
    is_variations
  );

  const [variations, setVariations] = useState([]);
  const [currentVariation, setCurrentVariation] = useState({ attributes: [] });

  const { currency } = useCurrency(shop);

  useEffect(() => {
    if (update && product) {
      const {
        name,
        sku,
        price,
        regular_price,
        sale_price,
        stock_status,
        manage_stock,
        stock_quantiy,
        description: product_desc,
        short_description: product_short_desc,
        categories: product_cats,
        status,
        weight,
        meta_data,
        featured,
      } = product;

      setCurrentProduct({
        name,
        sku,
        price: `${price}`,
        regular_price: `${regular_price}`,
        sale_price: `${sale_price}`,
        stock_status,
        manage_stock,
        stock_quantiy,
        status,
        weight,
        meta_data,
        featured,
      });

      setDescription(product_desc);
      setShort_description(product_short_desc);
      setSelectedCats(product_cats);
    }
  }, [product, update]);

  useEffect(() => {
    setCustomFields(custom_cols);
  }, [custom_cols]);

  useEffect(() => {
    if (shop?.domain?.includes("goldshirorom.com")) {
      setIs_variations(true);
    }
  }, [shop]);

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    let data = {
      ...currentProduct,
      short_description,
      description,
      categories: selectedCats?.map((cat) => ({ id: cat?.id })),
    };

    if (update) {
      setUpdating(true);
      woo_api(shop)
        .put(`products/${product?.id}`, data)
        .then((response) => {
          setUpdating(false);
          if (response.status === 200) {
            toast.success("Product updated successfully");
            setCurrentProduct({
              name: response?.data?.name,
              sku: response?.data?.sku,
              price: `${response?.data?.price}`,
              regular_price: `${response?.data?.regular_price}`,
              sale_price: `${response?.data?.sale_price}`,
              stock_status: response?.data?.stock_status,
              manage_stock: response?.data?.manage_stock,
              stock_quantiy: response?.data?.stock_quantity,
              status: response?.data?.status,
              weight: response?.data?.weight,
              meta_data: response?.data?.meta_data,
              featured: response?.data?.featured,
            });

            setUpdated &&
              setUpdated({
                name: response?.data?.name,
                sku: response?.data?.sku,
                price: `${response?.data?.price}`,
                regular_price: `${response?.data?.regular_price}`,
                sale_price: `${response?.data?.sale_price}`,
                stock_status: response?.data?.stock_status,
                manage_stock: response?.data?.manage_stock,
                stock_quantiy: response?.data?.stock_quantity,
                status: response?.data?.status,
                weight: response?.data?.weight,
                meta_data: response?.data?.meta_data,
                featured: response?.data?.featured,
              });

            closeModal && closeModal();
          } else {
            toast.error("Something went wrong");

            setCurrentProduct({
              name: product?.name,
              sku: product?.sku,
              price: `${product?.price}`,
              regular_price: `${product?.regular_price}`,
              sale_price: `${product?.sale_price}`,
              stock_status: product?.stock_status,
              manage_stock: product?.manage_stock,
              stock_quantiy: product?.stock_quantity,
              status: product?.status,
              weight: product?.weight,
              meta_data: product?.meta_data,
              featured: product?.featured,
            });
          }
        })
        .catch((err) => {
          setUpdating(false);
          toast.error(err?.response?.data?.message || "Something went wrong");
        });
    } else {
      setUpdating(true);

      if (!shop?.domain?.includes("goldshirorom.com")) {
        delete data.weight;

        data = {
          ...data,
          default_attributes: variations[0]?.map((variation) => ({
            id: variation?.id,
            option: variation?.option,
          })),
        };
      } else {
        data = {
          ...data,
          variations: variations?.map((variation) => {
            const { name, ...rest } = variation;

            return {
              ...rest,
              attributes: variation?.attributes?.map((attr) => ({
                id: attr?.id,
                option: attr?.option,
              })),
            };
          }),
        };
      }

      woo_api(shop)
        .post(`products`, data)
        .then((response) => {
          setUpdating(false);
          if (response.status === 201) {
            toast.success("Product created successfully");
            setCurrentProduct({
              name: response?.data?.name,
              sku: response?.data?.sku,
              price: `${response?.data?.price}`,
              regular_price: `${response?.data?.regular_price}`,
              sale_price: `${response?.data?.sale_price}`,
              stock_status: response?.data?.stock_status,
              manage_stock: response?.data?.manage_stock,
              stock_quantiy: response?.data?.stock_quantity,
              status: response?.data?.status,
              weight: response?.data?.weight,
              meta_data: response?.data?.meta_data,
              featured: response?.data?.featured,
            });
            refetch && refetch();
            closeModal && closeModal();
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

  const handleAddVariation = () => {
    setVariations([...variations, currentVariation]);
    setCurrentVariation([]);
  };

  return (
    <div>
      {(update && loading) || updating ? (
        <div className="flex justify-center items-center py-12 w-full h-[650px]">
          <Loader />
        </div>
      ) : (
        <div className="px-8 py-7">
          <p className="text-sm text-black/[0.54] ">
            {update ? "Edit" : "Add"} product
          </p>
          <h2 className="text-xl font-semibold text-black/[0.84]">
            {product?.name}
          </h2>
          <div className="flex gap-4 mb-4 mt-7">
            {/* left */}

            <div className="w-full md:w-1/2 flex flex-col gap-5">
              <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
                <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                  Product Name
                </span>
                <input
                  className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                  placeholder="Product name"
                  name="product_name"
                  value={currentProduct?.name}
                  onChange={(e) => {
                    setCurrentProduct((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                />
              </div>

              {!shop?.domain?.includes("goldshirorom.com") && (
                <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
                  <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                    Price
                  </span>
                  <input
                    className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                    placeholder="Price"
                    name="price"
                    value={currentProduct?.price}
                    onChange={(e) => {
                      setCurrentProduct((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }));
                    }}
                  />
                </div>
              )}

              {!shop?.domain?.includes("goldshirorom.com") && (
                <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
                  <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                    Sale Price
                  </span>
                  <input
                    className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                    placeholder="Sale Price"
                    name="sale_price"
                    value={currentProduct?.sale_price}
                    onChange={(e) => {
                      setCurrentProduct((prev) => ({
                        ...prev,
                        sale_price: e.target.value,
                      }));
                    }}
                  />
                </div>
              )}

              {!shop?.domain?.includes("goldshirorom.com") && (
                <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
                  <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                    Weight
                  </span>
                  <input
                    className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                    placeholder="Weight"
                    name="weight"
                    value={currentProduct?.weight}
                    onChange={(e) => {
                      setCurrentProduct((prev) => ({
                        ...prev,
                        weight: e.target.value,
                      }));
                    }}
                  />
                </div>
              )}

              <div className="w-full h-[45px]">
                <select
                  value={currentProduct?.status}
                  onChange={(e) => {
                    setCurrentProduct((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }));
                  }}
                  className={`${
                    currentProduct?.status === "publish"
                      ? "text-[#25af55] bg-[#25AF55]/10 outline-[#25AF55]/10"
                      : "text-[#f00] bg-[#f00]/10 outline-[#f00]/10"
                  }   font-medium rounded text-sm px-4 py-2 outline  cursor-pointer w-full h-full`}
                >
                  <option value={"publish"}>Publish</option>
                  <option value={"unpublish"}>Un publish</option>
                </select>
              </div>
            </div>

            {/* right */}

            <div className="w-full md:w-1/2 flex flex-col gap-5">
              <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
                <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                  {shop?.domain?.includes("goldshirorom.com")
                    ? "Jancode"
                    : "SKU"}
                </span>
                <input
                  className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                  placeholder={
                    shop?.domain?.includes("goldshirorom.com")
                      ? "Jancode"
                      : "SKU"
                  }
                  name="sku"
                  value={currentProduct?.sku}
                  onChange={(e) => {
                    setCurrentProduct((prev) => ({
                      ...prev,
                      sku: e.target.value,
                    }));
                  }}
                />
              </div>
              {!shop?.domain?.includes("goldshirorom.com") && (
                <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
                  <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                    Regular Price
                  </span>
                  <input
                    className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                    placeholder="Regular Price"
                    name="regular_price"
                    value={currentProduct?.regular_price}
                    onChange={(e) => {
                      setCurrentProduct((prev) => ({
                        ...prev,
                        regular_price: e.target.value,
                      }));
                    }}
                  />
                </div>
              )}
              {!shop?.domain?.includes("goldshirorom.com") && (
                <div className="w-full h-[45px]">
                  <select
                    value={currentProduct?.stock_status}
                    onChange={(e) => {
                      setCurrentProduct((prev) => ({
                        ...prev,
                        stock_status: e.target.value,
                      }));
                    }}
                    disabled={currentProduct?.manage_stock}
                    className={`${
                      currentProduct?.stock_status === "instock"
                        ? "text-[#25af55] bg-[#25AF55]/10 outline-[#25AF55]/10"
                        : "text-[#f00] bg-[#f00]/10 outline-[#f00]/10"
                    }   font-medium rounded text-sm px-4 py-2 outline  cursor-pointer w-full h-full`}
                  >
                    <option value={"instock"}>In Stock</option>
                    <option value={"outofstock"}>Out of Stock</option>
                  </select>
                </div>
              )}
              <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
                <span className="inline-block absolute -top-4 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                  Category
                </span>
                <div
                  onClick={() => setOpenCat((prev) => !prev)}
                  className="rounded w-full h-full px-4 text-black/[0.54] cursor-text flex items-center gap-1"
                >
                  {selectedCats?.map((cat, i) => (
                    <p
                      key={i}
                      className="bg-gray-300 px-2 py-1 rounded text-sm flex gap-1 items-center"
                    >
                      <span>{cat?.name}</span>
                      <BsX
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCats((prev) =>
                            prev.filter((c) => c.id !== cat.id)
                          );
                        }}
                        color="#f74747"
                        className="cursor-pointer"
                      />
                    </p>
                  ))}
                </div>

                {openCat && (
                  <div className="absolute left-0 top-[45px] w-full bg-white z-20 shadow-md max-h-[300px] overflow-auto">
                    <div className="flex justify-between items-center bg-gray-200 py-2 rounded px-2">
                      <div />
                      <button
                        onClick={() => setOpenCat(false)}
                        className="px-4 py-[2px] rounded border-[#f00]/60 text-[#f00]/[0.84] text-xs border"
                      >
                        Close
                      </button>
                    </div>
                    <CategorySelect
                      categories={categories}
                      loading={catLoading}
                      selected={selectedCats}
                      setSelected={setSelectedCats}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Custom Fields */}

          {shop?.domain?.includes("goldshirorom.com") ? (
            <Fragment>
              <div className="grid grid-cols-2 gap-5 mt-14">
                {customFields
                  ?.filter(
                    (col) =>
                      col?.col_name?.includes("New") ||
                      col?.col_name?.includes("new")
                  )
                  ?.map((col, i) => {
                    return (
                      <div
                        key={i}
                        className="w-full h-[45px] rounded border border-[#B2BCCA] relative"
                      >
                        <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                          {col?.col_name}
                        </span>
                        <input
                          className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                          placeholder={col?.col_name}
                          value={
                            currentProduct?.meta_data?.find(
                              (meta) => meta?.key === col?.meta_key
                            )?.value
                          }
                          onChange={(e) => {
                            setCurrentProduct((prev) => ({
                              ...prev,
                              meta_data: prev?.meta_data?.map((item) => {
                                if (item?.key === col?.meta_key) {
                                  return {
                                    ...item,
                                    value: e.target.value,
                                  };
                                } else {
                                  return item;
                                }
                              }),
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
              </div>

              <div className="grid grid-cols-2 gap-5 mt-14">
                {customFields
                  ?.filter((col) => col?.col_name?.includes("used"))
                  ?.map((col, i) => {
                    return (
                      <div
                        key={i}
                        className="w-full h-[45px] rounded border border-[#B2BCCA] relative"
                      >
                        <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                          {col?.col_name}
                        </span>
                        <input
                          className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                          placeholder={col?.col_name}
                          value={
                            currentProduct?.meta_data?.find(
                              (meta) => meta?.key === col?.meta_key
                            )?.value
                          }
                          onChange={(e) => {
                            setCurrentProduct((prev) => ({
                              ...prev,
                              meta_data: prev?.meta_data?.map((item) => {
                                if (item?.key === col?.meta_key) {
                                  return {
                                    ...item,
                                    value: e.target.value,
                                  };
                                } else {
                                  return item;
                                }
                              }),
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
            </Fragment>
          ) : (
            <div className="grid grid-cols-2 gap-5 mt-14">
              {customFields?.map((col, i) => {
                return (
                  <div
                    key={i}
                    className="w-full h-[45px] rounded border border-[#B2BCCA] relative"
                  >
                    <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                      {col?.col_name}
                    </span>
                    <input
                      className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                      placeholder={col?.col_name}
                      value={
                        currentProduct?.meta_data?.find(
                          (meta) => meta?.key === col?.meta_key
                        )?.value
                      }
                      onChange={(e) => {
                        setCurrentProduct((prev) => ({
                          ...prev,
                          meta_data: prev?.meta_data?.map((item) => {
                            if (item?.key === col?.meta_key) {
                              return {
                                ...item,
                                value: e.target.value,
                              };
                            } else {
                              return item;
                            }
                          }),
                        }));
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* end custom fields */}

          <div className="flex gap-2 items-center h-[45px] mt-5">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={currentProduct?.manage_stock}
                onChange={(e) => {
                  setCurrentProduct((prev) => ({
                    ...prev,
                    manage_stock: e.target.checked,
                  }));
                }}
                type="checkbox"
                value=""
                className="w-5 h-5 cursor-pointer"
              />
            </label>
            <p className="text-black/[0.54] font-semibold text-sm w-[170px]">
              Manage stock
            </p>
            {currentProduct?.manage_stock && (
              <div className="w-full h-[45px] rounded border border-[#B2BCCA] relative">
                <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                  Stock Quantity
                </span>
                <input
                  className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                  placeholder="Stock Quantity"
                  name="stock_quantity"
                  value={currentProduct?.stock_quantiy}
                  onChange={(e) => {
                    setCurrentProduct((prev) => ({
                      ...prev,
                      stock_quantiy: e.target.value,
                    }));
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 items-center h-[45px]">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                checked={currentProduct?.featured}
                onChange={(e) => {
                  setCurrentProduct((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }));
                }}
                type="checkbox"
                value=""
                className="w-5 h-5 cursor-pointer"
              />
            </label>
            <p className="text-black/[0.54] font-semibold text-sm w-[170px]">
              Featured
            </p>
          </div>

          {/* variations */}

          {!update && (
            <Fragment>
              <div className="flex gap-2 items-center h-[45px] mb-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    checked={is_variations}
                    onChange={(e) => {
                      setIs_variations(e.target.checked);
                      if (!e.target.checked) {
                        setCurrentVariation([]);
                        setVariations([]);
                      }
                    }}
                    type="checkbox"
                    value=""
                    className="w-5 h-5 cursor-pointer"
                  />
                </label>
                <p className="text-black/[0.54] font-semibold text-sm">
                  Variations
                </p>

                {is_variations && (
                  <Fragment>
                    {shop?.domain?.includes("goldshirorom.com") ? (
                      <Fragment>
                        {variations?.length < 1 && (
                          <button
                            onClick={handleAddVariation}
                            className="border border-primary px-3 py-1 rounded text-primary disabled:border-gray-400 disabled:text-gray-400"
                            disabled={currentVariation?.length === 0}
                          >
                            Add Attributes
                          </button>
                        )}
                      </Fragment>
                    ) : (
                      <button
                        onClick={handleAddVariation}
                        className="border border-primary px-3 py-1 rounded text-primary disabled:border-gray-400 disabled:text-gray-400"
                        disabled={currentVariation?.length === 0}
                      >
                        Add Variations
                      </button>
                    )}
                  </Fragment>
                )}
              </div>

              {/* variation list */}

              <div className="mb-5">
                {attrLoading ? (
                  <div className="flex justify-center items-center py-2">
                    <Loader />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                    {attributes?.map((attribute, i) => (
                      <AttributeSelect
                        key={i}
                        attribute={attribute}
                        currentVariation={currentVariation}
                        setCurrentVariation={setCurrentVariation}
                      />
                    ))}
                  </div>
                )}
              </div>

              {shop?.domain?.includes("goldshirorom.com") ? (
                <table className="w-full my-10">
                  <thead>
                    <tr>
                      <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                        Attributes
                      </th>
                      <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                        Stock Quantity
                      </th>
                      <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                        {variations[0]?.attributes?.map((attr, i) => (
                          <span key={i}>
                            {attr?.name}: {attr?.option}
                            <br />
                          </span>
                        ))}
                      </td>

                      <td className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                        <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center relative">
                          <input
                            type="text"
                            className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                            onChange={(e) => {}}
                          />
                        </div>
                      </td>
                      <td
                        align="center"
                        className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]"
                      >
                        <button
                          onClick={() => {
                            setVariations([]);
                            setCurrentVariation([]);
                          }}
                          className="text-red-500"
                        >
                          <CgTrash fontSize={20} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <Fragment>
                  {variations?.length > 0 && (
                    <table className="w-full my-10">
                      <thead>
                        <tr>
                          <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                            Attributes
                          </th>

                          <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                            Regular Price
                          </th>
                          <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                            Sale Price
                          </th>

                          <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                            Stock Quantity
                          </th>
                          <th className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {variations?.map((variation, i) => (
                          <tr key={i}>
                            <td className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                              {variation?.attributes?.map((attr, i) => (
                                <span key={i}>
                                  {attr?.name}: {attr?.option}
                                  <br />
                                </span>
                              ))}
                            </td>

                            <td className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center relative">
                                <span
                                  className="inline-block w-2"
                                  dangerouslySetInnerHTML={{
                                    __html: currency?.symbol,
                                  }}
                                />
                                <input
                                  type="text"
                                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                                  onChange={(e) => {
                                    setVariations((prev) =>
                                      prev?.map((it) => {
                                        if (it === variation) {
                                          return {
                                            ...it,
                                            regular_price: e.target.value,
                                          };
                                        } else {
                                          return it;
                                        }
                                      })
                                    );
                                  }}
                                />
                              </div>
                            </td>
                            <td className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center relative">
                                <span
                                  className="inline-block w-2"
                                  dangerouslySetInnerHTML={{
                                    __html: currency?.symbol,
                                  }}
                                />
                                <input
                                  type="text"
                                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                                  onChange={(e) => {
                                    setVariations((prev) =>
                                      prev?.map((it) => {
                                        if (it === variation) {
                                          return {
                                            ...it,
                                            sale_price: e.target.value,
                                          };
                                        } else {
                                          return it;
                                        }
                                      })
                                    );
                                  }}
                                />
                              </div>
                            </td>

                            <td className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]">
                              <div className="w-full h-[35px] bg-[#f7f7f7] rounded px-2 flex items-center relative">
                                <input
                                  type="text"
                                  className="text-black/[0.84] px-1 h-full w-[calc(100%-8px)] bg-transparent disabled:text-black/[0.54] text-[12px]"
                                  onChange={(e) => {}}
                                />
                              </div>
                            </td>
                            <td
                              align="center"
                              className="border-[1.5px] border-[#f2f2f2] text-black/[0.54] font-normal text-[12px] p-[10px]"
                            >
                              <button
                                onClick={() => {
                                  setVariations((prev) =>
                                    prev.filter((item) => item !== variation)
                                  );
                                }}
                                className="text-red-500"
                              >
                                <CgTrash fontSize={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Fragment>
              )}
            </Fragment>
          )}

          {/* end variations */}

          <div className="mt-10">
            <p className="text-sm font-semibold text-black/[0.54] mb-2">
              Short description
            </p>
            <RichEditor
              small
              prevContent={product?.short_description}
              setContent={setShort_description}
            />
          </div>
          <div className="mt-8">
            <p className="text-sm font-semibold text-black/[0.54] mb-2">
              Description
            </p>
            <RichEditor
              medium
              prevContent={product?.description}
              setContent={setDescription}
            />
          </div>

          {update && product?.variations?.length > 0 && (
            <VariationTable
              id={product?.id}
              pi={0}
              name={product?.name}
              modal
            />
          )}

          <div className="mt-10 flex items-center gap-4 h-[45px]">
            {update && (
              <button className="flex items-center justify-center gap-1 w-[125px] h-full text-white bg-[#f74747] rounded-md">
                <CgTrash /> <span>Delete</span>
              </button>
            )}
            <button
              onClick={handleUpdateProduct}
              className="flex items-center justify-center gap-1 h-full text-white bg-primary rounded-md"
              style={{
                width: update ? "calc(100% - 125px)" : "100%",
              }}
            >
              <span>{update ? "Update" : "Add Product"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductChange;
