"use client";

// react import
import React, { useContext, useEffect, useState } from "react";

// data import
import { currency, shoptype } from "@/assets/data";

// icon import

// firebase import
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

// package import
import { v4 as uuid } from "uuid";
import { firestore } from "@/firebase.init";
import { ShopContext, UserContext } from "@/context";
import toast from "react-hot-toast";
import { Loader, DownloadCredential } from ".";

function StepTwo({ platform }) {
  // error state

  const [error, setError] = useState({
    name: {
      value: false,
      message: "",
    },
    url: {
      value: false,
      message: "",
    },
    consumer_key: {
      value: false,
      message: "",
    },
    consumer_secret: {
      value: false,
      message: "",
    },
    type: {
      value: false,
      message: "",
    },
    currency: {
      value: false,
      message: "",
    },
  });

  const [selectedType, setSelectedType] = useState(shoptype[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currency.USD);

  const [adding, setAdding] = useState(false);

  // context
  const {
    db_id,
    sites,
    loading,
    refetch: userRefetch,
    userInfo,
  } = useContext(UserContext);
  const { refetch, shops } = useContext(ShopContext);

  useEffect(() => {
    userRefetch();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError({
      name: {
        value: false,
        message: "",
      },
      url: {
        value: false,
        message: "",
      },
      consumer_key: {
        value: false,
        message: "",
      },
      consumer_secret: {
        value: false,
        message: "",
      },
      type: {
        value: false,
        message: "",
      },
      currency: {
        value: false,
        message: "",
      },
    });

    const { name, url, consumer_key, consumer_secret } = e.target;
    const data = {
      name: name.value,
      url: url.value,
      consumer_key: consumer_key.value,
      consumer_secret: consumer_secret.value,
      platform: platform,
      type: selectedType.slug,
      currency: selectedCurrency.symbol,
    };

    // set error if data not found

    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        setError((prevError) => ({
          ...prevError,
          [key]: {
            value: true,
            message: `${key?.split("_").join(" ")} is required`,
          },
        }));
      }
    });

    if (!Object.values(error).some((e) => e.value)) {
      if (shops?.length === 2) {
        toast.error("You can only add two shops");
        return;
      }

      setAdding(true);
      const hex_id = parseInt(uuid().replace(/-/g, "").substr(0, 6), 16);

      const shopDoc = {
        shop_name: data.name,
        product_type: "general",
        domain: data.url,
        ck: data.consumer_key,
        cs: data.consumer_secret,
        user_id: db_id,
        id: hex_id,
        url: `/shop/${hex_id}`,
        platform: data.platform,
        type: data.type,
        currency: data.currency,
        cols: [
          "Image",
          "Name & JAN Code",
          "Regular Price",
          "Sale Price",
          "Stock",
          "Manage Stock",
          "Quantity",
        ],
      };

      addDoc(collection(firestore, "sites"), shopDoc).then((savedDoc) => {
        const shop_id = savedDoc.id;
        const docRef = doc(firestore, "users", db_id);

        updateDoc(docRef, { sites: [...sites, shop_id] }).then((updateDoc) => {
          refetch();
          name.value = "";
          url.value = "";
          consumer_key.value = "";
          consumer_secret.value = "";
          setSelectedType(shoptype[0]);
          setSelectedCurrency(currency.USD);
          toast.success("Shop Created");
          setAdding(false);
        });
      });
    } else return setAdding(false);
  };

  return (
    <div className="w-full min-h-[400px] shadow-md border-2 border-black/[0.07] rounded-md p-5 mt-12">
      <div className="flex justify-between items-center">
        <h2 className="text-base text-black/[0.84] font-semibold mb-6">
          Add shop
        </h2>
        <div>
          <DownloadCredential />
        </div>
      </div>
      {adding || loading ? (
        <div className="flex justify-center items-center py-5">
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center items-center gap-5 mb-8">
            <div className="w-1/2 h-[45px] rounded border border-[#B2BCCA] relative">
              <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                shop name
              </span>
              <input
                className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                placeholder="Ex: My mobile shop"
                name="name"
              />
              {error.name.value && (
                <p className="text-xs text-red-500 font-semibold capitalize">
                  {error.name.message}
                </p>
              )}
            </div>
            <div className="w-1/2 h-[45px] rounded border border-[#B2BCCA] relative">
              <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                {platform === "shopify" ? "Host name" : "Shop URL"}
              </span>
              <input
                className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                placeholder="Ex: www.myshop.com"
                name="url"
              />
              {error.url.value && (
                <p className="text-xs text-red-500 font-semibold capitalize">
                  {error.url.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center gap-5 my-6 mb-8">
            <div className="w-1/2 h-[45px] rounded border border-[#B2BCCA] relative">
              <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                {platform === "shopify" ? "API Key" : "Consumer Key"}
              </span>
              <input
                className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                placeholder="Ex: ck_xxxxxxxxxxxxxxxxx"
                name="consumer_key"
              />
              {error.consumer_key.value && (
                <p className="text-xs text-red-500 font-semibold capitalize">
                  {error.consumer_key.message}
                </p>
              )}
            </div>
            <div className="w-1/2 h-[45px] rounded border border-[#B2BCCA] relative">
              <span className="inline-block absolute -top-3 left-3 text-sm text-black/[0.34] bg-white px-2 capitalize">
                {platform === "shopify" ? "API Secret" : "Consumer Secret"}
              </span>
              <input
                className="rounded w-full h-full px-4 text-black/[0.84] font-semibold"
                placeholder="Ex: ck_xxxxxxxxxxxxxxxxx"
                name="consumer_secret"
              />
              {error.consumer_secret.value && (
                <p className="text-xs text-red-500 font-semibold capitalize">
                  {error.consumer_secret.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary h-[45px] rounded-md text-white font-medium mt-6 hover:bg-primary/80 duration-100"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default StepTwo;
