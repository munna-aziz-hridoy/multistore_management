"use client";

// react import
import React, { useContext, useEffect, useState, Fragment } from "react";

// context import
import { ShopContext, SidebarContext, UserContext } from "@/context";

// icon import

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
import { usePathname, useRouter } from "next/navigation";

function Sidebar() {
  const [is_allowed, setIs_allowed] = useState(false);

  //  context

  const { collapse, delay } = useContext(SidebarContext);
  const { shops, loading } = useContext(ShopContext);
  const { userInfo, sites } = useContext(UserContext);

  // firebase hook

  const [signOut] = useSignOut(auth);

  // next hooks

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const allowed =
      userInfo?.license_key ||
      (!userInfo?.license_key && (!sites || sites?.length <= 1))
        ? true
        : false;

    setIs_allowed(allowed);
  }, [userInfo, sites]);

  const handleSignout = () => {
    signOut().then(() => {
      router.push("/auth/signin");
      localStorage.removeItem("woo_shop_list");
      toast.success("Sign out successfully");
    });
  };

  return (
    <div
      className={`fixed bg-primary h-screen transition-all duration-300 border-r border-white/20 ${
        collapse ? "w-[70px]" : "w-[185px]"
      }`}
    >
      <div onClick={() => router.push("/")} className="h-[75px] cursor-pointer">
        {!collapse && delay ? (
          <div className="p-[10px]">
            <Image src={logoMain.src} w={163} h={60} />
          </div>
        ) : (
          <div className="p-[18px]">
            <Image src={logo.src} w={31} h={32} />
          </div>
        )}
      </div>
      <div className="mt-[35px] h-[calc(100%-110px)]">
        {/* <p className="text-[10px] text-white/[0.54] px-[25px] uppercase">
          {collapse ? "ge." : "general"}
        </p>
        <Link href="/">
          <div
            className={`flex items-center gap-3 text-white/[0.54]  w-full h-[50px] ${
              collapse ? "p-[15px]" : "p-[25px]"
            }`}
          >
            <MdOutlineSpaceDashboard fontSize={collapse ? 26 : 22} />
            {!collapse && delay && <p className="text-[15px]">Overview</p>}
          </div>
        </Link> */}

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
                  ?.map((shop, i) => (
                    <SidebarItem key={i} name={shop?.shop_name} shop={shop} />
                  ))}
              </div>
            </div>
          </div>
        )}
        <div className="w-full h-[1px] bg-white/20 mt-3" />
        <div
          className={` flex flex-col justify-between h-[calc(100%-390px)] mt-5`}
        >
          <div>
            <Fragment>
              {is_allowed ? (
                <Link href="/add-shop">
                  <div
                    className={`flex justify-between items-center  text-white  hover:bg-[#1879ff] rounded-[10px] cursor-pointer ${
                      pathname === "/add-shop"
                        ? "bg-[#1879ff]"
                        : "bg-[#1879ff]/50"
                    }  ${
                      collapse ? "p-[12px] mx-[10px]" : "p-[10px] mx-[15px]"
                    }`}
                  >
                    {!collapse && delay && <p className="text-sm">Add Shop</p>}
                    <HiOutlinePlusCircle fontSize={22} />
                  </div>
                </Link>
              ) : (
                <div
                  onClick={() =>
                    toast.error("You are not allowed to add more shop")
                  }
                  className={`flex justify-between items-center  text-white  hover:bg-[#1879ff] rounded-[10px] cursor-pointer ${
                    pathname === "/add-shop"
                      ? "bg-[#1879ff]"
                      : "bg-[#1879ff]/50"
                  }  ${collapse ? "p-[12px] mx-[10px]" : "p-[10px] mx-[15px]"}`}
                >
                  {!collapse && delay && <p className="text-sm">Add Shop</p>}
                  <HiOutlinePlusCircle fontSize={22} />
                </div>
              )}
            </Fragment>

            <p
              className={`text-[10px] text-white/[0.54] px-[23px] uppercase mt-[50px] mb-3 ${
                collapse && "text-center px-[10px]"
              }`}
            >
              {collapse ? "ut" : "utilities"}
            </p>
            <Link href={"/profile"}>
              <div
                className={`flex items-center gap-3 text-white/[0.54] text-[15px] w-full h-[50px] p-[12px] border-l-4 ${
                  collapse && "justify-center"
                } ${
                  pathname.includes("profile")
                    ? "border-[#D1E4FF] bg-white/[0.05]"
                    : "border-transparent bg-transparent"
                }`}
              >
                <CgProfile fontSize={22} />
                {!collapse && delay && <p className="text-sm">Profile</p>}
              </div>
            </Link>
            <Link href={"/setting"}>
              <div
                className={`flex items-center gap-3 text-white/[0.54] text-[15px] w-full h-[50px] p-[12px] border-l-4 ${
                  collapse && "justify-center"
                } ${
                  pathname.includes("setting")
                    ? "border-[#D1E4FF] bg-white/[0.05]"
                    : "border-transparent bg-transparent"
                }`}
              >
                <IoSettingsOutline fontSize={22} />
                {!collapse && delay && <p className="text-sm">Setting</p>}
              </div>
            </Link>
          </div>
          <div className={collapse ? "px-[10px]" : "px-[23px]"}>
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
              {!collapse && delay && <p className="text-sm">Logout</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
