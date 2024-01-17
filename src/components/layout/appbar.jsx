"use client";

// react import
import React, { useContext } from "react";

// context import
import { ShopContext, SidebarContext } from "@/context";

// icon import
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";

// image import
import profile from "@/assets/images/profile.jpg";
import Link from "next/link";

function Appbar() {
  const { collapse, sidebarToggle } = useContext(SidebarContext);
  const { shop } = useContext(ShopContext);

  return (
    <div className="w-full h-[70px] bg-primary flex justify-between items-center">
      <div className="h-full flex items-center">
        <div
          className={`${
            collapse ? "w-[70px]" : "w-[220px]"
          } h-full bg-transparent transition-all duration-300`}
        />
        <button
          onClick={sidebarToggle}
          className="text-white/[0.84] text-xl h-full w-[60px] flex justify-center items-center"
        >
          {collapse ? <RiMenuUnfoldFill /> : <RiMenuFoldFill />}
        </button>
        <p className="text-white font-semibold text-lg">{shop?.title}</p>
      </div>
      <div className="flex justify-center items-center h-full px-7">
        <Link href="/profile">
          <img
            src={profile.src}
            className="w-[50px] h-[50px] rounded-full shadow-md"
            alt="profile"
          />
        </Link>
      </div>
    </div>
  );
}

export default Appbar;
