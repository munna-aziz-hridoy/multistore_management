"use client";

// react import
import React, { useContext, useEffect, useState } from "react";

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
import {
  useAuthState,
  useUpdateProfile,
  useUpdateEmail,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase.init";
import { ShopContext, UserContext } from "@/context";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { BsX } from "react-icons/bs";

// components

function ProfileDetails({ setIsEditing }) {
  const [user] = useAuthState(auth);

  return (
    <div className="min-w-[300px] w-1/3  bg-[#f5f5f5] opacity-90 rounded-lg flex flex-col justify-center items-center p-5 gap-2 shadow">
      <Image
        src={user?.photoURL || defaultProfile?.src}
        w={120}
        h={120}
        circle
        bg="#e9e9e9"
      />
      <h2 className="text-xl font-semibold text-black">{user?.displayName}</h2>
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center justify-center gap-2 bg-primary/10 px-2 py-1 rounded"
      >
        <p className="text-[14px]  text-primary">Edit Profile</p>
        <RiPencilLine style={{ fontSize: "20px" }} className="text-primary" />
      </button>
      <div className="h-[67px] w-full rounded-2xl bg-white p-3 mt-5">
        <p className="text-sm text-black/[0.54]">Email:</p>
        <p className="font-semibold text-black/[0.84]">{user?.email}</p>
      </div>
    </div>
  );
}

function ProfileEdit({ setIsEditing }) {
  const [userInfo, setUserInfo] = useState({
    photoURL: "",
    name: "",
    email: "",
  });
  const [is_update, setIs_update] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [user] = useAuthState(auth);
  const [updateProfile] = useUpdateProfile(auth);
  const [updateEmail] = useUpdateEmail(auth);

  useEffect(() => {
    setUserInfo({
      photoURL: user?.photoURL,
      name: user?.displayName,
      email: user?.email,
    });
  }, [user]);

  function handleUpdate() {
    if (is_update && (userInfo.name || userInfo.email)) {
      if (userInfo.name) {
        setUpdating(true);
        updateProfile({ displayName: userInfo.name }).then(() => {
          updateEmail(userInfo.email).then(() => {
            setUpdating(false);
            setIsEditing(false);
            toast.success("Profile updated successfully");
          });
        });
      }
    } else {
      toast.error("Please update the information");
    }
  }

  return (
    <div className="min-w-[300px] w-1/3  bg-[#f5f5f5] opacity-90 rounded-lg flex flex-col justify-center items-center p-5 gap-2 shadow relative">
      <button
        onClick={() => {
          setIsEditing(false);
        }}
        className="w-7 h-7 flex justify-center items-center bg-red-400 text-white font-semibold rounded-full absolute right-2 top-3 cursor-pointer"
      >
        <BsX />
      </button>
      <div className="flex items-center gap-5">
        <Image
          src={userInfo?.photoURL || defaultProfile?.src}
          w={140}
          h={140}
          circle
          bg="#e9e9e9"
        />
        {/* <div>
          <button className="w-[150px] h-[45px] rounded-lg bg-primary text-white font-semibold">
            Change photo
          </button>
          <p className="text-black/[0.54] mt-2">
            At least 500 x 500px PNG or JPG file
          </p>
        </div> */}
      </div>
      <div className="w-full rounded-2xl bg-white py-1 px-4 mt-2">
        <p className="text-sm text-black/[0.54]">Name:</p>
        <input
          className="w-full bg-white h-[30px] rounded-lg"
          value={userInfo.name}
          onChange={(e) => {
            if (e.target.value) {
              setIs_update(true);
            } else {
              setIs_update(false);
            }
            setUserInfo({ ...userInfo, name: e.target.value });
          }}
        />
      </div>
      <div className="w-full rounded-2xl bg-white py-1 px-4 mt-2">
        <p className="text-sm text-black/[0.54]">Email:</p>
        <input
          className="w-full bg-white h-[30px] rounded-lg"
          value={userInfo.email}
          onChange={(e) => {
            if (e.target.value) {
              setIs_update(true);
            } else {
              setIs_update(false);
            }
            setUserInfo({ ...userInfo, email: e.target.value });
          }}
        />
      </div>
      <button
        disabled={!is_update}
        onClick={handleUpdate}
        className="w-full h-[45px] rounded-lg bg-primary text-white font-semibold mt-2 disabled:bg-gray-500"
      >
        Save
      </button>
    </div>
  );
}

function ShopList({ isShopify = false }) {
  const { shops, setShops } = useContext(ShopContext);

  const deleteDocument = async (shop) => {
    const confirm = window.confirm("Are you sure you want to delete shop?");

    if (confirm) {
      try {
        await deleteDoc(doc(firestore, "sites", shop?.doc_id));
        const updatedShops = shops.filter((item) => item?.id !== shop?.id);
        setShops(updatedShops);

        localStorage.setItem("woo_shop_list", {
          userId: db_id,
          shops: updatedShops,
        });

        toast.success("Shop deleted successfully");
      } catch (error) {
        toast.error("Error removing document");
      }
    }
  };

  return (
    <div className="bg-[#f5f5f5] opacity-90 rounded-xl p-5 w-1/2 min-w-[461px]">
      <Image src={isShopify ? shopify.src : wordpress.src} w={161} h={36.5} />
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
                  <p className="text-black/[0.54] text-sm"> {shop?.domain}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  deleteDocument(shop);
                }}
                className=" p-2 text-[#f74747] rounded-md bg-[#f74747]/[0.07] text-xs border border-[#f74747]"
              >
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
  );
}

function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col xl:flex-row gap-5">
      {isEditing ? (
        <ProfileEdit setIsEditing={setIsEditing} />
      ) : (
        <ProfileDetails setIsEditing={setIsEditing} />
      )}

      <div className="w-2/3">
        <h2 className="text-2xl font-bold text-black/[0.84]">Shop List</h2>
        <p className="text-sm text-black/[0.54]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam
        </p>
        <div className="mt-5 flex flex-col lg:flex-row gap-5 w-full">
          <ShopList />
          {/* <ShopList isShopify /> */}
        </div>
      </div>
    </div>
  );
}

export default Profile;
