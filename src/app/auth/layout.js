"use client";

import React, { useState } from "react";

// next import
import Link from "next/link";
import { usePathname } from "next/navigation";

// import images
import logo from "@/assets/images/logo_main.png";
import logoIcon from "@/assets/images/logo_icon.png";

// components
import { Divider, Image, Loader } from "@/components";

// icons
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { useRouter } from "next/navigation";

// firebase import
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase.init";
import toast from "react-hot-toast";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

function Layout({ children }) {
  const [loading, setLoading] = useState(false);

  // next hooks

  const path = usePathname();
  const router = useRouter();

  // firebase

  const [signInWithGoogle, user, , error] = useSignInWithGoogle(auth);

  const handleGoogleSignIn = () => {
    setLoading(true);
    signInWithGoogle()
      .then((response) => {
        if (response?.user) {
          const userq = query(
            collection(firestore, "users"),
            where("email", "==", response?.user?.email)
          );

          getDocs(userq).then((snapshot) => {
            if (snapshot.empty) {
              addDoc(collection(firestore, "users"), {
                first_name: response.user.displayName.split(" ")[0],
                last_name: response.user.displayName.split(" ")[1],
                email: response.user.email,
              }).then((createdUser) => {
                setLoading(false);
                toast.success("Sign up successfully!");
                router.push("/");
              });
            } else {
              setLoading(false);
              toast.success("Sign up successfully!");
              router.push("/");
            }
          });

          router.push("/");
        } else {
          toast.error("Something went wrong");
          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error("Something went wrong");
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/2 p-8 h-full">
        <div className="flex justify-between items-center h-14">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="w-[145px] h-[50px] bg-primary rounded-lg flex justify-center items-center gap-3 border-2 border-white/[0.38] cursor-pointer"
          >
            <Image src={logoIcon.src} w={30} h={31} />
            <p className="text-white font-extrabold text-xl">StoreKool</p>
          </div>
          {path.includes("signin") ? (
            <p className="text-black/[0.38]">
              Don’t have any account?{" "}
              <Link className="text-primary font-medium" href="/auth/signup">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-black/[0.38]">
              Already have an account?{" "}
              <Link className="text-primary font-medium" href="/auth/signin">
                Sign in
              </Link>
            </p>
          )}
        </div>
        <div className="w-full h-[calc(100%-56px)] flex justify-center items-center">
          <div className="w-[391px]">
            {children}

            <Divider text={"OR"} />

            <button
              onClick={handleGoogleSignIn}
              className="w-full h-[45px] border-2 border-black/10 rounded-xl flex justify-center items-center gap-4 text-black/[0.84] font-semibold my-5"
            >
              {loading ? (
                <Loader />
              ) : (
                <p className="flex justify-center items-center gap-4">
                  <FcGoogle fontSize={28} />
                  Sign in with Google
                </p>
              )}
            </button>
          </div>
        </div>
        <p className="text-black/[0.38] text-xs">
          © 2022 WMPS. All rights reserved.
        </p>
      </div>
      <div className="hidden justify-center items-center bg-primary w-full lg:w-1/2 lg:flex">
        <div className="relative w-[313px] h-[300px]">
          <Image src={logo.src} w={313} h={110} />
          <div className="absolute bottom-2 left-[25px] w-[150%] h-2/3 bg-gradient-to-b from-[#0060e3] to-[#0060e399] opacity-95  blur-md  backdrop-filter backdrop-blur-3xl custom -translate-x-[25%] top-[68px]" />
        </div>
      </div>
    </div>
  );
}

export default Layout;
