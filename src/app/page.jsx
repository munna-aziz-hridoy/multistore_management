"use client";

import React, { useContext, useEffect } from "react";
import { ShopContext } from "@/context";
import { useRouter } from "next/navigation";

function Home() {
  const { shops } = useContext(ShopContext);
  const router = useRouter();

  useEffect(() => {
    if (shops?.length > 0) {
      router.push("/profile");
    } else {
      router.push("add-shop");
    }
  }, [shops]);

  return <main></main>;
}
export default Home;
