"use client";

import React, { useContext, useState } from "react";
import { ShopContext } from "@/context";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase.init";
import toast from "react-hot-toast";

function CustomColumnAdd({ closeModal }) {
  const [meta_key, setMeta_key] = useState("");
  const [col_name, setCol_name] = useState("");

  const { shop, setShop } = useContext(ShopContext);

  const handleAddCustomColumn = () => {
    if (meta_key) {
      const docRef = doc(firestore, "sites", shop?.doc_id);

      let prevMeta = [];
      if (shop?.custom_cols) {
        prevMeta = shop?.custom_cols;
      }
      updateDoc(docRef, {
        ...shop,
        custom_cols: [...prevMeta, { meta_key, col_name }],
      }).then((response) => {
        setShop({
          ...shop,
          custom_cols: [...prevMeta, { meta_key, col_name }],
        });
        closeModal();
        toast.success("Custom field created");
      });
    } else {
      toast.error("Please enter meta field key");
    }
  };

  return (
    <div className="flex flex-col w-full gap-3 px-5 min-w-[400px] my-5 ">
      <div>
        <h2 className="text-center text-xl font-semibold text-black/[0.84]">
          Add Custom Column
        </h2>
        <p className="text-sm text-black/[0.54] font-medium text-center">
          Enter your meta field key in the box
        </p>
      </div>
      <div className="w-full h-[40px] bg-[#f7f7f7] rounded px-2 flex items-center">
        <input
          value={meta_key}
          onChange={(e) => setMeta_key(e.target.value)}
          type="text"
          className="text-black/[0.84] px-1 h-full w-full bg-transparent disabled:text-black/[0.54]"
          placeholder="Meta Field Key"
        />
      </div>
      <div className="w-full h-[40px] bg-[#f7f7f7] rounded px-2 flex items-center">
        <input
          value={col_name}
          onChange={(e) => setCol_name(e.target.value)}
          type="text"
          className="text-black/[0.84] px-1 h-full w-full bg-transparent disabled:text-black/[0.54]"
          placeholder="Column Name"
        />
      </div>
      <button
        disabled={!meta_key}
        onClick={handleAddCustomColumn}
        className="flex justify-center items-center gap-2 w-full h-[45px] rounded-md border-[1.5px] border-primary bg-primary disabled:bg-gray-400 disabled:border-gray-400"
      >
        <p className="text-[14px] font-semibold text-white">Add Column</p>
      </button>
    </div>
  );
}

export default CustomColumnAdd;
