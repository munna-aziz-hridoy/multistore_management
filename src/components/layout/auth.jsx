"use client";

import { auth } from "@/firebase.init";
// react import
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loader } from "..";
import { useRouter } from "next/navigation";

function Auth({ children }) {
  const [user, loading] = useAuthState(auth);

  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth/signin");
    }
  }, [user, loading]);

  return (
    <>
      {user ? (
        children
      ) : loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader large />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <p className="text-2xl font-semibold">You need to login first</p>
          <button
            className="text-primary text-lg font-semibold  rounded-lg mt-2"
            onClick={() => router.push("/auth/signin")}
          >
            Login
          </button>
        </div>
      )}
    </>
  );
}

export default Auth;
