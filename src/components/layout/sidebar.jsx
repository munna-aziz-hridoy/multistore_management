"use client";

// react import
import React, { useContext, useEffect, useState } from "react";

// context import
import { ShopContext, SidebarContext } from "@/context";

// icon import
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";

// component import
import { Image, Loader } from "@/components";

// image import
import logoMain from "@/assets/images/logo_main.png";
import logo from "@/assets/images/logo_sidebar.png";
import wordpressImg from "@/assets/images/wordpress.png";
import shopifyImg from "@/assets/images/shopify.png";
import SidebarItem from "./sidebaritems";
import Link from "next/link";
import { auth } from "@/firebase.init";

// firebase import
import { useSignOut } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function Sidebar() {
  //  context

  const { collapse, delay } = useContext(SidebarContext);
  const { shops, loading } = useContext(ShopContext);

  // firebase hook

  const [signOut] = useSignOut(auth);

  // next hooks

  const router = useRouter();

  const handleSignout = () => {
    signOut().then(() => {
      toast.success("Sign out successfully");
      router.push("/auth/login");
    });
  };

  return (
    <div
      className={`fixed bg-primary h-screen transition-all duration-300 border-r border-white/20 ${
        collapse ? "w-[70px]" : "w-[220px]"
      }`}
    >
      <div onClick={() => router.push("/")} className="h-[75px] cursor-pointer">
        {!collapse && delay ? (
          <div className="p-[10px]">
            <Image src={logoMain.src} w={143} h={50} />
          </div>
        ) : (
          <div className="p-[18px]">
            <Image src={logo.src} w={31} h={32} />
          </div>
        )}
      </div>
      <div className="mt-[35px] h-[calc(100%-110px)]">
        <p className="text-[10px] text-white/[0.54] px-[25px] uppercase">
          {collapse ? "ge." : "general"}
        </p>
        <div
          className={`flex items-center gap-3 text-white/[0.54]  w-full h-[50px] ${
            collapse ? "p-[15px]" : "p-[25px]"
          }`}
        >
          <MdOutlineSpaceDashboard fontSize={collapse ? 26 : 22} />
          {!collapse && delay && <p className="text-[15px]">Overview</p>}
        </div>
        {loading ? (
          <div className="w-full py-5 flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="max-h-[340px] overflow-auto menu_container">
            <div className="mt-[34px]">
              <p className="text-[10px] text-white/[0.54] px-[25px] uppercase flex items-center">
                <span>{collapse ? "WP" : "wordpress"}</span>
                {!collapse && <Image src={wordpressImg.src} w={40} h={40} />}
              </p>
              <div>
                {shops
                  ?.filter((shop) => shop.platform !== "shopify")
                  ?.map((shop) => (
                    <SidebarItem name={shop?.shop_name} shop={shop} />
                  ))}
              </div>
            </div>
            <div className="mt-[34px]">
              <p className="text-[10px] text-white/[0.54] px-[25px] uppercase flex items-center gap-1">
                <span>{collapse ? "SP" : "shopify"}</span>
                {!collapse && <Image src={shopifyImg.src} w={30} h={30} />}
              </p>
              <div>
                {shops
                  ?.filter((shop) => shop.platform === "shopify")
                  ?.map((shop) => (
                    <SidebarItem name={shop?.shop_name} shop={shop} />
                  ))}
              </div>
            </div>
          </div>
        )}
        <div className="w-full h-[1px] bg-white/20 mt-3" />
        <div
          className={`${
            collapse ? "p-[10px] mt-3" : "p-[23px]"
          } flex flex-col justify-between h-[calc(100%-390px)]`}
        >
          <div>
            <Link href="/add-shop">
              <div
                className={`flex justify-between items-center  text-white bg-[#1879ff] rounded-[10px] cursor-pointer ${
                  collapse ? "p-[12px]" : "p-[14px]"
                }`}
              >
                {!collapse && delay && <p>Add Shop</p>}
                <HiOutlinePlusCircle fontSize={22} />
              </div>
            </Link>

            <p
              className={`text-[10px] text-white/[0.54] px-[2px] uppercase mt-[50px] ${
                collapse && "text-center"
              }`}
            >
              {collapse ? "ut" : "utilities"}
            </p>
            <div
              className={`flex items-center gap-3 text-white/[0.54] text-[15px] w-full h-[50px] p-[2px] ${
                collapse && "justify-center"
              }`}
            >
              <CgProfile fontSize={22} />
              {!collapse && delay && <p>Profile</p>}
            </div>
            <div
              className={`flex items-center gap-3 text-white/[0.54] text-[15px] w-full h-[50px] p-[2px] ${
                collapse && "justify-center"
              }`}
            >
              <IoSettingsOutline fontSize={22} />
              {!collapse && delay && <p>Setting</p>}
            </div>
          </div>
          <div>
            <p
              className={`text-[10px] text-white/[0.54] px-[2px] uppercase mt-[50px] ${
                collapse && "text-center"
              }`}
            >
              {collapse ? "ac" : "actions"}
            </p>
            <div
              onClick={handleSignout}
              className={`flex items-center gap-3 text-white/[0.54] text-[15px] w-full h-[50px] p-[2px] cursor-pointer ${
                collapse && "justify-center"
              }`}
            >
              <TbLogout2 fontSize={22} />
              {!collapse && delay && <p>Logout</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
