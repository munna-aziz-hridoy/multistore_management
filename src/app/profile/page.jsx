"use client";

// react import
import React, { useContext } from "react";

// image import
import defaultProfile from "@/assets/images/default_profile.png";
import wordpress from "@/assets/images/wordpress_vertical.png";
import shopify from "@/assets/images/shopify_vertical.png";

// icon import
import { RiPencilLine } from "react-icons/ri";
import { FcShop } from "react-icons/fc";
import { FaRegTrashAlt } from "react-icons/fa";

// component import
import { Image } from "@/components";

// firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase.init";
import { ShopContext } from "@/context";

function Profile() {
  const [user] = useAuthState(auth);

  const { shops } = useContext(ShopContext);

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      <div className="min-w-[300px]  bg-[#f5f5f5] opacity-90 rounded-lg flex flex-col justify-center items-center p-5 gap-2 shadow">
        <Image
          src={user?.photoURL || defaultProfile?.src}
          w={120}
          h={120}
          circle
          bg="#e9e9e9"
        />
        <h2 className="text-xl font-semibold text-black">
          {user?.displayName}
        </h2>
        <button className="flex items-center justify-center gap-2 bg-primary/10 px-2 py-1 rounded">
          <p className="text-[14px]  text-primary">Edit Profile</p>
          <RiPencilLine style={{ fontSize: "20px" }} className="text-primary" />
        </button>
        <div className="h-[67px] w-full rounded-2xl bg-white p-3 mt-5">
          <p className="text-sm text-black/[0.54]">Email:</p>
          <p className="font-semibold text-black/[0.84]">{user?.email}</p>
        </div>
      </div>

      <div className="">
        <h2 className="text-2xl font-bold text-black/[0.84]">Shop List</h2>
        <p className="text-sm text-black/[0.54]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam
        </p>
        <div className="mt-5 flex flex-col lg:flex-row gap-5 w-full">
          <div className="bg-[#f5f5f5] opacity-90 rounded-xl p-5 w-1/2 min-w-[461px]">
            <Image src={wordpress.src} w={161} h={36.5} />
            <div className="flex flex-col gap-3 mt-7">
              {shops
                ?.filter((shop) => shop?.platform !== "shopify")
                ?.map((shop) => (
                  <div className="flex items-center justify-between w-full gap-2 h-[60px] bg-white rounded-xl px-3">
                    <div className="flex items-center gap-2">
                      <FcShop
                        style={{
                          fontSize: "45px",
                        }}
                      />
                      <div>
                        <p className="text-[15px] text-black/[0.84] font-semibold">
                          {" "}
                          {shop?.title}
                        </p>
                        <p className="text-black/[0.54] text-sm">
                          {" "}
                          {shop?.domain}
                        </p>
                      </div>
                    </div>
                    <button className=" p-2 text-[#f74747] rounded-md bg-[#f74747]/[0.07] text-xs border border-[#f74747]">
                      <FaRegTrashAlt
                        style={{
                          fontSize: "20px",
                        }}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-[#f5f5f5] opacity-90 rounded-xl p-5 w-1/2 min-w-[461px]">
            <Image src={shopify.src} w={127} h={36.5} />
            <div className="flex flex-col gap-3 mt-7">
              {shops
                ?.filter((shop) => shop?.platform === "shopify")
                ?.map((shop) => (
                  <div className="flex items-center justify-between w-full gap-2 h-[60px] bg-white rounded-xl px-3">
                    <div className="flex items-center gap-2">
                      <FcShop
                        style={{
                          fontSize: "45px",
                        }}
                      />
                      <div>
                        <p className="text-[15px] text-black/[0.84] font-semibold">
                          {" "}
                          {shop?.title}
                        </p>
                        <p className="text-black/[0.54] text-sm">
                          {" "}
                          {shop?.domain}
                        </p>
                      </div>
                    </div>
                    <button className=" p-2 text-[#f74747] rounded-md bg-[#f74747]/[0.07] text-xs border border-[#f74747]">
                      <FaRegTrashAlt
                        style={{
                          fontSize: "20px",
                        }}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
